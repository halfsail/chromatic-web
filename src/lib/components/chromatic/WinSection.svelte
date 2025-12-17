<script>
    import { gameData, nextLevel, randomPlayLevel } from "$lib/state/Store.svelte";
    import { openMenu } from "$lib/state/InterfaceState.svelte";
    import WeekStreak from "./WeekStreak.svelte";
    import { Toaster, toast } from "svelte-sonner";
    import { random } from "chroma-js";

    let isVisible = $state(document.visibilityState === "visible");
    const handleVisibilityChange = () => {
        isVisible = document.visibilityState === "visible";
    };

    function shareResults() {
        const date = formatDate(gameData.puzzle.date);
        let resultText = "";

        if (gameData.puzzle.date !== "Random") {
            resultText = "Check out Chromatic"
        } else {
            resultText = `Chromatic puzzle for ${date} in ${gameData.puzzle.moves} moves`;
            if (gameData.puzzle.hints) {
                resultText += ` using ${gameData.puzzle.hints} hints`;
            }
        }
        
        resultText += "!\n\nhttps://feyder.co/projects/chromatic";

        // Copy to clipboard
        navigator.clipboard.writeText(resultText).then(
            () => {
                toast.success("Results copied to clipboard!");
            },
            () => {
                toast.error("Failed to copy results to clipboard.");
            },
        );
    }

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

    function checkForPastDays() {
        // check the day of the current week. ex if today is wednesday it is day 3
        // then check to see if the user has completed the previous days
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
        console.log("Day of week:", dayOfWeek);
        console.log(
            "Completed Dates:",
            gameData.stats.completedDates.length,
        );
        // If today is Sunday (0), there are no past days to check
        if (gameData.stats.completedDates.length < dayOfWeek) {
            return true;
        }

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
    <div class="hideMobile">
        <WeekStreak />
    </div>
    
    <button class="gradientBtn" onclick={randomPlayLevel}>
        <div>Play Random Level</div>
    </button>
    <button class="text-button" onclick={shareResults}>Share Results</button>
    <!-- toast.success('Event has been created') -->
     <Toaster
     theme="dark"
     position="top-center"
        toastOptions={{
            style: ' border-radius: var(--rad-md);',
            duration: 750,
            class: 'my-toast',
            descriptionClass: 'my-toast-description'
        }}
/>
</section>

<style>
    .hideMobile {
        display: none;
    }




    .column {
        grid-column: 1/-1;
    }
    section {
        text-align: center;
        /* padding: 1rem 1rem 2rem 1rem; */
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


    @media (min-width: 730px) {
        .column {
            grid-column: 3/4;
            grid-row: 2/3;
            align-self: end;
            margin: 0 auto;
        }
        .hideMobile {
            display: block;
        }
    }
</style>


