<script module>
    import { gameData } from './Store.svelte';

    // Define the possible states
    export const STATE = {
        START: 'start',
        PLAYING: 'playing',
        PAUSE: 'pause',
        COMPLETED: 'completed'
    };

    // Define state transitions with side effects
    export function transitionTo(state) {
        if (!Object.values(STATE).includes(state)) {
            console.warn('Invalid state transition:', state);
            return;
        }

        gameData.state = state;

        switch (state) {
            case STATE.COMPLETED:
                gameData.puzzle.completed = true;
                gameData.puzzle.completedAt = new Date().toISOString();
                gameData.stats.totalCompleted += 1;
                updateStats();
                break;
            case STATE.START:
                // Reset necessary puzzle data
                gameData.puzzle.hints = 0;
                gameData.puzzle.moves = 0;
                break;
        }
    }

    // Helper functions for common transitions
    export function startGame() {
        transitionTo(STATE.START);
    }

    export function playGame() {
        transitionTo(STATE.PLAYING);
    }

    export function pauseGame() {
        transitionTo(STATE.PAUSE);
    }

    export function completeGame() {
        transitionTo(STATE.COMPLETED);
    }

    // Get current state
    export function getGameState() {
        return gameData.state;
    }
</script>