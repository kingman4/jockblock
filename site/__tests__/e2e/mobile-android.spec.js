/**
 * E2E Tests - Mobile Experience (Android)
 */

import { test, expect, devices } from '@playwright/test';

// Set device at top level, outside describe block
test.use({ ...devices['Pixel 5'] });

test('works on Android devices', async ({ page }) => {
  await page.goto('/');

  // Mobile menu should be visible
  await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();

  // Can add to cart
  await page.click('[data-testid="add-to-cart"]');
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
});
