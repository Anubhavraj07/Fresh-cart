const express = require("express");
const router = express.Router();
const ordersStore = require("../models/orders");
const cart = require("../models/cart");
const products = require("../data/products");

// POST /api/orders — place order from current cart
router.post("/", (req, res) => {
  const cartItems = cart.getAll();

  if (cartItems.length === 0) {
    return res.status(400).json({ success: false, error: "Cart is empty" });
  }

  const customerName = req.body.customerName || "Guest";
  const order = ordersStore.create(cartItems, products, customerName);

  // Clear the cart after placing order
  cart.clear();

  res.status(201).json({
    success: true,
    message: "Order placed successfully!",
    data: order
  });
});

// GET /api/orders — list all orders
router.get("/", (req, res) => {
  const orders = ordersStore.getAll();
  res.json({ success: true, data: orders, count: orders.length });
});

// GET /api/orders/:id — single order
router.get("/:id", (req, res) => {
  const order = ordersStore.getById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: "Order not found" });
  }
  res.json({ success: true, data: order });
});

module.exports = router;
