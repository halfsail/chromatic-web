<script>
    import { gameData, nextLevel, getTodayDate } from "$lib/state/Store.svelte";
    import { onMount } from "svelte";
    import RoundBtn from "../buttons/RoundBtn.svelte";
    const { toggleMenu } = $props();

    let longDate = $state();

    function formatDate(dateString) {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
        };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    }
    onMount(() => {
      longDate = formatDate(gameData.puzzle.date)
    })
    $effect(() => {
        // This effect runs whenever gameData.puzzle.date changes
        longDate = formatDate(gameData.puzzle.date)
    })
</script>

<nav>
    <div class="wideScreen">
    <RoundBtn
        type="subtle"
        onclick={() => toggleMenu("sidebar")}
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

    <div class="wideScreen">
    <RoundBtn
        label="Rules"
        type="subtle"
        onclick={() => toggleMenu("help")}
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

    {#if gameData.puzzle.date !== "Random" && !gameData.puzzle.completed}
    <p class="dateText">
        <span>{longDate}</span>
        {#if formatDate(gameData.puzzle.date) !== formatDate(new Date())}
            <button onclick={ () => nextLevel()}>Play Today's Game.</button>
        {/if}
    </p>
    {/if}
</nav>

<style>
    nav {
        grid-column: 1/-1;
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
    .wideScreen {
        display: block;
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

    @media (min-width: 730px) {
        nav {
            width: 100%;
            max-width: initial;
            justify-self: start;
            grid-column: 2/3;
        }

        .wideScreen {
            display: none;
        }
    }
</style>
