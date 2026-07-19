/* ===================================================================
   MathMaster — contact.js
   Validates contact form, simulates submission, stores messages locally
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});
  const { $ } = MM;

  document.addEventListener("DOMContentLoaded", () => {
    const form = $("#contactForm");
    const msg = $("#cMessage");
    const count = $("#charCount");

    msg.addEventListener("input", () => {
      if (msg.value.length > 1000) msg.value = msg.value.slice(0, 1000);
      count.textContent = msg.value.length;
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors();
      const data = {
        name: $("#cName").value.trim(),
        email: $("#cEmail").value.trim(),
        subject: $("#cSubject").value,
        message: msg.value.trim(),
        consent: $("#cConsent").checked,
      };
      let valid = true;
      if (data.name.length < 2) { $("#cNameErr").textContent = "Please enter your name."; valid = false; }
      if (!MM.auth.validateEmail(data.email)) { $("#cEmailErr").textContent = "Enter a valid email."; valid = false; }
      if (data.message.length < 10) { $("#cMessageErr").textContent = "Message must be at least 10 characters."; valid = false; }
      if (!data.consent) { $("#cConsentErr").textContent = "Please provide consent."; valid = false; }
      if (!valid) { MM.sound.play("wrong"); return; }

      // simulate async submission
      const btn = form.querySelector("button[type=submit]");
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Sending...';
      MM.sound.play("whoosh");

      setTimeout(() => {
        // store message locally (demo)
        const msgs = JSON.parse(localStorage.getItem("mathmaster.messages") || "[]");
        msgs.push({ ...data, ts: Date.now() });
        localStorage.setItem("mathmaster.messages", JSON.stringify(msgs));

        btn.innerHTML = orig;
        btn.disabled = false;
        form.reset();
        count.textContent = "0";
        MM.sound.play("success");
        MM.ui.confetti(40);
        MM.ui.modal({
          title: "✅ Message sent!",
          body: `<p>Thanks, <strong>${data.name}</strong>! We've received your message and will get back to you at <strong>${data.email}</strong> within 1–2 business days.</p><p class="mt-3 text-sm text-muted">(Demo: your message was saved locally and no email was actually sent.)</p>`,
          actions: [{ label: "Done", variant: "primary", onClick: ({ close }) => close() }],
        });
      }, 1100);
    });

    function clearErrors() {
      $$(".field-error").forEach((e) => (e.textContent = ""));
    }
  });
})();
