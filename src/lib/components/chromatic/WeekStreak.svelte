<script>
  import {stats, nextLevel} from '../../state/Store.svelte';
  import { closeMenu } from '$lib/state/InterfaceState.svelte';
  import {onMount} from 'svelte';

  let weekDays = [];

  function getCurrentWeek() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    const monday = new Date(today.setDate(diff));

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  }

  function isFutureDate(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate > today;
  }

  function isToday(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate.getTime() === today.getTime();
  }

  function isPastDate(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  }

  function isCompleted(date, completedDates) {
    return completedDates.includes(date.toISOString().split('T')[0]);
  }

  function isMissed(date, completedDates) {
    return isPastDate(date) && !isCompleted(date, completedDates);
  }

  function goToLevel(date) {
    closeMenu("sidebar");
    nextLevel(date);
  }
  onMount( () => {
    weekDays = getCurrentWeek()
  } )

</script>

<div class="week-view">
  {#each weekDays as day}
    <button
      class="day"
      class:missed={isMissed(day, stats.completedDates)}
      class:today={isToday(day)}
      class:future={isFutureDate(day)}
      class:completed={isCompleted(day, stats.completedDates)}
      disabled={isFutureDate(day)}
      onclick={() => {
        if (!isFutureDate(day)) {
          goToLevel(day.toISOString().split("T")[0]);
        }
      }}
      >
      <span>{day.toLocaleDateString('en', { weekday: 'narrow' })}</span>
      <div class="indicator">
        {#if stats.completedDates.includes(day.toISOString().split('T')[0])}
            <span class="checkmark">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="var(--onAccent)" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </span>
            {:else}
            <span class="day-number">{day.getDate()}</span>
        {/if}
      </div>
    </button>
  {/each}
</div>


<style>
    .week-view {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
    .checkmark {
        display: grid;
        place-items: center;
        svg {
            width: 1rem;
            height: 1rem;
            mix-blend-mode: luminosity;
            opacity: .8;
        }
    }

    .day {
        --accent-color: var(--accent);
        --text-color: var(--onAccent);
        all: unset;
        cursor: pointer;
        padding: .5rem .25rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        border-radius: var(--rad-lg);
        color: var(--text-color-secondary);

        span {
            font-size: var(--font-sm);
        }

        &:hover {
            background-color: var(--surface-inset);
        }

        &:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

        &:active {
            transform: scale(0.95);
        }
    }

    .day .indicator {
        width: 2rem;
        aspect-ratio: 1;
        border-radius: 50%;
        background-color: var(--surface-inset);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: inset 0 0 0 1px var(--surface-edge);

    }

    .future .indicator {
        border: 0;
        background: var(--surface-inset);
    }




    .today span {
        font-weight: 600;
        color: var(--text-color-primary);
    }

    .today .day-number {
        display: none;
    }

    .today .indicator {
      box-shadow: inset 0 0 0 .6rem var(--accent-color);
        background-color: var(--surface-raised);
        /*color: var(--ink-900);*/
        font-weight: 600;
        transition: box-shadow 0.3s ease;


        &:hover {
          box-shadow: inset 0 0 0 .6rem var(--accent-color);
        }
    }

    .completed .indicator {
        background: var(--accent-color);
        /*color: var(--ink-0);*/
    }

    .missed .indicator {
      box-shadow: none;
        border: dashed 1.5px var(--surface-edge);
    }


</style>
