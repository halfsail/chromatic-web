<script>
    export let url
    export let linkLabel
</script>



    <a class="itemRow" href="{url}">{linkLabel}

        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 5L19 12L12 19" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </a>    


<style>
    .itemRow {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px;
        border-radius: 16px;
    }

    .itemRow:hover {
        background: var(--neutral-200);
        color: var(--textPrimary);
        transition: all 150ms ease-in-out;
    }

    .itemRow:hover svg {
        transform: translateX(5px);
    }

    a {
        text-decoration: none;
        color: var(--textSecondary);
        user-select: none;
    }
</style>