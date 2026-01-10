<script module>
    import { set, get, del } from "idb-keyval";
    import { getPalette, getLocks } from "$lib/utils/puzzleGenerator.js";
    import { getColors, shuffleColors } from "$lib/utils/colorUtils.js";
    import { initializeSounds } from "$lib/utils/feedback";
    import { version } from "$app/environment";
    import { browser } from "$app/environment";
    import chroma from "chroma-js";

    // ===== CONSTANTS =====
    export const CONFIG = {
        PUZZLE_KEY: "chromatic_puzzle",
        STATS_KEY: "chromatic_stats",
        SETTINGS_KEY: "chromatic_settings",
        META_KEY: "chromatic_meta",
        VERSION_KEY: version,
        START_DATE: "2025-01-01",
    };

    const DIFFICULTY_LEVELS = {
        easy: { rows: 5, cols: 4, locks: 5 },
        normal: { rows: 6, cols: 5, locks: 7 },
        medium: { rows: 6, cols: 6, locks: 9 },
        hard: { rows: 7, cols: 7, locks: 13 },
    };

    // ===== DEFAULTS =====
    const createDefaultPuzzle = () => ({
        completed: false,
        hints: 0,
        moves: 0,
        completedAt: null,
        col: 5,
        row: 6,
        date: getTodayDate(),
        hues: [],
        history: [],
        locks: [],
        palette: [],
        accent: 'black',
    });

    const createDefaultStats = () => ({
        totalCompleted: 0,
        currentStreak: 0,
        bestStreak: 0,
        averageMoves: 0,
        completedDates: [],
        weekStartDate: getWeekStartDate(),
    });

    const createDefaultSettings = () => ({
        theme: "dark",
        soundEnabled: true,
        hapticEnabled: true,
        relaxedMode: true,
        difficulty: "normal",
    });

    const createDefaultMeta = () => ({
        version: CONFIG.VERSION_KEY,
        deviceId: null,
        lastSync: null,
        state: "START",
        isAnimating: false,
    });

    // ===== REACTIVE STATE =====
    export const meta = $state(createDefaultMeta());
    export const puzzle = $state(createDefaultPuzzle());
    export const stats = $state(createDefaultStats());
    export const settings = $state(createDefaultSettings());
    export const dataLoaded = $state({ value: false });

    // ===== UTILITY FUNCTIONS =====
    export function getTodayDate() {
        return new Date().toISOString().split("T")[0];
    }

    export function getWeekStartDate(date = new Date()) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff)).toISOString().split("T")[0];
    }

    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    // ===== PUZZLE GENERATION =====
    export function generatePuzzle(difficulty = "normal", date = null) {
        const targetDate = date ?? getTodayDate();
        const level = DIFFICULTY_LEVELS[difficulty] || DIFFICULTY_LEVELS.normal;
        
        const hues = getPalette(targetDate);
        const locks = getLocks(targetDate, level.rows, level.cols, level.locks);
        const palette = getColors(hues, level.cols, level.rows);
        const history = shuffleColors(palette, locks, level.cols, level.rows);

        return {
            col: level.cols,
            row: level.rows,
            date: targetDate,
            hues,
            locks,
            palette,
            history,
            moves: 0,
            hints: 0,
            completed: false,
            completedAt: null,
            accent: chroma.average(hues).hex(),
        };
    }

    // ===== INDEXEDDB OPERATIONS =====
    async function loadFromIndexedDB() {
        if (!browser) return null;

        try {
            const [loadedMeta, loadedPuzzle, loadedStats, loadedSettings] = await Promise.all([
                get(CONFIG.META_KEY),
                get(CONFIG.PUZZLE_KEY),
                get(CONFIG.STATS_KEY),
                get(CONFIG.SETTINGS_KEY),
            ]);

            return { loadedMeta, loadedPuzzle, loadedStats, loadedSettings };
        } catch (error) {
            console.error("Failed to load from IndexedDB:", error);
            return null;
        }
    }

    async function saveToIndexedDB(key, data) {
        if (!browser) return;
        
        try {
            // Convert reactive state to plain object
            const plainData = JSON.parse(JSON.stringify(data));
            await set(key, plainData);
        } catch (error) {
            console.error(`Failed to save ${key} to IndexedDB:`, error);
        }
    }

    export async function clearAllData() {
        if (!browser) return;

        try {
            await Promise.all([
                del(CONFIG.META_KEY),
                del(CONFIG.PUZZLE_KEY),
                del(CONFIG.STATS_KEY),
                del(CONFIG.SETTINGS_KEY),
            ]);
            console.log("All game data cleared from IndexedDB");
        } catch (error) {
            console.error("Failed to clear game data:", error);
        }
    }

    // ===== INITIALIZATION =====
    async function initializeGameData() {
        if (!browser) return;

        const loaded = await loadFromIndexedDB();

        if (!loaded) {
            // First time - generate new puzzle
            const newPuzzle = generatePuzzle(settings.difficulty);
            Object.assign(puzzle, newPuzzle);
            dataLoaded.value = true;
            return;
        }

        const { loadedMeta, loadedPuzzle, loadedStats, loadedSettings } = loaded;

        // Merge loaded data
        if (loadedMeta) Object.assign(meta, loadedMeta);
        if (loadedStats) Object.assign(stats, loadedStats);
        if (loadedSettings) Object.assign(settings, loadedSettings);

        // Handle puzzle state
        if (loadedPuzzle) {
            const today = getTodayDate();
            const storedDate = loadedPuzzle.date?.split("T")[0];
            const isNewDay = storedDate !== today && loadedPuzzle.completed;

            if (isNewDay) {
                // Generate new puzzle for new day
                const newPuzzle = generatePuzzle(settings.difficulty, today);
                Object.assign(puzzle, newPuzzle);
                meta.state = "START";
            } else {
                // Continue with existing puzzle
                Object.assign(puzzle, loadedPuzzle);
            }
        } else {
            // No saved puzzle - generate one
            const newPuzzle = generatePuzzle(settings.difficulty);
            Object.assign(puzzle, newPuzzle);
        }

        dataLoaded.value = true;
    }

    // ===== STATE MUTATIONS =====
    export function increaseMove(amount = 1) {
        puzzle.moves += amount;
    }

    export function increaseHints() {
        puzzle.hints += 1;
    }

    export function toggleSound() {
        settings.soundEnabled = !settings.soundEnabled;
    }

    export function toggleHaptic() {
        settings.hapticEnabled = !settings.hapticEnabled;
    }

    export function toggleRelaxedMode() {
        settings.relaxedMode = !settings.relaxedMode;
    }

    export function setTheme(theme) {
        settings.theme = theme;
    }

    export function nextLevel(date = null) {
        const newPuzzle = generatePuzzle(settings.difficulty, date);
        Object.assign(puzzle, newPuzzle);
        meta.state = "start";
    }

    export function randomPlayLevel() {
        const date = randomDate(new Date(2025, 0, 1), new Date())
            .toISOString()
            .split("T")[0];
        const newPuzzle = generatePuzzle(settings.difficulty, date);
        Object.assign(puzzle, { ...newPuzzle, date: "Random" });
        meta.state = "start";
    }

    export function resetGame() {
        Object.assign(meta, createDefaultMeta());
        Object.assign(puzzle, createDefaultPuzzle());
        Object.assign(stats, createDefaultStats());
        Object.assign(settings, createDefaultSettings());
    }

    export function completePuzzle() {
        const previousCompletedAt = puzzle.completedAt;
        
        puzzle.completed = true;
        puzzle.completedAt = new Date().toISOString();
        meta.state = "completed";

        if (!stats.completedDates.includes(puzzle.date)) {
            stats.completedDates = [...stats.completedDates, puzzle.date];
        }

        updateStats(previousCompletedAt);
    }

    export function updateStats(previousCompletedAt) {
        stats.totalCompleted += 1;

        // Handle streak calculation
        if (previousCompletedAt) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const lastPlayed = new Date(previousCompletedAt);
            lastPlayed.setHours(0, 0, 0, 0);
            
            const daysDifference = Math.floor((today - lastPlayed) / (1000 * 60 * 60 * 24));
            
            if (daysDifference === 1) {
                stats.currentStreak += 1;
            } else if (daysDifference > 1) {
                stats.currentStreak = 1;
            }
        } else {
            stats.currentStreak = 1;
        }

        // Update best streak
        if (stats.currentStreak > stats.bestStreak) {
            stats.bestStreak = stats.currentStreak;
        }

        // Update average moves
        if (stats.averageMoves === 0 || stats.averageMoves === null) {
            stats.averageMoves = puzzle.moves;
        } else {
            const totalPreviousMoves = stats.averageMoves * (stats.totalCompleted - 1);
            stats.averageMoves = (totalPreviousMoves + puzzle.moves) / stats.totalCompleted;
        }
    }

    // ===== INITIALIZATION & EFFECTS =====
    if (browser) {
        // Initialize sounds
        initializeSounds(settings.soundEnabled);

        // Initialize game data
        initializeGameData();

        // Auto-save effects
        $effect.root(() => {
            $effect(() => {
                if (dataLoaded.value) {
                    saveToIndexedDB(CONFIG.META_KEY, {
                        version: meta.version,
                        deviceId: meta.deviceId,
                        lastSync: meta.lastSync,
                        state: meta.state,
                        isAnimating: meta.isAnimating,
                    });
                }
            });

            $effect(() => {
                if (dataLoaded.value) {
                    saveToIndexedDB(CONFIG.PUZZLE_KEY, puzzle);
                }
            });

            $effect(() => {
                if (dataLoaded.value) {
                    saveToIndexedDB(CONFIG.STATS_KEY, stats);
                }
            });

            $effect(() => {
                if (dataLoaded.value) {
                    saveToIndexedDB(CONFIG.SETTINGS_KEY, settings);
                }
            });
        });
    }
</script>