<script>
    import {
        uiState,
        closeMenu,
        openMenu,
    } from "$lib/state/InterfaceState.svelte";
    let dialog; // HTMLDialogElement

    $effect(() => {
        if (dialog) {
            if (uiState.modals.help && !dialog.open) {
                dialog.showModal();
            } else if (!uiState.modals.help && dialog.open) {
                dialog.close();
            }
        }
    });

    function handleClose() {
        closeMenu("help");
    }

    function handleClick(event) {
        if (event.target === dialog) {
            handleClose();
        }
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
        class="dialog_container main-dialog"
        role="dialog"
        aria-labelledby="dialog-title"
        onclick={(event) => event.stopPropagation()}
    >
        <video src="/tutorialWide.webm" playsinline mute autoplay loop
        ></video>
        <div>
            <h3>How to Play</h3>
            <p>
                Move the tiles until the gradient is seamless and all the colors
                flow perfectly into one another.
            </p>
        </div>
        <!-- <div>
            <h3>Controls</h3>
            <p>Drag and drop or click color tiles to swap two tiles.</p>
        </div> -->
        <div>
            <h3>Tips</h3>
            <p>
                Locked Tiles are in the correct spot. Use them as reference
                points to help sort the gradient.
            </p>
            <p>
                Use Rotate Hues if you are having trouble seeing the different
                between colors.
            </p>
        </div>
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
    video {
        width: 100%;
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
            opacity var(--duration) ease,
            display var(--duration) ease allow-discrete;

        &[open] .dialog_container {
            /* Post-Entry (Normal) State */

            translate: 0 0;
            scale: 1;
            filter: blur(0);

            /* Pre-Entry State */
            @starting-style {
                translate: 0 8vh;
                scale: 0.5;
                filter: blur(5px);
            }
        }

        /* Exiting State */
        &:not([open]) .dialog_container {
            display: none;
            translate: 0 8vh;
            scale: 0.5;
            filter: blur(5px);
        }
    }

    .dialog_container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 2rem;
        width: 100%;
        max-width: 325px;
        background: var(--ink-25);
        border-radius: 24px;
        border: 1px solid var(--ink-100);
        transition-behavior: allow-discrete;
        transform-origin: bottom center;
        --duration: 250ms;

        transition:
            translate var(--duration) var(--spring-glide),
            scale var(--duration) var(--spring-glide),
            filter var(--duration) var(--spring-glide),
            opacity var(--duration) ease,
            display var(--duration) ease allow-discrete;
    }
    .dialog_container:nth-child(2) {
        transition-delay: 100ms;
    }
    .dialog_container:nth-child(3) {
        transition-delay: 200ms;
    }

    dialog::backdrop {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(80px) saturate(1.5);
        -webkit-backdrop-filter: blur(80px) saturate(1.5);
    }
    dialog > div {
        padding: 1em;
    }

    h3 {
        margin: 0;
        margin-bottom: 0.5lh;
    }

    p {
        color: var(--ink-600);
        font-weight: 400;
        font-size: var(--font-sm);
    }
    p + p {
        margin-top: 0.5lh;
    }

    /* fixing weird chrome button not disappear */
    dialog:not([open]) .closeButton {
        display: none;
        translate: 0 8vh;
        scale: 0.5;
        filter: blur(5px);
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
        transform: scale(1);
        transition: transform 150ms var(--shoot-ease);
        transition-behavior: allow-discrete;

        @starting-style {
            /* display: none; */
            transform: scale(0.5);
        }
    }

    .closeButton:hover {
        transform: scale(1.1);
    }

    .closeButton:active {
        transform: scale(0.9);
    }

    button {
        display: block;
    }

    @media (prefers-color-scheme: dark) {
        .closeButton {
            background: var(--ink-25);
        }
        dialog::backdrop {
            background: rgba(0 0 0 / 0.2);
        }
    }
</style>
