<script>
    import { gameData, toggleHaptic, toggleSound, toggleRelaxedMode, nextLevel } from "$lib/state/Store.svelte";
    import { onMount } from "svelte";

    // A variable to track the support status
  let isVibrationSupported = false;
  
  onMount(() => {
    // Check if 'vibrate' method exists on the navigator object
    if ('vibrate' in navigator) {
      isVibrationSupported = true;
    }
  });

</script>

<div class="container">

<section>
    <p class="subHeader">Game Play</p>
    <div class="list_item_grid">
        <div class="icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.66669 8.33508C1.69081 5.49006 1.84876 3.92167 2.88305 2.88738C4.10375 1.66667 6.06845 1.66667 9.99785 1.66667C13.9272 1.66667 15.8919 1.66667 17.1126 2.88738C18.3334 4.10809 18.3334 6.07278 18.3334 10.0022C18.3334 13.9316 18.3334 15.8963 17.1126 17.117C16.0784 18.1513 14.51 18.3092 11.6649 18.3333" stroke="var(--ink-900)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4.16561 10.8333C3.1904 10.8626 2.60897 10.971 2.20666 11.3733C1.80434 11.7756 1.69591 12.3571 1.66669 13.3323M6.66776 10.8333C7.64298 10.8626 8.2244 10.971 8.62672 11.3733C9.02903 11.7756 9.13746 12.3571 9.16669 13.3323M9.16669 15.8344C9.13746 16.8096 9.02903 17.3911 8.62672 17.7934C8.2244 18.1957 7.64298 18.3041 6.66776 18.3333M4.16562 18.3333C3.1904 18.3041 2.60897 18.1957 2.20666 17.7934C1.80434 17.3911 1.69591 16.8096 1.66669 15.8344" stroke="var(--ink-900)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

        </div>
        <div class="copy">
            <p class="label">Puzzle Size</p>
        </div>
        <div class="selectContainer">
        <select name="size" id="puzzleSize" class="dropDown" bind:value={gameData.settings.difficulty} onchange={nextLevel}>
            <option value="easy">Small 4×5</option>
            <option value="normal">Normal 5×6</option>
            <option value="medium">Medium 6×6</option>
            <option value="hard">Hard 7×7</option>
        </select>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 9.00049L11.2929 14.2934C11.6262 14.6267 11.7929 14.7934 12 14.7934C12.2071 14.7934 12.3738 14.6267 12.7071 14.2934L18 9.00049" stroke="var(--ink-900)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        </div>
    </div>

    <div class="list_item_grid">
        <div class="icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.7595 5.50128C11.861 5.21432 11.9163 4.90548 11.9163 4.58374C11.9163 3.06496 10.685 1.83374 9.16626 1.83374C7.64747 1.83374 6.41626 3.06496 6.41626 4.58374C6.41626 4.90548 6.47151 5.21432 6.57305 5.50128C4.47867 5.50893 3.36098 5.58327 2.63838 6.30586C1.91585 7.02839 1.84146 8.14594 1.8338 10.2399C2.12027 10.1388 2.4285 10.0837 2.74959 10.0837C4.26837 10.0837 5.49959 11.315 5.49959 12.8337C5.49959 14.3525 4.26837 15.5837 2.74959 15.5837C2.4285 15.5837 2.12027 15.5287 1.8338 15.4276C1.84146 17.5215 1.91585 18.6391 2.63838 19.3616C3.3609 20.0841 4.47845 20.1585 6.57243 20.1662C6.47129 19.8797 6.41626 19.5715 6.41626 19.2504C6.41626 17.7316 7.64747 16.5004 9.16626 16.5004C10.685 16.5004 11.9163 17.7316 11.9163 19.2504C11.9163 19.5715 11.8612 19.8797 11.7601 20.1662C13.8541 20.1585 14.9716 20.0841 15.6941 19.3616C16.4167 18.639 16.4911 17.5213 16.4987 15.4269C16.7857 15.5285 17.0945 15.5837 17.4163 15.5837C18.935 15.5837 20.1663 14.3525 20.1663 12.8337C20.1663 11.315 18.935 10.0837 17.4163 10.0837C17.0945 10.0837 16.7857 10.139 16.4987 10.2405C16.4911 8.14616 16.4167 7.02846 15.6941 6.30586C14.9715 5.58327 13.8538 5.50893 11.7595 5.50128Z" stroke="var(--ink-900)" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
        </div>

         <div class="copy">
            <p class="label">Relaxed Mode</p>
         </div>

         <div class="control">
            <label class="material-toggle-switch" for="relaxedMode">
                <input id="relaxedMode" type="checkbox" class="material-toggle-input" onclick={toggleRelaxedMode} bind:checked={gameData.settings.relaxedMode}>
                <span class="material-toggle-slider"></span>
            </label>
         </div>
        <p class="description">Lock tiles when moved into correct spot.</p>

    </div>
</section>

<section>
    <p class="subHeader">Effects</p>

    <div class="list_item">
            <div class="icon">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.29169 11C2.29169 6.89481 2.29169 4.84224 3.56699 3.56693C4.8423 2.29163 6.89487 2.29163 11 2.29163C15.1052 2.29163 17.1577 2.29163 18.433 3.56693C19.7084 4.84224 19.7084 6.89481 19.7084 11C19.7084 15.1051 19.7084 17.1577 18.433 18.433C17.1577 19.7083 15.1052 19.7083 11 19.7083C6.89487 19.7083 4.8423 19.7083 3.56699 18.433C2.29169 17.1577 2.29169 15.1051 2.29169 11Z" stroke="var(--ink-900)" stroke-width="1.5"/>
                    <path d="M11.9166 13.2916C11.9166 14.5573 10.8906 15.5833 9.62498 15.5833C8.35933 15.5833 7.33331 14.5573 7.33331 13.2916C7.33331 12.026 8.35933 11 9.62498 11C10.8906 11 11.9166 12.026 11.9166 13.2916ZM11.9166 13.2916V6.41663C12.2222 6.87496 12.4666 8.79996 14.6666 9.16663" stroke="var(--ink-900)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="copy">
                <p class="label">Sounds Effect</p>
            </div>
            
            <div class="control">
                <label class="material-toggle-switch" for="soundEnabled">
                    <input id="soundEnabled" type="checkbox" class="material-toggle-input" onclick={toggleSound} bind:checked={gameData.settings.soundEnabled}>
                    <span class="material-toggle-slider"></span>
                </label>
            </div>
        
    </div>
    {#if isVibrationSupported}
    <div class="list_item haptics">
        <div class="icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.1666 11H16.5L13.75 19.25L8.24998 2.75L5.49998 11H1.83331" stroke="var(--ink-900)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>

         <div class="copy">
            <p class="label">Haptic Feedback</p>
         </div>

         <div class="control">
            <label class="material-toggle-switch" name="hapticToggle" >
                <input id="hapticToggle" type="checkbox" class="material-toggle-input" onclick={toggleHaptic} bind:checked={gameData.settings.hapticEnabled}>
                <span class="material-toggle-slider"></span>
            </label>
         </div>
    </div>
    {/if}
</section>

</div>

<style>
    .container, section {
        padding: 0 .5rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    section {
        padding: 0;
        gap: .5rem;
    }


.subHeader {
    font-size: var(--font-xs);
    font-family: "Bricolage Grotesque", sans-serif;
    font-weight: 500;
    color: var(--ink-400);
    line-height: 160%;
    margin: 0;
    padding: .25rem 0;
    text-transform: uppercase;
    letter-spacing: .5px;
}

.list_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: .5rem;
    min-height: 40px;
    color: var(--ink-700);
}

.list_item_grid {
    display: grid;
    grid-template-columns: 1fr 8fr 1fr;
    grid-template-rows: 20px auto;
    gap: .5rem;
    align-items: center;
    padding-top: .5rem;
    min-height: 40px;
    color: var(--ink-700);

    .icon {
        min-height: 20px;
        grid-column: 1/2;
    }
    .control {
        min-height: 20px;
        grid-column: 3/4;
    }
    .copy {
        grid-column: 2/3;
    }
    .description, .dropDown {
        grid-column: 2/-1;
        grid-row: 2/3;
    }
    .selectContainer {
        position: relative;
        grid-column: 1/-1;
        grid-row: 2/3;
        margin: .5rem 0 .75rem 0;

        svg {
            position: absolute;
            right: 1rem;
            width: 1.5rem;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            color: var(--ink-500);
        }
    }
    .dropDown {
        width: 100%;
        min-height: 40px;
        border-radius: 30px;
        padding: 4px 1rem;
        cursor: pointer;
        
        font-size: var(--font-sm);
        border: 1px solid var(--ink-200);
        background-color: var(--ink-100);
        color: var(--ink-900);
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;

        &:active, &:focus {
            box-shadow: none;
            border-color: var(--ink-300);
            outline: none;
        }

        &:hover {
            background-color: var(--ink-50);
            border-color: var(--ink-200);
            border-radius: var(--rad-md);
        }
    }
}
.icon,.control {
    display: flex;
    align-items: center;
    justify-content: center;
}
.icon svg {
    height: .8lh;
    aspect-ratio: 1;
    color: currentColor
}
.copy {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-right: auto;
}
.label {
    font-size: var(--font-md);
    line-height: 140%;
    font-family:  "Bricolage Grotesque", sans-serif;
    color: currentColor;
}
.description {
    font-size: var(--font-sm);
    line-height: 140%;
    color: var(--color-text-secondary);
    text-wrap: pretty;
    color: var(--ink-400);
}

/* Hide the default checkbox */
.material-toggle-input {
  display: none;
}

.material-toggle-switch {
    display: flex;
    align-items: center;
    height: 24px;
}


/* Style the slider (the track of the switch) */
.material-toggle-slider {
  position: relative;
  display: inline-block;
  width: 40px; /* Adjust as needed */
  height: 24px; /* Adjust as needed */
  background-color: var(--ink-200); /* Unchecked state color */
  border-radius: 50px; /* Half of height for rounded corners */
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Style the thumb (the movable part of the switch) */
.material-toggle-slider::before {
  content: "";
  position: absolute;
  width: 20px; /* Adjust as needed */
  height: 20px; /* Adjust as needed */
  background-color: white;
  border-radius: 40px;
  top: 2px; /* Center vertically */
  left: 2px; /* Initial position */
  transition: transform 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Material shadow */
}

/* Checked state: change background and move thumb */
.material-toggle-input:checked + .material-toggle-slider {
  background-color: #2196F3; /* Checked state color (Material Blue) */
}

.material-toggle-input:checked + .material-toggle-slider::before {
  transform: translateX(16px); /* Move thumb to the right */
}




</style>