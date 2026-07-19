/* ===================================================================
   MathMaster — theme.js
   Dark/Light mode toggle, persistence, system preference
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});

  const root = document.documentElement;

  function getStored() {
    return MM.store.settings.theme;
  }
  function systemPref() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light" : "dark";
  }
  function apply(theme) {
    root.setAttribute("data-theme", theme);
    const meta = MM.$('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0b1020" : "#6366f1");
    document.dispatchEvent(new CustomEvent("mm:theme", { detail: { theme } }));
    updateToggles(theme);
  }
  function set(theme) {
    MM.store.setSettings({ theme });
    apply(theme);
  }
  function toggle() {
    const next = (root.getAttribute("data-theme") === "dark") ? "light" : "dark";
    set(next);
    return next;
  }

  function updateToggles(theme) {
    MM.$$("[data-theme-toggle]").forEach((btn) => {
      const icon = btn.querySelector("[data-theme-icon]");
      if (icon) icon.textContent = theme === "dark" ? "☀️" : "🌙";
      btn.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
    });
  }

  function init() {
    const stored = getStored();
    const theme = stored === "auto" || !stored ? systemPref() : stored;
    apply(theme);
    // wire toggles
    MM.$$("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const t = toggle();
        MM.toast(`Switched to ${t} mode`, "info", 1500);
      });
    });
    // react to OS changes if user hasn't explicitly chosen
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
        if (getStored() === "auto") apply(e.matches ? "light" : "dark");
      });
    }
  }

  MM.theme = { init, set, toggle, apply, get current() { return root.getAttribute("data-theme"); } };
})();
