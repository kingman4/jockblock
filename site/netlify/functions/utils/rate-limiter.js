/**
 * Simple rate limiter using Netlify Blobs
 *
 * Tracks request counts per IP per endpoint within a time window.
 */

const { getStore } = require('@netlify/blobs');

/**
 * Check if a request should be rate limited
 * @param {string} ip - Client IP address
 * @param {string} endpoint - Endpoint name (e.g., 'checkout', 'reviews')
 * @param {object} context - Netlify function context
 * @param {number} maxRequests - Max requests per window (default: 10)
 * @param {number} windowMs - Time window in ms (default: 60000 = 1 minute)
 * @returns {{ allowed: boolean, remaining: number }}
 */
async function checkRateLimit(ip, endpoint, context, maxRequests = 10, windowMs = 60000) {
  try {
    const store = getStore({
      name: 'rate-limits',
      siteID: context.site?.id,
      token: process.env.NETLIFY_BLOBS_TOKEN || context.clientContext?.identity?.token
    });

    const key = `${endpoint}:${ip.replace(/[^a-zA-Z0-9.:]/g, '')}`;
    let record;

    try {
      record = await store.get(key, { type: 'json' });
    } catch (e) {
      record = null;
    }

    const now = Date.now();

    if (!record || (now - record.windowStart) > windowMs) {
      // New window
      const newRecord = { count: 1, windowStart: now };
      await store.setJSON(key, newRecord);
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (record.count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    // Increment count
    record.count += 1;
    await store.setJSON(key, record);
    return { allowed: true, remaining: maxRequests - record.count };

  } catch (error) {
    // If rate limiting fails, allow the request (fail open)
    console.error('Rate limiter error:', error);
    return { allowed: true, remaining: -1 };
  }
}

/**
 * Get client IP from Netlify event headers
 */
function getClientIp(event) {
  return event.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || event.headers['client-ip']
    || event.headers['x-real-ip']
    || 'unknown';
}

module.exports = { checkRateLimit, getClientIp };
