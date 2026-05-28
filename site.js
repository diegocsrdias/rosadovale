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
