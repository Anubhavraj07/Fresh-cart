// ─── Products Page ───────────────────────────────────────────

const CATEGORIES = ["All", "Fruits", "Vegetables", "Dairy", "Bakery", "Beverages", "Snacks"];
const CATEGORY_EMOJIS = {
  All: "🏪", Fruits: "🍎", Vegetables: "🥬", Dairy: "🧀",
  Bakery: "🍞", Beverages: "☕", Snacks: "🍿"
};

let activeCategory = "All";

// Hero floating items config
const HERO_FLOAT_ITEMS = [
  { emoji: "🍎", x: "8%",  y: "20%", size: "2.8rem", opacity: 0.55, duration: "7s",  delay: "0s",    blur: "0px",  rot: "-8deg",  floatY: "-18px" },
  { emoji: "🥑", x: "85%", y: "15%", size: "2.4rem", opacity: 0.45, duration: "8s",  delay: "0.5s",  blur: "1px",  rot: "12deg",  floatY: "-14px" },
  { emoji: "🥐", x: "15%", y: "65%", size: "2rem",   opacity: 0.35, duration: "9s",  delay: "1s",    blur: "2px",  rot: "5deg",   floatY: "-20px" },
  { emoji: "🧀", x: "78%", y: "70%", size: "2.2rem", opacity: 0.4,  duration: "7.5s",delay: "0.3s",  blur: "1px",  rot: "-15deg", floatY: "-16px" },
  { emoji: "☕", x: "50%", y: "12%", size: "2rem",   opacity: 0.3,  duration: "10s", delay: "1.5s",  blur: "3px",  rot: "8deg",   floatY: "-12px" },
  { emoji: "🍓", x: "92%", y: "45%", size: "1.8rem", opacity: 0.35, duration: "8.5s",delay: "0.8s",  blur: "2px",  rot: "-10deg", floatY: "-15px" },
  { emoji: "🥬", x: "5%",  y: "40%", size: "2rem",   opacity: 0.3,  duration: "9.5s",delay: "2s",    blur: "3px",  rot: "6deg",   floatY: "-18px" },
  { emoji: "🍞", x: "35%", y: "75%", size: "1.6rem", opacity: 0.25, duration: "11s", delay: "1.2s",  blur: "4px",  rot: "-5deg",  floatY: "-10px" },
];

function renderProductsPage() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <!-- Hero Section -->
    <section class="hero" id="hero-section">
      <div class="hero-bg">
        <div class="hero-gradient"></div>
        <div class="hero-floating-items">
          ${HERO_FLOAT_ITEMS.map(item => `
            <span class="hero-float-item"
                  style="left:${item.x}; top:${item.y};
                         --size:${item.size}; --opacity:${item.opacity};
                         --duration:${item.duration}; --delay:${item.delay};
                         --blur:${item.blur}; --rot:${item.rot};
                         --float-y:${item.floatY};
                         font-size:var(--size); opacity:var(--opacity);
                         filter:blur(var(--blur));
                         animation-duration:var(--duration);
                         animation-delay:var(--delay);">
              ${item.emoji}
            </span>
          `).join("")}
        </div>
      </div>
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="hero-line">Fresh. </span>
          <span class="hero-line">Premium. </span>
          <span class="hero-line">Delivered.</span>
        </h1>
        <p class="hero-subtitle">Hand-picked quality groceries delivered straight to your door.<br>Browse our curated selection of farm-fresh produce, artisan bakery & more.</p>
        <button class="hero-cta magnetic-btn" id="hero-cta-btn" onclick="document.getElementById('product-section').scrollIntoView({behavior:'smooth'})">
          <span>Start Shopping</span>
          <span class="hero-cta-arrow">↓</span>
        </button>
      </div>
    </section>

    <!-- Product Section -->
    <section id="product-section">
      <div class="category-tabs" id="category-tabs">
        ${CATEGORIES.map(cat => `
          <button class="category-tab ${cat === activeCategory ? 'active' : ''}"
                  data-category="${cat}"
                  id="cat-tab-${cat.toLowerCase()}">
            ${CATEGORY_EMOJIS[cat]} ${cat}
          </button>
        `).join("")}
      </div>

      <div class="product-count" id="product-count"></div>

      <div class="product-grid" id="product-grid">
        ${renderSkeletons(8)}
      </div>
    </section>
  `;

  // Bind category tabs
  document.querySelectorAll(".category-tab").forEach(tab => {
    tab.addEventListener("click", (e) => {
      Animations.rippleEffect(e, tab);
      activeCategory = tab.dataset.category;
      document.querySelectorAll(".category-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      loadProducts();
    });
  });

  // Init magnetic buttons
  Animations.initMagneticButtons();

  // Init particle background on first render
  Animations.initParticleBackground();

  loadProducts();
}

async function loadProducts() {
  const grid = document.getElementById("product-grid");
  const countEl = document.getElementById("product-count");
  const searchInput = document.getElementById("search-input");
  const search = searchInput ? searchInput.value.trim() : "";

  try {
    const result = await api.getProducts(activeCategory, search);
    const products = result.data;

    countEl.textContent = `Showing ${products.length} item${products.length !== 1 ? 's' : ''}`;

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🔍</div>
          <h3 class="empty-state-title">No products found</h3>
          <p class="empty-state-text">Try a different category or search term</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map((p, i) => `
      <div class="product-card" data-category="${p.category}" data-tilt
           style="animation-delay: ${i * 0.06}s" id="product-${p.id}">
        <span class="product-stock-badge ${p.inStock ? 'in-stock' : 'out-of-stock'}">
          ${p.inStock ? '✓ In Stock' : '✗ Out of Stock'}
        </span>
        <div class="product-card-image">
          <span class="product-emoji" id="emoji-${p.id}">${p.emoji}</span>
        </div>
        <div class="product-card-body">
          <h3 class="product-name">${p.name}</h3>
          <p class="product-desc">${p.description}</p>
          <div class="product-meta">
            <span class="product-price">$${p.price.toFixed(2)}</span>
            <span class="product-unit">${p.unit}</span>
          </div>
          <button class="btn-add-cart"
                  id="add-btn-${p.id}"
                  onclick="handleAddToCart(event, ${p.id}, '${p.name.replace(/'/g, "\\'")}')"
                  ${!p.inStock ? 'disabled' : ''}>
            <span>🛒</span>
            <span>${p.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    `).join("");

    // Init 3D card tilt after rendering
    Animations.initCardTilt();

    // Init scroll reveals
    Animations.initScrollReveal();

  } catch (err) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">⚠️</div>
        <h3 class="empty-state-title">Failed to load products</h3>
        <p class="empty-state-text">Please check your connection and try again</p>
      </div>
    `;
  }
}

async function handleAddToCart(event, productId, productName) {
  const btn = document.getElementById(`add-btn-${productId}`);
  const emojiEl = document.getElementById(`emoji-${productId}`);
  if (!btn) return;

  // Ripple effect on button
  if (event) Animations.rippleEffect(event, btn);

  // Fly-to-cart animation
  if (emojiEl) Animations.flyToCart(emojiEl);

  btn.disabled = true;
  btn.classList.add("added");
  btn.innerHTML = `<span>✓</span><span>Added!</span>`;

  try {
    const result = await api.addToCart(productId);
    // Animate badge update
    const badge = document.getElementById("cart-badge");
    if (badge) {
      const oldCount = parseInt(badge.textContent) || 0;
      Animations.animateCounter(badge, oldCount, result.count, 400);
      badge.classList.remove("hidden");
      badge.classList.add("bounce");
      badge.classList.add("glow");
      setTimeout(() => {
        badge.classList.remove("bounce");
        badge.classList.remove("glow");
      }, 800);
    }
    showToast(`${productName} added to cart`, "success");
  } catch (err) {
    showToast("Failed to add item", "error");
  }

  setTimeout(() => {
    btn.disabled = false;
    btn.classList.remove("added");
    btn.innerHTML = `<span>🛒</span><span>Add to Cart</span>`;
  }, 1200);
}

function renderSkeletons(count) {
  return Array(count).fill(`
    <div class="skeleton-card">
      <div class="skeleton-image"></div>
      <div class="skeleton-body">
        <div class="skeleton-line medium"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>
  `).join("");
}
