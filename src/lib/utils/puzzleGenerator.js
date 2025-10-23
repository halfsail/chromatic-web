import chroma from "chroma-js";
import { levels } from './levels.js';
import { CONFIG } from '../state/Store.svelte';

// Simple seeded random number generator
export function seededRandom(seed) {
    let state = parseInt(seed);
    return function() {
        state = (state * 1103515245 + 12345) & 0x7fffffff;
        return state / 0x7fffffff;
    };
}

export function getLocks(today, rowSize, colSize) {
    const seed = today.split('-').join('');
    const lockNum = 7;
    const puzzleSize = rowSize * colSize;

    const rng = seededRandom(seed);
    const locks = [];
    while (locks.length < lockNum) {
        const candidate = Math.floor(rng() * puzzleSize);
        const isAdjacent = locks.some(lock => {
            const lockRow = Math.floor(lock / colSize);
            const lockCol = lock % colSize;
            const candRow = Math.floor(candidate / colSize);
            const candCol = candidate % colSize;
            return (
                (Math.abs(lockRow - candRow) === 1 && lockCol === candCol) ||
                (Math.abs(lockCol - candCol) === 1 && lockRow === candRow)
            );
        });

        if (!locks.includes(candidate) && !isAdjacent) {
            locks.push(candidate);
        }
    }

    const corners = [0, colSize - 1, puzzleSize - colSize, puzzleSize - 1];
    const cornerLock = corners[Math.floor(rng() * corners.length)];
    if (!locks.includes(cornerLock)) {
        locks.push(cornerLock);
    }

    return locks;
}

export function getPalette(today) {
    const startDate = new Date(CONFIG.START_DATE);
    const currentDate = new Date(today);
    const NumberOfPalettes = levels.length;
    const daysSinceStart = Math.floor(Math.abs(currentDate - startDate) / (1000 * 60 * 60 * 24));
    const paletteIndex = daysSinceStart % NumberOfPalettes;
    return levels[paletteIndex];
}