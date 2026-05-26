/**
 * Jock Block Main Application
 */

import { Cart } from './cart.js';
import { validateForm } from './form-validation.js';
import { MARKET_DATE } from './site-config.js';

// Initialize cart
const cart = new Cart();

/**
 * Check if site is in presale mode
 */
function isPresaleMode() {
  if (!MARKET_DATE) return false;
  const marketDate = new Date(MARKET_DATE + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today <= marketDate;
}

/**
 * Format date for display (e.g., "March 1, 2026")
 */
function formatMarketDate() {
  if (!MARKET_DATE) return '';
  const date = new Date(MARKET_DATE + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// Variant catalog — keys are SKUs. Prices here are display-only; the Stripe
// checkout function re-validates against its own server-side prices.
const VARIANTS = {
  'jockblock-100ml': {
    sku: 'jockblock-100ml',
    name: 'Jock Block 100mL',
    sizeLabel: '100mL',
    price: 19.99,
    volumeOz: '3.4 FL OZ',
    volumeMl: '100 mL'
  },
  'jockblock-20ml': {
    sku: 'jockblock-20ml',
    name: 'Jock Block 20mL (Travel)',
    sizeLabel: '20mL',
    price: 9.99,
    volumeOz: '0.68 OZ',
    volumeMl: '20 mL'
  }
};

const DEFAULT_SKU = 'jockblock-100ml';
let selectedSku = DEFAULT_SKU;

const formatPrice = (n) => `$${n.toFixed(2)}`;

// DOM Elements
const elements = {
  // Header
  mobileMenuBtn: document.querySelector('[data-testid="mobile-menu-button"]'),
  mobileNav: document.querySelector('[data-testid="mobile-nav"]'),
  mobileNavClose: document.querySelector('[data-testid="mobile-nav-close"]'),
  mobileNavOverlay: document.querySelector('[data-testid="mobile-nav-overlay"]'),

  // Cart
  cartIcon: document.querySelector('[data-testid="cart-icon"]'),
  cartCount: document.querySelector('[data-testid="cart-count"]'),
  cartDrawer: document.querySelector('[data-testid="cart-drawer"]'),
  cartDrawerCount: document.querySelector('[data-testid="cart-drawer-count"]'),
  cartOverlay: document.querySelector('[data-testid="cart-overlay"]'),
  cartClose: document.querySelector('[data-testid="cart-close"]'),
  cartItems: document.querySelector('[data-testid="cart-items"]'),
  cartEmpty: document.querySelector('[data-testid="empty-cart-message"]'),
  cartTotal: document.querySelector('[data-testid="cart-total"]'),
  checkoutBtn: document.querySelector('[data-testid="checkout-button"]'),

  // Product
  addToCartBtn: document.querySelector('[data-testid="add-to-cart"]'),
  quantityInput: document.querySelector('[data-testid="item-quantity"]'),
  quantityIncrease: document.querySelector('[data-testid="quantity-increase"]'),
  quantityDecrease: document.querySelector('[data-testid="quantity-decrease"]'),
  productPrice: document.querySelector('[data-testid="product-price"]'),
  productTitleSize: document.querySelector('[data-testid="product-title-size"]'),
  productImageVolumeOz: document.querySelector('[data-testid="product-image-volume-oz"]'),
  productImageVolumeMl: document.querySelector('[data-testid="product-image-volume-ml"]'),
  sizeOptions: document.querySelectorAll('[data-sku]'),

  // Sticky ATC
  stickyAtc: document.querySelector('[data-testid="sticky-atc"]'),
  stickyAddToCart: document.querySelector('[data-testid="sticky-add-to-cart"]'),
  stickyAtcPrice: document.querySelector('[data-testid="sticky-atc-price"]'),

  // FAQ
  faqItems: document.querySelectorAll('.faq-item'),

  // Contact Form
  contactForm: document.querySelector('[data-testid="contact-form"]')
};

/**
 * Initialize the application
 */
function init() {
  setupMobileNav();
  setupSizeSelector();
  setupCart();
  setupQuantitySelector();
  setupStickyAtc();
  setupFaq();
  setupContactForm();
  setupSmoothScroll();
  setupHeroBackground();
  setupReviews();
  setupPresale();
  updateCartUI();

  // Enable transitions after page load to prevent flash of animating elements
  requestAnimationFrame(() => {
    document.body.classList.add('transitions-ready');
  });
}

/**
 * Setup Presale Mode
 * Changes button text and adds shipping date message
 */
function setupPresale() {
  if (!isPresaleMode()) return;

  const { addToCartBtn, stickyAddToCart } = elements;
  const shippingDate = formatMarketDate();

  // Update button text
  if (addToCartBtn) {
    addToCartBtn.textContent = 'Pre-order Now';
    addToCartBtn.setAttribute('data-presale', 'true');
  }

  if (stickyAddToCart) {
    stickyAddToCart.textContent = 'Pre-order Now';
    stickyAddToCart.setAttribute('data-presale', 'true');
  }

  // Add presale message below the add to cart button
  if (addToCartBtn) {
    const presaleMessage = document.createElement('p');
    presaleMessage.className = 'presale-message';
    presaleMessage.setAttribute('data-testid', 'presale-message');
    presaleMessage.innerHTML = `<strong>Pre-order:</strong> Ships on ${shippingDate}`;
    addToCartBtn.parentNode.insertBefore(presaleMessage, addToCartBtn.nextSibling);
  }

  // Add class to body for any additional styling
  document.body.classList.add('presale-mode');
}

/**
 * Hero Background Image with Fallback
 */
function setupHeroBackground() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Test if background image loads successfully
  const img = new Image();
  img.src = 'images/hero-bg.jpg';

  img.onload = () => {
    // Image loaded successfully, apply it
    hero.classList.add('has-bg-image');
  };

  // If error, the default CSS gradient pattern is already applied
}

/**
 * Mobile Navigation
 */
function setupMobileNav() {
  const { mobileMenuBtn, mobileNav, mobileNavClose, mobileNavOverlay } = elements;

  function openMobileNav() {
    mobileNav.classList.add('open');
    mobileNavOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    mobileNavOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  mobileMenuBtn?.addEventListener('click', openMobileNav);
  mobileNavClose?.addEventListener('click', closeMobileNav);
  mobileNavOverlay?.addEventListener('click', closeMobileNav);

  // Close on nav link click
  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });
}

/**
 * Size Selector — toggles selected variant and refreshes displayed price/title
 */
function setupSizeSelector() {
  const { sizeOptions } = elements;
  if (!sizeOptions || sizeOptions.length === 0) return;

  sizeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const sku = opt.dataset.sku;
      if (!VARIANTS[sku]) return;
      selectedSku = sku;

      sizeOptions.forEach(o => {
        const isActive = o.dataset.sku === sku;
        o.classList.toggle('active', isActive);
        o.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      refreshSelectedVariantUI();
    });
  });

  refreshSelectedVariantUI();
}

/**
 * Reflect the selected variant in price, title, banded-box volumes, sticky ATC.
 */
function refreshSelectedVariantUI() {
  const variant = VARIANTS[selectedSku];
  if (!variant) return;

  const {
    productPrice, productTitleSize,
    productImageVolumeOz, productImageVolumeMl,
    stickyAtcPrice
  } = elements;

  if (productPrice) productPrice.textContent = formatPrice(variant.price);
  if (productTitleSize) productTitleSize.textContent = variant.sizeLabel;
  if (productImageVolumeOz) productImageVolumeOz.textContent = variant.volumeOz;
  if (productImageVolumeMl) productImageVolumeMl.textContent = variant.volumeMl;
  if (stickyAtcPrice) stickyAtcPrice.textContent = formatPrice(variant.price);
}

/**
 * Cart Functionality
 */
function setupCart() {
  const { cartIcon, cartDrawer, cartOverlay, cartClose, addToCartBtn, stickyAddToCart, checkoutBtn } = elements;

  function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  cartIcon?.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  // Any in-page link inside the drawer (e.g. empty-cart "Shop Now")
  // should also close the drawer when followed.
  cartDrawer?.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', closeCart);
  });

  // Add to cart — uses currently selected size variant
  function handleAddToCart(event) {
    const variant = VARIANTS[selectedSku];
    if (!variant) return;

    const quantity = parseInt(elements.quantityInput?.value || '1', 10);
    cart.addItem(variant.sku, quantity, variant.price);
    updateCartUI();

    // Brief animation feedback on the clicked button
    const btn = event.currentTarget;
    const originalText = btn.textContent;
    btn.textContent = 'Added!';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1000);

    // Open cart drawer
    setTimeout(openCart, 300);
  }

  addToCartBtn?.addEventListener('click', handleAddToCart);
  stickyAddToCart?.addEventListener('click', handleAddToCart);

  // Checkout
  checkoutBtn?.addEventListener('click', handleCheckout);
}

/**
 * Update Cart UI
 */
function updateCartUI() {
  const { cartCount, cartDrawerCount, cartTotal, cartItems, cartEmpty } = elements;
  const itemCount = cart.getItemCount();
  const total = cart.getTotal();

  // Update counts
  if (cartCount) cartCount.textContent = itemCount;
  if (cartDrawerCount) cartDrawerCount.textContent = itemCount;

  // Update total
  if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;

  // Update cart items display
  if (cart.isEmpty()) {
    if (cartItems) cartItems.style.display = 'none';
    if (cartEmpty) cartEmpty.style.display = 'block';
  } else {
    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartItems) {
      cartItems.style.display = 'block';
      renderCartItems();
    }
  }
}

/**
 * Render Cart Items
 */
function renderCartItems() {
  const { cartItems } = elements;
  if (!cartItems) return;

  cartItems.innerHTML = cart.items.map(item => {
    const variant = VARIANTS[item.id];
    const displayName = variant ? variant.name : item.id;
    return `
    <div class="cart-item" data-item-id="${item.id}" data-testid="cart-item-${item.id}">
      <div class="cart-item-image">
        <span style="font-size: 10px; font-family: var(--font-display); color: var(--color-cherry); line-height: 0.9; text-align: center;">JOCK<br>BLOCK</span>
      </div>
      <div class="cart-item-details">
        <div class="cart-item-name">${displayName}</div>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="cart-item-actions">
          <div class="quantity-selector" style="transform: scale(0.8); transform-origin: left;">
            <button class="quantity-btn cart-qty-decrease" aria-label="Decrease">−</button>
            <input type="number" class="quantity-input cart-qty-input" value="${item.quantity}" min="1" max="10" readonly>
            <button class="quantity-btn cart-qty-increase" aria-label="Increase">+</button>
          </div>
          <button class="cart-item-remove" data-testid="remove-item">Remove</button>
        </div>
      </div>
    </div>
  `;
  }).join('');

  // Add event listeners for quantity buttons
  cartItems.querySelectorAll('.cart-item').forEach(itemEl => {
    const itemId = itemEl.dataset.itemId;

    itemEl.querySelector('.cart-qty-decrease')?.addEventListener('click', () => {
      const item = cart.getItem(itemId);
      if (item && item.quantity > 1) {
        cart.updateQuantity(itemId, item.quantity - 1);
        updateCartUI();
      }
    });

    itemEl.querySelector('.cart-qty-increase')?.addEventListener('click', () => {
      const item = cart.getItem(itemId);
      if (item && item.quantity < 10) {
        cart.updateQuantity(itemId, item.quantity + 1);
        updateCartUI();
      }
    });

    itemEl.querySelector('.cart-item-remove')?.addEventListener('click', () => {
      cart.removeItem(itemId);
      updateCartUI();
    });
  });
}

/**
 * Quantity Selector
 */
function setupQuantitySelector() {
  const { quantityInput, quantityIncrease, quantityDecrease } = elements;

  quantityIncrease?.addEventListener('click', () => {
    const current = parseInt(quantityInput.value, 10);
    if (current < 10) {
      quantityInput.value = current + 1;
    }
  });

  quantityDecrease?.addEventListener('click', () => {
    const current = parseInt(quantityInput.value, 10);
    if (current > 1) {
      quantityInput.value = current - 1;
    }
  });

  quantityInput?.addEventListener('change', () => {
    let value = parseInt(quantityInput.value, 10);
    if (isNaN(value) || value < 1) value = 1;
    if (value > 10) value = 10;
    quantityInput.value = value;
  });
}

/**
 * Sticky Add to Cart
 */
function setupStickyAtc() {
  const { addToCartBtn, stickyAtc } = elements;
  if (!addToCartBtn || !stickyAtc) return;

  const heroCta = document.querySelector('.hero .btn-primary');
  const watched = [addToCartBtn, heroCta].filter(Boolean);
  const visibility = new Map(watched.map(el => [el, false]));

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) visibility.set(entry.target, entry.isIntersecting);
      const anyVisible = Array.from(visibility.values()).some(Boolean);
      stickyAtc.classList.toggle('visible', !anyVisible);
    },
    { threshold: 0, rootMargin: '-100px 0px 0px 0px' }
  );

  watched.forEach(el => observer.observe(el));
}

/**
 * FAQ Accordion
 */
function setupFaq() {
  elements.faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');

      // Close all
      elements.faqItems.forEach(i => i.classList.remove('open'));

      // Toggle clicked
      if (!wasOpen) {
        item.classList.add('open');
      }
    });
  });
}

/**
 * Contact Form
 */
function setupContactForm() {
  const { contactForm } = elements;
  if (!contactForm) return;

  // Record form load time for bot detection
  const formLoadTime = Date.now();
  const MIN_SUBMIT_TIME_MS = 3000; // Minimum 3 seconds before submission

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Time-based bot check: reject if submitted too quickly
    const timeSinceLoad = Date.now() - formLoadTime;
    if (timeSinceLoad < MIN_SUBMIT_TIME_MS) {
      console.log('Bot detected: form submitted too quickly');
      return;
    }

    const formData = {
      name: contactForm.querySelector('#name').value,
      email: contactForm.querySelector('#email').value,
      message: contactForm.querySelector('#message').value,
      honeypot: contactForm.querySelector('[name="bot-field"]')?.value || ''
    };

    // Clear previous errors
    contactForm.querySelectorAll('.form-error').forEach(el => el.remove());

    // Validate
    const result = validateForm(formData);

    if (result.isBot) {
      // Silently reject bot submissions
      console.log('Bot detected');
      return;
    }

    if (!result.isValid) {
      // Show errors
      Object.entries(result.errors).forEach(([field, message]) => {
        const input = contactForm.querySelector(`#${field}`);
        if (input) {
          const error = document.createElement('span');
          error.className = 'form-error';
          error.setAttribute('role', 'alert');
          error.setAttribute('aria-live', 'polite');
          error.setAttribute('data-testid', `${field}-error`);
          error.textContent = message;
          input.parentNode.appendChild(error);
        }
      });
      return;
    }

    // Submit to Netlify Forms
    const submitBtn = contactForm.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(contactForm)).toString()
      });

      if (response.ok) {
        alert('Message sent! We\'ll get back to you soon.');
        contactForm.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form error:', error);
      alert('There was a problem sending your message. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

/**
 * Smooth Scroll
 */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height-mobile'), 10) || 56;
        const top = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top,
          behavior: 'smooth'
        });
      }
    });
  });

  // On the index page, intercept the header logo so it scroll-to-tops
  // instead of reloading. On other pages the href="/" still navigates home.
  const path = window.location.pathname;
  const onIndex = path === '/' || path.endsWith('/index.html');
  if (onIndex) {
    document.querySelectorAll('.header-logo').forEach(logo => {
      logo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }
}

/**
 * Handle Checkout - Create Stripe Checkout Session
 */
async function handleCheckout() {
  if (cart.isEmpty()) {
    alert('Your cart is empty!');
    return;
  }

  const checkoutBtn = elements.checkoutBtn;
  const originalText = checkoutBtn.textContent;

  try {
    // Update UI
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = 'Processing...';

    // Send the full cart line by line — server validates SKUs + prices.
    const items = cart.items.map(item => ({
      sku: item.id,
      quantity: item.quantity
    }));

    const response = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items })
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { url } = await response.json();

    // Redirect to Stripe Checkout
    window.location.href = url;

  } catch (error) {
    console.error('Checkout error:', error);
    alert('There was a problem starting checkout. Please try again.');
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = originalText;
  }
}

/**
 * Load and Display Reviews
 */
async function setupReviews() {
  const reviewsSection = document.querySelector('#reviews');
  const reviewsGrid = document.querySelector('[data-testid="reviews-grid"]');

  if (!reviewsSection || !reviewsGrid) return;

  // Hide section by default until we know there are reviews
  reviewsSection.style.display = 'none';

  try {
    // Try API first (production), fall back to static JSON (development)
    let reviews = [];
    try {
      const apiResponse = await fetch('/.netlify/functions/get-reviews');
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        reviews = apiData.reviews || [];
      }
    } catch (e) {
      console.log('API not available, trying static JSON');
    }

    // Fallback to static JSON for local development
    if (reviews.length === 0) {
      const jsonResponse = await fetch('/data/reviews.json');
      if (jsonResponse.ok) {
        const jsonData = await jsonResponse.json();
        reviews = jsonData.reviews || [];
      }
    }

    // Only show section if there are reviews
    if (reviews.length === 0) {
      return;
    }

    // Show the section
    reviewsSection.style.display = '';

    // Sort by date (newest first) and take top 6
    const displayReviews = reviews
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);

    reviewsGrid.innerHTML = displayReviews.map(review => `
      <div class="review-card">
        <div class="review-header">
          <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
          <span class="review-date">${formatDate(review.date)}</span>
        </div>
        <p class="review-text">${escapeHtml(review.review)}</p>
        <div class="review-author">
          <span class="review-name">${escapeHtml(review.name)}</span>
          ${review.verified ? `
            <span class="review-verified">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              Verified
            </span>
          ` : ''}
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Error loading reviews:', error);
    // Keep section hidden on error
  }
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  // Append time component to avoid UTC parsing shifting the date in negative-offset timezones
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// iOS viewport height fix
function setVH() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
window.addEventListener('resize', setVH);
setVH();

// Initialize app
document.addEventListener('DOMContentLoaded', init);

// Export for testing
export { cart, VARIANTS, updateCartUI };
