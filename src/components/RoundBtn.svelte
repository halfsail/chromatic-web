<script>
    export let type;
</script>

<button on:click>
    {#if type==="settings"}
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.07692 8L15.0769 8M15.0769 8C15.0769 9.65686 16.4201 11 18.0769 11C19.7338 11 21.0769 9.65685 21.0769 8C21.0769 6.34315 19.7338 5 18.0769 5C16.4201 5 15.0769 6.34315 15.0769 8ZM9.07692 16L21.0769 16M9.07692 16C9.07692 17.6569 7.73377 19 6.07692 19C4.42007 19 3.07692 17.6569 3.07692 16C3.07692 14.3431 4.42007 13 6.07692 13C7.73377 13 9.07692 14.3431 9.07692 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    {/if}
    {#if type==="restart"}
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.0769 18.8746C19.1982 17.3291 20.5769 14.8256 20.5769 12C20.5769 7.3056 16.7713 3.50002 12.0769 3.50002L12 3.5M12.0769 20.5C7.38247 20.5 3.57689 16.6944 3.57689 12C3.57689 9.17448 4.95555 6.67095 7.07689 5.12542M11.0769 22.4L13.0769 20.4L11.0769 18.4M13.0769 5.60002L11.0769 3.60002L13.0769 1.60002" stroke="currentColor" stroke-width="2" stroke-linecap="square"/>
    </svg>
    {/if}
    {#if type==="hint"}
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C7.40004 4 3.51033 7.36843 2.23132 12C3.51034 16.6316 7.40005 20 12 20C16.5999 20 20.4896 16.6316 21.7686 12C20.4896 7.36841 16.5999 4 12 4ZM12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="currentColor"/>
    </svg>
    {/if}
</button>

<style>
    button {
        --scaleOut: cubic-bezier(.68,-.55,.265,1.55);
        all: unset;
        background: var(--neutral-900);
        color: var(--textOnAccent);
        height: 44px;
        width: 44px;
        display: grid;
        border-radius: 50%;
        transition: transform 150ms var(--scaleOut);
    }
    button:hover {
        transform: scale(1.2);
    }
    button:active {
        transform: scale(.8);
    }
    button svg {
        margin: auto;
    }
</style>