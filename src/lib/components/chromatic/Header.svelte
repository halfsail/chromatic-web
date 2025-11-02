<script>
    import { gameData, nextLevel, getTodayDate } from "$lib/state/Store.svelte";
    export let toggleMenu;

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
</script>

<nav>
    <header>
        <div class="leftSide">
            <button
                class="portrait_btn"
                aria-label="menu"
                onclick={() => toggleMenu("sidebar")}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M20.75 7C20.75 7.41421 20.4142 7.75 20 7.75L4 7.75C3.58579 7.75 3.25 7.41421 3.25 7C3.25 6.58579 3.58579 6.25 4 6.25L20 6.25C20.4142 6.25 20.75 6.58579 20.75 7Z"
                        fill="var(--ink-800)"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M20.75 12C20.75 12.4142 20.4142 12.75 20 12.75L4 12.75C3.58579 12.75 3.25 12.4142 3.25 12C3.25 11.5858 3.58579 11.25 4 11.25L20 11.25C20.4142 11.25 20.75 11.5858 20.75 12Z"
                        fill="var(--ink-800)"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M20.75 17C20.75 17.4142 20.4142 17.75 20 17.75L4 17.75C3.58579 17.75 3.25 17.4142 3.25 17C3.25 16.5858 3.58579 16.25 4 16.25L20 16.25C20.4142 16.25 20.75 16.5858 20.75 17Z"
                        fill="var(--ink-800)"
                    />
                </svg>
            </button>
        </div>
        <h1>Chromatic</h1>
        <div class="rightSide">
            <button
                class="portrait_btn"
                aria-label="rules"
                onclick={() => toggleMenu("help")}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="var(--ink-800)"
                        stroke-width="1.5"
                    />
                    <path
                        d="M10.125 8.875C10.125 7.83947 10.9645 7 12 7C13.0355 7 13.875 7.83947 13.875 8.875C13.875 9.56245 13.505 10.1635 12.9534 10.4899C12.478 10.7711 12 11.1977 12 11.75V13"
                        stroke="var(--ink-800)"
                        stroke-width="1.5"
                        stroke-linecap="round"
                    />
                    <circle cx="12" cy="16" r="1" fill="var(--ink-800)" />
                </svg>
            </button>
        </div>
    </header>
    <p class="dateText">
        <span>{formatDate(gameData.puzzle.date)}</span>
        {#if formatDate(gameData.puzzle.date) !== formatDate(new Date())}
            <button onclick={nextLevel}>Play Today's Game.</button>
        {/if}
    </p>
</nav>

<style>
    header {
        display: grid;
        justify-content: space-between;
        align-items: center;
        grid-template-columns: 1fr 2fr 1fr;
        /* padding: var(--topBottomPadding) var(--sidePadding) 0; */
        color: var(--ink-900);
        width: 100%;
    }
    nav {
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
        p {
            text-align: center;
            margin: 0;
            font-size: var(--font-sm);
            font-weight: 300;
            letter-spacing: 1px;
            color: var(--ink-500);
        }
    }
    h1 {
        margin: 0;
        font-size: var(--font-lg);
        justify-self: center;
    }
    button {
        all: unset;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        svg {
            opacity: 0.55;
        }
    }
    button:hover {
        background-color: var(--ink-100);
        border-radius: var(--rad-md);

        svg {
            opacity: 1;
        }
    }
    button:active {
        transform: scale(0.9);
        svg {
            transform: scale(1.1);
        }
    }

    .rightSide,
    .leftSide {
        display: flex;
    }
    .leftSide {
        justify-self: start;
    }
    .rightSide {
        justify-self: end;
    }

    .dateText {
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
            color: var(--ink-900);
            border-bottom: 1px solid transparent;
            transition: all 150ms ease;
            text-decoration: underline;
            text-underline-offset: 3px;
            text-decoration-thickness: 2px;
            text-decoration-color: var(--ink-300);

            &:hover {
                text-decoration-color: var(--ink-900);
            }
            &:active {
                text-underline-offset: 1px;
            }
        }

        @starting-style {
            opacity: 0;
        }
    }

    @media (orientation: landscape) {
        nav {
            width: 100%;
            max-width: initial;
            justify-self: start;
            grid-column: 1/-1;
            padding: 1rem;
        }
        header {
            justify-content: space-between;
            align-items: center;
            text-align: left;
            grid-column: 1/-1;
            margin-bottom: 0.5rem;
        }
        .portrait_btn {
            display: none;
        }
    }

    /*@media (max-height: 700px) and (orientation: landscape) {
        header {
            justify-content: start;
            align-items: center;
            text-align: left;
            grid-template-columns: auto 2fr 1fr;
            h1 {
                justify-self: start;
            }
        }
        nav {
            max-width: initial;
        }
        .dateText {
            justify-content: start;
            text-align: left;
            padding-left: 48px;
        }
    }*/
</style>
