import { persisted } from 'svelte-persisted-store'

export const preferences = persisted('player', {
  hasSound: true,
  hasHaptics: true,
  setDiffultity: 'any',
  tutorialDone: false,
  wins: 0,
  
})