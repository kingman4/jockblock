/**
 * Jock Block Main Application
 */

import { Cart } from './cart.js';
import { validateForm } from './form-validation.js';

// Initialize cart
const cart = new Cart();

// Product data
const PRODUCT = {
  id: 'jockblock-60ml',
  name: 'Jock Block 60mL',
  price: 19.99
};

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

  // Sticky ATC
  stickyAtc: document.querySelector('[data-testid="sticky-atc"]'),
  stickyAddToCart: document.querySelector('[data-testid="sticky-add-to-cart"]'),

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
  setupCart();
  setupQuantitySelector();
  setupStickyAtc();
  setupFaq();
  setupContactForm();
  setupSmoothScroll();
  setupHeroBackground();
  updateCartUI();

  // Enable transitions after page load to prevent flash of animating elements
  requestAnimationFrame(() => {
    document.body.classList.add('transitions-ready');
  });
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

  // Add to cart
  function handleAddToCart() {
    const quantity = parseInt(elements.quantityInput?.value || '1', 10);
    cart.addItem(PRODUCT.id, quantity, PRODUCT.price);
    updateCartUI();

    // Brief animation feedback
    const btn = event.currentTarget;
    btn.textContent = 'Added!';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Add to Cart';
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

  cartItems.innerHTML = cart.items.map(item => `
    <div class="cart-item" data-item-id="${item.id}">
      <div class="cart-item-image">
        <span style="font-size: 10px; color: var(--color-accent);">JOCK<br>BLOCK</span>
      </div>
      <div class="cart-item-details">
        <div class="cart-item-name">${PRODUCT.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
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
  `).join('');

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

  const observer = new IntersectionObserver(
    ([entry]) => {
      stickyAtc.classList.toggle('visible', !entry.isIntersecting);
    },
    { threshold: 0, rootMargin: '-100px 0px 0px 0px' }
  );

  observer.observe(addToCartBtn);
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

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

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

    // Get total quantity from cart
    const quantity = cart.getItemCount();

    // Call serverless function to create Stripe session
    const response = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity })
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

// iOS viewport height fix
function setVH() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
window.addEventListener('resize', setVH);
setVH();

// Initialize app
document.addEventListener('DOMContentLoaded', init);

// Export for testing
export { cart, PRODUCT, updateCartUI };
