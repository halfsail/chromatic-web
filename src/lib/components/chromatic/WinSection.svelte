<script>
    import { gameData, nextLevel } from "$lib/state/Store.svelte";

    let isVisible = $state(document.visibilityState === "visible");
    const handleVisibilityChange = () => {
        isVisible = document.visibilityState === "visible";
    };

    function formatDate(dateString) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    }

    const listOfWinMessages = [
        "Amazing",
        "Incredible",
        "Fantastic",
        "Brilliant",
        "Spectacular",
        "Outstanding",
        "Marvelous",
        "Phenomenal",
        "Stupendous",
        "Remarkable",
    ];

    function getRandomWinMessage() {
        const index = Math.floor(Math.random() * listOfWinMessages.length);
        return listOfWinMessages[index];
    }

    // Run a side effect when the component is created.
    $effect(() => {
        // Add the event listener.
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // This is the cleanup function that removes the listener when the effect ends.
        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
        };
    });
</script>

<section class="column">
    <!-- win message -->
    <div class="textColumn">
        <h2>{getRandomWinMessage()}</h2>
        <p class="formatPretty">
            You completed today's puzzle in {gameData.puzzle.moves} moves
            {#if gameData.puzzle.hints}
                and using {gameData.puzzle.hints} hints
            {/if}
        </p>
    </div>

    <!-- share button -->
    {#if gameData.puzzle.date !== new Date()
            .toISOString()
            .split("T")[0] && gameData.puzzle.completed && isVisible === true}
        <button onclick={nextLevel}>Play Today's Puzzle</button>
    {:else}
        <button disabled>New Puzzle Tomorrow</button>
    {/if}
</section>

<style>
    .column {
        grid-column: 3/-1;
    }
    section {
        text-align: center;
        padding: 1rem 1rem 2rem 1rem;
        width: 100%;
        max-width: 400px;
        margin: auto;
    }

    h2 {
        margin: 0;
        font-size: var(--font-lg);
    }

    .textColumn {
        display: flex;
        flex-direction: column;
        gap: 0.5lh;
        margin-bottom: 1rem;
        p,
        h2 {
            margin: 0;
            text-wrap: pretty;
        }
    }

    button {
        all: unset;
        background-color: black;
        color: white;
        border-radius: var(--rad-xxl);
        height: 56px;
        width: 100%;
        transition: all var(--slow) var(--shoot-ease);
    }
    :global(button:disabled) {
        background-color: var(--ink-200);
        color: var(--ink-700);
        cursor: not-allowed;
    }
    button:hover {
        border-radius: 20px;
        cursor: pointer;
    }
    button:active {
        transform: scale(0.95);
    }
</style>
