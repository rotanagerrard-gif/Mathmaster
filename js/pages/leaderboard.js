/* ===================================================================
   MathMaster — leaderboard.js
   Builds ranked leaderboard from users + current user, with podium + table
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});
  const { $, $$, el, escapeHtml, fmt } = MM;

  document.addEventListener("DOMContentLoaded", () => {
    let sortKey = "xp";

    function entries() {
      const me = MM.auth.currentUser();
      const myXP = MM.store.progress.xp;
      const list = MM.store.users
        .filter((u) => !u.pass || u.demoXp != null || (me && u.id === me.id))
        .map((u) => {
          const isMe = me && u.id === me.id;
          return {
            id: u.id,
            name: isMe ? (u.name + " (You)") : u.name,
            avatar: u.avatar,
            xp: isMe ? myXP : (u.demoXp || 0),
            streak: isMe ? MM.store.progress.streak : (u.demoStreak || 0),
            lessons: isMe ? Object.keys(MM.store.progress.lessonsCompleted).length : MM.rand.int(2, 25),
            correct: isMe ? MM.store.progress.correctAnswers : MM.rand.int(20, 800),
            answered: isMe ? MM.store.progress.questionsAnswered : MM.rand.int(40, 1000),
            isMe,
          };
        });
      // ensure current user is in the list
      if (me && !list.some((e) => e.id === me.id)) {
        list.push({
          id: me.id, name: me.name + " (You)", avatar: me.avatar,
          xp: myXP, streak: MM.store.progress.streak,
          lessons: Object.keys(MM.store.progress.lessonsCompleted).length,
          correct: MM.store.progress.correctAnswers,
          answered: MM.store.progress.questionsAnswered,
          isMe: true,
        });
      }
      return list;
    }

    function acc(e) { return e.answered ? Math.round((e.correct / e.answered) * 100) : 0; }

    function ranked() {
      const key = sortKey === "accuracy" ? (e) => acc(e)
        : sortKey === "streak" ? (e) => e.streak
        : sortKey === "lessons" ? (e) => e.lessons
        : (e) => e.xp;
      return entries().sort((a, b) => key(b) - key(a));
    }

    function render() {
      const list = ranked();
      renderPodium(list);
      renderTable(list);
    }

    function medal(emoji, color, size) {
      return { emoji, color, size };
    }

    function renderPodium(list) {
      const podium = $("#podium");
      podium.innerHTML = "";
      const top3 = list.slice(0, 3);
      const order = [1, 0, 2]; // visual order: 2nd, 1st, 3rd
      const styles = {
        0: { medal: "🥇", color: "#f59e0b", h: 200, label: "1st" },
        1: { medal: "🥈", color: "#94a3b8", h: 160, label: "2nd" },
        2: { medal: "🥉", color: "#cd7f32", h: 130, label: "3rd" },
      };
      order.forEach((idx) => {
        const e = top3[idx];
        const s = styles[idx];
        if (!e) { podium.appendChild(el("div")); return; }
        const card = el("div", { class: "card reveal in center", style: `padding: var(--sp-5); border-color:${s.color}55;` });
        card.innerHTML = `
          <div style="font-size: 3rem; line-height:1;">${s.medal}</div>
          <div class="avatar mt-3" style="width:56px;height:56px;background:linear-gradient(135deg,${s.color},${s.color}88);font-size:1.4rem;">${e.avatar ? `<img src="${e.avatar}" alt="" style="width:100%;height:100%;object-fit:cover;">` : escapeHtml(e.name.slice(0,1).toUpperCase())}</div>
          <h3 class="mt-3" style="font-size: var(--fs-base);">${escapeHtml(e.name)}</h3>
          <div class="gradient-text mt-2" style="font-size: var(--fs-2xl); font-weight:800;">${fmt.compact(e.xp)}</div>
          <div class="text-xs text-muted">XP · Lv ${MM.levelFromXP(e.xp)}</div>
          <div class="badge mt-3" style="background:${s.color}22;color:${s.color};">${s.label}</div>
        `;
        podium.appendChild(card);
      });
    }

    function renderTable(list) {
      const body = $("#boardBody");
      body.innerHTML = "";
      list.forEach((e, i) => {
        const rank = i + 1;
        const rankCls = rank <= 3 ? ` rank rank-${rank}` : "";
        const tr = el("tr", { class: e.isMe ? "me" : "" });
        if (e.isMe) tr.style.background = "var(--brand-grad-soft)";
        tr.innerHTML = `
          <td><span class="rank${rankCls}">${rank}</span></td>
          <td>
            <div class="flex items-center gap-3">
              <span class="avatar" style="width:34px;height:34px;font-size:.9rem;">${e.avatar ? `<img src="${e.avatar}" alt="" style="width:100%;height:100%;object-fit:cover;">` : escapeHtml(e.name.slice(0,1).toUpperCase())}</span>
              <div>
                <strong>${escapeHtml(e.name)}</strong>
                ${e.isMe ? '<div class="text-xs text-muted">Your rank</div>' : ""}
              </div>
            </div>
          </td>
          <td><span class="badge badge-brand">Lv ${MM.levelFromXP(e.xp)}</span></td>
          <td><strong>${fmt.num(e.xp)}</strong></td>
          <td>🔥 ${e.streak}d</td>
          <td>${acc(e)}%</td>
        `;
        body.appendChild(tr);
      });
    }

    // sort chips
    $$(".chip[data-sort]").forEach((c) => {
      c.addEventListener("click", () => {
        $$(".chip[data-sort]").forEach((x) => x.classList.remove("active"));
        c.classList.add("active");
        sortKey = c.dataset.sort;
        render();
        MM.sound.play("click");
      });
    });

    render();
  });
})();
