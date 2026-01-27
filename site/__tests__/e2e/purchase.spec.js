/**
 * E2E Tests - Purchase Flow
 */

import { test, expect } from '@playwright/test';

test.describe('Purchase Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Jock Block/);
  });

  test('hero section is visible', async ({ page }) => {
    await expect(page.locator('.hero')).toBeVisible();
    await expect(page.locator('.hero-title')).toContainText('Defense Below the Belt');
  });

  test('add to cart button works', async ({ page }) => {
    // Initial cart should be empty
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('0');

    // Click add to cart
    await page.click('[data-testid="add-to-cart"]');

    // Wait for cart to update
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
  });

  test('cart drawer opens when clicking cart icon', async ({ page }) => {
    // Add item first
    await page.click('[data-testid="add-to-cart"]');

    // Wait for cart drawer to open (it auto-opens after add)
    const cartDrawer = page.locator('[data-testid="cart-drawer"]');
    await expect(cartDrawer).toHaveClass(/open/, { timeout: 2000 });
  });

  test('quantity selector increases and decreases', async ({ page }) => {
    const quantityInput = page.locator('[data-testid="item-quantity"]');

    // Initial value
    await expect(quantityInput).toHaveValue('1');

    // Increase
    await page.click('[data-testid="quantity-increase"]');
    await expect(quantityInput).toHaveValue('2');

    // Decrease
    await page.click('[data-testid="quantity-decrease"]');
    await expect(quantityInput).toHaveValue('1');
  });

  test('cart total updates correctly', async ({ page }) => {
    // Set quantity to 2
    await page.click('[data-testid="quantity-increase"]');

    // Add to cart
    await page.click('[data-testid="add-to-cart"]');

    // Wait for cart drawer to open automatically
    const cartDrawer = page.locator('[data-testid="cart-drawer"]');
    await expect(cartDrawer).toHaveClass(/open/, { timeout: 2000 });

    // Check total (2 x $19.99 = $39.98)
    await expect(page.locator('[data-testid="cart-total"]')).toContainText('$39.98');
  });

  test('remove item from cart', async ({ page }) => {
    // Add to cart
    await page.click('[data-testid="add-to-cart"]');

    // Wait for cart drawer to open automatically
    const cartDrawer = page.locator('[data-testid="cart-drawer"]');
    await expect(cartDrawer).toHaveClass(/open/, { timeout: 2000 });

    // Wait for remove button to be rendered (dynamic content)
    const removeBtn = page.locator('[data-testid="remove-item"]');
    await expect(removeBtn).toBeVisible({ timeout: 2000 });

    // Remove item
    await removeBtn.click();

    // Cart should be empty
    await expect(page.locator('[data-testid="empty-cart-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('0');
  });
});

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('FAQ accordion opens and closes', async ({ page }) => {
    // Scroll to FAQ section first
    await page.locator('#faq').scrollIntoViewIfNeeded();

    // Click first FAQ question
    const firstQuestion = page.locator('.faq-question').first();
    await firstQuestion.click();

    // Answer should be visible
    const firstItem = page.locator('.faq-item').first();
    await expect(firstItem).toHaveClass(/open/);

    // Click again to close
    await firstQuestion.click();
    await expect(firstItem).not.toHaveClass(/open/);
  });

  test('smooth scroll to sections works', async ({ page }) => {
    // Use the desktop nav link or footer link (always visible)
    // Footer links are always visible on all viewports
    const footerLink = page.locator('.footer-links a[href="#how-it-works"]');

    // If footer link exists, use it; otherwise use any visible link
    const link = await footerLink.isVisible()
      ? footerLink
      : page.locator('a[href="#how-it-works"]').first();

    await link.click();

    // Wait for scroll animation
    await page.waitForTimeout(800);

    // Section should be in view
    const section = page.locator('#how-it-works');
    await expect(section).toBeInViewport();
  });
});
