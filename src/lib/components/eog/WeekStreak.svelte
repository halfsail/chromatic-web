<script>
  import { gameStore } from "$lib/state/GameStore.svelte";
  import { keyColorsForPuzzle, localDateKey } from "$lib/utils/puzzle.js";

  const todayKey = localDateKey();

  // Monday → Sunday of the current week, as local "YYYY-MM-DD" keys.
  const weekDays = (() => {
    const today = new Date();
    const offset = (today.getDay() + 6) % 7; // days since Monday
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset + i);
      return { date, key: localDateKey(date) };
    });
  })();

  // Daily wins only; random-level wins don't count toward the week. Rows from
  // before random levels have no `daily` field and are all dailies.
  // gameHistory is kept live by the store's liveQuery, so this updates on a win.
  const dailyWins = $derived(gameStore.gameHistory.filter((g) => g.won && g.daily !== false));
  const wonDates = $derived(new Set(dailyWins.map((g) => g.dateCompleted)));

  // dateCompleted → that day's key colors. History is newest-first, so the
  // first row seen for a date wins. Older rows don't store keyColors, so
  // rebuild them from the seeded puzzleId.
  const dayColors = $derived.by(() => {
    const map = new Map();
    for (const g of dailyWins) {
      if (!map.has(g.dateCompleted)) {
        map.set(g.dateCompleted, g.keyColors ?? keyColorsForPuzzle(g.puzzleId));
      }
    }
    return map;
  });
</script>

<div class="week-view">
  {#each weekDays as { date, key } (key)}
    {@const completed = wonDates.has(key)}
    {@const isToday = key === todayKey}
    {@const colors = dayColors.get(key)}
    <div
      class="day"
      class:completed
      class:today={isToday}
      class:future={key > todayKey}
      class:missed={key < todayKey && !completed}
      class:preview={colors}
      style={colors && colors.map((c, i) => `--c${i}: ${c}`).join("; ")}
    >
      <div class="indicator">
        {#if completed}
          <span class="checkmark">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="var(--onAccent, white)">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </span>
        {:else}
          <span>{date.toLocaleDateString("en", { weekday: "narrow" })}</span>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .week-view {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 0.5rem;
  }

  .day {
    --accent-color: var(--accent, var(--color2));
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: var(--text-color-secondary);

    width: 100%;
    border-radius: 12px;
    background-color: var(--surface-inset);
    display: flex;
    align-items: center;
    justify-content: center;
    /* box-shadow: inset 0 0 0 1px var(--surface-edge); */
    aspect-ratio: 1/1.2;

    span {
      font-size: var(--font-sm);
    }
  }


  .checkmark {
    display: grid;
    place-items: center;

    svg {
      width: 1rem;
      height: 1rem;
      mix-blend-mode: luminosity;
      opacity: 0.8;
    }
  }

  .future {
    opacity: 0.5;

    .indicator {
      box-shadow: none;
    }
  }

  .today span {
    font-weight: 600;
    color: var(--text-color-primary);
  }

  .today:not(.preview) .indicator {
    /* box-shadow: inset 0 0 0 2px var(--accent-color); */
    background-color: var(--surface-raised);
    transition: box-shadow 0.3s ease;
  }

  /* Same corner layout as the board's --levelGradient */
  .day.preview {
    background:
      linear-gradient(135deg, var(--c0), transparent 75.71%),
      linear-gradient(210deg, var(--c1), transparent 75.71%),
      linear-gradient(-45deg, var(--c2), transparent 75.71%),
      linear-gradient(45deg, var(--c3), transparent 75.71%);
    box-shadow: none;
  }

  .missed .indicator {
    box-shadow: none;
    /* border: dashed 1.5px var(--surface-edge); */
  }
</style>
