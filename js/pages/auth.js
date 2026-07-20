/* ===================================================================
   MathMaster — auth.js (page handler)
   Handles both login.html and register.html forms
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});
  const { $, $$, escapeHtml } = MM;

  function goToProfile() {
    const dest =
      MM.ui && typeof MM.ui.navHref === "function"
        ? MM.ui.navHref("pages/profile.html")
        : "profile.html";
    window.location.replace(dest);
  }

  function safePlay(name) {
    try {
      if (MM.sound && MM.sound.play) MM.sound.play(name);
    } catch (_) {}
  }

  function safeConfetti(n) {
    try {
      if (MM.ui && MM.ui.confetti) MM.ui.confetti(n);
    } catch (_) {}
  }

  function safeToast(msg, type, ms) {
    try {
      if (MM.toast) MM.toast(msg, type, ms);
      else if (MM.ui && MM.ui.toast) MM.ui.toast(msg, type, ms);
    } catch (_) {}
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (MM.auth && MM.auth.isLoggedIn()) {
      safeToast("You're already signed in.", "info", 1500);
      setTimeout(goToProfile, 500);
      return;
    }

    try {
      const ei = $("#emailIcon");
      if (ei && MM.icon) ei.innerHTML = MM.icon("mail");
      const pi = $("#passIcon");
      if (pi && MM.icon) pi.innerHTML = MM.icon("user");
    } catch (_) {}

    const loginForm = $("#loginForm");
    const registerForm = $("#registerForm");

    /* ---------- LOGIN ---------- */
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearErrors();
        const email = ($("#email") || {}).value || "";
        const password = ($("#password") || {}).value || "";
        let res;
        try {
          res = MM.auth.login({ email, password });
        } catch (err) {
          console.error("login error", err);
          safeToast("Login failed. Please try again.", "error");
          return;
        }
        if (!res || !res.ok) {
          showErrors((res && res.errors) || { form: "Login failed." });
          safePlay("wrong");
          return;
        }
        safePlay("success");
        safeConfetti(50);
        safeToast(`Welcome back, ${res.user.name}! 👋`, "success");
        setTimeout(goToProfile, 700);
      });

      $("#demoBtn")?.addEventListener("click", () => {
        try {
          const res = MM.auth.loginDemo("student");
          safePlay("success");
          safeToast(`Signed in as ${res.user.name}`, "success");
          setTimeout(goToProfile, 500);
        } catch (err) {
          console.error(err);
          safeToast("Demo login failed.", "error");
        }
      });
      $("#demoAdminBtn")?.addEventListener("click", () => {
        try {
          MM.auth.loginDemo("admin");
          safePlay("success");
          safeToast("Signed in as Admin Demo", "success");
          setTimeout(goToProfile, 500);
        } catch (err) {
          console.error(err);
          safeToast("Demo login failed.", "error");
        }
      });
      $("#forgotLink")?.addEventListener("click", (e) => {
        e.preventDefault();
        if (MM.ui && MM.ui.modal) {
          MM.ui.modal({
            title: "Reset Password",
            body: `<p>This is a demo platform — password reset isn't implemented. Use a demo account or register a new one.</p>`,
            actions: [{ label: "Got it", variant: "primary", onClick: ({ close }) => close() }],
          });
        }
      });
    }

    /* ---------- REGISTER ---------- */
    if (registerForm) {
      const pw = $("#password");
      const bar = $("#strengthBar");
      const txt = $("#strengthTxt");
      if (pw && bar && txt) {
        pw.addEventListener("input", () => {
          const v = pw.value;
          if (!v) {
            bar.style.display = "none";
            txt.textContent = "";
            return;
          }
          bar.style.display = "";
          let score = 0;
          if (v.length >= 6) score++;
          if (v.length >= 10) score++;
          if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
          if (/\d/.test(v)) score++;
          if (/[^A-Za-z0-9]/.test(v)) score++;
          const pct = (score / 5) * 100;
          const colors = [
            "var(--danger)",
            "var(--danger)",
            "var(--warning)",
            "var(--warning)",
            "var(--success)",
            "var(--success)",
          ];
          const labels = ["Very weak", "Weak", "Okay", "Good", "Strong", "Excellent"];
          const fill = bar.querySelector(".bar");
          if (fill) {
            fill.style.width = pct + "%";
            fill.style.background = colors[score];
          }
          txt.textContent = labels[score];
          txt.style.color = colors[score];
        });
      }

      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearErrors();

        const data = {
          name: ($("#name") || {}).value || "",
          email: ($("#email") || {}).value || "",
          password: ($("#password") || {}).value || "",
        };
        const password2 = ($("#password2") || {}).value || "";
        const termsEl = $("#terms");
        const terms = termsEl ? !!termsEl.checked : false;

        if (data.password !== password2) {
          const el = $("#pass2Err");
          if (el) el.textContent = "Passwords do not match.";
          safePlay("wrong");
          safeToast("Passwords do not match.", "error");
          return;
        }
        if (!terms) {
          const el = $("#termsErr");
          if (el) el.textContent = "Please accept the terms to continue.";
          safePlay("wrong");
          safeToast("Please accept the terms to continue.", "error");
          return;
        }

        let res;
        try {
          res = MM.auth.register(data);
        } catch (err) {
          console.error("register error", err);
          safeToast("Registration failed. Please try again.", "error");
          return;
        }

        if (!res || !res.ok) {
          showErrors((res && res.errors) || { form: "Registration failed." });
          safePlay("wrong");
          return;
        }

        // SUCCESS — session already set inside MM.auth.register()
        safePlay("success");
        safeConfetti(80);
        safeToast(`Welcome to MathMaster, ${res.user.name}! 🎉`, "success", 3000);
        setTimeout(goToProfile, 600);
      });

      $("#demoBtn")?.addEventListener("click", () => {
        try {
          const res = MM.auth.loginDemo("student");
          safeToast(`Signed in as ${res.user.name}`, "success");
          setTimeout(goToProfile, 500);
        } catch (err) {
          console.error(err);
          safeToast("Demo login failed.", "error");
        }
      });
    }

    function clearErrors() {
      try {
        if ($$) $$(".field-error").forEach((e) => (e.textContent = ""));
        else document.querySelectorAll(".field-error").forEach((e) => (e.textContent = ""));
      } catch (_) {}
    }

    function showErrors(errors) {
      if (!errors) return;
      const idMap = {
        form: "formErr",
        name: "nameErr",
        email: "emailErr",
        password: "passErr",
        password2: "pass2Err",
        terms: "termsErr",
      };
      Object.entries(errors).forEach(([k, v]) => {
        const id = idMap[k] || k + "Err";
        const node = document.getElementById(id);
        if (node) node.textContent = v;
        if (k !== "form") safeToast(v, "error", 2800);
      });
    }
  });
})();
