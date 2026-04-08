// ─── In-Memory Cart Store ────────────────────────────────────
// Each item: { productId, quantity }

let cartItems = [];

const cart = {
  getAll() {
    return [...cartItems];
  },

  addItem(productId, quantity = 1) {
    const existing = cartItems.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cartItems.push({ productId, quantity });
    }
    return this.getAll();
  },

  updateQuantity(productId, quantity) {
    const item = cartItems.find(item => item.productId === productId);
    if (!item) return null;
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    item.quantity = quantity;
    return this.getAll();
  },

  removeItem(productId) {
    const index = cartItems.findIndex(item => item.productId === productId);
    if (index === -1) return null;
    cartItems.splice(index, 1);
    return this.getAll();
  },

  clear() {
    cartItems = [];
    return [];
  },

  getCount() {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
};

module.exports = cart;
