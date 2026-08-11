/* Kinderhaus St. Suso — Interaktionen */
(function () {
  "use strict";

  /* ---------- Sticky Header ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile-Navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    var backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    document.body.appendChild(backdrop);

    var setNav = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      backdrop.classList.toggle("is-visible", open);
      document.body.style.overflow = open ? "hidden" : "";
    };

    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    backdrop.addEventListener("click", function () {
      setNav(false);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNav(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1080) setNav(false);
    });
  }

  /* ---------- Einblenden beim Scrollen ---------- */
  var revealables = document.querySelectorAll(".reveal");
  if (revealables.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      revealables.forEach(function (el) {
        io.observe(el);
      });
    } else {
      revealables.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }

  /* ---------- Zahlen hochzählen ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          cio.unobserve(el);
          var target = parseInt(el.getAttribute("data-count"), 10);
          var suffix = el.getAttribute("data-suffix") || "";
          var start = performance.now();
          var dur = 1100;
          var step = function (now) {
            var p = Math.min((now - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) {
      cio.observe(el);
    });
  }

  /* ---------- Galerie-Lightbox ---------- */
  var gallery = document.querySelector("[data-gallery]");
  if (gallery) {
    var items = Array.prototype.slice.call(gallery.querySelectorAll("button"));
    var index = 0;

    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Bildansicht");
    box.innerHTML =
      '<button class="lightbox__btn lightbox__close" aria-label="Schließen">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<button class="lightbox__btn lightbox__prev" aria-label="Vorheriges Bild">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<button class="lightbox__btn lightbox__next" aria-label="Nächstes Bild">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button>' +
      '<figure style="margin:0;max-width:100%"><img alt=""><figcaption class="lightbox__caption"></figcaption></figure>';
    document.body.appendChild(box);

    var lbImg = box.querySelector("img");
    var lbCap = box.querySelector(".lightbox__caption");
    var lastFocus = null;

    var show = function (i) {
      index = (i + items.length) % items.length;
      var src = items[index].getAttribute("data-full") || items[index].querySelector("img").src;
      var alt = items[index].querySelector("img").alt || "";
      lbImg.src = src;
      lbImg.alt = alt;
      lbCap.textContent = alt + " (" + (index + 1) + " / " + items.length + ")";
    };
    var open = function (i) {
      lastFocus = document.activeElement;
      show(i);
      box.classList.add("is-open");
      document.body.style.overflow = "hidden";
      box.querySelector(".lightbox__close").focus();
    };
    var close = function () {
      box.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };

    items.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        open(i);
      });
    });
    box.querySelector(".lightbox__close").addEventListener("click", close);
    box.querySelector(".lightbox__prev").addEventListener("click", function () {
      show(index - 1);
    });
    box.querySelector(".lightbox__next").addEventListener("click", function () {
      show(index + 1);
    });
    box.addEventListener("click", function (e) {
      if (e.target === box) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
  }

  /* ---------- Tabs (Grundrisse) ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (group) {
    var buttons = Array.prototype.slice.call(group.querySelectorAll("[role='tab']"));
    var select = function (id) {
      buttons.forEach(function (b) {
        var active = b.getAttribute("aria-controls") === id;
        b.setAttribute("aria-selected", String(active));
        b.tabIndex = active ? 0 : -1;
        var panel = document.getElementById(b.getAttribute("aria-controls"));
        if (panel) panel.hidden = !active;
      });
    };
    buttons.forEach(function (b, i) {
      b.addEventListener("click", function () {
        select(b.getAttribute("aria-controls"));
      });
      b.addEventListener("keydown", function (e) {
        var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        var next = buttons[(i + dir + buttons.length) % buttons.length];
        next.focus();
        select(next.getAttribute("aria-controls"));
      });
    });
  });

  /* ---------- Hotspots auf den Grundrissen ---------- */
  var hotspots = Array.prototype.slice.call(document.querySelectorAll(".hotspot"));
  hotspots.forEach(function (spot) {
    spot.addEventListener("click", function (e) {
      e.stopPropagation();
      var wasOpen = spot.getAttribute("aria-expanded") === "true";
      hotspots.forEach(function (s) {
        s.setAttribute("aria-expanded", "false");
      });
      spot.setAttribute("aria-expanded", String(!wasOpen));
    });
  });
  if (hotspots.length) {
    document.addEventListener("click", function () {
      hotspots.forEach(function (s) {
        s.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Kontaktformular ----------
     Ohne Backend öffnet das Formular das E-Mail-Programm mit vorausgefüllter
     Nachricht. Für serverseitigen Versand einfach action/method setzen und
     das data-mailto-Attribut entfernen. */
  var mailForm = document.querySelector("form[data-mailto]");
  if (mailForm) {
    mailForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!mailForm.reportValidity()) return;
      var val = function (n) {
        var el = mailForm.elements[n];
        return el ? el.value.trim() : "";
      };
      var betreff = val("betreff") || "Anfrage über die Website";
      var body =
        "Name: " + val("name") + "\n" +
        "E-Mail: " + val("email") + "\n\n" +
        val("nachricht") + "\n";
      window.location.href =
        "mailto:" + mailForm.getAttribute("data-mailto") +
        "?subject=" + encodeURIComponent(betreff) +
        "&body=" + encodeURIComponent(body);
    });
  }

  /* ---------- Aktuelles Jahr im Footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* =========================================================
     Datenschutz- & Cookie-Hinweis
     ---------------------------------------------------------
     Die Einwilligung wird als JSON im localStorage abgelegt
     (Schlüssel "khs-consent"). Vor der Einwilligung werden
     keinerlei Dienste geladen.

     Einen externen Inhalt (z. B. eine Karte) so einbinden, dass
     er erst nach Zustimmung lädt:

       <iframe data-consent="extern" data-src="https://..."></iframe>

     Aktueller Stand: Die Website lädt Schriften, Icons und alle
     Medien vom eigenen Server. Es sind daher nur die technisch
     notwendigen Daten im Einsatz – die Kategorien Statistik und
     Externe Medien sind vorbereitet, aber noch ungenutzt.
     ========================================================= */
  var STORAGE_KEY = "khs-consent";
  var CONSENT_VERSION = 1;
  var CATEGORIES = ["statistik", "extern"];

  var readConsent = function () {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || data.v !== CONSENT_VERSION) return null;
      return data;
    } catch (e) {
      return null;
    }
  };

  var writeConsent = function (data) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      /* z. B. privater Modus – Auswahl gilt dann nur für diese Sitzung */
    }
  };

  /* Elemente freischalten, die auf eine Kategorie warten */
  var unlock = function (consent) {
    document.querySelectorAll("[data-consent]").forEach(function (el) {
      var cat = el.getAttribute("data-consent");
      if (!consent || !consent[cat] || el.dataset.consentLoaded) return;
      var src = el.getAttribute("data-src");
      if (src) el.setAttribute("src", src);
      el.dataset.consentLoaded = "1";
      el.hidden = false;
      var placeholder = el.previousElementSibling;
      if (placeholder && placeholder.classList.contains("consent-placeholder")) {
        placeholder.hidden = true;
      }
    });
  };

  var banner = null;
  var lastConsentFocus = null;

  var buildBanner = function () {
    var el = document.createElement("div");
    el.className = "cookie";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "cookie-title");
    el.setAttribute("aria-describedby", "cookie-text");
    el.innerHTML =
      '<div class="cookie__card">' +
        '<h2 id="cookie-title">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M12 3.2a8.8 8.8 0 108.8 8.8 3.4 3.4 0 01-4.3-4.4 3.4 3.4 0 01-4.5-4.4z"/>' +
            '<circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="13" cy="14.5" r="1" fill="currentColor"/><circle cx="8" cy="15" r="1" fill="currentColor"/>' +
          "</svg>" +
          "Datenschutz &amp; Cookies</h2>" +
        '<p id="cookie-text">Damit unsere Website funktioniert, brauchen wir einige technisch notwendige ' +
          "Daten – dazu gehört das Speichern Ihrer Auswahl an dieser Stelle. Alles Weitere laden wir nur " +
          "mit Ihrer Zustimmung. Ändern können Sie das jederzeit über „Cookie-Einstellungen“ im Fußbereich.</p>" +
        '<div class="cookie__options" hidden>' +
          '<label class="cookie__opt">' +
            '<input type="checkbox" checked disabled>' +
            "<b>Notwendig</b>" +
            "<small>Sorgt für die Grundfunktionen der Seite und speichert Ihre Auswahl in diesem Hinweis. " +
            "Ohne diese Daten funktioniert die Website nicht.</small>" +
          "</label>" +
          '<label class="cookie__opt">' +
            '<input type="checkbox" data-cat="statistik">' +
            "<b>Statistik</b>" +
            "<small>Hilft uns anonym zu verstehen, welche Inhalte gesucht werden. Derzeit nicht im Einsatz.</small>" +
          "</label>" +
          '<label class="cookie__opt">' +
            '<input type="checkbox" data-cat="extern">' +
            "<b>Externe Medien</b>" +
            "<small>Erlaubt eingebettete Inhalte von anderen Anbietern, zum Beispiel eine Karte. " +
            "Dabei werden Daten an den jeweiligen Anbieter übertragen.</small>" +
          "</label>" +
        "</div>" +
        '<div class="cookie__foot">' +
          '<div class="cookie__actions">' +
            '<button class="btn" type="button" data-cookie-accept>Alle akzeptieren</button>' +
            '<button class="btn btn--ink" type="button" data-cookie-necessary>Nur notwendige</button>' +
            '<button class="cookie__link" type="button" data-cookie-toggle>Einstellungen</button>' +
            '<button class="cookie__link" type="button" data-cookie-save hidden>Auswahl speichern</button>' +
          "</div>" +
          '<p class="cookie__legal"><a href="datenschutz.html">Datenschutzerklärung</a> · ' +
            '<a href="impressum.html">Impressum</a></p>' +
        "</div>" +
      "</div>";
    document.body.appendChild(el);
    return el;
  };

  var closeBanner = function () {
    if (!banner) return;
    banner.classList.remove("is-open");
    if (lastConsentFocus && document.contains(lastConsentFocus)) lastConsentFocus.focus();
  };

  var save = function (choice) {
    var data = { v: CONSENT_VERSION, ts: new Date().toISOString(), notwendig: true };
    CATEGORIES.forEach(function (cat) {
      data[cat] = Boolean(choice[cat]);
    });
    writeConsent(data);
    unlock(data);
    closeBanner();
  };

  var openBanner = function (showOptions) {
    if (!banner) return;
    lastConsentFocus = document.activeElement;
    var stored = readConsent();
    banner.querySelectorAll("[data-cat]").forEach(function (input) {
      input.checked = Boolean(stored && stored[input.getAttribute("data-cat")]);
    });
    var options = banner.querySelector(".cookie__options");
    var saveBtn = banner.querySelector("[data-cookie-save]");
    var toggleBtn = banner.querySelector("[data-cookie-toggle]");
    options.hidden = !showOptions;
    saveBtn.hidden = !showOptions;
    toggleBtn.hidden = Boolean(showOptions);
    banner.classList.add("is-open");
    banner.querySelector("[data-cookie-accept]").focus();
  };

  var consent = readConsent();
  unlock(consent);

  banner = buildBanner();

  banner.querySelector("[data-cookie-accept]").addEventListener("click", function () {
    save({ statistik: true, extern: true });
  });
  banner.querySelector("[data-cookie-necessary]").addEventListener("click", function () {
    save({ statistik: false, extern: false });
  });
  banner.querySelector("[data-cookie-toggle]").addEventListener("click", function () {
    banner.querySelector(".cookie__options").hidden = false;
    banner.querySelector("[data-cookie-save]").hidden = false;
    this.hidden = true;
  });
  banner.querySelector("[data-cookie-save]").addEventListener("click", function () {
    var choice = {};
    banner.querySelectorAll("[data-cat]").forEach(function (input) {
      choice[input.getAttribute("data-cat")] = input.checked;
    });
    save(choice);
  });

  /* Tastatur: innerhalb des Dialogs bleiben, Escape nur bei bereits erteilter Auswahl */
  banner.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (readConsent()) closeBanner();
      return;
    }
    if (e.key !== "Tab") return;
    var focusable = banner.querySelectorAll("button:not([hidden]), input:not([disabled]), a[href]");
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* Erneutes Öffnen über den Link im Fußbereich */
  document.querySelectorAll("[data-cookie-settings]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      openBanner(true);
    });
  });

  if (!consent) openBanner(false);

  window.khsConsent = {
    get: function () {
      return readConsent();
    },
    allows: function (cat) {
      var c = readConsent();
      return Boolean(c && c[cat]);
    },
    open: function () {
      openBanner(true);
    }
  };
})();
