<script>
    import { version } from "$app/environment";
    import {
        gameData,
        toggleHaptic,
        toggleSound,
    } from "$lib/state/Store.svelte";
    import {
        uiState,
        closeMenu,
        openMenu,
    } from "$lib/state/InterfaceState.svelte";
    import Toggle from "./Toggle.svelte";

    let dialog; // HTMLDialogElement

    $effect(() => {
        if (dialog) {
            if (uiState.modals.sidebar && !dialog.open) {
                dialog.showModal();
            } else if (!uiState.modals.sidebar && dialog.open) {
                dialog.close();
            }
        }
    });

    function handleClose() {
        closeMenu("sidebar");
    }

    function handleClick(event) {
        if (event.target === dialog) {
            handleClose();
        }
    }

    function openHelp() {
        closeMenu("sidebar");
        openMenu("help");
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
    bind:this={dialog}
    onclose={handleClose}
    onclick={handleClick}
    class="modal"
>
    <div
        class="dialog_container main-dialog fixedWidth"
        role="dialog"
        aria-labelledby="dialog-title"
        onclick={(event) => event.stopPropagation()}
    >
        <div class="modalHeader">
            <img src="/favicon.svg" alt="" />
            <h2>Chromatic</h2>
            <p class="versionPill">{version}</p>
            <p>A casual color puzzle game about organizing gradients.</p>
            <p class="madeBy">
                <span>Game by</span> <a href="https://feyder.co">Feyder</a>
            </p>
        </div>
    </div>
    <div
        class="dialog_container fixedWidth"
        role="dialog"
        aria-labelledby="dialog-title"
        onclick={(event) => event.stopPropagation()}
    >
        <ul>
            <li>
                <button class="listBtn" onclick={openHelp}>
                    <span>How to Play</span>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M5 12H19"
                            stroke="var(--ink-900)"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M12 5L19 12L12 19"
                            stroke="var(--ink-900)"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </button>
            </li>
            <li>
                <Toggle
                    label="Sound Effects"
                    name="sound"
                    bind:checked={gameData.settings.soundEnabled}
                    toggle={toggleSound}
                />
            </li>
            <li>
                <Toggle
                    label="Haptics"
                    name="haptic"
                    bind:checked={gameData.settings.hapticEnabled}
                    toggle={toggleHaptic}
                />
            </li>
        </ul>
    </div>
    <button
        type="button"
        aria-label="Close help dialog"
        class="closeButton"
        onclick={handleClose}
    >
        <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6 6.28223L17.5 17.7822M17.5 6.28223L6 17.7822"
                stroke="white"
                stroke-width="2.5"
            />
        </svg>
    </button>
</dialog>

<style>
    .main-dialog {
        view-transition-name: main-modal;
    }

    dialog {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        border: none;
        padding: 1rem 0;
        margin: auto;
        max-height: 90dvh;
        max-width: 90vw;
        background-color: transparent;
        transition-behavior: allow-discrete;
        transform-origin: bottom center;
        overflow: hidden;
        --duration: 250ms;

        transition:
            translate var(--duration) var(--spring-glide),
            scale var(--duration) var(--spring-glide),
            filter var(--duration) var(--spring-glide),
            opacity var(--duration) var(--spring-glide),
            display var(--duration) ease allow-discrete;

        &[open] .dialog_container {
            /* Post-Entry (Normal) State */

            translate: 0 0;
            scale: 1;
            filter: blur(0);

            /* Pre-Entry State */
            @starting-style {
                /* display: none; */
                translate: 0 8vh;
                scale: 0;
                filter: blur(5px);
            }
        }

        /* Exiting State */
        &:not([open]) .dialog_container {
            display: none;
            translate: 0 8vh;
            scale: 0;
            filter: blur(5px);

            &:nth-child(2) {
                transition-delay: 100ms;
            }
            &:nth-child(3) {
                transition-delay: 50ms;
            }
        }
    }

    .dialog_container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem;
        width: 100%;
        max-width: 325px;
        background: var(--ink-25);
        border-radius: var(--rad-lg);
        border: 1px solid var(--ink-100);
        transition-behavior: allow-discrete;
        transform-origin: bottom center;
        --duration: 350ms;

        transition:
            translate var(--duration) var(--shoot-ease),
            scale var(--duration) var(--spring-glide),
            filter var(--duration) var(--spring-glide),
            opacity var(--duration) ease,
            display var(--duration) ease allow-discrete;
    }
    .dialog_container:nth-child(2) {
        transition-delay: 50ms;
    }
    .dialog_container:nth-child(3) {
        transition-delay: 100ms;
    }

    .fixedWidth {
        min-width: 300px;
    }

    dialog::backdrop {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(80px) saturate(1.5);
        -webkit-backdrop-filter: blur(80px) saturate(1.5);
    }

    h2 {
        margin: 0;
        font-size: 1.5rem;
    }

    p {
        color: var(--ink-600);
        font-weight: 400;
    }
    p + p {
        margin-top: 0.5lh;
    }

    .madeBy {
        display: flex;
        color: var(--ink-300);
        /* font-size: var(--font-sm); */
        width: 100%;
        gap: 0.5rem;
        margin-top: 1rem;
        align-items: center;
        justify-content: center;
        span {
            color: inherit;
        }

        a {
            display: inline-block;
            color: var(--ink-700);
            text-decoration: underline;
            padding: 0;
            width: fit-content;
        }
    }

    a {
        display: block;
        width: 100%;
        padding: 0.75rem;
        color: var(--ink-900);
        text-decoration: none;
    }

    .versionPill {
        background: var(--ink-100);
        color: var(--ink-600);
        font-size: var(--font-sm);
        padding: 0.25rem 0.75rem;
        border-radius: var(--rad-lg);
        font-weight: 500;
    }

    .modalHeader {
        display: flex;
        gap: 0.5rem;
        flex-direction: column;
        align-items: center;
        margin: 1rem 0;
        width: 100%;

        img {
            width: 64px;
            height: 64px;
        }

        * {
            text-align: center;
        }
        p {
            max-width: 220px;
            margin: 0;
            /* font-size: var(--font-sm); */
            color: var(--ink-600);
            font-weight: 400;
        }
    }

    ul {
        width: 100%;
        list-style: none;
        padding: 0;
        margin: 0;
        overflow: hidden;
        button {
            all: unset;
            padding: 1rem;
            display: block;
            width: 100%;
        }
        li,
        button {
            border-radius: var(--rad-md);
            margin: 0;
            width: initial;
            &:hover {
                background-color: var(--ink-100);
            }
        }
    }

    /* fixing weird chrome button not disappear */
    dialog:not([open]) .closeButton {
        display: none;
        translate: 0 8vh;
        scale: 0;
        filter: blur(5px);
    }

    .listBtn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        box-sizing: border-box;
        svg {
            transition: transform 150ms var(--shoot-ease);
        }
    }

    .listBtn:hover svg {
        transform: translateX(8px);
    }

    .closeButton {
        all: unset;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--ink-900);
        border-radius: 50%;
        height: 40px;
        width: 40px;
        cursor: pointer;
        transition: transform 150ms var(--shoot-ease);
    }

    .closeButton:hover {
        transform: scale(1.1);
    }

    .closeButton:active {
        transform: scale(0.9);
    }
    @keyframes zoom {
        from {
            opacity: 0;
            transform: translatey(100px) scale(0.75);
            filter: blur(10px);
        }
        to {
            opacity: 1;
            transform: translatey(0) scale(1);
            filter: blur(0px);
        }
    }
    /* dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	} */
    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    button {
        display: block;
    }

    @media (prefers-color-scheme: dark) {
        .closeButton {
            background: var(--ink-25);
        }
        .listBtn {
            color: var(--ink-900);
        }
        dialog::backdrop {
            background: rgba(0 0 0 / 0.2);
        }
    }
</style>
