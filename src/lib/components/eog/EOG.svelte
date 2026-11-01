<script>
  import { gameStore } from "$lib/state/GameStore.svelte";
    import WeekStreak from "./WeekStreak.svelte";
  import { starRating } from "$lib/utils/puzzle.js";

  // Wins saved before ratings existed have no `stars`, so work it out from moves.
  const rating = $derived(
    gameStore.puzzleState.stars ?? starRating(gameStore.puzzleState.moves, gameStore.puzzleState.par),
  );

  // Puzzles saved before hint tracking have no `hints` field.
  const hints = $derived(gameStore.puzzleState.hints ?? 0);

  // Finished puzzles keep their final elapsedMs, e.g. 87000 → "1:27", 3723000 → "1:02:03".
  const time = $derived.by(() => {
    const total = Math.floor((gameStore.puzzleState.elapsedMs ?? 0) / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = String(total % 60).padStart(2, "0");
    return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
  });

  let winningPhrases = [
    "Kudos to you. Keep it up!",
    "Bravo. Keep it up!",
    "You're doing great, keep it up!",
    "Amazing work! Keep it up!",
    "Fantastic job!"
  ];
</script>

<!-- {#if gameStore.settings.relaxedMode === false} -->
  <section class="col eog">

    <section class="col ratingSection">
      <div class="row starRow" role="img" aria-label="{rating} out of 5 stars">
    {#each Array(5) as _, i}
    {#if i < rating}
      <svg class="star" class:filled={i < rating} width="34" height="32" viewBox="0 0 34 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.6446 1.04315C15.5979 -0.347825 17.6507 -0.347824 18.604 1.04315L22.9131 7.33069C23.2252 7.78604 23.6847 8.11989 24.2142 8.27598L31.5256 10.4312C33.1431 10.9081 33.7774 12.8604 32.7491 14.1968L28.1009 20.238C27.7643 20.6755 27.5888 21.2157 27.604 21.7675L27.8135 29.3871C27.8599 31.0728 26.1991 32.2794 24.6103 31.7144L17.4284 29.1605C16.9083 28.9755 16.3403 28.9755 15.8202 29.1605L8.63832 31.7144C7.0495 32.2794 5.38876 31.0728 5.43512 29.3871L5.64468 21.7675C5.65986 21.2157 5.48434 20.6755 5.14771 20.238L0.499502 14.1968C-0.528808 12.8604 0.10554 10.908 1.72302 10.4312L9.03442 8.27598C9.56392 8.11989 10.0234 7.78604 10.3355 7.33069L14.6446 1.04315Z" />
      </svg>
      {/if}
    {/each}
  </div>
  <div>
    <p>Kudos to you. Keep it up!</p>
  </div>      
    </section>



  <section class="statSection row">

    <div class="statContainer">
      <div class="row">
        <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99984 12.8334C10.2215 12.8334 12.8332 10.2217 12.8332 7.00008C12.8332 3.77842 10.2215 1.16675 6.99984 1.16675C3.77818 1.16675 1.1665 3.77842 1.1665 7.00008C1.1665 10.2217 3.77818 12.8334 6.99984 12.8334ZM7.43734 4.66675C7.43734 4.42512 7.24146 4.22925 6.99984 4.22925C6.75821 4.22925 6.56234 4.42512 6.56234 4.66675V7.00008C6.56234 7.11611 6.60843 7.22739 6.69048 7.30944L8.14881 8.76777C8.31967 8.93863 8.59668 8.93863 8.76753 8.76777C8.93839 8.59692 8.93839 8.31991 8.76753 8.14906L7.43734 6.81886V4.66675Z" fill="#666666"/>
        </svg>

        <small>Time</small>
      </div>
      <p class="stat">{time}</p>
    </div>
    <div class="statContainer">
      <div class="row">
        <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.6865 7.65723C11.6292 7.65723 12.1007 7.65733 12.3936 7.9502C12.6864 8.24306 12.6865 8.71458 12.6865 9.65723V10.7031C12.6865 11.6458 12.6863 12.1173 12.3936 12.4102C12.1007 12.703 11.6292 12.7031 10.6865 12.7031H9.64062C8.69782 12.7031 8.22649 12.703 7.93359 12.4102C7.6407 12.1173 7.64062 11.6459 7.64062 10.7031V9.65723C7.64063 8.71458 7.64073 8.24306 7.93359 7.9502C8.2265 7.65742 8.69795 7.65723 9.64062 7.65723H10.6865ZM9.70312 2C10.8076 2.00013 11.7031 2.89551 11.7031 4V4.82812C11.7031 5.29953 11.7031 5.53519 11.5566 5.68164C11.4102 5.82809 11.1745 5.82812 10.7031 5.82812H7.85156C6.74707 5.82812 5.85169 6.72367 5.85156 7.82812V10.7031C5.85156 11.1745 5.85152 11.4102 5.70508 11.5566C5.55863 11.7031 5.32297 11.7031 4.85156 11.7031H4C2.89543 11.7031 2 10.8077 2 9.70312V4C2 2.89543 2.89543 2 4 2H9.70312Z" fill="#666666"/>
        </svg>

        <small>Moves</small>
      </div>
      <p class="stat">{gameStore.puzzleState.moves}</p>
    </div>

    {#if hints === 0}
    <div class="statContainer">
      <div class="row">
        <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.02078 2.02102C1.1665 2.87529 1.1665 4.25022 1.1665 7.00008C1.1665 9.74994 1.1665 11.1249 2.02078 11.9791C2.87505 12.8334 4.24998 12.8334 6.99984 12.8334C9.7497 12.8334 11.1246 12.8334 11.9789 11.9791C12.8332 11.1249 12.8332 9.74994 12.8332 7.00008C12.8332 4.25022 12.8332 2.87529 11.9789 2.02102C11.1246 1.16675 9.7497 1.16675 6.99984 1.16675C4.24998 1.16675 2.87505 1.16675 2.02078 2.02102ZM9.9165 7.38897C9.9165 9.87786 7.84243 10.5001 6.80539 10.5001C5.89799 10.5001 4.08317 9.87786 4.08317 7.38897C4.08317 6.30644 4.70321 5.61918 5.22413 5.27327C5.46229 5.11511 5.75851 5.2162 5.77391 5.50167C5.8076 6.1263 6.289 6.62804 6.6618 6.12573C7.00301 5.66599 7.17141 5.04167 7.17141 4.66675C7.17141 4.11446 7.73047 3.7635 8.16696 4.10188C9.01776 4.76142 9.9165 5.86599 9.9165 7.38897Z" fill="#666666"/>
        </svg>
        <small>Streak</small>
      </div>
      <p class="stat">{gameStore.stats.currentStreak}</p>
    </div>
    {:else}
    <div class="statContainer">
      <div class="row">
        <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.89902 9.89903C10.0699 9.7282 10.3468 9.72818 10.5177 9.89903L12.851 12.2324C13.0217 12.4032 13.0218 12.6802 12.851 12.851C12.6802 13.0218 12.4032 13.0217 12.2324 12.851L9.89902 10.5177C9.72816 10.3468 9.72816 10.0699 9.89902 9.89903Z" fill="#666666"/>
        <path d="M7.46201 1.40481C7.96362 1.04748 8.5462 0.889458 9.04566 1.14732C9.54435 1.40508 9.75469 1.97125 9.75546 2.58914L9.76287 4.4206C9.76317 4.48312 9.78832 4.5844 9.84946 4.69404C9.90956 4.80172 9.9822 4.8779 10.0374 4.91393L11.4365 5.7912C12.0209 6.15825 12.4773 6.67848 12.3845 7.28714C12.2969 7.85994 11.7702 8.20877 11.1551 8.38943L11.0309 8.42361L9.27524 8.86681C9.21185 8.88279 9.11756 8.93447 9.0263 9.02574C8.93532 9.11675 8.88163 9.21307 8.86394 9.28095L8.86337 9.28038L8.42132 11.0332C8.25355 11.7006 7.89629 12.2912 7.28541 12.3845C6.67695 12.4771 6.15584 12.0235 5.78948 11.4388L4.91391 10.042C4.8785 9.98646 4.80152 9.91271 4.69231 9.85175C4.58288 9.79071 4.48192 9.76554 4.41944 9.76516L2.58798 9.75776C1.97183 9.75519 1.40662 9.54478 1.14845 9.04739C0.88954 8.54838 1.04613 7.96644 1.40366 7.4643L2.38006 6.09426C2.40998 6.05124 2.44704 5.96351 2.4638 5.8476C2.48065 5.73086 2.47002 5.63506 2.4524 5.58385L2.45126 5.58043L1.7933 3.6282L1.79274 3.62706C1.59344 3.03126 1.60289 2.41277 2.00693 2.00865C2.41127 1.60438 3.02861 1.59673 3.62249 1.79788L5.57529 2.45584L5.57871 2.45698C5.62974 2.47453 5.72532 2.48492 5.84189 2.4678C5.95823 2.45067 6.0476 2.41314 6.09254 2.38121L7.46201 1.40481Z" fill="#666666"/>
        </svg>

        <small>Hints</small>
      </div>
      <p class="stat">{hints}</p>
    </div>
    {/if}

  </section>

</section>
<!-- {/if} -->

<section class="weekWrapper">
  <WeekStreak />
</section>

<section>
  <button class="retry" onclick={() => gameStore.retryLevel()}>Retry</button>
  <button class="new" onclick={() => gameStore.playRandomLevel()}>Play Random Level</button>
</section>



<style>
  .eog, .statSection {
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
  }
  .row {
    display: flex;
    justify-items:  space-between;
    align-items: center;
  }

  .statSection {
    width: 100%;
  }

  .statContainer {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .25rem;
    svg {
      height: .65lh;
    }
    small {
      font-size: var(--font-sm);
    letter-spacing: 1px;
    color: var(--text-color-secondary);
    }

    .row {
      align-items: center;
      gap: 5px;
    }
  }

  .stat {
    font-size: var(--font-xl);

    color: var(--text-color-primary);
    letter-spacing: 0.02em;
    font-family: "Bricolage Grotesque", system-ui, sans-serif;
    font-weight: 550;
  }

  .weekWrapper {
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
  }

  .ratingSection {
    gap: 1.2rem;
    margin-top: 1rem;
  }

  .starRow {
    gap: 1rem;

  }

  .star path {
    fill: var(--surface-inset);
  }

  .star.filled path {
    fill: #D4C822;
  }
</style>
