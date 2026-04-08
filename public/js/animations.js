// ─── Animations Utility Module ──────────────────────────────
// Lightweight animation helpers — zero dependencies, GPU-accelerated

const Animations = (() => {

  // ── Scroll Reveal via IntersectionObserver ───────────────
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".reveal-on-scroll").forEach(el => observer.observe(el));
    return observer;
  }

  // ── Fly-to-Cart Animation ───────────────────────────────
  function flyToCart(sourceEl) {
    const cartIcon = document.querySelector("#nav-cart-btn");
    if (!sourceEl || !cartIcon) return;

    const sourceRect = sourceEl.getBoundingClientRect();
    const targetRect = cartIcon.getBoundingClientRect();

    const flyEl = sourceEl.cloneNode(true);
    flyEl.className = "fly-element";
    flyEl.style.cssText = `
      position: fixed;
      z-index: 10000;
      left: ${sourceRect.left + sourceRect.width / 2}px;
      top: ${sourceRect.top + sourceRect.height / 2}px;
      font-size: 2rem;
      pointer-events: none;
      transition: none;
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    `;
    document.body.appendChild(flyEl);

    // Force reflow
    flyEl.offsetHeight;

    // Calculate trajectory
    const dx = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
    const dy = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);

    flyEl.style.transition = "all 0.65s cubic-bezier(0.22, 0.68, 0.35, 1.0)";
    flyEl.style.left = `${targetRect.left + targetRect.width / 2}px`;
    flyEl.style.top = `${targetRect.top + targetRect.height / 2}px`;
    flyEl.style.transform = "translate(-50%, -50%) scale(0.2)";
    flyEl.style.opacity = "0.3";

    flyEl.addEventListener("transitionend", () => {
      flyEl.remove();
      // Trigger cart icon pulse
      cartIcon.classList.add("cart-pulse");
      setTimeout(() => cartIcon.classList.remove("cart-pulse"), 600);
    }, { once: true });
  }

  // ── Click Ripple Effect ─────────────────────────────────
  function rippleEffect(e, el) {
    const ripple = document.createElement("span");
    ripple.className = "ripple-effect";
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    el.style.position = "relative";
    el.style.overflow = "hidden";
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  // ── Smooth Number Counter ───────────────────────────────
  function animateCounter(el, from, to, duration = 400) {
    if (from === to) return;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ── Magnetic Button Effect ──────────────────────────────
  function initMagneticButtons() {
    document.querySelectorAll(".magnetic-btn").forEach(btn => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  // ── 3D Card Tilt ────────────────────────────────────────
  function initCardTilt() {
    document.querySelectorAll("[data-tilt]").forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const tiltX = (0.5 - y) * 10;
        const tiltY = (x - 0.5) * 10;
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        card.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
        setTimeout(() => card.style.transition = "", 500);
      });

      card.addEventListener("mouseenter", () => {
        card.style.transition = "none";
      });
    });
  }

  // ── Confetti Burst (Lightweight) ────────────────────────
  function confettiBurst(x, y) {
    const colors = ["#6c5ce7", "#00b894", "#fd79a8", "#fdcb6e", "#a29bfe", "#ff6b6b"];
    const container = document.createElement("div");
    container.style.cssText = `
      position: fixed; left: 0; top: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 10001; overflow: hidden;
    `;
    document.body.appendChild(container);

    for (let i = 0; i < 50; i++) {
      const piece = document.createElement("div");
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 8 + 4;
      const startX = x || window.innerWidth / 2;
      const startY = y || window.innerHeight / 2;
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 300 + 150;
      const dx = Math.cos(angle) * velocity;
      const dy = Math.sin(angle) * velocity - 200;
      const rotation = Math.random() * 720 - 360;

      piece.style.cssText = `
        position: absolute;
        left: ${startX}px; top: ${startY}px;
        width: ${size}px; height: ${size * 0.6}px;
        background: ${color};
        border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
        opacity: 1;
        transform: translate(0, 0) rotate(0deg);
        transition: all ${Math.random() * 0.8 + 0.8}s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      `;
      container.appendChild(piece);

      // Force reflow
      piece.offsetHeight;

      piece.style.transform = `translate(${dx}px, ${dy + 400}px) rotate(${rotation}deg)`;
      piece.style.opacity = "0";
    }

    setTimeout(() => container.remove(), 2000);
  }

  // ── Stagger Children Animation ──────────────────────────
  function staggerChildren(parentSelector, delay = 0.06) {
    const parent = document.querySelector(parentSelector);
    if (!parent) return;
    Array.from(parent.children).forEach((child, i) => {
      child.style.animationDelay = `${i * delay}s`;
    });
  }

  // ── Particle Background ────────────────────────────────
  function initParticleBackground() {
    const canvas = document.getElementById("ambient-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animId;
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.3 + 0.05;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(162, 155, 254, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Create particles — fewer for performance
    for (let i = 0; i < 60; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animId = requestAnimationFrame(animate);
    }
    animate();

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cancelAnimationFrame(animId);
    }
  }

  // Public API
  return {
    initScrollReveal,
    flyToCart,
    rippleEffect,
    animateCounter,
    initMagneticButtons,
    initCardTilt,
    confettiBurst,
    staggerChildren,
    initParticleBackground
  };
})();
