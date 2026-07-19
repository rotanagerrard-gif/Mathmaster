/* ===================================================================
   MathMaster — storage.js
   Persistent localStorage layer for user, progress, XP, settings, data
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});

  const KEY = "mathmaster.v1";
  const DEFAULT = {
    user: null,            // { id, name, email, avatar, role, joinedAt }
    users: [],             // registered accounts
    settings: {
      theme: "dark",
      sound: true,
      reduceMotion: false,
      difficulty: "normal",
      language: "en",
    },
    progress: {
      xp: 0,
      streak: 0,
      lastActive: null,
      lessonsCompleted: {},
      lessonsBookmarked: [],
      questionsAnswered: 0,
      correctAnswers: 0,
      quizzesTaken: 0,
      timeSpent: 0,
      topicStats: {},
      activity: {},
      achievements: [],
      history: [],
    },
    custom: {
      lessons: [],
      questions: [],
    },
    dailyChallenge: { date: null, completed: false, seed: 0 },
  };

  let cache = null;

  function load() {
    if (cache) return cache;
    try {
      const raw = localStorage.getItem(KEY);
      cache = raw ? deepMerge(structuredClone(DEFAULT), JSON.parse(raw)) : structuredClone(DEFAULT);
    } catch {
      cache = structuredClone(DEFAULT);
    }
    return cache;
  }

  function deepMerge(base, over) {
    if (Array.isArray(base) || Array.isArray(over)) return over !== undefined ? over : base;
    if (typeof base === "object" && base && typeof over === "object" && over) {
      const out = { ...base };
      for (const k of Object.keys(over)) out[k] = deepMerge(base[k], over[k]);
      return out;
    }
    return over !== undefined ? over : base;
  }

  function save() {
    if (!cache) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(cache));
    } catch (e) {
      console.warn("Storage save failed", e);
    }
    document.dispatchEvent(new CustomEvent("mm:storage", { detail: cache }));
  }

  const store = {
    get all() { return load(); },

    get settings() { return load().settings; },
    setSettings(patch) { Object.assign(load().settings, patch); save(); },

    get user() { return load().user; },
    set user(u) { load().user = u; save(); },

    get users() { return load().users; },
    addUser(u) { load().users.push(u); save(); },
    updateUser(id, patch) {
      const u = load().users.find((x) => x.id === id);
      if (u) { Object.assign(u, patch); save(); }
    },

    get progress() { return load().progress; },

    /* ---- XP / Level ---- */
    addXP(amount, reason = "") {
      const p = load().progress;
      p.xp += amount;
      const before = levelFromXP(p.xp - amount);
      const after = levelFromXP(p.xp);
      this.recordActivity();
      if (after > before) {
        document.dispatchEvent(new CustomEvent("mm:levelup", { detail: { level: after } }));
      }
      if (reason) this.addHistory(`+${amount} XP · ${reason}`);
      save();
      return { gained: amount, total: p.xp, level: after, leveledUp: after > before };
    },

    /* ---- Streak ---- */
    recordActivity() {
      const p = load().progress;
      const today = new Date().toISOString().slice(0, 10);
      const yest = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
      if (p.lastActive === today) {
        // already counted today
      } else if (p.lastActive === yest) {
        p.streak += 1; p.lastActive = today;
      } else {
        p.streak = 1; p.lastActive = today;
      }
      p.activity[today] = (p.activity[today] || 0) + 1;
      save();
    },

    /* ---- Lessons ---- */
    completeLesson(id, pct = 100) {
      const p = load().progress;
      const prev = p.lessonsCompleted[id]?.pct || 0;
      if (pct > prev) {
        p.lessonsCompleted[id] = { pct, ts: Date.now() };
        if (prev === 0) this.addXP(50, "Lesson completed");
        save();
      }
    },
    bookmarkLesson(id, on) {
      const p = load().progress;
      const i = p.lessonsBookmarked.indexOf(id);
      if (on && i === -1) p.lessonsBookmarked.push(id);
      if (!on && i > -1) p.lessonsBookmarked.splice(i, 1);
      save();
    },

    /* ---- Question answering ---- */
    recordAnswer(topic, correct) {
      const p = load().progress;
      p.questionsAnswered += 1;
      if (correct) p.correctAnswers += 1;
      const t = (p.topicStats[topic] = p.topicStats[topic] || { attempts: 0, correct: 0 });
      t.attempts += 1; if (correct) t.correct += 1;
      if (correct) this.addXP(10, "Correct answer");
      save();
    },
    recordQuiz(score, total) {
      const p = load().progress;
      p.quizzesTaken += 1;
      const earned = Math.round((score / total) * 100);
      this.addXP(earned, "Quiz completed");
      this.recordActivity();
      save();
    },
    addTime(sec) { load().progress.timeSpent += sec; save(); },

    /* ---- Achievements ---- */
    unlockAchievement(id) {
      const p = load().progress;
      if (!p.achievements.includes(id)) {
        p.achievements.push(id);
        this.addXP(25, "Achievement unlocked");
        save();
        return true;
      }
      return false;
    },

    /* ---- Daily challenge ---- */
    getDaily() {
      const d = load().dailyChallenge;
      const today = new Date().toISOString().slice(0, 10);
      if (d.date !== today) {
        d.date = today; d.completed = false;
        d.seed = Number(today.replace(/-/g, ""));
        save();
      }
      return d;
    },
    completeDaily() {
      const d = this.getDaily();
      if (!d.completed) {
        d.completed = true;
        this.addXP(60, "Daily challenge");
        save();
        return true;
      }
      return false;
    },

    addHistory(text) {
      const p = load().progress;
      p.history.unshift({ text, ts: Date.now() });
      if (p.history.length > 50) p.history.length = 50;
      save();
    },

    /* ---- Custom content (admin) ---- */
    addLesson(l) { load().custom.lessons.push(l); save(); },
    updateLesson(id, patch) {
      const l = load().custom.lessons.find((x) => x.id === id);
      if (l) { Object.assign(l, patch); save(); }
    },
    deleteLesson(id) {
      const c = load().custom;
      c.lessons = c.lessons.filter((x) => x.id !== id);
      save();
    },
    addQuestion(q) { load().custom.questions.push(q); save(); },
    updateQuestion(id, patch) {
      const q = load().custom.questions.find((x) => x.id === id);
      if (q) { Object.assign(q, patch); save(); }
    },
    deleteQuestion(id) {
      const c = load().custom;
      c.questions = c.questions.filter((x) => x.id !== id);
      save();
    },

    reset() {
      localStorage.removeItem(KEY);
      cache = null;
      load();
      save();
    },
    export() { return JSON.stringify(load(), null, 2); },
  };

  /* ---- Level helpers ---- */
  function xpForLevel(level) { return Math.round(100 * Math.pow(level, 1.5)); }
  function levelFromXP(xp) {
    let lvl = 1;
    while (xp >= xpForLevel(lvl + 1)) lvl++;
    return lvl;
  }
  function levelProgress(xp) {
    const lvl = levelFromXP(xp);
    const cur = xpForLevel(lvl);
    const next = xpForLevel(lvl + 1);
    const into = xp - cur;
    const span = next - cur;
    return { level: lvl, into, span, next, pct: span ? into / span : 0 };
  }

  MM.store = store;
  MM.xpForLevel = xpForLevel;
  MM.levelFromXP = levelFromXP;
  MM.levelProgress = levelProgress;
})();
