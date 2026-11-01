import Dexie from "dexie";

export const db = new Dexie("PuzzleGameDB");

// v1 schema. When you add fields later, bump the version and add a
// db.version(2).stores({...}).upgrade(...) block rather than editing this one.
db.version(1).stores({
  settings: "id", // singleton row, id: 'settings'
  puzzleState: "id", // singleton row, id: 'current'
  stats: "id", // singleton row, id: 'stats'
  gameHistory: "++id, dateCompleted, puzzleId, won", // one row per completed puzzle
  achievements: "key", // one row per *unlocked* achievement
});

export default db;
