<script>
    import {
        uiState,
        closeMenu,
        openMenu,
    } from "$lib/state/InterfaceState.svelte";
    import HelpContent from "../modals/HelpContent.svelte";


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
        class="dialog_container main-dialog"
        role="dialog"
        aria-labelledby="dialog-title"
        onclick={(event) => event.stopPropagation()}
    >
      <HelpContent />


    </div>

</dialog>

<style>
    .main-dialog {
        view-transition-name: main-modal;
    }

    dialog {
      --surface-raised: light-dark(white, var(--grey-9));
      --surface-default: light-dark(rgb(255 255 255 / .9), rgb(0 0 0 / .8));
      --surface-inset: light-dark(rgb(0 0 0 / .1), rgb(255 255 255 / .1));
      --surface-inset-hover: light-dark(rgb(0 0 0 / .15), rgb(255 255 255 / .15));
      --surface-edge: light-dark(rgb(0 0 0 / .2), rgb(255 255 255 / .2));
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        border: none;
        margin: auto;
        padding: 0;
        max-height: 90dvh;
        max-width: 90vw;
        background-color: transparent;
        transition-behavior: allow-discrete;
        transform-origin: bottom center;
        overflow: hidden;
        outline: none;
        --duration_in: 250ms;

        transition:
            translate var(--duration) var(--spring-glide),
            scale var(--duration) var(--spring-glide),
            filter var(--duration) var(--spring-glide),
            opacity var(--duration) var(--spring-glide),
            display var(--duration) ease allow-discrete;

        &[open] .dialog_container {
            /* Post-Entry (Normal) State */
            opacity: 1;
            scale: 1;
            filter: blur(0);

            /* Pre-Entry State */
            @starting-style {
                opacity: .7;
                scale: .5;
                filter: blur(5px);
            }
        }

        /* Exiting State */
        &:not([open]) .dialog_container {
            --duration: 35ms;
            display: none;
            opacity: .5;
            scale: .5;
            filter: blur(5px);
        }
    }

    .dialog_container {
        interpolate-size: allow-keywords;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        /*padding: 2rem;*/
        overflow-y: auto;
        width: 100%;
        max-width: 50ch;
        max-height: 80dvh;
        background: var(--surface-default);
        border-radius: var(--rad-lg);
        border: 1px solid light-dark(rgb(0 0 0 / .1), rgb(255 255 255 / .4));
        transition-behavior: allow-discrete;
        transform-origin: bottom center;
        --duration: 250ms;



        transition:
            translate var(--duration) var(--shoot-ease),
            scale var(--duration) var(--spring-glide),
            filter var(--duration) var(--spring-glide),
            opacity var(--duration) ease,
            display var(--duration) ease allow-discrete;
    }
    @supports (corner-shape: squircle) {
      .dialog_container {
        corner-shape: squircle;
        border-radius: var(--rad-xxl);
      }
    }

    dialog::backdrop {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(80px) saturate(1.5);
        -webkit-backdrop-filter: blur(80px) saturate(1.5);

    }
    @keyframes zoom {
        from {
            backdrop-filter: blur(0) saturate(1);
            -webkit-backdrop-filter: blur(0) saturate(1);
        }
        to {
            backdrop-filter: blur(80px) saturate(1.5);
            -webkit-backdrop-filter: blur(80px) saturate(1.5);
        }
    }
    dialog[open]::backdrop {
		animation: zoom 0.2s ease-out forwards;
	}
    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }


    @media (prefers-color-scheme: dark) {
        dialog::backdrop {
            background: rgba(0 0 0 / 0.2);
        }
    }
</style>
