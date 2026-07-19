/* ===================================================================
   MathMaster — profile.js
   Public/guest profile. Shows stats + bookmarks + edit form when logged in.
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});
  const { $, el, escapeHtml, fmt } = MM;

  document.addEventListener("DOMContentLoaded", () => {
    const root = $("#profileRoot");
    const user = MM.auth.currentUser();

    if (!user) {
      root.innerHTML = `
        <div class="auth-wrap">
          <div class="auth-card card">
            <div class="head">
              <div class="logo brand">👤</div>
              <h2>Sign in to view your profile</h2>
              <p>Track your progress, bookmarks, and achievements.</p>
            </div>
            <a href="login.html" class="btn btn-primary btn-block btn-lg">Sign In</a>
            <div class="auth-alt">New here? <a href="register.html">Create an account</a></div>
          </div>
        </div>`;
      return;
    }

    const p = MM.store.progress;
    const lp = MM.levelProgress(p.xp);
    const acc = p.questionsAnswered ? Math.round((p.correctAnswers / p.questionsAnswered) * 100) : 0;

    document.title = `${user.name} — MathMaster`;

    root.innerHTML = `
      <div class="page-head">
        <div class="breadcrumb"><a href="../index.html">Home</a><span class="sep">/</span><span>Profile</span></div>
      </div>

      <!-- Profile header -->
      <div class="card reveal">
        <div class="flex items-center gap-5 wrap">
          <div class="avatar" style="width:96px;height:96px;font-size:2.4rem;flex-shrink:0;" id="bigAvatar">
            ${user.avatar ? `<img src="${user.avatar}" alt="" style="width:100%;height:100%;object-fit:cover;">` : escapeHtml((user.name || "U").slice(0,1).toUpperCase())}
          </div>
          <div style="flex:1; min-width: 240px;">
            <div class="flex items-center gap-3 wrap">
              <h1 style="font-size: var(--fs-2xl); margin:0;">${escapeHtml(user.name)}</h1>
              ${user.role === "admin" ? '<span class="badge badge-warning">👑 Admin</span>' : ""}
            </div>
            <p class="text-muted mt-2">${escapeHtml(user.title || "Math Explorer")} · Joined ${fmt.date(user.joinedAt)}</p>
            <p class="mt-2">${escapeHtml(user.bio || "No bio yet. Click edit to add one.")}</p>
            <div class="flex gap-3 wrap mt-4">
              <button class="btn btn-primary btn-sm" id="editBtn">✎ Edit Profile</button>
              <a class="btn btn-ghost btn-sm" href="settings.html">⚙ Settings</a>
              <a class="btn btn-outline btn-sm" href="progress.html">📈 Full Progress</a>
              ${user.role === "admin" ? '<a class="btn btn-outline btn-sm" href="../admin/dashboard.html">🛠 Admin Dashboard</a>' : ""}
            </div>
          </div>
          <div id="miniRing"></div>
        </div>
      </div>

      <!-- Quick stats -->
      <div class="grid grid-4 mt-5">
        <div class="card stat-card"><div class="ic">⭐</div><div class="num gradient-text">Lv ${lp.level}</div><div class="lbl">${fmt.num(p.xp)} XP</div></div>
        <div class="card stat-card"><div class="ic">🔥</div><div class="num">${p.streak}d</div><div class="lbl">Streak</div></div>
        <div class="card stat-card"><div class="ic">🎯</div><div class="num">${acc}%</div><div class="lbl">Accuracy</div></div>
        <div class="card stat-card"><div class="ic">🏅</div><div class="num">${p.achievements.length}</div><div class="lbl">Badges</div></div>
      </div>

      <!-- Tabs -->
      <div class="card mt-5">
        <div class="tabs" role="tablist">
          <button class="tab active" data-tab="bookmarks" role="tab">🔖 Bookmarks</button>
          <button class="tab" data-tab="completed" role="tab">✓ Completed</button>
          <button class="tab" data-tab="badges" role="tab">🏅 Badges</button>
        </div>

        <div class="tab-panel active" id="tab-bookmarks"></div>
        <div class="tab-panel" id="tab-completed"></div>
        <div class="tab-panel" id="tab-badges"></div>
      </div>
    `;

    // mini ring
    $("#miniRing", root).appendChild(MM.ui.ring(lp.pct, 100, 9, `Lv ${lp.level}`));

    // tabs
    root.querySelectorAll(".tab").forEach((t) => {
      t.addEventListener("click", () => {
        root.querySelectorAll(".tab").forEach((x) => x.classList.remove("active"));
        root.querySelectorAll(".tab-panel").forEach((x) => x.classList.remove("active"));
        t.classList.add("active");
        $("#tab-" + t.dataset.tab).classList.add("active");
        MM.sound.play("click");
      });
    });

    renderBookmarks();
    renderCompleted();
    renderBadges();

    function renderBookmarks() {
      const wrap = $("#tab-bookmarks");
      const ids = MM.store.progress.lessonsBookmarked;
      if (!ids.length) {
        wrap.innerHTML = emptyState("🔖", "No bookmarks yet", "Save lessons for later by clicking the bookmark icon.");
        return;
      }
      const grid = el("div", { class: "grid grid-3" });
      ids.map((id) => MM.content.getLesson(id)).filter(Boolean).forEach((l) => grid.appendChild(lessonMini(l)));
      wrap.innerHTML = ""; wrap.appendChild(grid);
    }
    function renderCompleted() {
      const wrap = $("#tab-completed");
      const done = Object.entries(MM.store.progress.lessonsCompleted)
        .filter(([, v]) => v.pct > 0)
        .sort((a, b) => b[1].ts - a[1].ts)
        .map(([id]) => MM.content.getLesson(id))
        .filter(Boolean);
      if (!done.length) {
        wrap.innerHTML = emptyState("📚", "No completed lessons yet", "Finish a lesson to see it here.");
        return;
      }
      const grid = el("div", { class: "grid grid-3" });
      done.forEach((l) => grid.appendChild(lessonMini(l)));
      wrap.innerHTML = ""; wrap.appendChild(grid);
    }
    function renderBadges() {
      const wrap = $("#tab-badges");
      const grid = el("div", { class: "grid grid-4" });
      MM.ACHIEVEMENTS.forEach((a) => {
        const unlocked = MM.store.progress.achievements.includes(a.id);
        const card = el("div", { class: `card ach ${unlocked ? "" : "locked"}` });
        card.innerHTML = `<div class="medal">${a.icon}</div><strong>${escapeHtml(a.name)}</strong><div class="text-xs text-muted">${escapeHtml(a.desc)}</div>${unlocked ? '<span class="badge badge-success">Unlocked</span>' : '<span class="badge">Locked</span>'}`;
        grid.appendChild(card);
      });
      wrap.innerHTML = ""; wrap.appendChild(grid);
    }

    function lessonMini(l) {
      const topic = MM.content.getTopic(l.topic);
      const card = el("a", { class: "card card-flat topic-card", href: `lesson.html?id=${l.id}` });
      card.innerHTML = `
        <span class="badge" style="background:${topic.color}22;color:${topic.color};">${escapeHtml(topic.name)}</span>
        <h3 class="mt-3" style="font-size: var(--fs-base);">${escapeHtml(l.title)}</h3>
        <p class="text-sm">${escapeHtml(l.summary)}</p>
        <div class="text-xs text-muted mt-3">Open →</div>
      `;
      return card;
    }

    function emptyState(ic, title, msg) {
      return `<div class="empty"><div class="ic">${ic}</div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(msg)}</p></div>`;
    }

    // edit modal
    $("#editBtn").addEventListener("click", () => {
      const form = el("div", {});
      form.innerHTML = `
        <div class="field">
          <label>Name</label>
          <input class="input" id="pfName" value="${escapeHtml(user.name)}" />
        </div>
        <div class="field">
          <label>Title</label>
          <input class="input" id="pfTitle" value="${escapeHtml(user.title || "")}" placeholder="e.g. Algebra Enthusiast" />
        </div>
        <div class="field">
          <label>Bio</label>
          <textarea class="textarea" id="pfBio" placeholder="Tell us about yourself...">${escapeHtml(user.bio || "")}</textarea>
        </div>
        <div class="field">
          <label>Avatar — choose a color & initial</label>
          <div class="flex gap-2 wrap" id="avatarColors"></div>
        </div>
      `;
      const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#06b6d4", "#ef4444", "#14b8a6"];
      let chosenColor = colors[0];
      const ac = form.querySelector("#avatarColors");
      colors.forEach((c) => {
        const b = el("button", { class: "avatar", style: `background:${c};width:40px;height:40px;border:2px solid transparent;` }, escapeHtml((user.name || "U").slice(0, 1).toUpperCase()));
        b.addEventListener("click", () => {
          chosenColor = c;
          ac.querySelectorAll(".avatar").forEach((x) => x.style.borderColor = "transparent");
          b.style.borderColor = "var(--text)";
        });
        ac.appendChild(b);
      });

      MM.ui.modal({
        title: "Edit Profile",
        body: form,
        actions: [
          { label: "Cancel", variant: "ghost", onClick: ({ close }) => close() },
          {
            label: "Save", variant: "primary", onClick: ({ close }) => {
              const name = $("#pfName", form).value.trim();
              if (name.length < 2) { MM.toast("Name is too short.", "error"); return; }
              MM.auth.updateProfile({
                name,
                title: $("#pfTitle", form).value.trim(),
                bio: $("#pfBio", form).value.trim(),
                avatarColor: chosenColor,
              });
              MM.toast("Profile updated ✓", "success");
              close();
              setTimeout(() => location.reload(), 600);
            }
          }
        ]
      });
    });

    MM.ui.initReveal();
  });
})();
