import { e as ensure_array_like, d as stringify, c as pop, p as push } from "./index.js";
import "clsx";
import "chroma-js";
import { v as version } from "./environment.js";
import { e as escape_html } from "./escaping.js";
const replacements = {
  translate: /* @__PURE__ */ new Map([
    [true, "yes"],
    [false, "no"]
  ])
};
function attr(name, value, is_boolean = false) {
  if (value == null || !value && is_boolean || value === "" && name === "class") return "";
  const normalized = name in replacements && replacements[name].get(value) || value;
  const assignment = is_boolean ? "" : `="${escape_html(normalized, true)}"`;
  return ` ${name}${assignment}`;
}
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
    averageMoves: 0,
    completedDates: [],
    weekStartDate: getWeekStartDate()
  },
  settings: {
    theme: "dark",
    soundEnabled: true,
    hapticEnabled: true,
    relaxedMode: true,
    difficulty: "normal"
  }
};
let initialState = { ...defaultData };
const gameData = initialState;
function getWeekStartDate(date = /* @__PURE__ */ new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().split("T")[0];
}
function WeekStreak($$payload, $$props) {
  push();
  let weekDays;
  function getCurrentWeek() {
    const today = /* @__PURE__ */ new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  }
  function isFutureDate(date) {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate > today;
  }
  function isToday(date) {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate.getTime() === today.getTime();
  }
  function isPastDate(date) {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  }
  function isCompleted(date, completedDates) {
    return completedDates.includes(date.toISOString().split("T")[0]);
  }
  function isMissed(date, completedDates) {
    return isPastDate(date) && !isCompleted(date, completedDates);
  }
  weekDays = getCurrentWeek();
  const each_array = ensure_array_like(weekDays);
  $$payload.out += `<div class="week-view svelte-pvi9dp"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let day = each_array[$$index];
    $$payload.out += `<button${attr("class", `day svelte-pvi9dp ${stringify([
      isMissed(day, gameData.stats.completedDates) ? "missed" : "",
      isToday(day) ? "today" : "",
      isFutureDate(day) ? "future" : "",
      isCompleted(day, gameData.stats.completedDates) ? "completed" : ""
    ].filter(Boolean).join(" "))}`)}${attr("disabled", isFutureDate(day), true)}><span class="svelte-pvi9dp">${escape_html(day.toLocaleDateString("en", { weekday: "narrow" }))}</span> <div class="indicator svelte-pvi9dp">`;
    if (gameData.stats.completedDates.includes(day.toISOString().split("T")[0])) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="checkmark svelte-pvi9dp"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-6 svelte-pvi9dp"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg></span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div></button>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  WeekStreak as W,
  attr as a,
  gameData as g
};
