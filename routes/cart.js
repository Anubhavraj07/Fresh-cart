const express = require("express");
const router = express.Router();
const cart = require("../models/cart");
const products = require("../data/products");

// GET /api/cart — get cart with enriched product data
router.get("/", (req, res) => {
  const items = cart.getAll().map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product: product || null
    };
  });

  const subtotal = items.reduce((sum, item) => {
    return sum + (item.product ? item.product.price * item.quantity : 0);
  }, 0);

  res.json({
    success: true,
    data: {
      items,
      count: cart.getCount(),
      subtotal: +subtotal.toFixed(2),
      tax: +(subtotal * 0.08).toFixed(2),
      total: +(subtotal * 1.08).toFixed(2)
    }
  });
});

// POST /api/cart — add item { productId, quantity }
router.post("/", (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, error: "productId is required" });
  }

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, error: "Product not found" });
  }

  if (!product.inStock) {
    return res.status(400).json({ success: false, error: "Product is out of stock" });
  }

  cart.addItem(productId, quantity || 1);
  res.json({ success: true, message: `${product.name} added to cart`, count: cart.getCount() });
});

// PUT /api/cart/:productId — update quantity
router.put("/:productId", (req, res) => {
  const productId = parseInt(req.params.productId);
  const { quantity } = req.body;

  if (quantity === undefined) {
    return res.status(400).json({ success: false, error: "quantity is required" });
  }

  const result = cart.updateQuantity(productId, quantity);
  if (result === null) {
    return res.status(404).json({ success: false, error: "Item not in cart" });
  }

  res.json({ success: true, count: cart.getCount() });
});

// DELETE /api/cart/:productId — remove item
router.delete("/:productId", (req, res) => {
  const productId = parseInt(req.params.productId);
  const result = cart.removeItem(productId);
  if (result === null) {
    return res.status(404).json({ success: false, error: "Item not in cart" });
  }
  res.json({ success: true, count: cart.getCount() });
});

// DELETE /api/cart — clear cart
router.delete("/", (req, res) => {
  cart.clear();
  res.json({ success: true, message: "Cart cleared", count: 0 });
});

module.exports = router;
