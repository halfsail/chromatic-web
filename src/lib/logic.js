import chroma from "chroma-js";
import { hues } from "./hues";
import { levels } from "./levels"


export function getLevel(currentLevelIndex, Difficultity) {

  // check to see if there levelIndex or tutorial level
  
  // filter out current level from hues arrays
  let pickableHues = Array.from(Array(hues.length).keys())
  pickableHues.splice(currentLevelIndex, 1)
  // random pick one of those arrays
  const hueIndex = pickableHues[Math.floor(Math.random()*pickableHues.length)]
  // save array as temp var
  const paletteObject = hues[hueIndex]
  console.log(paletteObject)

  let levelLayout;

  // check if user has difficultity
  if (Difficultity === 'any') {
    // randomly pick from whole list of levels
    levelLayout = levels[Math.floor( Math.random()*levels.length )]
    console.log(levelLayout)
  } else {
    
  }
  // return list of levels with only that difficultity
  // pick one of those arrays
  // save object as temp var

  const paletteOrder = getColors(paletteObject, levelLayout.columns, levelLayout.rows )

  const levelObject = {
    colors: paletteObject,
    order: paletteOrder,
    palette: shuffleLevel(paletteOrder, levelLayout.locks, levelLayout.columns, levelLayout.rows),
    containerBg: getBackground(paletteObject),

    columns: levelLayout.columns,
    rows: levelLayout.rows,
    locks: levelLayout.locks,
  }
  console.log(levelObject)
  return levelObject
}



// gen background border color
export function getBackground(keyColors) {
    return chroma.average(keyColors, 'rgb').brighten(1.5).desaturate(3)
}

// get constrast levels
export function setContrast(color) {
    const contrast = chroma.contrast(color, 'black')
    if (contrast < 4.5) {
        return 'white'
    } else  {
        return 'black'
    }
}


// generate levels
// based on keycolors
// column number
// rows number
// return array of correct order scale

export function getColors(keyColors, colSize, rowSize) {
    const firstColumn = chroma.scale([keyColors[0], keyColors[2]]).correctLightness().colors(rowSize)
    const lastColumn = chroma.scale([keyColors[1], keyColors[3]]).correctLightness().colors(rowSize)
    let matrix = []

    for (let i = 0; i < rowSize; i++) {
        let tempRow = chroma.scale([ firstColumn[i], lastColumn[i] ]).correctLightness().colors(colSize)
        matrix.push(...tempRow)
    }
    return matrix
}

// shuffle levels
// based on shuffle array and locks
// return shuffle array 

export function shuffleLevel(colors, locks, colSize, rowSize) {
  let shuffle = [...Array(colSize * rowSize).keys()]
  shuffle = shuffle.sort( () => Math.random() - 0.5 )

  let shuffleArray = shuffle.filter( function(el) {
    return locks.indexOf(el) < 0
  })

  for (let index = 0; index < locks.length; index++) {
    shuffleArray.splice(locks[index], 0, locks[index])
  }

  let randomPalette = [];
  shuffleArray.forEach(element => {
    randomPalette.push(colors[element])
  })

  return randomPalette
}

// hint function
// return new array of locked swatches

// check for win
export function didWin(correctColors, currentColors, keyColors, row, column) {
  let correct = false
  let positionPalettes = [correctColors, correctColors.toReversed()]

  // check to see if even grid size
  // if even then prepare two other correct orders
  if (row === column) {
    let rotatePalette = [keyColors[2], keyColors[0], keyColors[3], keyColors[1]]
    rotatePalette = getColors(rotatePalette, column, row)
    positionPalettes.push(rotatePalette, rotatePalette.toReversed())
  }
  // json parse and compare
  for (let index = 0; index < positionPalettes.length; index++) {
    if (JSON.stringify(positionPalettes[index]) === JSON.stringify(currentColors)) {
      correct = true
      break
    }
  }
  
  return correct
}


// random number generator for range
export function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}



/** Dispatch event on click outside of node */
export function clickOutside(node) {
  
    const handleClick = event => {
      if (node && !node.contains(event.target) && !event.defaultPrevented) {
        node.dispatchEvent(
          new CustomEvent('click_outside', node)
        )
      }
    }
  
      document.addEventListener('click', handleClick, true);
    
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
      }
  }