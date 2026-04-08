// ─── In-Memory Orders Store ──────────────────────────────────
const { v4: uuidv4 } = require("uuid");

let orders = [];
let orderCounter = 1000;

const ordersStore = {
  create(cartItems, products, customerName = "Guest") {
    orderCounter++;
    const orderId = `ORD-${orderCounter}`;

    const items = cartItems.map(cartItem => {
      const product = products.find(p => p.id === cartItem.productId);
      return {
        productId: cartItem.productId,
        name: product ? product.name : "Unknown",
        emoji: product ? product.emoji : "📦",
        price: product ? product.price : 0,
        quantity: cartItem.quantity,
        subtotal: product ? +(product.price * cartItem.quantity).toFixed(2) : 0
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = +(subtotal * 0.08).toFixed(2); // 8% tax
    const total = +(subtotal + tax).toFixed(2);

    const order = {
      id: orderId,
      customerName,
      items,
      subtotal,
      tax,
      total,
      status: "confirmed",
      createdAt: new Date().toISOString()
    };

    orders.push(order);
    return order;
  },

  getAll() {
    return [...orders].reverse(); // newest first
  },

  getById(id) {
    return orders.find(order => order.id === id) || null;
  }
};

module.exports = ordersStore;
