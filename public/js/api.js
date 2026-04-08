// ─── API Client ──────────────────────────────────────────────
// Centralized fetch wrapper for all backend calls

const API_BASE = "/api";

const api = {
  // ── Products ─────────────────────────────────────────
  async getProducts(category = "All", search = "") {
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("category", category);
    if (search) params.set("search", search);
    const qs = params.toString();
    const res = await fetch(`${API_BASE}/products${qs ? "?" + qs : ""}`);
    return res.json();
  },

  async getProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return res.json();
  },

  // ── Cart ─────────────────────────────────────────────
  async getCart() {
    const res = await fetch(`${API_BASE}/cart`);
    return res.json();
  },

  async addToCart(productId, quantity = 1) {
    const res = await fetch(`${API_BASE}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity })
    });
    return res.json();
  },

  async updateCartItem(productId, quantity) {
    const res = await fetch(`${API_BASE}/cart/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity })
    });
    return res.json();
  },

  async removeFromCart(productId) {
    const res = await fetch(`${API_BASE}/cart/${productId}`, {
      method: "DELETE"
    });
    return res.json();
  },

  async clearCart() {
    const res = await fetch(`${API_BASE}/cart`, { method: "DELETE" });
    return res.json();
  },

  // ── Orders ───────────────────────────────────────────
  async placeOrder(customerName = "Guest") {
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerName })
    });
    return res.json();
  },

  async getOrders() {
    const res = await fetch(`${API_BASE}/orders`);
    return res.json();
  },

  async getOrder(id) {
    const res = await fetch(`${API_BASE}/orders/${id}`);
    return res.json();
  }
};
