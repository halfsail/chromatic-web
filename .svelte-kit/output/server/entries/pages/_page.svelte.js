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
    totalCompleted: 15,
    currentStreak: 5,
    bestStreak: 12,
    averageMoves: 20
  },
  settings: {
    theme: "dark",
    soundEnabled: true,
    hapticEnabled: true
  }
};
let initialState = { ...defaultData };
const gameData = initialState;
function toggleSound() {
  console.log("toggling sound");
  gameData.settings.soundEnabled = !gameData.settings.soundEnabled;
}
function toggleHaptic() {
  gameData.settings.hapticEnabled = !gameData.settings.hapticEnabled;
}
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
  $$payload.out += `<nav class="svelte-1ehgz8m"><header class="svelte-1ehgz8m"><div class="leftSide svelte-1ehgz8m"><button aria-label="menu" class="svelte-1ehgz8m"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-1ehgz8m"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.75 7C20.75 7.41421 20.4142 7.75 20 7.75L4 7.75C3.58579 7.75 3.25 7.41421 3.25 7C3.25 6.58579 3.58579 6.25 4 6.25L20 6.25C20.4142 6.25 20.75 6.58579 20.75 7Z" fill="var(--ink-800)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M20.75 12C20.75 12.4142 20.4142 12.75 20 12.75L4 12.75C3.58579 12.75 3.25 12.4142 3.25 12C3.25 11.5858 3.58579 11.25 4 11.25L20 11.25C20.4142 11.25 20.75 11.5858 20.75 12Z" fill="var(--ink-800)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M20.75 17C20.75 17.4142 20.4142 17.75 20 17.75L4 17.75C3.58579 17.75 3.25 17.4142 3.25 17C3.25 16.5858 3.58579 16.25 4 16.25L20 16.25C20.4142 16.25 20.75 16.5858 20.75 17Z" fill="var(--ink-800)"></path></svg></button></div> <h1 class="svelte-1ehgz8m">Chromatic</h1> <div class="rightSide svelte-1ehgz8m"><button aria-label="rules" class="svelte-1ehgz8m"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-1ehgz8m"><circle cx="12" cy="12" r="10" stroke="var(--ink-800)" stroke-width="1.5"></circle><path d="M10.125 8.875C10.125 7.83947 10.9645 7 12 7C13.0355 7 13.875 7.83947 13.875 8.875C13.875 9.56245 13.505 10.1635 12.9534 10.4899C12.478 10.7711 12 11.1977 12 11.75V13" stroke="var(--ink-800)" stroke-width="1.5" stroke-linecap="round"></path><circle cx="12" cy="16" r="1" fill="var(--ink-800)"></circle></svg></button></div></header> <p class="dateText svelte-1ehgz8m"><span>${escape_html(formatDate(gameData.puzzle.date))}</span> `;
  if (formatDate(gameData.puzzle.date) !== formatDate(/* @__PURE__ */ new Date())) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button class="svelte-1ehgz8m">Play Today's Game.</button>`;
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
  $$payload.out += `<section class="column svelte-3gdyvr"><div class="textColumn svelte-3gdyvr"><h2 class="svelte-3gdyvr">${escape_html(getRandomWinMessage())}</h2> <p class="svelte-3gdyvr">You completed today's puzzle in ${escape_html(gameData.puzzle.moves)} moves.</p></div> `;
  if (gameData.puzzle.date !== (/* @__PURE__ */ new Date()).toISOString().split("T")[0] && gameData.puzzle.completed && isVisible === true) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button class="svelte-3gdyvr">Play Today's Puzzle</button>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button disabled class="svelte-3gdyvr">New Puzzle Tomorrow</button>`;
  }
  $$payload.out += `<!--]--></section>`;
  pop();
}
function BoardControls($$payload, $$props) {
  push();
  $$payload.out += `<section class="controlContainer svelte-1okp2fd"><div class="btn_col svelte-1okp2fd"><button class="round svelte-1okp2fd"${attr("disabled", gameData.puzzle.isAnimating, true)}><svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 18.7089C9.5 18.2894 9.83579 17.9494 10.25 17.9494H14.25C14.6642 17.9494 15 18.2894 15 18.7089C15 19.1283 14.6642 19.4684 14.25 19.4684H10.25C9.83579 19.4684 9.5 19.1283 9.5 18.7089ZM10.1667 21.2405C10.1667 20.821 10.5025 20.481 10.9167 20.481H13.5833C13.9975 20.481 14.3333 20.821 14.3333 21.2405C14.3333 21.66 13.9975 22 13.5833 22H10.9167C10.5025 22 10.1667 21.66 10.1667 21.2405Z" fill="#fff"></path><path d="M7.66058 13.8283L8.76463 14.8807C9.07437 15.1759 9.25 15.5875 9.25 16.0182C9.25 16.6653 9.768 17.1899 10.407 17.1899H14.093C14.732 17.1899 15.25 16.6653 15.25 16.0182C15.25 15.5875 15.4256 15.1759 15.7354 14.8807L16.8394 13.8283C18.3806 12.3481 19.2412 10.4034 19.2499 8.3817L19.25 8.29678C19.25 4.84243 16.116 2 12.25 2C8.38401 2 5.25 4.84243 5.25 8.29678L5.25007 8.3817C5.25875 10.4034 6.11939 12.3481 7.66058 13.8283Z" fill="#fff"></path></svg></button> <p class="btn_label svelte-1okp2fd">Hint</p></div> <div class="btn_col svelte-1okp2fd"><button class="round svelte-1okp2fd"><svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M22.4229 6.5C22.4229 3.87665 20.2962 1.75 17.6729 1.75C15.0495 1.75 12.9229 3.87665 12.9229 6.5C12.9229 9.12335 15.0495 11.25 17.6729 11.25C20.2962 11.25 22.4229 9.12335 22.4229 6.5Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M11.4229 17.5C11.4229 14.8766 9.2962 12.75 6.67285 12.75C4.0495 12.75 1.92285 14.8766 1.92285 17.5C1.92285 20.1234 4.0495 22.25 6.67285 22.25C9.2962 22.25 11.4229 20.1234 11.4229 17.5Z" fill="white"></path><g opacity="0.5"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.92285 6.5C1.92285 3.87665 4.0495 1.75 6.67285 1.75C9.2962 1.75 11.4229 3.87665 11.4229 6.5C11.4229 9.12335 9.2962 11.25 6.67285 11.25C4.0495 11.25 1.92285 9.12335 1.92285 6.5Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12.9229 17.5C12.9229 14.8766 15.0495 12.75 17.6729 12.75C20.2962 12.75 22.4229 14.8766 22.4229 17.5C22.4229 20.1234 20.2962 22.25 17.6729 22.25C15.0495 22.25 12.9229 20.1234 12.9229 17.5Z" fill="white"></path></g></svg></button> <p class="btn_label svelte-1okp2fd">Rotate Hues</p></div></section>`;
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
  $$payload.out += `<section${attr("class", `boardContainer svelte-a1nm2f ${stringify([
    gameData.puzzle.completed === true ? "complete" : ""
  ].filter(Boolean).join(" "))}`)}${attr("style", `--hueRotate: ${stringify(hueRotate)}deg;`)}><section class="board svelte-a1nm2f"${attr("style", `--colSize: ${stringify(gameData.puzzle.col)}; --rowSize: ${stringify(gameData.puzzle.row)};`)}><!--[-->`;
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let color = each_array[i];
    $$payload.out += `<div${attr("class", `swatch ${stringify(isCorner(i))} svelte-a1nm2f ${stringify([
      selectedElements.includes(itemElements[i]) ? "selected" : "",
      gameData.puzzle.locks.includes(i) ? "locked" : ""
    ].filter(Boolean).join(" "))}`)}${attr("style", `--background: ${stringify(color)}; --color: ${stringify(setContrast(color))};`)}${attr("data-index", i)}${attr("data-color", color)}>`;
    if (gameData.puzzle.locks.includes(i)) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-a1nm2f"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.9995 4.20264C13.1659 4.20264 14.285 4.666 15.1099 5.49072C15.9347 6.31557 16.3989 7.43454 16.3989 8.60107V10.3208H16.7583C18.0614 10.3209 19.1176 11.3772 19.1177 12.6802V17.438C19.1174 18.7407 18.0613 19.7982 16.7583 19.7983H7.2417C5.93878 19.7983 4.88259 18.7408 4.88232 17.438V12.6802C4.88238 11.3772 5.93868 10.3209 7.2417 10.3208H7.60107V8.60107C7.60114 7.43461 8.06439 6.31556 8.88916 5.49072C9.71396 4.66592 10.8331 4.20277 11.9995 4.20264ZM11.9995 6.20264C11.3635 6.20277 10.7529 6.45506 10.3032 6.90479C9.85352 7.35456 9.60114 7.96506 9.60107 8.60107V10.3208H14.3989V8.60107C14.3989 7.96501 14.1456 7.35458 13.6958 6.90479C13.2461 6.4552 12.6356 6.20264 11.9995 6.20264Z" fill="var(--color)"></path></svg>`;
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
function Toggle($$payload, $$props) {
  let {
    label = "Toggle",
    checked = void 0,
    name = "toggle",
    toggle
  } = $$props;
  $$payload.out += `<div class="inputRow svelte-1t840aw"><p class="svelte-1t840aw">${escape_html(label)}</p> <label${attr("for", name)}${attr("class", `svelte-1t840aw ${stringify([checked ? "check" : ""].filter(Boolean).join(" "))}`)}><input${attr("checked", checked, true)}${attr("id", name)} class="checkbox_container svelte-1t840aw" type="checkbox"> <div class="twoDots svelte-1t840aw"><div class="emptyDot svelte-1t840aw"><svg class="noToggle svelte-1t840aw" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6.28223L17.5 17.7822M17.5 6.28223L6 17.7822" stroke="var(--ink-900)" stroke-width="2.5"></path></svg></div> <div class="checkedDot svelte-1t840aw"><svg class="yesToggle svelte-1t840aw" viewBox="0 0 21 21"><polyline points="5 10.75 8.5 14.25 16 6"></polyline></svg></div></div></label></div>`;
  bind_props($$props, { checked });
}
function HamburgerMenu($$payload, $$props) {
  push();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<dialog class="modal svelte-3uet0q"><div class="dialog_container main-dialog fixedWidth svelte-3uet0q" role="dialog" aria-labelledby="dialog-title"><div class="modalHeader svelte-3uet0q"><img src="/favicon.svg" alt="" class="svelte-3uet0q"> <h2 class="svelte-3uet0q">Chromatic</h2> <p class="versionPill svelte-3uet0q">${escape_html(version)}</p> <p class="svelte-3uet0q">A casual color puzzle game about organizing gradients.</p> <p class="madeBy svelte-3uet0q"><span class="svelte-3uet0q">Game by</span> <a href="https://feyder.design" class="svelte-3uet0q">Feyder</a></p></div></div> <div class="dialog_container fixedWidth svelte-3uet0q" role="dialog" aria-labelledby="dialog-title"><ul class="svelte-3uet0q"><li class="svelte-3uet0q"><button class="listBtn svelte-3uet0q"><span>How to Play</span> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-3uet0q"><path d="M5 12H19" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 5L19 12L12 19" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button></li> <li class="svelte-3uet0q">`;
    Toggle($$payload2, {
      label: "Sound Effects",
      name: "sound",
      toggle: toggleSound,
      get checked() {
        return gameData.settings.soundEnabled;
      },
      set checked($$value) {
        gameData.settings.soundEnabled = $$value;
        $$settled = false;
      }
    });
    $$payload2.out += `<!----></li> <li class="svelte-3uet0q">`;
    Toggle($$payload2, {
      label: "Haptics",
      name: "haptic",
      toggle: toggleHaptic,
      get checked() {
        return gameData.settings.hapticEnabled;
      },
      set checked($$value) {
        gameData.settings.hapticEnabled = $$value;
        $$settled = false;
      }
    });
    $$payload2.out += `<!----></li></ul></div> <button type="button" aria-label="Close help dialog" class="closeButton svelte-3uet0q"><svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6.28223L17.5 17.7822M17.5 6.28223L6 17.7822" stroke="white" stroke-width="2.5"></path></svg></button></dialog>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
function HelpModal($$payload, $$props) {
  push();
  $$payload.out += `<dialog class="modal svelte-hy1jfn"><div class="dialog_container main-dialog svelte-hy1jfn" role="dialog" aria-labelledby="dialog-title"><div><h3 class="svelte-hy1jfn">How to Play</h3> <p class="svelte-hy1jfn">Move the tiles until the gradient is seamless and all the colors flow perfectly into one another.</p></div> <div><h3 class="svelte-hy1jfn">Controls</h3> <p class="svelte-hy1jfn">Drag and drop or click color tiles to swap two tiles.</p></div> <div><h3 class="svelte-hy1jfn">Tips</h3> <p class="svelte-hy1jfn">Locked Tiles are in the correct spot. Use them as reference points to help sort the gradient.</p> <p class="svelte-hy1jfn">Use Rotate Hues if you are having trouble seeing the different between colors.</p></div></div> <button type="button" aria-label="Close help dialog" class="closeButton svelte-hy1jfn"><svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6.28223L17.5 17.7822M17.5 6.28223L6 17.7822" stroke="white" stroke-width="2.5"></path></svg></button></dialog>`;
  pop();
}
function _page($$payload, $$props) {
  push();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<main${attr("class", `svelte-1hg78y ${stringify([gameData.state === "paused" ? "paused" : ""].filter(Boolean).join(" "))}`)}>`;
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
