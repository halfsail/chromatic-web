<script>
  let {
    onclick,
    label,
    type = 'secondary', // Default to primary or 'subtle'
    icon,             // This will be our snippet (slot)
    disabled,
    //...rest           // Catch-all for things like disabled, aria-label, etc.
  } = $props();
</script>

<button class:btn-secondary={type === 'secondary'} class:btn-subtle={type === 'subtle'} {onclick} disabled={disabled} aria-label={label}>
  {#if icon}
    <div class="btn-surface">
      {@render icon()}
    </div>
  {/if}
  {#if label && type === 'secondary'}
    <span class="btn-label">{label}</span>
  {/if}
</button>

<style>
    button {
        all: unset;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: .5rem;
        letter-spacing: .5px;
        cursor: pointer;
    }

    button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    .btn-surface {
        display: grid;
        place-items: center;
        border-radius: var(--rad-round);
        overflow: hidden;
        border: 1px solid transparent;
        --icon-color: light-dark(var(--grey-8), var(--grey-1));
        transition: border-radius var(--slow) var(--shoot-ease), background-color var(--slow) ease;
        transform: scale(1);

        :global(svg) {
            width: 24px;
            height: 24px;
            /* fill: var(--icon-color); */
            transition: all var(--slow) var(--shoot-ease);
        }
    }

    @starting-style {
        .btn-secondary .btn-surface {
            transform: scale(0);
        }
    }


    .btn-subtle .btn-surface {
        height: 48px;
        aspect-ratio: 1;
        opacity: .65;
    }
    .btn-secondary .btn-surface {
        background: light-dark(var(--grey-2), var(--grey-8));
        height: 56px;
        aspect-ratio: 1;
    }

    .btn-label {
        font-size: var(--font-xs);
        letter-spacing: inherit;
        color: light-dark(var(--grey-6), var(--grey-5));
        opacity: 1;
        transition-delay: 500ms;
    }
    @starting-style {
        .btn-label {
            opacity: 0;
        }
    }

    button:active .btn-surface {
        transform: scale(0.9);
    }


    @media (hover: hover) {
        button:hover .btn-surface {
            border-radius: var(--rad-md);
            :global(svg) {
                transform: scale(1.15);
            }
        }

        .btn-subtle:hover .btn-surface {
            --icon-color: light-dark(var(--grey-9), var(--grey-1));
            background: light-dark(var(--grey-2), var(--grey-8));
            opacity: 1;
        }

        button:hover .btn-label {
            color: light-dark(var(--grey-8), var(--grey-2));
            transition-delay: 0ms;

        }
    }

</style>
