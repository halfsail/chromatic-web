<script>
    import { gameData } from "$lib/state/Store.svelte";
    import { levels } from "$lib/utils/levels.js";
    import { getColors, convertToP3 } from "$lib/utils/colorUtils.js";
    
    import chroma from "chroma-js";
    import { onMount } from 'svelte';

    let lvlIndex = $state(0);
    let cols = $state(4);
    let rows = $state(6);
    let previewBoard = $state([]);

    let spectrum = $state([]);
    let stats = $state({
        total: 0,
        black: 0,
        white: 0,
        red: 0,
        pink: 0,
        violet: 0,
        indigo: 0,
        blue: 0,
        cyan: 0,
        teal: 0,
        green: 0,
        lime: 0,
        yellow: 0,
        orange: 0,
    });

    function generateSpectrum() {
        // merge all level colors into one array
        const allColors = levels.flat();
        // sort colors by hue, handling grayscale colors (NaN hue)
        allColors.sort((a, b) => {
            let [hueA, satA, lightA] = chroma(a).hsl();
            let [hueB, satB, lightB] = chroma(b).hsl();

            // If hue is NaN (grayscale), set to -1 so it sorts before colored hues
            hueA = isNaN(hueA) ? -1 : hueA;
            hueB = isNaN(hueB) ? -1 : hueB;

            if (hueA !== hueB) return hueA - hueB;
            if (satA !== satB) return satA - satB;
            return lightA - lightB;
        });
        // then sort by lightness within same hue
        allColors.sort((a, b) => {
            let [hueA, satA, lightA] = chroma(a).hsl();
            let [hueB, satB, lightB] = chroma(b).hsl();
            if (hueA === hueB) {
                return lightA - lightB;
            }
            return 0; // keep original order if hues differ
        });

        // remove duplicates
        //const uniqueColors = Array.from(new Set(allColors.map(c => c.toLowerCase())));
        //spectrum = uniqueColors;
        

        spectrum = allColors;
    }

    function generateSpectrumStats() {
        stats.total = spectrum.length;
        spectrum.forEach(color => {
            let [hue, sat, light] = chroma(color).hsl();
            if (sat < 0.1) {
                if (light < 0.1) stats.black++;
                else if (light > 0.9) stats.white++;
            } else {
                if (hue >= 0 && hue < 15) stats.red++;
                else if (hue >= 15 && hue < 45) stats.orange++;
                else if (hue >= 45 && hue < 75) stats.yellow++;
                else if (hue >= 75 && hue < 150) stats.lime++;
                else if (hue >= 150 && hue < 180) stats.green++;
                else if (hue >= 180 && hue < 210) stats.teal++;
                else if (hue >= 210 && hue < 240) stats.cyan++;
                else if (hue >= 240 && hue < 270) stats.blue++;
                else if (hue >= 270 && hue < 300) stats.indigo++;
                else if (hue >= 300 && hue < 330) stats.violet++;
                else if (hue >= 330 && hue <= 360) stats.pink++;
            }
        });
    }

    function generatePreviewBoard(index, c, r) {
        if (lvlIndex < 0 || lvlIndex >= levels.length) return;
        const colors = levels[lvlIndex];
        previewBoard = getColors(colors, cols, rows);
    }

// create a function that checks for duplicate colors in previewBoard
// I want to use chroma.js to compare colors accurately

    function isDuplicateColor() {
        const colorSet = new Set();
        for (let color of previewBoard) {
            if (colorSet.has(color)) {
                return true; // Duplicate found
            }
            colorSet.add(color);
            return colorSet.size
        }
        return 0; // No duplicates
    }

    

    onMount(() => {
        generateSpectrum()
        generateSpectrumStats()
        generatePreviewBoard(lvlIndex, cols, rows)
        // isDuplicateColor()
        console.log(spectrum)
    });

    $effect(() => { 
        generatePreviewBoard(lvlIndex, cols, rows) 
        // isDuplicateColor()
    });



</script>

<section class="spectrumBar">
    {#each spectrum as color}
        <div class="colorBlock" style="background-color: {color};"></div>
    {/each}
</section>

<section class="spectrumStats">
    <div>
        <p>Colors</p>
        <h2>{spectrum.length}</h2>
    </div>
    <div>
        <p>Puzzles</p>
        <h2>{spectrum.length/4}</h2>
    </div>

    {#each Object.entries(stats) as [color, count]}
        {#if color !== 'total'}
            <div>
                <p>{color}</p>
                <h2>{count}</h2>
            </div>
        {/if}
    {/each}
</section>

<section>
    <div class="previewBoard" style="grid-template-columns: repeat({cols}, 1fr);">
        {#each previewBoard as color}
            <div 
            class="swatch" 
            style="background-color: color(display-p3 {convertToP3(color)}); background-color: {color};"
            ></div>
        {/each}
    </div>
    <div class="previewControl">
        <label for="index">Level Index</label>
        <input type="number" name="index" id="" step="1" bind:value={lvlIndex} min="0" max="{levels.length - 1}">

        <label for="col">Columns</label>
        <input type="number" name="col" id="" bind:value={cols} min="1" max="10">

        <label for="row">Rows</label>
        <input type="number" name="row" id="" bind:value={rows}>

        <p>{isDuplicateColor()}</p>

    </div>
</section>

<style>
.spectrumBar {
    height: 160px;
    display: flex;
    overflow: hidden;
    margin: 24px;
}

.spectrumStats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 1rem;
    margin: 0 24px 24px 24px;
    text-align: center;
    p {
        margin: 0;
        font-size: var(--font-xs);
        color: var(--ink-500);
        letter-spacing: 1px;
        text-transform: uppercase;
    }
    h2 {
        margin: 0;
        font-size: var(--font-lg);
        color: var(--ink-900);
    }
}
.colorBlock {
    flex: 1;
}

.previewBoard {
    display: grid;
    width: 325px;
    height: 500px;
    border: 1px solid var(--ink-200);
    margin: 0 24px;
    overflow: hidden;
    border-radius: 32px;

    .swatch {
        width: 100%;
    }
}
</style>