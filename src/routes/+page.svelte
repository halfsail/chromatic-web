<script>
    import { gameState } from '$lib/state/GameState.svelte.js';

    // main game components
    import Board from "$lib/components/chromatic/Board.svelte";
    import MenuHeader from '$lib/components/hubMenu/MenuHeader.svelte';
    import MenuWeekBar from '$lib/components/hubMenu/MenuWeekBar.svelte';
    // modals and menus


    // modal state variables
    let hueRotate = $state(0);
</script>


<main>
    <header>
        <!-- menu header -->
        <MenuHeader />
        <!-- game header -->
    </header>


    <footer>
        <!-- menu footer -->
         <MenuWeekBar />
        <!-- game footer -->
    </footer>
</main>    


<style>
    main {
        /* display: flex; */
        display: grid;
        grid-template-rows: auto minmax(auto, 1000px) auto;
        grid-template-columns: 1fr;
        flex-direction: column;
        align-items: center;
        /* padding: 1rem var(--sidePadding); */
        padding: 0;
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
