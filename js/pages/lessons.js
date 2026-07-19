/* ===================================================================
   MathMaster — lessons.js
   Lessons listing: search, topic filter, bookmark, completion status
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});
  const { el, $, $$, escapeHtml } = MM;

  document.addEventListener("DOMContentLoaded", () => {
    // inject search icon
    const ics = $("#searchIconSlot");
    if (ics) ics.innerHTML = MM.icon("search");

    const params = new URLSearchParams(location.search);
    const initialTopic = params.get("topic");
    const initialQuery = params.get("q") || "";

    const searchInput = $("#lessonSearch");
    if (searchInput) searchInput.value = initialQuery;

    const state = { topic: initialTopic || "all", q: initialQuery, bookmarksOnly: false, completedOnly: false };

    // build topic chips
    const chipsRow = $("#topicChips");
    function chip(label, value) {
      const c = el("button", { class: "chip" + (state.topic === value ? " active" : ""), role: "tab", "aria-selected": state.topic === value ? "true" : "false" }, label);
      c.addEventListener("click", () => {
        state.topic = value;
        $$(".chip", chipsRow).forEach((x, i) => {
          const active = (i === 0 && value === "all") || (i > 0 && MM.topics[i - 1].id === value);
          x.classList.toggle("active", active);
          x.setAttribute("aria-selected", active ? "true" : "false");
        });
        MM.sound.play("click");
        render();
      });
      return c;
    }
    chipsRow.appendChild(chip("All Topics", "all"));
    MM.topics.forEach((t) => chipsRow.appendChild(chip(t.name, t.id)));

    // filter toggles
    $("#bookmarkFilter").addEventListener("click", (e) => {
      state.bookmarksOnly = !state.bookmarksOnly;
      e.target.classList.toggle("active", state.bookmarksOnly);
      render();
    });
    $("#completedFilter").addEventListener("click", (e) => {
      state.completedOnly = !state.completedOnly;
      e.target.classList.toggle("active", state.completedOnly);
      render();
    });
    $("#resetFilters").addEventListener("click", () => {
      state.topic = "all"; state.q = ""; state.bookmarksOnly = false; state.completedOnly = false;
      if (searchInput) searchInput.value = "";
      $$(".chip", chipsRow).forEach((x, i) => { const a = i === 0; x.classList.toggle("active", a); x.setAttribute("aria-selected", a); });
      $("#bookmarkFilter").classList.remove("active");
      $("#completedFilter").classList.remove("active");
      render();
    });

    // search input
    if (searchInput) {
      searchInput.addEventListener("input", MM.debounce((e) => {
        state.q = e.target.value;
        render();
      }, 180));
    }

    function filtered() {
      const q = state.q.toLowerCase().trim();
      return MM.lessons.filter((l) => {
        if (state.topic !== "all" && l.topic !== state.topic) return false;
        if (state.bookmarksOnly && !MM.store.progress.lessonsBookmarked.includes(l.id)) return false;
        if (state.completedOnly && !(MM.store.progress.lessonsCompleted[l.id]?.pct > 0)) return false;
        if (q) {
          const topic = MM.content.getTopic(l.topic)?.name.toLowerCase() || "";
          const hay = (l.title + " " + l.summary + " " + topic + " " + l.topic).toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
    }

    const resultsEl = $("#lessonsResults");
    const emptyEl = $("#emptyState");

    function render() {
      const list = filtered();
      resultsEl.innerHTML = "";
      if (!list.length) { emptyEl.classList.remove("hidden"); return; }
      emptyEl.classList.add("hidden");

      // group by topic
      const grouped = {};
      list.forEach((l) => { (grouped[l.topic] = grouped[l.topic] || []).push(l); });

      Object.keys(grouped).forEach((topicId) => {
        const topic = MM.content.getTopic(topicId);
        if (!topic) return;
        const section = el("section", { class: "mt-6" });
        section.innerHTML = `
          <div class="flex items-center gap-3 mb-4">
            <span class="ic" style="display:inline-grid;place-items:center;width:38px;height:38px;border-radius:10px;background:${topic.color}22;color:${topic.color};">${MM.icon(topic.icon, 22)}</span>
            <h2 style="font-size: var(--fs-xl);">${escapeHtml(topic.name)}</h2>
            <span class="badge badge-brand">${grouped[topicId].length}</span>
          </div>
        `;
        const grid = el("div", { class: "grid grid-3" });
        grouped[topicId].forEach((l) => grid.appendChild(lessonCard(l, topic)));
        section.appendChild(grid);
        resultsEl.appendChild(section);
      });

      MM.ui.initReveal();
    }

    function lessonCard(l, topic) {
      const prog = MM.store.progress.lessonsCompleted[l.id]?.pct || 0;
      const bookmarked = MM.store.progress.lessonsBookmarked.includes(l.id);
      const diffColor = l.difficulty === "Beginner" ? "success" : l.difficulty === "Intermediate" ? "warning" : "danger";
      const card = el("article", { class: "card reveal topic-card", tabindex: "0" });
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="badge badge-${diffColor}">${l.difficulty}</span>
          <button class="btn-icon" style="width:34px;height:34px;" data-bookmark="${l.id}" aria-label="${bookmarked ? "Remove bookmark" : "Bookmark lesson"}" title="Bookmark">
            ${bookmarked ? "🔖" : "🏷️"}
          </button>
        </div>
        <h3 class="mt-3" style="font-size: var(--fs-lg);">${escapeHtml(l.title)}</h3>
        <p class="text-sm">${escapeHtml(l.summary)}</p>
        <div class="progress sm mt-4"><div class="bar" style="width:${prog}%"></div></div>
        <div class="flex items-center justify-between mt-3 text-xs text-muted">
          <span>⏱ ${l.minutes} min</span>
          <span>${prog > 0 ? prog + "% done" : "Not started"}</span>
        </div>
        <a href="lesson.html?id=${l.id}" class="btn btn-ghost btn-sm btn-block mt-4">Open Lesson →</a>
      `;
      card.querySelector("[data-bookmark]").addEventListener("click", (e) => {
        e.stopPropagation();
        const isOn = MM.store.progress.lessonsBookmarked.includes(l.id);
        MM.store.bookmarkLesson(l.id, !isOn);
        MM.toast(isOn ? "Bookmark removed" : "Lesson bookmarked 🔖", "success", 1800);
        render();
      });
      return card;
    }

    render();
  });
})();
