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
        background-color: var(--ink-100);
        border-radius: var(--rad-lg);
        border: 2px solid var(--ink-100);
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
            color: var(--ink-700);
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
            background-color: var(--ink-0);
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

        /* @starting-style {
            display: none;
            opacity: 0;
            scale: .5;
            filter: blur(10px);
        } */
    }

    .dialog_container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
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


    @media (prefers-color-scheme: dark) {
        dialog::backdrop {
            background: rgba(0 0 0 / 0.2);
        }
    }
</style>
