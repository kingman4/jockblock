/**
 * E2E Tests - Reviews Section
 */

import { test, expect } from '@playwright/test';

test.describe('Reviews Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('reviews section is visible on homepage', async ({ page }) => {
    const reviewsSection = page.locator('#reviews');
    await expect(reviewsSection).toBeVisible();
    await expect(page.locator('.reviews-section .section-title')).toContainText('Reviews');
  });

  test('reviews grid displays review cards', async ({ page }) => {
    // Wait for reviews to load (from static JSON in dev)
    const reviewsGrid = page.locator('[data-testid="reviews-grid"]');
    await expect(reviewsGrid).toBeVisible();

    // Should have review cards (from sample data)
    const reviewCards = page.locator('.review-card');
    await expect(reviewCards.first()).toBeVisible({ timeout: 5000 });

    // Should have at least one review
    const count = await reviewCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('review cards display correct elements', async ({ page }) => {
    // Wait for reviews to load
    await page.waitForSelector('.review-card', { timeout: 5000 });

    const firstCard = page.locator('.review-card').first();

    // Should have star rating
    await expect(firstCard.locator('.review-rating')).toBeVisible();

    // Should have reviewer name
    await expect(firstCard.locator('.review-name')).toBeVisible();

    // Should have review text
    await expect(firstCard.locator('.review-text')).toBeVisible();

    // Should have date
    await expect(firstCard.locator('.review-date')).toBeVisible();
  });

  test('star ratings display correctly', async ({ page }) => {
    await page.waitForSelector('.review-card', { timeout: 5000 });

    const firstRating = page.locator('.review-rating').first();
    const ratingText = await firstRating.textContent();

    // Should contain filled stars (★) and/or empty stars (☆)
    expect(ratingText).toMatch(/[★☆]/);

    // Total should be 5 stars
    const filledStars = (ratingText.match(/★/g) || []).length;
    const emptyStars = (ratingText.match(/☆/g) || []).length;
    expect(filledStars + emptyStars).toBe(5);
  });

  test('verified badge is displayed for verified reviews', async ({ page }) => {
    await page.waitForSelector('.review-card', { timeout: 5000 });

    // At least one review should have verified badge (our sample data has verified reviews)
    const verifiedBadges = page.locator('.review-verified');
    const count = await verifiedBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Write a Review button links to review page', async ({ page }) => {
    // Scroll to reviews section
    await page.locator('#reviews').scrollIntoViewIfNeeded();

    // Find the Write a Review link
    const reviewLink = page.locator('.reviews-cta a[href="/review.html"]');
    await expect(reviewLink).toBeVisible();
    await expect(reviewLink).toContainText('Write a Review');

    // Click and verify navigation
    await reviewLink.click();
    await expect(page).toHaveURL(/\/review\.html/);
  });
});

test.describe('Review Submission Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/review.html');
    await page.waitForLoadState('networkidle');
  });

  test('review page loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Leave a Review/);
    await expect(page.locator('.review-title')).toContainText('How was your experience?');
  });

  test('star rating selector is interactive', async ({ page }) => {
    const stars = page.locator('.star-btn');
    await expect(stars).toHaveCount(5);

    // Click the 4th star
    await stars.nth(3).click();

    // First 4 stars should be active
    for (let i = 0; i < 4; i++) {
      await expect(stars.nth(i)).toHaveClass(/active/);
    }

    // 5th star should not be active
    await expect(stars.nth(4)).not.toHaveClass(/active/);

    // Rating label should update
    await expect(page.locator('#rating-label')).toContainText('Very Good');
  });

  test('character count updates when typing review', async ({ page }) => {
    const textarea = page.locator('#review-text');
    const charCount = page.locator('#char-count');

    // Initial count should be 0
    await expect(charCount).toHaveText('0');

    // Type some text
    await textarea.fill('This is a test review');

    // Character count should update
    await expect(charCount).toHaveText('21');
  });

  test('form validates required fields', async ({ page }) => {
    // Try to submit without filling anything
    await page.click('#submit-btn');

    // Should show alert for missing rating (custom validation)
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('rating');
      await dialog.dismiss();
    });
  });

  test('form has correct input fields', async ({ page }) => {
    // Name field
    const nameInput = page.locator('#reviewer-name');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveAttribute('required', '');

    // Review text field
    const reviewTextarea = page.locator('#review-text');
    await expect(reviewTextarea).toBeVisible();
    await expect(reviewTextarea).toHaveAttribute('required', '');
    await expect(reviewTextarea).toHaveAttribute('maxlength', '500');

    // Email field (optional)
    const emailInput = page.locator('#order-email');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).not.toHaveAttribute('required', '');
  });

  test('honeypot field is hidden', async ({ page }) => {
    const honeypot = page.locator('input[name="bot-field"]');
    await expect(honeypot).toHaveClass('hp-field');
    // Should be visually hidden but present in DOM
    await expect(honeypot).toHaveAttribute('tabindex', '-1');
  });

  test('back to home link works from success state', async ({ page }) => {
    // The success message has a "Back to Home" link
    const successMessage = page.locator('#success-message');
    const backLink = successMessage.locator('a[href="/"]');

    // Make success message visible for testing (normally shown after form submit)
    await page.evaluate(() => {
      document.getElementById('review-form-container').style.display = 'none';
      document.getElementById('success-message').style.display = 'block';
    });

    await expect(successMessage).toBeVisible();
    await expect(backLink).toContainText('Back to Home');

    await backLink.click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Reviews Empty State', () => {
  test('empty state is hidden when reviews exist', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for reviews to load
    await page.waitForSelector('.review-card', { timeout: 5000 });

    // Empty state should be hidden
    const emptyState = page.locator('[data-testid="reviews-empty"]');
    await expect(emptyState).not.toBeVisible();
  });
});
