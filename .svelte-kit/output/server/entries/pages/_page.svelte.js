import { p as push, d as bind_props, c as pop, e as ensure_array_like, f as stringify, h as copy_payload, i as assign_payload } from "../../chunks/index.js";
import "clsx";
import chroma from "chroma-js";
import { v as version } from "../../chunks/environment.js";
import { e as escape_html } from "../../chunks/escaping.js";
import { a as attr } from "../../chunks/attributes.js";
const CONFIG = {
  VERSION_KEY: version
};
const defaultData = {
  version: CONFIG.VERSION_KEY,
  deviceId: null,
  // Will be set later
  lastSync: null,
  state: "START",
  isAnimating: false,
  puzzle: {
    completed: false,
    hints: 0,
    moves: 0,
    completedAt: null
  },
  stats: {
    totalCompleted: 0,
    currentStreak: 0,
    bestStreak: 0,
    averageMoves: 0
  },
  settings: {
    theme: "dark",
    soundEnabled: true,
    hapticEnabled: true,
    relaxedMode: true
  }
};
let initialState = { ...defaultData };
const gameData = initialState;
const uiState = {
  modals: { sidebar: false, help: false }
};
function openMenu(name) {
  uiState.modals[name] = true;
  console.log(uiState.modals);
}
function Header($$payload, $$props) {
  push();
  let toggleMenu = $$props["toggleMenu"];
  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC"
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(void 0, options);
  }
  $$payload.out += `<nav class="svelte-19cb236"><header class="svelte-19cb236"><div class="leftSide svelte-19cb236"><button class="portrait_btn svelte-19cb236" aria-label="menu"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-19cb236"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.75 7C20.75 7.41421 20.4142 7.75 20 7.75L4 7.75C3.58579 7.75 3.25 7.41421 3.25 7C3.25 6.58579 3.58579 6.25 4 6.25L20 6.25C20.4142 6.25 20.75 6.58579 20.75 7Z" fill="var(--ink-800)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M20.75 12C20.75 12.4142 20.4142 12.75 20 12.75L4 12.75C3.58579 12.75 3.25 12.4142 3.25 12C3.25 11.5858 3.58579 11.25 4 11.25L20 11.25C20.4142 11.25 20.75 11.5858 20.75 12Z" fill="var(--ink-800)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M20.75 17C20.75 17.4142 20.4142 17.75 20 17.75L4 17.75C3.58579 17.75 3.25 17.4142 3.25 17C3.25 16.5858 3.58579 16.25 4 16.25L20 16.25C20.4142 16.25 20.75 16.5858 20.75 17Z" fill="var(--ink-800)"></path></svg></button></div> <h1 class="svelte-19cb236">Chromatic</h1> <div class="rightSide svelte-19cb236"><button class="portrait_btn svelte-19cb236" aria-label="rules"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-19cb236"><circle cx="12" cy="12" r="10" stroke="var(--ink-800)" stroke-width="1.5"></circle><path d="M10.125 8.875C10.125 7.83947 10.9645 7 12 7C13.0355 7 13.875 7.83947 13.875 8.875C13.875 9.56245 13.505 10.1635 12.9534 10.4899C12.478 10.7711 12 11.1977 12 11.75V13" stroke="var(--ink-800)" stroke-width="1.5" stroke-linecap="round"></path><circle cx="12" cy="16" r="1" fill="var(--ink-800)"></circle></svg></button></div></header> <p class="dateText svelte-19cb236"><span>${escape_html(formatDate(gameData.puzzle.date))}</span> `;
  if (formatDate(gameData.puzzle.date) !== formatDate(/* @__PURE__ */ new Date())) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button class="svelte-19cb236">Play Today's Game.</button>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></p></nav>`;
  bind_props($$props, { toggleMenu });
  pop();
}
function WinSection($$payload, $$props) {
  push();
  let isVisible = document.visibilityState === "visible";
  const listOfWinMessages = [
    "Amazing",
    "Incredible",
    "Fantastic",
    "Brilliant",
    "Spectacular",
    "Outstanding",
    "Marvelous",
    "Phenomenal",
    "Stupendous",
    "Remarkable"
  ];
  function getRandomWinMessage() {
    const index = Math.floor(Math.random() * listOfWinMessages.length);
    return listOfWinMessages[index];
  }
  $$payload.out += `<section class="column svelte-16g8kmv"><div class="textColumn svelte-16g8kmv"><h2 class="svelte-16g8kmv">${escape_html(getRandomWinMessage())}</h2> <p class="formatPretty svelte-16g8kmv">You completed today's puzzle in ${escape_html(gameData.puzzle.moves)} moves `;
  if (gameData.puzzle.hints) {
    $$payload.out += "<!--[-->";
    $$payload.out += `and using ${escape_html(gameData.puzzle.hints)} hints`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></p></div> `;
  if (gameData.puzzle.date !== (/* @__PURE__ */ new Date()).toISOString().split("T")[0] && gameData.puzzle.completed && isVisible === true) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button class="svelte-16g8kmv">Play Today's Puzzle</button>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button disabled class="svelte-16g8kmv">New Puzzle Tomorrow</button>`;
  }
  $$payload.out += `<!--]--></section>`;
  pop();
}
function BoardControls($$payload, $$props) {
  push();
  $$payload.out += `<section class="controlContainer svelte-2w52aa"><div class="btn_col landscape_btn svelte-2w52aa"><button class="round svelte-2w52aa" aria-label="menu"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.75 7C20.75 7.41421 20.4142 7.75 20 7.75L4 7.75C3.58579 7.75 3.25 7.41421 3.25 7C3.25 6.58579 3.58579 6.25 4 6.25L20 6.25C20.4142 6.25 20.75 6.58579 20.75 7Z" fill="var(--icon-color)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M20.75 12C20.75 12.4142 20.4142 12.75 20 12.75L4 12.75C3.58579 12.75 3.25 12.4142 3.25 12C3.25 11.5858 3.58579 11.25 4 11.25L20 11.25C20.4142 11.25 20.75 11.5858 20.75 12Z" fill="var(--icon-color)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M20.75 17C20.75 17.4142 20.4142 17.75 20 17.75L4 17.75C3.58579 17.75 3.25 17.4142 3.25 17C3.25 16.5858 3.58579 16.25 4 16.25L20 16.25C20.4142 16.25 20.75 16.5858 20.75 17Z" fill="var(--icon-color)"></path></svg></button> <p class="btn_label svelte-2w52aa">Menu</p></div> <div class="btn_col landscape_btn svelte-2w52aa"><button class="round svelte-2w52aa" aria-label="rules"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="var(--icon-color)" stroke-width="1.5"></circle><path d="M10.125 8.875C10.125 7.83947 10.9645 7 12 7C13.0355 7 13.875 7.83947 13.875 8.875C13.875 9.56245 13.505 10.1635 12.9534 10.4899C12.478 10.7711 12 11.1977 12 11.75V13" stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round"></path><circle cx="12" cy="16" r="1" fill="var(--icon-color)"></circle></svg></button> <p class="btn_label svelte-2w52aa">Rules</p></div> <div class="btn_col svelte-2w52aa"><button class="round svelte-2w52aa"${attr("disabled", gameData.puzzle.isAnimating, true)}><svg width="25" height="24" viewBox="0 0 25 24" fill="var(--icon-color)" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 18.7089C9.5 18.2894 9.83579 17.9494 10.25 17.9494H14.25C14.6642 17.9494 15 18.2894 15 18.7089C15 19.1283 14.6642 19.4684 14.25 19.4684H10.25C9.83579 19.4684 9.5 19.1283 9.5 18.7089ZM10.1667 21.2405C10.1667 20.821 10.5025 20.481 10.9167 20.481H13.5833C13.9975 20.481 14.3333 20.821 14.3333 21.2405C14.3333 21.66 13.9975 22 13.5833 22H10.9167C10.5025 22 10.1667 21.66 10.1667 21.2405Z"></path><path d="M7.66058 13.8283L8.76463 14.8807C9.07437 15.1759 9.25 15.5875 9.25 16.0182C9.25 16.6653 9.768 17.1899 10.407 17.1899H14.093C14.732 17.1899 15.25 16.6653 15.25 16.0182C15.25 15.5875 15.4256 15.1759 15.7354 14.8807L16.8394 13.8283C18.3806 12.3481 19.2412 10.4034 19.2499 8.3817L19.25 8.29678C19.25 4.84243 16.116 2 12.25 2C8.38401 2 5.25 4.84243 5.25 8.29678L5.25007 8.3817C5.25875 10.4034 6.11939 12.3481 7.66058 13.8283Z"></path></svg></button> <p class="btn_label svelte-2w52aa">Hint</p></div> <div class="btn_col svelte-2w52aa"><button class="round svelte-2w52aa"><svg width="25" height="24" viewBox="0 0 25 24" fill="var(--icon-color)" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M22.4229 6.5C22.4229 3.87665 20.2962 1.75 17.6729 1.75C15.0495 1.75 12.9229 3.87665 12.9229 6.5C12.9229 9.12335 15.0495 11.25 17.6729 11.25C20.2962 11.25 22.4229 9.12335 22.4229 6.5Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M11.4229 17.5C11.4229 14.8766 9.2962 12.75 6.67285 12.75C4.0495 12.75 1.92285 14.8766 1.92285 17.5C1.92285 20.1234 4.0495 22.25 6.67285 22.25C9.2962 22.25 11.4229 20.1234 11.4229 17.5Z"></path><g opacity="0.5"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.92285 6.5C1.92285 3.87665 4.0495 1.75 6.67285 1.75C9.2962 1.75 11.4229 3.87665 11.4229 6.5C11.4229 9.12335 9.2962 11.25 6.67285 11.25C4.0495 11.25 1.92285 9.12335 1.92285 6.5Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12.9229 17.5C12.9229 14.8766 15.0495 12.75 17.6729 12.75C20.2962 12.75 22.4229 14.8766 22.4229 17.5C22.4229 20.1234 20.2962 22.25 17.6729 22.25C15.0495 22.25 12.9229 20.1234 12.9229 17.5Z"></path></g></svg></button> <p class="btn_label svelte-2w52aa">Rotate Hues</p></div></section>`;
  pop();
}
function Board($$payload, $$props) {
  push();
  let itemElements = [];
  let selectedElements = [];
  let hueRotate = 0;
  function setContrast(color) {
    const contrast = chroma.contrast(color, "black");
    if (contrast < 4.5) {
      return "white";
    } else {
      return "black";
    }
  }
  function isCorner(cellIndex) {
    if (cellIndex === 0) {
      return "tl_corner";
    }
    if (cellIndex === gameData.puzzle.col - 1) {
      return "tr_corner";
    }
    if (cellIndex === gameData.puzzle.palette.length - gameData.puzzle.col) {
      return "bl_corner";
    }
    if (cellIndex === gameData.puzzle.palette.length - 1) {
      return "br_corner";
    }
  }
  const each_array = ensure_array_like(gameData.puzzle.history);
  $$payload.out += `<section${attr("class", `boardContainer svelte-484gtp ${stringify([
    gameData.puzzle.completed === true ? "complete" : ""
  ].filter(Boolean).join(" "))}`)}${attr("style", `--hueRotate: ${stringify(hueRotate)}deg;`)}><section class="board svelte-484gtp"${attr("style", `--colSize: ${stringify(gameData.puzzle.col)}; --rowSize: ${stringify(gameData.puzzle.row)};`)}><!--[-->`;
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let color = each_array[i];
    $$payload.out += `<div${attr("class", `swatch ${stringify(isCorner(i))} svelte-484gtp ${stringify([
      selectedElements.includes(itemElements[i]) ? "selected" : "",
      gameData.puzzle.locks.includes(i) ? "locked" : ""
    ].filter(Boolean).join(" "))}`)}${attr("style", `--background: ${stringify(color)}; --color: ${stringify(setContrast(color))};`)}${attr("data-index", i)}${attr("data-color", color)}>`;
    if (gameData.puzzle.locks.includes(i)) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-484gtp"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.9995 4.20264C13.1659 4.20264 14.285 4.666 15.1099 5.49072C15.9347 6.31557 16.3989 7.43454 16.3989 8.60107V10.3208H16.7583C18.0614 10.3209 19.1176 11.3772 19.1177 12.6802V17.438C19.1174 18.7407 18.0613 19.7982 16.7583 19.7983H7.2417C5.93878 19.7983 4.88259 18.7408 4.88232 17.438V12.6802C4.88238 11.3772 5.93868 10.3209 7.2417 10.3208H7.60107V8.60107C7.60114 7.43461 8.06439 6.31556 8.88916 5.49072C9.71396 4.66592 10.8331 4.20277 11.9995 4.20264ZM11.9995 6.20264C11.3635 6.20277 10.7529 6.45506 10.3032 6.90479C9.85352 7.35456 9.60114 7.96506 9.60107 8.60107V10.3208H14.3989V8.60107C14.3989 7.96501 14.1456 7.35458 13.6958 6.90479C13.2461 6.4552 12.6356 6.20264 11.9995 6.20264Z" fill="var(--color)"></path></svg>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]--></section></section> `;
  if (gameData.state === "start" || gameData.puzzle.completed === false) {
    $$payload.out += "<!--[-->";
    BoardControls($$payload);
  } else {
    $$payload.out += "<!--[!-->";
    WinSection($$payload);
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function SettingsContainer($$payload, $$props) {
  push();
  $$payload.out += `<div class="container svelte-1jimsc"><section class="svelte-1jimsc"><p class="subHeader svelte-1jimsc">Game Play</p> <div class="list_item_grid svelte-1jimsc"><div class="icon svelte-1jimsc"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-1jimsc"><path d="M11.7595 5.50128C11.861 5.21432 11.9163 4.90548 11.9163 4.58374C11.9163 3.06496 10.685 1.83374 9.16626 1.83374C7.64747 1.83374 6.41626 3.06496 6.41626 4.58374C6.41626 4.90548 6.47151 5.21432 6.57305 5.50128C4.47867 5.50893 3.36098 5.58327 2.63838 6.30586C1.91585 7.02839 1.84146 8.14594 1.8338 10.2399C2.12027 10.1388 2.4285 10.0837 2.74959 10.0837C4.26837 10.0837 5.49959 11.315 5.49959 12.8337C5.49959 14.3525 4.26837 15.5837 2.74959 15.5837C2.4285 15.5837 2.12027 15.5287 1.8338 15.4276C1.84146 17.5215 1.91585 18.6391 2.63838 19.3616C3.3609 20.0841 4.47845 20.1585 6.57243 20.1662C6.47129 19.8797 6.41626 19.5715 6.41626 19.2504C6.41626 17.7316 7.64747 16.5004 9.16626 16.5004C10.685 16.5004 11.9163 17.7316 11.9163 19.2504C11.9163 19.5715 11.8612 19.8797 11.7601 20.1662C13.8541 20.1585 14.9716 20.0841 15.6941 19.3616C16.4167 18.639 16.4911 17.5213 16.4987 15.4269C16.7857 15.5285 17.0945 15.5837 17.4163 15.5837C18.935 15.5837 20.1663 14.3525 20.1663 12.8337C20.1663 11.315 18.935 10.0837 17.4163 10.0837C17.0945 10.0837 16.7857 10.139 16.4987 10.2405C16.4911 8.14616 16.4167 7.02846 15.6941 6.30586C14.9715 5.58327 13.8538 5.50893 11.7595 5.50128Z" stroke="var(--ink-900)" stroke-width="1.5" stroke-linejoin="round"></path></svg></div> <div class="copy svelte-1jimsc"><p class="label svelte-1jimsc">Relaxed Mode</p></div> <div class="control svelte-1jimsc"><label class="material-toggle-switch svelte-1jimsc" for="relaxedMode"><input id="relaxedMode" type="checkbox" class="material-toggle-input svelte-1jimsc"${attr("checked", gameData.settings.relaxedMode, true)}> <span class="material-toggle-slider svelte-1jimsc"></span></label></div> <p class="description svelte-1jimsc">Lock tiles when moved into correct spot.</p></div></section> <section class="svelte-1jimsc"><p class="subHeader svelte-1jimsc">Effects</p> <div class="list_item svelte-1jimsc"><div class="icon svelte-1jimsc"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-1jimsc"><path d="M2.29169 11C2.29169 6.89481 2.29169 4.84224 3.56699 3.56693C4.8423 2.29163 6.89487 2.29163 11 2.29163C15.1052 2.29163 17.1577 2.29163 18.433 3.56693C19.7084 4.84224 19.7084 6.89481 19.7084 11C19.7084 15.1051 19.7084 17.1577 18.433 18.433C17.1577 19.7083 15.1052 19.7083 11 19.7083C6.89487 19.7083 4.8423 19.7083 3.56699 18.433C2.29169 17.1577 2.29169 15.1051 2.29169 11Z" stroke="var(--ink-900)" stroke-width="1.5"></path><path d="M11.9166 13.2916C11.9166 14.5573 10.8906 15.5833 9.62498 15.5833C8.35933 15.5833 7.33331 14.5573 7.33331 13.2916C7.33331 12.026 8.35933 11 9.62498 11C10.8906 11 11.9166 12.026 11.9166 13.2916ZM11.9166 13.2916V6.41663C12.2222 6.87496 12.4666 8.79996 14.6666 9.16663" stroke="var(--ink-900)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></div> <div class="copy svelte-1jimsc"><p class="label svelte-1jimsc">Sounds Effect</p></div> <div class="control svelte-1jimsc"><label class="material-toggle-switch svelte-1jimsc" for="soundEnabled"><input id="soundEnabled" type="checkbox" class="material-toggle-input svelte-1jimsc"${attr("checked", gameData.settings.soundEnabled, true)}> <span class="material-toggle-slider svelte-1jimsc"></span></label></div></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></section></div>`;
  pop();
}
function HamburgerMenu($$payload, $$props) {
  push();
  $$payload.out += `<dialog class="modal svelte-crqphh"><div class="dialog_container main-dialog fixedWidth svelte-crqphh" role="dialog" aria-labelledby="dialog-title"><div class="modalHeader svelte-crqphh"><img class="icon svelte-crqphh" src="./favicon.png" alt=""> <h2 class="svelte-crqphh">Chromatic</h2> <p class="versionPill svelte-crqphh">${escape_html(version)}</p> <p class="svelte-crqphh">A casual relaxing puzzle game. Where you sort color and create gradients.</p> <p class="madeBy svelte-crqphh"><span class="svelte-crqphh">Game by</span> <a href="https://feyder.co" class="svelte-crqphh">Feyder</a></p></div></div> <div class="dialog_container fixedWidth svelte-crqphh" role="dialog" aria-labelledby="dialog-title">`;
  SettingsContainer($$payload);
  $$payload.out += `<!----></div> <button type="button" aria-label="Close help dialog" class="closeButton svelte-crqphh"><svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6.28223L17.5 17.7822M17.5 6.28223L6 17.7822" stroke="white" stroke-width="2.5"></path></svg></button></dialog>`;
  pop();
}
function HelpModal($$payload, $$props) {
  push();
  $$payload.out += `<dialog class="modal svelte-4cbhhf"><div class="dialog_container main-dialog svelte-4cbhhf" role="dialog" aria-labelledby="dialog-title"><video src="./tutorialWide.webm" playsinline mute="" autoplay loop class="svelte-4cbhhf"></video> <div><h3 class="svelte-4cbhhf">How to Play</h3> <p class="svelte-4cbhhf">Move the tiles until the gradient is seamless and all the colors
                flow perfectly into one another.</p></div> <div><h3 class="svelte-4cbhhf">Tips</h3> <p class="svelte-4cbhhf">Locked Tiles are in the correct spot. Use them as reference
                points to help sort the gradient.</p> <p class="svelte-4cbhhf">Use Rotate Hues if you are having trouble seeing the different
                between colors.</p></div></div> <button type="button" aria-label="Close help dialog" class="closeButton svelte-4cbhhf"><svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6.28223L17.5 17.7822M17.5 6.28223L6 17.7822" stroke="white" stroke-width="2.5"></path></svg></button></dialog>`;
  pop();
}
function _page($$payload, $$props) {
  push();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<main${attr("class", `svelte-1bjwvtb ${stringify([gameData.state === "paused" ? "paused" : ""].filter(Boolean).join(" "))}`)}>`;
    Header($$payload2, { toggleMenu: openMenu });
    $$payload2.out += `<!----> `;
    Board($$payload2);
    $$payload2.out += `<!----></main> `;
    HelpModal($$payload2);
    $$payload2.out += `<!----> `;
    HamburgerMenu($$payload2);
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
export {
  _page as default
};
