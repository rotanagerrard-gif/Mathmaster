/* ===================================================================
   MathMaster — lesson.js
   Renders a single lesson, blocks, step-by-step examples, mark complete
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});
  const { $, el, escapeHtml } = MM;

  document.addEventListener("DOMContentLoaded", () => {
    const id = new URLSearchParams(location.search).get("id");
    const lesson = MM.content.getLesson(id);

    const body = $("#lessonBody");
    const aside = $("#lessonAside");

    if (!lesson) {
      body.innerHTML = `
        <div class="empty">
          <div class="ic">🔍</div>
          <h2>Lesson not found</h2>
          <p>This lesson may have been moved or deleted.</p>
          <a href="lessons.html" class="btn btn-primary mt-4">Back to Lessons</a>
        </div>`;
      aside.style.display = "none";
      return;
    }

    const topic = MM.content.getTopic(lesson.topic);
    document.title = `${lesson.title} — MathMaster`;
    $("#crumbTopic").textContent = topic?.name || "Topic";

    // build body
    const frag = document.createDocumentFragment();
    frag.appendChild(el("div", { class: "flex items-center gap-3 wrap", style: "margin-bottom: var(--sp-4);" },
      el("span", { class: "badge", style: `background:${topic.color}22;color:${topic.color};` }, topic?.name || ""),
      el("span", { class: "badge badge-brand" }, lesson.difficulty),
      el("span", { class: "badge" }, `⏱ ${lesson.minutes} min`)
    ));
    frag.appendChild(el("h1", {}, lesson.title));
    frag.appendChild(el("p", { class: "text-lg", style: "margin-bottom: var(--sp-5);" }, lesson.summary));

    lesson.body.forEach((block) => frag.appendChild(renderBlock(block)));

    const foot = el("div", { class: "flex gap-3 wrap mt-6", style: "border-top: 1px solid var(--border); padding-top: var(--sp-5);" });
    foot.appendChild(el("a", { class: "btn btn-ghost", href: "lessons.html" }, "← All Lessons"));
    foot.appendChild(el("a", { class: "btn btn-outline", href: `exercises.html?topic=${lesson.topic}` }, "Practice this topic"));
    foot.appendChild(el("button", { class: "btn btn-primary", id: "markCompleteBtn" }, "Mark as Complete ✓"));
    frag.appendChild(foot);
    body.innerHTML = "";
    body.appendChild(frag);

    // aside
    const prog = MM.store.progress.lessonsCompleted[lesson.id]?.pct || 0;
    const bookmarked = MM.store.progress.lessonsBookmarked.includes(lesson.id);
    aside.innerHTML = "";

    const progressCard = el("div", { class: "card" });
    progressCard.innerHTML = `<h4 style="font-size: var(--fs-sm); text-transform: uppercase; letter-spacing:.08em; color: var(--text-muted); margin-bottom: var(--sp-3);">Your Progress</h4>
      <div class="flex items-center gap-4">
        <div id="progRing"></div>
        <div>
          <div style="font-size: var(--fs-xl); font-weight: 800;">${prog}%</div>
          <div class="text-xs text-muted">${prog > 0 ? "Completed" : "Not started"}</div>
        </div>
      </div>`;
    aside.appendChild(progressCard);
    const ringWrap = $("#progRing", progressCard);
    ringWrap.appendChild(MM.ui.ring(prog / 100, 90, 9));

    // bookmark + complete actions in aside
    const actionsCard = el("div", { class: "card flex-col gap-3" });
    actionsCard.innerHTML = `
      <button class="btn btn-ghost btn-block" id="bookmarkBtn">${bookmarked ? "🔖 Bookmarked" : "🏷️ Bookmark"}</button>
      <button class="btn btn-primary btn-block" id="completeBtn2">${prog >= 100 ? "✓ Completed" : "Mark Complete"}</button>
    `;
    aside.appendChild(actionsCard);

    // related lessons
    const related = MM.content.lessonsByTopic(lesson.topic).filter((l) => l.id !== lesson.id).slice(0, 4);
    if (related.length) {
      const rel = el("div", { class: "card" });
      rel.innerHTML = `<h4 style="font-size: var(--fs-sm); text-transform: uppercase; letter-spacing:.08em; color: var(--text-muted); margin-bottom: var(--sp-3);">More in ${escapeHtml(topic.name)}</h4>`;
      related.forEach((r) => {
        const a = el("a", { class: "flex items-center justify-between mt-3", href: `lesson.html?id=${r.id}`, style: "color: var(--text-muted);" });
        a.innerHTML = `<span>${escapeHtml(r.title)}</span><span>→</span>`;
        rel.appendChild(a);
      });
      aside.appendChild(rel);
    }

    // wire actions
    function markComplete() {
      MM.store.completeLesson(lesson.id, 100);
      MM.sound.play("success");
      MM.ui.confetti(60);
      MM.toast("Lesson completed! +50 XP", "success");
      setTimeout(() => location.reload(), 900);
    }
    $("#markCompleteBtn").addEventListener("click", markComplete);
    $("#completeBtn2").addEventListener("click", markComplete);
    $("#bookmarkBtn").addEventListener("click", (e) => {
      const on = !MM.store.progress.lessonsBookmarked.includes(lesson.id);
      MM.store.bookmarkLesson(lesson.id, on);
      e.target.textContent = on ? "🔖 Bookmarked" : "🏷️ Bookmark";
      MM.toast(on ? "Bookmarked 🔖" : "Bookmark removed", "success", 1500);
    });

    MM.ui.initReveal();
  });

  function renderBlock(block) {
    switch (block.type) {
      case "h2": return el("h2", {}, block.text);
      case "h3": return el("h3", {}, block.text);
      case "p": { const p = el("p"); p.innerHTML = MM.ui.renderMath(block.text); return p; }
      case "formula": {
        const f = el("div", { class: "formula" });
        f.innerHTML = MM.ui.renderMath(block.text);
        return f;
      }
      case "ul": return el("ul", { class: "mt-2" }, ...block.items.map((i) => { const li = el("li"); li.innerHTML = MM.ui.renderMath(i); return li; }));
      case "ol": return el("ol", { class: "mt-2" }, ...block.items.map((i) => { const li = el("li"); li.innerHTML = MM.ui.renderMath(i); return li; }));
      case "callout": return el("div", { class: `callout ${block.kind || ""}` }, el("strong", {}, block.title || "Note"), el("span", { html: MM.ui.renderMath(block.text) }));
      case "example": return renderExample(block);
      default: return el("p", {}, "");
    }
  }

  function renderExample(block) {
    const wrap = el("div", { class: "card card-flat mt-4", style: "background: var(--surface);" });
    wrap.innerHTML = `
      <div class="flex items-center gap-2 mb-3">
        <span class="badge badge-info">Example</span>
        <span class="text-xs text-muted">Try first, then reveal steps</span>
      </div>
      <div class="quiz-q" style="font-size: var(--fs-lg);">${MM.ui.renderMath(block.q)}</div>
      <div class="flex items-center gap-3 mt-3">
        <input class="input answer-input" style="max-width:240px;" placeholder="Your answer…" />
        <button class="btn btn-primary btn-sm check-btn">Check</button>
        <button class="btn btn-ghost btn-sm reveal-btn">Reveal steps</button>
      </div>
      <div class="feedback mt-3" style="min-height: 1em; font-weight: 600;"></div>
      <div class="steps-wrap mt-3 hidden"></div>
    `;
    const input = wrap.querySelector(".answer-input");
    const checkBtn = wrap.querySelector(".check-btn");
    const revealBtn = wrap.querySelector(".reveal-btn");
    const feedback = wrap.querySelector(".feedback");
    const stepsWrap = wrap.querySelector(".steps-wrap");

    function showSteps() {
      stepsWrap.innerHTML = "";
      const ol = el("div", { class: "steps" });
      block.steps.forEach((s, i) => {
        const st = el("div", { class: "step", style: `animation-delay:${i * 120}ms;` });
        st.innerHTML = `<div class="step-body"><p>${MM.ui.renderMath(s)}</p></div>`;
        ol.appendChild(st);
      });
      stepsWrap.appendChild(ol);
      stepsWrap.classList.remove("hidden");
      revealBtn.textContent = "Hide steps";
    }
    function hideSteps() { stepsWrap.classList.add("hidden"); revealBtn.textContent = "Reveal steps"; }

    checkBtn.addEventListener("click", () => {
      const val = String(input.value).trim().replace(/\s+/g, "").toLowerCase();
      const ans = String(block.a).trim().replace(/\s+/g, "").toLowerCase();
      const correct = val && (val === ans || compareNum(val, ans));
      if (correct) {
        feedback.innerHTML = `<span class="badge badge-success">✓ Correct!</span> The answer is ${MM.ui.renderMath(block.a)}.`;
        MM.sound.play("correct");
        showSteps();
      } else if (!val) {
        feedback.innerHTML = `<span class="badge badge-warning">Enter an answer first</span>`;
      } else {
        feedback.innerHTML = `<span class="badge badge-danger">✗ Not quite. Try again or reveal the steps.</span>`;
        MM.sound.play("wrong");
      }
    });
    revealBtn.addEventListener("click", () => {
      if (stepsWrap.classList.contains("hidden")) { showSteps(); MM.sound.play("pop"); }
      else hideSteps();
    });
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") checkBtn.click(); });

    return wrap;
  }

  function compareNum(a, b) {
    const x = parseFloat(a.replace(/[^\d.\-/]/g, "")), y = parseFloat(b.replace(/[^\d.\-/]/g, ""));
    if (isNaN(x) || isNaN(y)) return false;
    return Math.abs(x - y) < 1e-6;
  }
})();
