<script>
  let {
    onclick,
    label,
    //...rest           // Catch-all for things like disabled, aria-label, etc.
  } = $props();
</script>

<button {onclick} aria-label={label}>{label}</button>

<style>
  button {
      all: unset;
      cursor: pointer;
      font-size: var(--font-sm);
      font-weight: 500;
      color: var(--text-color-primary);
      border-bottom: 1px solid transparent;
      transition: all 150ms ease;
      text-decoration: underline;
      text-underline-offset: 3px;
      text-decoration-thickness: 2px;
      text-decoration-color: light-dark(var(--grey-5), var(--grey-7));

      &:hover {
          text-decoration-color: light-dark(var(--grey-9), var(--grey-1));
      }
      &:active {
          text-underline-offset: 1px;
      }
  }


    @media (hover: hover) {

    }

</style>
