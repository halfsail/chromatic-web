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
    import Linkrow from '../components/Linkrow.svelte';

    // import sounds
    import { Sound } from 'svelte-sound';
    import pop_select from "../assets/sounds/pop_select.mp3"
    import pop_swap from "../assets/sounds/pop_up_off.mp3"
    import kirakira from "../assets/sounds/kirakira.mp3"
    

    const clickSwap = new Sound(pop_swap)
    const clickSound = new Sound(pop_select)
    const winSound = new Sound(kirakira)

    let game = getLevel(0, 'any')

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
    let setDiffultity = 'any'


    
    // palette = shuffleLevel(order, locks, columns, rows)

    function playEffects(type) {
        playVibrate(type)
        playSound(type)
    }

    function playVibrate(type) {
        if (hasHaptics === true) {
            switch (type) {
                case 'click':
                    navigator.vibrate([40,20])
                    break;
                case 'swap':
                    navigator.vibrate([50])
                    break;
                case 'win':
                    navigator.vibrate([50,50,50])
                    break;
                case 'error':
                    break;
                default:
                    break;
            }
        }
    }


    function playSound(type) {
        if (hasSound === true) {
            switch (type) {
                case 'click':
                    clickSound.play()
                    break;
                case 'swap':
                    clickSwap.play()
                    break;
                case 'win':
                    winSound.play()
                    break;
                default:
                    break;
            }
        }
    }

    function winCheck() {
        if (didWin(game.order, game.palette, game.colors, game.rows, game.columns) === true) {
                win = true;
                playEffects('win')
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
            playEffects('click')
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
        playEffects('swap')
    }

    function hint() {
        playEffects('click')
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

    function userTap() {
        playEffects('click')
    }



    function nextLevel() {
        playEffects('click')
        game = getLevel(game.levelIndex, setDiffultity)
        // reset player movement
        selectedIndex = null
        // reset stats
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
        playEffects('click')
        settingModal = !settingModal
    }
    function toggleWin() {
        win = !win
    }
 
</script>

<main class:win={win}>
<div class="game" style="--color0: {game.colors[0]}; --color1: {game.colors[1]}; --color2: {game.colors[2]}; --color3: {game.colors[3]};">
    
        
        <div class="board_container" 
        use:clickOutside 
        on:click_outside={handleClickOutside}
        >

        {#key game.levelIndex}

            <div class="game_board" style="--colSize: {game.columns}; --rowSize: {game.rows} " 
                out:fly|local={{ duration: 1000, x: '-90vw', opacity: 0, easing: quintOut }} 
                in:fly|local={{ duration: 1000, x: '90vw', opacity: 1, easing: quintOut }}
            >
                {#each game.palette as color, i (color)}
                <div class="swatch_container" animate:flip={{ duration: 350, easing: quintOut }}>
                    <Swatch hue={color} index={i} {selectedIndex} corner={isCorner(i)} lock={isLock(i)} on:click={selectSwatch(i)}/>
                </div>

                {/each}
            </div>

        {/key}

        </div>
        

        <div class="control_group">
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
                <RoundBtn type="restart" on:click={nextLevel}/>
                <div class="menuGroup">
                    <RoundBtn type="settings" on:click={toggleSettings}/>
                    <div>
                        <p>CrossChroma</p>
                        <div>
                            <span>Difficultity</span>
                            <select name="" id="" bind:value={setDiffultity}>
                                <option value="any">any</option>
                                <option value="easy">easy</option>
                                <option value="medium">medium</option>
                                <option value="hard">hard</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>

</div>
    

    



<Modal showModal={settingModal}>
    <section>
        <h2 class="modalTitle">Settings</h2>
        <div class="modalContainer">
            <Toggle bind:checked={hasSound} label="Sound Effects" name="SoundCheck" on:click={userTap} />
            <Toggle bind:checked={hasMotion} label="Reduced Motion" name="MotionCheck" on:click={userTap}/>
            <Toggle bind:checked={hasHaptics} label="Haptics" name="HapticCheck" on:click={userTap}/>
        </div>
    </section>
    <section>
        <h2 class="modalTitle">Links</h2>
        <div class="modalContainer">
            <Linkrow url={"google.com"} linkLabel={"How to Play"}/>
            <Linkrow url={"google.com"} linkLabel={"About"}/>
            <Linkrow url={"google.com"} linkLabel={"Changelog"}/>
        </div>
    </section>
</Modal>

</main>





<style>
    :root {
        --cornerRadius: 25px;
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
    .game {
        position: relative;
        height: 100%;
        max-height: 932px;
        width: 100%;
        max-width: 420px;
        /* setup grid */
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        gap: 8px;
    }

    .swatch_container {
        height: 100%;
    }

    .board_container {
        position: relative;
        display: grid;
        border-radius: var(--cornerRadius);
        will-change: transform;
        width: 100%;
        grid-column: 1/-1;
        grid-row: 1/9;
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
        background: linear-gradient(90deg, var(--color0), var(--color1));
    }
    .win .board_container:before {
        mask-image: linear-gradient(to bottom, transparent, black);
        background: linear-gradient(90deg, var(--color2), var(--color3));
    }

    .game_board {
        z-index: 2;
        display: grid;
        grid-template-columns: repeat(var(--colSize), 1fr);
        grid-template-rows: repeat(var(--rowSize, 1fr));
        height: 100%;
        width: 100%;
        border-radius: var(--cornerRadius);
        /* border: 1px solid var(--neutral-300); */
        transition: filter 350ms ease-out;
        transition: opacity 350ms ease-in-out;;
        /* overflow: hidden; */
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 1;
        grid-row-end: 2;
    }

    .win .game_board {
        filter: blur(25px) saturate(1.1);
        opacity: 0;
        overflow: hidden;
        pointer-events: none;
    }

    .control_group {
        display: grid;
        grid-template-rows: subgrid;
        grid-template-columns: subgrid;
        justify-content: space-between;
        width: 100%;
        grid-column: 1/-1;
        grid-row: 2/10;
        align-self: end;
    }

    .results, .controls {
        /* display: flex;
        flex-direction: column; */
        display: grid;
        grid-template-rows: subgrid;
        grid-row: 1/10;
        grid-column: 1/-1;
        /* gap: 24px; */
        font-family: sans-serif;
        align-self: end;
        opacity: 0;
        transform: translateX(-64px);
        display: none;
        transition: transform 250ms ease;
        transition: all 250ms ease;
        
    }
    .controls {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        opacity: 1;
        transform: translateX(0);    
        gap: 16px;
        margin: 24px;
    }
    .win .results {
        opacity: 1;
        transform: translateX(0);
        display: grid;
        align-items: center;
        /* display: flex; */
    }
    .results {
        grid-template-rows: subgrid;
        grid-row: 5/10;
        grid-column: 1/-1;
        margin: 0 24px;
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
        width: 100%;
        grid-row: 4/5;
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
    .results div:last-child {
        margin-bottom: 32px;
    }

    .menuGroup {
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 20px;
        font-family: sans-serif;
        margin-right: auto;
    }
    .menuGroup p {
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


    /* modals */

    .modalTitle {
        font-size: 18px;
        margin: 0;
        margin: 16px 0;
        user-select: none;
    }
    .modalContainer {
        display: flex;
        flex-direction: column;
		background: white;
		border-radius: 24px;
		padding: 24px;
		gap: 16px;
	}

    @media screen and (min-width: 900px) {
        .game {
            max-height: 800px;
        }
        .board_container {
            grid-row: 1/-1;
        }
    .control_group {
        position: absolute;
        top: 0;
        bottom: 0;
        right: -100%;
    }
    .controls {
        flex-direction: column;
        margin-top: 0;
        margin-bottom: 0;
    }
    .results {
        width: 100%;
        gap: 24px;
        min-width: 140px;
        max-width: 200px;
    }
    }

</style>