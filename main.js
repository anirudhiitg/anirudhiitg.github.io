(function () {
  var cfg = window.STHIR_CONFIG || {};
  var stories = window.STHIR_STORIES || [];
  var products = window.STHIR_PRODUCTS || [];

  // ── WhatsApp link builder ──────────────────────────────────
  function waLink(message) {
    var num = (cfg.whatsappNumber || "").replace(/\D/g, "");
    var text = encodeURIComponent(message || cfg.whatsappGreeting || "Hi!");
    return "https://wa.me/" + num + "?text=" + text;
  }

  // Apply WhatsApp links to any element with [data-wa]. An optional
  // data-wa-msg attribute customises the pre-filled message.
  function wireWhatsApp() {
    document.querySelectorAll("[data-wa]").forEach(function (el) {
      el.setAttribute("href", waLink(el.getAttribute("data-wa-msg")));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
  }

  // ── Contact form ───────────────────────────────────────────
  function wireContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var status = document.getElementById("cf-status");

    function setStatus(msg, kind) {
      if (!status) return;
      status.textContent = msg;
      status.className = "cf-status" + (kind ? " " + kind : "");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var subject = form.subject.value.trim();
      var message = form.message.value.trim();

      if (!name || !email || !message) {
        setStatus("Please fill in your name, email, and message.", "error");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus("Please enter a valid email address.", "error");
        return;
      }

      var fullSubject = subject || cfg.emailSubject || "Website enquiry";

      // Preferred: POST to a form service (Formspree/Getform) if configured.
      if (cfg.formEndpoint) {
        var btn = form.querySelector(".cf-submit");
        if (btn) { btn.disabled = true; }
        setStatus("Sending…", "");
        fetch(cfg.formEndpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form)
        }).then(function (res) {
          if (res.ok) {
            form.reset();
            setStatus("Thanks! Your message has been sent — we'll be in touch soon.", "success");
          } else {
            setStatus("Sorry, something went wrong. Please try WhatsApp instead.", "error");
          }
        }).catch(function () {
          setStatus("Sorry, something went wrong. Please try WhatsApp instead.", "error");
        }).then(function () {
          if (btn) { btn.disabled = false; }
        });
        return;
      }

      // Fallback (no backend): open the visitor's email app, pre-filled.
      var body =
        "Name: " + name + "\n" +
        "Email: " + email + "\n\n" +
        message;
      var addr = cfg.email || "";
      window.location.href = "mailto:" + addr +
        "?subject=" + encodeURIComponent(fullSubject) +
        "&body=" + encodeURIComponent(body);
      setStatus("Opening your email app… if nothing happens, please message us on WhatsApp.", "success");
    });
  }

  // ── Text helpers ───────────────────────────────────────────
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function paragraphs(text) {
    return String(text).split(/\n\s*\n/).map(function (p) {
      return "<p>" + escapeHtml(p.trim()).replace(/\n/g, "<br>") + "</p>";
    }).join("");
  }
  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  // ── Story card markup ──────────────────────────────────────
  function storyCard(s) {
    var thumb = s.image
      ? '<div class="thumb" style="background-image:url(\'' + escapeHtml(s.image) + '\')"></div>'
      : '<div class="thumb"></div>';
    return (
      '<a class="story-card" href="story.html?id=' + encodeURIComponent(s.id) + '">' +
        thumb +
        '<div class="body">' +
          '<div class="date">' + escapeHtml(s.date || "") + "</div>" +
          "<h3>" + escapeHtml(s.title) + "</h3>" +
          "<p>" + escapeHtml(s.excerpt || "") + "</p>" +
          '<div class="more">Read story →</div>' +
        "</div>" +
      "</a>"
    );
  }

  function renderStoryList(el, limit) {
    if (!el) return;
    var list = limit ? stories.slice(0, limit) : stories;
    if (!list.length) {
      el.innerHTML = '<p class="empty">Stories are on the way. Check back soon.</p>';
      return;
    }
    el.innerHTML = list.map(storyCard).join("");
  }

  // ── Single story page ──────────────────────────────────────
  function renderArticle(el) {
    if (!el) return;
    var s = stories.filter(function (x) { return x.id === getParam("id"); })[0];
    if (!s) {
      el.innerHTML =
        '<a class="back-link" href="stories.html">← All stories</a>' +
        '<p class="empty">Sorry, we couldn\'t find that story.</p>';
      return;
    }
    document.title = s.title + " — " + (cfg.brandName || "Sthir Life");
    el.innerHTML =
      '<a class="back-link" href="stories.html">← All stories</a>' +
      (s.image ? '<img class="hero-img" src="' + escapeHtml(s.image) + '" alt="">' : "") +
      '<div class="meta">' + escapeHtml(s.date || "") + "</div>" +
      "<h1>" + escapeHtml(s.title) + "</h1>" +
      (s.author ? '<div class="author">By ' + escapeHtml(s.author) + "</div>" : "") +
      '<div class="content">' + paragraphs(s.body || "") + "</div>";
  }

  // ── Products ───────────────────────────────────────────────
  function waBtn(msg, label) {
    var icon = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>';
    return '<a class="btn btn-wa" target="_blank" rel="noopener" href="' + waLink(msg) + '">' + icon + escapeHtml(label) + "</a>";
  }

  function productThumb(p, cls) {
    return p.image
      ? '<div class="' + cls + '" style="background-image:url(\'' + escapeHtml(p.image) + '\')"></div>'
      : '<div class="' + cls + '"></div>';
  }

  function productCard(p) {
    return (
      '<a class="product-card" href="product.html?id=' + encodeURIComponent(p.id) + '">' +
        productThumb(p, "p-thumb") +
        '<div class="body">' +
          "<h3>" + escapeHtml(p.name) + "</h3>" +
          "<p>" + escapeHtml(p.tagline || "") + "</p>" +
          (p.price ? '<div class="price">' + escapeHtml(p.price) + "</div>" : "") +
          '<div class="more">View product →</div>' +
        "</div>" +
      "</a>"
    );
  }

  function renderProductGrid(el) {
    if (!el) return;
    el.innerHTML = products.map(productCard).join("");
  }

  function renderProduct(el) {
    if (!el) return;
    var p = products.filter(function (x) { return x.id === getParam("id"); })[0];
    if (!p) {
      el.innerHTML = '<div class="wrap"><p class="empty">Sorry, we couldn\'t find that product. ' +
        '<a href="index.html#products">See all products</a>.</p></div>';
      return;
    }
    document.title = p.name + " — " + (cfg.brandName || "Sthir Life");
    var orderMsg = "Hi Sthir Life! I'd like to order " + p.name + ".";

    var benefits = (p.benefits || []).map(function (b) {
      return '<div class="card"><h3>' + escapeHtml(b.title) + "</h3><p>" + escapeHtml(b.text) + "</p></div>";
    }).join("");

    var handmade = (p.handmade || []).map(function (t) {
      return "<p>" + escapeHtml(t) + "</p>";
    }).join("");

    var gallery = "";
    if (p.gallery && p.gallery.length) {
      gallery =
        '<section class="section">' +
          '<div class="wrap">' +
            '<div class="section-head"><div class="eyebrow">A Closer Look</div><h2>From our farm to your kitchen</h2></div>' +
            '<div class="gallery">' +
              p.gallery.map(function (src) {
                return '<div class="gallery-item" style="background-image:url(\'' + escapeHtml(src) + '\')"></div>';
              }).join("") +
            "</div>" +
          "</div>" +
        "</section>";
    }

    el.innerHTML =
      '<header class="product-hero">' +
        '<div class="wrap product-hero-grid">' +
          productThumb(p, "product-hero-img") +
          '<div class="product-hero-copy">' +
            '<a class="back-link" href="index.html#products">← All products</a>' +
            "<h1>" + escapeHtml(p.name) + "</h1>" +
            '<p class="tagline-line">' + escapeHtml(p.tagline || "") + "</p>" +
            "<p class=\"intro\">" + escapeHtml(p.intro || "") + "</p>" +
            (p.price ? '<div class="price big">' + escapeHtml(p.price) + "</div>" : "") +
            waBtn(orderMsg, "Order on WhatsApp") +
            (p.usage ? '<p class="usage"><strong>How to use:</strong> ' + escapeHtml(p.usage) + "</p>" : "") +
          "</div>" +
        "</div>" +
      "</header>" +
      '<section class="section">' +
        '<div class="wrap">' +
          '<div class="section-head"><div class="eyebrow">Why You\'ll Love It</div><h2>Benefits</h2></div>' +
          '<div class="grid grid-4">' + benefits + "</div>" +
        "</div>" +
      "</section>" +
      gallery +
      '<section class="section alt">' +
        '<div class="wrap handmade-wrap">' +
          '<div class="eyebrow">Made by Hand, Not in a Factory</div>' +
          "<h2>Small batches. Real hands. No shortcuts.</h2>" +
          '<div class="handmade-body">' + handmade + "</div>" +
          '<div class="handmade-badges">' +
            '<span class="badge">✋ Handmade in small batches</span>' +
            '<span class="badge">🌿 No chemicals or preservatives</span>' +
            '<span class="badge">🏡 Straight from our farm</span>' +
          "</div>" +
        "</div>" +
      "</section>" +
      '<section class="cta-band"><div class="wrap">' +
        "<h2>Bring " + escapeHtml(p.name) + " home</h2>" +
        "<p>Order in a few taps — right on WhatsApp.</p>" +
        waBtn(orderMsg, "Order on WhatsApp") +
      "</div></section>";
  }

  // ── Fill brand/tagline placeholders ────────────────────────
  function fillBrand() {
    document.querySelectorAll("[data-brand]").forEach(function (el) {
      el.textContent = cfg.brandName || "Sthir Life";
    });
    document.querySelectorAll("[data-tagline]").forEach(function (el) {
      el.textContent = cfg.tagline || "";
    });
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  // ── FAQ Accordion ─────────────────────────────────────────
  function wireFAQAccordion() {
    var triggers = document.querySelectorAll(".faq-trigger");
    triggers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.parentElement;
        var content = item.querySelector(".faq-content");
        var icon = btn.querySelector(".faq-icon");
        var isExpanded = btn.getAttribute("aria-expanded") === "true";

        // Close other accordion items
        document.querySelectorAll(".faq-item").forEach(function (otherItem) {
          if (otherItem !== item) {
            var otherBtn = otherItem.querySelector(".faq-trigger");
            var otherContent = otherItem.querySelector(".faq-content");
            var otherIcon = otherItem.querySelector(".faq-icon");
            if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
            if (otherContent) otherContent.style.maxHeight = null;
            if (otherIcon) otherIcon.textContent = "+";
            otherItem.classList.remove("active");
          }
        });

        if (isExpanded) {
          btn.setAttribute("aria-expanded", "false");
          content.style.maxHeight = null;
          if (icon) icon.textContent = "+";
          item.classList.remove("active");
        } else {
          btn.setAttribute("aria-expanded", "true");
          content.style.maxHeight = content.scrollHeight + "px";
          if (icon) icon.textContent = "−";
          item.classList.add("active");
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    fillBrand();
    wireWhatsApp();
    wireContactForm();
    wireFAQAccordion();
    renderStoryList(document.getElementById("featured-stories"), 2);
    renderStoryList(document.getElementById("all-stories"), 0);
    renderProductGrid(document.getElementById("product-grid"));
    renderProduct(document.getElementById("product"));
    renderArticle(document.getElementById("article"));
  });
})();
