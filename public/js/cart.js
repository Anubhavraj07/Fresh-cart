// ─── Cart Page ───────────────────────────────────────────────

async function renderCartPage() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="page-header">
      <h1 class="page-title"><span class="emoji">🛒</span>Your Cart</h1>
      <p class="page-subtitle">Review your items before checkout</p>
    </div>
    <div id="cart-content">
      <div class="empty-state">
        <div class="empty-state-icon" style="opacity:0.3">⏳</div>
        <p class="empty-state-text">Loading cart...</p>
      </div>
    </div>
  `;

  await loadCart();
}

async function loadCart() {
  const container = document.getElementById("cart-content");

  try {
    const result = await api.getCart();
    const { items, subtotal, tax, total, count } = result.data;

    updateCartBadge(count);

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🛒</div>
          <h3 class="empty-state-title">Your cart is empty</h3>
          <p class="empty-state-text">Start adding some delicious groceries!</p>
          <a href="#/" class="btn-empty-action">🛍️ Browse Products</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="cart-layout">
        <div class="cart-items-section">
          ${items.map((item, i) => {
            const p = item.product;
            if (!p) return "";
            const itemTotal = (p.price * item.quantity).toFixed(2);
            return `
              <div class="cart-item" style="animation-delay: ${i * 0.06}s" id="cart-item-${p.id}">
                <div class="cart-item-emoji">${p.emoji}</div>
                <div class="cart-item-details">
                  <div class="cart-item-name">${p.name}</div>
                  <div class="cart-item-price">$${p.price.toFixed(2)} / ${p.unit}</div>
                </div>
                <div class="cart-item-controls">
                  <div class="qty-controls">
                    <button class="qty-btn" onclick="updateCartQty(${p.id}, ${item.quantity - 1})" id="qty-dec-${p.id}">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateCartQty(${p.id}, ${item.quantity + 1})" id="qty-inc-${p.id}">+</button>
                  </div>
                  <span class="cart-item-total">$${itemTotal}</span>
                  <button class="btn-remove-item" onclick="removeCartItem(${p.id}, '${p.name.replace(/'/g, "\\'")}')" id="remove-btn-${p.id}" title="Remove item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 6h18"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <div class="cart-summary">
          <h3 class="cart-summary-title">Order Summary</h3>
          <div class="summary-row label">
            <span>Subtotal (${count} items)</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          <div class="summary-row label">
            <span>Tax (8%)</span>
            <span>$${tax.toFixed(2)}</span>
          </div>
          <div class="summary-row label">
            <span>Delivery</span>
            <span style="color: var(--accent-green);">Free</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span class="amount">$${total.toFixed(2)}</span>
          </div>
          <a href="#/checkout" class="btn-checkout" id="btn-checkout">
            <span>Proceed to Checkout</span>
            <span>→</span>
          </a>
          <a href="#/" class="btn-continue">← Continue Shopping</a>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3 class="empty-state-title">Failed to load cart</h3>
        <p class="empty-state-text">Please try again later</p>
      </div>
    `;
  }
}

async function updateCartQty(productId, newQty) {
  if (newQty <= 0) {
    return removeCartItem(productId);
  }
  try {
    const result = await api.updateCartItem(productId, newQty);
    updateCartBadge(result.count);
    await loadCart();
  } catch (err) {
    showToast("Failed to update quantity", "error");
  }
}

async function removeCartItem(productId, name) {
  // Animate item removal
  const itemEl = document.getElementById(`cart-item-${productId}`);
  if (itemEl) {
    itemEl.style.transition = "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
    itemEl.style.transform = "translateX(60px)";
    itemEl.style.opacity = "0";
    await new Promise(r => setTimeout(r, 350));
  }

  try {
    const result = await api.removeFromCart(productId);
    updateCartBadge(result.count);
    showToast(name ? `${name} removed` : "Item removed", "info");
    await loadCart();
  } catch (err) {
    showToast("Failed to remove item", "error");
  }
}
