import { liveQuery } from "dexie";
import { db } from "./db.js";
import { ACHIEVEMENTS } from "./achievements.js";
import { generatePuzzle, localDateKey, starRating } from "$lib/utils/puzzle.js";

// puzzleState rows: today's daily puzzle lives in "current" (the id predates
// random levels) and a random past-day level in "random". `activeSlot` picks
// which one the UI shows, so a random level never overwrites daily progress.
export const DAILY = "current";
export const RANDOM = "random";
const RANDOM_RANGE_DAYS = 365; // random levels come from the past year

const DEFAULT_STATS = {
  id: "stats",
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  winPercentage: 0,
  totalTimeMs: 0,
  lastPlayedDate: null,
  updatedAt: Date.now(),
  dirty: false,
};

const DEFAULT_SETTINGS = {
  id: "settings",
  theme: "system",
  soundEnabled: true,
  hapticEnabled: true,
  puzzleSize: "medium",
  relaxedMode: false,
  activePuzzle: DAILY, // slot to reopen on load
  updatedAt: Date.now(),
  dirty: false,
};


class GameStore {
  stats = $state({ ...DEFAULT_STATS });
  settings = $state({ ...DEFAULT_SETTINGS });
  // Both saved puzzles, kept in sync with the DB. Use `puzzleState` for the active one.
  slots = $state({ [DAILY]: null, [RANDOM]: null });
  activeSlot = $state(DAILY);
  achievements = $state([]); // unlocked rows only
  gameHistory = $state([]);
  loading = $state(true);

  // Timestamp the timer last (re)started, or null while paused/not started.
  // Kept in memory only; time is folded into puzzleState.elapsedMs on pause/save.
  timerStartedAt = $state(null);

  #subs = [];
  #onVisibility = () => (document.hidden ? this.pauseTimer() : this.resumeTimer());
  #onPageHide = () => this.pauseTimer();

  // Call once, e.g. in your root layout's onMount.
  init() {
    if (this.#subs.length) return; // already initialized

    this.#subs.push(
      liveQuery(() => db.stats.get("stats")).subscribe({
        next: (val) => (this.stats = val ?? { ...DEFAULT_STATS }),
        error: (err) => console.error("stats liveQuery error", err),
      }),
    );

    this.#subs.push(
      liveQuery(() => db.settings.get("settings")).subscribe({
        next: (val) => (this.settings = val ?? { ...DEFAULT_SETTINGS }),
        error: (err) => console.error("settings liveQuery error", err),
      }),
    );

    this.#subs.push(
      liveQuery(() => db.puzzleState.bulkGet([DAILY, RANDOM])).subscribe({
        next: ([daily, random]) => {
          this.slots[DAILY] = daily ?? null;
          this.slots[RANDOM] = random ?? null;
        },
        error: (err) => console.error("puzzleState liveQuery error", err),
      }),
    );

    this.#subs.push(
      liveQuery(() => db.achievements.toArray()).subscribe({
        next: (val) => (this.achievements = val),
        error: (err) => console.error("achievements liveQuery error", err),
      }),
    );

    this.#subs.push(
      liveQuery(() =>
        db.gameHistory.orderBy("dateCompleted").reverse().limit(50).toArray(),
      ).subscribe({
        next: (val) => (this.gameHistory = val),
        error: (err) => console.error("gameHistory liveQuery error", err),
      }),
    );

    document.addEventListener("visibilitychange", this.#onVisibility);
    window.addEventListener("pagehide", this.#onPageHide);

    this.loading = false;
  }

  // Call in onDestroy of whatever component owns the store's lifetime
  // (or skip it if the store lives for the whole app session).
  destroy() {
    this.#subs.forEach((s) => s.unsubscribe());
    this.#subs = [];
    document.removeEventListener("visibilitychange", this.#onVisibility);
    window.removeEventListener("pagehide", this.#onPageHide);
  }

  // The puzzle on screen: today's daily or the random level.
  get puzzleState() {
    return this.slots[this.activeSlot];
  }

  set puzzleState(value) {
    this.slots[this.activeSlot] = value;
  }

  get isRandomLevel() {
    return this.activeSlot === RANDOM;
  }

  // ---- Timer ----
  // Total play time = saved elapsedMs + the currently running segment.
  get elapsedMs() {
    const saved = this.puzzleState?.elapsedMs ?? 0;
    return this.timerStartedAt ? saved + (Date.now() - this.timerStartedAt) : saved;
  }

  get timerRunning() {
    return this.timerStartedAt !== null;
  }

  // Rows saved before `status` existed count as in progress.
  get isPlaying() {
    return (this.puzzleState?.status ?? "playing") === "playing";
  }

  get isWon() {
    return this.puzzleState?.status === "won";
  }

  startTimer() {
    if (this.timerStartedAt || !this.puzzleState || !this.isPlaying || document.hidden) return;
    this.timerStartedAt = Date.now();
  }

  // Resume only if the game is underway (at least one swap made).
  resumeTimer() {
    if (this.puzzleState?.moves > 0) this.startTimer();
  }

  // Fold the running segment into elapsedMs and persist it.
  async pauseTimer() {
    if (!this.timerStartedAt) return;
    const elapsedMs = this.elapsedMs;
    this.timerStartedAt = null;
    const next = { ...$state.snapshot(this.puzzleState), elapsedMs };
    this.puzzleState = next;
    await this.savePuzzleState(next);
  }

  // Returns the total elapsed time, restarting the running segment from now.
  #takeElapsed() {
    const elapsedMs = this.elapsedMs;
    if (this.timerStartedAt) this.timerStartedAt = Date.now();
    return elapsedMs;
  }

  isUnlocked(key) {
    return this.achievements.some((a) => a.key === key);
  }

  // Reads the stored row rather than this.settings, which still holds the
  // defaults until the settings liveQuery first fires.
  async updateSettings(patch) {
    const current = (await db.settings.get("settings")) ?? DEFAULT_SETTINGS;
    await db.settings.put({
      ...current,
      ...patch,
      id: "settings",
      updatedAt: Date.now(),
      dirty: true,
    });
  }

  // ---- Loading puzzles ----

  // App entry point (call on mount). Reopens a random level started today if
  // that was the last thing open, otherwise today's daily puzzle.
  // `force` replaces today's daily with a fresh copy.
  async startNewPuzzle({ force = false } = {}) {
    if (!force) {
      const settings = await db.settings.get("settings");
      const random = await db.puzzleState.get(RANDOM);
      if (settings?.activePuzzle === RANDOM && random?.startedOn === localDateKey()) {
        return this.#activate(RANDOM, random);
      }
    }
    return this.playDaily({ force });
  }

  // Today's daily puzzle. Restores saved progress (or the finished state, so the
  // end screen stays up) unless `force` is set or the day has changed.
  async playDaily({ force = false } = {}) {
    await this.pauseTimer();
    const today = localDateKey();
    const saved = await db.puzzleState.get(DAILY);
    if (!force && saved?.puzzleId.startsWith(today)) return this.#activate(DAILY, saved);

    const puzzle = { ...generatePuzzle(today, await this.#puzzleSize()), id: DAILY };
    await this.savePuzzleState(puzzle, DAILY);
    return this.#activate(DAILY, puzzle);
  }

  // A random earlier day's puzzle at the current difficulty. Played in its own
  // slot so today's daily is kept; its wins don't count toward the streak.
  async playRandomLevel() {
    await this.pauseTimer();
    const date = new Date();
    date.setDate(date.getDate() - 1 - Math.floor(Math.random() * RANDOM_RANGE_DAYS));
    const puzzle = {
      ...generatePuzzle(localDateKey(date), await this.#puzzleSize()),
      id: RANDOM,
      startedOn: localDateKey(), // random levels only reopen on the day they were started
    };
    await this.savePuzzleState(puzzle, RANDOM);
    return this.#activate(RANDOM, puzzle);
  }

  // Restart the puzzle on screen from its original scramble, clearing moves,
  // hints, time and any finished state.
  async retryLevel() {
    const cur = this.puzzleState;
    if (!cur) return null;
    await this.pauseTimer();
    const slot = this.activeSlot;
    const puzzle = {
      ...generatePuzzle(cur.puzzleId.slice(0, 10), cur.difficulty),
      id: slot,
      startedOn: cur.startedOn,
    };
    await this.savePuzzleState(puzzle, slot);
    return this.#activate(slot, puzzle);
  }

  // Callers pause the timer first so time is saved on the puzzle being left.
  async #activate(slot, puzzle) {
    this.timerStartedAt = null;
    this.slots[slot] = puzzle;
    this.activeSlot = slot;
    if ((await db.settings.get("settings"))?.activePuzzle !== slot) {
      await this.updateSettings({ activePuzzle: slot });
    }
    this.resumeTimer(); // no-op unless a saved game was already underway
    return this.puzzleState;
  }

  async #puzzleSize() {
    return ((await db.settings.get("settings")) ?? DEFAULT_SETTINGS).puzzleSize;
  }

  async savePuzzleState(state, slot = this.activeSlot) {
    await db.puzzleState.put({
      ...state,
      id: slot,
      updatedAt: Date.now(),
      dirty: true,
    });
  }

  // `hint`: the swap came from the hint button; counted in `hints` as well as `moves`.
  async applyScramble(scramble, locks, { hint = false } = {}) {
  // $state.snapshot: IndexedDB can't structured-clone a Svelte proxy
  if (!this.isPlaying) return null;
  const cur = $state.snapshot(this.puzzleState);
  const changed = scramble.flatMap((t, i) => (t !== cur.scramble[i] ? [i] : []));
  if (!changed.length) return null;
  this.startTimer(); // timer begins on the first swap
    // if the length checks passes then the locks have also changed
  const next = {
    ...cur,
    scramble,
    lockedIndexes: locks,
    // shuffledColors: scramble.map((t) => cur.palette[t]),
    moves: cur.moves + 1,
    hints: (cur.hints ?? 0) + (hint ? 1 : 0),
    elapsedMs: this.#takeElapsed(),
  };
  this.puzzleState = next;          // update the UI immediately
  await this.savePuzzleState(next); // persist
  return next;
}

  async clearPuzzleState() {
    await db.puzzleState.delete(this.activeSlot);
  }


  // The main entry point: call this when a puzzle is finished.
  // Marks puzzleState as finished (kept so the end-game screen survives reloads
  // until the next day or a forced new game). Only wins are added to
  // gameHistory; a loss just marks the puzzle finished.
  // timeMs defaults to the timer's total; the timer stops either way.
  async recordGameCompletion({ won, timeMs = this.elapsedMs }) {
    if (!this.isPlaying) return; // already recorded
    this.timerStartedAt = null;
    const now = Date.now();
    const dateCompleted = localDateKey();
    const slot = this.activeSlot;
    const cur = $state.snapshot(this.puzzleState);
    const stars = won ? starRating(cur.moves, cur.par) : 0;

    const finished = {
      ...cur,
      id: slot,
      status: won ? "won" : "lost",
      stars,
      elapsedMs: timeMs,
      completedAt: now,
      updatedAt: now,
      dirty: true,
    };
    this.puzzleState = finished; // flip the UI to the end-game screen immediately

    const gameRow = {
      puzzleId: cur.puzzleId,
      keyColors: cur.keyColors,
      dateCompleted,
      daily: slot === DAILY, // only daily wins count toward streaks and the week view
      won,
      attempts: cur.moves,
      hints: cur.hints ?? 0,
      par: cur.par,
      minMoves: cur.minMoves,
      stars,
      timeMs,
      updatedAt: now,
      dirty: true,
    };

    await db.transaction(
      "rw",
      db.puzzleState,
      db.gameHistory,
      db.stats,
      db.achievements,
      async () => {
        // Check the stored row, not just memory: liveQuery can briefly hand back
        // a stale "playing" row, which would let a second call slip through.
        const saved = await db.puzzleState.get(slot);
        if (saved?.puzzleId !== cur.puzzleId || (saved.status ?? "playing") !== "playing") return;
        await db.puzzleState.put(finished);
        if (!won) return;
        await db.gameHistory.add(gameRow);
        if (!gameRow.daily) return;
        const newStats = await this.#recomputeStats(dateCompleted);
        await db.stats.put(newStats);
        await this.#checkAchievements(newStats, gameRow);
      },
    );
  }



  // Rebuilds the stats singleton from daily history (rows from before random
  // levels have no `daily` field and are all dailies). Also useful as a
  // standalone "repair" call if the aggregate ever drifts.
  async #recomputeStats(dateCompleted) {
    const all = (await db.gameHistory.toArray()).filter((g) => g.daily !== false);
    const gamesPlayed = all.length;
    const gamesWon = all.filter((g) => g.won).length;
    const totalTimeMs = all.reduce((sum, g) => sum + (g.timeMs ?? 0), 0);

    const sorted = [...all].sort((a, b) => a.dateCompleted.localeCompare(b.dateCompleted));

    let currentStreak = 0;
    let maxStreak = 0;
    let prevDate = null;

    for (const g of sorted) {
      if (!g.won) {
        currentStreak = 0;
        prevDate = g.dateCompleted;
        continue;
      }
      if (prevDate) {
        const diffDays = Math.round((new Date(g.dateCompleted) - new Date(prevDate)) / 86_400_000);
        if (diffDays === 0) continue; // replayed the same day
        currentStreak = diffDays === 1 ? currentStreak + 1 : 1;
      } else {
        currentStreak = 1;
      }
      maxStreak = Math.max(maxStreak, currentStreak);
      prevDate = g.dateCompleted;
    }

    return {
      id: "stats",
      gamesPlayed,
      gamesWon,
      currentStreak,
      maxStreak,
      winPercentage: gamesPlayed ? Math.round((gamesWon / gamesPlayed) * 1000) / 10 : 0,
      totalTimeMs,
      lastPlayedDate: dateCompleted,
      updatedAt: Date.now(),
      dirty: true,
    };
  }

  async #checkAchievements(stats, lastGame) {
    for (const ach of ACHIEVEMENTS) {
      const already = await db.achievements.get(ach.key);
      if (!already && ach.check(stats, lastGame)) {
        await db.achievements.put({
          key: ach.key,
          unlockedAt: Date.now(),
          updatedAt: Date.now(),
          dirty: true,
        });
        // hook your "achievement unlocked!" toast/animation here
      }
    }
  }
}

// Single shared instance — import this wherever you need game data.
export const gameStore = new GameStore();
