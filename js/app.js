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

  /** Resolve path to i18n.js from root / pages / admin */
  function i18nSrc() {
    const p = location.pathname;
    if (p.includes("/pages/") || p.includes("/admin/")) return "../js/modules/i18n.js";
    return "js/modules/i18n.js";
  }

  /** Dynamically load i18n if not already present */
  function ensureI18n(cb) {
    if (MM.t && MM.i18n) { cb(); return; }
    const s = document.createElement("script");
    s.src = i18nSrc();
    s.onload = () => cb();
    s.onerror = () => cb();
    document.head.appendChild(s);
  }

  /** Translate hard-coded English chrome (nav, footer, buttons) */
  function localizeChrome() {
    if (!MM.t || !MM.i18n) return;
    const lang = MM.i18n.currentLang();
    document.documentElement.lang = lang === "km" ? "km" : "en";
    if (lang !== "km") return;

    const map = {
      "Home": MM.t("nav.home"),
      "Lessons": MM.t("nav.lessons"),
      "Exercises": MM.t("nav.exercises"),
      "Quizzes": MM.t("nav.quizzes"),
      "Leaderboard": MM.t("nav.leaderboard"),
      "Progress": MM.t("nav.progress"),
      "About": MM.t("nav.about"),
      "Contact": MM.t("nav.contact"),
      "Profile": MM.t("nav.profile"),
      "Settings": MM.t("nav.settings"),
      "Admin": MM.t("nav.admin"),
      "Sign in": MM.t("nav.signin"),
      "Sign up": MM.t("nav.signup"),
      "Learn": MM.t("footer.learn"),
      "Account": MM.t("footer.account"),
      "Company": MM.t("footer.company"),
    };

    document.querySelectorAll(
      ".nav-links a, .mobile-drawer a, .footer a, .footer h4, .btn-ghost.btn-sm"
    ).forEach((el) => {
      const txt = el.textContent.trim();
      if (map[txt]) el.textContent = map[txt];
    });

    const search = document.getElementById("navSearchInput");
    if (search) {
      search.placeholder = MM.t("nav.search");
      search.setAttribute("aria-label", MM.t("nav.search"));
    }

    // Footer tagline paragraph (first p inside footer brand column)
    const tagline = document.querySelector(".footer-grid > div > p");
    if (tagline) tagline.textContent = MM.t("footer.tagline");

    MM.i18n.applyPageI18n();
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
    // localize UI if Khmer selected
    ensureI18n(() => localizeChrome());
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

  MM.app = { pageName, initGlobal, seedDemo, localizeChrome, ensureI18n };
})();
