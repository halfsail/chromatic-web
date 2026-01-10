<script>
    import { puzzle, nextLevel } from "$lib/state/Store.svelte";
    import { openMenu } from "$lib/state/InterfaceState.svelte";
    import RoundBtn from "../buttons/RoundBtn.svelte";
    let { getHint, shiftColors } = $props();
</script>

<section class="controlContainer">
    <div class="wideScreen">
    <RoundBtn 
        label="Menu"
        type="secondary"
        onclick={() => openMenu("sidebar")}
    >
    {#snippet icon()}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 5L20 5" stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 12L20 12" stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 19L20 19" stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    {/snippet}
    </RoundBtn>

    <RoundBtn 
        label="Rules"
        type="secondary"
        onclick={() => openMenu("help")}
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
    <RoundBtn 
        label="Hint"
        type="secondary"
        disabled={puzzle.isAnimating}
        onclick={getHint}
    >
    {#snippet icon()}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.97 16.9699C17.2629 16.6771 17.7377 16.6771 18.0306 16.9699L22.0306 20.9699C22.3232 21.2629 22.3234 21.7377 22.0306 22.0305C21.7378 22.3233 21.263 22.3231 20.97 22.0305L16.97 18.0305C16.6771 17.7376 16.6771 17.2628 16.97 16.9699Z" fill="var(--icon-color)"/>
            <path d="M12.7923 2.40842C13.6522 1.79586 14.6509 1.52496 15.5071 1.96702C16.362 2.40888 16.7226 3.37947 16.7239 4.4387L16.7366 7.57834C16.7372 7.68553 16.7803 7.85915 16.8851 8.04709C16.9881 8.23169 17.1126 8.3623 17.2073 8.42405L19.6058 9.92795C20.6075 10.5572 21.3899 11.449 21.2308 12.4924C21.0808 13.4743 20.1777 14.0723 19.1234 14.3821L18.9105 14.4406L15.9007 15.2004C15.792 15.2278 15.6304 15.3164 15.4739 15.4729C15.318 15.6289 15.2259 15.794 15.1956 15.9104L15.1946 15.9094L14.4368 18.9143C14.1492 20.0584 13.5368 21.0709 12.4896 21.2307C11.4465 21.3896 10.5532 20.6119 9.92512 19.6096L8.42414 17.2151C8.36345 17.1198 8.23147 16.9934 8.04426 16.8889C7.85665 16.7842 7.68359 16.7411 7.57649 16.7405L4.43684 16.7278C3.38058 16.7233 2.41164 16.3626 1.96906 15.51C1.52522 14.6545 1.79365 13.6569 2.40656 12.7961L4.08039 10.4475C4.13169 10.3737 4.19523 10.2233 4.22395 10.0246C4.25283 9.8245 4.23462 9.66027 4.20442 9.57248L4.20246 9.56663L3.07453 6.21995L3.07356 6.21799C2.73191 5.19662 2.7481 4.13635 3.44074 3.44358C4.1339 2.75054 5.1922 2.73742 6.21028 3.08225L9.55793 4.21018L9.56379 4.21213C9.65127 4.24223 9.81513 4.26003 10.015 4.23069C10.2144 4.20132 10.3676 4.13699 10.4446 4.08225L12.7923 2.40842Z" fill="var(--icon-color)"/>
        </svg>

    {/snippet}
    </RoundBtn>

    <RoundBtn 
        label="Rotate Hues"
        type="secondary"
        onclick={shiftColors}
    >
    {#snippet icon()}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.5 12.9999C8.98528 12.9999 11 15.0146 11 17.4999C11 19.9852 8.98528 21.9999 6.5 21.9999C4.01472 21.9999 2 19.9852 2 17.4999C2 15.0146 4.01472 12.9999 6.5 12.9999Z" fill="var(--icon-color)"/>
            <path d="M17.5 1.99988C19.9852 1.99988 22 4.0146 22 6.49988C22 8.98516 19.9852 10.9999 17.5 10.9999C15.0147 10.9999 13 8.98516 13 6.49988C13 4.0146 15.0147 1.99988 17.5 1.99988Z" fill="var(--icon-color)"/>
            <g opacity="0.5">
            <path d="M17.4999 12.9999C19.9851 12.9999 21.9999 15.0146 21.9999 17.4999C21.9999 19.9852 19.9851 21.9999 17.4999 21.9999C15.0146 21.9999 12.9999 19.9852 12.9999 17.4999C12.9999 15.0146 15.0146 12.9999 17.4999 12.9999Z" fill="var(--icon-color)"/>
            <path d="M6.49988 1.99988C8.98516 1.99988 10.9999 4.0146 10.9999 6.49988C10.9999 8.98516 8.98516 10.9999 6.49988 10.9999C4.0146 10.9999 1.99988 8.98516 1.99988 6.49988C1.99988 4.0146 4.0146 1.99988 6.49988 1.99988Z" fill="var(--icon-color)"/>
            </g>
        </svg>


    {/snippet}
    </RoundBtn>
</section>

<style>
    .controlContainer {
        grid-column: 1/-1;
        width: 100%;
        max-width: 375px;
        margin: 0 auto;
        display: grid;
        grid-auto-flow: column;
        justify-content: space-evenly;
        gap: 2rem;
    }
    .wideScreen {
        display: none;
    }

    @media (min-width: 730px) {
        .controlContainer {
            grid-auto-flow: row;
            margin: 0;
            grid-row: 2/3;
            grid-column: 3/-1;
            width: fit-content;
            gap: 1rem;
            padding: 0 0.5rem;
        }
        .wideScreen {
            display: grid;
            grid-row: span 2;
            grid-template-rows: subgrid;
            grid-template-columns: subgrid;
        }
    }
</style>
