<script>
    import {
        uiState,
        closeMenu,
        openMenu,
    } from "$lib/state/InterfaceState.svelte";

    import SettingsContainer from "./SettingsContainer.svelte";
    import AboutContainer from "./AboutContainer.svelte";

    let dialog; // HTMLDialogElement
    let activeTab = $state("game");

    $effect(() => {
        if (dialog) {
            if (uiState.modals.sidebar && !dialog.open) {
                dialog.showModal();
            } else if (!uiState.modals.sidebar && dialog.open) {
                dialog.close();
                activeTab = 'game'
            }
        }
    });

    function switchTab(tab) {
        if (tab === activeTab) return;
        activeTab = tab;
    }


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
            <div class="tabContent {activeTab}">
                <div class="game">
                    <AboutContainer />
                </div>
                <div class="settings">
                    <SettingsContainer />
                </div>

            </div>

        <div class="tabBar">
            <button class="tab" onclick={() => switchTab("game")}>Game</button>
            <button class="tab" onclick={() => switchTab("settings")}>Settings</button>
            <div class="highlight" class:game={activeTab === 'game'} class:settings={activeTab === 'settings'}></div>
        </div>
    </div>

</dialog>

<style>
    .tabBar {
        position: relative;
        height: 44px;
        background-color: var(--surface-inset);
        border-radius: var(--rad-lg);
        outline: 2px solid var(--surface-inset);
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .tab {
            flex: 1;
            background: none;
            border: none;
            font-size: var(--font-md);
            font-weight: 500;
            color: light-dark(var(--grey-7), var(--grey-0));
            cursor: pointer;
            z-index: 1;
            text-align: center;
            font-family: "Bricolage Grotesque", sans-serif;
        }

        .highlight {
            display: block;
            position: absolute;
            width: 50%;
            height: 100%;
            background-color: light-dark(white, rgb(255 255 255 / .4));
            border-radius: var(--rad-lg);
            transition: transform 0.3s ease;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
        }
        .game {
            transform: translateX(0%);
        }
        .settings {
            transform: translateX(100%);
        }
    }

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
    .tabContent {
        display: block;
    }
    .tabContent.settings .game, .tabContent.game .settings {
        display: none;
        opacity: 0;
    }
    div.settings, div.game {
        display: block;
        opacity: 1;
        filter: blur(0);
        scale: 1;
        transition: all 1s ease;
    }

    .dialog_container {
        interpolate-size: allow-keywords;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        width: 100%;
        max-width: 325px;
        height: calc-size(min-content, size);
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

    .fixedWidth {
        min-width: 300px;
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
