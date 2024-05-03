<script>
    import { fly } from 'svelte/transition';
    import { flip } from 'svelte/animate'
	import { quintOut } from 'svelte/easing';

    import { hues } from '../lib/hues'
    import { clickOutside, randomNumber, getBackground, getColors, shuffleLevel, didWin, getLevel } from '../lib/logic'
    import Swatch from '../components/Swatch.svelte';
    import RoundBtn from '../components/RoundBtn.svelte';
    import Modal from '../components/Modal.svelte';
    import Toggle from '../components/Toggle.svelte';

    // import sounds
    import { Sound } from 'svelte-sound';
    import pop_down from "../assets/sounds/pop_down.mp3"
    import pop_up_off from "../assets/sounds/pop_up_off.mp3"
    import pop_up_on from "../assets/sounds/pop_up_on.mp3"
    import kirakira from "../assets/sounds/kirakira.mp3"

    const clickDown = new Sound(pop_down)
    const clickUpOff = new Sound(pop_up_off)
    const clickUpOn = new Sound(pop_up_on)
    const winSound = new Sound(kirakira)

    let game = getLevel(0, 'any')

    // let columns = 3
    // let rows = 5
    // let colors = ['#6ACBBA', '#646AB3', '#DBE843', '#EC8282']
    // let order = getColors(colors, columns, rows)
    // let palette = []
    // let locks = [2, 12, 14]
    // let containerBg = getBackground(colors)


    let aboutModal = false
    let settingModal = false

    let win = false
    let selectedIndex = null

    let playerMoves = 0
    let playerHints = 0
    let playerTime = 0

    let hasSound = true
    let hasHaptics = true
    let hasMotion = true


    
    // palette = shuffleLevel(order, locks, columns, rows)

    // sound functions
    function playClickDown() {
        if (hasSound === true) {
            clickDown.play()
        }
    }
    function playClickUp() {
        if (hasSound === true) {
            clickUpOn.play()
        }
    }
    function playSwap() {
        if (hasSound === true) {
            clickUpOff.play()
        }
    }
    function playWinChime() {
        if (hasSound === true) {
            winSound.play()
        }
    }
    // function makeAbsolute(e) {
    //     e.target.style.position = "absolute"
    // }



    function winCheck() {
        if (didWin(game.order, game.palette, game.colors, game.rows, game.columns) === true) {
                win = true;
                playWinChime()
            } else {
                console.log("You didn't win")
            }
    }

    function selectSwatch(index) {
        if(game.locks.includes(index) ||  selectedIndex === index) {
            return selectedIndex = null
        }
        if (selectedIndex === null) {
            // selecting a cell
            selectedIndex = index
            playClickDown()
            playClickUp()
        } else {
            // already selected a cell will swap them
            swapSwatch(selectedIndex, index)
            // check if user won
            winCheck()
        }
    }

    function swapSwatch(item1, item2) {
        // pass in all colors and clone
        let tempPalette = game.palette
        // swap the two items
        // [temp[item1], temp[item2]] = [temp[item2], temp[item1]];
        const temp = tempPalette[item1]
        tempPalette[item1] = tempPalette[item2]
        tempPalette[item2] = temp

        // update colors
        game.palette = tempPalette
        // reset selected
        selectedIndex = null
        playerMoves = playerMoves+1
        playSwap()
    }

    function hint() {
        const nonInteractive = [...game.locks]
        const indexOrder = [...Array(game.columns* game.rows).keys()]
        // remove these from correct array
        let hintCells = nonInteractive.reduce((b, a)=>(b.includes(a) && b.splice(b.indexOf(a),1), b), [...indexOrder])
        // pick random color and its index
        const hintIndex = hintCells[Math.floor(Math.random() * hintCells.length)]
        const randomColor = game.order[hintIndex]
        // push new locked cell to lock array
        game.locks.push(hintIndex)
        // swap location of colors
        const oldIndex = game.palette.indexOf(randomColor)

        swapSwatch(oldIndex, hintIndex)
        playerHint = playerHints++
        winCheck()

    }



    function nextLevel() {
        console.log(hues[1])
        // generate new colors
        colors = hues[randomNumber(0, hues.length)]
        order = getColors(colors, columns, rows)
        palette = shuffleLevel(order, locks, columns, rows)
        // reset gamestates
        selectedIndex = null
        win = false
        playerHints = 0
        playerMoves = 0
        playerTime = 0
        
    }

    // swatch related function
    function isLock(index) {
        return game.locks.includes(index)
    }
    function isCorner(cellIndex) {
        // first and last corner handle throught css in swatch
        if (cellIndex === 0) {
            return 'tl_corner'
        }
        if (cellIndex === (game.columns - 1)) {
            return 'tr_corner'
        }
        if (cellIndex === (game.palette.length - game.columns)) {
            return 'bl_corner'
        }
        if (cellIndex === (game.palette.length - 1)) {
            return 'br_corner'
        }
    }

    // handle deselecting if user clicks outside of gameboard
    function handleClickOutside(event) {
        selectedIndex = null
    }

    // modal functions
    function toggleSettings() {
        settingModal = !settingModal
    }
 
</script>

<main class:win={win}>
<header>
    <button on:click={nextLevel}>next</button>
    <button on:click={toggleSettings}>toggle settings</button> <p>{settingModal}</p>
</header>

<div class="game" style="--color0: {game.colors[0]}; --color1: {game.colors[1]}; --color2: {game.colors[2]}; --color3: {game.colors[3]};">
    {#key game}
    <div class="board_container" style="--containerBg: {game.containerBg}" use:clickOutside on:click_outside={handleClickOutside}
        out:fly={{ duration: 1000, x: '-90vw', opacity: 0, easing: quintOut }} 
        in:fly={{ duration: 1000, x: '90vw', opacity: 1, easing: quintOut }}>
        <div class="game_board" style="--colSize: {game.columns}; --rowSize: {game.rows} " >
            {#each game.palette as color, i (color)}
            <div class="swatch_container" animate:flip={{ duration: 350, easing: quintOut }}>
                <Swatch hue={color} index={i} {selectedIndex} corner={isCorner(i)} lock={isLock(i)} on:click={selectSwatch(i)}/>
            </div>
            {/each}
        </div>
    </div>

    {/key}

    <div class="sidebar_group">
        <div class="results">
            {#if playerHints != 0}
            <div>
                <p class="result_title">{playerHints}</p>
                <p class="result_label">Hints</p>
            </div>
            {/if}
            <div>
                <p class="result_title">{playerMoves}</p>
                <p class="result_label">Moves</p>
            </div>
            <div>
                <p class="result_title">{playerTime}</p>
                <p class="result_label">Time</p>
            </div>
            <button class="win_button" on:click={nextLevel}>Next Level</button>
        </div>
        <div class="controls">
            <RoundBtn type="hint" on:click={hint} />
            <RoundBtn type="settings" on:click={toggleSettings}/>
            <div class="resetGroup">
                <RoundBtn type="restart" />
                <div>
                    <p>New Level</p>
                    <div>
                        <span>Difficultity</span>
                        <select name="" id="">
                            <option value="5">any</option>
                            <option value="1">easy</option>
                            <option value="2">medium</option>
                            <option value="3">hard</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<Modal showModal={settingModal}>
    <h2 slot="header">Settings</h2>
    <Toggle bind:checked={hasSound} label="Sound Effects" name="SoundCheck" />
    <Toggle bind:checked={hasMotion} label="Reduced Motion" name="MotionCheck" />
    <Toggle bind:checked={hasHaptics} label="Haptics" name="HapticCheck" />
</Modal>

<footer>footer</footer>

</main>





<style>
    :root {
        --cornerRadius: 16px;
        /* colors tokens */
        --neutral-100: #fff;
        --neutral-300: #DDE4EE;
        --neutral-600: #778BA4;
        --neutral-800: #333B48;
        --neutral-900: #171E26;
        /*  Text Colors */
        --textPrimary: var(--neutral-900);
        --textSecondary: var(--neutral-800);
        --textTertiary: var(--neutral-600);
        --textDisabled: var(--neutral-300);
        --textOnAccent: var(--neutral-100);

    }
    main {
        position: relative;
        /* display: grid;
        grid-template-columns: [l_margin] minmax(24px, 1fr) [content] minmax(250px, 350px) [r_margin] minmax(24px, 1fr);
        grid-template-rows: [header] 1fr [content] minmax(350px, 8fr) [footer] 1fr; */
        gap: 16px;
        margin: 16px;
        height: 100dvh;
    }
    .game {
        position: relative;
        align-self: center;
        justify-self: center;
        grid-area: content;

        display: grid;
        gap: 24px;
        grid-template-columns: [l_margin] minmax(24px, 1fr) [content] minmax(300px, 420px) [r_margin] minmax(24px, 1fr);
        grid-template-rows: [header] 1fr [content] minmax(350px, 8fr) [footer] 1fr;
    }


    .board_container {
        display: flex;
        height: 100%;
        min-width: 300px;
        width: 100%;
        max-height: 720px;
        max-width: 420px;
        border-radius: var(--cornerRadius);
        background: var(--neutral-600);
        will-change: transform;
        grid-area: content;
        
        /* background-color: #E5E9F2; */
    }
    .board_container:before{
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border-radius: var(--cornerRadius);
        background: transparent;
    }

    .win .board_container {
        background: linear-gradient(90deg, var(--color0), var(--color2));
    }
    .win .board_container:before {
        mask-image: linear-gradient(to bottom, transparent, black);
        background: linear-gradient(90deg, var(--color1), var(--color3));
    }

    .game_board {
        z-index: 2;
        display: grid;
        grid-template-columns: repeat(var(--colSize), 1fr);
        grid-template-rows: repeat(var(--rowSize, 1fr));
        height: 100%;
        width: 100%;
        border-radius: var(--cornerRadius);
        border: 1px solid var(--neutral-300);
        transition: filter 350ms ease-out;
        transition: opacity 350ms ease-in-out;;
        /* overflow: hidden; */
    }

    .win .game_board {
        filter: blur(25px) saturate(1.1);
        opacity: 0;
        overflow: hidden;
        pointer-events: none;
    }

    .sidebar_group {
        grid-row: 2/3;
        grid-column: 3/4;
        align-self: end;
        padding: 16px 0;
    }

    .results, .controls {
        display: flex;
        flex-direction: column;
        gap: 24px;
        font-family: sans-serif;
        align-self: end;
        opacity: 0;
        transform: translateX(-64px);
        display: none;
        transition: transform 250ms ease;
        transition: all 250ms ease
    }
    .controls {
        display: flex;
        opacity: 1;
        transform: translateX(0);    
    }
    .win .results {
        opacity: 1;
        transform: translateX(0);
        display: flex;
    }
    .win .controls {
        opacity: 0;
        transform: translateX(-64px);
        display: none;
    }
    .win_button {
        all: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 200px;
        background: black;
        color: var(--textOnAccent);
        height: 48px;
        width: 172px;
    }
    .result_title {
        font-size: 32px;
        font-weight: 600;
        margin: 0;
        margin-bottom: .5ch;
    }
    .result_label {
        opacity: .7;
        margin: 0;
    }

    .resetGroup {
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 20px;
        font-family: sans-serif;
    }
    .resetGroup p {
        margin: 0;
        font-weight: 600;
        letter-spacing: .5px;
    }
    select {
        all: unset;
        font-size: 16px;
    }
    option, span {
        font-size: 16px;
    }



</style>