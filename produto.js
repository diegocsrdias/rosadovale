/* produto.js — Carregamento dinâmico da página de produto
   Depende de: produtos.js, cart.js
*/

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    /* ─── Resolve product from URL param ─── */
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const produto = id ? getProduto(id) : PRODUTOS[0]; // fallback: first product

    if (!produto) return;

    /* ─── Update page title + meta ─── */
    document.title = `${produto.nameFull || produto.name} — Sítio Rosa do Vale`;

    /* ─── Breadcrumb ─── */
    const bcCat = document.getElementById('bc-category');
    const bcName = document.getElementById('bc-name');
    const bcCatLink = document.getElementById('bc-category-link');
    if (bcCat) bcCat.textContent = capitalize(produto.category);
    if (bcCatLink) {
      bcCatLink.href = `loja.html?cat=${produto.category}`;
      bcCatLink.querySelector('span').textContent = capitalize(produto.category);
    }
    if (bcName) bcName.textContent = produto.nameFull || produto.name;

    /* ─── Gallery: bottle class ─── */
    document.querySelectorAll('[data-bottle-svg]').forEach(el => {
      el.className = `bottle-svg ${produto.bottleClass}`;
    });

    /* ─── Product info ─── */
    setText('prod-category', `${produto.subcategory} · ${produto.category}`);
    setHTML('prod-name', buildNameHTML(produto));
    setText('prod-subtitle', `${produto.uvas} · ${produto.alcool !== '0%' ? produto.alcool : 'sem álcool'} · safra ${produto.safra}`);
    setText('prod-price-main', `R$ ${produto.price}`);
    setText('prod-installments', `6× de R$ ${(produto.price / 6).toFixed(2).replace('.', ',')} sem juros`);
    setText('prod-lead', buildLeadText(produto));
    setText('prod-servico', produto.servico);
    setText('prod-volume', produto.volume);
    setText('prod-uvas', produto.uvas);
    setText('prod-alcool', produto.alcool);
    setText('prod-safra', produto.safra);

    /* ─── Badge corner (safra) ─── */
    setText('prod-safra-badge', `Safra ${produto.safra}`);

    /* ─── Tasting tab ─── */
    setText('prod-cor', produto.cor);
    setText('prod-aroma', produto.aroma);
    setText('prod-boca', produto.boca);
    setText('prod-harmoniza', produto.harmoniza);

    /* ─── Tasting bars ─── */
    setBar('bar-docura', produto.doçura);
    setBar('bar-acidez', produto.acidez);
    setBar('bar-corpo', produto.corpo);
    setBar('bar-bolha', produto.bolha);
    setBar('bar-final', produto.final);

    /* Hide bolha bar for still wines */
    const bolhaRow = document.getElementById('bar-bolha-row');
    if (bolhaRow) bolhaRow.style.display = produto.bolha === 0 ? 'none' : '';

    /* ─── Ficha técnica ─── */
    setText('ft-tipo', produto.subcategory);
    setText('ft-uva', produto.uvas);
    setText('ft-alcool', produto.alcool);
    setText('ft-volume', produto.volume);
    setText('ft-servico', produto.servico);
    setText('ft-safra', produto.safra);
    setText('ft-origem', 'Poço das Antas — RS');

    /* ─── Pairing chips ─── */
    const chipsEl = document.getElementById('pairing-chips');
    if (chipsEl && produto.harmonizacaoChips) {
      chipsEl.innerHTML = produto.harmonizacaoChips
        .map(c => `<span class="pp-pairing__chip">${c}</span>`)
        .join('');
    }

    /* ─── Description tab ─── */
    setText('prod-descricao-full', produto.descricao);

    /* ─── Product page stepper ─── */
    const prodStepper = document.getElementById('prod-stepper');
    const buyNowBtn = document.getElementById('btn-buy-now');

    function syncProdStepper() {
      if (!prodStepper) return;
      const item = Cart.summary().items.find(i => i.id === produto.id);
      const qty = item ? item.qty : 0;
      prodStepper.classList.toggle('is-zero', qty === 0);
      const n = document.getElementById('prod-stepper-n');
      if (n) n.textContent = qty;
    }

    if (prodStepper) {
      prodStepper.querySelector('.prod-stepper__up').addEventListener('click', () => {
        Cart.add(produto.id, 1);
        showCartToast(produto.name);
      });
      prodStepper.querySelector('.prod-stepper__dn').addEventListener('click', () => {
        const item = Cart.summary().items.find(i => i.id === produto.id);
        if (!item) return;
        if (item.qty <= 1) Cart.remove(produto.id);
        else Cart.updateQty(produto.id, item.qty - 1);
      });
      document.addEventListener('cart:updated', syncProdStepper);
      syncProdStepper();
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', () => {
        Cart.add(produto.id, 1);
        window.location.href = 'checkout.html';
      });
    }

    /* ─── Related products ─── */
    const relatedGrid = document.getElementById('related-grid');
    if (relatedGrid) {
      const related = PRODUTOS
        .filter(p => p.id !== produto.id && p.category === produto.category)
        .slice(0, 4);
      relatedGrid.innerHTML = related.map(p => `
        <a href="produto.html?id=${p.id}" class="product-card">
          <div class="product-card__media">
            <svg class="bottle-svg ${p.bottleClass}" viewBox="0 0 120 360"><use href="#bottle"/></svg>
          </div>
          <div class="product-card__body">
            <span class="product-card__cat">${p.subcategory}</span>
            <h3 class="product-card__name">${p.name}</h3>
            <span class="product-card__meta">${p.uvas} · ${p.alcool !== '0%' ? p.alcool : 'sem álcool'}</span>
            <div class="product-card__foot">
              <span class="product-card__price">R$ ${p.price} <small>/ ${p.volume}</small></span>
              <span class="mono">${p.volume}</span>
            </div>
          </div>
        </a>
      `).join('');
    }

    /* ─── Tabs ─── */
    const tabBtns  = document.querySelectorAll('[data-tab-btn]');
    const tabPanels = document.querySelectorAll('[data-tab-panel]');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.toggle('active', b === btn));
        tabPanels.forEach(p => p.classList.toggle('active', p.dataset.tabPanel === btn.dataset.tabBtn));
      });
    });
  });

  /* ─── Helpers ─── */
  function setText(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.textContent = val;
  }
  function setHTML(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.innerHTML = val;
  }
  function setBar(id, pct) {
    const el = document.getElementById(id);
    if (el && pct !== undefined) el.style.width = `${pct || 0}%`;
  }
  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  function buildNameHTML(p) {
    // Split at last word for italic effect if name is long enough
    const parts = p.name.split(' ');
    if (parts.length <= 2) return p.name;
    const last = parts.pop();
    return `${parts.join(' ')} <em>${last}</em>`;
  }
  function buildLeadText(p) {
    return p.descricao;
  }
})();
