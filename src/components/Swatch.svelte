<script>
    import { setContrast } from "../lib/logic";
    export let hue
    export let selectedIndex
    export let index
    export let lock
    export let corner


    const iconColor = setContrast(hue)

    $: isSelected = (selectedIndex === index)
</script>

<button class="swatch {corner}" class:locked={lock} class:pressed={isSelected} style="background-color: {hue};" on:click >
    <!-- insert locks -->

    <div class="icon_container">
        <svg class="lock" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g style="mix-blend-mode:luminosity" opacity="0.8">
        <path d="M13.0125 7.47693H3.4962C2.74538 7.47693 2.13672 8.08559 2.13672 8.83641V13.5946C2.13672 14.3454 2.74538 14.9541 3.4962 14.9541H13.0125C13.7634 14.9541 14.372 14.3454 14.372 13.5946V8.83641C14.372 8.08559 13.7634 7.47693 13.0125 7.47693Z" fill="{iconColor}" stroke="{iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.85571 7.47702V4.75807C4.85571 3.85668 5.21379 2.99221 5.85117 2.35483C6.48855 1.71745 7.35302 1.35938 8.25441 1.35938C9.1558 1.35938 10.0203 1.71745 10.6576 2.35483C11.295 2.99221 11.6531 3.85668 11.6531 4.75807V7.47702" stroke="{iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
        </svg>
        <svg class="hoverDot" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g style="mix-blend-mode:luminosity" opacity="0.8">
                <circle cx="6" cy="6" r="6" fill="{iconColor}"/>
            </g>
        </svg>
    </div>
        
</button>

<style>
    button {
        --scaleIn: cubic-bezier(0,.89,.44,1);
        all: unset;
        height: 100%;
        width: 100%;
        min-width: 0;
        min-height: 100%;
        cursor: pointer;
        transition: all 350ms var(--scaleIn);
        transition: all 350ms cubic-bezier(0.02, 0.01, 0.21, 1);
        display: grid;
        position: relative;
    }

    .icon_container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 24px;
        width: 24px;
        margin: auto auto;
    }

    button .lock {
        display: none;
        opacity: 0;
    }

    .locked {
        pointer-events: none;
    }
    .locked .lock {
        display: block;
        opacity: 1;
    }

    .tl_corner {
        border-top-left-radius: calc(var(--cornerRadius) - var(--gameBoardBorder));
    }
    .tr_corner {
        border-top-right-radius: calc(var(--cornerRadius) - var(--gameBoardBorder));
    }
    .br_corner {
        border-bottom-right-radius: calc(var(--cornerRadius) - var(--gameBoardBorder));
    }
    .bl_corner {
        border-bottom-left-radius: calc(var(--cornerRadius) - var(--gameBoardBorder));
    }
    button svg {
        margin: auto;
    }
    .pressed {
        transform: scale(1.15) rotate(-2deg);
        /* border-radius: var(--cornerRadius); */
        border-radius: 12px;
        /* elevation / theme_dark / e6 */
        box-shadow: var(--elevation-4), var(--swatchThickness);
        z-index: 5;

    }

    button:hover .hoverDot {
        opacity: 1;
        display: block;
    }
    button:hover .lock {
        opacity: 0;
        display: none;
    }

    .hoverDot {
        display: none;
        opacity: 0;
        margin: auto;
    }
    

    /* @media (hover: hover) {
        button:hover .hoverDot {
        opacity: 1;
        }
    } */
</style>