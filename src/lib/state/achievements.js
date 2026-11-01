// Static, versioned with your code. The DB only ever stores which of
// these `key`s have been unlocked, never the definitions themselves.
export const ACHIEVEMENTS = [
  {
    key: "first-win",
    name: "First Blood",
    description: "Win your first puzzle",
    check: (stats) => stats.gamesWon >= 1,
  },
  {
    key: "streak-7",
    name: "Week Warrior",
    description: "Reach a 7-day streak",
    check: (stats) => stats.currentStreak >= 7,
  },
  {
    key: "flawless",
    name: "Flawless",
    description: "Win in the minimum number of attempts",
    check: (stats, lastGame) => lastGame?.won && lastGame?.attempts === 1,
  },
];
