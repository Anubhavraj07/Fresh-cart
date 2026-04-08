// ─── App Router & Initialization ─────────────────────────────

// ── Toast System ────────────────────────────────────────
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icons = { success: "✅", error: "❌", info: "ℹ️" };
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// ── Cart Badge ──────────────────────────────────────────
function updateCartBadge(count) {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;

  const oldCount = parseInt(badge.textContent) || 0;

  // Animate the number change
  if (typeof Animations !== "undefined" && oldCount !== count) {
    Animations.animateCounter(badge, oldCount, count, 350);
  } else {
    badge.textContent = count;
  }

  badge.classList.toggle("hidden", count === 0);

  // Bounce + glow animation
  badge.classList.remove("bounce", "glow");
  void badge.offsetWidth; // force reflow
  badge.classList.add("bounce", "glow");
  setTimeout(() => {
    badge.classList.remove("bounce", "glow");
  }, 800);
}

// Fetch initial cart count
async function initCartBadge() {
  try {
    const result = await api.getCart();
    const badge = document.getElementById("cart-badge");
    if (badge) {
      badge.textContent = result.data.count;
      badge.classList.toggle("hidden", result.data.count === 0);
    }
  } catch {
    // silent fail
  }
}

// ── Router ──────────────────────────────────────────────
function getRoute() {
  const hash = window.location.hash || "#/";
  return hash.replace("#", "") || "/";
}

function navigateTo(route) {
  window.location.hash = `#${route}`;
}

async function handleRoute() {
  const route = getRoute();

  // Update nav active states
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");
  });

  // Hide/show search based on route
  const searchWrapper = document.getElementById("nav-search-wrapper");
  if (searchWrapper) {
    searchWrapper.style.display = route === "/" ? "" : "none";
  }

  switch (route) {
    case "/":
      renderProductsPage();
      break;
    case "/cart":
      renderCartPage();
      const ordersLink = document.getElementById("nav-orders");
      break;
    case "/checkout":
      renderCheckoutPage();
      break;
    case "/orders":
      renderOrdersPage();
      const ordersNav = document.getElementById("nav-orders");
      if (ordersNav) ordersNav.classList.add("active");
      break;
    default:
      renderProductsPage();
  }
}

// ── Search Debounce ─────────────────────────────────────
let searchTimeout;
function initSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;

  input.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if (getRoute() === "/") {
        loadProducts();
      }
    }, 300);
  });
}

// ── Scroll Effect ───────────────────────────────────────
function initScrollEffect() {
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  });
}

// ── Init ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initScrollEffect();
  initSearch();
  initCartBadge();
  handleRoute();

  window.addEventListener("hashchange", handleRoute);
});
