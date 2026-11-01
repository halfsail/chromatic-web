<script>
    import { onMount, onDestroy, tick } from "svelte";
    import { createSwapy } from "swapy";
    import { gameStore } from "$lib/state/GameStore.svelte";
    import GameControls from "./GameControls.svelte";

    let container;
    let swapy;

    const p = $derived(gameStore.puzzleState);
    const locked = $derived(new Set(p?.lockedIndexes ?? []));
    const movesLeft = $derived(Math.max((gameStore.puzzleState.par + 5) - gameStore.puzzleState.moves, 0));

    onMount(() => {
        swapy = createSwapy(container, {
            manualSwap: true,   // Svelte renders the swap, not Swapy
            swapMode: "drop",   // swap on release, not while hovering
            animation: 'spring',
        });

        // Block any swap that involves a locked cell
        swapy.onBeforeSwap(
            ({ fromSlot, toSlot }) =>
                !locked.has(Number(fromSlot)) && !locked.has(Number(toSlot)),
        );

        swapy.onSwap((event) => {
            // Same pattern as Swapy's Svelte guide: update state next frame
            requestAnimationFrame(async () => {
                const scramble = [...gameStore.puzzleState.scramble];
                for (const { slot, item } of event.newSlotItemMap.asArray) {
                    scramble[Number(slot)] = Number(item);
                }
                    if (event.draggingItem === event.toSlot) {
                        locked.add(Number(event.draggingItem))
                    }
                    if (event.swappedWithItem === event.fromSlot) {
                        locked.add(Number(event.swappedWithItem))
                    }

                const next = await gameStore.applyScramble(scramble, locked);

                // update gamestats
                if (next && next.scramble.every((tile, i) => tile === i)) {
                    console.log("Puzzle completed!");
                    await gameStore.recordGameCompletion({
                        puzzleId: next.puzzleId,
                        won: true,
                        attempts: next.moves.length,
                    });
                    // toggle appState to mode win
                }
            });
        });
    });


    function getHint() {
        console.log("Hint requested");
        // Get the current scramble and find a tile that is not in the correct position
        const scramble = [...gameStore.puzzleState.scramble];
        const correctPositions = scramble.map((tile, index) => tile === index);
        const incorrectIndexes = correctPositions.map((isCorrect, index) => (!isCorrect ? index : null)).filter(index => index !== null);
        // pick a random incorrect index
        const randomIndex = incorrectIndexes[Math.floor(Math.random() * incorrectIndexes.length)];
        // find the correct position for that tile
        const correctPosition = gameStore.puzzleState.scramble.indexOf(randomIndex);
        // swap the tile with the correct position
        [scramble[randomIndex], scramble[correctPosition]] = [scramble[correctPosition], scramble[randomIndex]];
        console.log(`Swapping tile ${randomIndex} with its correct position ${correctPosition}`);
        // check to see if correctPosition new location is correct if so add it to tempLocked
        // apply the new scramble
        const tempLocked = [...locked,randomIndex];
        console.log("Applying scramble with temporary locks:", tempLocked);
        gameStore.applyScramble(scramble, tempLocked);
    }


    onDestroy(() => swapy?.destroy());

    // When a new puzzle appears, tell Swapy to re-scan the slots/items
    $effect(() => {
        const id = p?.puzzleId;
        if (id) tick().then(() => swapy?.update());
    });
</script>

<!-- container stays mounted so Swapy's instance survives puzzle completion -->
<section
    class="board"
    bind:this={container}
    style="--colSize: {p?.cols}; --rowSize: {p?.rows};"
>

    {#if p}
        {#each p.scramble as tile, pos (pos)}
            <div class="slot" data-swapy-slot={pos} data-swapy-no-drag={locked.has(pos)}>
                {#key tile}
                    <div
                        class="swatch"
                        class:locked={locked.has(pos)}
                        data-swapy-item={tile}
                        data-swapy-no-drag={locked.has(pos)}
                        style="--background: {p.palette[tile]};"
                    >
                        {#if locked.has(pos)}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M11.9995 4.20264C13.1659 4.20264 14.285 4.666 15.1099 5.49072C15.9347 6.31557 16.3989 7.43454 16.3989 8.60107V10.3208H16.7583C18.0614 10.3209 19.1176 11.3772 19.1177 12.6802V17.438C19.1174 18.7407 18.0613 19.7982 16.7583 19.7983H7.2417C5.93878 19.7983 4.88259 18.7408 4.88232 17.438V12.6802C4.88238 11.3772 5.93868 10.3209 7.2417 10.3208H7.60107V8.60107C7.60114 7.43461 8.06439 6.31556 8.88916 5.49072C9.71396 4.66592 10.8331 4.20277 11.9995 4.20264ZM11.9995 6.20264C11.3635 6.20277 10.7529 6.45506 10.3032 6.90479C9.85352 7.35456 9.60114 7.96506 9.60107 8.60107V10.3208H14.3989V8.60107C14.3989 7.96501 14.1456 7.35458 13.6958 6.90479C13.2461 6.4552 12.6356 6.20264 11.9995 6.20264Z"
                                    fill="currentColor"
                                />
                            </svg>
                        {/if}
                    </div>
                {/key}
            </div>
        {/each}
    {/if}

</section>


<GameControls {getHint} />

<style>
    section.board {
        display: grid;
        grid-template-columns: repeat(var(--colSize), 1fr);
        grid-template-rows: repeat(var(--rowSize), 1fr);
        width: 100%;
        height: 100%;
        max-width: 350px;
        max-height: 450px;
        margin: 0 auto;
    }

    .slot {
        width: 100%;
        height: 100%;
    }
    :global(.swatch[data-swapy-dragging]) {
        border-radius: 15px;
    }

    .swatch {
        display: grid;
        place-items: center;
        width: 100%;
        height: 100%;
        background: var(--background);
        color: contrast-color(var(--background));
        /* no transform transition: Swapy animates transforms itself */
    }

    .swatch.locked {
        cursor: not-allowed;
        pointer-events: none;
    }
    .locked svg {
        width: 18px;
        height: 18px;
        opacity: 0.75;
        mix-blend-mode: luminosity;
    }

    .swatch:not(.locked) {
        cursor: grab;
    }

    :global([data-swapy-highlighted]) {
        outline: 1px solid rgb(0,0,0,0.25);
        outline-offset: -1px;
    }
</style>