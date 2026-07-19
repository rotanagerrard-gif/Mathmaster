/* ===================================================================
   MathMaster — sound.js
   Web Audio synthesized sound effects (no external assets)
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});

  let ctx = null;
  let enabled = true;

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function isEnabled() {
    return enabled && MM.store && MM.store.settings && MM.store.settings.sound;
  }

  // Play a tone: freq (number|[numbers]), dur seconds, type, gain, when
  function tone(freq, dur = 0.15, type = "sine", gain = 0.18, when = 0) {
    if (!isEnabled()) return;
    const a = ac(); if (!a) return;
    const t0 = a.currentTime + when;
    const freqs = Array.isArray(freq) ? freq : [freq];
    freqs.forEach((f) => {
      const osc = a.createOscillator();
      const g = a.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(f, t0);
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(gain, t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g); g.connect(a.destination);
      osc.start(t0); osc.stop(t0 + dur + 0.02);
    });
  }

  function sweep(from, to, dur = 0.2, type = "sawtooth", gain = 0.12) {
    if (!isEnabled()) return;
    const a = ac(); if (!a) return;
    const t0 = a.currentTime;
    const osc = a.createOscillator();
    const g = a.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(a.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  }

  const SFX = {
    click() { tone(420, 0.06, "triangle", 0.1); },
    hover() { tone(620, 0.03, "sine", 0.04); },
    correct() {
      tone([523.25, 659.25, 783.99], 0.16, "sine", 0.16, 0);
      tone(1046.5, 0.22, "sine", 0.12, 0.16);
    },
    wrong() {
      tone(220, 0.18, "square", 0.1);
      tone(180, 0.24, "square", 0.1, 0.08);
    },
    success() {
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.18, "sine", 0.16, i * 0.1));
    },
    levelup() {
      [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, 0.25, "triangle", 0.16, i * 0.08));
    },
    achievement() {
      sweep(440, 880, 0.25, "sawtooth", 0.1);
      tone(1318, 0.3, "sine", 0.12, 0.2);
    },
    tick() { tone(1200, 0.02, "square", 0.04); },
    start() { sweep(200, 600, 0.3, "sine", 0.14); },
    fail() { sweep(400, 80, 0.5, "sawtooth", 0.12); },
    pop() { tone(880, 0.08, "sine", 0.12); },
    whoosh() { sweep(800, 200, 0.18, "sine", 0.06); },
  };

  function play(name) {
    if (!isEnabled()) return;
    const fn = SFX[name];
    if (fn) fn();
  }

  function enable(on) {
    enabled = on;
    if (MM.store) MM.store.setSettings({ sound: on });
    if (on) { const a = ac(); if (a) tone(660, 0.08, "sine", 0.12); }
  }

  // Wire global click sounds (lightweight)
  function bindUI() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("button, .btn, .chip, .option, .nav-links a, .topic-card");
      if (t && !t.dataset.silent) play("click");
    });
  }

  MM.sound = { play, enable, bindUI, tone, sweep, SFX };
})();
