import { d as attr, e as escape_html, f as stringify, p as push, c as pop, h as ensure_array_like, j as clsx, k as hasContext, g as getContext, s as setContext, o as once, l as add_styles, m as merge_styles, n as spread_props, q as spread_attributes, t as copy_payload, u as assign_payload } from "../../chunks/index.js";
import { g as gameData, W as WeekStreak, r as randomPlayLevel, i as increaseHints, a as increaseMove, b as getColors, c as completePuzzle } from "../../chunks/WeekStreak.js";
import "clsx";
import { gsap } from "gsap";
import chroma from "chroma-js";
import { r as run } from "../../chunks/utils2.js";
import { v as version } from "../../chunks/environment.js";
let audioContext = null;
let sounds = {};
let audioContextInitialized = false;
function initializeSounds() {
  if (audioContextInitialized) return;
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const soundFiles = {
      tap: "./audio/pop_down.mp3",
      cellClick: "./audio/lock.mp3",
      cellMove: "./audio/lock_48k.mp3",
      cellHover: "./audio/lock.mp3",
      win: "./audio/kirakira.mp3",
      correctSpot: "./audio/correct_spot.mp3"
    };
    const loadPromises = Object.entries(soundFiles).map(async ([key, url]) => {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        sounds[key] = audioBuffer;
      } catch (err) {
        console.warn(`Failed to load sound ${key}:`, err);
      }
    });
    Promise.all(loadPromises).then(() => {
      audioContextInitialized = true;
    });
  } catch (err) {
    console.warn("Failed to initialize audio context:", err);
  }
}
const haptics = {
  tap: {
    pattern: 50,
    // Single 50ms vibration
    intensity: 2
  },
  cellClick: {
    pattern: 30,
    // Single 50ms vibration
    intensity: 1
  },
  cellMove: {
    pattern: 70,
    // Single 70ms vibration
    intensity: 2
  },
  cellHover: {
    pattern: 20,
    // Single 20ms vibration
    intensity: 1
  },
  move: {
    pattern: 100,
    // Single 100ms vibration
    intensity: 1
  },
  back: {
    pattern: 100,
    // Single 100ms vibration
    intensity: 1
  },
  win: {
    pattern: [40, 30, 40, 30, 40],
    // Simple pattern
    intensity: 1
  },
  error: {
    pattern: 200,
    // Single 200ms vibration
    intensity: 0.3
  },
  correctSpot: {
    pattern: [30, 20, 30],
    // Simple pattern
    intensity: 1
  }
};
function playFeedback(type) {
  if (!audioContextInitialized) {
    initializeSounds();
    console.log(type);
  }
  if (sounds[type] && gameData.settings.soundEnabled === true && audioContext) {
    try {
      const source = audioContext.createBufferSource();
      source.buffer = sounds[type];
      source.connect(audioContext.destination);
      source.start(0);
    } catch (err) {
      console.warn("Sound playback failed:", err);
    }
  }
  if (gameData.settings.hapticEnabled === true) {
    try {
      if (!navigator.vibrate) {
        console.warn("Vibration API not supported on this device/browser");
        return;
      }
      const pattern = haptics[type]?.pattern;
      if (!pattern) {
        console.warn(`No haptic pattern defined for type: ${type}`);
        return;
      }
      console.log(`Attempting to vibrate with pattern:`, pattern);
      const success = navigator.vibrate(pattern);
      if (!success) {
        console.warn("Vibration was rejected by the device");
      }
    } catch (err) {
      console.warn("Haptic feedback failed:", err);
    }
  }
}
function openMenu(name) {
}
function RoundBtn($$payload, $$props) {
  let {
    onclick,
    label,
    type = "secondary",
    // Default to primary or 'subtle'
    icon,
    // This will be our snippet (slot)
    disabled
  } = $$props;
  $$payload.out += `<button${attr("disabled", disabled, true)}${attr("aria-label", label)}${attr("class", `svelte-46krl8 ${stringify([
    type === "secondary" ? "btn-secondary" : "",
    type === "subtle" ? "btn-subtle" : ""
  ].filter(Boolean).join(" "))}`)}>`;
  if (icon) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="btn-surface svelte-46krl8">`;
    icon($$payload);
    $$payload.out += `<!----></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (label && type === "secondary") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span class="btn-label svelte-46krl8">${escape_html(label)}</span>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></button>`;
}
function Header($$payload, $$props) {
  push();
  const { toggleMenu } = $$props;
  let longDate = void 0;
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
  $$payload.out += `<nav class="svelte-k3c5z5"><div class="wideScreen svelte-k3c5z5">`;
  {
    let icon = function($$payload2) {
      $$payload2.out += `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5L20 5" stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 12L20 12" stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 19L20 19" stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
    };
    RoundBtn($$payload, {
      type: "subtle",
      onclick: () => toggleMenu("sidebar"),
      icon
    });
  }
  $$payload.out += `<!----></div> <h1 class="svelte-k3c5z5">Chromatic</h1> <div class="wideScreen svelte-k3c5z5">`;
  {
    let icon = function($$payload2) {
      $$payload2.out += `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="var(--icon-color)" stroke-width="1.5"></circle><path d="M10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9C14 9.39815 13.8837 9.76913 13.6831 10.0808C13.0854 11.0097 12 11.8954 12 13V13.5" stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round"></path><path d="M11.992 17H12.001" stroke="var(--icon-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
    };
    RoundBtn($$payload, {
      label: "Rules",
      type: "subtle",
      onclick: () => toggleMenu("help"),
      icon
    });
  }
  $$payload.out += `<!----></div> `;
  if (gameData.puzzle.date !== "Random" && !gameData.puzzle.completed) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p class="dateText svelte-k3c5z5"><span>${escape_html(longDate)}</span> `;
    if (formatDate(gameData.puzzle.date) !== formatDate(/* @__PURE__ */ new Date())) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<button class="svelte-k3c5z5">Play Today's Game.</button>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></p>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></nav>`;
  pop();
}
const bars = Array(12).fill(0);
function Loader($$payload, $$props) {
  push();
  let { visible, class: className } = $$props;
  const each_array = ensure_array_like(bars);
  $$payload.out += `<div${attr("class", clsx(["sonner-loading-wrapper", className].filter(Boolean).join(" ")))}${attr("data-visible", visible)}><div class="sonner-spinner"><!--[-->`;
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    each_array[i];
    $$payload.out += `<div class="sonner-loading-bar"></div>`;
  }
  $$payload.out += `<!--]--></div></div>`;
  pop();
}
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
const isBrowser = typeof document !== "undefined";
const defaultWindow = void 0;
function getActiveElement(document2) {
  let activeElement = document2.activeElement;
  while (activeElement?.shadowRoot) {
    const node = activeElement.shadowRoot.activeElement;
    if (node === activeElement)
      break;
    else
      activeElement = node;
  }
  return activeElement;
}
function createSubscriber(_) {
  return () => {
  };
}
class ActiveElement {
  #document;
  #subscribe;
  constructor(options = {}) {
    const {
      window: window2 = defaultWindow,
      document: document2 = window2?.document
    } = options;
    if (window2 === void 0) return;
    this.#document = document2;
    this.#subscribe = createSubscriber();
  }
  get current() {
    this.#subscribe?.();
    if (!this.#document) return null;
    return getActiveElement(this.#document);
  }
}
new ActiveElement();
class Context {
  #name;
  #key;
  /**
   * @param name The name of the context.
   * This is used for generating the context key and error messages.
   */
  constructor(name) {
    this.#name = name;
    this.#key = Symbol(name);
  }
  /**
   * The key used to get and set the context.
   *
   * It is not recommended to use this value directly.
   * Instead, use the methods provided by this class.
   */
  get key() {
    return this.#key;
  }
  /**
   * Checks whether this has been set in the context of a parent component.
   *
   * Must be called during component initialisation.
   */
  exists() {
    return hasContext(this.#key);
  }
  /**
   * Retrieves the context that belongs to the closest parent component.
   *
   * Must be called during component initialisation.
   *
   * @throws An error if the context does not exist.
   */
  get() {
    const context = getContext(this.#key);
    if (context === void 0) {
      throw new Error(`Context "${this.#name}" not found`);
    }
    return context;
  }
  /**
   * Retrieves the context that belongs to the closest parent component,
   * or the given fallback value if the context does not exist.
   *
   * Must be called during component initialisation.
   */
  getOr(fallback) {
    const context = getContext(this.#key);
    if (context === void 0) {
      return fallback;
    }
    return context;
  }
  /**
   * Associates the given value with the current component and returns it.
   *
   * Must be called during component initialisation.
   */
  set(context) {
    return setContext(this.#key, context);
  }
}
const sonnerContext = new Context("<Toaster/>");
let toastsCounter = 0;
class ToastState {
  toasts = [];
  heights = [];
  #findToastIdx = (id) => {
    const idx = this.toasts.findIndex((toast2) => toast2.id === id);
    if (idx === -1) return null;
    return idx;
  };
  addToast = (data) => {
    if (!isBrowser) return;
    this.toasts.unshift(data);
  };
  updateToast = ({ id, data, type, message }) => {
    const toastIdx = this.toasts.findIndex((toast2) => toast2.id === id);
    const toastToUpdate = this.toasts[toastIdx];
    this.toasts[toastIdx] = {
      ...toastToUpdate,
      ...data,
      id,
      title: message,
      type,
      updated: true
    };
  };
  create = (data) => {
    const { message, ...rest } = data;
    const id = typeof data?.id === "number" || data.id && data.id?.length > 0 ? data.id : toastsCounter++;
    const dismissable = data.dismissable === void 0 ? true : data.dismissable;
    const type = data.type === void 0 ? "default" : data.type;
    run(() => {
      const alreadyExists = this.toasts.find((toast2) => toast2.id === id);
      if (alreadyExists) {
        this.updateToast({ id, data, type, message, dismissable });
      } else {
        this.addToast({
          ...rest,
          id,
          title: message,
          dismissable,
          type
        });
      }
    });
    return id;
  };
  dismiss = (id) => {
    run(() => {
      if (id === void 0) {
        this.toasts = this.toasts.map((toast2) => ({ ...toast2, dismiss: true }));
        return;
      }
      const toastIdx = this.toasts.findIndex((toast2) => toast2.id === id);
      if (this.toasts[toastIdx]) {
        this.toasts[toastIdx] = { ...this.toasts[toastIdx], dismiss: true };
      }
    });
    return id;
  };
  remove = (id) => {
    if (id === void 0) {
      this.toasts = [];
      return;
    }
    const toastIdx = this.#findToastIdx(id);
    if (toastIdx === null) return;
    this.toasts.splice(toastIdx, 1);
    return id;
  };
  message = (message, data) => {
    return this.create({ ...data, type: "default", message });
  };
  error = (message, data) => {
    return this.create({ ...data, type: "error", message });
  };
  success = (message, data) => {
    return this.create({ ...data, type: "success", message });
  };
  info = (message, data) => {
    return this.create({ ...data, type: "info", message });
  };
  warning = (message, data) => {
    return this.create({ ...data, type: "warning", message });
  };
  loading = (message, data) => {
    return this.create({ ...data, type: "loading", message });
  };
  promise = (promise, data) => {
    if (!data) {
      return;
    }
    let id = void 0;
    if (data.loading !== void 0) {
      id = this.create({
        ...data,
        promise,
        type: "loading",
        message: typeof data.loading === "string" ? data.loading : data.loading()
      });
    }
    const p = promise instanceof Promise ? promise : promise();
    let shouldDismiss = id !== void 0;
    p.then((response) => {
      if (typeof response === "object" && response && "ok" in response && typeof response.ok === "boolean" && !response.ok) {
        shouldDismiss = false;
        const message = constructPromiseErrorMessage(response);
        this.create({ id, type: "error", message });
      } else if (data.success !== void 0) {
        shouldDismiss = false;
        const message = typeof data.success === "function" ? data.success(response) : data.success;
        this.create({ id, type: "success", message });
      }
    }).catch((error) => {
      if (data.error !== void 0) {
        shouldDismiss = false;
        const message = typeof data.error === "function" ? data.error(error) : data.error;
        this.create({ id, type: "error", message });
      }
    }).finally(() => {
      if (shouldDismiss) {
        this.dismiss(id);
        id = void 0;
      }
      data.finally?.();
    });
    return id;
  };
  custom = (component, data) => {
    const id = data?.id || toastsCounter++;
    this.create({ component, id, ...data });
    return id;
  };
  removeHeight = (id) => {
    this.heights = this.heights.filter((height) => height.toastId !== id);
  };
  setHeight = (data) => {
    const toastIdx = this.#findToastIdx(data.toastId);
    if (toastIdx === null) {
      this.heights.push(data);
      return;
    }
    this.heights[toastIdx] = data;
  };
  reset = () => {
    this.toasts = [];
    this.heights = [];
  };
}
function constructPromiseErrorMessage(response) {
  if (response && typeof response === "object" && "status" in response) {
    return `HTTP error! Status: ${response.status}`;
  }
  return `Error! ${response}`;
}
const toastState = new ToastState();
function toastFunction(message, data) {
  return toastState.create({ message, ...data });
}
class SonnerState {
  #activeToasts = once(() => toastState.toasts.filter((toast2) => !toast2.dismiss));
  get toasts() {
    return this.#activeToasts();
  }
}
const basicToast = toastFunction;
const toast = Object.assign(basicToast, {
  success: toastState.success,
  info: toastState.info,
  warning: toastState.warning,
  error: toastState.error,
  custom: toastState.custom,
  message: toastState.message,
  promise: toastState.promise,
  dismiss: toastState.dismiss,
  loading: toastState.loading,
  getActiveToasts: () => {
    return toastState.toasts.filter((toast2) => !toast2.dismiss);
  }
});
function isAction(action) {
  return action.label !== void 0;
}
const TOAST_LIFETIME$1 = 4e3;
const GAP$1 = 14;
const TIME_BEFORE_UNMOUNT = 200;
const DEFAULT_TOAST_CLASSES = {
  toast: "",
  title: "",
  description: "",
  loader: "",
  closeButton: "",
  cancelButton: "",
  actionButton: "",
  action: "",
  warning: "",
  error: "",
  success: "",
  default: "",
  info: "",
  loading: ""
};
function Toast($$payload, $$props) {
  push();
  let {
    toast: toast2,
    index,
    expanded,
    invert: invertFromToaster,
    position,
    visibleToasts,
    expandByDefault,
    closeButton: closeButtonFromToaster,
    interacting,
    cancelButtonStyle = "",
    actionButtonStyle = "",
    duration: durationFromToaster,
    descriptionClass = "",
    classes: classesProp,
    unstyled = false,
    loadingIcon,
    successIcon,
    errorIcon,
    warningIcon,
    closeIcon,
    infoIcon,
    defaultRichColors = false,
    swipeDirections: swipeDirectionsProp,
    closeButtonAriaLabel,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const defaultClasses = { ...DEFAULT_TOAST_CLASSES };
  let mounted = false;
  let removed = false;
  let swiping = false;
  let swipeOut = false;
  let isSwiped = false;
  let offsetBeforeRemove = 0;
  let initialHeight = 0;
  toast2.duration || durationFromToaster || TOAST_LIFETIME$1;
  let swipeOutDirection = null;
  const isFront = index === 0;
  const isVisible = index + 1 <= visibleToasts;
  const toastType = toast2.type;
  const dismissable = toast2.dismissable !== false;
  const toastClass = toast2.class || "";
  const toastDescriptionClass = toast2.descriptionClass || "";
  const heightIndex = toastState.heights.findIndex((height) => height.toastId === toast2.id) || 0;
  const closeButton = toast2.closeButton ?? closeButtonFromToaster;
  toast2.duration ?? durationFromToaster ?? TOAST_LIFETIME$1;
  const coords = position.split("-");
  const toastsHeightBefore = toastState.heights.reduce(
    (prev, curr, reducerIndex) => {
      if (reducerIndex >= heightIndex) return prev;
      return prev + curr.height;
    },
    0
  );
  const invert = toast2.invert || invertFromToaster;
  const disabled = toastType === "loading";
  const classes = { ...defaultClasses, ...classesProp };
  toast2.title;
  toast2.description;
  const offset = Math.round(heightIndex * GAP$1 + toastsHeightBefore);
  function deleteToast() {
    removed = true;
    offsetBeforeRemove = offset;
    toastState.removeHeight(toast2.id);
    setTimeout(
      () => {
        toastState.remove(toast2.id);
      },
      TIME_BEFORE_UNMOUNT
    );
  }
  toast2.promise && toastType === "loading" || toast2.duration === Number.POSITIVE_INFINITY;
  const icon = (() => {
    if (toast2.icon) return toast2.icon;
    if (toastType === "success") return successIcon;
    if (toastType === "error") return errorIcon;
    if (toastType === "warning") return warningIcon;
    if (toastType === "info") return infoIcon;
    if (toastType === "loading") return loadingIcon;
    return null;
  })();
  function LoadingIcon($$payload2) {
    if (loadingIcon) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div${attr("class", clsx(cn(classes?.loader, toast2?.classes?.loader, "sonner-loader")))}${attr("data-visible", toastType === "loading")}>`;
      loadingIcon($$payload2);
      $$payload2.out += `<!----></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
      Loader($$payload2, {
        class: cn(classes?.loader, toast2.classes?.loader),
        visible: toastType === "loading"
      });
    }
    $$payload2.out += `<!--]-->`;
  }
  $$payload.out += `<li${add_styles(merge_styles(`${restProps.style} ${toast2.style}`, {
    "--index": index,
    "--toasts-before": index,
    "--z-index": toastState.toasts.length - index,
    "--offset": `${removed ? offsetBeforeRemove : offset}px`,
    "--initial-height": expandByDefault ? "auto" : `${initialHeight}px`
  }))}${attr("tabindex", 0)}${attr("class", clsx(cn(restProps.class, toastClass, classes?.toast, toast2?.classes?.toast, classes?.[toastType], toast2?.classes?.[toastType])))} data-sonner-toast=""${attr("data-rich-colors", toast2.richColors ?? defaultRichColors)}${attr("data-styled", !(toast2.component || toast2.unstyled || unstyled))}${attr("data-mounted", mounted)}${attr("data-promise", Boolean(toast2.promise))}${attr("data-swiped", isSwiped)}${attr("data-removed", removed)}${attr("data-visible", isVisible)}${attr("data-y-position", coords[0])}${attr("data-x-position", coords[1])}${attr("data-index", index)}${attr("data-front", isFront)}${attr("data-swiping", swiping)}${attr("data-dismissable", dismissable)}${attr("data-type", toastType)}${attr("data-invert", invert)}${attr("data-swipe-out", swipeOut)}${attr("data-swipe-direction", swipeOutDirection)}${attr("data-expanded", Boolean(expanded || expandByDefault && mounted))}>`;
  if (closeButton && !toast2.component && toastType !== "loading" && closeIcon !== null) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button${attr("aria-label", closeButtonAriaLabel)}${attr("data-disabled", disabled)} data-close-button=""${attr("class", clsx(cn(classes?.closeButton, toast2?.classes?.closeButton)))}>`;
    closeIcon?.($$payload);
    $$payload.out += `<!----></button>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (toast2.component) {
    $$payload.out += "<!--[-->";
    const Component = toast2.component;
    $$payload.out += `<!---->`;
    Component($$payload, spread_props([
      toast2.componentProps,
      { closeToast: deleteToast }
    ]));
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    if ((toastType || toast2.icon || toast2.promise) && toast2.icon !== null && (icon !== null || toast2.icon)) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div data-icon=""${attr("class", clsx(cn(classes?.icon, toast2?.classes?.icon)))}>`;
      if (toast2.promise || toastType === "loading") {
        $$payload.out += "<!--[-->";
        if (toast2.icon) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<!---->`;
          toast2.icon($$payload, {});
          $$payload.out += `<!---->`;
        } else {
          $$payload.out += "<!--[!-->";
          LoadingIcon($$payload);
        }
        $$payload.out += `<!--]-->`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (toast2.type !== "loading") {
        $$payload.out += "<!--[-->";
        if (toast2.icon) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<!---->`;
          toast2.icon($$payload, {});
          $$payload.out += `<!---->`;
        } else {
          $$payload.out += "<!--[!-->";
          if (toastType === "success") {
            $$payload.out += "<!--[-->";
            successIcon?.($$payload);
            $$payload.out += `<!---->`;
          } else {
            $$payload.out += "<!--[!-->";
            if (toastType === "error") {
              $$payload.out += "<!--[-->";
              errorIcon?.($$payload);
              $$payload.out += `<!---->`;
            } else {
              $$payload.out += "<!--[!-->";
              if (toastType === "warning") {
                $$payload.out += "<!--[-->";
                warningIcon?.($$payload);
                $$payload.out += `<!---->`;
              } else {
                $$payload.out += "<!--[!-->";
                if (toastType === "info") {
                  $$payload.out += "<!--[-->";
                  infoIcon?.($$payload);
                  $$payload.out += `<!---->`;
                } else {
                  $$payload.out += "<!--[!-->";
                }
                $$payload.out += `<!--]-->`;
              }
              $$payload.out += `<!--]-->`;
            }
            $$payload.out += `<!--]-->`;
          }
          $$payload.out += `<!--]-->`;
        }
        $$payload.out += `<!--]-->`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div data-content=""><div data-title=""${attr("class", clsx(cn(classes?.title, toast2?.classes?.title)))}>`;
    if (toast2.title) {
      $$payload.out += "<!--[-->";
      if (typeof toast2.title !== "string") {
        $$payload.out += "<!--[-->";
        const Title = toast2.title;
        $$payload.out += `<!---->`;
        Title($$payload, spread_props([toast2.componentProps]));
        $$payload.out += `<!---->`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `${escape_html(toast2.title)}`;
      }
      $$payload.out += `<!--]-->`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> `;
    if (toast2.description) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div data-description=""${attr("class", clsx(cn(descriptionClass, toastDescriptionClass, classes?.description, toast2.classes?.description)))}>`;
      if (typeof toast2.description !== "string") {
        $$payload.out += "<!--[-->";
        const Description = toast2.description;
        $$payload.out += `<!---->`;
        Description($$payload, spread_props([toast2.componentProps]));
        $$payload.out += `<!---->`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `${escape_html(toast2.description)}`;
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> `;
    if (toast2.cancel) {
      $$payload.out += "<!--[-->";
      if (typeof toast2.cancel === "function") {
        $$payload.out += "<!--[-->";
        $$payload.out += `<!---->`;
        toast2.cancel($$payload, {});
        $$payload.out += `<!---->`;
      } else {
        $$payload.out += "<!--[!-->";
        if (isAction(toast2.cancel)) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<button data-button="" data-cancel=""${attr("style", toast2.cancelButtonStyle ?? cancelButtonStyle)}${attr("class", clsx(cn(classes?.cancelButton, toast2?.classes?.cancelButton)))}>${escape_html(toast2.cancel.label)}</button>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]-->`;
      }
      $$payload.out += `<!--]-->`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (toast2.action) {
      $$payload.out += "<!--[-->";
      if (typeof toast2.action === "function") {
        $$payload.out += "<!--[-->";
        $$payload.out += `<!---->`;
        toast2.action($$payload, {});
        $$payload.out += `<!---->`;
      } else {
        $$payload.out += "<!--[!-->";
        if (isAction(toast2.action)) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<button data-button=""${attr("style", toast2.actionButtonStyle ?? actionButtonStyle)}${attr("class", clsx(cn(classes?.actionButton, toast2?.classes?.actionButton)))}>${escape_html(toast2.action.label)}</button>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]-->`;
      }
      $$payload.out += `<!--]-->`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></li>`;
  pop();
}
function SuccessIcon($$payload) {
  $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20" data-sonner-success-icon=""><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"></path></svg>`;
}
function ErrorIcon($$payload) {
  $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20" data-sonner-error-icon=""><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>`;
}
function WarningIcon($$payload) {
  $$payload.out += `<svg viewBox="0 0 64 64" fill="currentColor" height="20" width="20" data-sonner-warning-icon="" xmlns="http://www.w3.org/2000/svg"><path d="M32.427,7.987c2.183,0.124 4,1.165 5.096,3.281l17.936,36.208c1.739,3.66 -0.954,8.585 -5.373,8.656l-36.119,0c-4.022,-0.064 -7.322,-4.631 -5.352,-8.696l18.271,-36.207c0.342,-0.65 0.498,-0.838 0.793,-1.179c1.186,-1.375 2.483,-2.111 4.748,-2.063Zm-0.295,3.997c-0.687,0.034 -1.316,0.419 -1.659,1.017c-6.312,11.979 -12.397,24.081 -18.301,36.267c-0.546,1.225 0.391,2.797 1.762,2.863c12.06,0.195 24.125,0.195 36.185,0c1.325,-0.064 2.321,-1.584 1.769,-2.85c-5.793,-12.184 -11.765,-24.286 -17.966,-36.267c-0.366,-0.651 -0.903,-1.042 -1.79,-1.03Z"></path><path d="M33.631,40.581l-3.348,0l-0.368,-16.449l4.1,0l-0.384,16.449Zm-3.828,5.03c0,-0.609 0.197,-1.113 0.592,-1.514c0.396,-0.4 0.935,-0.601 1.618,-0.601c0.684,0 1.223,0.201 1.618,0.601c0.395,0.401 0.593,0.905 0.593,1.514c0,0.587 -0.193,1.078 -0.577,1.473c-0.385,0.395 -0.929,0.593 -1.634,0.593c-0.705,0 -1.249,-0.198 -1.634,-0.593c-0.384,-0.395 -0.576,-0.886 -0.576,-1.473Z"></path></svg>`;
}
function InfoIcon($$payload) {
  $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20" data-sonner-info-icon=""><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"></path></svg>`;
}
function CloseIcon($$payload) {
  $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-sonner-close-icon=""><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
}
const VISIBLE_TOASTS_AMOUNT = 3;
const VIEWPORT_OFFSET = "24px";
const MOBILE_VIEWPORT_OFFSET = "16px";
const TOAST_LIFETIME = 4e3;
const TOAST_WIDTH = 356;
const GAP = 14;
const DARK = "dark";
const LIGHT = "light";
function getOffsetObject(defaultOffset, mobileOffset) {
  const styles = {};
  [defaultOffset, mobileOffset].forEach((offset, index) => {
    const isMobile = index === 1;
    const prefix = isMobile ? "--mobile-offset" : "--offset";
    const defaultValue = isMobile ? MOBILE_VIEWPORT_OFFSET : VIEWPORT_OFFSET;
    function assignAll(offset2) {
      ["top", "right", "bottom", "left"].forEach((key) => {
        styles[`${prefix}-${key}`] = typeof offset2 === "number" ? `${offset2}px` : offset2;
      });
    }
    if (typeof offset === "number" || typeof offset === "string") {
      assignAll(offset);
    } else if (typeof offset === "object") {
      ["top", "right", "bottom", "left"].forEach((key) => {
        const value = offset[key];
        if (value === void 0) {
          styles[`${prefix}-${key}`] = defaultValue;
        } else {
          styles[`${prefix}-${key}`] = typeof value === "number" ? `${value}px` : value;
        }
      });
    } else {
      assignAll(defaultValue);
    }
  });
  return styles;
}
function Toaster($$payload, $$props) {
  push();
  function getInitialTheme(t) {
    if (t !== "system") return t;
    if (typeof window !== "undefined") {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return DARK;
      }
      return LIGHT;
    }
    return LIGHT;
  }
  let {
    invert = false,
    position = "bottom-right",
    hotkey = ["altKey", "KeyT"],
    expand = false,
    closeButton = false,
    offset = VIEWPORT_OFFSET,
    mobileOffset = MOBILE_VIEWPORT_OFFSET,
    theme = "light",
    richColors = false,
    duration = TOAST_LIFETIME,
    visibleToasts = VISIBLE_TOASTS_AMOUNT,
    toastOptions = {},
    dir = "auto",
    gap = GAP,
    loadingIcon: loadingIconProp,
    successIcon: successIconProp,
    errorIcon: errorIconProp,
    warningIcon: warningIconProp,
    closeIcon: closeIconProp,
    infoIcon: infoIconProp,
    containerAriaLabel = "Notifications",
    class: className,
    closeButtonAriaLabel = "Close toast",
    onblur,
    onfocus,
    onmouseenter,
    onmousemove,
    onmouseleave,
    ondragend,
    onpointerdown,
    onpointerup,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  function getDocumentDirection() {
    if (dir !== "auto") return dir;
    if (typeof window === "undefined") return "ltr";
    if (typeof document === "undefined") return "ltr";
    const dirAttribute = document.documentElement.getAttribute("dir");
    if (dirAttribute === "auto" || !dirAttribute) {
      run(() => dir = window.getComputedStyle(document.documentElement).direction ?? "ltr");
      return dir;
    }
    run(() => dir = dirAttribute);
    return dirAttribute;
  }
  const possiblePositions = Array.from(new Set([
    position,
    ...toastState.toasts.filter((toast2) => toast2.position).map((toast2) => toast2.position)
  ].filter(Boolean)));
  let expanded = false;
  let interacting = false;
  let actualTheme = getInitialTheme(theme);
  const hotkeyLabel = hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
  sonnerContext.set(new SonnerState());
  $$payload.out += `<section${attr("aria-label", `${stringify(containerAriaLabel)} ${stringify(hotkeyLabel)}`)}${attr("tabindex", -1)} aria-live="polite" aria-relevant="additions text" aria-atomic="false" class="svelte-tppj9g">`;
  if (toastState.toasts.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(possiblePositions);
    $$payload.out += `<!--[-->`;
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let position2 = each_array[index];
      const [y, x] = position2.split("-");
      const offsetObject = getOffsetObject(offset, mobileOffset);
      const each_array_1 = ensure_array_like(toastState.toasts.filter((toast2) => !toast2.position && index === 0 || toast2.position === position2));
      $$payload.out += `<ol${spread_attributes(
        {
          tabindex: -1,
          dir: getDocumentDirection(),
          class: clsx(className) + " svelte-tppj9g",
          "data-sonner-toaster": true,
          "data-sonner-theme": actualTheme,
          "data-y-position": y,
          "data-x-position": x,
          style: restProps.style,
          ...restProps
        },
        { "svelte-tppj9g": true },
        {
          "--front-toast-height": `${toastState.heights[0]?.height}px`,
          "--width": `${TOAST_WIDTH}px`,
          "--gap": `${gap}px`,
          "--offset-top": offsetObject["--offset-top"],
          "--offset-right": offsetObject["--offset-right"],
          "--offset-bottom": offsetObject["--offset-bottom"],
          "--offset-left": offsetObject["--offset-left"],
          "--mobile-offset-top": offsetObject["--mobile-offset-top"],
          "--mobile-offset-right": offsetObject["--mobile-offset-right"],
          "--mobile-offset-bottom": offsetObject["--mobile-offset-bottom"],
          "--mobile-offset-left": offsetObject["--mobile-offset-left"]
        }
      )}><!--[-->`;
      for (let index2 = 0, $$length2 = each_array_1.length; index2 < $$length2; index2++) {
        let toast2 = each_array_1[index2];
        {
          let successIcon = function($$payload2) {
            if (successIconProp) {
              $$payload2.out += "<!--[-->";
              successIconProp?.($$payload2);
              $$payload2.out += `<!---->`;
            } else {
              $$payload2.out += "<!--[!-->";
              if (successIconProp !== null) {
                $$payload2.out += "<!--[-->";
                SuccessIcon($$payload2);
              } else {
                $$payload2.out += "<!--[!-->";
              }
              $$payload2.out += `<!--]-->`;
            }
            $$payload2.out += `<!--]-->`;
          }, errorIcon = function($$payload2) {
            if (errorIconProp) {
              $$payload2.out += "<!--[-->";
              errorIconProp?.($$payload2);
              $$payload2.out += `<!---->`;
            } else {
              $$payload2.out += "<!--[!-->";
              if (errorIconProp !== null) {
                $$payload2.out += "<!--[-->";
                ErrorIcon($$payload2);
              } else {
                $$payload2.out += "<!--[!-->";
              }
              $$payload2.out += `<!--]-->`;
            }
            $$payload2.out += `<!--]-->`;
          }, warningIcon = function($$payload2) {
            if (warningIconProp) {
              $$payload2.out += "<!--[-->";
              warningIconProp?.($$payload2);
              $$payload2.out += `<!---->`;
            } else {
              $$payload2.out += "<!--[!-->";
              if (warningIconProp !== null) {
                $$payload2.out += "<!--[-->";
                WarningIcon($$payload2);
              } else {
                $$payload2.out += "<!--[!-->";
              }
              $$payload2.out += `<!--]-->`;
            }
            $$payload2.out += `<!--]-->`;
          }, infoIcon = function($$payload2) {
            if (infoIconProp) {
              $$payload2.out += "<!--[-->";
              infoIconProp?.($$payload2);
              $$payload2.out += `<!---->`;
            } else {
              $$payload2.out += "<!--[!-->";
              if (infoIconProp !== null) {
                $$payload2.out += "<!--[-->";
                InfoIcon($$payload2);
              } else {
                $$payload2.out += "<!--[!-->";
              }
              $$payload2.out += `<!--]-->`;
            }
            $$payload2.out += `<!--]-->`;
          }, closeIcon = function($$payload2) {
            if (closeIconProp) {
              $$payload2.out += "<!--[-->";
              closeIconProp?.($$payload2);
              $$payload2.out += `<!---->`;
            } else {
              $$payload2.out += "<!--[!-->";
              if (closeIconProp !== null) {
                $$payload2.out += "<!--[-->";
                CloseIcon($$payload2);
              } else {
                $$payload2.out += "<!--[!-->";
              }
              $$payload2.out += `<!--]-->`;
            }
            $$payload2.out += `<!--]-->`;
          };
          Toast($$payload, {
            index: index2,
            toast: toast2,
            defaultRichColors: richColors,
            duration: toastOptions?.duration ?? duration,
            class: toastOptions?.class ?? "",
            descriptionClass: toastOptions?.descriptionClass || "",
            invert,
            visibleToasts,
            closeButton,
            interacting,
            position: position2,
            style: toastOptions?.style ?? "",
            classes: toastOptions.classes || {},
            unstyled: toastOptions.unstyled ?? false,
            cancelButtonStyle: toastOptions?.cancelButtonStyle ?? "",
            actionButtonStyle: toastOptions?.actionButtonStyle ?? "",
            closeButtonAriaLabel: toastOptions?.closeButtonAriaLabel ?? closeButtonAriaLabel,
            expandByDefault: expand,
            expanded,
            loadingIcon: loadingIconProp,
            successIcon,
            errorIcon,
            warningIcon,
            infoIcon,
            closeIcon,
            $$slots: {
              successIcon: true,
              errorIcon: true,
              warningIcon: true,
              infoIcon: true,
              closeIcon: true
            }
          });
        }
      }
      $$payload.out += `<!--]--></ol>`;
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></section>`;
  pop();
}
function PillBtn($$payload, $$props) {
  let { onclick, label, disabled } = $$props;
  $$payload.out += `<button${attr("disabled", disabled, true)}${attr("aria-label", label)} class="svelte-phzq5v">${escape_html(label)}</button>`;
}
function LinkBtn($$payload, $$props) {
  let { onclick, label } = $$props;
  $$payload.out += `<button${attr("aria-label", label)} class="svelte-18z3cvs">${escape_html(label)}</button>`;
}
function WinSection($$payload, $$props) {
  push();
  function shareResults() {
    const date = formatDate(gameData.puzzle.date);
    let resultText = "";
    if (gameData.puzzle.date == "Random") {
      resultText = "Check out Chromatic";
    } else {
      resultText = `Chromatic puzzle for ${date} in ${gameData.puzzle.moves} moves`;
      if (gameData.puzzle.hints) {
        resultText += ` using ${gameData.puzzle.hints} hints`;
      }
    }
    resultText += "!\n\nhttps://feyder.co/projects/chromatic";
    navigator.clipboard.writeText(resultText).then(
      () => {
        toast.success("Results copied to clipboard!");
      },
      () => {
        toast.error("Failed to copy results to clipboard.");
      }
    );
  }
  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(void 0, options);
  }
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
  $$payload.out += `<section class="column svelte-19jfaki"><div class="textColumn svelte-19jfaki"><h2 class="svelte-19jfaki">${escape_html(getRandomWinMessage())}</h2> <p class="formatPretty svelte-19jfaki">You completed today's puzzle in ${escape_html(gameData.puzzle.moves)} moves `;
  if (gameData.puzzle.hints) {
    $$payload.out += "<!--[-->";
    $$payload.out += `and using ${escape_html(gameData.puzzle.hints)} hints`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></p></div> <div class="hideMobile extraSidePadding svelte-19jfaki">`;
  WeekStreak($$payload);
  $$payload.out += `<!----></div> `;
  PillBtn($$payload, {
    label: "play Random Level",
    onclick: randomPlayLevel
  });
  $$payload.out += `<!----> <div class="row svelte-19jfaki"><div class="hideWideScreen svelte-19jfaki">`;
  LinkBtn($$payload, {
    label: "See Weekly Streak",
    onclick: () => openMenu()
  });
  $$payload.out += `<!----></div> `;
  LinkBtn($$payload, { label: "Share Game", onclick: shareResults });
  $$payload.out += `<!----></div> `;
  Toaster($$payload, {
    theme: "dark",
    position: "top-center",
    toastOptions: {
      style: " border-radius: var(--rad-md);",
      duration: 750,
      class: "my-toast",
      descriptionClass: "my-toast-description"
    }
  });
  $$payload.out += `<!----></section>`;
  pop();
}
function BoardControls($$payload, $$props) {
  push();
  let { getHint, shiftColors } = $$props;
  $$payload.out += `<section class="controlContainer svelte-dzrrhy"><div class="wideScreen svelte-dzrrhy">`;
  {
    let icon = function($$payload2) {
      $$payload2.out += `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5L20 5" stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 12L20 12" stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 19L20 19" stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
    };
    RoundBtn($$payload, {
      label: "Menu",
      type: "secondary",
      onclick: () => openMenu(),
      icon
    });
  }
  $$payload.out += `<!----> `;
  {
    let icon = function($$payload2) {
      $$payload2.out += `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="var(--icon-color)" stroke-width="1.5"></circle><path d="M10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9C14 9.39815 13.8837 9.76913 13.6831 10.0808C13.0854 11.0097 12 11.8954 12 13V13.5" stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round"></path><path d="M11.992 17H12.001" stroke="var(--icon-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
    };
    RoundBtn($$payload, {
      label: "Rules",
      type: "secondary",
      onclick: () => openMenu(),
      icon
    });
  }
  $$payload.out += `<!----></div> `;
  {
    let icon = function($$payload2) {
      $$payload2.out += `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.97 16.9699C17.2629 16.6771 17.7377 16.6771 18.0306 16.9699L22.0306 20.9699C22.3232 21.2629 22.3234 21.7377 22.0306 22.0305C21.7378 22.3233 21.263 22.3231 20.97 22.0305L16.97 18.0305C16.6771 17.7376 16.6771 17.2628 16.97 16.9699Z" fill="var(--icon-color)"></path><path d="M12.7923 2.40842C13.6522 1.79586 14.6509 1.52496 15.5071 1.96702C16.362 2.40888 16.7226 3.37947 16.7239 4.4387L16.7366 7.57834C16.7372 7.68553 16.7803 7.85915 16.8851 8.04709C16.9881 8.23169 17.1126 8.3623 17.2073 8.42405L19.6058 9.92795C20.6075 10.5572 21.3899 11.449 21.2308 12.4924C21.0808 13.4743 20.1777 14.0723 19.1234 14.3821L18.9105 14.4406L15.9007 15.2004C15.792 15.2278 15.6304 15.3164 15.4739 15.4729C15.318 15.6289 15.2259 15.794 15.1956 15.9104L15.1946 15.9094L14.4368 18.9143C14.1492 20.0584 13.5368 21.0709 12.4896 21.2307C11.4465 21.3896 10.5532 20.6119 9.92512 19.6096L8.42414 17.2151C8.36345 17.1198 8.23147 16.9934 8.04426 16.8889C7.85665 16.7842 7.68359 16.7411 7.57649 16.7405L4.43684 16.7278C3.38058 16.7233 2.41164 16.3626 1.96906 15.51C1.52522 14.6545 1.79365 13.6569 2.40656 12.7961L4.08039 10.4475C4.13169 10.3737 4.19523 10.2233 4.22395 10.0246C4.25283 9.8245 4.23462 9.66027 4.20442 9.57248L4.20246 9.56663L3.07453 6.21995L3.07356 6.21799C2.73191 5.19662 2.7481 4.13635 3.44074 3.44358C4.1339 2.75054 5.1922 2.73742 6.21028 3.08225L9.55793 4.21018L9.56379 4.21213C9.65127 4.24223 9.81513 4.26003 10.015 4.23069C10.2144 4.20132 10.3676 4.13699 10.4446 4.08225L12.7923 2.40842Z" fill="var(--icon-color)"></path></svg>`;
    };
    RoundBtn($$payload, {
      label: "Hint",
      type: "secondary",
      disabled: gameData.puzzle.isAnimating,
      onclick: getHint,
      icon
    });
  }
  $$payload.out += `<!----> `;
  {
    let icon = function($$payload2) {
      $$payload2.out += `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 12.9999C8.98528 12.9999 11 15.0146 11 17.4999C11 19.9852 8.98528 21.9999 6.5 21.9999C4.01472 21.9999 2 19.9852 2 17.4999C2 15.0146 4.01472 12.9999 6.5 12.9999Z" fill="var(--icon-color)"></path><path d="M17.5 1.99988C19.9852 1.99988 22 4.0146 22 6.49988C22 8.98516 19.9852 10.9999 17.5 10.9999C15.0147 10.9999 13 8.98516 13 6.49988C13 4.0146 15.0147 1.99988 17.5 1.99988Z" fill="var(--icon-color)"></path><g opacity="0.5"><path d="M17.4999 12.9999C19.9851 12.9999 21.9999 15.0146 21.9999 17.4999C21.9999 19.9852 19.9851 21.9999 17.4999 21.9999C15.0146 21.9999 12.9999 19.9852 12.9999 17.4999C12.9999 15.0146 15.0146 12.9999 17.4999 12.9999Z" fill="var(--icon-color)"></path><path d="M6.49988 1.99988C8.98516 1.99988 10.9999 4.0146 10.9999 6.49988C10.9999 8.98516 8.98516 10.9999 6.49988 10.9999C4.0146 10.9999 1.99988 8.98516 1.99988 6.49988C1.99988 4.0146 4.0146 1.99988 6.49988 1.99988Z" fill="var(--icon-color)"></path></g></svg>`;
    };
    RoundBtn($$payload, {
      label: "Rotate Hues",
      type: "secondary",
      onclick: shiftColors,
      icon
    });
  }
  $$payload.out += `<!----></section>`;
  pop();
}
function Board($$payload, $$props) {
  push();
  let itemElements = [];
  let boardElement;
  let selectedElements = [];
  let hueRotate = 0;
  function swapPositions(index1, index2) {
    const element1 = itemElements[index1];
    const element2 = itemElements[index2];
    if (!element1 || !element2) return;
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    boardElement.getBoundingClientRect();
    const deltaX1 = rect2.left - rect1.left;
    const deltaY1 = rect2.top - rect1.top;
    const deltaX2 = rect1.left - rect2.left;
    const deltaY2 = rect1.top - rect2.top;
    const color1 = gameData.puzzle.history[index1];
    const color2 = gameData.puzzle.history[index2];
    const newHistory = [...gameData.puzzle.history];
    [newHistory[index1], newHistory[index2]] = [newHistory[index2], newHistory[index1]];
    playFeedback("cellMove");
    try {
      element1.classList && element1.classList.add("swapping");
    } catch (e) {
    }
    try {
      element2.classList && element2.classList.add("swapping");
    } catch (e) {
    }
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set([element1, element2], {
          x: 0,
          y: 0,
          scale: 0,
          borderRadius: "0px",
          clearProps: "transform,scale,zIndex, borderRadius"
          // Clear all transform properties
        });
        try {
          element1.classList && element1.classList.remove("dragover");
        } catch (e) {
        }
        try {
          element2.classList && element2.classList.remove("dragover");
        } catch (e) {
        }
        try {
          element1.classList && element1.classList.remove("swapping");
        } catch (e) {
        }
        try {
          element2.classList && element2.classList.remove("swapping");
        } catch (e) {
        }
        gameData.puzzle.history = newHistory;
        if (gameData.settings.relaxedMode === true) {
          [index1, index2].forEach((idx) => {
            isCorrectPosition(idx, gameData.puzzle.history);
          });
          gameData.puzzle.locks = [...gameData.puzzle.locks];
        }
        increaseMove(1);
        didWin(gameData.puzzle.palette, newHistory, gameData.puzzle.hues, gameData.puzzle.rows, gameData.puzzle.columns);
      }
    });
    tl.to([element1, element2], {
      scale: 0.7,
      borderRadius: "24px",
      duration: 0.2,
      ease: "power2.in"
    }).to(
      element1,
      {
        x: deltaX1,
        y: deltaY1,
        backgroundColor: color2,
        duration: 0.3,
        ease: "power2.inOut"
      },
      "<"
    ).to(
      element2,
      {
        x: deltaX2,
        y: deltaY2,
        backgroundColor: color1,
        duration: 0.3,
        ease: "power2.inOut"
      },
      "<"
    ).to([element1, element2], { scale: 1, duration: 0.2, ease: "power2.out" });
  }
  function didWin(correctColors, currentColors, keyColors, row, column) {
    let correct = false;
    let positionPalettes = [correctColors, correctColors.toReversed()];
    if (row === column) {
      let rotatePalette = [
        keyColors[2],
        keyColors[0],
        keyColors[3],
        keyColors[1]
      ];
      rotatePalette = getColors(rotatePalette, column, row);
      positionPalettes.push(rotatePalette, rotatePalette.toReversed());
    }
    for (let index = 0; index < positionPalettes.length; index++) {
      if (JSON.stringify(positionPalettes[index]) === JSON.stringify(currentColors)) {
        correct = true;
        playFeedback("win");
        completePuzzle();
        break;
      }
    }
    return correct;
  }
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
  async function getHint() {
    if (gameData.puzzle.isAnimating) return;
    const nonInteractive = [...gameData.puzzle.locks];
    const indexOrder = [
      ...Array(gameData.puzzle.col * gameData.puzzle.row).keys()
    ];
    let hintCells = nonInteractive.reduce(
      (b, a) => (b.includes(a) && b.splice(b.indexOf(a), 1), b),
      [...indexOrder]
    );
    if (hintCells.length === 0) return;
    gameData.puzzle.isAnimating = true;
    try {
      const hintIndex = hintCells[Math.floor(Math.random() * hintCells.length)];
      const randomColor = gameData.puzzle.palette[hintIndex];
      gameData.puzzle.locks = [...gameData.puzzle.locks, hintIndex];
      const oldIndex = gameData.puzzle.history.indexOf(randomColor);
      increaseHints(1);
      await new Promise((resolve) => {
        swapPositions(oldIndex, hintIndex);
        setTimeout(resolve, 700);
      });
    } finally {
      gameData.puzzle.isAnimating = false;
    }
  }
  function shiftColors() {
    hueRotate += 40;
    if (hueRotate > 360) {
      hueRotate = 0;
    }
  }
  function isCorrectPosition(index, history) {
    if (history[index] === gameData.puzzle.palette[index]) {
      if (!gameData.puzzle.locks.includes(index)) {
        gameData.puzzle.locks = [...gameData.puzzle.locks, parseInt(index)];
      }
      try {
        if (itemElements[index]) {
          itemElements[index].classList.remove("dragover");
        }
      } catch (e) {
      }
      playFeedback("correctSpot");
      return true;
    } else {
      return false;
    }
  }
  const each_array = ensure_array_like(gameData.puzzle.history);
  $$payload.out += `<section${attr("class", `boardContainer svelte-10ys0g6 ${stringify([
    gameData.puzzle.completed === true ? "complete" : ""
  ].filter(Boolean).join(" "))}`)}${attr("style", `--hueRotate: ${stringify(hueRotate)}deg;`)}><section class="board svelte-10ys0g6"${attr("style", `--colSize: ${stringify(gameData.puzzle.col)}; --rowSize: ${stringify(gameData.puzzle.row)};`)}><!--[-->`;
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let color = each_array[i];
    $$payload.out += `<div${attr("class", `swatch ${stringify(isCorner(i))} svelte-10ys0g6 ${stringify([
      selectedElements.includes(itemElements[i]) ? "selected" : "",
      gameData.puzzle.locks.includes(i) ? "locked" : ""
    ].filter(Boolean).join(" "))}`)}${attr("style", `--background: ${stringify(color)}; --color: ${stringify(setContrast(color))};`)}${attr("data-index", i)}${attr("data-color", color)}>`;
    if (gameData.puzzle.locks.includes(i)) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-10ys0g6"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.9995 4.20264C13.1659 4.20264 14.285 4.666 15.1099 5.49072C15.9347 6.31557 16.3989 7.43454 16.3989 8.60107V10.3208H16.7583C18.0614 10.3209 19.1176 11.3772 19.1177 12.6802V17.438C19.1174 18.7407 18.0613 19.7982 16.7583 19.7983H7.2417C5.93878 19.7983 4.88259 18.7408 4.88232 17.438V12.6802C4.88238 11.3772 5.93868 10.3209 7.2417 10.3208H7.60107V8.60107C7.60114 7.43461 8.06439 6.31556 8.88916 5.49072C9.71396 4.66592 10.8331 4.20277 11.9995 4.20264ZM11.9995 6.20264C11.3635 6.20277 10.7529 6.45506 10.3032 6.90479C9.85352 7.35456 9.60114 7.96506 9.60107 8.60107V10.3208H14.3989V8.60107C14.3989 7.96501 14.1456 7.35458 13.6958 6.90479C13.2461 6.4552 12.6356 6.20264 11.9995 6.20264Z" fill="var(--color)"></path></svg>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]--></section></section> `;
  if (gameData.state === "start" || gameData.puzzle.completed === false) {
    $$payload.out += "<!--[-->";
    BoardControls($$payload, { getHint, shiftColors });
  } else {
    $$payload.out += "<!--[!-->";
    WinSection($$payload);
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function HelpContent($$payload) {
  $$payload.out += `<section class="svelte-1lsba4g"><h2 class="svelte-1lsba4g">How to play</h2> <p class="svelte-1lsba4g">The board is a scrambled gradient. Move the tiles into their rightful place in the grid. Until the gradient is seamless and all the colors flow perfectly into one another.</p> <br> <p class="svelte-1lsba4g"><strong class="svelte-1lsba4g">Locked tiles</strong> are already in their correct positions. Use them to figure out the surrounding colors.</p> <p class="svelte-1lsba4g"><strong class="svelte-1lsba4g">Swap tiles</strong> by tapping or dragging any unlocked tile to another</p> <p class="svelte-1lsba4g"><strong class="svelte-1lsba4g">Watch the gradient</strong> flow horizontally and vertically through hue, saturation, and brightness</p> <h3 class="svelte-1lsba4g">Tips</h3> <p class="svelte-1lsba4g"><strong class="svelte-1lsba4g">Start with the locked tiles.</strong> Try to find tiles that are just a shade lighter or darker than the locked ones and place them adjacent.</p> <p class="svelte-1lsba4g"><strong class="svelte-1lsba4g">Check the Edges.</strong> It is often easiest to solve the outer edges of the grid first to establish the "frame" of the gradient.</p> <p class="svelte-1lsba4g"><strong class="svelte-1lsba4g">Squint Your Eyes.</strong> If you’re stuck, try squinting at the screen. This helps your brain ignore the grid lines and see the overall flow of color more clearly.</p></section>`;
}
function HelpModal($$payload, $$props) {
  push();
  $$payload.out += `<dialog class="modal svelte-y5ywl2"><div class="dialog_container main-dialog svelte-y5ywl2" role="dialog" aria-labelledby="dialog-title">`;
  HelpContent($$payload);
  $$payload.out += `<!----></div></dialog>`;
  pop();
}
function SettingsContainer($$payload, $$props) {
  push();
  $$payload.out += `<div class="container svelte-wrfyln"><section class="svelte-wrfyln"><p class="subHeader svelte-wrfyln">Game Play</p> <div class="list_item_grid svelte-wrfyln"><div class="icon svelte-wrfyln"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-wrfyln"><path d="M1.66669 8.33508C1.69081 5.49006 1.84876 3.92167 2.88305 2.88738C4.10375 1.66667 6.06845 1.66667 9.99785 1.66667C13.9272 1.66667 15.8919 1.66667 17.1126 2.88738C18.3334 4.10809 18.3334 6.07278 18.3334 10.0022C18.3334 13.9316 18.3334 15.8963 17.1126 17.117C16.0784 18.1513 14.51 18.3092 11.6649 18.3333" stroke="var(--copy-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.16561 10.8333C3.1904 10.8626 2.60897 10.971 2.20666 11.3733C1.80434 11.7756 1.69591 12.3571 1.66669 13.3323M6.66776 10.8333C7.64298 10.8626 8.2244 10.971 8.62672 11.3733C9.02903 11.7756 9.13746 12.3571 9.16669 13.3323M9.16669 15.8344C9.13746 16.8096 9.02903 17.3911 8.62672 17.7934C8.2244 18.1957 7.64298 18.3041 6.66776 18.3333M4.16562 18.3333C3.1904 18.3041 2.60897 18.1957 2.20666 17.7934C1.80434 17.3911 1.69591 16.8096 1.66669 15.8344" stroke="var(--copy-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></div> <div class="copy svelte-wrfyln"><p class="label svelte-wrfyln">Puzzle Size</p></div> <div class="selectContainer svelte-wrfyln"><select name="size" id="puzzleSize" class="dropDown svelte-wrfyln"><option value="easy">Small 4×5</option><option value="normal">Normal 5×6</option><option value="medium">Medium 6×6</option><option value="hard">Hard 7×7</option></select> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-wrfyln"><path d="M6 9.00049L11.2929 14.2934C11.6262 14.6267 11.7929 14.7934 12 14.7934C12.2071 14.7934 12.3738 14.6267 12.7071 14.2934L18 9.00049" stroke="var(--copy-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></div></div> <div class="list_item_grid svelte-wrfyln"><div class="icon svelte-wrfyln"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-wrfyln"><path d="M11.7595 5.50128C11.861 5.21432 11.9163 4.90548 11.9163 4.58374C11.9163 3.06496 10.685 1.83374 9.16626 1.83374C7.64747 1.83374 6.41626 3.06496 6.41626 4.58374C6.41626 4.90548 6.47151 5.21432 6.57305 5.50128C4.47867 5.50893 3.36098 5.58327 2.63838 6.30586C1.91585 7.02839 1.84146 8.14594 1.8338 10.2399C2.12027 10.1388 2.4285 10.0837 2.74959 10.0837C4.26837 10.0837 5.49959 11.315 5.49959 12.8337C5.49959 14.3525 4.26837 15.5837 2.74959 15.5837C2.4285 15.5837 2.12027 15.5287 1.8338 15.4276C1.84146 17.5215 1.91585 18.6391 2.63838 19.3616C3.3609 20.0841 4.47845 20.1585 6.57243 20.1662C6.47129 19.8797 6.41626 19.5715 6.41626 19.2504C6.41626 17.7316 7.64747 16.5004 9.16626 16.5004C10.685 16.5004 11.9163 17.7316 11.9163 19.2504C11.9163 19.5715 11.8612 19.8797 11.7601 20.1662C13.8541 20.1585 14.9716 20.0841 15.6941 19.3616C16.4167 18.639 16.4911 17.5213 16.4987 15.4269C16.7857 15.5285 17.0945 15.5837 17.4163 15.5837C18.935 15.5837 20.1663 14.3525 20.1663 12.8337C20.1663 11.315 18.935 10.0837 17.4163 10.0837C17.0945 10.0837 16.7857 10.139 16.4987 10.2405C16.4911 8.14616 16.4167 7.02846 15.6941 6.30586C14.9715 5.58327 13.8538 5.50893 11.7595 5.50128Z" stroke="var(--copy-color)" stroke-width="1.5" stroke-linejoin="round"></path></svg></div> <div class="copy svelte-wrfyln"><p class="label svelte-wrfyln">Relaxed Mode</p></div> <div class="control svelte-wrfyln"><label class="material-toggle-switch svelte-wrfyln" for="relaxedMode"><input id="relaxedMode" type="checkbox" class="material-toggle-input svelte-wrfyln"${attr("checked", gameData.settings.relaxedMode, true)}> <span class="material-toggle-slider svelte-wrfyln"></span></label></div> <p class="description svelte-wrfyln">Lock tiles when moved into correct spot.</p></div></section> <section class="svelte-wrfyln"><p class="subHeader svelte-wrfyln">Effects</p> <div class="list_item svelte-wrfyln"><div class="icon svelte-wrfyln"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-wrfyln"><path d="M2.29169 11C2.29169 6.89481 2.29169 4.84224 3.56699 3.56693C4.8423 2.29163 6.89487 2.29163 11 2.29163C15.1052 2.29163 17.1577 2.29163 18.433 3.56693C19.7084 4.84224 19.7084 6.89481 19.7084 11C19.7084 15.1051 19.7084 17.1577 18.433 18.433C17.1577 19.7083 15.1052 19.7083 11 19.7083C6.89487 19.7083 4.8423 19.7083 3.56699 18.433C2.29169 17.1577 2.29169 15.1051 2.29169 11Z" stroke="var(--copy-color)" stroke-width="1.5"></path><path d="M11.9166 13.2916C11.9166 14.5573 10.8906 15.5833 9.62498 15.5833C8.35933 15.5833 7.33331 14.5573 7.33331 13.2916C7.33331 12.026 8.35933 11 9.62498 11C10.8906 11 11.9166 12.026 11.9166 13.2916ZM11.9166 13.2916V6.41663C12.2222 6.87496 12.4666 8.79996 14.6666 9.16663" stroke="var(--copy-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></div> <div class="copy svelte-wrfyln"><p class="label svelte-wrfyln">Sounds Effect</p></div> <div class="control svelte-wrfyln"><label class="material-toggle-switch svelte-wrfyln" for="soundEnabled"><input id="soundEnabled" type="checkbox" class="material-toggle-input svelte-wrfyln"${attr("checked", gameData.settings.soundEnabled, true)}> <span class="material-toggle-slider svelte-wrfyln"></span></label></div></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></section></div>`;
  pop();
}
function AboutContainer($$payload, $$props) {
  push();
  function playRandomLevel() {
    randomPlayLevel();
  }
  $$payload.out += `<section class="svelte-1913heo"><img class="icon svelte-1913heo" src="./favicon.png" alt=""> <div class="aboutText svelte-1913heo"><h2 class="svelte-1913heo">Chromatic</h2> <p class="svelte-1913heo">A casual relaxing puzzle game. Where you sort color and create gradients.</p></div> `;
  WeekStreak($$payload);
  $$payload.out += `<!----> `;
  PillBtn($$payload, {
    onclick: playRandomLevel,
    label: "Play Random Level"
  });
  $$payload.out += `<!----> <div class="footer svelte-1913heo"><p class="svelte-1913heo">version ${escape_html(version)}</p> <p class="svelte-1913heo"><span>Game by</span> <a href="https://feyder.co" class="svelte-1913heo">Feyder.co</a></p></div></section>`;
  pop();
}
function MegaMenu($$payload, $$props) {
  push();
  let activeTab = "game";
  $$payload.out += `<dialog class="modal svelte-70ab56"><div class="dialog_container main-dialog fixedWidth svelte-70ab56" role="dialog" aria-labelledby="dialog-title"><div${attr("class", `tabContent ${stringify(activeTab)} svelte-70ab56`)}><div class="game svelte-70ab56">`;
  AboutContainer($$payload);
  $$payload.out += `<!----></div> <div class="settings svelte-70ab56">`;
  SettingsContainer($$payload);
  $$payload.out += `<!----></div></div> <div class="tabBar svelte-70ab56"><button class="tab svelte-70ab56">Game</button> <button class="tab svelte-70ab56">Settings</button> <div${attr("class", `highlight svelte-70ab56 ${stringify([
    "game",
    ""
  ].filter(Boolean).join(" "))}`)}></div></div></div></dialog>`;
  pop();
}
function _page($$payload, $$props) {
  push();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<main${attr("class", `svelte-1la3h4p ${stringify([gameData.state === "paused" ? "paused" : ""].filter(Boolean).join(" "))}`)}>`;
    Header($$payload2, { toggleMenu: openMenu });
    $$payload2.out += `<!----> `;
    Board($$payload2);
    $$payload2.out += `<!----></main> `;
    HelpModal($$payload2);
    $$payload2.out += `<!----> `;
    MegaMenu($$payload2);
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
