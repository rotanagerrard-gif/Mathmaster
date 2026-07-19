/* ===================================================================
   MathMaster — about.js
   Renders team cards and FAQ accordion
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});
  const { $, el, escapeHtml } = MM;

  document.addEventListener("DOMContentLoaded", () => {
    const team = [
      { name: "Dr. Elena Voss", role: "Curriculum Lead", bio: "PhD in Mathematics Education. 15 years teaching.", color: "#6366f1", emoji: "👩‍🏫" },
      { name: "Marcus Chen", role: "Lead Engineer", bio: "Full-stack developer & math enthusiast.", color: "#10b981", emoji: "👨‍💻" },
      { name: "Aisha Patel", role: "UX Designer", bio: "Makes learning feel effortless and delightful.", color: "#ec4899", emoji: "👩‍🎨" },
      { name: "Theo Nakamura", role: "Content Author", bio: "Writes the lessons and crafts every example.", color: "#f59e0b", emoji: "🧑‍✍️" },
    ];
    const teamGrid = $("#teamGrid");
    team.forEach((m, i) => {
      const card = el("div", { class: "card reveal center", style: `animation-delay:${i * 40}ms; text-align:center;` });
      card.innerHTML = `
        <div class="avatar" style="width:72px;height:72px;font-size:2rem;background:linear-gradient(135deg,${m.color},${m.color}88);margin:0 auto var(--sp-3);">${m.emoji}</div>
        <h3 style="font-size: var(--fs-base);">${escapeHtml(m.name)}</h3>
        <div class="badge badge-brand mt-2">${escapeHtml(m.role)}</div>
        <p class="text-sm mt-3">${escapeHtml(m.bio)}</p>
      `;
      teamGrid.appendChild(card);
    });

    const faqs = [
      { q: "Is MathMaster really free?", a: "Yes — completely. There are no subscriptions, no ads, and no premium tiers. All content is available to everyone." },
      { q: "Do I need an account?", a: "No. You can browse lessons and practice without signing up. An account lets you track XP, streaks, and achievements across sessions." },
      { q: "Where is my data stored?", a: "Everything lives locally in your browser (localStorage). We don't run a server and we don't collect your data." },
      { q: "Can teachers use this in class?", a: "Absolutely. The random quiz generator is perfect for creating fresh practice sets, and the admin dashboard lets you manage content." },
      { q: "Does it work offline?", a: "Once the pages are loaded, most features work without an internet connection because everything is client-side." },
      { q: "How are the questions generated?", a: "Each topic has a procedural generator that creates fresh, solvable problems with full step-by-step solutions — so you'll never run out of practice." },
    ];
    const faqList = $("#faqList");
    faqs.forEach((f, i) => {
      const card = el("details", { class: "card reveal", style: `animation-delay:${i * 30}ms; padding: var(--sp-4) var(--sp-5);` });
      card.innerHTML = `
        <summary style="cursor:pointer;font-weight:700;list-style:none;display:flex;align-items:center;justify-content:space-between;gap:var(--sp-3);">
          <span>${escapeHtml(f.q)}</span>
          <span class="badge badge-brand">+</span>
        </summary>
        <p class="mt-3" style="color:var(--text-muted);">${escapeHtml(f.a)}</p>
      `;
      faqList.appendChild(card);
    });

    MM.ui.initReveal();
  });
})();
