/**
 * Netlify Function: Approve/Reject Review
 *
 * Called when admin clicks approve/reject link in email.
 * Stores approved reviews in Netlify Blobs.
 */

const { getStore } = require('@netlify/blobs');

const REVIEW_APPROVAL_SECRET = process.env.REVIEW_APPROVAL_SECRET;
const SITE_URL = process.env.SITE_URL || 'https://jockblock.com';

exports.handler = async (event, context) => {
  // Only allow GET (from email links)
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Method not allowed'
    };
  }

  const params = event.queryStringParameters || {};
  const { action, data, secret } = params;

  // Verify secret
  if (!secret || secret !== REVIEW_APPROVAL_SECRET) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'text/html' },
      body: renderPage('Unauthorized', 'Invalid or missing authorization.', 'error')
    };
  }

  // Validate action
  if (!action || !['approve', 'reject'].includes(action)) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/html' },
      body: renderPage('Invalid Action', 'Please use a valid approve or reject link.', 'error')
    };
  }

  // Decode review data
  let reviewData;
  try {
    reviewData = JSON.parse(Buffer.from(data, 'base64url').toString());
  } catch (e) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/html' },
      body: renderPage('Invalid Data', 'Could not decode review data.', 'error')
    };
  }

  if (action === 'reject') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: renderPage('Review Rejected', `Review from ${reviewData.name} has been rejected and will not be published.`, 'success')
    };
  }

  // Approve: Store in Netlify Blobs
  try {
    const store = getStore({
      name: 'reviews',
      siteID: context.site.id,
      token: process.env.NETLIFY_BLOBS_TOKEN || context.clientContext?.identity?.token
    });

    // Get existing reviews
    let reviews = [];
    try {
      const existing = await store.get('approved-reviews', { type: 'json' });
      if (existing && existing.reviews) {
        reviews = existing.reviews;
      }
    } catch (e) {
      // No existing reviews, start fresh
      console.log('No existing reviews found, starting fresh');
    }

    // Add new review
    const newReview = {
      id: Date.now().toString(),
      rating: parseInt(reviewData.rating),
      name: reviewData.name.trim(),
      review: reviewData.review.trim(),
      date: new Date().toISOString().split('T')[0],
      verified: !!reviewData.email
    };

    reviews.push(newReview);

    // Save back to store
    await store.setJSON('approved-reviews', { reviews });

    console.log(`Review approved: ${newReview.name} - ${newReview.rating} stars`);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: renderPage('Review Approved', `Review from ${reviewData.name} has been approved and is now live on the site.`, 'success')
    };

  } catch (error) {
    console.error('Error storing review:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html' },
      body: renderPage('Error', 'Failed to save review. Please try again or add manually.', 'error')
    };
  }
};

/**
 * Render a simple HTML response page
 */
function renderPage(title, message, type) {
  const bgColor = type === 'error' ? '#ff4444' : '#00E676';
  const textColor = type === 'error' ? '#fff' : '#000';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Jock Block</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #0A0A0A;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
        }
        .card {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          max-width: 400px;
        }
        .icon {
          width: 60px;
          height: 60px;
          background: ${bgColor};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 24px;
        }
        h1 {
          margin: 0 0 10px;
          font-size: 24px;
        }
        p {
          color: #999;
          margin: 0 0 20px;
        }
        a {
          display: inline-block;
          background: #00E676;
          color: #000;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon">${type === 'error' ? '✗' : '✓'}</div>
        <h1>${title}</h1>
        <p>${message}</p>
        <a href="${SITE_URL}">Back to Site</a>
      </div>
    </body>
    </html>
  `;
}
