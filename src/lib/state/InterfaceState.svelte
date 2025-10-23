<script module>

export const uiState = $state({
    modals: {
        sidebar: false,
        help: false,
    },
    hueRotate: 0
});

export function openMenu(name) {
    uiState.modals[name] = true;
    console.log(uiState.modals)
}

export function closeMenu(name) {
    uiState.modals[name] = false;
    console.log(uiState.modals)
}

</script>

