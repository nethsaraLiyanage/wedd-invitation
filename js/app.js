(function () {
  const stage = document.getElementById("cardStage");
  const seal = document.getElementById("sealBtn");
  const reveal = document.getElementById("cardReveal");
  const resetBtn = document.getElementById("resetBtn");
  const footHint = document.getElementById("footHint");
  const invitationPage = document.getElementById("invitationPage");
  const inviteCloseBtn = document.getElementById("inviteCloseBtn");
  const scrollContinueBtn = document.getElementById("scrollContinueBtn");
  const inviteDetails = document.getElementById("invite-details");

  function setupScrollReveals() {
    const sections = document.querySelectorAll(".reveal-on-scroll");
    if (!sections.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sections.forEach(function (el) {
        el.classList.add("is-inview");
      });
      return;
    }

    document.documentElement.classList.add("motion-reveals");

    function markInView(el) {
      el.classList.add("is-inview");
    }

    function isRoughlyVisible(el) {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return r.width > 0 && r.height > 0 && r.top < vh * 0.92 && r.bottom > 0;
    }

    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            markInView(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -7% 0px", threshold: 0.06 }
    );

    sections.forEach(function (el) {
      if (isRoughlyVisible(el)) {
        markInView(el);
      } else {
        io.observe(el);
      }
    });

    return io;
  }

  let revealObserver = setupScrollReveals();

  function refreshRevealSections() {
    document.querySelectorAll(".reveal-on-scroll:not(.is-inview)").forEach(function (el) {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.width > 0 && r.height > 0 && r.top < vh * 0.88 && r.bottom > 40) {
        el.classList.add("is-inview");
        if (revealObserver) revealObserver.unobserve(el);
      }
    });
  }

  if (!stage || !seal) return;

  function openCard() {
    stage.classList.add("is-open");
    seal.setAttribute("aria-expanded", "true");
    if (reveal) reveal.setAttribute("aria-hidden", "false");
    if (resetBtn) resetBtn.hidden = false;
    if (footHint) footHint.textContent = "Invitation open";
    if (invitationPage) invitationPage.setAttribute("aria-hidden", "false");

    window.setTimeout(function () {
      document.body.classList.add("show-invite-page");
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(refreshRevealSections);
      });
    }, 900);
  }

  function closeCard() {
    stage.classList.remove("is-open");
    seal.setAttribute("aria-expanded", "false");
    if (reveal) reveal.setAttribute("aria-hidden", "true");
    if (resetBtn) resetBtn.hidden = true;
    if (footHint) footHint.textContent = "Tap to reveal";
    if (invitationPage) invitationPage.setAttribute("aria-hidden", "true");
    document.body.classList.remove("show-invite-page");
    seal.focus();
  }

  seal.addEventListener("click", function (e) {
    e.stopPropagation();
    if (!stage.classList.contains("is-open")) openCard();
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", closeCard);
  }

  if (inviteCloseBtn) {
    inviteCloseBtn.addEventListener("click", closeCard);
  }

  if (scrollContinueBtn && inviteDetails) {
    scrollContinueBtn.addEventListener("click", function (e) {
      e.preventDefault();
      inviteDetails.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const cdDays = document.getElementById("cd-days");
  const cdHours = document.getElementById("cd-hours");
  const cdMinutes = document.getElementById("cd-minutes");
  const cdSeconds = document.getElementById("cd-seconds");

  if (cdDays && cdHours && cdMinutes && cdSeconds) {
    // 11 June 2026, 5:00 PM (local) — matches invitation
    const weddingMs = new Date(2026, 5, 11, 17, 0, 0).getTime();

    function pad2(n) {
      return String(n).padStart(2, "0");
    }

    function tick() {
      const now = Date.now();
      let diff = Math.max(0, weddingMs - now);
      const days = Math.floor(diff / 86400000);
      diff -= days * 86400000;
      const hours = Math.floor(diff / 3600000);
      diff -= hours * 3600000;
      const minutes = Math.floor(diff / 60000);
      diff -= minutes * 60000;
      const seconds = Math.floor(diff / 1000);

      cdDays.textContent = String(days);
      cdHours.textContent = pad2(hours);
      cdMinutes.textContent = pad2(minutes);
      cdSeconds.textContent = pad2(seconds);
    }

    tick();
    window.setInterval(tick, 1000);
  }
})();
