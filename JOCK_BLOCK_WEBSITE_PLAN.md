# Jock Block E-Commerce Website Development Plan

## Project Overview

**Product:** Jock Block - Homeopathic antifungal spray
**Active Ingredient:** Sulfur
**Use Case:** Treatment of jock itch and ringworm
**Tagline:** "Defense Below the Belt"
**Aesthetic:** Modern & Minimal
**Tech Stack:** Custom HTML/CSS/JavaScript

---

## 1. Site Architecture

### Pages Required

```
/
├── index.html          (Homepage + Product Landing)
├── about.html          (Brand Story & Ingredients)
├── how-it-works.html   (Usage Instructions & Science)
├── faq.html            (Common Questions)
├── contact.html        (Support & Contact Form)
├── cart.html           (Shopping Cart)
├── checkout.html       (Checkout Flow)
├── privacy.html        (Privacy Policy)
├── terms.html          (Terms of Service)
└── returns.html        (Return Policy)
```

### Recommended Single-Page Approach
For a single-product store with minimal aesthetic, consider a **single-page application** structure:
- All content on one scrolling page with smooth anchor navigation
- Cart as a slide-out drawer
- Checkout handled by payment processor (Stripe/PayPal)

---

## 2. Homepage / Landing Page Structure

### Hero Section
- **Headline:** "Defense Below the Belt" (in green-bordered box, matching label)
- **Subheadline:** Natural homeopathic antifungal relief
- **Hero Image:** Product shot on dark background (matching label aesthetic)
- **Primary CTA:** "Shop Now" button (mint green)
- **Trust Badges:** Homeopathic Medicine, Natural Ingredients, Easy Spray Application

### Product Showcase Section
- Large product photography (multiple angles)
- Size options (if applicable)
- Price display
- "Add to Cart" button with quantity selector
- Brief bullet points: Fast-acting, Natural sulfur formula, Easy spray application

### How It Works Section
- 3-step visual: **Shake → Spray → Relief**
- Step 1: "Shake Well" - ensures even distribution of ingredients
- Step 2: "Spray from 4-6 inches" - proper application distance
- Step 3: "Apply 2-3× daily" - consistent treatment schedule
- Simple iconography with brief explanations
- Timeline callout: "Jock itch/ringworm: 2 weeks | Athlete's foot: 4 weeks"
- Link to detailed usage page

### Ingredients Section
- Highlight sulfur as the active ingredient
- Brief explanation of homeopathic approach
- "Learn More" link to ingredients deep-dive

### Social Proof Section
- Customer testimonials (anonymized for sensitivity)
- Star ratings
- "Results in X days" type claims (if substantiated)

### FAQ Preview
- 4-5 most common questions
- Expandable accordion style
- Link to full FAQ page

### Footer
- Navigation links
- Contact information
- Social media icons
- Newsletter signup
- Legal links (Privacy, Terms, Returns)

---

## 3. Design System

### Color Palette (Matching Product Label)

The website theme is derived directly from the product label: **black background, bright mint green accents, and gold/amber highlights**.

```css
:root {
  /* Primary - Dark Background (from label) */
  --color-primary: #0A0A0A;        /* Rich black - main background */
  --color-primary-light: #1A1A1A;  /* Slightly lighter for cards/sections */
  --color-primary-dark: #000000;   /* Pure black for contrast */

  /* Accent - Mint Green (from label "JOCK" text & tagline box) */
  --color-accent: #00E676;         /* Bright mint green - primary accent */
  --color-accent-light: #69F0AE;   /* Lighter mint for hovers */
  --color-accent-dark: #00C853;    /* Darker mint for pressed states */
  --color-accent-glow: rgba(0, 230, 118, 0.3);  /* For glowing effects */

  /* Secondary - Gold/Amber (from label "RELIEVES:" text) */
  --color-secondary: #D4A853;      /* Gold/amber - secondary highlights */
  --color-secondary-light: #E8C87A; /* Lighter gold for hovers */

  /* Neutral */
  --color-white: #FFFFFF;
  --color-off-white: #F5F5F5;
  --color-gray-100: #E0E0E0;
  --color-gray-300: #9E9E9E;
  --color-gray-500: #757575;
  --color-gray-700: #424242;
  --color-black: #0A0A0A;

  /* Semantic */
  --color-success: #00E676;        /* Uses accent green */
  --color-error: #FF5252;
  --color-warning: #D4A853;        /* Uses secondary gold */
}
```

### Visual Style Notes

**Dark Theme Approach:**
- Primary background: Rich black (#0A0A0A)
- Text: White/light gray for readability
- Accent elements: Bright mint green (#00E676) for CTAs, links, highlights
- Secondary accents: Gold (#D4A853) for special callouts like "RELIEVES:"

**Label-Inspired Elements:**
- Green border/outline treatment (like the tagline box on label)
- Uppercase, wide-letterspaced text for headings (matches "DEFENSE BELOW THE BELT")
- Clean separation between sections with subtle borders
- Product imagery on dark backgrounds to match label aesthetic

### Typography

```css
/* Font Stack - Clean, modern sans-serif to match label */
--font-heading: 'Bebas Neue', 'Oswald', sans-serif;  /* Bold condensed for "JOCK BLOCK" style */
--font-subheading: 'Inter', sans-serif;              /* Clean sans for taglines */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

### Spacing System

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-24: 6rem;     /* 96px */
```

### Component Styles

**Buttons**
- Primary: Solid mint green (#00E676), black text, subtle glow on hover
- Secondary: Outlined with mint green border, transparent background, green text
- Tertiary: Gold accent for special actions
- Border radius: 2px (sharp, minimal rounding to match label aesthetic)
- Padding: 14px 28px
- Hover: Subtle green glow effect (box-shadow with accent-glow color)
- Text: Uppercase, letter-spacing: 0.1em

**Cards**
- Dark background (#1A1A1A)
- Mint green border (1px solid) or subtle green glow
- 4px border radius (sharp corners)
- Generous padding (24px)

**Forms**
- Dark input fields with mint green border on focus
- Placeholder text in gray-500
- Focus state: green glow effect
- Clear labels above inputs in white
- Inline validation messages in accent colors

**Special Elements (Label-Inspired)**
- Tagline boxes: Green border with wide letter-spacing text inside
- Section headers: Gold text for category labels (like "RELIEVES:")
- Bullet points: Green arrow/triangle markers (▸) matching label style

---

## 4. Technical Implementation

### File Structure

```
jockblock/
├── index.html
├── css/
│   ├── reset.css           (CSS reset/normalize)
│   ├── variables.css       (Design tokens)
│   ├── base.css            (Base element styles)
│   ├── components.css      (Reusable components)
│   ├── layout.css          (Grid/flexbox layouts)
│   └── pages.css           (Page-specific styles)
├── js/
│   ├── main.js             (Main application logic)
│   ├── cart.js             (Shopping cart functionality)
│   ├── checkout.js         (Checkout integration)
│   ├── animations.js       (Scroll animations, transitions)
│   └── form-validation.js  (Form handling)
├── __tests__/              (Test files - TDD)
│   ├── unit/
│   │   ├── cart.test.js
│   │   ├── form-validation.test.js
│   │   └── utils.test.js
│   ├── integration/
│   │   ├── checkout-flow.test.js
│   │   └── newsletter-signup.test.js
│   └── e2e/
│       ├── purchase.spec.js
│       ├── navigation.spec.js
│       └── mobile.spec.js
├── images/
│   ├── product/            (Product photography)
│   ├── icons/              (UI icons - SVG preferred)
│   └── misc/               (Other imagery)
├── fonts/                  (Self-hosted fonts if needed)
├── pages/
│   ├── about.html
│   ├── faq.html
│   └── ...
├── jest.config.js          (Jest configuration)
├── playwright.config.js    (Playwright E2E configuration)
└── package.json
```

### Key JavaScript Features

**Shopping Cart**
```javascript
// Cart stored in localStorage
const cart = {
  items: [],
  addItem(productId, quantity),
  removeItem(productId),
  updateQuantity(productId, quantity),
  getTotal(),
  getItemCount(),
  clear()
};
```

**Smooth Scrolling**
- Intersection Observer for scroll animations
- Smooth scroll to anchor links
- Sticky header with scroll detection

**Form Handling**
- Client-side validation
- Email format checking
- Required field validation
- Async submission with loading states

### Payment Integration Options

**Recommended: Stripe Checkout**
- Hosted checkout page (simplest, most secure)
- No need to handle card data
- Built-in fraud protection
- Subscription support for future

**Alternative: PayPal**
- Wide trust/recognition
- PayPal + card payments
- Easy integration

**Implementation Approach:**
1. "Buy Now" button redirects to Stripe Checkout
2. Stripe handles entire payment flow
3. Webhook confirms order completion
4. Thank you page with order confirmation

---

## 5. Test-Driven Development (TDD)

### TDD Philosophy

**Write tests FIRST, then write code to pass them.**

The development cycle for each feature:
1. **RED** — Write a failing test that defines expected behavior
2. **GREEN** — Write minimal code to make the test pass
3. **REFACTOR** — Improve code while keeping tests green

### Testing Stack

| Tool | Purpose | Why |
|------|---------|-----|
| **Jest** | Unit & integration tests | Fast, zero-config, great mocking |
| **Testing Library** | DOM testing | Tests behavior, not implementation |
| **Playwright** | End-to-end tests | Cross-browser, reliable, fast |
| **axe-core** | Accessibility testing | WCAG compliance checking |

**Package.json test scripts:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:a11y": "jest --testPathPattern=accessibility"
  }
}
```

### Unit Tests (Jest + Testing Library)

**Cart Module — Write tests BEFORE implementing cart.js:**

```javascript
// __tests__/unit/cart.test.js
import { Cart } from '../../js/cart.js';

describe('Cart', () => {
  let cart;

  beforeEach(() => {
    cart = new Cart();
    localStorage.clear();
  });

  describe('addItem', () => {
    test('adds new item to empty cart', () => {
      cart.addItem('jockblock-60ml', 1, 19.99);

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0]).toEqual({
        id: 'jockblock-60ml',
        quantity: 1,
        price: 19.99
      });
    });

    test('increments quantity for existing item', () => {
      cart.addItem('jockblock-60ml', 1, 19.99);
      cart.addItem('jockblock-60ml', 2, 19.99);

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(3);
    });

    test('persists to localStorage', () => {
      cart.addItem('jockblock-60ml', 1, 19.99);

      const stored = JSON.parse(localStorage.getItem('jockblock-cart'));
      expect(stored.items).toHaveLength(1);
    });
  });

  describe('removeItem', () => {
    test('removes item from cart', () => {
      cart.addItem('jockblock-60ml', 1, 19.99);
      cart.removeItem('jockblock-60ml');

      expect(cart.items).toHaveLength(0);
    });

    test('does nothing for non-existent item', () => {
      cart.addItem('jockblock-60ml', 1, 19.99);
      cart.removeItem('non-existent');

      expect(cart.items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    test('updates quantity for existing item', () => {
      cart.addItem('jockblock-60ml', 1, 19.99);
      cart.updateQuantity('jockblock-60ml', 5);

      expect(cart.items[0].quantity).toBe(5);
    });

    test('removes item when quantity set to 0', () => {
      cart.addItem('jockblock-60ml', 1, 19.99);
      cart.updateQuantity('jockblock-60ml', 0);

      expect(cart.items).toHaveLength(0);
    });

    test('rejects negative quantities', () => {
      cart.addItem('jockblock-60ml', 1, 19.99);

      expect(() => cart.updateQuantity('jockblock-60ml', -1))
        .toThrow('Quantity cannot be negative');
    });
  });

  describe('getTotal', () => {
    test('returns 0 for empty cart', () => {
      expect(cart.getTotal()).toBe(0);
    });

    test('calculates total for single item', () => {
      cart.addItem('jockblock-60ml', 2, 19.99);

      expect(cart.getTotal()).toBe(39.98);
    });

    test('calculates total for multiple items', () => {
      cart.addItem('jockblock-60ml', 2, 19.99);
      cart.addItem('jockblock-120ml', 1, 29.99);

      expect(cart.getTotal()).toBe(69.97);
    });
  });

  describe('getItemCount', () => {
    test('returns total quantity across all items', () => {
      cart.addItem('jockblock-60ml', 2, 19.99);
      cart.addItem('jockblock-120ml', 3, 29.99);

      expect(cart.getItemCount()).toBe(5);
    });
  });

  describe('clear', () => {
    test('empties cart and localStorage', () => {
      cart.addItem('jockblock-60ml', 1, 19.99);
      cart.clear();

      expect(cart.items).toHaveLength(0);
      expect(localStorage.getItem('jockblock-cart')).toBeNull();
    });
  });
});
```

**Form Validation Module:**

```javascript
// __tests__/unit/form-validation.test.js
import { validateEmail, validateRequired, validateForm } from '../../js/form-validation.js';

describe('Form Validation', () => {
  describe('validateEmail', () => {
    test('accepts valid email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    test('rejects invalid email', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });

    test('rejects disposable email domains', () => {
      expect(validateEmail('user@tempmail.com')).toBe(false);
      expect(validateEmail('user@guerrillamail.com')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    test('accepts non-empty values', () => {
      expect(validateRequired('hello')).toBe(true);
      expect(validateRequired('  text  ')).toBe(true);
    });

    test('rejects empty values', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
    });
  });

  describe('validateForm (contact form)', () => {
    const validForm = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello, I have a question.',
      honeypot: '' // Should be empty
    };

    test('passes with valid data', () => {
      const result = validateForm(validForm);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('fails with missing required fields', () => {
      const result = validateForm({ ...validForm, name: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('Name is required');
    });

    test('fails with invalid email', () => {
      const result = validateForm({ ...validForm, email: 'invalid' });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email');
    });

    test('detects bot via honeypot', () => {
      const result = validateForm({ ...validForm, honeypot: 'bot-filled-this' });
      expect(result.isValid).toBe(false);
      expect(result.isBot).toBe(true);
    });
  });
});
```

### Integration Tests

**Checkout Flow Integration:**

```javascript
// __tests__/integration/checkout-flow.test.js
import { Cart } from '../../js/cart.js';
import { initiateCheckout } from '../../js/checkout.js';

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    redirectToCheckout: jest.fn(() => Promise.resolve({ error: null }))
  }))
}));

describe('Checkout Flow', () => {
  let cart;

  beforeEach(() => {
    cart = new Cart();
    cart.clear();
  });

  test('creates Stripe session with correct line items', async () => {
    cart.addItem('jockblock-60ml', 2, 19.99);

    const session = await initiateCheckout(cart);

    expect(session.lineItems).toEqual([
      {
        price: 'price_jockblock60ml',
        quantity: 2
      }
    ]);
  });

  test('prevents checkout with empty cart', async () => {
    await expect(initiateCheckout(cart))
      .rejects.toThrow('Cart is empty');
  });

  test('clears cart after successful redirect', async () => {
    cart.addItem('jockblock-60ml', 1, 19.99);
    await initiateCheckout(cart);

    expect(cart.items).toHaveLength(0);
  });
});
```

### End-to-End Tests (Playwright)

**Full Purchase Flow:**

```javascript
// __tests__/e2e/purchase.spec.js
import { test, expect } from '@playwright/test';

test.describe('Purchase Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete purchase flow', async ({ page }) => {
    // Add to cart
    await page.click('[data-testid="add-to-cart"]');

    // Verify cart updated
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');

    // Open cart
    await page.click('[data-testid="cart-icon"]');

    // Verify item in cart
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-total"]')).toContainText('$19.99');

    // Proceed to checkout
    await page.click('[data-testid="checkout-button"]');

    // Should redirect to Stripe (mock in test env)
    await expect(page).toHaveURL(/checkout\.stripe\.com|\/checkout/);
  });

  test('update quantity in cart', async ({ page }) => {
    await page.click('[data-testid="add-to-cart"]');
    await page.click('[data-testid="cart-icon"]');

    // Increase quantity
    await page.click('[data-testid="quantity-increase"]');

    await expect(page.locator('[data-testid="item-quantity"]')).toHaveValue('2');
    await expect(page.locator('[data-testid="cart-total"]')).toContainText('$39.98');
  });

  test('remove item from cart', async ({ page }) => {
    await page.click('[data-testid="add-to-cart"]');
    await page.click('[data-testid="cart-icon"]');
    await page.click('[data-testid="remove-item"]');

    await expect(page.locator('[data-testid="empty-cart-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('0');
  });
});
```

**Mobile Responsiveness:**

```javascript
// __tests__/e2e/mobile.spec.js
import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Experience', () => {
  test.use({ ...devices['iPhone 13'] });

  test('mobile navigation works', async ({ page }) => {
    await page.goto('/');

    // Desktop nav should be hidden
    await expect(page.locator('[data-testid="desktop-nav"]')).toBeHidden();

    // Mobile hamburger should be visible
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();

    // Open mobile menu
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
  });

  test('sticky add-to-cart bar appears on scroll', async ({ page }) => {
    await page.goto('/');

    // Sticky bar hidden initially
    await expect(page.locator('[data-testid="sticky-atc"]')).toBeHidden();

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));

    // Sticky bar should appear
    await expect(page.locator('[data-testid="sticky-atc"]')).toBeVisible();
  });
});
```

### Accessibility Tests

```javascript
// __tests__/accessibility/a11y.test.js
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('homepage has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations.filter(v => v.impact === 'critical')).toHaveLength(0);
  });

  test('cart drawer is keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Tab to cart icon and open with Enter
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Adjust based on tab order
    await page.keyboard.press('Enter');

    // Cart should be open and focused
    await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-drawer"]')).toBeFocused();

    // Escape should close
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-testid="cart-drawer"]')).toBeHidden();
  });

  test('form errors are announced to screen readers', async ({ page }) => {
    await page.goto('/contact');

    // Submit empty form
    await page.click('[data-testid="submit-button"]');

    // Error messages should have proper ARIA
    const errorMessage = page.locator('[data-testid="email-error"]');
    await expect(errorMessage).toHaveAttribute('role', 'alert');
    await expect(errorMessage).toHaveAttribute('aria-live', 'polite');
  });
});
```

### Visual Regression Tests

```javascript
// __tests__/e2e/visual.spec.js
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage matches snapshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      threshold: 0.1
    });
  });

  test('product section matches snapshot', async ({ page }) => {
    await page.goto('/');
    const product = page.locator('[data-testid="product-section"]');
    await expect(product).toHaveScreenshot('product-section.png');
  });

  test('cart drawer matches snapshot', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="add-to-cart"]');
    await page.click('[data-testid="cart-icon"]');

    const cartDrawer = page.locator('[data-testid="cart-drawer"]');
    await expect(cartDrawer).toHaveScreenshot('cart-drawer.png');
  });
});
```

### Test Coverage Requirements

**Minimum coverage targets:**

| Category | Threshold |
|----------|-----------|
| Statements | 80% |
| Branches | 75% |
| Functions | 80% |
| Lines | 80% |

**Jest coverage configuration:**
```javascript
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    }
  },
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/vendor/**'
  ]
};
```

### CI/CD Test Integration

**GitHub Actions workflow:**
```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### TDD Development Checklist

For EACH feature, follow this process:

- [ ] **Define behavior** — What should this feature do?
- [ ] **Write failing tests** — Cover happy path + edge cases
- [ ] **Run tests** — Confirm they fail (RED)
- [ ] **Implement minimal code** — Just enough to pass
- [ ] **Run tests** — Confirm they pass (GREEN)
- [ ] **Refactor** — Improve code quality
- [ ] **Run tests** — Confirm still passing
- [ ] **Commit** — Tests + implementation together

---

## 6. Content Requirements

### Copywriting Needed

| Section | Content Type | Est. Word Count |
|---------|--------------|-----------------|
| Hero | Headline + subhead | 20 words |
| Product Description | Features & benefits | 150 words |
| How It Works | Step-by-step guide | 200 words |
| Ingredients | Sulfur explanation | 300 words |
| About Us | Brand story | 400 words |
| FAQ | 10-15 Q&As | 1000 words |
| Legal Pages | Privacy, Terms, Returns | 2000 words |

### Photography Needed

- **Product Hero:** Clean studio shot, white/minimal background
- **Product Angles:** Front, back, side, detail of spray nozzle
- **Lifestyle:** Gym bag context shot (no people needed)
- **Ingredients:** Sulfur/natural elements imagery
- **Icons:** Custom or stock icons for features

### Legal Considerations

⚠️ **Important for Homeopathic Products:**
- FDA disclaimer required
- Cannot make drug claims without substantiation
- "Homeopathic" labeling requirements
- Review claims with legal counsel

**Required Disclaimer (from product label):**
> "*DISCLAIMER: This homeopathic product has not been evaluated by FDA for safety or efficacy. FDA is not aware of scientific evidence to support homeopathy as effective."

**Additional Product Details (from label):**
- Active ingredient: Sulfur 6X HPUS
- Inactive ingredients: Mineral oil, water
- HPUS = Homeopathic Pharmacopoeia of the U.S.
- NDC: XXXXX-001-60
- 60 mL (2.0 fl oz) bottle

---

## 6. SEO Strategy

### Technical SEO

```html
<!-- Essential Meta Tags -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Jock Block - Natural homeopathic antifungal spray for jock itch and ringworm relief. Defense below the belt.">
<meta name="keywords" content="jock itch treatment, antifungal spray, ringworm treatment, natural antifungal, sulfur spray">

<!-- Open Graph -->
<meta property="og:title" content="Jock Block - Defense Below the Belt">
<meta property="og:description" content="Natural antifungal spray for jock itch and ringworm">
<meta property="og:image" content="/images/og-image.jpg">
<meta property="og:url" content="https://jockblock.com">

<!-- Schema Markup -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Jock Block Antifungal Spray",
  "description": "...",
  "brand": "Jock Block",
  "offers": {
    "@type": "Offer",
    "price": "XX.XX",
    "priceCurrency": "USD"
  }
}
</script>
```

### Target Keywords

**Primary:**
- jock itch spray
- antifungal spray
- jock itch treatment
- ringworm spray

**Secondary:**
- natural antifungal
- sulfur antifungal
- homeopathic jock itch
- groin fungus treatment

### Content SEO
- Informational blog posts about fungal infections
- "How to prevent jock itch" guides
- Ingredient education content

---

## 7. Performance Requirements

### Core Web Vitals Targets

| Metric | Target | How to Achieve |
|--------|--------|----------------|
| LCP (Largest Contentful Paint) | < 2.5s | Optimize hero image, preload fonts |
| FID (First Input Delay) | < 100ms | Minimize JavaScript, defer non-critical |
| CLS (Cumulative Layout Shift) | < 0.1 | Set image dimensions, font-display: swap |

### Optimization Checklist

- [ ] Compress all images (WebP format preferred)
- [ ] Minify CSS and JavaScript
- [ ] Enable GZIP compression on server
- [ ] Use CDN for static assets
- [ ] Lazy load below-fold images
- [ ] Preload critical resources
- [ ] Enable browser caching

---

## 8. Mobile Responsiveness

### Design Philosophy: Mobile-First

All CSS is written for mobile screens first, then enhanced for larger screens. This ensures:
- Fastest load times on mobile (no overriding desktop styles)
- Better progressive enhancement
- Forces prioritization of essential content

### Breakpoints

```css
/* Mobile First Approach */
/* Base: Mobile (0 - 639px) — Default styles, no media query needed */

/* Tablet */
@media (min-width: 640px) { }

/* Small Desktop */
@media (min-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1280px) { }
```

### Mobile Layout Specifications

**Header (Mobile)**
```
┌─────────────────────────────────┐
│ [☰]     JOCK BLOCK      [🛒 2] │
└─────────────────────────────────┘
```
- Hamburger menu (left)
- Centered logo
- Cart icon with badge (right)
- Height: 56px
- Sticky on scroll

**Hero Section (Mobile)**
```
┌─────────────────────────────────┐
│                                 │
│      [Product Image]            │
│                                 │
├─────────────────────────────────┤
│   DEFENSE BELOW THE BELT        │
│                                 │
│   Natural antifungal relief     │
│                                 │
│   ┌─────────────────────────┐   │
│   │      SHOP NOW           │   │
│   └─────────────────────────┘   │
└─────────────────────────────────┘
```
- Stacked layout (image above text)
- Full-width CTA button
- Reduced padding (16px sides)

**Product Section (Mobile)**
```
┌─────────────────────────────────┐
│   [Large Product Photo]         │
├─────────────────────────────────┤
│   Jock Block 60mL               │
│   ★★★★★ (124 reviews)          │
│   $19.99                        │
│                                 │
│   ▸ Fast-acting relief          │
│   ▸ Natural sulfur formula      │
│   ▸ Easy spray application      │
│                                 │
│   Quantity: [−] 1 [+]           │
│                                 │
│   ┌─────────────────────────┐   │
│   │     ADD TO CART         │   │
│   └─────────────────────────┘   │
└─────────────────────────────────┘
```

**Sticky Add-to-Cart Bar (Mobile)**
```
┌─────────────────────────────────┐
│  $19.99    [  ADD TO CART  ]    │
└─────────────────────────────────┘
```
- Appears when main ATC button scrolls out of view
- Fixed to bottom of viewport
- Height: 64px
- Z-index: 100
- Subtle shadow for elevation

**Cart Drawer (Mobile)**
```
┌─────────────────────────────────┐
│  Your Cart (1)            [✕]   │
├─────────────────────────────────┤
│  ┌───┐                          │
│  │ 📷│  Jock Block 60mL         │
│  └───┘  $19.99                  │
│         [−] 1 [+]    [Remove]   │
├─────────────────────────────────┤
│  Subtotal:              $19.99  │
├─────────────────────────────────┤
│  ┌─────────────────────────┐    │
│  │      CHECKOUT           │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```
- Full-screen bottom sheet (slides up)
- Overlay behind (click to close)
- Swipe down to dismiss

**Mobile Navigation Drawer**
```
┌─────────────────────────────────┐
│  [✕]                            │
├─────────────────────────────────┤
│                                 │
│  Home                           │
│  ─────────────────────────────  │
│  How It Works                   │
│  ─────────────────────────────  │
│  Ingredients                    │
│  ─────────────────────────────  │
│  FAQ                            │
│  ─────────────────────────────  │
│  Contact                        │
│                                 │
├─────────────────────────────────┤
│  [    SHOP NOW    ]             │
└─────────────────────────────────┘
```
- Slides in from left
- Full viewport height
- Large touch targets (48px+ height)
- CTA button at bottom

### Touch Interaction Guidelines

| Element | Minimum Size | Spacing |
|---------|--------------|---------|
| Buttons | 44px × 44px | 8px between |
| Nav links | 48px height | 0 (full width) |
| Form inputs | 48px height | 16px between |
| Quantity +/- | 44px × 44px | 8px between |
| Close buttons | 44px × 44px | — |

**Touch Feedback:**
- Active state: slight scale (0.98) + darker background
- Ripple effect on buttons (optional)
- Haptic feedback for add-to-cart (if supported)

### Typography Scaling (Mobile)

```css
/* Mobile type scale */
--text-hero: 2rem;        /* 32px - main headline */
--text-h1: 1.75rem;       /* 28px */
--text-h2: 1.5rem;        /* 24px */
--text-h3: 1.25rem;       /* 20px */
--text-body: 1rem;        /* 16px - prevents iOS zoom */
--text-small: 0.875rem;   /* 14px */

/* Desktop type scale */
@media (min-width: 1024px) {
  --text-hero: 3.5rem;    /* 56px */
  --text-h1: 2.5rem;      /* 40px */
  --text-h2: 2rem;        /* 32px */
  --text-h3: 1.5rem;      /* 24px */
}
```

### Mobile-Specific Features

**1. Sticky Add-to-Cart Bar**
```javascript
// Show when main ATC scrolls out of view
const mainATC = document.querySelector('[data-testid="add-to-cart"]');
const stickyATC = document.querySelector('[data-testid="sticky-atc"]');

const observer = new IntersectionObserver(
  ([entry]) => {
    stickyATC.classList.toggle('visible', !entry.isIntersecting);
  },
  { threshold: 0 }
);

observer.observe(mainATC);
```

**2. Pull-to-Refresh Prevention**
```css
/* Prevent accidental pull-to-refresh */
html {
  overscroll-behavior-y: contain;
}
```

**3. Safe Area Handling (Notch/Home Indicator)**
```css
/* Support for iPhone notch and home indicator */
.sticky-atc {
  padding-bottom: env(safe-area-inset-bottom);
}

.mobile-nav {
  padding-top: env(safe-area-inset-top);
}
```

**4. Viewport Height Fix (iOS Safari)**
```css
/* Fix for 100vh on iOS Safari */
:root {
  --vh: 1vh;
}

.full-height {
  height: calc(var(--vh, 1vh) * 100);
}
```

```javascript
// Set --vh custom property
function setVH() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
window.addEventListener('resize', setVH);
setVH();
```

**5. Disable Zoom on Input Focus**
```css
/* Prevent zoom on input focus (iOS) */
input, select, textarea {
  font-size: 16px; /* Must be 16px or larger */
}
```

### Mobile Performance Targets

| Metric | Target | Mobile Priority |
|--------|--------|-----------------|
| First Contentful Paint | < 1.8s | Critical |
| Largest Contentful Paint | < 2.5s | Critical |
| Time to Interactive | < 3.8s | High |
| Total Blocking Time | < 200ms | High |
| Cumulative Layout Shift | < 0.1 | Medium |

**Mobile-Specific Optimizations:**
- [ ] Serve WebP images with fallback
- [ ] Lazy load below-fold images
- [ ] Preload hero image
- [ ] Inline critical CSS
- [ ] Defer non-critical JavaScript
- [ ] Use system fonts as fallback while web fonts load

### Mobile E2E Tests (Playwright)

```javascript
// __tests__/e2e/mobile.spec.js
import { test, expect, devices } from '@playwright/test';

const mobileDevices = [
  'iPhone 13',
  'iPhone SE',
  'Pixel 5',
  'Galaxy S21',
];

for (const device of mobileDevices) {
  test.describe(`Mobile: ${device}`, () => {
    test.use({ ...devices[device] });

    test('sticky ATC appears on scroll', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('[data-testid="sticky-atc"]')).toBeHidden();

      await page.evaluate(() => window.scrollBy(0, 600));

      await expect(page.locator('[data-testid="sticky-atc"]')).toBeVisible();
    });

    test('mobile nav opens and closes', async ({ page }) => {
      await page.goto('/');

      await page.click('[data-testid="mobile-menu-button"]');
      await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();

      await page.click('[data-testid="mobile-nav-close"]');
      await expect(page.locator('[data-testid="mobile-nav"]')).toBeHidden();
    });

    test('cart drawer slides up from bottom', async ({ page }) => {
      await page.goto('/');

      await page.click('[data-testid="add-to-cart"]');
      await page.click('[data-testid="cart-icon"]');

      const drawer = page.locator('[data-testid="cart-drawer"]');
      await expect(drawer).toBeVisible();

      // Verify it's positioned at bottom
      const box = await drawer.boundingBox();
      const viewport = page.viewportSize();
      expect(box.y + box.height).toBeCloseTo(viewport.height, 10);
    });

    test('touch targets are at least 44px', async ({ page }) => {
      await page.goto('/');

      const buttons = page.locator('button, a, [role="button"]');
      const count = await buttons.count();

      for (let i = 0; i < count; i++) {
        const box = await buttons.nth(i).boundingBox();
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    });
  });
}
```

### Mobile Checklist

**Before Launch:**
- [ ] Test on real iOS device (Safari quirks)
- [ ] Test on real Android device (Chrome)
- [ ] Verify touch targets ≥ 44px
- [ ] Test with slow 3G throttling
- [ ] Verify no horizontal scroll
- [ ] Test landscape orientation
- [ ] Verify safe area handling (notch devices)
- [ ] Test cart drawer gestures
- [ ] Verify sticky ATC functionality
- [ ] Check form input zoom behavior

---

## 9. Development Phases (TDD Approach)

### Phase 1: Foundation & Test Setup (Week 1-2)
- [ ] Set up project structure
- [ ] **Initialize testing infrastructure (Jest, Playwright, Testing Library)**
- [ ] **Configure test scripts and coverage thresholds**
- [ ] Create design system CSS
- [ ] Build responsive grid system
- [ ] Create component library (buttons, forms, cards)
- [ ] **Write visual regression baseline tests**
- [ ] Set up CI/CD pipeline with test gates

### Phase 2: Core Pages — TDD (Week 3-4)
- [ ] **Write navigation tests FIRST** → Implement navigation
- [ ] **Write FAQ accordion tests** → Implement accordion component
- [ ] **Write form validation tests** → Implement contact form
- [ ] Build homepage/landing page (test against visual snapshots)
- [ ] Create product detail section
- [ ] **Run accessibility tests, fix violations**

### Phase 3: E-Commerce — TDD (Week 5-6)
- [ ] **Write cart unit tests FIRST** (add, remove, update, persist)
- [ ] Implement cart.js to pass all tests
- [ ] **Write checkout integration tests** → Implement checkout.js
- [ ] Integrate Stripe Checkout (mock in tests)
- [ ] **Write E2E purchase flow tests** → Verify full flow
- [ ] Build thank you / confirmation page
- [ ] Set up order email notifications
- [ ] **Achieve 80%+ code coverage**

### Phase 4: Content, Security & Polish (Week 7-8)
- [ ] Add all copywriting
- [ ] Implement product photography
- [ ] Add animations and micro-interactions
- [ ] **Write security tests** (honeypot, rate limit behavior)
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] **Cross-browser E2E tests** (Chrome, Firefox, Safari, Mobile)
- [ ] **Full accessibility audit with axe-core**

### Phase 5: Launch (Week 9)
- [ ] **Run full test suite** — all tests must pass
- [ ] **Verify coverage thresholds met**
- [ ] Set up analytics (Google Analytics 4)
- [ ] Configure Cloudflare, domain and SSL
- [ ] **Smoke tests on production**
- [ ] Launch!
- [ ] Monitor and fix any issues

---

## 10. Hosting & Infrastructure

### Recommended Stack

**Hosting: Netlify or Vercel**
- Free tier sufficient for launch
- Automatic HTTPS
- CDN included
- Easy deployment from Git

**Domain: Namecheap or Google Domains**
- Register jockblock.com (and .co, .net for protection)

**Email: Google Workspace or Zoho**
- Professional email (hello@jockblock.com)

**Payment: Stripe**
- 2.9% + $0.30 per transaction
- No monthly fees

**Analytics: Google Analytics 4 + Hotjar**
- GA4 for traffic and conversions
- Hotjar for heatmaps and session recordings

### Estimated Monthly Costs

| Service | Cost |
|---------|------|
| Hosting (Netlify) | $0-19/mo |
| Domain | ~$12/year |
| Email (Google Workspace) | $6/user/mo |
| Stripe | Per transaction |
| **Total** | **~$10-30/mo** + transaction fees |

---

## 11. Security Infrastructure

### DDoS Protection & CDN

**Recommended: Cloudflare (Free Tier)**
- Sits in front of your hosting (Netlify/Vercel)
- Automatic DDoS mitigation (Layer 3, 4, and 7 attacks)
- Global CDN with 300+ edge locations
- Free SSL/TLS certificates
- "Under Attack Mode" for emergencies

**Setup:**
1. Add domain to Cloudflare
2. Update nameservers at registrar
3. Configure SSL to "Full (Strict)"
4. Enable "Always Use HTTPS"

### Rate Limiting

**Cloudflare Rate Limiting Rules (Free: 1 rule, Pro: 10 rules)**

| Endpoint | Limit | Action |
|----------|-------|--------|
| `/api/*` (contact form) | 10 requests/minute per IP | Block for 1 hour |
| `/checkout/*` | 5 requests/minute per IP | Challenge |
| Site-wide | 100 requests/minute per IP | Challenge |

**Implementation Example (Cloudflare Rule):**
```
(http.request.uri.path contains "/api/contact")
→ Rate limit: 10 requests per minute
→ Action: Block
→ Duration: 3600 seconds
```

**For Custom Backend (if needed later):**
```javascript
// Express.js rate limiting example
const rateLimit = require('express-rate-limit');

const contactFormLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 5,               // 5 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/contact', contactFormLimiter, handleContact);
```

### Bot Protection

**Cloudflare Bot Fight Mode (Free)**
- Automatically challenges known bot signatures
- Blocks malicious crawlers
- Allows legitimate bots (Google, Bing, etc.)

**Additional Measures:**

| Protection | Implementation | Cost |
|------------|----------------|------|
| Honeypot fields | Hidden form field that bots fill | Free |
| CAPTCHA | hCaptcha or Cloudflare Turnstile | Free |
| JavaScript challenge | Require JS execution to submit | Free |
| User-agent filtering | Block known bad UAs | Free |

**Honeypot Implementation:**
```html
<!-- Hidden field - bots will fill it, humans won't see it -->
<input type="text" name="website" class="hp-field" tabindex="-1" autocomplete="off">

<style>
  .hp-field {
    position: absolute;
    left: -9999px;
    opacity: 0;
  }
</style>
```

```javascript
// Server-side: reject if honeypot is filled
if (formData.website) {
  return res.status(400).json({ error: 'Bot detected' });
}
```

**Cloudflare Turnstile (Recommended over reCAPTCHA):**
- Privacy-friendly CAPTCHA alternative
- Often invisible to real users
- Free unlimited use
- Easy integration

```html
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

<div class="cf-turnstile" data-sitekey="YOUR_SITE_KEY"></div>
```

### Form Security

**Contact Form Protection:**
- [ ] Honeypot field (catches 90%+ of basic bots)
- [ ] Cloudflare Turnstile on form submission
- [ ] Server-side validation (never trust client input)
- [ ] Rate limiting (10 submissions/hour per IP)
- [ ] Email validation (format + disposable email blocking)
- [ ] Input sanitization (prevent XSS)

**Newsletter Signup Protection:**
- [ ] Double opt-in (confirmation email required)
- [ ] Rate limit signups
- [ ] Block disposable email domains
- [ ] Honeypot field

### Stripe Security (Payment Processing)

Stripe handles most payment security automatically:
- PCI DSS Level 1 compliant
- Tokenized card data (never touches your server)
- Built-in fraud detection (Radar)
- 3D Secure support

**Your Responsibilities:**
- [ ] Use Stripe Checkout (hosted) — card data never hits your server
- [ ] Validate webhook signatures
- [ ] Use HTTPS only (enforced by Cloudflare)
- [ ] Don't log sensitive data

```javascript
// Webhook signature verification
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  res.json({received: true});
});
```

### Security Headers

**Cloudflare or Netlify Headers:**
```
# _headers file (Netlify) or Cloudflare Transform Rules

/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' https://js.stripe.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com;
```

### Monitoring & Alerting

**Free Tools:**
- Cloudflare Analytics (traffic, threats blocked)
- UptimeRobot (free uptime monitoring, alerts)
- Sentry (error tracking)

**Alerts to Configure:**
- [ ] Site downtime (UptimeRobot → email/SMS)
- [ ] Spike in blocked requests (Cloudflare)
- [ ] Failed payment attempts (Stripe Dashboard)
- [ ] Form submission anomalies

### Security Checklist

**Before Launch:**
- [ ] Cloudflare configured with SSL Full (Strict)
- [ ] DDoS protection enabled
- [ ] Rate limiting rules active
- [ ] Bot Fight Mode enabled
- [ ] Honeypot fields on all forms
- [ ] Turnstile CAPTCHA on contact form
- [ ] Security headers configured
- [ ] Stripe webhooks verified
- [ ] HTTPS enforced everywhere

**Ongoing:**
- [ ] Monitor Cloudflare threat analytics weekly
- [ ] Review blocked IPs/requests monthly
- [ ] Keep dependencies updated
- [ ] Test rate limits periodically

### Estimated Security Costs

| Service | Tier | Cost |
|---------|------|------|
| Cloudflare | Free | $0/mo |
| Cloudflare | Pro (more rate limit rules) | $20/mo |
| UptimeRobot | Free (50 monitors) | $0/mo |
| Sentry | Free (5K errors/mo) | $0/mo |
| **Total (Free Tier)** | | **$0/mo** |
| **Total (Pro)** | | **$20/mo** |

---

## 12. Future Enhancements

### Post-Launch Roadmap

**V1.1 - Analytics & Optimization**
- A/B testing headlines
- Conversion rate optimization
- Heat map analysis

**V1.2 - Marketing Integrations**
- Email capture popup
- Abandoned cart emails (via Klaviyo)
- Referral program

**V1.3 - Product Expansion**
- Additional product pages
- Bundle deals
- Subscription option

**V2.0 - Full E-Commerce**
- User accounts
- Order history
- Loyalty program

---

## 12. Checklist Summary

### Before Development
- [ ] Finalize product pricing
- [ ] Complete product photography
- [ ] Write all copy
- [ ] Review legal/FDA requirements
- [ ] Register domain

### Before Launch
- [ ] Test on all major browsers
- [ ] Test on iOS and Android devices
- [ ] Complete purchase flow testing
- [ ] Set up error monitoring (Sentry)
- [ ] Configure Cloudflare (DDoS, rate limiting, bot protection)
- [ ] Add honeypot fields to all forms
- [ ] Implement Turnstile CAPTCHA
- [ ] Verify security headers are set
- [ ] Configure analytics
- [ ] Set up email notifications
- [ ] SSL certificate active
- [ ] Robots.txt and sitemap.xml in place

### Post-Launch
- [ ] Monitor site performance
- [ ] Track conversion rates
- [ ] Gather customer feedback
- [ ] Iterate on design based on data

---

## Next Steps

1. **Approve this plan** and identify any changes
2. **Gather assets** - product photos, logo, copy
3. **Set up Stripe account** for payment processing
4. **Begin Phase 1** development

---

*Plan created: January 2026*
*For: Jock Block E-Commerce Website*
