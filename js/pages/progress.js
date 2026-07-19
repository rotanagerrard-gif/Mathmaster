/* ===================================================================
   MathMaster — progress.js
   Dashboard: XP/level, stats, topic mastery bars, heatmap, achievements
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});
  const { $, el, escapeHtml, fmt } = MM;

  document.addEventListener("DOMContentLoaded", () => {
    const p = MM.store.progress;
    const lp = MM.levelProgress(p.xp);

    // ---- Level card ----
    const levelCard = $("#levelCard");
    levelCard.innerHTML = `
      <div class="flex items-center gap-5 wrap">
        <div id="levelRing"></div>
        <div style="flex:1; min-width:240px;">
          <div class="flex items-center gap-3 wrap">
            <span class="badge badge-brand" style="font-size: var(--fs-sm);">Level ${lp.level}</span>
            <span class="text-muted text-sm">${fmt.num(p.xp)} XP total</span>
          </div>
          <h2 class="mt-3" style="font-size: var(--fs-2xl);">${fmt.compact(lp.next)} XP <span class="text-muted" style="font-size: var(--fs-base);">for Level ${lp.level + 1}</span></h2>
          <div class="progress lg mt-3"><div class="bar" style="width:${lp.pct * 100}%"></div></div>
          <div class="text-xs text-muted mt-2">${fmt.num(lp.into)} / ${fmt.num(lp.span)} XP · ${Math.round(lp.pct * 100)}% to next level</div>
        </div>
      </div>
    `;
    $("#levelRing", levelCard).appendChild(MM.ui.ring(lp.pct, 110, 10, `Lv ${lp.level}`));

    // ---- Stat cards ----
    const acc = p.questionsAnswered ? Math.round((p.correctAnswers / p.questionsAnswered) * 100) : 0;
    const stats = [
      { ic: "🔥", num: `${p.streak}d`, lbl: "Current Streak" },
      { ic: "✅", num: fmt.num(p.correctAnswers), lbl: "Correct Answers" },
      { ic: "📝", num: fmt.num(p.questionsAnswered), lbl: "Questions Answered" },
      { ic: "🎯", num: `${acc}%`, lbl: "Overall Accuracy" },
      { ic: "📚", num: Object.keys(p.lessonsCompleted).length, lbl: "Lessons Completed" },
      { ic: "🧠", num: fmt.num(p.quizzesTaken), lbl: "Quizzes Taken" },
      { ic: "⏱", num: fmt.time(p.timeSpent), lbl: "Time Practicing" },
      { ic: "🏅", num: `${p.achievements.length}/${MM.ACHIEVEMENTS.length}`, lbl: "Achievements" },
    ];
    const statGrid = $("#statCards");
    stats.forEach((s, i) => {
      const card = el("div", { class: "card stat-card reveal", style: `animation-delay:${i * 30}ms;` });
      card.innerHTML = `<div class="ic">${s.ic}</div><div class="num gradient-text">${s.num}</div><div class="lbl">${s.lbl}</div>`;
      statGrid.appendChild(card);
    });

    // ---- Two columns: topic mastery + heatmap ----
    const twoCol = $("#twoCol");

    const masteryCard = el("div", { class: "card reveal" });
    masteryCard.innerHTML = `<h3 style="margin-bottom: var(--sp-4);">📊 Topic Mastery</h3><div id="masteryList"></div>`;
    const mList = el("div", { class: "flex-col gap-4" });
    MM.topics.forEach((t) => {
      const s = p.topicStats[t.id] || { attempts: 0, correct: 0 };
      const pct = s.attempts ? Math.round((s.correct / s.attempts) * 100) : 0;
      const row = el("div", {}, `
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span style="color:${t.color};">${MM.icon(t.icon, 18)}</span>
            <strong style="font-size: var(--fs-sm);">${escapeHtml(t.name)}</strong>
          </div>
          <span class="text-xs text-muted">${s.correct}/${s.attempts} · ${pct}%</span>
        </div>
        <div class="progress sm"><div class="bar" style="width:${pct}%; background: ${pct >= 70 ? "var(--success)" : pct >= 40 ? "var(--warning)" : "var(--danger)"};"></div></div>
      `);
      mList.appendChild(row);
    });
    masteryCard.querySelector("#masteryList").appendChild(mList);

    const heatCard = el("div", { class: "card reveal" });
    heatCard.innerHTML = `<h3 style="margin-bottom: var(--sp-4);">🗓️ Activity (last 26 weeks)</h3><div id="heatmap" class="heatmap"></div>
      <div class="flex items-center gap-2 mt-3 text-xs text-muted">
        <span>Less</span>
        <span class="heat-cell" style="width:12px;height:12px;"></span>
        <span class="heat-cell l1" style="width:12px;height:12px;"></span>
        <span class="heat-cell l2" style="width:12px;height:12px;"></span>
        <span class="heat-cell l3" style="width:12px;height:12px;"></span>
        <span class="heat-cell l4" style="width:12px;height:12px;"></span>
        <span>More</span>
      </div>
      <div class="mt-4 pt-4" style="border-top: 1px solid var(--border);">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-muted">Current streak</div>
            <div style="font-size: var(--fs-2xl); font-weight:800;">🔥 ${p.streak} <span style="font-size: var(--fs-base);" class="text-muted">days</span></div>
          </div>
          <div class="text-right">
            <div class="text-xs text-muted">Active days</div>
            <div style="font-size: var(--fs-2xl); font-weight:800;">${Object.keys(p.activity).length}</div>
          </div>
        </div>
      </div>`;
    // build heatmap cells
    const heat = heatCard.querySelector("#heatmap");
    const today = new Date();
    const totalCells = 26 * 7;
    for (let i = totalCells - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const count = p.activity[key] || 0;
      const lvl = count === 0 ? "" : count <= 2 ? "l1" : count <= 5 ? "l2" : count <= 10 ? "l3" : "l4";
      const cell = el("div", { class: `heat-cell ${lvl}`, title: `${key}: ${count} activities` });
      heat.appendChild(cell);
    }

    twoCol.appendChild(masteryCard);
    twoCol.appendChild(heatCard);

    // ---- Achievements ----
    const achGrid = $("#achievementsGrid");
    MM.ACHIEVEMENTS.forEach((a, i) => {
      const unlocked = p.achievements.includes(a.id);
      const card = el("div", { class: `card ach reveal ${unlocked ? "" : "locked"}`, style: `animation-delay:${i * 30}ms;` });
      card.innerHTML = `
        <div class="medal">${a.icon}</div>
        <strong>${escapeHtml(a.name)}</strong>
        <div class="text-xs text-muted">${escapeHtml(a.desc)}</div>
        ${unlocked ? '<span class="badge badge-success">Unlocked</span>' : '<span class="badge">Locked</span>'}
      `;
      achGrid.appendChild(card);
    });

    // ---- History ----
    const histList = $("#historyList");
    if (!p.history.length) {
      histList.innerHTML = `<div class="empty"><div class="ic">📭</div><p>No activity yet. Complete a lesson or take a quiz to get started!</p></div>`;
    } else {
      const ol = el("div", { class: "flex-col gap-2" });
      p.history.slice(0, 20).forEach((h) => {
        const row = el("div", { class: "flex items-center justify-between gap-3", style: "padding: var(--sp-2) 0; border-bottom: 1px solid var(--border);" });
        row.innerHTML = `<span>${escapeHtml(h.text)}</span><span class="text-xs text-muted">${fmt.relTime(h.ts)}</span>`;
        ol.appendChild(row);
      });
      histList.appendChild(ol);
    }

    MM.ui.initReveal();
  });
})();
