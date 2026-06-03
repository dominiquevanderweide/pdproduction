/* Dominique & Petra — shared site behaviours */
(function () {
  "use strict";

  /* Mobile nav toggle */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Scroll reveal — rect-based check (robust across environments) with a
     failsafe so content is never stuck hidden. Probes whether CSS transitions
     actually advance; if they don't (offscreen/throttled iframe), it forces the
     end-state instantly so nothing is ever stuck invisible. */
  function initReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!els.length) return;

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { els.forEach(function (e) { e.classList.add("is-visible"); }); return; }

    function check() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = els.length - 1; i >= 0; i--) {
        var el = els[i];
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) {
          el.classList.add("is-visible");
          els.splice(i, 1);
        }
      }
      if (!els.length) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    }
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; check(); });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    requestAnimationFrame(check);

    /* Probe: do transitions advance here? If not, drop all animation. */
    var probe = document.createElement("div");
    probe.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:2px;height:2px;opacity:0.001;transition:opacity .2s linear;pointer-events:none;";
    document.body.appendChild(probe);
    void probe.offsetWidth;
    probe.style.opacity = "1";
    setTimeout(function () {
      var o = parseFloat(getComputedStyle(probe).opacity);
      probe.parentNode && probe.parentNode.removeChild(probe);
      var advancing = o > 0.05 && o < 0.95; /* mid-transition => animations run */
      if (!advancing) {
        document.documentElement.classList.add("no-anim");
        document.querySelectorAll(".reveal").forEach(function (e) { e.classList.add("is-visible"); });
      }
    }, 90);

    /* Failsafe: nothing should ever remain invisible above the fold. */
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (e) {
        var r = e.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        if (r.top < vh) e.classList.add("is-visible");
      });
    }, 1600);
  }

  /* Current year */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* Video lightbox — any [data-video] opens #video-modal.
     If the trigger has a non-empty data-video (full embed URL), it loads in
     the iframe; otherwise a tasteful "paste your link here" placeholder shows. */
  function initVideoModal() {
    var modal = document.getElementById("video-modal");
    if (!modal) return;
    var frame = modal.querySelector(".video-modal__frame");
    var holder = modal.querySelector(".video-modal__placeholder");
    var titleEl = modal.querySelector(".video-modal__title");
    var lastFocus = null;

    function open(url, title) {
      lastFocus = document.activeElement;
      if (titleEl) titleEl.textContent = title || "Showreel";
      if (url && url.trim()) {
        frame.src = url;
        frame.style.display = "";
        if (holder) holder.style.display = "none";
      } else {
        frame.removeAttribute("src");
        frame.style.display = "none";
        if (holder) holder.style.display = "flex";
      }
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      var btn = modal.querySelector(".video-modal__close");
      if (btn) btn.focus();
    }
    function close() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      frame.removeAttribute("src");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }
    document.querySelectorAll("[data-video]").forEach(function (t) {
      t.addEventListener("click", function (e) {
        e.preventDefault();
        open(t.getAttribute("data-video"), t.getAttribute("data-video-title"));
      });
    });
    modal.querySelectorAll("[data-close]").forEach(function (b) {
      b.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) close();
    });
  }

  function init() { initNav(); initReveal(); initYear(); initVideoModal(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
