<script>
  import {gameData, increaseTime} from '../state/Store.svelte';
  import NumberFlow from '@number-flow/svelte';



let timerState = $state({
    paused: false,
    show: true
});



let hrs = $derived( String(Math.floor(gameData.puzzle.time / 3600)).padStart(2, '0') );
let mins = $derived( String(Math.floor((gameData.puzzle.time % 3600) / 60)).padStart(2, '0') );
let secs = $derived( String(gameData.puzzle.time % 60).padStart(2, '0') );

$effect(() => {
  const interval = setInterval(() => {
    if (!timerState.paused && gameData.state === 'playing') {
      increaseTime(1); // Increment the time by 1 second
    }
  }, 1000);
  return () => clearInterval(interval);
});

  function pause() {
    timerState.paused = !timerState.paused;
  }
  function toggleShow() {
    timerState.show = !timerState.show;
  }
</script>



{#if timerState.show}
<span>
    {#if hrs === '00'}
    {:else}
    <NumberFlow value={hrs} format={(num) => String(num).padStart(2, '0')} />
:
    {/if}

<NumberFlow value={mins} format={(num) => String(num).padStart(2, '0')} />
:
<NumberFlow value={secs} />
</span>
  
{/if}

<!-- <button onclick={pause}>{timerState.paused ? 'Resume' : 'Pause'}</button>
<button onclick={toggleShow}>{timerState.show ? 'Hide Timer' : 'Show Timer'}</button> -->

<style>
/* Add your styles here if needed */
</style>