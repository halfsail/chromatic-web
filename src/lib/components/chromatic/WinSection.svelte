<script>
    import { puzzle, nextLevel, randomPlayLevel } from "$lib/state/Store.svelte";
    import { openMenu } from "$lib/state/InterfaceState.svelte";
    import WeekStreak from "./WeekStreak.svelte";
    import { Toaster, toast } from "svelte-sonner";
    import { random } from "chroma-js";
    import PillBtn from "../buttons/PillBtn.svelte";
    import LinkBtn from "../buttons/LinkBtn.svelte";


    function shareResults() {
        const date = formatDate(puzzle.date);
        let resultText = "";

        if (puzzle.date == "Random") {
            resultText = "Check out Chromatic"
        } else {
            resultText = `Chromatic puzzle for ${date} in ${puzzle.moves} moves`;
            if (puzzle.hints) {
                resultText += ` using ${puzzle.hints} hints`;
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

</script>

<section class="column">
    <!-- win message -->
    <div class="textColumn">
        <h2>{getRandomWinMessage()}</h2>
        <p class="formatPretty">
            You completed today's puzzle in {puzzle.moves} moves
            {#if puzzle.hints}
                and using {puzzle.hints} hints
            {/if}
        </p>
    </div>
    <div class="hideMobile extraSidePadding">
        <WeekStreak />
    </div>

    <PillBtn label="play Random Level" onclick={randomPlayLevel} />
    <div class="row">
      <div class="hideWideScreen">
        <LinkBtn label="See Weekly Streak" onclick={() => openMenu('sidebar')} />
      </div>
      <LinkBtn label="Share Game" onclick={shareResults} />
    </div>

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

  .extraSidePadding {
    padding: 0 1.5rem;
  }

  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .row {
    display: flex;
    width: 100%;
    justify-content: space-around;
    margin: .25rem 0;
    padding: 0 1rem;
  }
  .hideWideScreen {
    display: block;
  }
    .hideMobile {
        display: none;
        width: inherit;
    }
    .column {
        grid-column: 1/-1;
    }
    section {
        text-align: center;
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
        margin: 1rem 0;
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
        .hideWideScreen {
          display: none;
        }
    }
</style>
