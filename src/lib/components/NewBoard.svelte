<script>
    import { gsap } from "gsap";
    import { Draggable } from "gsap/Draggable";
    import { onMount, tick } from "svelte";
    import { gameStore } from "$lib/state/GameStore.svelte";
    import GameControls from "./GameControls.svelte";

    let itemElements = $state([]);
    let boardElement;

    const isLocked = (pos) => gameStore.puzzleState.lockedIndexes.includes(pos);

    onMount(() => {
        setLevelColors()
        gsap.registerPlugin(Draggable);

        const instances = Draggable.create(itemElements, {
            type: "x,y",
            bounds: boardElement,
            edgeResistance: 0.65,
            onDragStart() {
                if (isLocked(Number(this.target.dataset.position))) return;
                this.target.classList.add("dragging");
                gsap.to(this.target, { scale: DRAG_SCALE, duration: 0.15, ease: "power2.out", overwrite: "auto" });
            },
            onDragEnd() {
                // POSITION in the grid (not the color value)
                const from = Number(this.target.dataset.position);

                const targetEl = isLocked(from) ? null : itemElements.find((el, i) => i !== from && !isLocked(i) && this.hitTest(el, "50%"));

                // where the dragged swatch was released, relative to its slot
                const drop = { x: this.x, y: this.y };

                const lifted = this.target.classList.contains("dragging");

                // snap the dragged swatch back visually
                gsap.set(this.target, { x: 0, y: 0, scale: 1 });

                if (isLocked(from)) return;
                if (!targetEl) {
                    // no target: glide back home (corners ease back via CSS)
                    this.target.classList.remove("dragging");
                    gsap.fromTo(
                        this.target,
                        { ...drop, scale: lifted ? DRAG_SCALE : 1 },
                        { x: 0, y: 0, scale: 1, duration: SWAP_DURATION, ease: "power3.out", overwrite: true },
                    );
                    return;
                }
                swapColors(from, Number(targetEl.dataset.position), { drop, lifted });
            },
        });

        return () => instances.forEach((d) => d.kill());
    });

    const DRAG_SCALE = 1.2;
    const SWAP_DURATION = 0.25;
    const HINT_DURATION = 0.35;

    // Toggle a class without animating the change (flush styles in between)
    function toggleInstantly(el, cls, on) {
        el.style.transition = "none";
        el.classList.toggle(cls, on);
        el.offsetWidth;
        el.style.transition = "";
    }

    const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Swatch elements stay put per position; only their colors change. So after
    // a swap, offset each swatch back to where its new color came from and
    // tween it home (FLIP). `drop` = drag offset, so the dragged color continues
    // from where it was released. `hint` adds a lift for programmatic swaps.
    async function animateSwap(from, to, { drop = { x: 0, y: 0 }, hint = false, lifted = false } = {}) {
        await tick(); // DOM now shows the swapped colors, not yet painted
        const a = itemElements[from];
        const b = itemElements[to];

        // The dragged color now lives in `b`, so hand the lifted look over to it
        // and let its corners ease back while it lands.
        if (lifted) {
            toggleInstantly(a, "dragging", false);
            if (!reduceMotion()) {
                toggleInstantly(b, "dragging", true);
                requestAnimationFrame(() => b.classList.remove("dragging"));
            }
        }
        if (reduceMotion()) return;

        const dx = a.offsetLeft - b.offsetLeft;
        const dy = a.offsetTop - b.offsetTop;
        const tween = {
            x: 0,
            y: 0,
            scale: 1,
            duration: hint ? HINT_DURATION : SWAP_DURATION,
            ease: hint ? "power2.inOut" : "power3.out",
            overwrite: true,
            clearProps: "zIndex",
        };

        // `to` now shows the color that came from `from` (the dragged one)
        gsap.fromTo(b, { x: dx + drop.x, y: dy + drop.y, scale: hint ? 1.15 : lifted ? DRAG_SCALE : 1, zIndex: 30 }, { ...tween });
        gsap.fromTo(a, { x: -dx, y: -dy, scale: hint ? 1.15 : 1, zIndex: 20 }, { ...tween });

        // little settle pop on tiles that just landed in place
        for (const [el, pos] of [[a, from], [b, to]]) {
            if (isLocked(pos)) {
                gsap.fromTo(el, { scale: 1 }, { scale: 1.08, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.out", delay: tween.duration });
            }
        }
    }

    async function swapColors(from, to, animation = {}) {
        const grid = [...gameStore.puzzleState.scramble];
        [grid[from], grid[to]] = [grid[to], grid[from]];

        // check against the NEW grid
        const locks = new Set(gameStore.puzzleState.lockedIndexes);
        if (grid[from] === from) locks.add(from);
        if (grid[to] === to) locks.add(to);

        // applyScramble updates state synchronously, then persists
        const saved = gameStore.applyScramble(grid, [...locks].sort((a, b) => a - b), { hint: animation.hint });
        animateSwap(from, to, animation);
        await saved;
        await didWin();
    }

function getHint() {
    const scramble = gameStore.puzzleState.scramble;
    const locked = new Set(gameStore.puzzleState.lockedIndexes);

    // slots whose value is wrong and that aren't locked
    const wrong = scramble
        .map((tile, index) => ({ tile, index }))
        .filter(({ tile, index }) => tile !== index && !locked.has(index));

    if (wrong.length === 0) return;
    const { index, tile } = wrong[Math.floor(Math.random() * wrong.length)];
    swapColors(index, tile, { hint: true });
}

async function didWin() {
    const scramble = gameStore.puzzleState.scramble;
    const isComplete = scramble.every((tile, index) => tile === index);
    if (isComplete) {
        await gameStore.recordGameCompletion({ won: true });
    }
}

    function setLevelColors() {
      document.documentElement.style.setProperty("--color0", gameStore.puzzleState.keyColors[0]);
      document.documentElement.style.setProperty("--color1", gameStore.puzzleState.keyColors[1]);
      document.documentElement.style.setProperty("--color2", gameStore.puzzleState.keyColors[2]);
      document.documentElement.style.setProperty("--color3", gameStore.puzzleState.keyColors[3]);
    }
</script>
    
<section
    class:complete={gameStore.isWon}
    class="boardContainer {gameStore.puzzleState.difficulty}"
>
    <section
        class="board"
        style="--colSize: {gameStore.puzzleState.cols}; --rowSize: {gameStore.puzzleState.rows};"
        bind:this={boardElement}
    >
         {#each gameStore.puzzleState.scramble as cell, i}
            <div
                class="swatch"
                class:locked={gameStore.puzzleState.lockedIndexes.includes(i)}
                style="--background: {gameStore.puzzleState.palette[cell]};"
                bind:this={itemElements[i]}
                data-index={cell}
                data-position={i}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.9995 4.20264C13.1659 4.20264 14.285 4.666 15.1099 5.49072C15.9347 6.31557 16.3989 7.43454 16.3989 8.60107V10.3208H16.7583C18.0614 10.3209 19.1176 11.3772 19.1177 12.6802V17.438C19.1174 18.7407 18.0613 19.7982 16.7583 19.7983H7.2417C5.93878 19.7983 4.88259 18.7408 4.88232 17.438V12.6802C4.88238 11.3772 5.93868 10.3209 7.2417 10.3208H7.60107V8.60107C7.60114 7.43461 8.06439 6.31556 8.88916 5.49072C9.71396 4.66592 10.8331 4.20277 11.9995 4.20264ZM11.9995 6.20264C11.3635 6.20277 10.7529 6.45506 10.3032 6.90479C9.85352 7.35456 9.60114 7.96506 9.60107 8.60107V10.3208H14.3989V8.60107C14.3989 7.96501 14.1456 7.35458 13.6958 6.90479C13.2461 6.4552 12.6356 6.20264 11.9995 6.20264Z"
                        fill="currentColor"
                    />
                </svg>
            </div>
        {/each}
    </section>
</section>

<GameControls getHint={getHint} />


<style>
    .boardContainer {
        --cornerRadius: 20px;
        position: relative;
        width: 100%;
        height: 100%;
        max-width: 350px;
        max-height: 450px;
        display: grid;
        flex-grow: 2;
        border-radius: var(--cornerRadius);
        margin: 0 auto;
        will-change: transform;
        filter: hue-rotate(var(--hueRotate));
        box-shadow: inset 0 0 0 1px rgb(0 0 0 / .1);
    }
    .boardContainer.complete {
        background: linear-gradient(135deg, var(--color0), transparent 75.71%),
                    linear-gradient(210deg, var(--color1), transparent 75.71%),
                    linear-gradient(-45deg, var(--color2), transparent 75.71%),
                    linear-gradient(45deg, var(--color3), transparent 75.71%);

        box-shadow: inset 0 0 0 1px rgb(0 0 0 / .1);
        overflow: hidden;
        .board {
            filter: blur(40px) saturate(1.1);
            opacity: .25;
            overflow: hidden;
            pointer-events: none;
        }

        svg {
          display: none;
        }
    }
    .board {
        display: grid;
        grid-template-columns: repeat(var(--colSize), 1fr);
        grid-template-rows: repeat(var(--rowSize), 1fr);
        grid-column: 1/-1;
        grid-row: 1/-1;
        border-radius: var(--cornerRadius);
        background-color: light-dark(var(--grey-2), --grey-9);
        transform: scaleY(1);
        filter: grayscale(0%);
        outline: 1px solid light-dark(var(--grey-4), --grey-10);
        transition: filter 350ms ease-out;
        transition: opacity 350ms ease-in-out;

        @starting-style {
            transform: scaleY(0);
            border-radius: var(--rad-xl);
            filter: grayscale(100%);
        }
    }

    .swatch {
        display: grid;
        place-items: center;
        position: relative;
        transform-origin: center center;
        transition:
            box-shadow,
            scale,
            background,
            border-radius 200ms var(--shoot-ease);
        will-change: transform;
        background-color: var(--background);

        transform: scale(1);
        border-radius: 0;

        svg {
            color: contrast-color(var(--background));
            opacity: 0;
            transform: scale(0.5);
            mix-blend-mode: luminosity;
            transition: all 200ms var(--shoot-ease);
        }
    }   
        .swatch.locked {
            cursor: not-allowed;
            svg {
                opacity: 0.7;
                transform: scale(0.85);
            }
        }

    .medium .swatch:nth-child(1) {
        border-top-left-radius: var(--cornerRadius);
    }
    .medium .swatch:nth-child(6) {
        border-top-right-radius: var(--cornerRadius);
    }
    .medium .swatch:nth-child(31) {
        border-bottom-left-radius: var(--cornerRadius);
    }
    .medium .swatch:nth-child(36) {
        border-bottom-right-radius: var(--cornerRadius);
    }

    .swatch.dragover {
        border-radius: 16px;
        z-index: 10;
        border: 1px solid rgba(0, 0, 0, 0.15);
    }

    .selected {
        transform: scale(1.2) rotate(-2deg);
        border-radius: var(--cornerRadius);
        border-radius: 12px;
        /* elevation / theme_dark / e6 */
        box-shadow: var(--elevation-4), var(--swatchThickness);
        z-index: 999;
    }




    :global(.swatch.dragging) {
        cursor: grabbing !important;
        border-radius: 10px !important;
        pointer-events: none;
    }

    /* Hide lock icon while dragging (improves visual clarity) */
    :global(.swatch.dragging) svg {
        opacity: 0 !important;
        visibility: hidden !important;
    }

    /* Hide lock icon while programmatically swapping/animating */
    .swatch.swapping svg {
        opacity: 0;
        visibility: hidden;
    }

    .swatch:active {
        z-index: 10;
    }

    .swatch.tl_corner {
        border-top-left-radius: var(--cornerRadius) !important;
    }
    .swatch.tr_corner {
        border-top-right-radius: var(--cornerRadius) !important;
    }
    .swatch.br_corner {
        border-bottom-right-radius: var(--cornerRadius) !important;
    }
    .swatch.bl_corner {
        border-bottom-left-radius: var(--cornerRadius) !important;
    }

    @media (min-width: 730px) {
        /* Add your CSS rules here */
        .boardContainer {
            grid-column: 2/3;
            grid-row: 2/3;
        }
    }

    @media (hover: hover) {
        /* when hover is supported */
        .swatch:hover {
            z-index: 10;
            border: 1px solid rgba(0, 0, 0, 0.35);
        }

        .swatch.lock:hover {
            cursor: not-allowed;
            pointer-events: none;
        }

        .swatch.locked:hover svg{
            opacity: 1;
            transform: scale(1.2);
        }
    }
</style>
