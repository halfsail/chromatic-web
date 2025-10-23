<script>
  import { gameData } from '$lib/state/Store.svelte';
  import { createEventDispatcher } from 'svelte';
  
  let { isOpen = $bindable(false) } = $props();
  
  const dispatch = createEventDispatcher();
  
  function closeMenu() {
    isOpen = false;
    dispatch('close');
  }
  
  function handleBackdropClick() {
    closeMenu();
  }
  
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Backdrop and Side Menu -->
{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div 
    class="backdrop"
    onclick={handleBackdropClick}
    role="button"
    tabindex="-1"
  >
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <aside 
      class="side-menu"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-title"
    >


      <section>
        
        <ul>
            <li class="row">
                <div class="col">
                    <p>Chromatic</p>
                    <small>Sort colors to make gradients.</small>
                </div>
            </li>
            <li class="row">
                <div class="col">
                    <p>Daily Hue</p>
                    <small>Guess the color based on a name.</small>
                </div>
            </li>
        </ul>
      </section>

      <section>
        <ul>
            <li><a href="#home">How to play</a></li>
            <li><a href="#home">About</a></li>
            <li><a href="#home">Changelog</a></li>
        </ul>
      </section>

      <section>
        <ul>
            <li>
                <label for="">Sound Effects</label>
                <input type="checkbox" name="" id="" />
            </li>
            <li>
                <label for="">Haptics</label>
                <input type="checkbox" name="" id="" />
            </li>
        </ul>
      </section>
      

      
    </aside>
  </div>
{/if}

<style>

  

  
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(100px) saturate(1.5);
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  }
  
  .side-menu {
    padding: 2rem 1rem;
    width: 100%;
    max-width: 350px;
    /* background: rgba(255, 255, 255, 0.5); */
    /* border-right: 1px solid var(--surface-edge-3); */
    display: flex;
    flex-direction: column;
    gap: 1rem;
    animation: slideIn 0.3s ease;
    transform-origin: right;
    height: 100%;
  }

  section {
    display: flex;
    flex-direction: column;
    
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 1rem;
    padding: 1rem 0;
    border-radius: 1.5rem;
    /* background-color: white; */
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }

  li {
    padding: 1rem 1rem;
  }

  li:hover {
    background-color: var(--surface-1);
  }


  p {
    /* margin: 0 0 0.25rem; */
    margin: 0;
    text-transform: capitalize;
  }
  small {
    opacity: 0.5;
  }



  .col {
    display: flex;
    flex-direction: column;
  }
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  

  

  

  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
</style>