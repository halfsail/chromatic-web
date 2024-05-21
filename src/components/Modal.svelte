<script>
	export let showModal; // boolean

	let dialog; // HTMLDialogElement

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="dialog_container" on:click|stopPropagation>
        <div class="modal">
            <slot name="header" />
		<slot />
        </div>
		<!-- svelte-ignore a11y-autofocus -->
		<button class="closeButton" autofocus on:click={() => dialog.close()}>
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6.28223L17.5 17.7822M17.5 6.28223L6 17.7822" stroke="white" stroke-width="2.5"/>
            </svg>    
        </button>
	</div>
</dialog>

<style>
    dialog {
        border: none;
		padding: 0;
        background: transparent;
    }
	 .dialog_container {
        display: flex;
        flex-direction: column;
        align-items: center;
		
        gap: 24px;
	}
	dialog::backdrop {
		background: rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(70px) saturate(1.5);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	h2 {
		font-size: 18px;
	}

    .modal {
        width: 260px;
        padding: 0 0 24px 0;
        display: flex;
        flex-direction: column;
        gap: 24px;
        font-family: sans-serif;
        font-size: 18px;
    }

    .closeButton {
        all: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        background: black;
        border-radius: 50%;
        height: 48px;
        width: 48px;
		cursor: pointer;

    }
	@keyframes zoom {
		from {
			transform: scale(0.85);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}

	@media screen and (max-height: 650px) {
		.modal {
			flex-direction: row;
			width: 100%;
		}
	}
</style>
