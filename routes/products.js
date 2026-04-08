const express = require("express");
const router = express.Router();
const products = require("../data/products");

// GET /api/products — all products, optional ?category= filter and ?search= filter
router.get("/", (req, res) => {
  let result = products;

  if (req.query.category && req.query.category !== "All") {
    result = result.filter(
      p => p.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }

  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    result = result.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, data: result, count: result.length });
});

// GET /api/products/:id — single product
router.get("/:id", (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, error: "Product not found" });
  }
  res.json({ success: true, data: product });
});

module.exports = router;
