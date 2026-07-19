/* ===================================================================
   MathMaster — quizzes.js
   Full quiz engine: setup, daily, timer, navigation, exam/instant, results
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});
  const { $, $$, el, escapeHtml, fmt } = MM;

  document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(location.search);
    const setupView = $("#setupView");
    const quizView = $("#quizView");

    // topic chips
    const topicsRow = $("#quizTopics");
    const selectedTopics = new Set();
    MM.topics.forEach((t) => {
      const c = el("button", { class: "chip", "data-topic": t.id }, t.name);
      c.addEventListener("click", () => {
        if (selectedTopics.has(t.id)) { selectedTopics.delete(t.id); c.classList.remove("active"); }
        else { selectedTopics.add(t.id); c.classList.add("active"); }
      });
      topicsRow.appendChild(c);
    });
    // default: pick 3 random
    MM.rand.picks(MM.topics, 3).forEach((t) => {
      selectedTopics.add(t.id);
      topicsRow.querySelector(`[data-topic="${t.id}"]`)?.classList.add("active");
    });

    // preselect topic from URL
    if (params.get("topic")) {
      selectedTopics.clear();
      $$(".chip", topicsRow).forEach((c) => c.classList.remove("active"));
      selectedTopics.add(params.get("topic"));
      topicsRow.querySelector(`[data-topic="${params.get("topic")}"]`)?.classList.add("active");
    }

    // daily challenge state
    const daily = MM.store.getDaily();
    if (daily.completed) {
      $("#dailyBanner").style.opacity = ".7";
      $("#startDailyBtn").textContent = "✓ Done today";
      $("#startDailyBtn").disabled = true;
    }

    // history
    renderHistory();

    // start buttons
    $("#startQuizBtn").addEventListener("click", () => {
      const topics = [...selectedTopics];
      if (!topics.length) { MM.toast("Select at least one topic.", "warning"); return; }
      const count = parseInt($("#quizCount").value, 10);
      const time = parseInt($("#quizTime").value, 10);
      const mode = $("#quizMode").value;
      startQuiz({ topics, count, time, mode });
    });
    $("#startDailyBtn").addEventListener("click", () => {
      startQuiz({ topics: MM.math.topics, count: 5, time: 12, mode: "instant", daily: true });
    });

    // auto-start daily if requested
    if (params.get("mode") === "daily") $("#startDailyBtn").click();

    /* ---------- Quiz engine ---------- */
    function startQuiz(opts) {
      const seed = opts.daily ? MM.store.getDaily().seed : undefined;
      const questions = MM.math.generateQuiz({ topics: opts.topics, count: opts.count, seed });
      const q = {
        ...opts,
        questions,
        idx: 0,
        answers: Array(opts.count).fill(null),   // { value, correct }
        startedAt: Date.now(),
        timePerQ: opts.time,
        timeLeft: opts.time || null,
      };
      setupView.classList.add("hidden");
      quizView.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
      MM.sound.play("start");
      renderQuestion(q);
    }

    let tickTimer = null;
    function startTimer(q) {
      clearInterval(tickTimer);
      if (q.timePerQ === 0) return;
      tickTimer = setInterval(() => {
        q.timeLeft -= 1;
        const t = $(".timer");
        if (t) {
          t.textContent = `⏱ ${fmt.time(q.timeLeft)}`;
          t.classList.toggle("low", q.timeLeft <= 5);
        }
        if (q.timeLeft <= 0) {
          if (q.answers[q.idx] == null) submitAnswer(q, null, true);
          clearInterval(tickTimer);
        }
      }, 1000);
    }

    function renderQuestion(q) {
      q.timeLeft = q.timePerQ || 0;
      quizView.innerHTML = "";
      const card = el("div", { class: "card quiz-card reveal in" });

      // top
      const top = el("div", { class: "quiz-top" });
      top.innerHTML = `
        <div class="flex items-center gap-3 wrap">
          <span class="badge badge-brand">Q ${q.idx + 1}/${q.count}</span>
          <span class="badge">${escapeHtml(MM.content.getTopic(q.questions[q.idx].topic)?.name || "")}</span>
          ${q.daily ? '<span class="badge badge-warning">🗓️ Daily</span>' : ""}
        </div>
        ${q.timePerQ ? `<span class="timer">⏱ ${fmt.time(q.timeLeft)}</span>` : ""}
      `;
      card.appendChild(top);

      // progress + indicators
      const prog = el("div", { class: "progress sm", style: "margin: var(--sp-4) 0;" });
      prog.innerHTML = `<div class="bar" style="width:${((q.idx) / q.count) * 100}%"></div>`;
      card.appendChild(prog);

      const inds = el("div", { class: "q-indicators mb-4" });
      q.questions.forEach((qq, i) => {
        const ind = el("div", { class: "q-ind" + (i === q.idx ? " cur" : q.answers[i] != null ? " done" : ""), title: `Question ${i+1}` }, String(i + 1));
        ind.addEventListener("click", () => { q.idx = i; renderQuestion(q); });
        inds.appendChild(ind);
      });
      card.appendChild(inds);

      // question
      const cur = q.questions[q.idx];
      const qEl = el("div", { class: "quiz-q" });
      qEl.innerHTML = MM.ui.renderMath(cur.prompt);
      card.appendChild(qEl);

      // answer area
      const ansWrap = el("div", { class: "mt-4" });
      const prev = q.answers[q.idx];
      if (cur.type === "mc") {
        const opts = el("div", { class: "options" });
        cur.options.forEach((opt, i) => {
          const o = el("div", { class: "option" + (prev?.value === opt ? " selected" : ""), tabindex: "0", role: "button", "data-opt": opt });
          o.innerHTML = `<span class="key">${String.fromCharCode(65 + i)}</span><span>${MM.ui.renderMath(opt)}</span>`;
          o.addEventListener("click", () => selectMC(opt, o, q));
          opts.appendChild(o);
        });
        ansWrap.appendChild(opts);
        if (q.mode === "instant" && prev) markOptions(opts, cur, prev.value);
      } else {
        const row = el("div", { class: "flex gap-3 wrap" });
        row.innerHTML = `
          <input class="input answer-input" style="max-width:300px;font-size:var(--fs-lg);" placeholder="Your answer…" value="${prev?.value ? escapeHtml(prev.value) : ""}" autocomplete="off" />
          <button class="btn btn-primary submit-btn">${prev ? "Update" : "Submit"}</button>
        `;
        ansWrap.appendChild(row);
        const input = row.querySelector(".answer-input");
        const submit = row.querySelector(".submit-btn");
        submit.addEventListener("click", () => submitAnswer(q, input.value));
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") submitAnswer(q, input.value); });
        setTimeout(() => input.focus(), 80);
        if (q.mode === "instant" && prev) showInlineFeedback(card, cur, prev);
      }
      card.appendChild(ansWrap);

      // inline feedback for instant MC handled in markOptions
      const fb = el("div", { class: "feedback mt-4", id: "qFeedback", style: "min-height:1.5em;font-weight:600;" });
      card.appendChild(fb);

      // foot
      const foot = el("div", { class: "quiz-foot" });
      foot.innerHTML = `
        <button class="btn btn-ghost btn-sm" id="quitBtn">✕ Quit</button>
        <div class="flex gap-2">
          ${q.idx > 0 ? '<button class="btn btn-outline btn-sm" id="prevBtn">← Prev</button>' : ""}
          ${q.idx < q.count - 1
            ? '<button class="btn btn-primary btn-sm" id="nextBtn">Next →</button>'
            : '<button class="btn btn-success btn-sm" id="finishBtn">Finish ✓</button>'}
        </div>
      `;
      card.appendChild(foot);

      quizView.appendChild(card);

      $("#prevBtn", card)?.addEventListener("click", () => { q.idx--; renderQuestion(q); });
      $("#nextBtn", card)?.addEventListener("click", () => { q.idx++; renderQuestion(q); });
      $("#finishBtn", card)?.addEventListener("click", () => finish(q));
      $("#quitBtn", card)?.addEventListener("click", async () => {
        if (await MM.ui.confirm({ title: "Quit quiz?", message: "Your progress on this quiz will be lost.", confirmText: "Quit" })) {
          clearInterval(tickTimer);
          quizView.classList.add("hidden");
          setupView.classList.remove("hidden");
        }
      });

      startTimer(q);
    }

    function selectMC(opt, node, q) {
      if (q.mode === "instant") {
        // lock after answered
        if (q.answers[q.idx] != null) return;
        submitAnswer(q, opt);
        markOptions(node.parentElement, q.questions[q.idx], opt);
      } else {
        // exam mode: just record selection, allow change
        $$(".option", node.parentElement).forEach((o) => o.classList.remove("selected"));
        node.classList.add("selected");
        q.answers[q.idx] = { value: opt, correct: null }; // graded at finish
        clearInterval(tickTimer);
        // auto-advance after a beat
        setTimeout(() => {
          if (q.idx < q.count - 1) { q.idx++; renderQuestion(q); }
        }, 250);
      }
    }

    function markOptions(optsEl, q, chosen) {
      $$(".option", optsEl).forEach((o) => {
        const v = o.dataset.opt;
        o.style.pointerEvents = "none";
        if (String(v).trim() === String(q.answer).trim()) o.classList.add("correct");
        else if (String(v).trim() === String(chosen).trim()) o.classList.add("wrong");
      });
    }

    function submitAnswer(q, value, timedOut = false) {
      const cur = q.questions[q.idx];
      let correct = false;
      if (value == null || !String(value).trim()) {
        correct = false; value = "(no answer)";
      } else if (cur.type === "mc") {
        correct = String(value).trim() === String(cur.answer).trim();
      } else {
        const norm = (s) => String(s).trim().toLowerCase().replace(/\s+/g, "");
        const accept = [cur.answer, ...(cur.accept || [])].map(norm);
        correct = accept.includes(norm(value));
      }
      q.answers[q.idx] = { value: String(value), correct };
      MM.store.recordAnswer(cur.topic, correct);

      clearInterval(tickTimer);

      if (q.mode === "instant") {
        showInlineFeedback(quizView.querySelector(".card"), cur, q.answers[q.idx], timedOut);
        // auto advance
        setTimeout(() => {
          if (q.idx < q.count - 1) { q.idx++; renderQuestion(q); }
          else finish(q);
        }, 1100);
      } else {
        // exam mode auto-advance (MC handled separately); for input, advance now
        if (cur.type === "input") {
          setTimeout(() => {
            if (q.idx < q.count - 1) { q.idx++; renderQuestion(q); }
            else finish(q);
          }, 200);
        }
      }
    }

    function showInlineFeedback(card, q, ans, timedOut) {
      const fb = card.querySelector("#qFeedback");
      if (!fb) return;
      if (timedOut && !ans.value.trim()) {
        fb.innerHTML = `<span class="badge badge-warning">⏰ Time's up!</span> Answer: <strong>${MM.ui.renderMath(q.answer)}</strong>`;
        MM.sound.play("wrong");
        return;
      }
      if (ans.correct) {
        fb.innerHTML = `<span class="badge badge-success">✓ Correct! +10 XP</span>`;
        MM.sound.play("correct");
      } else {
        fb.innerHTML = `<span class="badge badge-danger">✗ ${ans.value === "(no answer)" ? "Skipped" : "Incorrect"}</span> Answer: <strong>${MM.ui.renderMath(q.answer)}</strong>`;
        MM.sound.play("wrong");
      }
    }

    function finish(q) {
      clearInterval(tickTimer);
      // grade exam-mode answers
      let correct = 0;
      q.questions.forEach((qq, i) => {
        const a = q.answers[i];
        if (!a) { q.answers[i] = { value: "(no answer)", correct: false }; return; }
        if (a.correct === null) {
          const c = String(a.value).trim() === String(qq.answer).trim();
          a.correct = c;
        }
        if (a.correct) correct += 1;
      });
      const pct = Math.round((correct / q.count) * 100);
      const elapsed = (Date.now() - q.startedAt) / 1000;
      MM.store.recordQuiz(correct, q.count);
      MM.store.addTime(Math.round(elapsed));

      if (q.daily) {
        const newlyDone = MM.store.completeDaily();
        if (newlyDone) MM.toast("Daily challenge complete! +60 XP 🔥", "success", 3500);
      }

      renderResults(q, correct, pct, elapsed);
    }

    function renderResults(q, correct, pct, elapsed) {
      const xpGained = Math.round((correct / q.count) * 100) + (q.daily ? 60 : 0);
      const grade = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : "F";
      const gradeColor = pct >= 70 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--danger)";
      quizView.innerHTML = "";

      const card = el("div", { class: "card reveal in" });
      card.innerHTML = `
        <div class="result-hero">
          <div class="score-ring"></div>
          <div class="grade" style="color:${gradeColor};">Grade ${grade}</div>
          <h2 class="mt-2">${pct >= 70 ? "Great work! 🎉" : "Keep practicing 💪"}</h2>
          <p class="text-lg mt-2">You answered <strong>${correct}</strong> out of <strong>${q.count}</strong> correctly.</p>
        </div>
        <div class="grid grid-4 mt-5">
          <div class="stat-card"><div class="ic">🎯</div><div class="num gradient-text">${pct}%</div><div class="lbl">Score</div></div>
          <div class="stat-card"><div class="ic">✅</div><div class="num">${correct}</div><div class="lbl">Correct</div></div>
          <div class="stat-card"><div class="ic">⭐</div><div class="num">+${xpGained}</div><div class="lbl">XP</div></div>
          <div class="stat-card"><div class="ic">⏱</div><div class="num">${fmt.time(elapsed)}</div><div class="lbl">Time</div></div>
        </div>
      `;

      // review
      const review = el("div", { class: "mt-6" });
      review.innerHTML = `<h3 class="mb-4">Review</h3>`;
      q.questions.forEach((qq, i) => {
        const a = q.answers[i];
        const item = el("div", { class: "card card-flat", style: "margin-bottom: var(--sp-3); padding: var(--sp-4);" });
        const status = a.correct ? '<span class="badge badge-success">✓</span>' : '<span class="badge badge-danger">✗</span>';
        item.innerHTML = `
          <div class="flex items-center justify-between gap-3 wrap">
            <div style="flex:1;min-width:200px;">
              <div class="text-xs text-muted mb-1">Question ${i + 1}</div>
              <div style="font-weight:600;">${MM.ui.renderMath(qq.prompt)}</div>
            </div>
            ${status}
          </div>
          <div class="mt-3 text-sm">
            <div>Your answer: <strong style="color:${a.correct ? "var(--success)" : "var(--danger)"}">${escapeHtml(a.value)}</strong></div>
            ${!a.correct ? `<div>Correct: <strong style="color:var(--success)">${MM.ui.renderMath(qq.answer)}</strong></div>` : ""}
          </div>
          <details class="mt-3"><summary class="text-xs text-muted" style="cursor:pointer;">Show solution</summary>
            <div class="steps mt-2">
              ${qq.solution.map((s, idx) => `<div class="step" style="animation-delay:${idx * 60}ms;padding-left:var(--sp-7);"><div class="step-body"><p>${MM.ui.renderMath(s)}</p></div></div>`).join("")}
            </div>
          </details>
        `;
        review.appendChild(item);
      });
      card.appendChild(review);

      // actions
      const actions = el("div", { class: "flex gap-3 justify-center wrap mt-5" });
      actions.innerHTML = `
        <button class="btn btn-primary btn-lg" id="newQuizBtn">New Quiz</button>
        <a class="btn btn-ghost btn-lg" href="leaderboard.html">View Leaderboard</a>
        <a class="btn btn-outline btn-lg" href="progress.html">My Progress</a>
      `;
      card.appendChild(actions);

      quizView.appendChild(card);
      const ringEl = card.querySelector(".score-ring");
      ringEl.appendChild(MM.ui.ring(pct / 100, 130, 12));

      if (pct >= 70) { MM.sound.play("success"); MM.ui.confetti(100); }
      else MM.sound.play("fail");

      $("#newQuizBtn").addEventListener("click", () => {
        quizView.classList.add("hidden");
        quizView.innerHTML = "";
        setupView.classList.remove("hidden");
        renderHistory();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    function renderHistory() {
      const wrap = $("#quizHistory");
      const hist = MM.store.progress.history.filter((h) => h.text.includes("Quiz"));
      if (!hist.length) {
        wrap.innerHTML = `<div class="empty"><div class="ic">📋</div><p>No quizzes yet. Take your first one above!</p></div>`;
        return;
      }
      wrap.innerHTML = `
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>Quiz</th><th>When</th></tr></thead>
            <tbody>
              ${hist.slice(0, 8).map((h) => `<tr><td>${escapeHtml(h.text)}</td><td class="text-muted">${fmt.relTime(h.ts)}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>`;
    }
  });
})();
