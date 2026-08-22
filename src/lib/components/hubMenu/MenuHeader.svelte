<script>
    import { gameState } from '$lib/state/GameState.svelte.js';
    import { fade, fly } from 'svelte/transition';
</script>  

{#if gameState.screen === 'home'}
    <div in:fly={{ y: -20, duration: 350 }} out:fade={{ duration: 150 }}>
        <p>chromatic</p>

        <section class="buttonGroup">
            <button onclick={() => gameState.openModal('achievements')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.2998 2.72656L16.9561 3.68091" stroke="black" stroke-width="2" stroke-linecap="round"/>
                <path d="M19.4611 5.29126L18.3879 6.90186L16.0615 6.48425" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20.6623 9.61124L19.1986 10.8775L17.0677 9.85491" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19.0852 14.1978L16.8026 14.4733M16.8026 14.4733L15.8034 12.7111M16.8026 14.4733C13.5905 17.9772 9.50275 16.3086 6.83289 19.8544" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7.7002 2.72656L7.04395 3.68091" stroke="black" stroke-width="2" stroke-linecap="round"/>
                <path d="M4.53891 5.29126L5.61215 6.90186L7.93848 6.48425" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.33768 9.61124L4.8014 10.8775L6.93225 9.85491" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4.91485 14.1978L7.19745 14.4733M7.19745 14.4733L8.1966 12.7111M7.19745 14.4733C10.4095 17.9772 14.4972 16.3086 17.1671 19.8544" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

                4
            </button>
            <button class="round" onclick={() => gameState.openModal('settings')}>
                <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.25 9.75C14.25 11.683 12.683 13.25 10.75 13.25C8.817 13.25 7.25 11.683 7.25 9.75C7.25 7.817 8.817 6.25 10.75 6.25C12.683 6.25 14.25 7.817 14.25 9.75Z" stroke="black" stroke-width="1.5"/>
<path d="M19.5406 6.90201C20.3469 8.29176 20.75 8.98664 20.75 9.75C20.75 10.5134 20.3469 11.2082 19.5406 12.598L17.6169 15.9138C16.8138 17.298 16.4123 17.9902 15.7519 18.3701C15.0916 18.75 14.2902 18.75 12.6873 18.75L8.81267 18.75C7.20982 18.75 6.4084 18.75 5.74807 18.3701C5.08774 17.9902 4.68619 17.298 3.88311 15.9138L1.95942 12.598C1.15314 11.2082 0.75 10.5134 0.75 9.75C0.75 8.98664 1.15314 8.29176 1.95942 6.902L3.88311 3.58621C4.68619 2.20196 5.08774 1.50984 5.74807 1.12992C6.4084 0.75 7.20982 0.75 8.81267 0.75L12.6873 0.75C14.2902 0.75 15.0916 0.75 15.7519 1.12992C16.4123 1.50984 16.8138 2.20197 17.6169 3.58622L19.5406 6.90201Z" stroke="black" stroke-width="1.5"/>
</svg>

            </button>
        </section>
    </div>
{/if}

<style>

div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: blue;
    padding: 1.5rem 2rem;
    padding-top: calc(env(safe-area-inset-top) + 1.5rem);
    width: 100%;
}

.buttonGroup {
    display: flex;
    gap: .5rem;
}

button {
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background-color: lightgray;
    height: 50px;
    min-width: 50px;
    border-radius: 50px;
    padding: 1rem;
    cursor: pointer;
}
button.round {
    height: 50px;
    width: 50px;
}

</style>