<script>
  import { gameStore } from "$lib/state/GameStore.svelte";
  import NumberFlow from "@number-flow/svelte";

  // Re-read the store's elapsed time on a tick while running; the store
  // itself owns start/pause, this component only displays.
  let elapsedMs = $state(gameStore.elapsedMs);

  $effect(() => {
    elapsedMs = gameStore.elapsedMs; // sync on start/pause/puzzle change
    if (!gameStore.timerRunning) return;
    const interval = setInterval(() => (elapsedMs = gameStore.elapsedMs), 250);
    return () => clearInterval(interval);
  });

  const totalSecs = $derived(Math.floor(elapsedMs / 1000));
  const hrs = $derived(Math.floor(totalSecs / 3600));
  const mins = $derived(Math.floor((totalSecs % 3600) / 60));
  const secs = $derived(totalSecs % 60);
  const pad = { minimumIntegerDigits: 2 };
</script>

<span class="timer">
  {#if hrs > 0}
    <NumberFlow value={hrs} format={pad} />:
  {/if}
  <NumberFlow value={mins} format={pad} />:<NumberFlow value={secs} format={pad} />
</span>

<style>
  .timer {
    font-variant-numeric: tabular-nums;
  }
</style>
