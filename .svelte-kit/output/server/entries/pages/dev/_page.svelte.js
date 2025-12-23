import { h as ensure_array_like, d as attr, e as escape_html, f as stringify, c as pop, p as push } from "../../../chunks/index.js";
import { d as convertToP3, W as WeekStreak, l as levels } from "../../../chunks/WeekStreak.js";
import "chroma-js";
function _page($$payload, $$props) {
  push();
  let lvlIndex = 0;
  let cols = 4;
  let rows = 6;
  let previewBoard = [];
  let spectrum = [];
  let stats = {
    total: 0,
    black: 0,
    white: 0,
    red: 0,
    pink: 0,
    violet: 0,
    indigo: 0,
    blue: 0,
    cyan: 0,
    teal: 0,
    green: 0,
    lime: 0,
    yellow: 0,
    orange: 0
  };
  function isDuplicateColor() {
    const colorSet = /* @__PURE__ */ new Set();
    for (let color of previewBoard) {
      if (colorSet.has(color)) {
        return true;
      }
      colorSet.add(color);
      return colorSet.size;
    }
    return 0;
  }
  const each_array = ensure_array_like(spectrum);
  const each_array_1 = ensure_array_like(Object.entries(stats));
  const each_array_2 = ensure_array_like(previewBoard);
  $$payload.out += `<section class="spectrumBar svelte-ug2kqn"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let color = each_array[$$index];
    $$payload.out += `<div class="colorBlock svelte-ug2kqn"${attr("style", `background-color: ${stringify(color)};`)}></div>`;
  }
  $$payload.out += `<!--]--></section> <section class="spectrumStats svelte-ug2kqn"><div><p class="svelte-ug2kqn">Colors</p> <h2 class="svelte-ug2kqn">${escape_html(spectrum.length)}</h2></div> <div><p class="svelte-ug2kqn">Puzzles</p> <h2 class="svelte-ug2kqn">${escape_html(spectrum.length / 4)}</h2></div> <!--[-->`;
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let [color, count] = each_array_1[$$index_1];
    if (color !== "total") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div><p class="svelte-ug2kqn">${escape_html(color)}</p> <h2 class="svelte-ug2kqn">${escape_html(count)}</h2></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></section> <section><div class="previewBoard svelte-ug2kqn"${attr("style", `grid-template-columns: repeat(${stringify(cols)}, 1fr);`)}><!--[-->`;
  for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
    let color = each_array_2[$$index_2];
    $$payload.out += `<div class="swatch svelte-ug2kqn"${attr("style", `background-color: color(display-p3 ${stringify(convertToP3(color))}); background-color: ${stringify(color)};`)}></div>`;
  }
  $$payload.out += `<!--]--></div> <div class="previewControl"><label for="index">Level Index</label> <input type="number" name="index" id="" step="1"${attr("value", lvlIndex)} min="0"${attr("max", levels.length - 1)}> <label for="col">Columns</label> <input type="number" name="col" id=""${attr("value", cols)} min="1" max="10"> <label for="row">Rows</label> <input type="number" name="row" id=""${attr("value", rows)}> <p>${escape_html(isDuplicateColor())}</p></div></section> `;
  WeekStreak($$payload);
  $$payload.out += `<!---->`;
  pop();
}
export {
  _page as default
};
