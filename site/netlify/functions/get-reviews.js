/**
 * Netlify Function: Get Approved Reviews
 *
 * Returns approved reviews from Netlify Blobs.
 * Falls back to static JSON file if Blobs is empty.
 */

const { getStore } = require('@netlify/blobs');
const { checkRateLimit, getClientIp } = require('./utils/rate-limiter');

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://jockblock.com',
  'https://www.jockblock.com',
  'http://localhost:3000',
  'http://localhost:8888'
];

function getCorsHeaders(origin) {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
  };
}

exports.handler = async (event, context) => {
  const origin = event.headers.origin || event.headers.Origin || '';
  const headers = getCorsHeaders(origin);

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Rate limit: 30 requests per IP per minute
  const ip = getClientIp(event);
  const { allowed } = await checkRateLimit(ip, 'get-reviews', context, 30, 60000);
  if (!allowed) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({ error: 'Too many requests', reviews: [] })
    };
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
