/* ===================================================================
   MathMaster — exercises.js
   Practice mode: pick topic/count/difficulty, answer, instant feedback,
   step-by-step solution, stats, XP
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});
  const { $, el, escapeHtml, fmt } = MM;

  document.addEventListener("DOMContentLoaded", () => {
    // populate topics
    const topicSelect = $("#topicSelect");
    MM.topics.forEach((t) => {
      const o = el("option", { value: t.id }, `${t.name}`);
      topicSelect.appendChild(o);
    });
    const preTopic = new URLSearchParams(location.search).get("topic");
    if (preTopic && MM.topics.some((t) => t.id === preTopic)) topicSelect.value = preTopic;

    const startBtn = $("#startBtn");
    const surpriseBtn = $("#surpriseBtn");
    const qArea = $("#questionArea");
    const statsStrip = $("#statsStrip");

    let session = null;

    startBtn.addEventListener("click", () => start());
    surpriseBtn.addEventListener("click", () => {
      topicSelect.value = MM.rand.pick(MM.topics).id;
      $("#diffSelect").value = "normal";
      start();
    });

    function start() {
      const topic = topicSelect.value;
      const count = parseInt($("#countSelect").value, 10);
      const diff = $("#diffSelect").value;
      const questions = MM.math.generateSet(topic, count).map((q) => ({ ...q, topic }));
      session = {
        topic, diff, total: count, questions,
        idx: 0, correct: 0, answered: 0, startedAt: Date.now(),
        timeLeft: diff === "speed" ? 60 : null,
      };
      $("#setupCard").scrollIntoView({ behavior: "smooth", block: "start" });
      statsStrip.style.display = "";
      renderStats();
      renderQuestion();
      if (session.timeLeft) startTimer();
    }

    // global timer for elapsed
    let elapsedTimer = null;
    function startTimer() {
      clearInterval(elapsedTimer);
      elapsedTimer = setInterval(() => {
        if (!session) return;
        if (session.timeLeft != null) {
          session.timeLeft -= 1;
          if (session.timeLeft <= 0) { finish(); return; }
          $("#statTime").textContent = fmt.time(session.timeLeft) + " left";
        } else {
          $("#statTime").textContent = fmt.time((Date.now() - session.startedAt) / 1000);
        }
      }, 1000);
    }

    function renderStats() {
      $("#statAns").textContent = session.answered;
      $("#statCorrect").textContent = session.correct;
      $("#statAcc").textContent = session.answered ? Math.round((session.correct / session.answered) * 100) + "%" : "0%";
      if (session.timeLeft == null) $("#statTime").textContent = fmt.time((Date.now() - session.startedAt) / 1000);
    }

    function renderQuestion() {
      const q = session.questions[session.idx];
      qArea.innerHTML = "";
      const card = el("div", { class: "card quiz-card reveal in" });

      // top bar
      const top = el("div", { class: "quiz-top" });
      top.innerHTML = `
        <span class="badge badge-brand">Question ${session.idx + 1} of ${session.total}</span>
        <span class="badge">${escapeHtml(MM.content.getTopic(session.topic)?.name || "")}</span>
      `;
      card.appendChild(top);

      // progress
      const prog = el("div", { class: "progress sm", style: "margin-bottom: var(--sp-5);" });
      prog.innerHTML = `<div class="bar" style="width:${(session.idx / session.total) * 100}%"></div>`;
      card.appendChild(prog);

      // question
      const qEl = el("div", { class: "quiz-q" });
      qEl.innerHTML = MM.ui.renderMath(q.prompt);
      card.appendChild(qEl);

      // answer area
      const ansWrap = el("div", { class: "answer-wrap mt-4" });
      if (q.type === "mc") {
        const opts = el("div", { class: "options" });
        q.options.forEach((opt, i) => {
          const o = el("div", { class: "option", tabindex: "0", role: "button", "data-opt": opt });
          o.innerHTML = `<span class="key">${String.fromCharCode(65 + i)}</span><span>${MM.ui.renderMath(opt)}</span>`;
          o.addEventListener("click", () => selectMC(opt, o));
          o.addEventListener("keydown", (e) => { if (e.key === "Enter") selectMC(opt, o); });
          opts.appendChild(o);
        });
        ansWrap.appendChild(opts);
      } else {
        const row = el("div", { class: "flex gap-3 wrap" });
        row.innerHTML = `
          <input class="input answer-input" style="max-width:280px; font-size: var(--fs-lg);" placeholder="Type your answer…" autocomplete="off" />
          <button class="btn btn-primary submit-btn">Submit</button>
        `;
        ansWrap.appendChild(row);
        const input = row.querySelector(".answer-input");
        const submit = row.querySelector(".submit-btn");
        submit.addEventListener("click", () => submitInput(input.value, ansWrap));
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") submitInput(input.value, ansWrap); });
        setTimeout(() => input.focus(), 100);
      }
      card.appendChild(ansWrap);

      // feedback + steps
      const fb = el("div", { class: "feedback mt-4", style: "min-height: 1.5em; font-weight: 600;" });
      card.appendChild(fb);
      const stepsWrap = el("div", { class: "steps-wrap mt-3 hidden" });
      card.appendChild(stepsWrap);

      // foot
      const foot = el("div", { class: "quiz-foot" });
      foot.innerHTML = `
        <button class="btn btn-ghost btn-sm reveal-sol" ${session.diff === "timed" ? "disabled" : ""}>💡 Show solution</button>
        <button class="btn btn-primary btn-sm next-btn" disabled>Next →</button>
      `;
      card.appendChild(foot);

      qArea.appendChild(card);

      let answered = false;
      function selectMC(opt, node) {
        if (answered) return;
        answered = true;
        const correct = String(opt).trim() === String(q.answer).trim();
        $$(".option", card).forEach((o) => {
          const v = o.dataset.opt;
          if (String(v).trim() === String(q.answer).trim()) o.classList.add("correct");
          else if (o === node) o.classList.add("wrong");
          o.style.pointerEvents = "none";
        });
        handleAnswer(correct);
      }
      function submitInput(val, wrap) {
        if (answered) return;
        answered = true;
        const norm = (s) => String(s).trim().toLowerCase().replace(/\s+/g, "");
        const accept = [q.answer, ...(q.accept || [])].map(norm);
        const correct = !!val.trim() && accept.includes(norm(val));
        const input = wrap.querySelector(".answer-input");
        input.disabled = true;
        wrap.querySelector(".submit-btn").disabled = true;
        if (correct) input.style.borderColor = "var(--success)";
        else input.style.borderColor = "var(--danger)";
        handleAnswer(correct);
      }

      function handleAnswer(correct) {
        session.answered += 1;
        if (correct) session.correct += 1;
        MM.store.recordAnswer(session.topic, correct);
        if (correct) {
          fb.innerHTML = `<span class="badge badge-success">✓ Correct! +10 XP</span>`;
          MM.sound.play("correct");
        } else {
          fb.innerHTML = `<span class="badge badge-danger">✗ Not quite.</span> The answer is <strong>${MM.ui.renderMath(q.answer)}</strong>`;
          MM.sound.play("wrong");
        }
        // show steps
        showSteps();
        $(".next-btn", card).disabled = false;
        $(".reveal-sol", card).textContent = "Solution shown ↓";
        renderStats();
      }

      function showSteps() {
        stepsWrap.innerHTML = `<div class="text-xs text-muted mb-2" style="font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Step-by-step</div>`;
        const ol = el("div", { class: "steps" });
        q.solution.forEach((s, i) => {
          const st = el("div", { class: "step", style: `animation-delay:${i * 100}ms;` });
          st.innerHTML = `<div class="step-body"><p>${MM.ui.renderMath(s)}</p></div>`;
          ol.appendChild(st);
        });
        stepsWrap.appendChild(ol);
        stepsWrap.classList.remove("hidden");
      }

      $(".reveal-sol", card).addEventListener("click", (e) => {
        if (e.target.disabled) return;
        if (!answered) {
          // revealing without answering counts as a miss
          answered = true;
          session.answered += 1;
          handleAnswer(false);
        }
      });
      $(".next-btn", card).addEventListener("click", () => {
        if (session.idx + 1 >= session.total) finish();
        else { session.idx += 1; renderQuestion(); }
      });

      // keyboard shortcuts
      function keyHandler(e) {
        if (e.target.tagName === "INPUT") return;
        if (e.key.toLowerCase() === "n" && !$(".next-btn", card).disabled) {
          $(".next-btn", card).click();
          document.removeEventListener("keydown", keyHandler);
        }
      }
      document.addEventListener("keydown", keyHandler);
    }

    function finish() {
      clearInterval(elapsedTimer);
      const pct = session.total ? Math.round((session.correct / session.total) * 100) : 0;
      MM.store.recordQuiz(session.correct, session.total);
      const xpGained = Math.round((session.correct / session.total) * 100);
      qArea.innerHTML = "";
      const card = el("div", { class: "card reveal in center", style: "padding: var(--sp-7);" });
      card.innerHTML = `
        <div class="result-hero">
          <div class="score-ring" style="margin: 0 auto var(--sp-4);"></div>
          <h2>Practice complete! 🎉</h2>
          <p class="text-lg mt-2">You scored <strong>${session.correct} / ${session.total}</strong></p>
        </div>
        <div class="grid grid-3 mt-5">
          <div class="stat-card"><div class="ic">🎯</div><div class="num gradient-text">${pct}%</div><div class="lbl">Accuracy</div></div>
          <div class="stat-card"><div class="ic">⭐</div><div class="num">+${xpGained}</div><div class="lbl">XP earned</div></div>
          <div class="stat-card"><div class="ic">⏱</div><div class="num">${fmt.time((Date.now() - session.startedAt) / 1000)}</div><div class="lbl">Time</div></div>
        </div>
        <div class="flex gap-3 justify-center wrap mt-5">
          <button class="btn btn-primary btn-lg" id="againBtn">Practice Again</button>
          <a class="btn btn-ghost btn-lg" href="quizzes.html?topic=${session.topic}">Take a Quiz</a>
          <a class="btn btn-outline" href="lessons.html?topic=${session.topic}">Review Lessons</a>
        </div>
      `;
      qArea.appendChild(card);
      const ringEl = card.querySelector(".score-ring");
      ringEl.appendChild(MM.ui.ring(pct / 100, 130, 12));
      if (pct >= 70) { MM.sound.play("success"); MM.ui.confetti(80); }
      else MM.sound.play("fail");

      $("#againBtn").addEventListener("click", start);
      statsStrip.style.display = "none";
    }
  });
})();
