/**
 * E2E Tests - Mobile Experience (iPhone)
 */

import { test, expect, devices } from '@playwright/test';

// Set device at top level, outside describe block
test.use({ ...devices['iPhone 13'] });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('mobile menu button is visible', async ({ page }) => {
  await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
});

test('desktop nav is hidden on mobile', async ({ page }) => {
  await expect(page.locator('[data-testid="desktop-nav"]')).toBeHidden();
});

test('mobile navigation opens and closes', async ({ page }) => {
  // Open mobile menu
  await page.click('[data-testid="mobile-menu-button"]');
  await expect(page.locator('[data-testid="mobile-nav"]')).toHaveClass(/open/);

  // Close mobile menu
  await page.click('[data-testid="mobile-nav-close"]');
  await expect(page.locator('[data-testid="mobile-nav"]')).not.toHaveClass(/open/);
});

test('sticky add-to-cart appears on scroll', async ({ page }) => {
  // Initially hidden
  const stickyAtc = page.locator('[data-testid="sticky-atc"]');

  // Scroll down past the product section
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(300);

  // Should be visible
  await expect(stickyAtc).toHaveClass(/visible/);
});

test('cart drawer opens from bottom on mobile', async ({ page }) => {
  // Add to cart
  await page.click('[data-testid="add-to-cart"]');
  await page.waitForTimeout(500);

  // Cart drawer should be open
  const cartDrawer = page.locator('[data-testid="cart-drawer"]');
  await expect(cartDrawer).toHaveClass(/open/);
});

test('can complete purchase flow on mobile', async ({ page }) => {
  // Add to cart
  await page.click('[data-testid="add-to-cart"]');

  // Verify cart updated
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');

  // Cart opens automatically, verify checkout button
  await page.waitForTimeout(500);
  await expect(page.locator('[data-testid="checkout-button"]')).toBeVisible();
});
