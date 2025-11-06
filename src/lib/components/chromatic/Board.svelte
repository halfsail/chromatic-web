<script>
    import { gsap } from "gsap";
    import { Draggable } from "gsap/Draggable";
    import chroma from "chroma-js";
    import { onMount } from "svelte";
    import {
        gameData,
        increaseMove,
        increaseHints,
        completePuzzle,
    } from "$lib/state/Store.svelte";
    import {
        getColors,
        shuffleColors,
        convertToP3,
    } from "$lib/utils/colorUtils.js";
    import WinSection from "./WinSection.svelte";
    import BoardControls from "./BoardControls.svelte";
    import { playFeedback } from "$lib/utils/feedback.js";

    // Use Map to properly track elements by their actual DOM position
    let itemElements = [];
    let dragInstances = [];
    let boardElement;
    let selectedElements = $state([]); // Track selected elements for swapping
    let hueRotate = $state(0);

    onMount(() => {
        gsap.registerPlugin(Draggable);
        // hoverSounds();
        document.documentElement.style.setProperty("--hue", hueRotate + "deg");
        document.documentElement.style.setProperty(
            "--color0",
            gameData.puzzle.hues[0],
        );
        document.documentElement.style.setProperty(
            "--color1",
            gameData.puzzle.hues[1],
        );
        document.documentElement.style.setProperty(
            "--color2",
            gameData.puzzle.hues[2],
        );
        document.documentElement.style.setProperty(
            "--color3",
            gameData.puzzle.hues[3],
        );
        // Small delay to ensure DOM is fully rendered
        setTimeout(initializeDraggables, 50);
        return () => {
            cleanupDraggables();
        };
    });

    function initializeDraggables() {
        cleanupDraggables(); // Clean up any existing instances

        // Get all non-locked swatches
        const draggableElements = itemElements.filter(
            (el) => el && !el.classList.contains("locked"),
        );

        draggableElements.forEach((element) => {
            if (!element) return;

            const draggable = Draggable.create(element, {
                type: "x,y",
                bounds: boardElement,
                inertia: true,
                edgeResistance: 0.65,

                onClick: function () {
                    // Prevent click events from triggering on drag
                    if (this.isDragging) return;
                    gsap.set(this.target, {
                        scale: 1.1,
                        zIndex: 100,
                        rotate: -4,
                        ease: "power2.out",
                    });
                    selectedElements.push(this.target);

                    if (selectedElements.length == 2) {
                        // two items selected, swap them
                        swapPositions(
                            selectedElements[0].dataset.index,
                            this.target.dataset.index,
                        );
                        selectedElements = []; // Reset after swap
                    } else {
                        playFeedback("cellClick");
                    }
                },
                onDragStart: function () {
                    // If any elements were selected, clear GSAP transforms and reset selection
                    if (selectedElements && selectedElements.length > 0) {
                        selectedElements.forEach((el) => {
                            if (el) {
                                gsap.set(el, {
                                    clearProps: "transform,scale,zIndex",
                                });
                            }
                        });
                        selectedElements = [];
                    }

                    playFeedback("cellClick");
                    this.target.classList.add("dragging");
                },
                onDrag: function () {
                    gsap.set(this.target, {
                        scale: 0.75,
                        rotate: -4,
                        zIndex: 900,
                        ease: "power2.out",
                    });
                    draggableElements.forEach((dropTarget) => {
                        if (
                            this.hitTest(dropTarget, "50%") &&
                            !dropTarget.classList.contains("dragover")
                        ) {
                            // Only run if hitTest is true and dropTarget does not have "dragover"
                            dropTarget.classList.add("dragover");
                            playFeedback("cellHover");
                        } else if (!this.hitTest(dropTarget, "50%")) {
                            dropTarget.classList.remove("dragover");
                        }
                    });
                },
                onDragEnd: function () {
                    this.target.classList.remove("dragging");
                    const draggedElement = this.target;
                    const draggedIndex = parseInt(draggedElement.dataset.index);

                    // Reset visual state
                    gsap.set(draggedElement, { scale: 1, zIndex: 1 });

                    // Find drop target
                    const dropTarget = getDropTarget(
                        draggedElement,
                        draggedIndex,
                    );

                    if (
                        dropTarget &&
                        !dropTarget.classList.contains("locked")
                    ) {
                        const dropIndex = parseInt(dropTarget.dataset.index);
                        swapPositions(draggedIndex, dropIndex);
                    } else {
                        // Snap back to original position
                        gsap.to(draggedElement, {
                            x: 0,
                            y: 0,
                            duration: 0.3,
                            ease: "power2.out",
                        });
                        gsap.set(draggedElement, {
                            clearProps: "transform,scale,zIndex,pointerEvents",
                        });
                    }
                },
            })[0];
            draggableElements.forEach((dropTarget) => {
                dropTarget.classList.remove("dragover");
            });

            dragInstances.push(draggable);
        });
    }

    function cleanupDraggables() {
        dragInstances.forEach((instance) => instance.kill());
        dragInstances = [];
    }

    function getDropTarget(draggedElement, draggedIndex) {
        const draggedRect = draggedElement.getBoundingClientRect();
        const draggedCenter = {
            x: draggedRect.left + draggedRect.width / 2,
            y: draggedRect.top + draggedRect.height / 2,
        };

        // Check all elements except the dragged one
        for (let i = 0; i < itemElements.length; i++) {
            if (i === draggedIndex || !itemElements[i]) continue;

            const element = itemElements[i];
            const rect = element.getBoundingClientRect();

            if (
                draggedCenter.x >= rect.left &&
                draggedCenter.x <= rect.right &&
                draggedCenter.y >= rect.top &&
                draggedCenter.y <= rect.bottom
            ) {
                return element;
            }
        }

        return null;
    }

    function swapPositions(index1, index2) {
        const element1 = itemElements[index1];
        const element2 = itemElements[index2];

        if (!element1 || !element2) return;

        // Get current positions
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();
        const boardRect = boardElement.getBoundingClientRect();

        // Calculate deltas relative to the board container
        // GSAP's startX/startY are useful for Draggable instances, but here we're animating DOM elements directly.
        // If you want to use GSAP's startX/startY, you'd need to access the Draggable instance for each element.
        // For most cases, using getBoundingClientRect is sufficient and accurate for swapping positions.

        const deltaX1 = rect2.left - rect1.left;
        const deltaY1 = rect2.top - rect1.top;
        const deltaX2 = rect1.left - rect2.left;
        const deltaY2 = rect1.top - rect2.top;

        // Get the current colors from the elements
        const color1 = gameData.puzzle.history[index1];
        const color2 = gameData.puzzle.history[index2];

        // Update the state first
        const newHistory = [...gameData.puzzle.history];
        [newHistory[index1], newHistory[index2]] = [
            newHistory[index2],
            newHistory[index1],
        ];
        playFeedback("cellMove");
        // Create a timeline for synchronized animation
        const tl = gsap.timeline({
            onComplete: () => {
                // Reset positions after animation
                gsap.set([element1, element2], {
                    x: 0,
                    y: 0,
                    scale: 0,
                    borderRadius: "0px",
                    clearProps: "transform,scale,zIndex, borderRadius", // Clear all transform properties
                });

                // Update the state after animation is complete
                gameData.puzzle.history = newHistory;
                increaseMove(1); // Increment the move count
                didWin(
                    gameData.puzzle.palette,
                    newHistory,
                    gameData.puzzle.hues,
                    gameData.puzzle.rows,
                    gameData.puzzle.columns,
                );
            },
        });

        // Add animations to timeline
        tl.to([element1, element2], {
            scale: 0.7,
            borderRadius: "24px",
            duration: 0.2,
            ease: "power2.in",
        })
            .to(
                element1,
                {
                    x: deltaX1,
                    y: deltaY1,
                    backgroundColor: color2,
                    duration: 0.3,
                    ease: "power2.inOut",
                },
                "<",
            )
            .to(
                element2,
                {
                    x: deltaX2,
                    y: deltaY2,
                    backgroundColor: color1,
                    duration: 0.3,
                    ease: "power2.inOut",
                },
                "<",
            )
            .to([element1, element2], {
                scale: 1,
                duration: 0.2,
                ease: "power2.out",
            });
    }

    // Reactive statement to reinitialize draggables when history changes
    $effect(() => {
        // This runs when gameData.puzzle.history changes
        if (gameData.puzzle.history.length > 0 && itemElements.length > 0) {
            // Wait for DOM update
            requestAnimationFrame(() => {
                initializeDraggables();
            });
        }
        document.documentElement.style.setProperty("--hue", hueRotate + "deg");

        document.documentElement.style.setProperty(
            "--color0",
            gameData.puzzle.hues[0],
        );
        document.documentElement.style.setProperty(
            "--color1",
            gameData.puzzle.hues[1],
        );
        document.documentElement.style.setProperty(
            "--color2",
            gameData.puzzle.hues[2],
        );
        document.documentElement.style.setProperty(
            "--color3",
            gameData.puzzle.hues[3],
        );
    });

    function didWin(correctColors, currentColors, keyColors, row, column) {
        let correct = false;
        let positionPalettes = [correctColors, correctColors.toReversed()];

        // check to see if even grid size
        // if even then prepare two other correct orders
        if (row === column) {
            let rotatePalette = [
                keyColors[2],
                keyColors[0],
                keyColors[3],
                keyColors[1],
            ];
            rotatePalette = getColors(rotatePalette, column, row);
            positionPalettes.push(rotatePalette, rotatePalette.toReversed());
        }
        // json parse and compare
        for (let index = 0; index < positionPalettes.length; index++) {
            if (
                JSON.stringify(positionPalettes[index]) ===
                JSON.stringify(currentColors)
            ) {
                correct = true;
                completePuzzle();
                playFeedback("win");
                break;
            }
        }

        return correct;
    }
    // get constrast levels
    function setContrast(color) {
        const contrast = chroma.contrast(color, "black");
        if (contrast < 4.5) {
            return "white";
        } else {
            return "black";
        }
    }
    function isCorner(cellIndex) {
        // first and last corner handle throught css in swatch
        if (cellIndex === 0) {
            return "tl_corner";
        }
        if (cellIndex === gameData.puzzle.col - 1) {
            return "tr_corner";
        }
        if (
            cellIndex ===
            gameData.puzzle.palette.length - gameData.puzzle.col
        ) {
            return "bl_corner";
        }
        if (cellIndex === gameData.puzzle.palette.length - 1) {
            return "br_corner";
        }
    }
    async function getHint() {
        // Return early if animation is in progress
        if (gameData.puzzle.isAnimating) return;

        const nonInteractive = [...gameData.puzzle.locks];
        const indexOrder = [
            ...Array(gameData.puzzle.col * gameData.puzzle.row).keys(),
        ];
        // filter out locked cells
        let hintCells = nonInteractive.reduce(
            (b, a) => (b.includes(a) && b.splice(b.indexOf(a), 1), b),
            [...indexOrder],
        );

        // Return if no more hints available
        if (hintCells.length === 0) return;

        // Set animation flag
        gameData.puzzle.isAnimating = true;

        try {
            // pick random color and its index
            const hintIndex =
                hintCells[Math.floor(Math.random() * hintCells.length)];
            const randomColor = gameData.puzzle.palette[hintIndex];

            // push hintIndex to game locks
            gameData.puzzle.locks = [...gameData.puzzle.locks, hintIndex];
            const oldIndex = gameData.puzzle.history.indexOf(randomColor);
            increaseHints(1);

            // swap the two wrong cells
            await new Promise((resolve) => {
                swapPositions(oldIndex, hintIndex);
                // Wait for animation to complete (match your GSAP animation duration)
                setTimeout(resolve, 700); // Adjust timing based on your animation duration
            });
        } finally {
            // Reset animation flag
            gameData.puzzle.isAnimating = false;
        }
    }
    function shiftColors() {
        hueRotate += 40;
        if (hueRotate > 360) {
            hueRotate = 0;
        }
    }
</script>

<section
    class:complete={gameData.puzzle.completed === true}
    class="boardContainer"
    style="--hueRotate: {hueRotate}deg;"
>
    <section
        class="board"
        style="--colSize: {gameData.puzzle.col}; --rowSize: {gameData.puzzle
            .row};"
        bind:this={boardElement}
    >
        {#each gameData.puzzle.history as color, i (i)}
            <div
                class="swatch {isCorner(i)}"
                class:selected={selectedElements.includes(itemElements[i])}
                class:locked={gameData.puzzle.locks.includes(i)}
                style="--background: {color}; --color: {setContrast(color)};"
                bind:this={itemElements[i]}
                data-index={i}
                data-color={color}
            >
                {#if gameData.puzzle.locks.includes(i)}
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M11.9995 4.20264C13.1659 4.20264 14.285 4.666 15.1099 5.49072C15.9347 6.31557 16.3989 7.43454 16.3989 8.60107V10.3208H16.7583C18.0614 10.3209 19.1176 11.3772 19.1177 12.6802V17.438C19.1174 18.7407 18.0613 19.7982 16.7583 19.7983H7.2417C5.93878 19.7983 4.88259 18.7408 4.88232 17.438V12.6802C4.88238 11.3772 5.93868 10.3209 7.2417 10.3208H7.60107V8.60107C7.60114 7.43461 8.06439 6.31556 8.88916 5.49072C9.71396 4.66592 10.8331 4.20277 11.9995 4.20264ZM11.9995 6.20264C11.3635 6.20277 10.7529 6.45506 10.3032 6.90479C9.85352 7.35456 9.60114 7.96506 9.60107 8.60107V10.3208H14.3989V8.60107C14.3989 7.96501 14.1456 7.35458 13.6958 6.90479C13.2461 6.4552 12.6356 6.20264 11.9995 6.20264Z"
                            fill="var(--color)"
                        />
                    </svg>
                {/if}
            </div>
        {/each}
    </section>
</section>

{#if gameData.state === "start" || gameData.puzzle.completed === false}
    <BoardControls {getHint} {shiftColors} />
{:else}
    <WinSection />
{/if}

<style>
    .boardContainer {
        --cornerRadius: 32px;
        position: relative;
        width: 100%;
        max-width: 340px;
        height: 100%;
        max-height: 600px;
        display: grid;
        flex-grow: 2;
        border-radius: var(--cornerRadius);
        margin: 0 auto;
        /* overflow: hidden; */
        will-change: transform;
        filter: hue-rotate(var(--hueRotate));
    }
    .boardContainer.complete {
        background: linear-gradient(90deg, var(--color0), var(--color1));
        box-shadow: 0 0 0 0 var(--ink-100);
        .board {
            filter: blur(25px) saturate(1.1);
            opacity: 0;
            overflow: hidden;
            pointer-events: none;
        }
    }
    .boardContainer.complete::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        mask-image: linear-gradient(to bottom, transparent, black);
        background: linear-gradient(90deg, var(--color2), var(--color3));
        border-bottom-left-radius: var(--cornerRadius);
        border-bottom-right-radius: var(--cornerRadius);
    }
    .board {
        display: grid;
        grid-template-columns: repeat(var(--colSize), 1fr);
        grid-template-rows: repeat(var(--rowSize), 1fr);
        grid-column: 1/-1;
        grid-row: 1/-1;
        border-radius: var(--cornerRadius);
        /* box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08); */
        background-color: var(--ink-100);
        transform: scaleY(1);
        filter: grayscale(0%);
        outline: 2px solid var(--ink-100);
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
        cursor: grab;
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
            opacity: 0.8;
            mix-blend-mode: luminosity;
        }
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

    .swatch.locked {
        cursor: not-allowed;
        &:hover {
            border-radius: 0.5rem;
            transform: scale(0.85);
            z-index: 1;
        }
    }
    .lock {
        opacity: 0.8;
        transform: scale(0.85);
        @starting-style {
            opacity: 0;
            transform: scale(0.5);
        }
    }

    :global(.swatch.dragging) {
        cursor: grabbing !important;
        border-radius: var(--cornerRadius) !important;
        pointer-events: none;
    }

    .swatch:active {
        cursor: grabbing;
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

    /*@media (max-height: 700px) and (orientation: landscape) {
        .boardContainer {
            grid-column: 1/2;
            grid-row: 1/-1;
            max-width: initial;
            max-height: initial;
        }
    }*/
    @media (min-width: 730px) {
        /* Add your CSS rules here */
        .boardContainer {
            grid-column: 2/3;
            grid-row: 2/3;
            max-width: initial;
            max-height: 650px;
        }
    }

    @media (hover: hover) {
        /* when hover is supported */
        .swatch:hover {
            border-radius: 16px;
            z-index: 10;
            border: 1px solid rgba(0, 0, 0, 0.15);
        }
    }
</style>
