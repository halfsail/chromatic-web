<script module>
    import { puzzle, stats, meta } from './Store.svelte';

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

        meta.state = state;

        switch (state) {
            case STATE.COMPLETED:
                puzzle.completed = true;
                puzzle.completedAt = new Date().toISOString();
                stats.totalCompleted += 1;
                updateStats();
                break;
            case STATE.START:
                // Reset necessary puzzle data
                puzzle.hints = 0;
                puzzle.moves = 0;
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
        return meta.state;
    }
</script>