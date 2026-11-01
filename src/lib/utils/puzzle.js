// puzzleGenerator.js
import { levels } from "./levels.js"; // your array of color palettes
import { getColors } from "./colorUtils.js"; // your color utility functions

export const DIFFICULTY_LEVELS = {
  easy:   { rows: 5, cols: 4, locks: 5 },
  normal: { rows: 6, cols: 5, locks: 7 },
  medium: { rows: 6, cols: 6, locks: 9 },
  hard:   { rows: 7, cols: 7, locks: 13 },
};

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fisher-Yates, returns a new array (no lock logic needed)
function shuffle(arr, rand) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffles only the unlocked values; locked ones stay at their own index.
function shuffleWithLocks(arr, rand, lockedSet) {
  const movable = arr.filter((_, i) => !lockedSet.has(i));
  const shuffled = shuffle(movable, rand);

  let s = 0;
  return arr.map((v, i) => (lockedSet.has(i) ? v : shuffled[s++]));
}

// "YYYY-MM-DD" in the player's local timezone (toISOString() would give UTC,
// rolling the day over at UTC midnight instead of local midnight).
export function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Must be the first draw from the seeded rand so keyColorsForPuzzle can
// reproduce a day's colors without generating the whole puzzle.
function pickKeyColors(rand) {
  const colorIndex = Math.floor(rand() * levels.length);
  return { colorIndex, keyColors: levels[colorIndex] };
}

// Key colors for a puzzleId like "2026-10-11-medium".
export function keyColorsForPuzzle(puzzleId) {
  const dateKey = puzzleId.slice(0, 10);
  const difficulty = puzzleId.slice(11);
  return pickKeyColors(mulberry32(hashString(`${dateKey}:${difficulty}`))).keyColors;
}

// Fewest swaps that solve a scramble: tiles minus permutation cycles.
// Each swap can put at most one extra cycle in place, and swapping a tile
// straight into its slot always does, so this is exact. Placed tiles are
// 1-cycles, so locks don't change the count.
export function minSwaps(scramble) {
  const seen = new Array(scramble.length).fill(false);
  let cycles = 0;
  for (let i = 0; i < scramble.length; i++) {
    if (seen[i]) continue;
    cycles++;
    for (let j = i; !seen[j]; j = scramble[j]) seen[j] = true;
  }
  return scramble.length - cycles;
}

// Par = minimum swaps + 5, rounded up to the next multiple of 5.
export function parFor(minMoves) {
  return Math.ceil((minMoves + 5) / 5) * 5;
}

// Star rating by swaps used over par. Each entry is the most extra swaps
// that still earns those stars; anything beyond the last entry gets 1 star.
// The last step (par + 5) matches the "swaps remaining" budget shown in play.
export const STAR_THRESHOLDS = [
  { stars: 5, maxOverPar: 0 },
  { stars: 4, maxOverPar: 2 },
  { stars: 3, maxOverPar: 4 },
  { stars: 2, maxOverPar: 5 },
];

export function starRating(moves, par) {
  const over = moves - par;
  return STAR_THRESHOLDS.find((t) => over <= t.maxOverPar)?.stars ?? 1;
}

const isSolved = (arr) => arr.every((v, i) => v === i);

const isSorted = (arr) => arr.every((v, i) => i === 0 || arr[i - 1] < v);

/**
 * @param {Date|string} date        Date object or "YYYY-MM-DD"
 * @param {string} difficulty       key of DIFFICULTY_LEVELS
 */
export function generatePuzzle(date, difficulty = "medium") {
  const cfg = DIFFICULTY_LEVELS[difficulty] ?? DIFFICULTY_LEVELS.medium;
  const { rows, cols, locks } = cfg;
  const total = rows * cols;

  const dateKey =
    typeof date === "string" ? date : localDateKey(date);
  const rand = mulberry32(hashString(`${dateKey}:${difficulty}`));

  // 1. Pick the color palette for the day
  const { colorIndex, keyColors } = pickKeyColors(rand);
  console.log(cols)
  const palette = getColors(keyColors, cols, rows); // full color matrix for rendering


  // 2. Pick locked cells (they stay in their solved position)
const allIndexes = Array.from({ length: total }, (_, i) => i);
const lockedIndexes = shuffle(allIndexes, rand)
  .slice(0, locks)
  .sort((a, b) => a - b);
const lockedSet = new Set(lockedIndexes);

// 3. Full-length scramble with locked tiles kept in place
let scramble = shuffleWithLocks(allIndexes, rand, lockedSet);
while (isSolved(scramble)) {
  scramble = shuffleWithLocks(allIndexes, rand, lockedSet);
}

const minMoves = minSwaps(scramble);
const par = parFor(minMoves);

// 4. Colors in scrambled order
// const shuffledColors = scramble.map((tile) => palette[tile]);

  // 3. Movable tiles = every index that isn't locked
  // const movable = allIndexes.filter((i) => !lockedSet.has(i));

  // // 4. Scramble them (length = rows * cols - locks)
  // let scramble = shuffle(movable, rand);
  // while (isSorted(scramble)) scramble = shuffle(movable, rand); // never start solved
  // // make new array of hexcolors  from the scramble indexes and the palette
  // let shuffledColors = [];
  // for (let i = 0; i < palette.length; i++) {
  //   shuffledColors.push(palette[scramble[i]]);
  //   console.log(palette[scramble[i]])
  // }
  
  
  console.log("puzzle generated")

  return {
    puzzleId: `${dateKey}-${difficulty}`,
    difficulty,
    rows,
    cols,
    minMoves,
    par,
    colorIndex,
    keyColors,
    palette,
    lockedIndexes,
    scramble,
    moves: 0,
    hints: 0,
    startedAt: Date.now(),
    elapsedMs: 0,
    status: "playing", // "playing" | "won" | "lost"
    completedAt: null,
  };
}

// Helper: turn the puzzle into the full board layout for rendering.
// board[cellPosition] = tile number sitting there.
export function buildBoard({ rows, cols, lockedIndexes, scramble }) {
  const lockedSet = new Set(lockedIndexes);
  let s = 0;
  return Array.from({ length: rows * cols }, (_, pos) =>
    lockedSet.has(pos) ? pos : scramble[s++],
  );
}