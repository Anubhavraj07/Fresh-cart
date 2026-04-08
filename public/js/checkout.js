// ─── Checkout & Orders Page ──────────────────────────────────

async function renderCheckoutPage() {
  const app = document.getElementById("app");

  // Load cart first
  let cartData;
  try {
    const result = await api.getCart();
    cartData = result.data;
  } catch {
    app.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3 class="empty-state-title">Failed to load checkout</h3>
        <a href="#/cart" class="btn-empty-action">← Back to Cart</a>
      </div>
    `;
    return;
  }

  if (cartData.items.length === 0) {
    app.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🛒</div>
        <h3 class="empty-state-title">Your cart is empty</h3>
        <p class="empty-state-text">Add some items before checkout</p>
        <a href="#/" class="btn-empty-action">🛍️ Browse Products</a>
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <div class="page-header">
      <h1 class="page-title"><span class="emoji">💳</span>Checkout</h1>
      <p class="page-subtitle">Review and confirm your order</p>
    </div>

    <div class="checkout-layout">
      <div class="checkout-card">
        <h3 class="checkout-card-title">Your Details</h3>
        <div class="checkout-input-group">
          <label class="checkout-label" for="customer-name">Full Name</label>
          <input type="text" class="checkout-input" id="customer-name"
                 placeholder="Enter your name" value="Guest">
        </div>
      </div>

      <div class="checkout-card">
        <h3 class="checkout-card-title">Order Items (${cartData.count})</h3>
        <div class="checkout-items">
          ${cartData.items.map(item => {
            const p = item.product;
            if (!p) return "";
            return `
              <div class="checkout-item">
                <span class="checkout-item-emoji">${p.emoji}</span>
                <div class="checkout-item-info">
                  <div class="checkout-item-name">${p.name}</div>
                  <div class="checkout-item-qty">Qty: ${item.quantity} × $${p.price.toFixed(2)}</div>
                </div>
                <span class="checkout-item-price">$${(p.price * item.quantity).toFixed(2)}</span>
              </div>
            `;
          }).join("")}
        </div>

        <div class="summary-row label">
          <span>Subtotal</span>
          <span>$${cartData.subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row label">
          <span>Tax (8%)</span>
          <span>$${cartData.tax.toFixed(2)}</span>
        </div>
        <div class="summary-row label">
          <span>Delivery</span>
          <span style="color: var(--accent-green);">Free</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span class="amount">$${cartData.total.toFixed(2)}</span>
        </div>
      </div>

      <button class="btn-place-order" id="btn-place-order" onclick="handlePlaceOrder(event)">
        <span>🎉</span>
        <span>Place Order — $${cartData.total.toFixed(2)}</span>
      </button>
    </div>
  `;
}

async function handlePlaceOrder(event) {
  const btn = document.getElementById("btn-place-order");
  const nameInput = document.getElementById("customer-name");
  const customerName = nameInput ? nameInput.value.trim() || "Guest" : "Guest";

  // Ripple effect on button
  if (event && typeof Animations !== "undefined") {
    Animations.rippleEffect(event, btn);
  }

  btn.disabled = true;
  btn.innerHTML = `<span>⏳</span><span>Placing Order...</span>`;

  try {
    const result = await api.placeOrder(customerName);

    if (!result.success) {
      showToast(result.error || "Failed to place order", "error");
      btn.disabled = false;
      btn.innerHTML = `<span>🎉</span><span>Place Order</span>`;
      return;
    }

    const order = result.data;
    updateCartBadge(0);

    // Show success page with animated checkmark
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="order-success">
        <div class="success-checkmark">
          <svg viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 class="success-title">Order Placed!</h2>
        <p class="success-subtitle">Thank you, ${order.customerName}! Your order has been confirmed.</p>
        <div class="order-id-badge">📦 ${order.id}</div>
        <div class="summary-row total" style="justify-content: center; gap: 12px; border: none; padding: 0; margin-bottom: 28px;">
          <span>Total Paid:</span>
          <span class="amount">$${order.total.toFixed(2)}</span>
        </div>
        <div class="success-actions">
          <a href="#/" class="btn-success-action primary">🛍️ Continue Shopping</a>
          <a href="#/orders" class="btn-success-action secondary">📋 View Orders</a>
        </div>
      </div>
    `;

    // Trigger confetti celebration!
    if (typeof Animations !== "undefined") {
      setTimeout(() => {
        Animations.confettiBurst(window.innerWidth / 2, window.innerHeight / 3);
      }, 400);
    }

    showToast("Order placed successfully!", "success");
  } catch (err) {
    showToast("Network error. Please try again.", "error");
    btn.disabled = false;
    btn.innerHTML = `<span>🎉</span><span>Place Order</span>`;
  }
}

// ─── Orders History Page ─────────────────────────────────────

async function renderOrdersPage() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="page-header">
      <h1 class="page-title"><span class="emoji">📋</span>Order History</h1>
      <p class="page-subtitle">Track all your past orders</p>
    </div>
    <div id="orders-content">
      <div class="empty-state">
        <div class="empty-state-icon" style="opacity:0.3">⏳</div>
        <p class="empty-state-text">Loading orders...</p>
      </div>
    </div>
  `;

  try {
    const result = await api.getOrders();
    const orders = result.data;
    const container = document.getElementById("orders-content");

    if (orders.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <h3 class="empty-state-title">No orders yet</h3>
          <p class="empty-state-text">Place your first order to see it here</p>
          <a href="#/" class="btn-empty-action">🛍️ Start Shopping</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="orders-list">
        ${orders.map((order, i) => `
          <div class="order-card" style="animation-delay: ${i * 0.08}s" id="order-${order.id}">
            <div class="order-card-header">
              <span class="order-card-id">📦 ${order.id}</span>
              <span class="order-status-badge">${order.status}</span>
            </div>
            <div class="order-card-items">
              ${order.items.map(item => `
                <span class="order-item-chip">${item.emoji} ${item.name} ×${item.quantity}</span>
              `).join("")}
            </div>
            <div class="order-card-footer">
              <span>${new Date(order.createdAt).toLocaleString()}</span>
              <span class="order-card-total">$${order.total.toFixed(2)}</span>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  } catch (err) {
    document.getElementById("orders-content").innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3 class="empty-state-title">Failed to load orders</h3>
      </div>
    `;
  }
}
