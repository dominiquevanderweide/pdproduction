/* Dominique & Petra — lightweight cross-page Tweaks.
   Syncs via localStorage so changes carry across all pages, and responds to the
   host "Tweaks" toolbar toggle (__activate_edit_mode / __deactivate_edit_mode). */
(function () {
  "use strict";

  var KEY = "dp-tweaks-v1";

  var TWEAKS = {
    accent: {
      label: "Accentkleur",
      type: "color",
      value: "#BC5A33",
      options: ["#BC5A33", "#C98A3C", "#A0492B", "#8C7A43"]
    },
    paper: {
      label: "Achtergrond",
      type: "radio",
      value: "#F4EBDD",
      options: [
        { v: "#F4EBDD", l: "Crème" },
        { v: "#EFE7D8", l: "Zand" },
        { v: "#F7F2E9", l: "Warm wit" }
      ]
    },
    display: {
      label: "Koptype",
      type: "radio",
      value: "grotesk",
      options: [
        { v: "grotesk", l: "Grotesk" },
        { v: "editorial", l: "Editorial" }
      ]
    }
  };

  var FONTS = {
    grotesk: '"Bricolage Grotesque", system-ui, sans-serif',
    editorial: '"Bodoni Moda", Georgia, serif'
  };

  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(KEY) || "{}");
      Object.keys(saved).forEach(function (k) { if (TWEAKS[k]) TWEAKS[k].value = saved[k]; });
    } catch (e) {}
  }
  function persist() {
    var out = {};
    Object.keys(TWEAKS).forEach(function (k) { out[k] = TWEAKS[k].value; });
    try { localStorage.setItem(KEY, JSON.stringify(out)); } catch (e) {}
  }

  function apply() {
    var root = document.documentElement.style;
    var accent = TWEAKS.accent.value;
    root.setProperty("--accent", accent);
    root.setProperty("--accent-deep", "color-mix(in srgb, " + accent + " 80%, #000)");
    root.setProperty("--paper", TWEAKS.paper.value);
    root.setProperty("--font-display", FONTS[TWEAKS.display.value] || FONTS.grotesk);
  }

  /* ---------- Panel UI ---------- */
  var panel;
  function buildPanel() {
    panel = document.createElement("div");
    panel.id = "dp-tweaks";
    panel.setAttribute("aria-label", "Tweaks");
    panel.innerHTML =
      '<div class="dpt-head"><span>Tweaks</span><button class="dpt-x" aria-label="Sluiten">&times;</button></div>' +
      '<div class="dpt-body"></div>' +
      '<div class="dpt-foot">Wijzigingen gelden op alle pagina&rsquo;s.</div>';
    var body = panel.querySelector(".dpt-body");

    Object.keys(TWEAKS).forEach(function (key) {
      var t = TWEAKS[key];
      var row = document.createElement("div");
      row.className = "dpt-row";
      row.innerHTML = '<div class="dpt-label">' + t.label + "</div>";

      if (t.type === "color") {
        var sw = document.createElement("div");
        sw.className = "dpt-swatches";
        t.options.forEach(function (c) {
          var b = document.createElement("button");
          b.className = "dpt-sw" + (c === t.value ? " on" : "");
          b.style.background = c;
          b.setAttribute("aria-label", c);
          b.addEventListener("click", function () {
            t.value = c;
            sw.querySelectorAll(".dpt-sw").forEach(function (x) { x.classList.remove("on"); });
            b.classList.add("on");
            apply(); persist();
          });
          sw.appendChild(b);
        });
        row.appendChild(sw);
      } else if (t.type === "radio") {
        var seg = document.createElement("div");
        seg.className = "dpt-seg";
        t.options.forEach(function (o) {
          var b = document.createElement("button");
          b.className = "dpt-segbtn" + (o.v === t.value ? " on" : "");
          b.textContent = o.l;
          b.addEventListener("click", function () {
            t.value = o.v;
            seg.querySelectorAll(".dpt-segbtn").forEach(function (x) { x.classList.remove("on"); });
            b.classList.add("on");
            apply(); persist();
          });
          seg.appendChild(b);
        });
        row.appendChild(seg);
      }
      body.appendChild(row);
    });

    panel.querySelector(".dpt-x").addEventListener("click", function () {
      panel.classList.remove("open");
      try { window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); } catch (e) {}
    });
    document.body.appendChild(panel);
  }

  function open() { if (!panel) buildPanel(); panel.classList.add("open"); }
  function close() { if (panel) panel.classList.remove("open"); }

  /* ---------- Init ---------- */
  load();
  apply();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { /* panel built lazily */ });
  }

  window.addEventListener("message", function (e) {
    var t = e && e.data && e.data.type;
    if (t === "__activate_edit_mode") open();
    else if (t === "__deactivate_edit_mode") close();
  });
  try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch (e) {}
})();
