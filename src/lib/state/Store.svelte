<script module>
    import chroma from "chroma-js";
    import { playGame, completeGame } from "$lib/state/GameState.svelte";
    import { getPalette, getLocks } from "$lib/utils/puzzleGenerator.js";
    import { getColors, shuffleColors } from "$lib/utils/colorUtils.js";
    import { initializeSounds } from "$lib/utils/feedback";
    import { migrateData } from "$lib/utils/migration.js";
    import { version } from "$app/environment";
    import { levels } from "$lib/utils/levels.js";
    import { browser } from "$app/environment";

    export const CONFIG = {
        STORAGE_KEY: "chromatic",
        VERSION_KEY: version,
        START_DATE: "2025-01-01", // Example start date for the game
    };

    const difficultyLevels = {
        easy: {rows: 5, cols: 4, locks: 5},
        normal: {rows: 6, cols: 5, locks: 7},
        medium: {rows: 6, cols: 6, locks: 9},
        hard: {rows: 7, cols: 7, locks: 13},
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
            completedDates: [],
            weekStartDate: getWeekStartDate(),
        },
        settings: {
            theme: "dark",
            soundEnabled: true,
            hapticEnabled: true,
            relaxedMode: true,
            difficulty: "normal",
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
            // if data exists, parse and migrate if necessary
            let parsedData = JSON.parse(storedData);
            initialState = migrateData(parsedData, defaultData, CONFIG.VERSION_KEY, getWeekStartDate);
            

            const today = getTodayDate();
            const storedDate = initialState.puzzle.date?.split("T")[0]; // Handle the date comparison correctly
            const lastKnownDifficulty = initialState.settings.difficulty || "normal";

            if (storedDate !== today && initialState.puzzle.completed) {
                // if user has completed the puzzle and it's a new day, generate a new puzzle
                let extraData = generationLevel(lastKnownDifficulty, today);
                // initialState.puzzle = { ...initialState.puzzle, ...extraData };
                initialState.puzzle  = { ...extraData };
                initialState.puzzle.completed = false;
                initialState.state = "START";
            } else {
                console.log("user has not completed today's puzzle or it's the same day");
            }
        } else {
            // no stored data, gernate a new save and new puzzle
            let extraData = generationLevel();
            // add puzzle data to initial state
            initialState.puzzle = { ...initialState.puzzle, ...extraData };
        }
        
    }

    export const gameData = $state(initialState);

    if (browser) {
        // Check and reset weekly stats on app load
        checkAndResetWeeklyStats();
        // Initialize sounds so they are ready to use
        initializeSounds(gameData.settings.soundEnabled);
    }


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

    // --- Helper Functions ---
    // It's good practice to export functions that modify the state.
    // This keeps your state logic centralized and components cleaner.

    export function getTodayDate() {
        const todayDate = new Date();
        return todayDate.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
    }

    export function getWeekStartDate(date = new Date()) {
        // Returns the Monday of the current week
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(d.setDate(diff)).toISOString().split("T")[0];
    }

    export function checkAndResetWeeklyStats() {
        // const today = getTodayDate();
        const currentWeekStart = getWeekStartDate();

        // console.log("Today:", today);
        console.log("Game Week Start:", gameData.stats.weekStartDate);
        console.log("Current Week Start:", currentWeekStart);

        // If the week has changed, reset completedDates
        if (gameData.stats.weekStartDate !== currentWeekStart) {
            gameData.stats.completedDates = [];
            gameData.stats.weekStartDate = currentWeekStart;
        }
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
        
        // Add today's date to completedDates if not already there
        // const today = getTodayDate();
        if (!gameData.stats.completedDates.includes(gameData.puzzle.date)) {
            gameData.stats.completedDates = [...gameData.stats.completedDates, gameData.puzzle.date];
        }
        
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
    export function toggleRelaxedMode() {
        gameData.settings.relaxedMode = !gameData.settings.relaxedMode;
    }
    export function setTheme(theme) {
        gameData.settings.theme = theme;
    }

    export function nextLevel(date) {
        const today = date ?? getTodayDate();
        let extraData = generationLevel(gameData.settings.difficulty, date);
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

    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    }

    export function randomPlayLevel() {
        const date = randomDate(new Date(2025, 0, 1), new Date()).toISOString().split("T")[0];
        const difficulty = gameData.settings.difficulty;
        let testPuzzle = generationLevel(difficulty, date);
        gameData.puzzle = { ...gameData.puzzle, ...testPuzzle };
        gameData.puzzle.completed = false;
        gameData.puzzle.hints = 0;
        gameData.puzzle.moves = 0;
        gameData.puzzle.date = "Random";
        gameData.state = "start";
    }
    

    export function generationLevel(difficulty, date) {
        // If no date is provided, use today's date
        const today = date ?? getTodayDate();
        const difficultyLevel = difficultyLevels[difficulty] || difficultyLevels["normal"];
        let testPuzzle = {
            col: difficultyLevel.cols,
            row: difficultyLevel.rows,
            date: today,
            hues: getPalette(today),
            history: [],
            moves: 0,
            hints: 0,
            completedAt: null,
        };
        testPuzzle.locks = getLocks(today, testPuzzle.row, testPuzzle.col, difficultyLevel.locks);
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
        const lastPlayedDate = gameData.puzzle?.completedAt ? new Date(gameData.puzzle.completedAt) : new Date();
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
          gameData.stats.bestStreak = gameData.stats.currentStreak
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




