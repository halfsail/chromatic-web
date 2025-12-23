<script>
  let {
    onclick,
    label,
    disabled,
    //...rest           // Catch-all for things like disabled, aria-label, etc.
  } = $props();
</script>

<button {onclick} disabled={disabled} aria-label={label}>
      {label}
</button>

<style>
    button {
        all: unset;
        display: grid;
        place-content: center;
        gap: .5rem;
        width: 100%;
        letter-spacing: .5px;
        cursor: pointer;
        border: 1px solid transparent;
        border-radius: var(--rad-xl);
        transition: all var(--slow) var(--shoot-ease);
        height: 48px;
        background-color: light-dark(var(--grey-9), var(--grey-2));
        color: light-dark(var(--grey-0), var(--grey-10));
        letter-spacing: 0.02em;
        font-family: "Bricolage Grotesque", system-ui, sans-serif;
        font-weight: 450;
        text-transform: capitalize;
    }

    button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }


    button:active{
        transform: scale(0.9);
        background-color: light-dark( var(--grey-8), var(--grey-4));
    }


    @media (hover: hover) {
        button:hover {
          transition: all var(--slow) var(--shoot-ease);
            border-radius: var(--rad-md);
            :global(svg) {
                transform: scale(1.15);
            }
        }

    }

</style>
