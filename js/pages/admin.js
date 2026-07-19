/* ===================================================================
   MathMaster — admin.js
   Admin dashboard: CRUD lessons/questions, manage users, analytics, media
   Requires admin role (redirects otherwise)
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});
  const { $, $$, el, escapeHtml, fmt } = MM;

  const MEDIA_KEY = "mathmaster.media";

  document.addEventListener("DOMContentLoaded", () => {
    // guard: require admin
    if (!MM.auth.isAdmin()) {
      // allow demo admin login flow
      if (!MM.auth.isLoggedIn()) {
        MM.toast("Admin access required. Sign in as admin.", "warning");
        setTimeout(() => (location.href = "../pages/login.html"), 1000);
        return;
      } else {
        MM.toast("Your account doesn't have admin privileges.", "error");
        setTimeout(() => (location.href = "../index.html"), 1500);
        return;
      }
    }

    document.title = "Admin · MathMaster";

    // sidebar navigation
    $$("[data-admin-nav]").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const id = a.dataset.adminNav;
        $$(".admin-section").forEach((s) => s.classList.add("hidden"));
        $("#section-" + id).classList.remove("hidden");
        $$("[data-admin-nav]").forEach((x) => x.classList.remove("active"));
        a.classList.add("active");
        MM.sound.play("click");
        render(id);
      });
    });

    // quick actions
    $$("[data-admin-action]").forEach((b) => {
      b.addEventListener("click", () => handleAction(b.dataset.adminAction));
    });

    render("overview");
    initLessonsAdmin();
    initQuestionsAdmin();
    initUsersAdmin();
    initContentAdmin();
    initMediaAdmin();
  });

  /* ---------- OVERVIEW ---------- */
  function render(section) {
    if (section === "overview") renderOverview();
    if (section === "lessons") renderLessonsTable();
    if (section === "questions") renderQuestions();
    if (section === "users") renderUsers();
    if (section === "analytics") renderAnalytics();
    if (section === "media") renderMedia();
  }

  function renderOverview() {
    const totalLessons = MM.lessons.length + MM.store.custom.lessons.length;
    const totalUsers = MM.store.users.length;
    const totalQ = MM.store.custom.questions.length;
    const totalXP = MM.store.users.reduce((s, u) => s + (u.demoXp || 0), 0) + MM.store.progress.xp;

    $("#overviewStats").innerHTML = `
      ${statCard("📚", totalLessons, "Total Lessons")}
      ${statCard("❓", totalQ + 130, "Custom + Generated Q")}
      ${statCard("👥", totalUsers, "Registered Users")}
      ${statCard("⭐", fmt.compact(totalXP), "Total XP Awarded")}
    `;

    const status = $("#statusList");
    const msgs = JSON.parse(localStorage.getItem("mathmaster.messages") || "[]");
    status.innerHTML = `
      ${statusItem("✅", "All systems operational", "Site is live and loading normally.", "success")}
      ${statusItem("📨", `${msgs.length} contact message${msgs.length === 1 ? "" : "s"}`, "Check contact form submissions.", "info")}
      ${statusItem("💾", `${(new Blob([MM.store.export()]).size / 1024).toFixed(1)} KB storage`, "Local storage usage is healthy.", "success")}
      ${statusItem("🔐", "Demo mode active", "Auth & data are client-side only.", "warning")}
    `;
  }

  function statCard(ic, num, lbl) {
    return `<div class="card stat-card"><div class="ic">${ic}</div><div class="num gradient-text">${num}</div><div class="lbl">${escapeHtml(lbl)}</div></div>`;
  }
  function statusItem(ic, title, sub, type) {
    return `<div class="flex items-center gap-3"><span class="btn-icon" style="width:36px;height:36px;">${ic}</span><div><strong>${escapeHtml(title)}</strong><div class="text-xs text-muted">${escapeHtml(sub)}</div></div><span class="badge badge-${type}" style="margin-left:auto;">${type}</span></div>`;
  }

  /* ---------- LESSONS CRUD ---------- */
  function initLessonsAdmin() {
    const search = $("#lessonSearchInput");
    search?.addEventListener("input", MM.debounce(renderLessonsTable, 200));
  }

  function renderLessonsTable() {
    const body = $("#lessonsAdminBody");
    if (!body) return;
    const q = ($("#lessonSearchInput")?.value || "").toLowerCase().trim();
    const custom = MM.store.custom.lessons;
    const all = [
      ...MM.lessons.map((l) => ({ ...l, _builtin: true })),
      ...custom.map((l) => ({ ...l, _builtin: false })),
    ].filter((l) => !q || (l.title + l.topic + l.summary).toLowerCase().includes(q));

    if (!all.length) {
      body.innerHTML = `<tr><td colspan="5" class="center text-muted" style="padding: var(--sp-6);">No lessons found.</td></tr>`;
      return;
    }
    body.innerHTML = all.map((l) => {
      const topic = MM.content.getTopic(l.topic);
      return `
      <tr>
        <td>
          <strong>${escapeHtml(l.title)}</strong>
          ${l._builtin ? '<span class="badge badge-info" title="Built-in">built-in</span>' : '<span class="badge badge-success">custom</span>'}
          <div class="text-xs text-muted">${escapeHtml(l.summary || "")}</div>
        </td>
        <td><span class="badge" style="background:${topic?.color || "#888"}22;color:${topic?.color || "#888"};">${escapeHtml(topic?.name || l.topic)}</span></td>
        <td><span class="badge badge-${l.difficulty === "Beginner" ? "success" : l.difficulty === "Intermediate" ? "warning" : "danger"}">${l.difficulty || "—"}</span></td>
        <td>${l.minutes || 0}m</td>
        <td>
          <button class="btn btn-ghost btn-sm" onclick="MM.admin.editLesson('${l.id}', ${!l._builtin})">✎ Edit</button>
          ${!l._builtin ? `<button class="btn btn-danger btn-sm" onclick="MM.admin.deleteLesson('${l.id}')">🗑</button>` : `<span class="text-xs text-muted" title="Built-in lessons can't be deleted">locked</span>`}
        </td>
      </tr>`;
    }).join("");
  }

  function editLesson(id, isCustom) {
    const all = [...MM.lessons, ...MM.store.custom.lessons];
    const l = all.find((x) => x.id === id);
    if (!l) return;

    const form = el("div", {});
    form.innerHTML = `
      <div class="field"><label>Title</label><input class="input" id="leTitle" value="${escapeHtml(l.title)}" ${!isCustom ? "readonly" : ""}></div>
      <div class="grid grid-2">
        <div class="field"><label>Topic</label><select class="select" id="leTopic">${MM.topics.map((t) => `<option value="${t.id}" ${t.id === l.topic ? "selected" : ""}>${t.name}</option>`).join("")}</select></div>
        <div class="field"><label>Difficulty</label><select class="select" id="leDiff"><option ${l.difficulty === "Beginner" ? "selected" : ""}>Beginner</option><option ${l.difficulty === "Intermediate" ? "selected" : ""}>Intermediate</option><option ${l.difficulty === "Advanced" ? "selected" : ""}>Advanced</option></select></div>
      </div>
      <div class="field"><label>Minutes</label><input type="number" class="input" id="leMin" value="${l.minutes || 5}"></div>
      <div class="field"><label>Summary</label><textarea class="textarea" id="leSummary" ${!isCustom ? "readonly" : ""}>${escapeHtml(l.summary || "")}</textarea></div>
      ${!isCustom ? '<div class="callout warn"><strong>Read-only</strong>Built-in lessons can be viewed here but only custom lessons are editable. Use "Add New Lesson" to create editable content.</div>' : ""}
    `;

    MM.ui.modal({
      title: `Edit Lesson — ${l.title}`,
      body: form,
      actions: [
        { label: "Cancel", variant: "ghost", onClick: ({ close }) => close() },
        isCustom ? {
          label: "Save Changes", variant: "primary", onClick: ({ close }) => {
            MM.store.updateLesson(id, {
              title: $("#leTitle", form).value,
              topic: $("#leTopic", form).value,
              difficulty: $("#leDiff", form).value,
              minutes: parseInt($("#leMin", form).value, 10),
              summary: $("#leSummary", form).value,
            });
            MM.toast("Lesson updated ✓", "success");
            close(); renderLessonsTable();
          }
        } : { label: "Close", variant: "primary", onClick: ({ close }) => close() },
      ],
    });
  }

  function deleteLesson(id) {
    MM.ui.confirm({
      title: "Delete lesson?", message: "This custom lesson will be permanently removed.", confirmText: "Delete",
    }).then((ok) => {
      if (ok) { MM.store.deleteLesson(id); MM.toast("Lesson deleted", "success"); renderLessonsTable(); }
    });
  }

  function addLesson() {
    const form = el("div", {});
    form.innerHTML = `
      <div class="field"><label>Title</label><input class="input" id="nlTitle" placeholder="e.g. Introduction to Ratios"></div>
      <div class="grid grid-2">
        <div class="field"><label>Topic</label><select class="select" id="nlTopic">${MM.topics.map((t) => `<option value="${t.id}">${t.name}</option>`).join("")}</select></div>
        <div class="field"><label>Difficulty</label><select class="select" id="nlDiff"><option>Beginner</option><option selected>Intermediate</option><option>Advanced</option></select></div>
      </div>
      <div class="field"><label>Minutes</label><input type="number" class="input" id="nlMin" value="6"></div>
      <div class="field"><label>Summary</label><textarea class="textarea" id="nlSummary" placeholder="One-line summary..."></textarea></div>
      <div class="field"><label>Body (one block per line — prefix: h2: p: formula: tip:)</label><textarea class="textarea" id="nlBody" style="min-height:180px;" placeholder="p: Start with the key idea...&#10;h2: The Main Concept&#10;p: Explain in detail...&#10;formula: a + b = c&#10;tip: Remember to..."></textarea></div>
    `;
    MM.ui.modal({
      title: "➕ Add New Lesson", size: "640px", body: form,
      actions: [
        { label: "Cancel", variant: "ghost", onClick: ({ close }) => close() },
        {
          label: "Create Lesson", variant: "primary", onClick: ({ close }) => {
            const title = $("#nlTitle", form).value.trim();
            if (title.length < 3) { MM.toast("Title too short.", "error"); return; }
            const body = parseBodyText($("#nlBody", form).value);
            const lesson = {
              id: MM.uid("cust"),
              title,
              topic: $("#nlTopic", form).value,
              difficulty: $("#nlDiff", form).value,
              minutes: parseInt($("#nlMin", form).value, 10) || 5,
              summary: $("#nlSummary", form).value.trim(),
              body: body.length ? body : [{ type: "p", text: "Lesson content coming soon." }],
            };
            MM.store.addLesson(lesson);
            MM.toast("Lesson created ✓", "success");
            close(); renderLessonsTable();
          }
        }
      ]
    });
  }

  function parseBodyText(text) {
    return text.split("\n").filter(Boolean).map((line) => {
      const m = line.match(/^(\w+):\s*(.*)$/);
      if (!m) return { type: "p", text: line };
      const [, type, txt] = m;
      if (type === "h2" || type === "h3") return { type, text: txt };
      if (type === "formula") return { type: "formula", text: txt };
      if (type === "tip" || type === "warn") return { type: "callout", kind: type, title: "Note", text: txt };
      if (type === "ul") return { type: "ul", items: [txt] };
      return { type: "p", text: txt };
    });
  }

  /* ---------- QUESTIONS CRUD ---------- */
  function initQuestionsAdmin() {
    const filter = $("#qTopicFilter");
    MM.topics.forEach((t) => {
      const o = el("option", { value: t.id }, t.name);
      filter.appendChild(o);
    });
    filter.addEventListener("change", renderQuestions);
  }

  function renderQuestions() {
    const wrap = $("#questionsAdminList");
    if (!wrap) return;
    const topic = $("#qTopicFilter").value;
    const questions = MM.store.custom.questions.filter((q) => !topic || q.topic === topic);

    if (!questions.length) {
      wrap.innerHTML = `<div class="card empty"><div class="ic">❓</div><h3>No custom questions yet</h3><p>Use "New Question" to add your own, or rely on the built-in procedural generator (infinite questions for every topic).</p></div>`;
      return;
    }
    wrap.innerHTML = questions.map((q) => `
      <div class="card">
        <div class="flex items-center justify-between wrap gap-3">
          <div style="flex:1;">
            <div class="flex gap-2 mb-2">
              <span class="badge badge-brand">${escapeHtml(MM.content.getTopic(q.topic)?.name || q.topic)}</span>
              <span class="badge">${q.type === "mc" ? "Multiple choice" : "Text input"}</span>
            </div>
            <strong>${escapeHtml(q.prompt)}</strong>
            <div class="text-sm mt-2">Answer: <code class="kbd">${escapeHtml(q.answer)}</code></div>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-ghost btn-sm" onclick="MM.admin.editQuestion('${q.id}')">✎</button>
            <button class="btn btn-danger btn-sm" onclick="MM.admin.deleteQuestion('${q.id}')">🗑</button>
          </div>
        </div>
      </div>
    `).join("");
  }

  function addQuestion() {
    const form = el("div", {});
    form.innerHTML = `
      <div class="grid grid-2">
        <div class="field"><label>Topic</label><select class="select" id="nqTopic">${MM.topics.map((t) => `<option value="${t.id}">${t.name}</option>`).join("")}</select></div>
        <div class="field"><label>Type</label><select class="select" id="nqType"><option value="mc">Multiple choice</option><option value="input">Text input</option></select></div>
      </div>
      <div class="field"><label>Prompt</label><textarea class="textarea" id="nqPrompt" placeholder="What is 7 × 8?"></textarea></div>
      <div class="field"><label>Correct Answer</label><input class="input" id="nqAnswer" placeholder="56"></div>
      <div class="field"><label>Distractors (comma-separated, for MC)</label><input class="input" id="nqDistractors" placeholder="54, 58, 64"></div>
      <div class="field"><label>Solution steps (one per line)</label><textarea class="textarea" id="nqSteps" placeholder="Multiply 7 by 8&#10;7 × 8 = 56"></textarea></div>
    `;
    MM.ui.modal({
      title: "➕ Add Custom Question", size: "600px", body: form,
      actions: [
        { label: "Cancel", variant: "ghost", onClick: ({ close }) => close() },
        {
          label: "Create", variant: "primary", onClick: ({ close }) => {
            const prompt = $("#nqPrompt", form).value.trim();
            const answer = $("#nqAnswer", form).value.trim();
            if (!prompt || !answer) { MM.toast("Prompt and answer are required.", "error"); return; }
            const type = $("#nqType", form).value;
            const distractors = $("#nqDistractors", form).value.split(",").map((s) => s.trim()).filter(Boolean);
            const steps = $("#nqSteps", form).value.split("\n").filter(Boolean);
            const q = {
              id: MM.uid("cq"),
              topic: $("#nqTopic", form).value,
              type, prompt, answer,
              options: type === "mc" ? MM.rand.shuffle([answer, ...distractors]).slice(0, 4) : undefined,
              accept: [answer],
              solution: steps.length ? steps : [`The answer is ${answer}.`],
            };
            MM.store.addQuestion(q);
            MM.toast("Question created ✓", "success");
            close(); renderQuestions();
          }
        }
      ]
    });
  }

  function editQuestion(id) {
    const q = MM.store.custom.questions.find((x) => x.id === id);
    if (!q) return;
    const form = el("div", {});
    form.innerHTML = `
      <div class="field"><label>Prompt</label><textarea class="textarea" id="eqPrompt">${escapeHtml(q.prompt)}</textarea></div>
      <div class="field"><label>Answer</label><input class="input" id="eqAnswer" value="${escapeHtml(q.answer)}"></div>
      <div class="field"><label>Solution steps (one per line)</label><textarea class="textarea" id="eqSteps">${escapeHtml((q.solution || []).join("\n"))}</textarea></div>
    `;
    MM.ui.modal({
      title: "Edit Question", body: form,
      actions: [
        { label: "Cancel", variant: "ghost", onClick: ({ close }) => close() },
        {
          label: "Save", variant: "primary", onClick: ({ close }) => {
            MM.store.updateQuestion(id, {
              prompt: $("#eqPrompt", form).value,
              answer: $("#eqAnswer", form).value,
              solution: $("#eqSteps", form).value.split("\n").filter(Boolean),
            });
            MM.toast("Question updated ✓", "success");
            close(); renderQuestions();
          }
        }
      ]
    });
  }

  function deleteQuestion(id) {
    MM.ui.confirm({ title: "Delete question?", confirmText: "Delete" }).then((ok) => {
      if (ok) { MM.store.deleteQuestion(id); MM.toast("Question deleted", "success"); renderQuestions(); }
    });
  }

  /* ---------- USERS ---------- */
  function initUsersAdmin() {
    $("#userSearchInput")?.addEventListener("input", MM.debounce(renderUsers, 200));
  }

  function renderUsers() {
    const body = $("#usersAdminBody");
    if (!body) return;
    const q = ($("#userSearchInput")?.value || "").toLowerCase().trim();
    const users = MM.store.users.filter((u) => !q || (u.name + u.email).toLowerCase().includes(q));

    if (!users.length) {
      body.innerHTML = `<tr><td colspan="5" class="center text-muted" style="padding:var(--sp-6);">No users found.</td></tr>`;
      return;
    }
    body.innerHTML = users.map((u) => `
      <tr>
        <td>
          <div class="flex items-center gap-3">
            <span class="avatar" style="width:36px;height:36px;font-size:.9rem;">${escapeHtml((u.name || "U").slice(0,1).toUpperCase())}</span>
            <div><strong>${escapeHtml(u.name)}</strong><div class="text-xs text-muted">${escapeHtml(u.email)}</div></div>
          </div>
        </td>
        <td>
          <select class="select" style="width:auto;padding:6px 10px;" onchange="MM.admin.setUserRole('${u.id}', this.value)">
            <option value="student" ${u.role === "student" ? "selected" : ""}>Student</option>
            <option value="admin" ${u.role === "admin" ? "selected" : ""}>Admin</option>
          </select>
        </td>
        <td class="text-sm text-muted">${fmt.date(u.joinedAt)}</td>
        <td><span class="badge badge-success">Active</span></td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="MM.admin.deleteUser('${u.id}')" ${u.id === MM.auth.currentUser()?.id ? "disabled title='Cannot delete yourself'" : ""}>🗑</button>
        </td>
      </tr>
    `).join("");
  }

  function setUserRole(id, role) {
    MM.store.updateUser(id, { role });
    MM.toast(`User role set to ${role}`, "success");
    renderUsers();
  }
  function deleteUser(id) {
    MM.ui.confirm({ title: "Delete user?", message: "This will permanently remove the user account.", confirmText: "Delete" }).then((ok) => {
      if (ok) {
        const users = MM.store.users.filter((u) => u.id !== id);
        localStorage.setItem("mathmaster.v1", MM.store.export());
        // reload storage
        localStorage.removeItem("mathmaster.v1");
        users.forEach((u) => MM.store.addUser(u));
        MM.toast("User deleted", "success");
        renderUsers(); renderOverview();
      }
    });
  }

  /* ---------- ANALYTICS ---------- */
  function renderAnalytics() {
    const totalUsers = MM.store.users.length;
    const realUsers = MM.store.users.filter((u) => !u.id.startsWith("demo_")).length;
    const totalLessonsDone = Object.keys(MM.store.progress.lessonsCompleted).length;
    const totalAnswers = MM.store.progress.questionsAnswered;
    const avgAccuracy = MM.store.progress.questionsAnswered
      ? Math.round((MM.store.progress.correctAnswers / MM.store.progress.questionsAnswered) * 100) : 0;

    $("#analyticsStats").innerHTML = `
      ${statCard("👥", totalUsers, "Total Users")}
      ${statCard("🎓", realUsers, "Real Accounts")}
      ${statCard("📚", totalLessonsDone, "Lessons Completed")}
      ${statCard("📝", totalAnswers, "Questions Answered")}
      ${statCard("🎯", avgAccuracy + "%", "Avg Accuracy")}
      ${statCard("🏅", MM.store.progress.achievements.length, "Achievements Unlocked")}
    `;

    // topic engagement
    const eng = $("#topicEngagement");
    const stats = MM.store.progress.topicStats;
    const max = Math.max(1, ...Object.values(stats).map((s) => s.attempts));
    eng.innerHTML = MM.topics.map((t) => {
      const s = stats[t.id] || { attempts: 0 };
      const pct = (s.attempts / max) * 100;
      return `<div class="mb-3"><div class="flex justify-between text-sm mb-1"><span>${escapeHtml(t.name)}</span><span class="text-muted">${s.attempts}</span></div><div class="progress sm"><div class="bar" style="width:${pct}%"></div></div></div>`;
    }).join("");

    // recent signups
    const recent = $("#recentSignups");
    const sorted = [...MM.store.users].sort((a, b) => b.joinedAt - a.joinedAt).slice(0, 6);
    recent.innerHTML = sorted.map((u) => `
      <div class="flex items-center justify-between" style="padding: var(--sp-2) 0; border-bottom: 1px solid var(--border);">
        <div class="flex items-center gap-2">
          <span class="avatar" style="width:32px;height:32px;font-size:.8rem;">${escapeHtml((u.name || "U").slice(0,1).toUpperCase())}</span>
          <div><div class="text-sm"><strong>${escapeHtml(u.name)}</strong></div></div>
        </div>
        <span class="text-xs text-muted">${fmt.relTime(u.joinedAt)}</span>
      </div>
    `).join("") || '<div class="text-muted text-sm">No users yet.</div>';
  }

  /* ---------- CONTENT ---------- */
  function initContentAdmin() {
    // load saved announcement
    const saved = JSON.parse(localStorage.getItem("mathmaster.announcement") || "null");
    if (saved) {
      $("#announcementInput").value = saved.text;
      $("#announcementType").value = saved.type;
    }
    $("#siteNameInput").value = localStorage.getItem("mathmaster.siteName") || "MathMaster";

    $("#saveAnnouncement").addEventListener("click", () => {
      const text = $("#announcementInput").value.trim();
      const type = $("#announcementType").value;
      localStorage.setItem("mathmaster.announcement", JSON.stringify({ text, type }));
      MM.toast("Announcement saved ✓ It will show across the site.", "success");
    });
    $("#saveBranding").addEventListener("click", () => {
      localStorage.setItem("mathmaster.siteName", $("#siteNameInput").value.trim());
      MM.toast("Branding saved (demo — reload to apply)", "success");
    });
  }

  /* ---------- MEDIA ---------- */
  function getMedia() { return JSON.parse(localStorage.getItem(MEDIA_KEY) || "[]"); }
  function addMedia(item) {
    const all = getMedia();
    all.unshift(item);
    localStorage.setItem(MEDIA_KEY, JSON.stringify(all.slice(0, 50)));
  }

  function initMediaAdmin() {
    $("#mediaUpload").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        MM.toast("Image too large (max 2MB).", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        addMedia({ id: MM.uid("img"), name: file.name, dataUrl: reader.result, size: file.size, ts: Date.now() });
        MM.toast("Image uploaded ✓", "success");
        MM.sound.play("success");
        renderMedia();
        e.target.value = "";
      };
      reader.readAsDataURL(file);
    });
  }

  function renderMedia() {
    const grid = $("#mediaGrid");
    if (!grid) return;
    const media = getMedia();
    if (!media.length) {
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1;"><div class="ic">🖼️</div><p>No media uploaded yet.</p></div>`;
      return;
    }
    grid.innerHTML = media.map((m) => `
      <div class="card" style="padding: var(--sp-3);">
        <img src="${m.dataUrl}" alt="${escapeHtml(m.name)}" style="width:100%;aspect-ratio:16/10;object-fit:cover;border-radius: var(--radius);background:var(--surface);" loading="lazy" />
        <div class="mt-3">
          <div class="text-sm" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><strong>${escapeHtml(m.name)}</strong></div>
          <div class="text-xs text-muted">${(m.size / 1024).toFixed(1)} KB</div>
          <div class="flex gap-2 mt-2">
            <button class="btn btn-ghost btn-sm btn-block" onclick="navigator.clipboard.writeText('${m.dataUrl}'); MM.toast('Copied image URL','success',1500);">📋 Copy</button>
            <button class="btn btn-danger btn-sm" onclick="MM.admin.deleteMedia('${m.id}')">🗑</button>
          </div>
        </div>
      </div>
    `).join("");
  }

  function deleteMedia(id) {
    const all = getMedia().filter((m) => m.id !== id);
    localStorage.setItem(MEDIA_KEY, JSON.stringify(all));
    MM.toast("Media deleted", "success");
    renderMedia();
  }

  /* ---------- Actions ---------- */
  function handleAction(action) {
    if (action === "add-lesson") addLesson();
    else if (action === "add-question") addQuestion();
    else if (action === "seed-demo") seedDemoContent();
    else if (action === "export") {
      MM.downloadJSON({
        users: MM.store.users,
        progress: MM.store.progress,
        custom: MM.store.custom,
        settings: MM.store.settings,
        media: getMedia(),
      }, "mathmaster-admin-export.json");
      MM.toast("Data exported ✓", "success");
    }
  }

  function seedDemoContent() {
    // add a few sample custom lessons
    const samples = [
      { title: "Speed Math Tricks", topic: "arithmetic", difficulty: "Intermediate", minutes: 7, summary: "Multiply two-digit numbers near 100 in seconds.", body: [{ type: "p", text: "To multiply numbers near 100, use the complement method." }, { type: "formula", text: "98 \\times 97 = (100-2)(100-3)" }, { type: "callout", kind: "tip", title: "Try it", text: "Practice with 96 × 94. The answer is 9024!" }] },
      { title: "Working with Negative Numbers", topic: "arithmetic", difficulty: "Beginner", minutes: 5, summary: "Add, subtract, multiply, and divide with negatives.", body: [{ type: "p", text: "Negative numbers extend the number line to the left of zero." }, { type: "formula", text: "-a \\times -b = +ab" }] },
    ];
    samples.forEach((s) => MM.store.addLesson({ ...s, id: MM.uid("cust") }));
    MM.toast(`Seeded ${samples.length} demo lessons ✓`, "success");
    renderOverview();
    renderLessonsTable();
  }

  /* ---------- Expose for inline handlers ---------- */
  MM.admin = {
    editLesson, deleteLesson, addLesson,
    editQuestion, deleteQuestion, addQuestion,
    setUserRole, deleteUser,
    deleteMedia,
    render,
  };
})();
