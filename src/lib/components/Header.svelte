<script>
    import { gameStore } from "$lib/state/GameStore.svelte";
    import { onMount } from "svelte";
    import RoundBtn from "./buttons/RoundBtn.svelte";

    let longDate = $state();

    // function formatDate(dateString) {
    //     const options = {
    //         year: "numeric",
    //         month: "long",
    //         day: "numeric",
    //         timeZone: "UTC",
    //     };
    //     const date = new Date(dateString);
    //     return date.toLocaleDateString(undefined, options);
    // }

    function getDate(id) {
      // take puzzleID. Take date and reformat it
      const string = id.slice(0,10);
      const [year, month, day] = string.split("-");
      const date = new Date(Date.UTC(year, month - 1, day));
      const formatted = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC"
      }).format(date).toLowerCase();

      return formatted
    }
    onMount(() => {
      let longDate = getDate(gameStore.puzzleState.puzzleId)
    })
    $effect(() => {
        // This effect runs whenever puzzle.date changes
        longDate = getDate(gameStore.puzzleState.puzzleId)
    })
</script>

<nav>
    <div>
    <RoundBtn
        type="subtle"
    >
      {#snippet icon()}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 5L20 5" stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M4 12L20 12" stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M4 19L20 19" stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
      {/snippet}
    </RoundBtn>
    </div>

    <h1>Chromatic</h1>

    <div>
    <RoundBtn
        label="Rules"
        type="subtle"
    >
    {#snippet icon()}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="var(--icon-color)" stroke-width="1.5"/>
            <path d="M10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9C14 9.39815 13.8837 9.76913 13.6831 10.0808C13.0854 11.0097 12 11.8954 12 13V13.5" stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M11.992 17H12.001" stroke="var(--icon-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    {/snippet}
    </RoundBtn>
    </div>

    <p class="dateText">
        <span>{gameStore.puzzleState.difficulty}</span> <span>{longDate}</span>
    </p>

</nav>

<style>
    nav {
        width: 100%;
        max-width: 450px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: auto 1fr auto;
        grid-template-rows: 48px auto;
        align-items: center;
        align-self: start;
        p {
            text-align: center;
            margin: 0;
            font-size: var(--font-sm);
            letter-spacing: 1px;
            color: var(--text-color-secondary);
            /*color: light-dark(var(--grey-6), var(--grey-5));*/
        }
    }
    span {
        text-transform: capitalize;
    }
    h1 {
        grid-column: 2/3;
        margin: 0;
        font-size: var(--font-lg);
        justify-self: center;
    }

    .dateText {
        grid-column: 1/-1;
        display: flex;
        gap: 0.75rem;
        align-items: center;
        text-align: center;
        justify-content: center;
        transition: all 150ms ease;
        transition-delay: 100ms;
        transform: translateY(-8px);

        button {
            all: unset;
            cursor: pointer;
            font-size: var(--font-sm);
            font-weight: 500;
            color: var(--text-color-primary);
            border-bottom: 1px solid transparent;
            transition: all 150ms ease;
            text-decoration: underline;
            text-underline-offset: 3px;
            text-decoration-thickness: 2px;
            text-decoration-color: light-dark(var(--grey-5), var(--grey-7));

            &:hover {
                text-decoration-color: light-dark(var(--grey-9), var(--grey-1));
            }
            &:active {
                text-underline-offset: 1px;
            }
        }

        @starting-style {
            opacity: 0;
        }
    }

</style>
