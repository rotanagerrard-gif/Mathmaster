/* ===================================================================
   MathMaster — i18n.js
   Lightweight internationalization (English + Khmer)
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});

  const STRINGS = {
    en: {
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
      "nav.search": "Search lessons\u2026",
      "footer.tagline": "Master mathematics one step at a time. Interactive lessons, instant feedback, and a community of learners.",
      "footer.learn": "Learn",
      "footer.account": "Account",
      "footer.company": "Company",
      "footer.copy": "Built for learners everywhere.",
      "footer.made": "Made with",
      "footer.passion": "passion",
      "footer.for": "for math education.",
      "common.signin": "Sign in",
      "common.signout": "Sign out",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.confirm": "Confirm",
      "common.loading": "Loading",
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
      "auth.welcome": "Welcome to MathMaster",
      "auth.signin": "Sign In",
      "auth.create": "Create Account",
      "auth.demo": "Skip \u2014 use Demo Account",
    },
    km: {
      "nav.home": "\u1791\u17c6\u1796\u17b6\u1780\u178a\u17be\u1798",
      "nav.lessons": "\u1798\u17b6\u1782\u1796\u17b7\u1793\u17d2\u1792",
      "nav.exercises": "\u179b\u17c6\u17a0\u17b6\u178f\u17cb",
      "nav.quizzes": "\u179f\u17c6\u178e\u17bd\u179a",
      "nav.leaderboard": "\u178f\u17b6\u179a\u17b6\u1784",
      "nav.progress": "\u179c\u17ca\u178c\u17d2\u1792\u1793\u1797\u17b6\u1796",
      "nav.about": "\u17a2\u17c6\u1796\u17b8",
      "nav.contact": "\u1791\u17c6\u1793\u17b6\u1780\u17cb\u1791\u17c6\u1793\u17b6\u1784",
      "nav.profile": "\u1794\u17d2\u179a\u179c\u178f\u17d2\u178f\u17b7\u179a\u17bc\u1794",
      "nav.settings": "\u1780\u17b6\u179a\u1780\u17c6\u178e\u178f\u17cb",
      "nav.admin": "\u17a2\u17d2\u1793\u1780\u1782\u17d2\u179a\u1794\u17cb\u1782\u17d2\u179a\u1784",
      "nav.signin": "\u1785\u17bc\u179b",
      "nav.signup": "\u1785\u17bb\u17c7\u17a0\u17d2\u1798\u17c4\u17c7",
      "nav.search": "\u179f\u17d2\u179c\u17c2\u1784\u179a\u1780\u1798\u17b6\u1782\u1796\u17b7\u1793\u17d2\u1792\u2026",
      "footer.tagline": "\u179a\u17b6\u1793\u17d2\u1791\u17b6\u1793\u1782\u178e\u17b7\u178f\u179c\u17b7\u1791\u17d2\u1799\u17b6\u1798\u17bd\u1799\u1787\u17c6\u17a0\u17b6\u1793\u1798\u17d2\u178f\u1784\u17cd\u17d4 \u1798\u17b6\u1782\u1796\u17b7\u1793\u17d2\u1792\u17a2\u1793\u17d2\u178f\u179a\u1780\u1798\u17d2\u1798 \u1798\u178f\u17b7\u1780\u17c1\u179b\u1798\u17d2\u1794\u1797\u17d2\u179a\u17b6\u1794\u17cb \u1793\u17b7\u1784\u179f\u17a0\u1782\u1798\u1793\u17cd\u179f\u17a2\u17d2\u1793\u1780\u179a\u17b6\u1793\u17d2\u1791\u17b6\u1793\u17d4",
      "footer.learn": "\u179a\u17b6\u1793\u17d2\u1791\u17b6\u1793",
      "footer.account": "\u1782\u178e\u17d2\u1793\u17b8",
      "footer.company": "\u1780\u17d2\u179a\u17bb\u1798\u17a0\u17ca\u17bb\u1793",
      "footer.copy": "\u1794\u1784\u17d2\u1780\u17be\u178f\u179f\u1798\u17d2\u179a\u17b6\u1794\u17cb\u17a2\u17d2\u1793\u1780\u179a\u17b6\u1793\u17d2\u1791\u17b6\u1793\u1782\u17d2\u179a\u1794\u17cb\u1791\u17b8\u1780\u1793\u17d2\u179b\u17c2\u1784\u17d4",
      "footer.made": "\u1794\u1784\u17d2\u1780\u17be\u178f\u178a\u17c4\u1799",
      "footer.passion": "\u1785\u17b7\u178f\u17d2\u178f\u179f\u17d2\u179a\u179b\u17b6\u1789\u17cb",
      "footer.for": "\u179f\u1798\u17d2\u179a\u17b6\u1794\u17cb\u1780\u17b6\u179a\u17a2\u1794\u17cb\u179a\u17c6\u1782\u178e\u17b7\u178f\u179c\u17b7\u1791\u17d2\u1799\u17b6\u17d4",
      "common.signin": "\u1785\u17bc\u179b",
      "common.signout": "\u1785\u17b6\u1780\u1785\u17c1\u1789",
      "common.save": "\u179a\u1780\u17d2\u179f\u17b6\u1791\u17bb\u1780",
      "common.cancel": "\u1794\u17c4\u17c7\u1794\u1784\u17cb",
      "common.confirm": "\u1794\u1789\u17d2\u1787\u17b6\u1780",
      "common.loading": "\u1780\u17c6\u1796\u17bb\u1784\u1795\u17d2\u179b\u17bc\u179c",
      "settings.title": "\u1780\u17b6\u179a\u1780\u17c6\u178e\u178f\u17cb",
      "settings.subtitle": "\u1780\u17c2\u178f\u1798\u179a\u17bc\u179c MathMaster \u1787\u17b1\u1799\u179f\u1798\u1793\u17b9\u1784\u179a\u1794\u17d2\u179a\u17c6\u1794\u179a\u17b6\u1793\u17d2\u1791\u17b6\u1793\u179a\u1794\u179f\u17cb\u17a2\u17d2\u1793\u1780\u17d4",
      "settings.appearance": "\u179a\u17bc\u1794\u179a\u17b6\u1784",
      "settings.theme": "\u179a\u1785\u1793\u17b6\u1794\u17d0\u1791\u17d2\u1798",
      "settings.theme.desc": "\u1787\u17d2\u179a\u17be\u179f\u179a\u17be\u179f\u1797\u17d2\u179b\u17be \u1784\u1784\u17b9\u178f \u1787\u17c4\u178f\u17b6\u1798\u1794\u17d2\u179a\u1796\u17d0\u1793\u17d2\u1792\u17d2\u1799\u17d4",
      "settings.motion": "\u1780\u17b6\u178f\u17cb\u1794\u1793\u17d2\u1790\u1799\u1785\u179b\u1793\u17b6",
      "settings.motion.desc": "\u1780\u17b6\u178f\u17cb\u1794\u1793\u17d2\u1790\u1799\u1785\u179b\u1793\u17b6 \u1793\u17b7\u1784\u1780\u17b6\u179a\u1795\u17d2\u179b\u17b6\u179f\u17cb\u1794\u17d2\u178f\u17bc\u179a\u17d4",
      "settings.audio": "\u179f\u17c6\u17a1\u17c1\u1784",
      "settings.sound": "\u1794\u17c2\u1794\u1795\u17c2\u1793\u179f\u17c6\u17a1\u17c1\u1784",
      "settings.sound.desc": "\u1785\u17bb\u1785\u17cb \u178f\u17d2\u179a\u17b9\u1798\u178f\u17d2\u179a\u17bc\u179c/\u1781\u17bb\u179f \u1793\u17b7\u1784\u1787\u17c4\u178f\u1787\u17d0\u1799\u17d4",
      "settings.learning": "\u1780\u17b6\u179a\u179a\u17b6\u1793\u17d2\u1791\u17b6\u1793",
      "settings.difficulty": "\u1780\u1798\u17d2\u179a\u17b7\u178f\u179b\u17c6\u1794\u17b6\u1780",
      "settings.difficulty.desc": "\u1794\u17c9\u17b6\u1796\u17b6\u179b\u17cb\u178a\u179b\u17cb\u1780\u17b6\u179a\u1780\u17c6\u178e\u178f\u17cb\u179f\u17c6\u178e\u17bd\u179a\u17d4",
      "settings.language": "\u1797\u17b6\u179f\u17b6",
      "settings.language.desc": "\u1797\u17b6\u179f\u17b6\u1785\u17c6\u178e\u17bb\u1785\u1794\u17d2\u179a\u1791\u17b6\u1780\u17cb\u17d4",
      "settings.account": "\u1782\u178e\u17d2\u1793\u17b8",
      "settings.export": "\u1793\u17b6\u17c6\u1785\u17c1\u1789\u1791\u17b7\u1793\u17d2\u1793\u1793\u17d0\u1799",
      "settings.reset": "\u1780\u17c6\u178e\u178f\u17cb\u1791\u17b7\u1793\u17d2\u1793\u1793\u17d0\u1799\u17a0\u17be\u1784\u179c\u17b7\u1789",
      "settings.signout": "\u1785\u17b6\u1780\u1785\u17c1\u1789",
      "settings.lang.saved": "\u1794\u17b6\u1793\u1794\u17d2\u178f\u17bc\u179a\u1797\u17b6\u179f\u17b6\u1791\u17b6\u1781\u17d2\u1798\u17c2\u179a",
      "settings.lang.saved.en": "\u1794\u17b6\u1793\u1794\u17d2\u178f\u17bc\u179a\u1797\u17b6\u179f\u17b6\u1791\u17b6\u17a2\u1784\u17cb\u1782\u17d2\u179b\u17c1\u179f",
      "auth.welcome": "\u179f\u17bc\u1798\u179f\u17d2\u179c\u17b6\u1782\u1798\u1793\u17cd\u1798\u1780\u1780\u17b6\u1793\u17cb MathMaster",
      "auth.signin": "\u1785\u17bc\u179b",
      "auth.create": "\u1794\u1784\u17d2\u1780\u17be\u178f\u1782\u178e\u17d2\u1793\u17b8",
      "auth.demo": "\u179a\u17c6\u179b\u1784 \u2014 \u1794\u17d2\u179a\u17be\u1782\u178e\u17d2\u1793\u17b8 Demo",
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
