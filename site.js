/* Rosa do Vale — small site behaviour */

// ============== Age verification modal ==============
(function () {
  const STORAGE_KEY = "rdv:age-confirmed";
  const modal = document.querySelector("[data-age-modal]");
  if (!modal) return;

  const confirmed = localStorage.getItem(STORAGE_KEY) === "1";
  if (confirmed) {
    modal.hidden = true;
  } else {
    modal.hidden = false;
    document.documentElement.style.overflow = "hidden";
  }

  modal.querySelector("[data-age-yes]")?.addEventListener("click", () => {
    localStorage.setItem(STORAGE_KEY, "1");
    modal.hidden = true;
    document.documentElement.style.overflow = "";
  });

  modal.querySelector("[data-age-no]")?.addEventListener("click", () => {
    window.location.href = "https://www.google.com";
  });
})();

// ============== Year stamp ==============
document.querySelectorAll("[data-year]").forEach(el => {
  el.textContent = new Date().getFullYear();
});

// ============== Tabs (account page) ==============
document.querySelectorAll("[data-tabs]").forEach(group => {
  const tabs = group.querySelectorAll("[data-tab]");
  const panels = group.querySelectorAll("[data-panel]");
  tabs.forEach(t => {
    t.addEventListener("click", () => {
      const key = t.dataset.tab;
      tabs.forEach(x => x.classList.toggle("active", x === t));
      panels.forEach(p => p.classList.toggle("active", p.dataset.panel === key));
    });
  });
});

// ============== Quantity steppers ==============
document.querySelectorAll("[data-qty]").forEach(grp => {
  const input = grp.querySelector("input");
  grp.querySelector("[data-qty-down]")?.addEventListener("click", () => {
    input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
  });
  grp.querySelector("[data-qty-up]")?.addEventListener("click", () => {
    input.value = (parseInt(input.value, 10) || 1) + 1;
  });
});

// ============== Cart drawer (placeholder open/close) ==============
const cartBtn = document.querySelector("[data-cart-open]");
const cartDrawer = document.querySelector("[data-cart-drawer]");
if (cartBtn && cartDrawer) {
  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    cartDrawer.classList.add("open");
  });
  cartDrawer.querySelector("[data-cart-close]")?.addEventListener("click", () => {
    cartDrawer.classList.remove("open");
  });
  cartDrawer.querySelector(".cart-drawer__scrim")?.addEventListener("click", () => {
    cartDrawer.classList.remove("open");
  });
}

// ============== Product image gallery (product page) ==============
document.querySelectorAll("[data-gallery]").forEach(g => {
  const thumbs = g.querySelectorAll("[data-thumb]");
  const main = g.querySelector("[data-main]");
  thumbs.forEach(t => {
    t.addEventListener("click", () => {
      thumbs.forEach(x => x.classList.toggle("active", x === t));
      const v = t.dataset.variant;
      if (main && v) {
        main.className = "ph product-page__hero " + v;
        const lbl = main.querySelector(".ph__label");
        if (lbl && t.dataset.label) lbl.textContent = t.dataset.label;
      }
    });
  });
});

// ============== Mobile: fix cart icon href ==============
// If no cart drawer markup exists, make cart button navigate to cart page
(function () {
  if (!document.querySelector("[data-cart-drawer]")) {
    document.querySelectorAll("[data-cart-open]").forEach(el => {
      el.setAttribute("href", "carrinho.html");
    });
  }
})();

// ============== Mobile: extend viewport for safe areas (notch/home bar) ==============
(function () {
  const vp = document.querySelector('meta[name="viewport"]');
  if (vp && !vp.content.includes("viewport-fit")) {
    vp.content = vp.content + ", viewport-fit=cover";
  }
})();

// ============== Mobile: hamburger + nav drawer ==============
(function () {
  const inner = document.querySelector(".site-header__inner");
  const siteNav = document.querySelector(".site-nav");
  if (!inner) return;

  // Build hamburger button and inject as first child of header
  const toggle = document.createElement("button");
  toggle.className = "nav-toggle";
  toggle.setAttribute("aria-label", "Abrir menu");
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
  inner.insertBefore(toggle, inner.firstChild);

  // Clone nav links from existing site-nav (preserves active class)
  let linksHtml = "";
  if (siteNav) {
    siteNav.querySelectorAll("a").forEach(a => {
      const cls = a.classList.contains("active") ? ' class="active"' : "";
      linksHtml += `<a href="${a.getAttribute("href")}"${cls}>${a.textContent.trim()}</a>`;
    });
  }

  // Build and inject drawer
  const drawer = document.createElement("div");
  drawer.className = "mobile-nav";
  drawer.setAttribute("role", "dialog");
  drawer.setAttribute("aria-modal", "true");
  drawer.setAttribute("aria-label", "Menu de navegação");
  drawer.innerHTML = `
    <div class="mobile-nav__scrim"></div>
    <div class="mobile-nav__panel">
      <div class="mobile-nav__header">
        <div class="brand-mark" style="align-items:flex-start">
          <span class="brand-mark__top" style="font-size:16px">ROSA DO VALE</span>
          <span class="brand-mark__sub">vinhos &amp; espumantes</span>
        </div>
        <button class="mobile-nav__close" aria-label="Fechar menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <nav class="mobile-nav__links">${linksHtml}</nav>
      <div class="mobile-nav__footer">
        <a href="loja.html" class="btn btn-green btn-block" style="justify-content:center">Ver toda a loja</a>
        <a href="https://wa.me/555195867921" class="btn btn-outline btn-block" style="justify-content:center">WhatsApp</a>
      </div>
    </div>`;
  document.body.appendChild(drawer);

  function openMenu() {
    drawer.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    drawer.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", openMenu);
  drawer.querySelector(".mobile-nav__scrim").addEventListener("click", closeMenu);
  drawer.querySelector(".mobile-nav__close").addEventListener("click", closeMenu);
  drawer.querySelectorAll(".mobile-nav__links a").forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && drawer.classList.contains("open")) closeMenu();
  });
})();

// ============== Mobile: bottom navigation bar ==============
(function () {
  const nav = document.createElement("nav");
  nav.className = "bottom-nav";
  nav.setAttribute("aria-label", "Navegação rápida");

  const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const isActive = (...pages) => pages.includes(page) ? " active" : "";

  nav.innerHTML = `
    <a href="index.html" class="bottom-nav__item${isActive("index.html", "")}" aria-label="Início">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>
      <span>Início</span>
    </a>
    <a href="loja.html" class="bottom-nav__item${isActive("loja.html", "produto.html")}" aria-label="Loja">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
      <span>Loja</span>
    </a>
    <a href="carrinho.html" class="bottom-nav__item${isActive("carrinho.html")}" style="position:relative" aria-label="Carrinho">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 5h2l3 12h11l3-8H7"/><circle cx="9" cy="21" r="1.4"/><circle cx="18" cy="21" r="1.4"/></svg>
      <span class="bottom-nav__badge" id="bottom-nav-badge"></span>
      <span>Carrinho</span>
    </a>
    <a href="conta.html" class="bottom-nav__item${isActive("conta.html")}" aria-label="Conta">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
      <span>Conta</span>
    </a>`;
  document.body.appendChild(nav);

  function syncBottomBadge() {
    const badge = document.getElementById("bottom-nav-badge");
    if (!badge || typeof Cart === "undefined") return;
    const count = Cart.summary().count;
    badge.textContent = count > 0 ? count : "";
    badge.style.display = count > 0 ? "flex" : "none";
  }
  document.addEventListener("cart:updated", syncBottomBadge);
  syncBottomBadge();
})();

// ============== Mobile: sticky buy bar (product page only) ==============
(function () {
  const btnAdd = document.querySelector("#btn-add-cart");
  if (!btnAdd) return;

  const bar = document.createElement("div");
  bar.className = "sticky-buy";
  bar.setAttribute("aria-label", "Adicionar ao carrinho");
  bar.innerHTML = `
    <div class="sticky-buy__info">
      <span class="sticky-buy__name" id="sticky-buy-name">—</span>
      <span class="sticky-buy__price" id="sticky-buy-price">—</span>
    </div>
    <button class="btn btn-green sticky-buy__btn" id="sticky-buy-btn">Adicionar</button>`;
  document.body.appendChild(bar);

  // Fill product info after produto.js's DOMContentLoaded handler has run
  // (site.js is defer → DOMContentLoaded listeners registered here fire
  //  after non-defer scripts' listeners, so produto.js populates DOM first)
  document.addEventListener("DOMContentLoaded", () => {
    const nameEl = document.querySelector("#prod-name");
    const priceEl = document.querySelector("#prod-price-main");
    const n = bar.querySelector("#sticky-buy-name");
    const p = bar.querySelector("#sticky-buy-price");
    if (nameEl && n) n.textContent = nameEl.textContent;
    if (priceEl && p) p.textContent = priceEl.textContent;
  });

  // Show bar when the original add-to-cart button scrolls out of view
  const obs = new IntersectionObserver(entries => {
    bar.classList.toggle("visible", !entries[0].isIntersecting);
  }, { threshold: 0 });
  obs.observe(btnAdd);

  // Mirror the main button's click
  const stickyBtn = bar.querySelector("#sticky-buy-btn");
  stickyBtn.addEventListener("click", () => {
    btnAdd.click();
    const orig = stickyBtn.textContent;
    stickyBtn.textContent = "Adicionado ✓";
    stickyBtn.style.background = "var(--green-deep)";
    setTimeout(() => { stickyBtn.textContent = orig; stickyBtn.style.background = ""; }, 1600);
  });
})();
