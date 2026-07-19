/* ===================================================================
   MathMaster — utils.js
   Global helpers: $, DOM, format, random, debounce, escape, math eval
   Exposed on window.MM
   =================================================================== */
(function () {
  "use strict";

  const MM = (window.MM = window.MM || {});

  /* ---------- DOM helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k === "text") node.textContent = v;
      else if (k === "dataset") Object.assign(node.dataset, v);
      else if (k.startsWith("on") && typeof v === "function")
        node.addEventListener(k.slice(2).toLowerCase(), v);
      else node.setAttribute(k, v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      node.append(c.nodeType ? c : document.createTextNode(c));
    }
    return node;
  }

  /* ---------- Number / format ---------- */
  const fmt = {
    num(n) {
      return new Intl.NumberFormat("en-US").format(n);
    },
    compact(n) {
      return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
    },
    pct(n) {
      return Math.round((n || 0) * 100) + "%";
    },
    time(sec) {
      sec = Math.max(0, Math.floor(sec));
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m}:${String(s).padStart(2, "0")}`;
    },
    date(ts) {
      return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    },
    relTime(ts) {
      const diff = Date.now() - ts;
      const units = [
        ["year", 31536e6], ["month", 2592e6], ["day", 864e5],
        ["hour", 36e5], ["minute", 6e4], ["second", 1e3],
      ];
      for (const [name, ms] of units) {
        const v = Math.floor(diff / ms);
        if (v >= 1) return `${v} ${name}${v > 1 ? "s" : ""} ago`;
      }
      return "just now";
    },
  };

  /* ---------- Random ---------- */
  const rand = {
    int(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },
    picks(arr, n) {
      const copy = [...arr];
      const out = [];
      while (out.length < n && copy.length) {
        out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
      }
      return out;
    },
    shuffle(arr) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
  };

  /* ---------- Function utils ---------- */
  const debounce = (fn, wait = 200) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };
  const throttle = (fn, wait = 100) => {
    let last = 0, t;
    return (...args) => {
      const now = Date.now();
      const remain = wait - (now - last);
      if (remain <= 0) { last = now; fn(...args); }
      else { clearTimeout(t); t = setTimeout(() => { last = Date.now(); fn(...args); }, remain); }
    };
  };
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const range = (n) => [...Array(n).keys()];
  const uid = (p = "id") => `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  /* ---------- String / escape ---------- */
  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function slugify(str) {
    return String(str).toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
  }

  /* ---------- Safe math expression evaluator (no eval) ---------- */
  // Supports + - * / ^ ( ) and basic functions, decimals, fractions a/b
  function evalMath(expr) {
    if (typeof expr === "number") return expr;
    if (expr == null || expr === "") return NaN;
    let s = String(expr).trim()
      .replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-")
      .replace(/\^/g, "**")
      .replace(/(\d)\s*%\s*(\d)/g, "($1/100*$2)")
      .replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");
    // tokenize
    const tokens = s.match(/(\d+\.?\d*|\.\d+|[a-zA-Z]+|[-+*/^()])/g);
    if (!tokens) return NaN;
    let pos = 0;
    function peek() { return tokens[pos]; }
    function next() { return tokens[pos++]; }
    function parseExpr() {
      let v = parseTerm();
      while (peek() === "+" || peek() === "-") {
        const op = next();
        const r = parseTerm();
        v = op === "+" ? v + r : v - r;
      }
      return v;
    }
    function parseTerm() {
      let v = parsePow();
      while (peek() === "*" || peek() === "/") {
        const op = next();
        const r = parsePow();
        v = op === "*" ? v * r : v / r;
      }
      return v;
    }
    function parsePow() {
      let v = parseFactor();
      while (peek() === "**") {
        next();
        v = Math.pow(v, parseFactor());
      }
      return v;
    }
    function parseFactor() {
      const t = peek();
      if (t === "(") { next(); const v = parseExpr(); if (next() !== ")") return NaN; return v; }
      if (t === "-") { next(); return -parseFactor(); }
      if (t === "+") { next(); return parseFactor(); }
      next();
      return parseFloat(t);
    }
    try {
      return parseExpr();
    } catch {
      return NaN;
    }
  }

  /* ---------- Fraction helpers ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
  function frac(num, den = 1) {
    if (den === 0) return { n: 0, d: 1 };
    if (den < 0) { num = -num; den = -den; }
    const g = gcd(num, den);
    return { n: num / g, d: den / g };
  }
  function fracStr(f) { return f.d === 1 ? `${f.n}` : `${f.n}/${f.d}`; }

  /* ---------- Decimal to fraction ---------- */
  function toFraction(x, maxDen = 100) {
    if (Number.isInteger(x)) return { n: x, d: 1 };
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1, b = x;
    do {
      const a = Math.floor(b);
      const h = a * h1 + h2; const k = a * k1 + k2;
      h2 = h1; h1 = h; k2 = k1; k1 = k;
      b = 1 / (b - a);
    } while (Math.abs(x - h1 / k1) > x * 1e-12 && k1 < maxDen);
    return frac(sign * h1, k1);
  }

  /* ---------- Misc ---------- */
  function copyToClipboard(text) {
    if (navigator.clipboard) return navigator.clipboard.writeText(text);
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand("copy"); ta.remove();
    return Promise.resolve();
  }
  function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = el("a", { href: url, download: filename });
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }
  function delay(ms) { return new Promise((r) => setTimeout(r, ms)); }

  /* ---------- Export ---------- */
  Object.assign(MM, {
    $, $$, el,
    fmt, rand, debounce, throttle, clamp, range, uid,
    escapeHtml, slugify, evalMath, gcd, frac, fracStr, toFraction,
    copyToClipboard, downloadJSON, delay,
  });
})();
