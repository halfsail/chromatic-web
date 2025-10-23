import chroma from "chroma-js";

export function convertToP3(color) {
    // convert color to p3 color space
    const rgb = chroma(color).rgb();
    // Clamp values and convert to [0,1] range
    const [r, g, b] = rgb.map((v) => Math.max(0, Math.min(255, v)) / 255);
    let p3 = `color(display-p3 ${r.toFixed(5)} ${g.toFixed(5)} ${b.toFixed(5)})`;
    return p3
}

export function getColors(keyColors, colSize, rowSize) {
    const firstColumn = chroma
        .scale([keyColors[0], keyColors[2]])
        .correctLightness()
        .colors(rowSize);
    const lastColumn = chroma
        .scale([keyColors[1], keyColors[3]])
        .correctLightness()
        .colors(rowSize);
    let matrix = [];

    for (let i = 0; i < rowSize; i++) {
        let tempRow = chroma
            .scale([firstColumn[i], lastColumn[i]])
            .correctLightness()
            .colors(colSize);
        matrix.push(...tempRow);
    }
    return matrix;
}

export function shuffleColors(colors, locks, colSize, rowSize) {
    const lockSet = new Set(locks);
    const unlockedIndices = [];
    
    for (let i = 0; i < colors.length; i++) {
        if (!lockSet.has(i)) unlockedIndices.push(i);
    }

    const unlockedColors = unlockedIndices.map(i => colors[i]);

    for (let i = unlockedColors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unlockedColors[i], unlockedColors[j]] = [unlockedColors[j], unlockedColors[i]];
    }

    const result = [];
    let unlockedIdx = 0;
    for (let i = 0; i < colors.length; i++) {
        if (lockSet.has(i)) {
            result[i] = colors[i];
        } else {
            result[i] = unlockedColors[unlockedIdx++];
        }
    }

    return result;
}