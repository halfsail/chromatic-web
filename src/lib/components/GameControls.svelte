<script>
    import { gameStore } from "$lib/state/GameStore.svelte";
    import Timer from "./Timer.svelte";
    import NumberFlow from "@number-flow/svelte";
    let { getHint } = $props();

    const movesLeft = $derived(Math.max((gameStore.puzzleState.par + 5) - gameStore.puzzleState.moves, 0));
</script>

{#if gameStore.puzzleState.status !== 'won'}
<section class="controlContainer">
    {#if gameStore.settings.relaxedMode === false}
    <div class="col">
        <p class="timer"><Timer /></p>
        {#if movesLeft > 1}
        <p class="par"><NumberFlow value={movesLeft} /> swaps remaining</p>
        {:else}
        <p class="par"><NumberFlow value={gameStore.puzzleState.moves} /> swaps used</p>
        {/if}
    </div>    
    {/if}

    <button aria-label="Hint" class="iconBtn" onclick={getHint}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.97 16.9699C17.2629 16.6771 17.7377 16.6771 18.0306 16.9699L22.0306 20.9699C22.3232 21.2629 22.3234 21.7377 22.0306 22.0305C21.7378 22.3233 21.263 22.3231 20.97 22.0305L16.97 18.0305C16.6771 17.7376 16.6771 17.2628 16.97 16.9699Z" fill="var(--icon-color)"/>
            <path d="M12.7923 2.40842C13.6522 1.79586 14.6509 1.52496 15.5071 1.96702C16.362 2.40888 16.7226 3.37947 16.7239 4.4387L16.7366 7.57834C16.7372 7.68553 16.7803 7.85915 16.8851 8.04709C16.9881 8.23169 17.1126 8.3623 17.2073 8.42405L19.6058 9.92795C20.6075 10.5572 21.3899 11.449 21.2308 12.4924C21.0808 13.4743 20.1777 14.0723 19.1234 14.3821L18.9105 14.4406L15.9007 15.2004C15.792 15.2278 15.6304 15.3164 15.4739 15.4729C15.318 15.6289 15.2259 15.794 15.1956 15.9104L15.1946 15.9094L14.4368 18.9143C14.1492 20.0584 13.5368 21.0709 12.4896 21.2307C11.4465 21.3896 10.5532 20.6119 9.92512 19.6096L8.42414 17.2151C8.36345 17.1198 8.23147 16.9934 8.04426 16.8889C7.85665 16.7842 7.68359 16.7411 7.57649 16.7405L4.43684 16.7278C3.38058 16.7233 2.41164 16.3626 1.96906 15.51C1.52522 14.6545 1.79365 13.6569 2.40656 12.7961L4.08039 10.4475C4.13169 10.3737 4.19523 10.2233 4.22395 10.0246C4.25283 9.8245 4.23462 9.66027 4.20442 9.57248L4.20246 9.56663L3.07453 6.21995L3.07356 6.21799C2.73191 5.19662 2.7481 4.13635 3.44074 3.44358C4.1339 2.75054 5.1922 2.73742 6.21028 3.08225L9.55793 4.21018L9.56379 4.21213C9.65127 4.24223 9.81513 4.26003 10.015 4.23069C10.2144 4.20132 10.3676 4.13699 10.4446 4.08225L12.7923 2.40842Z" fill="var(--icon-color)"/>
        </svg>
    </button>
</section>
{/if}


<style>
    .controlContainer {
        grid-column: 1/-1;
        width: 100%;
        max-width: 350px;
        margin: 0 auto;
        padding: 0 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;
    }

    .col {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.5rem;

        .timer {
            font-weight: 600;
            font-size: 1rem;
        }
    }

    button {
        display: grid;
        place-items: center;
        border-radius: 56px;
        overflow: hidden;
        border: 1px solid transparent;
        --icon-color: light-dark(var(--grey-8), var(--grey-1));
        transition: border-radius var(--slow) var(--shoot-ease), background-color var(--slow) ease;
        transform: scale(1);
        height: 56px;
        width: 96px;

        :global(svg) {
            width: 24px;
            height: 24px;
            /* fill: var(--icon-color); */
            transition: all var(--slow) var(--shoot-ease);
        }
    }
    button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    button:active {
        transform: scale(0.9);
    }


    @media (hover: hover) {
        button:hover {
            border-radius: var(--rad-md);
            :global(svg) {
                transform: scale(1.15);
            }
        }

        button:hover {
            --icon-color: light-dark(var(--grey-9), var(--grey-1));
            background: light-dark(var(--grey-2), var(--grey-8));
            opacity: 1;
        }
    }


</style>
