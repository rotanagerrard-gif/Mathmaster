/* ===================================================================
   MathMaster — i18n.js
   Lightweight internationalization (English + Khmer)
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});

  const STRINGS = {
    en: {
      // Nav
      "nav.home": "Home",
      "nav.lessons": "Lessons",
      "nav.exercises": "Exercises",
      "nav.quizzes": "Quizzes",
      "nav.leaderboard": "Leaderboard",
      "nav.progress": "Progress",
      "nav.about": "About",
      "nav.contact": "Contact",
      "nav.profile": "Profile",
      "nav.settings": "Settings",
      "nav.admin": "Admin",
      "nav.signin": "Sign in",
      "nav.signup": "Sign up",
      "nav.search": "Search lessons…",
      // Footer
      "footer.tagline": "Master mathematics one step at a time. Interactive lessons, instant feedback, and a community of learners.",
      "footer.learn": "Learn",
      "footer.account": "Account",
      "footer.company": "Company",
      "footer.copy": "Built for learners everywhere.",
      "footer.made": "Made with",
      "footer.passion": "passion",
      "footer.for": "for math education.",
      // Common
      "common.signin": "Sign in",
      "common.signout": "Sign out",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.confirm": "Confirm",
      "common.loading": "Loading",
      // Settings
      "settings.title": "Settings",
      "settings.subtitle": "Customize MathMaster to fit your learning style.",
      "settings.appearance": "Appearance",
      "settings.theme": "Theme",
      "settings.theme.desc": "Choose light, dark, or follow your system.",
      "settings.motion": "Reduce motion",
      "settings.motion.desc": "Minimize animations and transitions.",
      "settings.audio": "Audio",
      "settings.sound": "Sound effects",
      "settings.sound.desc": "Clicks, correct/wrong feedback, fanfare.",
      "settings.learning": "Learning",
      "settings.difficulty": "Default difficulty",
      "settings.difficulty.desc": "Affects suggested quiz settings.",
      "settings.language": "Language",
      "settings.language.desc": "Interface language.",
      "settings.account": "Account",
      "settings.export": "Export my data",
      "settings.reset": "Reset all data",
      "settings.signout": "Sign out",
      "settings.lang.saved": "Language changed to Khmer",
      "settings.lang.saved.en": "Language changed to English",
      // Auth
      "auth.welcome": "Welcome to MathMaster",
      "auth.signin": "Sign In",
      "auth.create": "Create Account",
      "auth.demo": "Skip — use Demo Account",
    },
    km: {
      // Nav
      "nav.home": "\u1791\u17c6\u1796\u17b6\u1780",
      "nav.lessons": "\u1798\u17b6\u1782\u1796\u17b7\u1793\u17d2\u1792",
      "nav.exercises": "\u179b\u17b6\u1799\u179c\u17b7\u1785\u17b6\u179a",
      "nav.quizzes": "\u179f\u1798\u17b6\u1792\u17b7",
      "nav.leaderboard": "\u178f\u17b6\u179a\u17b6\u1784",
      "nav.progress": "\u1795\u17d2\u179b\u17bc\u179c\u1793\u17b7\u1791\u17d2\u1790\u17b6\u1793",
      "nav.about": "\u17a2\u17c6\u1796\u17b8",
      "nav.contact": "\u1791\u17c6\u1793\u17b6\u1780\u17cb",
      "nav.profile": "\u1794\u17d2\u179a\u179c\u178f\u17b7\u1796\u17bb\u1782\u17d2\u1782",
      "nav.settings": "\u1780\u17b6\u179a\u1780\u17b6\u1793\u17cb\u178f\u17b6\u1784",
      "nav.admin": "\u17a2\u17b6\u178f\u17b7\u1797\u17b6\u1794\u17b6\u179b",
      "nav.signin": "\u1785\u17bc\u179b",
      "nav.signup": "\u1785\u1789\u17d2\u1787\u17c0\u1798",
      "nav.search": "\u179f\u17d2\u179c\u17c2\u1784\u179a\u1780\u1798\u17b6\u1782\u1796\u17b7\u1793\u17d2\u1792\u2026",
      // Footer
      "footer.tagline": "\u179f\u17d2\u179a\u17be\u179b\u17a2\u1793\u17bb\u179c\u17b7\u1791\u17d2\u1799\u17b6\u179f\u17b6\u179f\u17d2\u178f\u17d2\u179a\u200b\u1798\u17bd\u1799\u179c\u17b7\u1793\u17b6\u1791\u17b8\u200b\u1798\u17b6\u1782\u1796\u17b7\u1793\u17d2\u1792\u17a2\u17b7\u1793\u17d2\u178f\u179a\u17b6\u1780\u17d2\u178f\u17b7\u179c\u200b\u1798\u178f\u17b7\u1780\u17b6\u179a\u1797\u17b6\u1796\u17cb\u1797\u17d2\u179a\u17b6\u1794\u17cb\u200b\u1793\u17b7\u1784\u179f\u17b7\u179f\u17d2\u179f\u1797\u17b6\u1796\u17c1\u1793\u17d2\u1792\u17b6\u1793\u17cb\u179a\u17b6\u179a\u1793\u17b7\u179f\u17d2\u179f\u17b7\u178f\u17d2\u1799\u17b6\u200b\u200b\u17a2\u17d2\u1793\u1780\u179a\u17b8\u1799\u17b6\u1799\u17d2\u1799\u17b6\u1793\u17d2\u1791\u17b6\u1793\u17cb\u17a2\u17b6\u1785\u17b6\u179a\u17b7\u1799\u17d2\u1799\u17b6\u1793\u17d2\u1791\u17b6\u1793\u17cb\u17a2\u17b6\u1785\u17b6\u179a\u17b7\u1799\u17d2\u1799\u17b6\u1793\u17d2\u1791\u17b6\u1793\u17cb",
      "footer.learn": "\u179a\u17b6\u1793\u17d2\u1791\u17b6\u1793",
      "footer.account": "\u1782\u178e\u17d2\u1793\u17b8",
      "footer.company": "\u1780\u17d2\u179a\u17b7\u179f\u178f\u17d2\u1799\u17b6\u1793",
      "footer.copy": "\u1794\u17b6\u1793\u17d2\u1791\u17b6\u1793\u17d2\u178f\u17b6\u1798\u17bd\u1799\u179f\u1798\u17d2\u179a\u17b6\u1794\u17cb\u179a\u17b6\u1793\u17d2\u1791\u17b6\u1793\u17b7\u179a\u17bd\u1799\u1780\u17d2\u1793\u17bb\u1784",
      "footer.made": "\u1794\u17b6\u1793\u17d2\u1791\u17b6\u1793\u178a\u17c4\u1799",
      "footer.passion": "\u1785\u17b7\u178f\u17d2\u178f\u1798\u17d2\u1793\u17b6",
      "footer.for": "\u179f\u1798\u17d2\u179a\u17b6\u1794\u17cb\u1780\u17b6\u179a\u17a2\u1793\u17bb\u179c\u17b7\u1791\u17d2\u1799\u17b6",
      // Common
      "common.signin": "\u1785\u17bc\u179b",
      "common.signout": "\u1785\u17b6\u1789\u17d2\u1785\u17c1\u1789",
      "common.save": "\u179a\u1780\u17d2\u179f\u17b6\u1791\u17bb\u1780",
      "common.cancel": "\u1794\u17c4\u17c7\u1794\u1784\u17cb",
      "common.confirm": "\u1794\u1789\u17d2\u1787\u17b6\u1780",
      "common.loading": "\u1780\u17c6\u1796\u17bb\u1784\u1795\u17d2\u179b\u17bc\u179c",
      // Settings
      "settings.title": "\u1780\u17b6\u179a\u1780\u17b6\u1793\u17cb\u178f\u17b6\u1784",
      "settings.subtitle": "\u1780\u17c6\u178e\u178f\u17cb MathMaster \u1792\u17d2\u179c\u17be\u179f\u1798\u17d2\u179a\u17bd\u1794\u1793\u17b7\u1791\u17d2\u1799\u17b6\u1793\u17d2\u1791\u17b6\u1793\u179a\u1794\u179f\u17cb\u17a2\u17d2\u1793\u1780\u17d2\u1793\u17c1\u1793\u17cb\u17a2\u17d2\u1793\u1780\u17d2\u1793\u17c1\u1793\u17cb",
      "settings.appearance": "\u179a\u17b9\u1794\u179a\u17b6\u1784",
      "settings.theme": "\u1791\u17b8\u1798",
      "settings.theme.desc": "\u1787\u17d2\u179a\u17be\u179f\u179a\u1796\u17b6\u1793\u1796\u17b7\u1793\u17d2\u1792\u17b6\u1793\u17cb\u200b\u1784\u17c6\u17a7\u1785\u17b7\u179c\u200b\u1793\u17b7\u1784\u179f\u17d2\u1798\u17b6\u179a\u17d2\u1791\u1794\u17d2\u179a\u1796\u17d0\u1793\u17d2\u1792\u17d2\u1799\u17a2\u17b7\u1793\u17d2\u178f\u179a\u1793\u17b7\u178f\u17d2\u1799",
      "settings.motion": "\u1780\u17b6\u178f\u17cb\u1785\u179b\u1793\u17b6",
      "settings.motion.desc": "\u1780\u17b6\u178f\u17cb\u1794\u1789\u17d2\u1787\u17b9\u1793\u17d2\u1792\u17b6\u1793\u17cb\u17a2\u17b6\u1793\u17b7\u1798\u17c7\u179f\u17ca\u17b8\u1799\u17c9\u17b6\u1793",
      "settings.audio": "\u179f\u1798\u17d2\u179b\u17c1\u1784",
      "settings.sound": "\u179f\u1798\u17d2\u179b\u17c1\u1784\u1795\u17d2\u179b\u17bc\u179c",
      "settings.sound.desc": "\u1785\u17bb\u1785\u17cb\u200b\u178f\u17d2\u179a\u17b9\u1798\u178f\u17d2\u179a\u17bc\u179c\u17a2\u1793\u17d2\u1791\u179a\u17b6\u1799\u17cb\u200b\u1787\u17c4\u178f\u17d2\u179a\u1798\u178e\u17d2\u178e",
      "settings.learning": "\u1780\u17b6\u179a\u179a\u17b6\u1793\u17d2\u1791\u17b6\u1793",
      "settings.difficulty": "\u1780\u1798\u17d2\u179a\u17b7\u178f\u179a\u1798\u17d2\u1798\u178a\u17be\u1798",
      "settings.difficulty.desc": "\u1794\u17c6\u1796\u17b6\u179a\u17a2\u1791\u17b7\u1790\u17b7\u1796\u17d0\u1793\u17d2\u1792\u17d2\u1799\u179f\u1798\u17b6\u1792\u17b7",
      "settings.language": "\u1797\u17b6\u179f\u17b6",
      "settings.language.desc": "\u1797\u17b6\u179f\u17b6\u1785\u17b6\u1794\u17cb\u1794\u17d2\u179a\u1784\u17d2\u1780\u17b6\u1794\u17cb",
      "settings.account": "\u1782\u178e\u17d2\u1793\u17b8",
      "settings.export": "\u1793\u17b6\u1780\u1785\u17b6\u1791\u17bb\u179b\u17d2\u179b\u17c1\u1781",
      "settings.reset": "\u1780\u17c6\u178e\u178f\u17cb\u1791\u17b7\u1793\u17d2\u1793\u1791\u17b7\u1793\u17d2\u1793\u17a2\u1791\u17b7\u1790\u17b7",
      "settings.signout": "\u1785\u17b6\u1789\u17d2\u1785\u17c1\u1789",
      "settings.lang.saved": "\u1794\u17d2\u178f\u17bc\u179a\u1797\u17b6\u179f\u17b6\u1787\u17b6\u1797\u17b6\u179f\u17b6\u1781\u17d2\u1798\u17c2\u179a\u179a\u17bd\u1785\u17a0\u17b6\u1799",
      "settings.lang.saved.en": "\u1794\u17d2\u178f\u17bc\u179a\u1797\u17b6\u179f\u17b6\u1787\u17b6\u17a2\u1784\u17cb\u1782\u17d2\u179b\u17c1\u179f\u179a\u17bd\u1785\u17a0\u17b6\u1799",
      // Auth
      "auth.welcome": "\u179f\u17bc\u1798\u179f\u17d2\u1798\u17b6\u1782\u17d2\u179a\u1798\u17b6\u1780\u1798\u17b6\u1780 MathMaster",
      "auth.signin": "\u1785\u17bc\u179b",
      "auth.create": "\u1794\u1784\u17d2\u1780\u17be\u178f\u1782\u178e\u17d2\u1793\u17b8",
      "auth.demo": "\u179a\u17c6\u179b\u1784 \u2014 \u1794\u17d2\u179a\u17be\u1794\u17d2\u179a\u17b6\u179f\u17cb Demo",
    },
  };

  function currentLang() {
    try {
      return (MM.store && MM.store.settings && MM.store.settings.language) || "en";
    } catch {
      return "en";
    }
  }

  function t(key) {
    const lang = currentLang();
    const dict = STRINGS[lang] || STRINGS.en;
    return dict[key] || STRINGS.en[key] || key;
  }

  function setLang(lang) {
    if (!STRINGS[lang]) lang = "en";
    if (MM.store) MM.store.setSettings({ language: lang });
    document.documentElement.lang = lang === "km" ? "km" : "en";
  }

  function applyPageI18n() {
    document.documentElement.lang = currentLang() === "km" ? "km" : "en";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key) el.placeholder = t(key);
    });
  }

  MM.i18n = { t, setLang, currentLang, applyPageI18n, STRINGS };
  MM.t = t;
})();
