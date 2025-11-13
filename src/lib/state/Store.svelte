<script module>
    import chroma from "chroma-js";
    import { playGame, completeGame } from "$lib/state/GameState.svelte";
    import { getPalette, getLocks } from "$lib/utils/puzzleGenerator.js";
    import { getColors, shuffleColors } from "$lib/utils/colorUtils.js";
    import { version } from "$app/environment";
    import { levels } from "$lib/utils/levels.js";
    import { browser } from "$app/environment";

    export const CONFIG = {
        STORAGE_KEY: "chromatic",
        VERSION_KEY: version,
        START_DATE: "2025-01-01", // Example start date for the game
    };

    const defaultData = {
        version: CONFIG.VERSION_KEY,
        deviceId: null, // Will be set later
        lastSync: null,
        state: "START",
        isAnimating: false,
        puzzle: {
            completed: false,
            hints: 0,
            moves: 0,
            completedAt: null,
        },
        stats: {
            totalCompleted: 0,
            currentStreak: 0,
            bestStreak: 0,
            averageMoves: 0,
        },
        settings: {
            theme: "dark",
            soundEnabled: true,
            hapticEnabled: true,
        },
    };

    /**
     * Reads the initial data from localStorage if available,
     * otherwise returns the default data structure.
     */

    let initialState = { ...defaultData };

    if (browser) {
        // Try to load existing data from localStorage
        let storedData = loadFromStorage();

        if (storedData) {
            let parsedData = JSON.parse(storedData);
            initialState = migrateData(parsedData);

            const today = getTodayDate();
            const storedDate = initialState.puzzle.date?.split("T")[0]; // Handle the date comparison correctly

            if (storedDate !== today && initialState.puzzle.completed) {
                let extraData = generationLevel();
                initialState.puzzle = { ...initialState.puzzle, ...extraData };
                initialState.puzzle.completed = false;
                initialState.state = "START";
            } else {
                console.log("existing puzzle is up to date");
                // Preserve the completed state from stored data
                initialState.puzzle.completed = parsedData.puzzle.completed;
            }
        } else {
            let extraData = generationLevel();
            initialState.puzzle = { ...initialState.puzzle, ...extraData };
        }
    }

    export const gameData = $state(initialState);

    // Use an $effect to automatically save data to localStorage whenever it changes.

    if (browser) {
        $effect.root(() => {
            $effect(() => {
                localStorage.setItem(
                    CONFIG.STORAGE_KEY,
                    JSON.stringify(gameData),
                );
            });
        });
    }

    // --- Helper Functions (Recommended) ---
    // It's good practice to export functions that modify the state.
    // This keeps your state logic centralized and components cleaner.

    // Update the getTodayDate function to only return the date portion
    export function getTodayDate() {
        const todayDate = new Date();
        return todayDate.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
    }

    export function increaseMove(moves) {
        gameData.puzzle.moves = gameData.puzzle.moves + moves;
    }
    export function increaseHints() {
        gameData.puzzle.hints += 1;
    }
    export function completePuzzle() {
        gameData.puzzle.completed = true;
        gameData.puzzle.completedAt = new Date().toISOString();
        gameData.state = "completed";
        updateStats();
    }

    // settings functions
    export function toggleSound() {
        console.log("toggling sound");
        gameData.settings.soundEnabled = !gameData.settings.soundEnabled;
    }
    export function toggleHaptic() {
        gameData.settings.hapticEnabled = !gameData.settings.hapticEnabled;
    }
    export function setTheme(theme) {
        gameData.settings.theme = theme;
    }

    export function nextLevel() {
        let extraData = generationLevel();
        gameData.puzzle = { ...gameData.puzzle, ...extraData };
        gameData.puzzle.completed = false;
        gameData.puzzle.hints = 0;
        gameData.puzzle.moves = 0;
        gameData.state = "start";
    }

    export function resetGame() {
        // To reset, we can re-assign the properties from the default object.
        Object.assign(gameData, defaultData);
    }

    export function generationLevel() {
        // use date to generate seed for generate locks
        const today = getTodayDate();
        let testPuzzle = {
            col: 5,
            row: 6,
            date: today,
            hues: getPalette(today),
            history: [],
            moves: 0,
            hints: 0,
            completedAt: null,
        };
        testPuzzle.locks = getLocks(today, testPuzzle.row, testPuzzle.col);
        testPuzzle.palette = getColors(
            testPuzzle.hues,
            testPuzzle.col,
            testPuzzle.row,
        );
        testPuzzle.history = shuffleColors(
            testPuzzle.palette,
            testPuzzle.locks,
            testPuzzle.col,
            testPuzzle.row,
        );
        return testPuzzle;
    }

    // Simple seeded random number generator
    function seededRandom(seed) {
        let state = parseInt(seed);
        return function () {
            state = (state * 1103515245 + 12345) & 0x7fffffff;
            return state / 0x7fffffff;
        };
    }

    function saveToStorage(data) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error("Failed to save game state:", error);
            // Could emit an event or show user notification
        }
    }

    function loadFromStorage() {
        try {
            const storedData = localStorage.getItem(CONFIG.STORAGE_KEY);
            return storedData;
        } catch (error) {
            console.error("Failed to load game state:", error);
            return null;
        }
    }

    function migrateData(oldData) {
        const currentVersion = CONFIG.VERSION;

        if (oldData.version !== currentVersion) {
            // Perform any necessary data structure updates
            oldData.version = currentVersion;

            // Add any missing fields
            oldData.settings = oldData.settings || defaultData.settings;
            // Add more migration logic as needed
        }
        return oldData;
    }

    function getHoursDifference(date1, date2) {
    // Define the number of milliseconds in one hour (60 minutes * 60 seconds * 1000 milliseconds)
    const MS_PER_HOUR = 3600000;

    // 1. Get the difference in milliseconds
    // We use Math.abs() to ensure the result is positive, regardless of the order of dates.
    const differenceInMilliseconds = Math.abs(date1.getTime() - date2.getTime());

    // 2. Convert the difference from milliseconds to hours
    const differenceInHours = differenceInMilliseconds / MS_PER_HOUR;
    console.log("Difference in hours:", differenceInHours);

    return differenceInHours;
    }

    export function updateStats() {
        // proceed to update stats that dont need time to be checked
        gameData.stats.totalCompleted = gameData.stats.totalCompleted + 1;

        // setup time vars for later checks
        const today = new Date();
        const lastPlayedDate = gameData.puzzle.completedAt;
        // todo fix date check problem

        console.log("today:", today.getDate());
        console.log("last played date:", new Date(lastPlayedDate).getDate());


        // check to see if you are within 24hours of lastPlayedDate
        if (Math.abs( today.getDate() - lastPlayedDate.getDate() ) <= 1) {
          gameData.stats.currentStreak = gameData.stats.currentStreak + 1;
        } else {
          gameData.stats.currentStreak = 0
        }
        // check to see if current streak is greater than best streak. if it is than set best streak to current streak
        if (gameData.stats.currentStreak > gameData.stats.bestStreak) {
          gameData.stats.bestStreak == gameData.stats.currentStreak
        }

        if (gameData.stats.averageMoves === 0 || gameData.averageMoves === null) {
          // set average to current game average
          gameData.stats.averageMoves = gameData.puzzle.moves
        } else {
          // update average moves
          const totalPreviousMoves = gameData.stats.averageMoves * gameData.stats.totalCompleted;
          const newTotalMoves = totalPreviousMoves + gameData.puzzle.moves;
          const newGamesPlayed = gameData.stats.totalCompleted + 1;
          const newAverage = newTotalMoves / newGamesPlayed;
          gameData.stats.averageMoves = newAverage
        }
    }
</script>




