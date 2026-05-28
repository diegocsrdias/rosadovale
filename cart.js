/* cart.js — Carrinho de compras · Sítio Rosa do Vale
   Depende de: produtos.js (deve ser carregado antes)
*/

const CART_KEY = 'rdv:cart';

const Cart = {
  _data: null,

  load() {
    if (this._data) return this._data;
    try {
      this._data = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      this._data = [];
    }
    return this._data;
  },

  save() {
    localStorage.setItem(CART_KEY, JSON.stringify(this._data));
    this._dispatch();
  },

  _dispatch() {
    document.dispatchEvent(
      new CustomEvent('cart:updated', { detail: this.summary() })
    );
  },

  items() {
    return this.load();
  },

  summary() {
    const items = this.load();
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    return { count, subtotal, items };
  },

  add(productId, qty = 1) {
    const produto = getProduto(productId);
    if (!produto) return;
    const items = this.load();
    const existing = items.find(i => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id: produto.id,
        name: produto.name,
        category: produto.category,
        subcategory: produto.subcategory,
        price: produto.price,
        volume: produto.volume,
        uvas: produto.uvas,
        bottleClass: produto.bottleClass,
        qty,
      });
    }
    this._data = items;
    this.save();
  },

  remove(productId) {
    this._data = this.load().filter(i => i.id !== productId);
    this.save();
  },

  updateQty(productId, qty) {
    const items = this.load();
    const item = items.find(i => i.id === productId);
    if (item) {
      item.qty = Math.max(1, parseInt(qty, 10) || 1);
      this._data = items;
      this.save();
    }
  },

  clear() {
    this._data = [];
    this.save();
  },
};

/* ─── Badge updater ─── */
function updateCartBadge(count) {
  document.querySelectorAll('.badge').forEach(badge => {
    badge.textContent = count > 0 ? count : '';
    badge.style.display = count > 0 ? '' : 'none';
  });
}

/* ─── Toast notification ─── */
function showCartToast(name) {
  const existing = document.getElementById('cart-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'cart-toast';
  toast.innerHTML = `
    <span>✓ <strong>${name}</strong> adicionado ao carrinho.</span>
    <a href="carrinho.html">Ver carrinho →</a>
  `;
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    background: var(--green-deep, #1a2e1a); color: var(--cream, #f5f1e8);
    padding: 16px 20px; display: flex; align-items: center; gap: 16px;
    font-size: 13px; box-shadow: 0 8px 32px rgba(0,0,0,0.25);
    animation: slideUp 0.3s ease;
  `;
  toast.querySelector('a').style.cssText = `
    font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
    font-weight: 700; color: var(--gold-soft, #c9a961);
    border-bottom: 1px solid var(--gold-soft, #c9a961); padding-bottom: 2px;
    white-space: nowrap;
  `;

  if (!document.getElementById('cart-toast-style')) {
    const style = document.createElement('style');
    style.id = 'cart-toast-style';
    style.textContent = '@keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }';
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

/* ─── Init badge on page load ─── */
document.addEventListener('DOMContentLoaded', () => {
  const { count } = Cart.summary();
  updateCartBadge(count);
});

document.addEventListener('cart:updated', (e) => {
  updateCartBadge(e.detail.count);
});
