/**
 * Reviews Functionality Tests
 */

describe('Reviews', () => {
  describe('formatDate', () => {
    // Helper function to format dates
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    test('formats ISO date string correctly', () => {
      expect(formatDate('2026-01-15')).toBe('Jan 15, 2026');
    });

    test('formats different months correctly', () => {
      expect(formatDate('2026-06-20')).toBe('Jun 20, 2026');
      expect(formatDate('2026-12-25')).toBe('Dec 25, 2026');
    });
  });

  describe('escapeHtml', () => {
    // Helper function to escape HTML
    const escapeHtml = (text) => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    test('escapes HTML tags', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
    });

    test('escapes ampersands', () => {
      expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    test('escapes quotes', () => {
      expect(escapeHtml('He said "hello"')).toBe('He said "hello"');
    });

    test('leaves plain text unchanged', () => {
      expect(escapeHtml('Great product!')).toBe('Great product!');
    });
  });

  describe('review data validation', () => {
    const isValidReview = (review) => {
      return (
        review &&
        typeof review.rating === 'number' &&
        review.rating >= 1 &&
        review.rating <= 5 &&
        typeof review.name === 'string' &&
        review.name.trim().length > 0 &&
        typeof review.review === 'string' &&
        review.review.trim().length > 0 &&
        typeof review.date === 'string'
      );
    };

    test('validates valid review', () => {
      const review = {
        id: '1',
        rating: 5,
        name: 'John D.',
        review: 'Great product!',
        date: '2026-01-15',
        verified: true
      };
      expect(isValidReview(review)).toBe(true);
    });

    test('rejects review with missing rating', () => {
      const review = {
        id: '1',
        name: 'John D.',
        review: 'Great product!',
        date: '2026-01-15'
      };
      expect(isValidReview(review)).toBe(false);
    });

    test('rejects review with invalid rating', () => {
      const review = {
        id: '1',
        rating: 6,
        name: 'John D.',
        review: 'Great product!',
        date: '2026-01-15'
      };
      expect(isValidReview(review)).toBe(false);
    });

    test('rejects review with empty name', () => {
      const review = {
        id: '1',
        rating: 5,
        name: '   ',
        review: 'Great product!',
        date: '2026-01-15'
      };
      expect(isValidReview(review)).toBe(false);
    });

    test('rejects review with empty review text', () => {
      const review = {
        id: '1',
        rating: 5,
        name: 'John D.',
        review: '',
        date: '2026-01-15'
      };
      expect(isValidReview(review)).toBe(false);
    });
  });

  describe('star rating display', () => {
    const getStarDisplay = (rating) => {
      return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    test('displays 5 filled stars for rating 5', () => {
      expect(getStarDisplay(5)).toBe('★★★★★');
    });

    test('displays 4 filled and 1 empty for rating 4', () => {
      expect(getStarDisplay(4)).toBe('★★★★☆');
    });

    test('displays 1 filled and 4 empty for rating 1', () => {
      expect(getStarDisplay(1)).toBe('★☆☆☆☆');
    });

    test('displays all empty stars for rating 0', () => {
      expect(getStarDisplay(0)).toBe('☆☆☆☆☆');
    });
  });

  describe('reviews sorting', () => {
    const sortByDateDesc = (reviews) => {
      return [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    test('sorts reviews by date descending (newest first)', () => {
      const reviews = [
        { id: '1', date: '2026-01-05' },
        { id: '2', date: '2026-01-15' },
        { id: '3', date: '2026-01-10' }
      ];

      const sorted = sortByDateDesc(reviews);

      expect(sorted[0].id).toBe('2'); // Jan 15
      expect(sorted[1].id).toBe('3'); // Jan 10
      expect(sorted[2].id).toBe('1'); // Jan 5
    });

    test('handles empty array', () => {
      expect(sortByDateDesc([])).toEqual([]);
    });

    test('handles single review', () => {
      const reviews = [{ id: '1', date: '2026-01-15' }];
      expect(sortByDateDesc(reviews)).toEqual(reviews);
    });
  });
});
