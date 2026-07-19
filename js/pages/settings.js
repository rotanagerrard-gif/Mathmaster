/* ===================================================================
   MathMaster — settings.js
   Theme, sound, difficulty, motion, language, account, data export/reset
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});
  const { $, $$, el, escapeHtml, fmt } = MM;

  document.addEventListener("DOMContentLoaded", () => {
    const s = MM.store.settings;

    // theme chips
    function setThemeActive() {
      $$("[data-theme-set]").forEach((c) => {
        c.classList.toggle("active", c.dataset.themeSet === s.theme);
      });
    }
    setThemeActive();
    $$("[data-theme-set]").forEach((c) => {
      c.addEventListener("click", () => {
        const val = c.dataset.themeSet;
        MM.store.setSettings({ theme: val });
        MM.theme.set(val === "auto" ? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : val);
        setThemeActive();
        MM.toast(`Theme: ${val}`, "info", 1500);
      });
    });

    // sound
    const soundToggle = $("#soundToggle");
    soundToggle.checked = s.sound;
    soundToggle.addEventListener("change", () => {
      MM.sound.enable(soundToggle.checked);
      MM.toast(soundToggle.checked ? "Sound on" : "Sound off", "info", 1200);
    });

    // reduce motion
    const rm = $("#reduceMotion");
    rm.checked = s.reduceMotion;
    rm.addEventListener("change", () => {
      MM.store.setSettings({ reduceMotion: rm.checked });
      MM.toast(rm.checked ? "Motion reduced" : "Motion enabled", "info", 1200);
      setTimeout(() => location.reload(), 500);
    });

    // difficulty
    const diff = $("#diffSelect");
    diff.value = s.difficulty || "normal";
    diff.addEventListener("change", () => MM.store.setSettings({ difficulty: diff.value }));

    // language
    const lang = $("#langSelect");
    lang.value = s.language || "en";
    lang.addEventListener("change", () => {
      MM.store.setSettings({ language: lang.value });
      MM.toast("Language preference saved (demo)", "info", 1500);
    });

    // sfx preview
    $$("[data-sfx]").forEach((b) => {
      b.addEventListener("click", () => {
        // enable temporarily for preview
        const was = MM.store.settings.sound;
        MM.store.setSettings({ sound: true });
        MM.sound.play(b.dataset.sfx);
        setTimeout(() => MM.store.setSettings({ sound: was }), 400);
      });
    });

    // account info
    const acct = $("#accountInfo");
    const user = MM.auth.currentUser();
    if (user) {
      acct.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="avatar" style="width:48px;height:48px;">${escapeHtml((user.name || "U").slice(0,1).toUpperCase())}</div>
          <div>
            <strong>${escapeHtml(user.name)}</strong>
            <div class="text-sm text-muted">${escapeHtml(user.email)}</div>
            <span class="badge ${user.role === "admin" ? "badge-warning" : "badge-brand"}">${user.role}</span>
          </div>
        </div>`;
    } else {
      acct.innerHTML = `<p class="text-muted">Not signed in. <a href="login.html" style="color:var(--brand-1);">Sign in</a></p>`;
    }

    // export
    $("#exportBtn").addEventListener("click", () => {
      MM.downloadJSON(JSON.parse(MM.store.export()), "mathmaster-data.json");
      MM.toast("Data exported ✓", "success");
    });

    // reset
    $("#resetBtn").addEventListener("click", async () => {
      const ok = await MM.ui.confirm({
        title: "Reset all data?",
        message: "This permanently deletes your account, progress, XP, and achievements on this device. This cannot be undone.",
        confirmText: "Yes, reset everything",
      });
      if (ok) {
        MM.store.reset();
        MM.toast("All data reset.", "success");
        setTimeout(() => (location.href = "../index.html"), 1000);
      }
    });

    // logout
    $("#logoutBtn").addEventListener("click", async () => {
      if (!MM.auth.isLoggedIn()) return;
      const ok = await MM.ui.confirm({ title: "Sign out?", message: "You'll need to sign in again to access your progress.", confirmText: "Sign out", danger: true });
      if (ok) {
        MM.auth.logout();
        MM.toast("Signed out.", "info");
        setTimeout(() => (location.href = "../index.html"), 700);
      }
    });
  });
})();
