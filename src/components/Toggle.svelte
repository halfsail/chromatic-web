<script>
    export let label
    export let checked
    export let name
</script>

<div class="inputRow">
    <p>{label}</p>
    <label for="{name}" class:check={checked}>
        <input bind:checked={checked} id="{name}" class="checkbox_container" type="checkbox" on:click/>
        <div class="twoDots">
            <div class="emptyDot">
                <svg class="noToggle" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6.28223L17.5 17.7822M17.5 6.28223L6 17.7822" stroke="black" stroke-width="2.5"/>
                </svg>    
            </div>
            <div class="checkedDot">
                <svg class="yesToggle" viewBox="0 0 21 21">
                    <polyline points="5 10.75 8.5 14.25 16 6"></polyline>
                </svg>
            </div>
        </div>
    </label>
</div>

<style>
    p {
        margin: 0;
        user-select: none;
    }
    .inputRow  {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
    }

    label {
        all: unset;
        position: relative;
        display: flex;
        justify-items: center;
        align-items: center;
        height: 24px;
        width: 24px;
        border: 2px solid black;
        box-shadow: inset 0 0 0 2px black;
        border-radius: 50%;
        cursor: pointer;

        overflow: hidden;
    }
    input {
        display: none;
    }

    .twoDots {
        display: grid;
        overflow: hidden;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;
        height: 24px;
        min-width: 48px;
        transition: all 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
        
    }
    .emptyDot {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .check .twoDots {
        transform: translateX(-24px);
    }
    .check .noToggle {
        transform: scale(.8);
    }
    .check .yesToggle {
        transform: scale(1);
        transition-delay: 400ms;
    }
    .emptyDot {
        background: transparent;
        height: 100%;
        width: 100%;
        border-radius: 50%;
    }
    .checkedDot {
        background: black;
        height: 100%;
        width: 100%;
        border-radius: 50%;
        display: grid;
    }

    svg {
        pointer-events: none;
        fill: none;
        stroke-width: 2px;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke: white;
        margin: auto;
        width: 21px;
        height: 21px;
    }


</style>