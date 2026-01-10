<script>
    import { meta } from "$lib/state/Store.svelte";
    import { uiState, openMenu } from "$lib/state/InterfaceState.svelte";
    // main game components
    import Header from "$lib/components/chromatic/Header.svelte";
    import Board from "$lib/components/chromatic/Board.svelte";
    // modals and menus
    import HelpModal from "$lib/components/chromatic/HelpModal.svelte";
    import MegaMenu from "$lib/components/chromatic/MegaMenu.svelte";

    // modal state variables
    let hueRotate = $state(0);
</script>

<main class:paused={meta.state === "paused"}>
    <Header toggleMenu={openMenu} />
    <Board />
</main>

<HelpModal bind:showModal={uiState.modals.help} />
<MegaMenu bind:showModal={uiState.modals.sidebar} />

<style>
    main {
        /* display: flex; */
        display: grid;
        grid-template-rows: auto minmax(auto, 1000px) auto;
        grid-template-columns: 1fr;
        flex-direction: column;
        align-items: center;
        padding: 1rem var(--sidePadding);
        gap: var(--boardGaps);
        height: 100dvh;
        /*max-height: 900px;*/
        color: var(--text-color);
        filter: hue-rotate(var(--hueRotate, 0deg));
    }

    @media (min-width: 730px) {
        /* Add your CSS rules here */
        main {
            grid-template-rows: 1fr minmax(auto, 900px) 1fr;
            grid-template-columns: minmax(1rem, auto) minmax(auto, 450px) minmax(1rem, auto);
            gap: 2dvw;
            align-items: center;
            padding: 1rem var(--sidePadding);
        }
    }
</style>
