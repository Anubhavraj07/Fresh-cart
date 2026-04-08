const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// ─── API Routes ──────────────────────────────────────────────
app.use("/api/products", require("./routes/products"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/orders"));

// ─── SPA Fallback ────────────────────────────────────────────
// For any non-API route, serve index.html (supports hash-based routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ─── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("");
  console.log("  🛒  FreshCart Grocery App");
  console.log("  ─────────────────────────────────────");
  console.log(`  ✅  Server running at: http://localhost:${PORT}`);
  console.log(`  📦  API available at:  http://localhost:${PORT}/api`);
  console.log("  ─────────────────────────────────────");
  console.log("");
});
