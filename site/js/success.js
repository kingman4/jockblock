/**
 * Success page functionality
 * Handles order confirmation display after Stripe checkout
 */

// Clear cart on successful checkout
function clearCart() {
  localStorage.removeItem('jockblock_cart');
}

// Get session ID from URL
function getSessionId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('session_id');
}

// Show appropriate state
function showState(state) {
  document.getElementById('loading-state').style.display = state === 'loading' ? 'flex' : 'none';
  document.getElementById('confirmed-state').style.display = state === 'confirmed' ? 'block' : 'none';
  document.getElementById('error-state').style.display = state === 'error' ? 'block' : 'none';
}

// Initialize page
async function init() {
  const sessionId = getSessionId();

  if (!sessionId) {
    // No session ID - probably direct navigation
    showState('error');
    return;
  }

  // For now, just show success since we have a session ID
  // In production, you could verify the session with Stripe
  setTimeout(() => {
    // Clear the cart
    clearCart();

    // Show order ID (truncated session ID for reference)
    document.getElementById('order-id').textContent = sessionId.substring(0, 32) + '...';

    // Show success state
    showState('confirmed');
  }, 1000);
}

// Run on page load
init();
