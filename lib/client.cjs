window.__ModuleLoader__.load({ id: "dsh-done-whale", factory: (require) => {
const module = { exports: {} }; const exports = module.exports;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.mjs
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);

// src/shared.mjs
var SETTINGS_NAMESPACE = "done-whale";
var DEFAULT_GREEN = "#22C55E";
var DEFAULT_AMBER = "#F59E0B";
var HEX = /^#[0-9a-fA-F]{6}$/;
function colorsOf(value = {}) {
  const color = (key, fallback) => HEX.test(value[key]) ? value[key] : fallback;
  return {
    green: color("green", DEFAULT_GREEN),
    amber: color("amber", DEFAULT_AMBER),
    black: color("black", void 0)
  };
}

// src/status.mjs
function createStatusTracker() {
  const running = /* @__PURE__ */ new Map();
  const hiddenDone = /* @__PURE__ */ new Set();
  return (state, pending, visible) => {
    let done = false;
    let waiting = false;
    const ids = /* @__PURE__ */ new Set();
    for (const row of Object.values(state.byId)) {
      if (row.origin === "subagent") continue;
      ids.add(row.id);
      if (running.get(row.id) && !row.running && row.id === state.current && !visible) {
        hiddenDone.add(row.id);
      }
      if (row.running || visible && row.id === state.current) hiddenDone.delete(row.id);
      running.set(row.id, row.running);
      done ||= row.completed === true || hiddenDone.has(row.id);
      waiting ||= pending.has(row.id);
    }
    for (const id of running.keys()) {
      if (!ids.has(id)) {
        running.delete(id);
        hiddenDone.delete(id);
      }
    }
    return done ? "green" : waiting ? "amber" : "black";
  };
}

// src/favicon.mjs
function whaleSvg(color) {
  if (!HEX.test(color)) throw new TypeError("Invalid whale color");
  return '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none"><path d="M48.8354 10.0479C48.3232 9.79199 48.1025 10.2798 47.8032 10.5278C47.7007 10.6079 47.6143 10.7119 47.5273 10.8076C46.7793 11.624 45.9048 12.1597 44.7622 12.0957C43.0923 12 41.666 12.5356 40.4058 13.8398C40.1377 12.2319 39.2476 11.272 37.8926 10.6558C37.1836 10.3359 36.4668 10.0156 35.9702 9.31982C35.6235 8.82373 35.5293 8.27197 35.356 7.72754C35.2456 7.3999 35.1353 7.06396 34.7651 7.00781C34.3633 6.94385 34.2056 7.2876 34.0479 7.57568C33.418 8.75195 33.1733 10.0479 33.1973 11.3599C33.2524 14.312 34.4736 16.6641 36.8999 18.3359C37.1758 18.5278 37.2466 18.7197 37.1597 19C36.9946 19.5757 36.7974 20.1357 36.624 20.7119C36.5137 21.0801 36.3486 21.1597 35.9624 21C34.6309 20.4321 33.481 19.5918 32.4644 18.5757C30.7393 16.8721 29.1792 14.9917 27.2334 13.52C26.7764 13.1758 26.3193 12.856 25.8467 12.5518C23.8618 10.584 26.1069 8.96777 26.627 8.77588C27.1704 8.57568 26.8159 7.8877 25.0591 7.896C23.3022 7.90381 21.6953 8.50391 19.647 9.30371C19.3477 9.42383 19.0322 9.51172 18.7095 9.58398C16.8501 9.22363 14.9199 9.14355 12.9033 9.37598C9.10596 9.80762 6.07275 11.6396 3.84326 14.7681C1.16455 18.5278 0.53418 22.7998 1.30664 27.2559C2.11768 31.9521 4.46582 35.8398 8.07373 38.8799C11.8159 42.0322 16.1255 43.5762 21.041 43.2803C24.0269 43.104 27.3516 42.6963 31.1016 39.4561C32.0469 39.936 33.0396 40.1279 34.686 40.272C35.9546 40.3921 37.1758 40.208 38.1211 40.0078C39.6021 39.688 39.4995 38.2881 38.9639 38.0322C34.623 35.9678 35.5762 36.8081 34.71 36.1279C36.9155 33.4639 40.2402 30.6958 41.54 21.728C41.6426 21.0161 41.5557 20.5679 41.54 19.9917C41.5322 19.6396 41.6108 19.5039 42.0049 19.4639C43.0923 19.3359 44.1479 19.0317 45.1167 18.4878C47.9292 16.9199 49.064 14.3438 49.3315 11.2559C49.3711 10.7837 49.3237 10.2959 48.8354 10.0479ZM24.3262 37.8398C20.1196 34.4639 18.0791 33.3521 17.2358 33.3999C16.4482 33.4482 16.5898 34.3682 16.7632 34.9678C16.9443 35.5601 17.1812 35.9683 17.5117 36.4878C17.7402 36.832 17.8979 37.3442 17.2832 37.728C15.9282 38.584 13.5728 37.4399 13.4624 37.3838C10.7207 35.7358 8.42822 33.5601 6.81348 30.584C5.25342 27.7197 4.34766 24.6479 4.19775 21.3677C4.1582 20.5757 4.38672 20.2959 5.15869 20.1519C6.17529 19.96 7.22314 19.9199 8.23926 20.0718C12.5327 20.7119 16.1885 22.6719 19.2529 25.7759C21.002 27.5439 22.3252 29.6558 23.6885 31.7202C25.1377 33.9121 26.6978 36 28.6831 37.7119C29.3843 38.312 29.9434 38.7681 30.479 39.104C28.8643 39.2881 26.1699 39.3281 24.3262 37.8398ZM26.3433 24.6001C26.3433 24.248 26.6191 23.9678 26.9658 23.9678C27.0444 23.9678 27.1152 23.9839 27.1782 24.0078C27.2651 24.04 27.3438 24.0879 27.4067 24.1602C27.5171 24.272 27.5801 24.4321 27.5801 24.6001C27.5801 24.9521 27.3042 25.2319 26.9575 25.2319C26.6108 25.2319 26.3433 24.9521 26.3433 24.6001ZM32.6064 27.8799C32.2046 28.0479 31.8027 28.1919 31.4165 28.208C30.8179 28.2397 30.1641 27.9922 29.8096 27.688C29.2583 27.2158 28.8643 26.9521 28.6987 26.1279C28.6279 25.7759 28.6675 25.2319 28.7305 24.9199C28.8721 24.248 28.7144 23.8159 28.2495 23.4238C27.8716 23.104 27.3911 23.0161 26.8633 23.0161C26.666 23.0161 26.4849 22.9277 26.3511 22.856C26.1304 22.7441 25.9492 22.4639 26.1226 22.1201C26.1777 22.0078 26.4458 21.7358 26.5088 21.688C27.2256 21.272 28.0527 21.4077 28.8169 21.7197C29.5259 22.0161 30.0615 22.5601 30.834 23.3281C31.6216 24.2559 31.7632 24.5117 32.2124 25.208C32.5669 25.752 32.8901 26.312 33.1104 26.9521C33.2446 27.3521 33.0713 27.6802 32.6064 27.8799Z" fill="' + color + '" fill-opacity="1" fill-rule="nonzero"/></svg>';
}
function iconUri(color) {
  return "data:image/svg+xml," + encodeURIComponent(whaleSvg(color));
}

// src/settings.mjs
var import_react = require("react");
var messages = {
  zh: {
    nav: "\u9CB8\u9C7C\u72B6\u6001\u706F",
    green: "\u5B8C\u6210\u8272",
    amber: "\u5F85\u5904\u7406\u8272",
    black: "\u9ED8\u8BA4\u8272",
    hint: "\u4E0D\u8BBE\u7F6E\u65F6\u4F7F\u7528\u5B98\u65B9\u56FE\u6807",
    reset: "\u6062\u590D\u9ED8\u8BA4",
    invalid: "\u989C\u8272\u683C\u5F0F\u5E94\u4E3A #RRGGBB",
    failed: "\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5"
  },
  en: {
    nav: "Whale status",
    green: "Done color",
    amber: "Pending color",
    black: "Default color",
    hint: "Uses the official icon when unset",
    reset: "Reset",
    invalid: "Color must be #RRGGBB",
    failed: "Could not save; please retry"
  }
};
var fieldStyle = {
  font: "inherit",
  padding: "6px 10px",
  borderRadius: 6,
  border: "1px solid var(--dsw-alias-border-l2)",
  background: "transparent",
  color: "var(--dsw-alias-label-primary)"
};
function ColorRow({ scope, t, name, value, writable, saving, setSaving }) {
  const [draft, setDraft] = (0, import_react.useState)(null);
  const [error, setError] = (0, import_react.useState)(null);
  const effective = colorsOf(value)[name] ?? "#000000";
  const text = draft ?? effective;
  const invalid = !HEX.test(text);
  const id = `${SETTINGS_NAMESPACE}-${name}`;
  async function save(reset = false, next = text) {
    if (!reset && !HEX.test(next)) return;
    setSaving(true);
    setError(null);
    try {
      if (reset) await scope.unset(name);
      else await scope.set(name, next);
      const accepted = scope.getSnapshot();
      if (reset ? Object.hasOwn(accepted.user ?? {}, name) : accepted.value?.[name] !== next) {
        throw new Error("Setting was not accepted");
      }
      setDraft(null);
    } catch {
      setError(t("failed"));
    } finally {
      setSaving(false);
    }
  }
  return (0, import_react.createElement)(
    "div",
    { style: { display: "grid", gap: 6 } },
    (0, import_react.createElement)("label", { htmlFor: id }, t(name)),
    (0, import_react.createElement)(
      "div",
      { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" } },
      (0, import_react.createElement)("input", {
        type: "color",
        "aria-label": t(name),
        value: invalid ? effective : text,
        disabled: saving || !writable,
        onChange: (e) => {
          setDraft(e.target.value);
          void save(false, e.target.value);
        },
        style: { ...fieldStyle, width: 40, height: 32, padding: 0 }
      }),
      (0, import_react.createElement)("input", {
        id,
        type: "text",
        value: text,
        spellCheck: false,
        disabled: saving || !writable,
        "aria-invalid": invalid || !!error,
        "aria-describedby": `${id}-hint`,
        onChange: (e) => {
          setDraft(e.target.value);
          setError(null);
        },
        onBlur: () => {
          if (draft !== null) void save();
        },
        onKeyDown: (e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        },
        style: { ...fieldStyle, width: "8em" }
      }),
      (0, import_react.createElement)("button", { type: "button", disabled: saving || !writable, onClick: () => void save(true), style: fieldStyle }, t("reset"))
    ),
    (0, import_react.createElement)(
      "small",
      { id: `${id}-hint`, role: invalid || error ? "alert" : void 0 },
      invalid ? t("invalid") : error ?? (name === "black" && !value.black ? t("hint") : "")
    )
  );
}
function WhaleSettingsSection({ scope, t }) {
  const [saving, setSaving] = (0, import_react.useState)(false);
  const { value = {}, writable = false } = (0, import_react.useSyncExternalStore)(
    (listener) => scope.subscribe(listener),
    () => scope.getSnapshot()
  );
  return (0, import_react.createElement)(
    "div",
    { style: { display: "grid", gap: 16, padding: "16px 0" } },
    ...["green", "amber", "black"].map((name) => (0, import_react.createElement)(ColorRow, { key: name, name, scope, t, value, writable, saving, setSaving }))
  );
}

// src/client.mjs
var inject = ["sessions", "uiSession", "slots", "locale", "settingsScope"];
function apply(ctx) {
  const scope = ctx.settingsScope.bind({ namespace: SETTINGS_NAMESPACE });
  const list = ctx.sessions.list;
  const pending = ctx.uiSession.pendingInteractions;
  const status = createStatusTracker();
  ctx.effect(() => {
    const existing = document.head.querySelector('link[rel~="icon"]');
    const link = existing ?? document.createElement("link");
    const original = link.getAttribute("href");
    const originalType = link.getAttribute("type");
    if (!existing) {
      link.rel = "icon";
      document.head.append(link);
    }
    let applied;
    const restore = () => {
      if (original === null) link.removeAttribute("href");
      else link.setAttribute("href", original);
      if (originalType === null) link.removeAttribute("type");
      else link.setAttribute("type", originalType);
    };
    const sync = () => {
      const key = status(list.getSnapshot(), pending.getSnapshot(), document.visibilityState === "visible");
      const color = colorsOf(scope.getSnapshot().value)[key];
      if (color === applied) return;
      if (color) {
        link.setAttribute("href", iconUri(color));
        link.setAttribute("type", "image/svg+xml");
      } else restore();
      applied = color;
    };
    const stops = [];
    const cleanup = () => {
      stops.forEach((stop) => stop());
      document.removeEventListener("visibilitychange", sync);
      if (existing) restore();
      else link.remove();
    };
    try {
      stops.push(list.subscribe(sync));
      stops.push(pending.subscribe(sync));
      stops.push(scope.subscribe(sync));
      document.addEventListener("visibilitychange", sync);
      sync();
    } catch (error) {
      cleanup();
      throw error;
    }
    return cleanup;
  });
  ctx.effect(() => ctx.locale.register(SETTINGS_NAMESPACE, messages));
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: SETTINGS_NAMESPACE,
    order: 100,
    label: () => ctx.locale.bind(SETTINGS_NAMESPACE)("nav"),
    locale: SETTINGS_NAMESPACE,
    inject: () => ({ scope })
  }, WhaleSettingsSection));
}
return module.exports;
} });
