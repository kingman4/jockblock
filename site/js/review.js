/**
 * Review page functionality
 * Handles star ratings, character count, and form submission
 */

const ratingLabels = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
};

const starButtons = document.querySelectorAll('.star-btn');
const ratingInput = document.getElementById('rating-input');
const ratingLabel = document.getElementById('rating-label');
const reviewText = document.getElementById('review-text');
const charCount = document.getElementById('char-count');
const form = document.getElementById('review-form');
const formContainer = document.getElementById('review-form-container');
const successMessage = document.getElementById('success-message');

// Star rating interaction
starButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const rating = parseInt(btn.dataset.rating);
    ratingInput.value = rating;
    ratingLabel.textContent = ratingLabels[rating];

    // Update star visuals
    starButtons.forEach(star => {
      const starRating = parseInt(star.dataset.rating);
      star.classList.toggle('active', starRating <= rating);
    });
  });

  // Hover preview
  btn.addEventListener('mouseenter', () => {
    const rating = parseInt(btn.dataset.rating);
    starButtons.forEach(star => {
      const starRating = parseInt(star.dataset.rating);
      star.style.color = starRating <= rating ? 'var(--color-secondary)' : '';
    });
  });

  btn.addEventListener('mouseleave', () => {
    starButtons.forEach(star => {
      star.style.color = '';
    });
  });
});

// Character count
reviewText.addEventListener('input', () => {
  charCount.textContent = reviewText.value.length;
});

// Form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!ratingInput.value) {
    alert('Please select a star rating');
    return;
  }

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    });

    if (response.ok) {
      formContainer.style.display = 'none';
      successMessage.style.display = 'block';
    } else {
      throw new Error('Submission failed');
    }
  } catch (error) {
    console.error('Review submission error:', error);
    alert('There was a problem submitting your review. Please try again.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Review';
  }
});
