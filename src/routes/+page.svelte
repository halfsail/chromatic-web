<script>
    import { gameData } from "$lib/state/Store.svelte";
    import { uiState, openMenu } from "$lib/state/InterfaceState.svelte";
    // main game components
    import Header from "$lib/components/chromatic/Header.svelte";
    import Board from "$lib/components/chromatic/Board.svelte";
    // modals and menus
    import HamburgerMenu from "$lib/components/chromatic/HamburgerMenu.svelte";
    import HelpModal from "$lib/components/chromatic/HelpModal.svelte";

    // modal state variables
    let hueRotate = $state(0);
</script>

<main class:paused={gameData.state === "paused"}>
    <Header toggleMenu={openMenu} />
    <Board />
</main>

<HelpModal bind:showModal={uiState.modals.help} />
<HamburgerMenu
    bind:showModal={uiState.modals.sidebar}
    bind:showHelp={uiState.modals.help}
/>

<style>
    main {
        /* display: flex; */
        display: grid;
        grid-template-rows: auto 1fr auto;
        grid-template-columns: 1fr;
        flex-direction: column;
        align-items: center;
        /*padding: var(--topBottomPadding) var(--sidePadding);*/
        padding: 1rem var(--sidePadding);
        gap: var(--boardGaps);
        height: 100dvh;
        max-height: 900px;
        color: var(--text-color);
        filter: hue-rotate(var(--hueRotate, 0deg));
    }

    @media (orientation: landscape) {
        /* Add your CSS rules here */
        main {
            grid-template-rows: auto 8fr 1fr;
            grid-template-columns: 1fr minmax(auto, 350px) 1fr;
            align-items: center;
            padding: 1rem var(--sidePadding);
        }
    }

    /*@media (max-height: 700px) and (orientation: landscape) {
        main {
            grid-template-rows: 8fr 1fr;
            grid-template-columns: 6fr 4fr;
            align-items: end;
        }
    }*/
</style>
