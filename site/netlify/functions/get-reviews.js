/**
 * Netlify Function: Get Approved Reviews
 *
 * Returns approved reviews from Netlify Blobs.
 * Falls back to static JSON file if Blobs is empty.
 */

const { getStore } = require('@netlify/blobs');

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
};

exports.handler = async (event, context) => {
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const store = getStore({
      name: 'reviews',
      siteID: context.site.id,
      token: process.env.NETLIFY_BLOBS_TOKEN || context.clientContext?.identity?.token
    });

    // Get reviews from Blobs
    let reviews = [];
    try {
      const data = await store.get('approved-reviews', { type: 'json' });
      if (data && data.reviews) {
        reviews = data.reviews;
      }
    } catch (e) {
      console.log('No reviews in Blobs, returning empty array');
    }

    // Sort by date (newest first)
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reviews })
    };

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch reviews', reviews: [] })
    };
  }
};
