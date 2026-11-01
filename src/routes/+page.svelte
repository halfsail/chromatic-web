<script>
import { onMount } from 'svelte';

import { gameStore } from "$lib/state/GameStore.svelte";
import GameBoard from '$lib/components/GameBoard.svelte';
import NewBoard from '$lib/components/NewBoard.svelte';
import Header from '$lib/components/Header.svelte';
import EOG from '$lib/components/eog/EOG.svelte';

  onMount(async () => {
    gameStore.init();
    await gameStore.startNewPuzzle();
  });

</script>

<main>
{#if gameStore.puzzleState}
<Header />
<!-- NewBoard sets its colors and draggables on mount, so remount it for each
     new puzzle (switching levels or retrying). -->
{#key `${gameStore.activeSlot}:${gameStore.puzzleState.startedAt}`}
  <NewBoard />
{/key}
{#if gameStore.isWon}

  <EOG />
{/if}
{:else}
  <p>Loading…</p>
{/if}
</main>


<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        width: 100%;
        padding: 1rem var(--sidePadding);
        gap: var(--boardGaps);
        color: var(--text-color);
        filter: hue-rotate(var(--hueRotate, 0deg));
    }
</style>
