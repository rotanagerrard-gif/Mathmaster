/* ===================================================================
   MathMaster — home.js
   Renders the topics grid on the landing page
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});
  const { el } = MM;

  document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("topicsGrid");
    if (!grid) return;

    MM.topics.forEach((t, i) => {
      const lessonCount = MM.lessons.filter((l) => l.topic === t.id).length;
      const card = el("a", {
        class: "card topic-card reveal",
        href: `pages/lessons.html?topic=${t.id}`,
        style: `animation-delay:${i * 40}ms;`,
      });
      card.innerHTML = `
        <div class="glow"></div>
        <div class="ic" style="color:${t.color}; background: ${t.color}22;">${MM.icon(t.icon, 26)}</div>
        <h3>${t.name}</h3>
        <p class="text-sm">${t.desc}</p>
        <div class="meta">
          <span class="badge badge-brand">${lessonCount} lessons</span>
          <span>→</span>
        </div>
      `;
      grid.appendChild(card);
    });

    // re-init reveal observer for newly added nodes
    MM.ui.initReveal();
  });
})();
