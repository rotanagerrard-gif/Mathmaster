/* ===================================================================
   MathMaster — mathEngine.js
   Procedural question generators for all 13 topics.
   Each generator returns:
   { topic, prompt, type: 'mc'|'input', options?, answer, solution: [steps], unit? }
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});
  const { rand, evalMath, frac, fracStr, toFraction } = MM;

  // seeded RNG so daily challenges are deterministic
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function makeRng(seed) {
    if (!seed) return Math.random;
    const r = mulberry32(seed);
    return {
      next: r,
      int: (min, max) => Math.floor(r() * (max - min + 1)) + min,
      pick: (arr) => arr[Math.floor(r() * arr.length)],
      picks: (arr, n) => {
        const copy = [...arr]; const out = [];
        while (out.length < n && copy.length) out.push(copy.splice(Math.floor(r() * copy.length), 1)[0]);
        return out;
      },
      shuffle: (arr) => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
        return a;
      },
    };
  }

  // helper so we can pass either Math.random or a seeded rng obj
  function asRng(r) {
    if (r.next) return r;
    return {
      next: r,
      int: (min, max) => Math.floor(r() * (max - min + 1)) + min,
      pick: (arr) => arr[Math.floor(r() * arr.length)],
    };
  }

  // Build a multiple-choice option set including the answer + distractors
  function mc(answer, distractors) {
    const opts = new Set([String(answer)]);
    const pool = MM.rand.shuffle([...distractors]);
    for (const d of pool) {
      if (opts.size >= 4) break;
      opts.add(String(d));
    }
    let n = 1;
    while (opts.size < 4) opts.add(String(Number(answer) + n++));
    return MM.rand.shuffle([...opts]);
  }

  /* ---------- Topic generators ---------- */
  const GENERATORS = {

    arithmetic(r = Math.random) {
      const R = asRng(r);
      const op = R.pick(["+", "-", "×", "÷"]);
      let a, b, ans;
      if (op === "+") { a = R.int(10, 99); b = R.int(10, 99); ans = a + b; }
      else if (op === "-") { a = R.int(20, 99); b = R.int(5, a - 1); ans = a - b; }
      else if (op === "×") { a = R.int(3, 12); b = R.int(3, 12); ans = a * b; }
      else { b = R.int(2, 12); ans = R.int(3, 12); a = b * ans; }
      const prompt = `Evaluate: ${a} ${op} ${b}`;
      const opts = mc(ans, [ans + R.int(1, 5), ans - R.int(1, 5), ans + R.int(6, 12)]);
      return {
        topic: "arithmetic", prompt, type: "mc", options: opts, answer: String(ans),
        solution: [`Write the expression: ${a} ${op} ${b}`, `Compute step by step: ${a} ${op} ${b} = ${ans}`, `The result is ${ans}.`],
      };
    },

    fractions(r) {
      const R = asRng(r);
      const op = R.pick(["+", "-", "×", "compare"]);
      if (op === "compare") {
        const a = R.int(1, 5), b = R.int(a + 1, 9);
        const c = R.int(1, 5), d = R.int(c + 1, 9);
        const v1 = a / b, v2 = c / d;
        const ans = v1 > v2 ? ">" : v1 < v2 ? "<" : "=";
        return {
          topic: "fractions", prompt: `Fill in: ${a}/${b}  ___  ${c}/${d}`, type: "mc",
          options: MM.rand.shuffle([">", "<", "="]), answer: ans,
          solution: [`${a}/${b} ≈ ${v1.toFixed(3)}`, `${c}/${d} ≈ ${v2.toFixed(3)}`, `Since ${v1.toFixed(3)} ${ans} ${v2.toFixed(3)}, the symbol is ${ans}.`],
        };
      }
      let a = R.int(1, 5), b = R.int(a + 1, 9);
      let c = R.int(1, 5), d = R.int(c + 1, 9);
      if (op === "+") {
        const f = frac(a * d + c * b, b * d);
        return {
          topic: "fractions", prompt: `Add and simplify: ${a}/${b} + ${c}/${d}`, type: "input", answer: fracStr(f),
          solution: [`Common denominator: ${b}×${d} = ${b * d}`, `Numerator: ${a}×${d} + ${c}×${b} = ${a*d} + ${c*b} = ${a*d+c*b}`, `Result: ${a*d+c*b}/${b*d}, simplified to ${fracStr(f)}.`],
          accept: [fracStr(f)],
        };
      }
      if (op === "-") {
        const f = frac(a * d - c * b, b * d);
        return {
          topic: "fractions", prompt: `Subtract and simplify: ${a}/${b} − ${c}/${d}`, type: "input", answer: fracStr(f),
          solution: [`Common denominator: ${b * d}`, `Numerator: ${a}×${d} − ${c}×${b} = ${a*d} − ${c*b} = ${a*d-c*b}`, `Result: ${fracStr(f)}.`],
          accept: [fracStr(f)],
        };
      }
      const f = frac(a * c, b * d);
      return {
        topic: "fractions", prompt: `Multiply and simplify: ${a}/${b} × ${c}/${d}`, type: "input", answer: fracStr(f),
        solution: [`Multiply numerators: ${a}×${c} = ${a*c}`, `Multiply denominators: ${b}×${d} = ${b*d}`, `Simplify ${a*c}/${b*d} → ${fracStr(f)}.`],
        accept: [fracStr(f)],
      };
    },

    decimals(r) {
      const R = asRng(r);
      const op = R.pick(["+", "×", "convert"]);
      if (op === "convert") {
        const denom = R.pick([10, 100, 1000]);
        const n = R.int(1, denom - 1);
        const dec = (n / denom).toFixed(denom === 10 ? 1 : denom === 100 ? 2 : 3);
        return {
          topic: "decimals", prompt: `Convert ${n}/${denom} to a decimal.`, type: "input", answer: dec,
          solution: [`${n}/${denom} = ${n} ÷ ${denom}`, `${n} ÷ ${denom} = ${dec}`], accept: [dec, String(n / denom)],
        };
      }
      if (op === "+") {
        const a = (R.int(1, 999) / 100), b = (R.int(1, 999) / 100);
        const ans = (a + b).toFixed(2);
        return {
          topic: "decimals", prompt: `Add: ${a.toFixed(2)} + ${b.toFixed(2)}`, type: "input", answer: ans,
          solution: [`Line up decimals: ${a.toFixed(2)} + ${b.toFixed(2)}`, `Sum = ${ans}`], accept: [ans, String(a + b)],
        };
      }
      const a = R.int(2, 9) / 10, b = R.int(2, 9);
      const ans = (a * b).toFixed(2);
      return {
        topic: "decimals", prompt: `Multiply: ${a.toFixed(1)} × ${b}`, type: "input", answer: ans,
        solution: [`${a} × ${b}`, `Move the decimal: ${ans}`], accept: [ans, String(a * b)],
      };
    },

    percentages(r) {
      const R = asRng(r);
      const type = R.pick(["of", "whatPct", "increase"]);
      if (type === "of") {
        const pct = R.pick([10, 20, 25, 30, 40, 50, 75]);
        const base = R.pick([40, 60, 80, 120, 160, 200, 240]);
        const ans = (pct / 100) * base;
        return {
          topic: "percentages", prompt: `What is ${pct}% of ${base}?`, type: "mc",
          options: mc(ans, [ans + base * 0.1, ans - base * 0.1, ans * 2, base - ans].map(Math.round)),
          answer: String(Math.round(ans)),
          solution: [`${pct}% = ${pct / 100}`, `${pct / 100} × ${base} = ${ans}`, `Answer: ${Math.round(ans)}`],
        };
      }
      if (type === "whatPct") {
        const part = R.pick([5, 8, 12, 15, 20, 25]);
        const whole = part * R.pick([2, 4, 5]);
        const ans = Math.round((part / whole) * 100);
        return {
          topic: "percentages", prompt: `${part} is what percent of ${whole}?`, type: "mc",
          options: mc(ans, [ans + 10, ans - 10, 100 - ans, ans * 2]),
          answer: String(ans),
          solution: [`(${part} / ${whole}) × 100`, `= ${(part / whole).toFixed(3)} × 100 = ${ans}%`],
        };
      }
      const oldP = R.pick([50, 80, 100, 120, 200]);
      const inc = R.pick([10, 20, 25, 50]);
      const newP = oldP * (1 + inc / 100);
      return {
        topic: "percentages", prompt: `A price is $${oldP}. After a ${inc}% increase, what is the new price?`, type: "mc",
        options: mc(newP, [oldP + inc, newP + oldP * 0.1, newP - inc, oldP * 2]),
        answer: String(newP),
        solution: [`Increase = ${inc}% of ${oldP} = ${oldP * inc / 100}`, `New price = ${oldP} + ${oldP * inc / 100} = ${newP}`],
      };
    },

    algebra(r) {
      const R = asRng(r);
      const op = R.pick(["simplify", "eval"]);
      if (op === "eval") {
        const x = R.int(1, 9), a = R.int(2, 8), b = R.int(1, 9);
        const ans = a * x + b;
        return {
          topic: "algebra", prompt: `If x = ${x}, evaluate ${a}x + ${b}.`, type: "mc",
          options: mc(ans, [a + x + b, a * x * b, a * x - b, ans + x]),
          answer: String(ans),
          solution: [`Substitute x = ${x}: ${a}(${x}) + ${b}`, `${a * x} + ${b} = ${ans}`],
        };
      }
      const a = R.int(2, 6), b = R.int(2, 6), c = R.int(2, 6);
      const ans = a * b * c;
      return {
        topic: "algebra", prompt: `Simplify: ${a} · ${b}x · ${c}`, type: "mc",
        options: mc(ans + "x", [a * b + "x", a + c + "x", b * c + "x", (a + b + c) + "x"]),
        answer: ans + "x",
        solution: [`Multiply coefficients: ${a} × ${b} × ${c} = ${ans}`, `Variable stays: ${ans}x`],
      };
    },

    equations(r) {
      const R = asRng(r);
      const a = R.int(2, 9), x = R.int(2, 9), b = R.int(1, 12);
      const c = a * x + b;
      const op = R.pick(["linear", "two-step"]);
      if (op === "linear") {
        return {
          topic: "equations", prompt: `Solve for x: ${a}x = ${a * x}`, type: "input", answer: String(x),
          solution: [`Divide both sides by ${a}.`, `x = ${a * x} / ${a} = ${x}`], accept: [String(x)],
        };
      }
      return {
        topic: "equations", prompt: `Solve for x: ${a}x + ${b} = ${c}`, type: "input", answer: String(x),
        solution: [`Subtract ${b}: ${a}x = ${c - b}`, `Divide by ${a}: x = ${(c - b) / a} = ${x}`], accept: [String(x)],
      };
    },

    inequalities(r) {
      const R = asRng(r);
      const a = R.int(2, 6), x = R.int(3, 9), b = R.int(1, 10);
      const c = a * x + b;
      const dir = R.pick([">", "<", "≥", "≤"]);
      const ans = `x ${dir} ${x}`;
      return {
        topic: "inequalities", prompt: `Solve for x: ${a}x + ${b} ${dir} ${c}. Give the solution as "x > n", "x < n", etc.`,
        type: "input",
        answer: ans,
        accept: [ans, `x${dir}${x}`],
        solution: [`Subtract ${b}: ${a}x ${dir} ${c - b}`, `Divide by ${a} (positive, so symbol stays): x ${dir} ${x}`],
      };
    },

    factoring(r) {
      const R = asRng(r);
      // x^2 + bx + c where roots are p, q
      const p = R.int(1, 6) * (R.pick([1, -1])), q = R.int(1, 6) * (R.pick([1, -1]));
      const b = p + q, c = p * q;
      const bStr = b === 0 ? "" : b === 1 ? " + x" : b === -1 ? " − x" : b > 0 ? ` + ${b}x` : ` − ${-b}x`;
      const cStr = c === 0 ? "" : c > 0 ? ` + ${c}` : ` − ${-c}`;
      const root1Str = `(x ${p > 0 ? "+" : "−"} ${Math.abs(p)})`;
      const root2Str = `(x ${q > 0 ? "+" : "−"} ${Math.abs(q)})`;
      const answer = `${root1Str}${root2Str}`;
      const alt = `${root2Str}${root1Str}`;
      return {
        topic: "factoring", prompt: `Factor completely: x²${bStr}${cStr}`,
        type: "input",
        answer,
        accept: [answer, alt, answer.replace(/\s/g, ""), alt.replace(/\s/g, "")],
        solution: [`Find two numbers that multiply to ${c} and add to ${b}: ${p} and ${q}.`, `Write as (x ${p > 0 ? "+" : "−"} ${Math.abs(p)})(x ${q > 0 ? "+" : "−"} ${Math.abs(q)}).`, `Result: ${answer}`],
      };
    },

    expanding(r) {
      const R = asRng(r);
      const a = R.int(1, 6), b = R.int(1, 6), c = R.int(1, 6), d = R.int(1, 6);
      const A = a * c, B = a * d + b * c, C = b * d;
      const clean = `${A}x^2 + ${B}x + ${C}`.replace(/\+ -/g, "- ");
      return {
        topic: "expanding", prompt: `Expand: (${a === 1 ? "" : a}x ${b > 0 ? "+" : "−"} ${b})(${c === 1 ? "" : c}x ${d > 0 ? "+" : "−"} ${d})`,
        type: "input", answer: clean,
        accept: [clean, `${A}x²+${B}x+${C}`, `${A}x^2+${B}x+${C}`],
        solution: [`First: (${a === 1 ? "" : a}x)(${c === 1 ? "" : c}x) = ${A}x²`, `Outer + Inner: ${a * d}x + ${b * c}x = ${B}x`, `Last: ${b}×${d} = ${C}`, `Combine: ${clean}`],
      };
    },

    coordinate(r) {
      const R = asRng(r);
      const op = R.pick(["distance", "midpoint", "slope"]);
      const x1 = R.int(-6, 6), y1 = R.int(-6, 6), x2 = R.int(-6, 6), y2 = R.int(-6, 6);
      if (op === "slope") {
        const dx = x2 - x1, dy = y2 - y1;
        if (dx === 0) return this.coordinate(r);
        const f = frac(dy, dx);
        return {
          topic: "coordinate", prompt: `Find the slope of the line through (${x1}, ${y1}) and (${x2}, ${y2}).`,
          type: "input", answer: fracStr(f),
          accept: [fracStr(f), (dy / dx).toFixed(3), String(dy / dx)],
          solution: [`slope m = (y₂ − y₁) / (x₂ − x₁)`, `= (${y2} − ${y1}) / (${x2} − ${x1}) = ${dy}/${dx}`, `Simplified: ${fracStr(f)}`],
        };
      }
      if (op === "midpoint") {
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        const fm = toFraction(mx), fy = toFraction(my);
        const ans = `(${fracStr(fm)}, ${fracStr(fy)})`;
        return {
          topic: "coordinate", prompt: `Find the midpoint of (${x1}, ${y1}) and (${x2}, ${y2}).`,
          type: "input", answer: ans,
          accept: [ans, `(${mx}, ${my})`, `(${fracStr(fm)},${fracStr(fy)})`],
          solution: [`M = ((x₁+x₂)/2, (y₁+y₂)/2)`, `= ((${x1}+${x2})/2, (${y1}+${y2})/2)`, `= ${ans}`],
        };
      }
      const dx = x2 - x1, dy = y2 - y1;
      const d2 = dx * dx + dy * dy;
      const d = Math.sqrt(d2);
      const pretty = Number.isInteger(d) ? String(d) : `√${d2}`;
      return {
        topic: "coordinate", prompt: `Find the distance between (${x1}, ${y1}) and (${x2}, ${y2}). Give exact form.`,
        type: "input", answer: pretty,
        accept: [pretty, d.toFixed(2), String(d)],
        solution: [`d = √((x₂−x₁)² + (y₂−y₁)²)`, `= √(${dx}² + ${dy}²) = √${d2}`, `= ${pretty}`],
      };
    },

    geometry(r) {
      const R = asRng(r);
      const op = R.pick(["triangle", "circle-area", "circle-circ", "rect", "trapezoid"]);
      if (op === "triangle") {
        const b = R.int(4, 16), h = R.int(3, 14);
        const ans = (b * h) / 2;
        return {
          topic: "geometry", prompt: `A triangle has base ${b} and height ${h}. Find its area.`,
          type: "mc", options: mc(ans, [b * h, b + h, b * h / 4]),
          answer: String(ans),
          solution: [`A = ½ · b · h`, `A = ½ · ${b} · ${h} = ${ans}`],
        };
      }
      if (op === "circle-area") {
        const rad = R.int(2, 12);
        const ans = Math.PI * rad * rad;
        return {
          topic: "geometry", prompt: `Find the area of a circle with radius ${rad}. (Use π ≈ 3.14159, round to 2 decimals.)`,
          type: "input", answer: ans.toFixed(2), accept: [ans.toFixed(2), ans.toFixed(1), String(Math.round(ans))],
          solution: [`A = π r²`, `A = π · ${rad}² = ${rad * rad}π ≈ ${ans.toFixed(2)}`],
        };
      }
      if (op === "circle-circ") {
        const rad = R.int(2, 12);
        const ans = 2 * Math.PI * rad;
        return {
          topic: "geometry", prompt: `Find the circumference of a circle with radius ${rad}. (Round to 2 decimals.)`,
          type: "input", answer: ans.toFixed(2), accept: [ans.toFixed(2), ans.toFixed(1), String(Math.round(ans))],
          solution: [`C = 2π r`, `C = 2π · ${rad} ≈ ${ans.toFixed(2)}`],
        };
      }
      if (op === "rect") {
        const l = R.int(4, 20), w = R.int(3, 15);
        return {
          topic: "geometry", prompt: `A rectangle is ${l} by ${w}. Find its perimeter.`,
          type: "mc", options: mc(2 * (l + w), [l * w, l + w, 4 * (l + w)]),
          answer: String(2 * (l + w)),
          solution: [`P = 2(l + w)`, `P = 2(${l} + ${w}) = ${2 * (l + w)}`],
        };
      }
      const a = R.int(2, 8), b = R.int(a + 1, 12), h = R.int(3, 10);
      const ans = ((a + b) / 2) * h;
      return {
        topic: "geometry", prompt: `A trapezoid has parallel sides ${a} and ${b}, and height ${h}. Find its area.`,
        type: "mc", options: mc(ans, [a * b, (a + b) * h, ans / 2]),
        answer: String(ans),
        solution: [`A = ½(a + b) · h`, `A = ½(${a} + ${b}) · ${h} = ${ans}`],
      };
    },

    statistics(r) {
      const R = asRng(r);
      const op = R.pick(["mean", "median", "range"]);
      const n = R.int(4, 6);
      const data = Array.from({ length: n }, () => R.int(1, 30));
      const sorted = [...data].sort((a, b) => a - b);
      if (op === "mean") {
        const sum = data.reduce((a, b) => a + b, 0);
        const mean = sum / n;
        const ans = Number.isInteger(mean) ? String(mean) : mean.toFixed(2);
        return {
          topic: "statistics", prompt: `Find the mean of: ${data.join(", ")}`,
          type: "input", answer: ans, accept: [ans, mean.toFixed(1), String(mean)],
          solution: [`Sum = ${data.join(" + ")} = ${sum}`, `Mean = ${sum} / ${n} = ${ans}`],
        };
      }
      if (op === "median") {
        const med = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
        const ans = Number.isInteger(med) ? String(med) : med.toFixed(1);
        return {
          topic: "statistics", prompt: `Find the median of: ${data.join(", ")}`,
          type: "input", answer: ans, accept: [ans, String(med)],
          solution: [`Order the data: ${sorted.join(", ")}`, `Middle value = ${ans}`],
        };
      }
      const range = sorted[n - 1] - sorted[0];
      return {
        topic: "statistics", prompt: `Find the range of: ${data.join(", ")}`,
        type: "input", answer: String(range), accept: [String(range)],
        solution: [`Max = ${sorted[n - 1]}, Min = ${sorted[0]}`, `Range = ${sorted[n - 1]} − ${sorted[0]} = ${range}`],
      };
    },

    probability(r) {
      const R = asRng(r);
      const op = R.pick(["dice", "marbles", "coin"]);
      if (op === "dice") {
        const target = R.int(2, 12);
        const ways = countDice(target);
        return {
          topic: "probability", prompt: `Two fair 6-sided dice are rolled. What is the probability the sum is ${target}? Give the simplified fraction.`,
          type: "input", answer: fracStr(frac(ways, 36)),
          accept: [fracStr(frac(ways, 36)), `${ways}/36`, (ways / 36).toFixed(3)],
          solution: [`Count the outcomes that sum to ${target}: ${ways} ways.`, `Total outcomes: 6 × 6 = 36.`, `P = ${ways}/36 = ${fracStr(frac(ways, 36))}`],
        };
      }
      if (op === "coin") {
        const n = R.pick([2, 3]);
        const heads = R.int(0, n);
        const ways = comb(n, heads);
        const tot = Math.pow(2, n);
        return {
          topic: "probability", prompt: `${n} fair coins are flipped. What is the probability of getting exactly ${heads} head${heads === 1 ? "" : "s"}? Simplify.`,
          type: "input", answer: fracStr(frac(ways, tot)),
          accept: [fracStr(frac(ways, tot)), `${ways}/${tot}`, (ways / tot).toFixed(3)],
          solution: [`Ways to choose ${heads} heads from ${n}: C(${n},${heads}) = ${ways}`, `Total outcomes: 2^${n} = ${tot}`, `P = ${ways}/${tot} = ${fracStr(frac(ways, tot))}`],
        };
      }
      const total = R.int(8, 16), red = R.int(2, total - 2);
      const f = frac(red, total);
      return {
        topic: "probability", prompt: `A bag has ${red} red marbles and ${total - red} blue marbles. What is the probability of drawing a red marble? Simplify.`,
        type: "input", answer: fracStr(f),
        accept: [fracStr(f), `${red}/${total}`, (red / total).toFixed(3)],
        solution: [`P(red) = red / total = ${red} / ${total}`, `Simplified: ${fracStr(f)}`],
      };
    },
  };

  function countDice(target) {
    let c = 0;
    for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === target) c++;
    return c;
  }
  function comb(n, k) {
    if (k < 0 || k > n) return 0;
    k = Math.min(k, n - k);
    let r = 1;
    for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
    return Math.round(r);
  }

  /* ---------- Public API ---------- */
  const TOPIC_IDS = Object.keys(GENERATORS);

  function generate(topic, seed) {
    const gen = GENERATORS[topic] || GENERATORS.arithmetic;
    const r = seed != null ? makeRng(seed + Math.floor(Math.random() * 1e6)) : Math.random;
    return gen(r);
  }

  function generateQuiz({ topics, count = 10, seed } = {}) {
    const list = topics && topics.length ? topics : TOPIC_IDS;
    const r = seed != null ? makeRng(seed) : null;
    const out = [];
    for (let i = 0; i < count; i++) {
      const topic = r ? r.pick(list) : rand.pick(list);
      const seed2 = seed != null ? seed + i * 31 : undefined;
      const q = GENERATORS[topic](r || Math.random);
      out.push({ ...q, topic, id: MM.uid("q") });
    }
    return out;
  }

  function generateSet(topic, count) {
    const out = [];
    const seen = new Set();
    let guard = 0;
    while (out.length < count && guard < count * 8) {
      guard++;
      const q = generate(topic);
      const key = q.prompt;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ ...q, id: MM.uid("q") });
    }
    return out;
  }

  MM.math = { generate, generateQuiz, generateSet, topics: TOPIC_IDS, makeRng };
})();
