/* ===================================================================
   MathMaster — components.js
   Shared UI: nav, footer, toasts, modal, confetti, reveal-on-scroll,
   page loader, icons, math rendering, stat helpers
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});
  const { $, $$, el, fmt } = MM;

  /* ---------- Icon set (inline SVG strings) ---------- */
  const ICONS = {
    home: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 12 3l9 6.5"/><path d="M5 10v10h14V10"/></svg>',
    book: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M19 17H6a2 2 0 0 0-2 2"/></svg>',
    pen: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    quiz: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M6 4h12v5a6 6 0 0 1-12 0z"/><path d="M9 20h6"/><path d="M12 15v5"/></svg>',
    chart: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l3-4 3 3 5-7"/></svg>',
    user: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    cog: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>',
    info: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    mail: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    search: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
    flame: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 1-3s-3 1-3 5a6 6 0 0 0 12 0c0-6-6-10-6-10z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    star: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="m12 2 3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.3 3.2L7 14.2 2 9.4l7-.9z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    calc: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8"/><path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>',
    pi: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h18"/><path d="M5 8c2 6 5 8 7 8s2-4 2-8"/><path d="M9 8c0-2 1-3 2-3"/></svg>',
    ruler: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 7v3M10 7v4M14 7v3M18 7v4"/></svg>',
    dice: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.2" fill="currentColor"/><circle cx="16" cy="8" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="8" cy="16" r="1.2" fill="currentColor"/><circle cx="16" cy="16" r="1.2" fill="currentColor"/></svg>',
    grid: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    shape: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 22 20H2z"/></svg>',
    stats: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/></svg>',
    percent: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5 5 19"/><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>',
    github: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .3.3.6.9.6 1.8v2.7c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg>',
  };
  MM.icons = ICONS;
  MM.icon = (name, size) => {
    const s = ICONS[name] || "";
    if (!size) return s;
    return s.replace(/width="\d+" height="\d+"/, `width="${size}" height="${size}"`);
  };

  /* ---------- Nav links config ---------- */
  const NAV = [
    { href: "index.html", label: "Home", icon: "home" },
    { href: "lessons.html", label: "Lessons", icon: "book" },
    { href: "exercises.html", label: "Exercises", icon: "pen" },
    { href: "quizzes.html", label: "Quizzes", icon: "quiz" },
    { href: "leaderboard.html", label: "Leaderboard", icon: "trophy" },
    { href: "progress.html", label: "Progress", icon: "chart" },
    { href: "about.html", label: "About", icon: "info" },
    { href: "contact.html", label: "Contact", icon: "mail" },
  ];

  function navHref(file) {
    const path = location.pathname;
    const inPages = path.includes("/pages/");
    const inAdmin = path.includes("/admin/");
    if (file === "index.html") return inPages || inAdmin ? "../index.html" : "index.html";
    if (file === "404.html") return "404.html";
    return inPages ? file : inAdmin ? "../pages/" + file.replace("pages/", "") : "pages/" + file;
  }
  MM.navHref = navHref;

  /* ---------- Build Navbar ---------- */
  function buildNav(active) {
    const slot = $("#nav-slot");
    if (!slot) return;
    const user = MM.auth.currentUser();
    const lp = MM.levelProgress(MM.store.progress.xp);

    const nav = el("nav", { class: "nav", id: "mainNav", "aria-label": "Main navigation" });
    nav.innerHTML = `
      <div class="container nav-inner">
        <a class="brand" href="${navHref("index.html")}" aria-label="MathMaster home">
          <span class="logo">∑</span>
          <span>Math<span class="gradient-text">Master</span></span>
        </a>
        <div class="nav-links">
          ${NAV.map((n) => `<a href="${navHref("pages/" + n.href)}" ${active === n.href.split(".")[0] ? 'class="active"' : ""}>${n.label}</a>`).join("")}
        </div>
        <div class="nav-actions">
          <div class="nav-search">
            <span class="icon">${ICONS.search}</span>
            <input type="search" id="navSearchInput" placeholder="Search lessons…" aria-label="Search lessons" />
          </div>
          <span class="xp-pill" title="Your level and XP">
            <span class="lv">Lv ${lp.level}</span>
            <strong>${fmt.compact(MM.store.progress.xp)} XP</strong>
          </span>
          <button class="btn-icon" data-theme-toggle aria-label="Toggle theme">
            <span data-theme-icon>${MM.theme.current === "dark" ? "☀️" : "🌙"}</span>
          </button>
          ${user
            ? `<a class="avatar" href="${navHref("pages/profile.html")}" title="${MM.escapeHtml(user.name)}" aria-label="Profile">${user.avatar ? `<img src="${user.avatar}" alt="" />` : MM.escapeHtml((user.name || "U").slice(0, 1).toUpperCase())}</a>`
            : `<a class="btn btn-ghost btn-sm" href="${navHref("pages/login.html")}">Sign in</a>`}
          <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false"><span class="bars"></span></button>
        </div>
      </div>
      <div class="mobile-drawer" id="mobileDrawer">
        ${NAV.map((n) => `<a href="${navHref("pages/" + n.href)}" ${active === n.href.split(".")[0] ? 'class="active"' : ""}>${n.label}</a>`).join("")}
        ${user ? `<a href="${navHref("pages/profile.html")}">Profile</a><a href="${navHref("pages/settings.html")}">Settings</a>${user.role === "admin" ? `<a href="${navHref("admin/dashboard.html")}">Admin</a>` : ""}` : `<a href="${navHref("pages/login.html")}">Sign in</a><a href="${navHref("pages/register.html")}">Sign up</a>`}
      </div>
    `;
    slot.replaceWith(nav);

    const toggle = $("#navToggle", nav);
    const drawer = $("#mobileDrawer", nav);
    toggle?.addEventListener("click", () => {
      const open = drawer.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });

    const onScroll = MM.throttle(() => nav.classList.toggle("scrolled", window.scrollY > 8), 60);
    window.addEventListener("scroll", onScroll, { passive: true });

    const si = $("#navSearchInput", nav);
    si?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && si.value.trim()) {
        const q = encodeURIComponent(si.value.trim());
        window.location.href = navHref("pages/lessons.html") + "?q=" + q;
      }
    });

    MM.theme.init();
  }

  /* ---------- Build Footer ---------- */
  function buildFooter() {
    const slot = $("#footer-slot");
    if (!slot) return;
    const year = new Date().getFullYear();
    const footer = el("footer", { class: "footer" });
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="brand"><span class="logo">∑</span><span>Math<span class="gradient-text">Master</span></span></div>
            <p>Master mathematics one step at a time. Interactive lessons, instant feedback, and a community of learners.</p>
            <div class="social-row mt-4">
              <a href="#" aria-label="GitHub">${ICONS.github}</a>
              <a href="#" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="YouTube">▶</a>
              <a href="#" aria-label="Discord">💬</a>
            </div>
          </div>
          <div>
            <h4>Learn</h4>
            <ul>
              <li><a href="${navHref("pages/lessons.html")}">Lessons</a></li>
              <li><a href="${navHref("pages/exercises.html")}">Exercises</a></li>
              <li><a href="${navHref("pages/quizzes.html")}">Quizzes</a></li>
              <li><a href="${navHref("pages/leaderboard.html")}">Leaderboard</a></li>
            </ul>
          </div>
          <div>
            <h4>Account</h4>
            <ul>
              <li><a href="${navHref("pages/profile.html")}">Profile</a></li>
              <li><a href="${navHref("pages/progress.html")}">Progress</a></li>
              <li><a href="${navHref("pages/settings.html")}">Settings</a></li>
              <li><a href="${navHref("pages/login.html")}">Sign in</a></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="${navHref("pages/about.html")}">About</a></li>
              <li><a href="${navHref("pages/contact.html")}">Contact</a></li>
              <li><a href="${navHref("index.html")}">Home</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${year} MathMaster. Built for learners everywhere. 🚀</span>
          <span>Made with <span class="gradient-text">passion</span> for math education.</span>
        </div>
      </div>
    `;
    slot.replaceWith(footer);
  }

  /* ---------- Toast ---------- */
  function ensureToastStack() {
    let stack = $(".toast-stack");
    if (!stack) {
      stack = el("div", { class: "toast-stack", role: "status", "aria-live": "polite" });
      document.body.appendChild(stack);
    }
    return stack;
  }
  function toast(message, type = "info", duration = 3200) {
    const stack = ensureToastStack();
    const icons = { success: "✅", error: "⛔", warning: "⚠️", info: "💡" };
    const t = el("div", { class: `toast ${type}`, role: "alert" },
      el("span", { class: "ic" }, icons[type] || "💡"),
      el("span", { class: "msg" }, message)
    );
    stack.appendChild(t);
    MM.sound.play(type === "success" ? "pop" : type === "error" ? "wrong" : "click");
    const timer = setTimeout(() => dismiss(), duration);
    function dismiss() {
      clearTimeout(timer);
      t.classList.add("out");
      setTimeout(() => t.remove(), 300);
    }
    t.addEventListener("click", dismiss);
    return { dismiss };
  }

  /* ---------- Modal ---------- */
  function modal({ title, body, actions = [], size }) {
    const back = el("div", { class: "modal-backdrop", role: "dialog", "aria-modal": "true", "aria-label": title || "Dialog" });
    const m = el("div", { class: "modal" });
    if (size) m.style.maxWidth = size;
    const head = el("div", { class: "modal-head" },
      el("h3", {}, title || ""),
      el("button", { class: "btn-icon", "aria-label": "Close", onclick: close }, MM.icon("x"))
    );
    const bodyEl = el("div", { class: "modal-body" });
    if (typeof body === "string") bodyEl.innerHTML = body;
    else if (body instanceof Node) bodyEl.appendChild(body);

    m.appendChild(head); m.appendChild(bodyEl);
    if (actions.length) {
      const foot = el("div", { class: "modal-foot" });
      actions.forEach((a) => {
        const btn = el("button", { class: `btn ${a.variant ? "btn-" + a.variant : "btn-ghost"}`, onclick: () => a.onClick?.({ close, body: bodyEl }) }, a.label);
        foot.appendChild(btn);
      });
      m.appendChild(foot);
    }
    back.appendChild(m);
    back.addEventListener("click", (e) => { if (e.target === back) close(); });
    document.addEventListener("keydown", onKey);
    document.body.appendChild(back);
    requestAnimationFrame(() => back.classList.add("open"));
    function close() {
      back.classList.remove("open");
      setTimeout(() => { back.remove(); document.removeEventListener("keydown", onKey); }, 250);
    }
    function onKey(e) { if (e.key === "Escape") close(); }
    return { close, body: bodyEl, element: m };
  }
  function confirm(opts) {
    const { title = "Are you sure?", message = "", confirmText = "Confirm", cancelText = "Cancel", danger = true } = opts;
    return new Promise((resolve) => {
      modal({
        title,
        body: `<p>${message}</p>`,
        actions: [
          { label: cancelText, variant: "ghost", onClick: ({ close }) => { close(); resolve(false); } },
          { label: confirmText, variant: danger ? "danger" : "primary", onClick: ({ close }) => { close(); resolve(true); } },
        ],
      });
    });
  }

  /* ---------- Confetti ---------- */
  function confetti(count = 80) {
    if (MM.store.settings.reduceMotion) return;
    const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#06b6d4"];
    for (let i = 0; i < count; i++) {
      const p = el("div", { class: "confetti-piece" });
      p.style.left = Math.random() * 100 + "vw";
      p.style.background = MM.rand.pick(colors);
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      p.style.animationDuration = 2 + Math.random() * 2 + "s";
      p.style.animationDelay = Math.random() * 0.5 + "s";
      if (Math.random() > 0.5) p.style.borderRadius = "50%";
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 4500);
    }
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;
    if (MM.store.settings.reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((i) => i.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach((i, idx) => { i.style.transitionDelay = (idx % 6) * 60 + "ms"; io.observe(i); });
  }

  /* ---------- Page loader ---------- */
  function hidePageLoader() {
    const loader = $(".page-loader");
    if (!loader) return;
    loader.classList.add("hidden");
    setTimeout(() => loader.remove(), 600);
  }

  /* ---------- Math rendering ---------- */
  function renderMath(input) {
    if (input == null) return "";
    let s = String(input);
    // frac first
    s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (m, a, b) =>
      `<span class="frac"><span class="num">${a}</span><span class="den">${b}</span></span>`
    );
    const repl = [
      [/\\sqrt\{([^{}]+)\}/g, (m, x) => `√<span style="border-top:1.5px solid currentColor;padding-top:1px">${x}</span>`],
      [/\\pi/g, "π"],
      [/\\cdot/g, "·"],
      [/\\times/g, "×"],
      [/\\div/g, "÷"],
      [/\\pm/g, "±"],
      [/\\le/g, "≤"],
      [/\\ge/g, "≥"],
      [/\\ne/g, "≠"],
      [/\\approx/g, "≈"],
      [/\\infty/g, "∞"],
      [/\\sum/g, "∑"],
      [/\\Delta/g, "Δ"],
      [/\\theta/g, "θ"],
      [/\\alpha/g, "α"],
      [/\\beta/g, "β"],
      [/\^([0-9+\-=a-zA-Z^])/g, (m, x) => `<sup>${x}</sup>`],
      [/\^\{([^{}]+)\}/g, (m, x) => `<sup>${x}</sup>`],
      [/_([0-9a-zA-Z])/g, (m, x) => `<sub>${x}</sub>`],
      [/_\{([^{}]+)\}/g, (m, x) => `<sub>${x}</sub>`],
    ];
    for (const [re, fn] of repl) s = s.replace(re, fn);
    return s;
  }
  function injectMathStyle() {
    if (document.getElementById("mm-math-style")) return;
    const s = el("style", { id: "mm-math-style" });
    s.textContent = `
      .frac{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;margin:0 .15em;font-size:.9em}
      .frac .num{border-bottom:1.5px solid currentColor;padding:0 .3em;line-height:1.3}
      .frac .den{padding:0 .3em;line-height:1.3}
      sub,sup{font-size:.72em}
    `;
    document.head.appendChild(s);
  }

  /* ---------- Progress ring ---------- */
  function ring(pct, size = 120, stroke = 10, label = "") {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const off = c * (1 - MM.clamp(pct, 0, 1));
    const wrap = el("div", { class: "ring-progress", style: `width:${size}px;height:${size}px` });
    wrap.innerHTML = `
      <svg width="${size}" height="${size}">
        <defs><linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#6366f1"/><stop offset="50%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#ec4899"/>
        </linearGradient></defs>
        <circle class="track" cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke-width="${stroke}"/>
        <circle class="fill" cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke-width="${stroke}"
          stroke-dasharray="${c}" stroke-dashoffset="${off}"/>
      </svg>
      <span class="lbl">${label || Math.round(pct*100)+"%"}</span>
    `;
    return wrap;
  }

  /* ---------- Achievement checker ---------- */
  const ACHIEVEMENTS = [
    { id: "first_steps", name: "First Steps", desc: "Complete your first lesson", icon: "👣", check: (p) => Object.keys(p.lessonsCompleted).length >= 1 },
    { id: "sharp_shooter", name: "Sharp Shooter", desc: "Answer 10 questions correctly", icon: "🎯", check: (p) => p.correctAnswers >= 10 },
    { id: "centurion", name: "Centurion", desc: "Answer 100 questions correctly", icon: "💯", check: (p) => p.correctAnswers >= 100 },
    { id: "quiz_master", name: "Quiz Master", desc: "Complete 5 quizzes", icon: "🧠", check: (p) => p.quizzesTaken >= 5 },
    { id: "streak_3", name: "On Fire", desc: "3-day streak", icon: "🔥", check: (p) => p.streak >= 3 },
    { id: "streak_7", name: "Week Warrior", desc: "7-day streak", icon: "⚡", check: (p) => p.streak >= 7 },
    { id: "level_5", name: "Rising Star", desc: "Reach level 5", icon: "🌟", check: (p) => MM.levelFromXP(p.xp) >= 5 },
    { id: "level_10", name: "Math Prodigy", desc: "Reach level 10", icon: "👑", check: (p) => MM.levelFromXP(p.xp) >= 10 },
    { id: "xp_1k", name: "Knowledge Seeker", desc: "Earn 1000 XP", icon: "📚", check: (p) => p.xp >= 1000 },
    { id: "scholar", name: "Scholar", desc: "Complete 10 lessons", icon: "🎓", check: (p) => Object.keys(p.lessonsCompleted).length >= 10 },
    { id: "daily_devotee", name: "Daily Devotee", desc: "Complete a daily challenge", icon: "🗓️", check: (p) => p.history.some((h) => h.text.includes("Daily")) },
    { id: "perfectionist", name: "Perfectionist", desc: "Get 100% on any quiz", icon: "🏆", check: (p) => p.history.some((h) => /Quiz completed/.test(h.text) && /100 XP/.test(h.text)) },
  ];
  function checkAchievements() {
    const p = MM.store.progress;
    const unlocked = [];
    ACHIEVEMENTS.forEach((a) => {
      if (a.check(p) && MM.store.unlockAchievement(a.id)) unlocked.push(a);
    });
    unlocked.forEach((a, i) => {
      setTimeout(() => {
        MM.toast(`Achievement unlocked: ${a.name} ${a.icon}`, "success", 4000);
        MM.sound.play("achievement");
        confetti(40);
      }, 400 + i * 900);
    });
    return unlocked;
  }
  MM.ACHIEVEMENTS = ACHIEVEMENTS;

  /* ---------- Level-up banner ---------- */
  document.addEventListener("mm:levelup", (e) => {
    MM.sound.play("levelup");
    confetti(60);
    MM.toast(`🎉 Level up! You reached level ${e.detail.level}`, "success", 4000);
  });

  /* ---------- Boot ---------- */
  function mount(active) {
    injectMathStyle();
    buildNav(active);
    buildFooter();
    initReveal();
    document.addEventListener("mm:storage", MM.debounce(checkAchievements, 600));
  }

  MM.ui = {
    buildNav, buildFooter, toast, modal, confirm, confetti,
    initReveal, hidePageLoader,
    renderMath, ring, checkAchievements, mount, navHref,
  };
})();
