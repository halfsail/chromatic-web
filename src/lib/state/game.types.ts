export interface GameState {
    version: string;
    deviceId: string | null;
    lastSync: string | null;
    state: 'START' | 'PLAYING' | 'COMPLETED';
    puzzle: PuzzleState;
    stats: GameStats;
    settings: GameSettings;
}

export interface PuzzleState {
    completed: boolean;
    hints: number;
    moves: number;
    completedAt: string | null;
    col: number;
    row: number;
    date: string;
    hues: string[];
    history: string[];
    locks: number[];
    palette: string[];
}