/* ===================================================================
   MathMaster — app.js
   Bootstrap: load order, global init, shared behaviors, page router
   Include this on every page AFTER the module scripts.
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});

  // Detect current page name for active nav highlighting
  function pageName() {
    const path = location.pathname.split("/").pop() || "index.html";
    return path.replace(".html", "");
  }

  // Seed demo data on first run (so the site isn't empty)
  function seedDemo() {
    if (MM.store.users.length > 0) return;
    const demo = [
      { name: "Ada Lovelace", xp: 4820, streak: 21 },
      { name: "Carl Gauss", xp: 4310, streak: 18 },
      { name: "Emmy Noether", xp: 3990, streak: 14 },
      { name: "Ramanujan", xp: 3650, streak: 12 },
      { name: "Hypatia", xp: 3120, streak: 9 },
      { name: "Pythagoras", xp: 2780, streak: 7 },
      { name: "Fibonacci", xp: 2410, streak: 6 },
      { name: "Turing", xp: 1980, streak: 4 },
      { name: "Lovelace Jr.", xp: 1450, streak: 3 },
      { name: "Curie", xp: 980, streak: 2 },
    ];
    demo.forEach((d, i) => {
      MM.store.addUser({
        id: "demo_" + i,
        name: d.name,
        email: `demo${i}@mathmaster.dev`,
        pass: "demo",
        avatar: null,
        role: "student",
        joinedAt: Date.now() - (i + 1) * 864e5,
        bio: "",
        title: "Math Explorer",
        demoXp: d.xp,
        demoStreak: d.streak,
      });
    });
  }

  function initGlobal() {
    // restore session
    MM.auth.restore();
    // seed demo accounts (so leaderboard is populated)
    seedDemo();
    // apply theme (theme.init also wires toggles, called again by buildNav)
    MM.theme.init();
    // mount nav + footer + reveal-on-scroll
    MM.ui.mount(pageName());
    // bind UI sound effects
    MM.sound.bindUI();
    // hide page loader
    window.addEventListener("load", () => MM.ui.hidePageLoader());
    // safety: hide loader after 2.5s no matter what
    setTimeout(() => MM.ui.hidePageLoader(), 2500);

    // keyboard shortcut: "/" focuses nav search
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
        const s = document.getElementById("navSearchInput");
        if (s) { e.preventDefault(); s.focus(); }
      }
    });

    // check achievements shortly after load
    setTimeout(() => MM.ui.checkAchievements(), 1200);
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGlobal);
  } else {
    initGlobal();
  }

  MM.app = { pageName, initGlobal, seedDemo };
})();
