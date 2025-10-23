<script>
    import { gameData, nextLevel } from "$lib/state/Store.svelte";
    let { getHint, shiftColors } = $props(); 

</script>

<section class="controlContainer">
    <!-- svelte-ignore a11y_consider_explicit_label -->
     <div class="btn_col">
        <button class="round" disabled={gameData.puzzle.isAnimating} onclick={getHint}>
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 18.7089C9.5 18.2894 9.83579 17.9494 10.25 17.9494H14.25C14.6642 17.9494 15 18.2894 15 18.7089C15 19.1283 14.6642 19.4684 14.25 19.4684H10.25C9.83579 19.4684 9.5 19.1283 9.5 18.7089ZM10.1667 21.2405C10.1667 20.821 10.5025 20.481 10.9167 20.481H13.5833C13.9975 20.481 14.3333 20.821 14.3333 21.2405C14.3333 21.66 13.9975 22 13.5833 22H10.9167C10.5025 22 10.1667 21.66 10.1667 21.2405Z" fill="#fff"/>
            <path d="M7.66058 13.8283L8.76463 14.8807C9.07437 15.1759 9.25 15.5875 9.25 16.0182C9.25 16.6653 9.768 17.1899 10.407 17.1899H14.093C14.732 17.1899 15.25 16.6653 15.25 16.0182C15.25 15.5875 15.4256 15.1759 15.7354 14.8807L16.8394 13.8283C18.3806 12.3481 19.2412 10.4034 19.2499 8.3817L19.25 8.29678C19.25 4.84243 16.116 2 12.25 2C8.38401 2 5.25 4.84243 5.25 8.29678L5.25007 8.3817C5.25875 10.4034 6.11939 12.3481 7.66058 13.8283Z" fill="#fff"/>
        </svg>
    </button>
    <p class="btn_label">Hint</p>
     </div>
    
    <!-- svelte-ignore a11y_consider_explicit_label -->
     <div class="btn_col">
        <button class="round" onclick={shiftColors}>
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M22.4229 6.5C22.4229 3.87665 20.2962 1.75 17.6729 1.75C15.0495 1.75 12.9229 3.87665 12.9229 6.5C12.9229 9.12335 15.0495 11.25 17.6729 11.25C20.2962 11.25 22.4229 9.12335 22.4229 6.5Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4229 17.5C11.4229 14.8766 9.2962 12.75 6.67285 12.75C4.0495 12.75 1.92285 14.8766 1.92285 17.5C1.92285 20.1234 4.0495 22.25 6.67285 22.25C9.2962 22.25 11.4229 20.1234 11.4229 17.5Z" fill="white"/>
                <g opacity="0.5">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.92285 6.5C1.92285 3.87665 4.0495 1.75 6.67285 1.75C9.2962 1.75 11.4229 3.87665 11.4229 6.5C11.4229 9.12335 9.2962 11.25 6.67285 11.25C4.0495 11.25 1.92285 9.12335 1.92285 6.5Z" fill="white"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.9229 17.5C12.9229 14.8766 15.0495 12.75 17.6729 12.75C20.2962 12.75 22.4229 14.8766 22.4229 17.5C22.4229 20.1234 20.2962 22.25 17.6729 22.25C15.0495 22.25 12.9229 20.1234 12.9229 17.5Z" fill="white"/>
                </g>
            </svg>
        </button>
        <p class="btn_label">Rotate Hues</p>
    </div>
</section>


<style>
.controlContainer {
    width: 100%;
    max-width: 375px;
    margin: 0 auto;
    /* padding: 0 var(--sidePadding) var(--topBottomPadding) ; */
    display: flex;
    justify-content: space-evenly;
    gap: 2rem;
    
    button {
        display: grid;
        place-items: center;
        border-radius: var(--rad-round);
        height: 56px;
        aspect-ratio: 1;
        transform: scale(1);
        margin: auto;

        &:hover {
            border-radius: var(--rad-md);
        }
        &:active {
            transform: scale(0.90);
        }
        @starting-style {
            transform: scale(0);
        }
    }
}


.btn_col {
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    .btn_label {
        letter-spacing: 1px;
        opacity: 1;
        transition-delay: 500ms;

        @starting-style {
            opacity: 0;
        }
    }
}

@media (max-height: 700px) and (orientation: landscape) {
    .controlContainer {
        display: flex;
        justify-content: start;
        align-items: start;
        margin: 0;
        grid-row: 1/2;
    }
    .btn_col {
        margin: 0;
        width: fit-content;
        flex: none;

    }
}
</style>