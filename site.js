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
          <img src="Imagens/logo.png" alt="Sítio Rosa do Vale" class="brand-mark__logo">
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

// ============== Mobile: sticky buy bar with stepper (product page only) ==============
(function () {
  const anchor = document.querySelector("#buy-row-anchor");
  if (!anchor) return;

  const prodId = new URLSearchParams(window.location.search).get("id");

  const bar = document.createElement("div");
  bar.className = "sticky-buy";
  bar.setAttribute("aria-label", "Controle de quantidade");
  bar.innerHTML = `
    <div class="sticky-buy__info">
      <span class="sticky-buy__name" id="sticky-buy-name">—</span>
      <span class="sticky-buy__price" id="sticky-buy-price">—</span>
    </div>
    <div class="sticky-buy__stepper">
      <button class="sticky-dn" aria-label="Remover">−</button>
      <span class="sticky-n" id="sticky-buy-n">0</span>
      <button class="sticky-up" aria-label="Adicionar">+</button>
    </div>`;
  document.body.appendChild(bar);

  // Fill product info after produto.js populates the DOM
  document.addEventListener("DOMContentLoaded", () => {
    const nameEl = document.querySelector("#prod-name");
    const priceEl = document.querySelector("#prod-price-main");
    const n = bar.querySelector("#sticky-buy-name");
    const p = bar.querySelector("#sticky-buy-price");
    if (nameEl && n) n.textContent = nameEl.textContent;
    if (priceEl && p) p.textContent = priceEl.textContent;
  });

  // Show bar when the product stepper scrolls out of view
  const obs = new IntersectionObserver(entries => {
    bar.classList.toggle("visible", !entries[0].isIntersecting);
  }, { threshold: 0 });
  obs.observe(anchor);

  // Stepper interactions
  bar.querySelector(".sticky-up").addEventListener("click", () => {
    if (prodId) Cart.add(prodId, 1);
  });
  bar.querySelector(".sticky-dn").addEventListener("click", () => {
    if (!prodId) return;
    const item = Cart.summary().items.find(i => i.id === prodId);
    if (!item) return;
    if (item.qty <= 1) Cart.remove(prodId);
    else Cart.updateQty(prodId, item.qty - 1);
  });

  // Sync counter
  function syncStickyCount() {
    const item = prodId ? Cart.summary().items.find(i => i.id === prodId) : null;
    const qty = item ? item.qty : 0;
    const nEl = document.getElementById("sticky-buy-n");
    if (nEl) nEl.textContent = qty;
    const dn = bar.querySelector(".sticky-dn");
    if (dn) dn.style.opacity = qty > 0 ? "1" : "0.35";
  }
  document.addEventListener("cart:updated", syncStickyCount);
  syncStickyCount();
})();

/* ═══════════════════════════════════════════
   Ficha Técnica Modal — available on all pages
═══════════════════════════════════════════ */
(function () {
  const MODAL_ID = 'ficha-modal';

  function initModal() {
    if (document.getElementById(MODAL_ID)) return; // already exists
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div id="${MODAL_ID}" class="ficha-overlay" hidden role="dialog" aria-modal="true" aria-label="Ficha técnica">
        <div class="ficha-panel">
          <button class="ficha-close" id="ficha-close-btn" aria-label="Fechar">×</button>
          <div id="ficha-inner"></div>
        </div>
      </div>`;
    document.body.appendChild(wrap.firstElementChild);

    const modal    = document.getElementById(MODAL_ID);
    const closeBtn = document.getElementById('ficha-close-btn');

    closeBtn.addEventListener('click', closeFicha);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeFicha(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFicha(); });
  }

  function openFicha(productId) {
    initModal();
    const modal = document.getElementById(MODAL_ID);
    const inner = document.getElementById('ficha-inner');
    const p = typeof getProduto === 'function' ? getProduto(productId) : null;
    if (!p || !inner) return;

    const chips = (p.harmonizacaoChips || [])
      .map(c => `<span class="ficha-chip">${c}</span>`).join('');

    const specs = [
      { label: 'Uvas',        val: p.uvas },
      { label: 'Álcool',      val: p.alcool },
      { label: 'Temperatura', val: p.servico },
      { label: 'Volume',      val: p.volume },
      p.cor   ? { label: 'Cor',   val: p.cor   } : null,
      p.aroma ? { label: 'Aroma', val: p.aroma } : null,
      p.boca  ? { label: 'Boca',  val: p.boca  } : null,
      p.safra ? { label: 'Safra', val: p.safra } : null,
    ].filter(Boolean).map(s => `
      <div class="ficha-spec">
        <span class="ficha-spec__label">${s.label}</span>
        <span class="ficha-spec__val">${s.val}</span>
      </div>`).join('');

    inner.innerHTML = `
      ${p.img
        ? `<img class="ficha-panel__img" src="${p.img}" alt="${p.nameFull || p.name}">`
        : `<div class="ficha-panel__img-placeholder"><svg class="bottle-svg ${p.bottleClass}" viewBox="0 0 120 360"><use href="#bottle"/></svg></div>`
      }
      <div class="ficha-body">
        <span class="ficha-body__cat">${p.subcategory} · ${p.category}</span>
        <h2 class="ficha-body__name">${p.nameFull || p.name}</h2>
        <div class="ficha-body__price">R$ ${p.price} <small style="font-size:14px;font-weight:400;color:var(--ink-soft)">/ ${p.volume}</small></div>
        ${p.descricao ? `<p class="ficha-body__desc">${p.descricao}</p>` : ''}
        <div class="ficha-specs">${specs}</div>
        ${chips ? `<div class="ficha-chips">${chips}</div>` : ''}
        <div class="ficha-actions">
          <a href="produto.html?id=${p.id}" class="btn btn-outline">Ver produto completo</a>
        </div>
      </div>`;

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    document.getElementById('ficha-close-btn').focus();
  }

  function closeFicha() {
    const modal = document.getElementById(MODAL_ID);
    if (modal) modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  /* Expose globally */
  window.openFicha  = openFicha;
  window.closeFicha = closeFicha;

  /* Delegate: any [data-ficha] button on the page */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-ficha]');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      openFicha(btn.dataset.ficha);
    }
  });
})();
