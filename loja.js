/* loja.js — Renderização dinâmica da loja · Sítio Rosa do Vale
   Depende de: produtos.js, cart.js
*/

(function () {
  document.addEventListener('DOMContentLoaded', () => {

    /* ─── Elements ─── */
    const chipsInner  = document.getElementById('cat-chips-inner');
    const gridEl      = document.getElementById('product-grid');
    const toolbarCount = document.getElementById('toolbar-count');
    const sortSelect  = document.getElementById('sort');

    if (!gridEl) return; // not on loja page

    /* ─── State ─── */
    const params = new URLSearchParams(window.location.search);
    let activeCategory = params.get('cat') || 'todos';
    let sortMode = 'relevancia';

    /* ─── Category config ─── */
    const CATS = [
      { id: 'todos',      label: 'Todos'      },
      { id: 'espumantes', label: 'Espumantes' },
      { id: 'vinhos',     label: 'Vinhos'     },
      { id: 'sucos',      label: 'Sucos'      },
      { id: 'katats',     label: 'Katats'     },
    ];

    function countCat(id) {
      if (id === 'todos') return PRODUTOS.length;
      return PRODUTOS.filter(p => p.category === id).length;
    }

    /* ─── Render chips ─── */
    function renderChips() {
      if (!chipsInner) return;
      chipsInner.innerHTML = CATS.map(c => `
        <button class="chip ${c.id === activeCategory ? 'active' : ''}" data-cat="${c.id}">
          ${c.label} <span class="chip__count">${String(countCat(c.id)).padStart(2, '0')}</span>
        </button>
      `).join('');

      chipsInner.querySelectorAll('.chip').forEach(btn => {
        btn.addEventListener('click', () => {
          activeCategory = btn.dataset.cat;
          renderChips();
          renderGrid();
          // update URL without reload
          const url = new URL(window.location);
          if (activeCategory === 'todos') url.searchParams.delete('cat');
          else url.searchParams.set('cat', activeCategory);
          history.replaceState(null, '', url);
        });
      });
    }

    /* ─── Product card HTML ─── */
    function cardHTML(p) {
      const tagHTML = p.tag
        ? `<span class="product-card__tag" style="${p.tagStyle || ''}">${p.tag}</span>`
        : '';
      const metaLine = p.alcool && p.alcool !== '0%'
        ? `${p.uvas} · ${p.alcool}`
        : `${p.uvas} · sem álcool`;

      return `
        <a href="produto.html?id=${p.id}" class="product-card">
          <div class="product-card__media">
            ${tagHTML}
            <svg class="bottle-svg ${p.bottleClass}" viewBox="0 0 120 360"><use href="#bottle"/></svg>
            <div class="product-card__quick">
              <div class="card-stepper is-zero" data-stepper data-product-id="${p.id}">
                <button class="card-stepper__dn" aria-label="Remover">−</button>
                <span class="card-stepper__n">0</span>
                <button class="card-stepper__up" aria-label="Adicionar">Adicionar</button>
              </div>
            </div>
          </div>
          <div class="product-card__body">
            <span class="product-card__cat">${p.subcategory}</span>
            <h3 class="product-card__name">${p.name}</h3>
            <span class="product-card__meta">${metaLine}</span>
            <div class="product-card__foot">
              <span class="product-card__price">R$ ${p.price} <small>/ ${p.volume}</small></span>
              <span class="mono">${p.volume}</span>
            </div>
          </div>
        </a>
      `;
    }

    /* ─── Stepper sync helper ─── */
    function syncStepper(el) {
      const id = el.dataset.productId;
      const item = Cart.summary().items.find(i => i.id === id);
      const qty = item ? item.qty : 0;
      el.classList.toggle('is-zero', qty === 0);
      el.querySelector('.card-stepper__n').textContent = qty;
    }

    /* ─── Render grid ─── */
    function renderGrid() {
      let products = getProdutosPorCategoria(activeCategory);

      // Sort
      const sv = sortSelect ? sortSelect.value : '';
      if (sv === 'Menor preço') products = [...products].sort((a, b) => a.price - b.price);
      else if (sv === 'Maior preço') products = [...products].sort((a, b) => b.price - a.price);
      else if (sv === 'A–Z') products = [...products].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

      // Count
      if (toolbarCount) {
        toolbarCount.textContent = `${products.length} produto${products.length !== 1 ? 's' : ''}`;
      }

      // Render
      gridEl.innerHTML = products.map(cardHTML).join('');

      // Bind card steppers
      gridEl.querySelectorAll('[data-stepper]').forEach(el => {
        syncStepper(el);
        const id = el.dataset.productId;
        el.querySelector('.card-stepper__up').addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          Cart.add(id, 1);
          const prod = getProduto(id);
          if (prod) showCartToast(prod.name);
        });
        el.querySelector('.card-stepper__dn').addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const item = Cart.summary().items.find(i => i.id === id);
          if (!item) return;
          if (item.qty <= 1) Cart.remove(id);
          else Cart.updateQty(id, item.qty - 1);
        });
      });
    }

    /* ─── Re-sync steppers on cart change ─── */
    document.addEventListener('cart:updated', () => {
      gridEl.querySelectorAll('[data-stepper]').forEach(syncStepper);
    });

    /* ─── Init ─── */
    renderChips();
    renderGrid();
    if (sortSelect) sortSelect.addEventListener('change', renderGrid);
  });
})();
