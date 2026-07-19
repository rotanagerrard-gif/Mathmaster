/* ===================================================================
   MathMaster — auth.js (page handler)
   Handles both login.html and register.html forms
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});
  const { $, escapeHtml } = MM;

  document.addEventListener("DOMContentLoaded", () => {
    // if already logged in, redirect away
    if (MM.auth.isLoggedIn()) {
      MM.toast("You're already signed in.", "info", 1500);
      setTimeout(() => (location.href = MM.ui.navHref("pages/profile.html")), 700);
      return;
    }

    // icons
    const ei = $("#emailIcon"); if (ei) ei.innerHTML = MM.icon("mail");
    const pi = $("#passIcon"); if (pi) pi.innerHTML = MM.icon("user");

    const loginForm = $("#loginForm");
    const registerForm = $("#registerForm");

    /* ---------- LOGIN ---------- */
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        clearErrors();
        const email = $("#email").value;
        const password = $("#password").value;
        const res = MM.auth.login({ email, password });
        if (!res.ok) {
          showErrors(res.errors);
          MM.sound.play("wrong");
          return;
        }
        MM.sound.play("success");
        MM.ui.confetti(50);
        MM.toast(`Welcome back, ${res.user.name}! 👋`, "success");
        setTimeout(() => (location.href = MM.ui.navHref("pages/profile.html")), 900);
      });

      $("#demoBtn")?.addEventListener("click", () => {
        const res = MM.auth.loginDemo("student");
        MM.sound.play("success");
        MM.toast(`Signed in as ${res.user.name}`, "success");
        setTimeout(() => (location.href = MM.ui.navHref("pages/profile.html")), 700);
      });
      $("#demoAdminBtn")?.addEventListener("click", () => {
        const res = MM.auth.loginDemo("admin");
        MM.sound.play("success");
        MM.toast("Signed in as Admin Demo", "success");
        setTimeout(() => (location.href = MM.ui.navHref("pages/profile.html")), 700);
      });
      $("#forgotLink")?.addEventListener("click", (e) => {
        e.preventDefault();
        MM.ui.modal({
          title: "Reset Password",
          body: `<p>This is a demo platform — password reset isn't implemented. Use a demo account or register a new one.</p>`,
          actions: [{ label: "Got it", variant: "primary", onClick: ({ close }) => close() }],
        });
      });
    }

    /* ---------- REGISTER ---------- */
    if (registerForm) {
      // password strength meter
      const pw = $("#password");
      const bar = $("#strengthBar");
      const txt = $("#strengthTxt");
      pw.addEventListener("input", () => {
        const v = pw.value;
        if (!v) { bar.style.display = "none"; txt.textContent = ""; return; }
        bar.style.display = "";
        let score = 0;
        if (v.length >= 6) score++;
        if (v.length >= 10) score++;
        if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
        if (/\d/.test(v)) score++;
        if (/[^A-Za-z0-9]/.test(v)) score++;
        const pct = (score / 5) * 100;
        const fill = bar.querySelector(".bar");
        fill.style.width = pct + "%";
        const labels = ["Very weak", "Weak", "Okay", "Good", "Strong", "Excellent"];
        const colors = ["var(--danger)", "var(--danger)", "var(--warning)", "var(--warning)", "var(--success)", "var(--success)"];
        fill.style.background = colors[score];
        txt.textContent = labels[score];
        txt.style.color = colors[score];
      });

      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        clearErrors();
        const data = {
          name: $("#name").value,
          email: $("#email").value,
          password: $("#password").value,
        };
        const password2 = $("#password2").value;
        const terms = $("#terms").checked;

        if (data.password !== password2) {
          $("#pass2Err").textContent = "Passwords do not match.";
          MM.sound.play("wrong");
          return;
        }
        if (!terms) {
          $("#termsErr").textContent = "Please accept the terms to continue.";
          MM.sound.play("wrong");
          return;
        }
        const res = MM.auth.register(data);
        if (!res.ok) {
          showErrors(res.errors);
          MM.sound.play("wrong");
          return;
        }
        MM.sound.play("success");
        MM.ui.confetti(100);
        MM.toast(`Welcome to MathMaster, ${res.user.name}! 🎉`, "success", 3500);
        setTimeout(() => (location.href = MM.ui.navHref("pages/profile.html")), 1100);
      });

      $("#demoBtn")?.addEventListener("click", () => {
        const res = MM.auth.loginDemo("student");
        MM.toast(`Signed in as ${res.user.name}`, "success");
        setTimeout(() => (location.href = MM.ui.navHref("pages/profile.html")), 700);
      });
    }

    function clearErrors() {
      $$(".field-error").forEach((e) => (e.textContent = ""));
    }
    function showErrors(errors) {
      Object.entries(errors).forEach(([k, v]) => {
        const el = $("#" + (k === "form" ? "formErr" : k + "Err"));
        if (el) el.textContent = v;
        if (k !== "form") MM.toast(v, "error", 2500);
      });
    }
  });
})();
