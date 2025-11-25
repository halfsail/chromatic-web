<script>
  import {gameData, nextLevel} from '../../state/Store.svelte';
  import { closeMenu } from '$lib/state/InterfaceState.svelte';
  import {onMount} from 'svelte';
  
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
  
  $: weekDays = getCurrentWeek();

</script>

<div class="week-view">
  {#each weekDays as day}
    <button 
      class="day" 
      class:missed={isMissed(day, gameData.stats.completedDates)}
      class:today={isToday(day)}
      class:future={isFutureDate(day)} 
      class:completed={isCompleted(day, gameData.stats.completedDates)}
      disabled={isFutureDate(day)}
      onclick={() => {
        if (!isFutureDate(day)) {
          goToLevel(day.toISOString().split("T")[0]);
        }
      }}
      >
      <span>{day.toLocaleDateString('en', { weekday: 'narrow' })}</span>
      <div class="indicator">
        {#if gameData.stats.completedDates.includes(day.toISOString().split('T')[0])}
            <span class="checkmark">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </span>
        {/if}
      </div>
    </button>
  {/each}
</div>


<style>
    .week-view {
        display: flex;
    }
    .checkmark {
        color: white;
        display: grid;
        place-items: center;
        svg {
            width: 1rem;
            height: 1rem;
            color: white;
        }
    }

    .day {
        --accent-color: #EBC16E;
        all: unset;
        cursor: pointer;
        padding: .5rem .5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        border-radius: var(--rad-lg);
        color: var(--ink-600);

        span {
            font-size: var(--font-sm);
        }
        
        &:hover {
            background-color: var(--ink-100);
        }

        &:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

        &:active {
            transform: scale(0.95);
        }
    }

    .day span {
      color: var(--ink-500);
    }

    .day .indicator {
        width: 1.75rem;
        aspect-ratio: 1;
        border-radius: 50%;
        background-color: #e0e0e0;
        display: flex;
        align-items: center;
        justify-content: center;
        
    }

    .future .indicator {
        border: 0;
        background: rgb(0 0 0 / 20%);
    }

    
    
    
    .today span {
        font-weight: 600;
        color: var(--ink-900);
    }
    
    .today .indicator {
        box-shadow: inset 0 0 0 .4rem var(--accent-color);
        background-color: var(--ink-0);
        color: var(--ink-900);
        font-weight: 600;
        transition: box-shadow 0.3s ease;
        

        &:hover {
          box-shadow: inset 0 0 0 .6rem var(--accent-color);
        }
    }

    .completed .indicator {
      box-shadow: none;
        background-color: var(--accent-color);
        color: var(--ink-0);
    }

    .missed .indicator {
        border: dashed 1.5px var(--ink-300);
    }

    
</style>