/**
 * Netlify Serverless Function: Create Stripe Checkout Session
 *
 * This function securely creates a Stripe Checkout session server-side,
 * keeping the secret key secure and never exposing it to the client.
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { checkRateLimit, getClientIp } = require('./utils/rate-limiter');

// Server-side variant catalog — source of truth for pricing.
// Client-submitted prices are ignored; we look up by SKU here.
const CURRENCY = 'usd';
const VARIANTS = {
  'jockblock-100ml': {
    name: 'Jock Block 100mL',
    description: 'Homeopathic topical sulfur spray, 100mL / 3.4 fl oz. NDC 87627-001-100.',
    price: parseInt(process.env.STRIPE_PRICE_AMOUNT_100ML, 10) || 1999,
    image: 'https://jockblock.com/images/product-100ml.png'
  },
  'jockblock-20ml': {
    name: 'Jock Block 20mL (Travel)',
    description: 'Homeopathic topical sulfur spray, 20mL / 0.68 oz travel size. NDC 87627-001-020.',
    price: parseInt(process.env.STRIPE_PRICE_AMOUNT_20ML, 10) || 999,
    image: 'https://jockblock.com/images/product-20ml.png'
  }
};

const MAX_QUANTITY_PER_LINE = 10;

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
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
}

exports.handler = async (event, context) => {
  const origin = event.headers.origin || event.headers.Origin || '';
  const headers = getCorsHeaders(origin);

  // Handle preflight CORS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Rate limit: 5 checkout attempts per IP per minute
  const ip = getClientIp(event);
  const { allowed } = await checkRateLimit(ip, 'checkout', context, 5, 60000);
  if (!allowed) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({ error: 'Too many requests. Please try again later.' })
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body. Expected shape:
    //   { items: [{ sku: 'jockblock-100ml', quantity: 2 }, ...] }
    // Legacy shape { quantity: N } is treated as a single 100mL line.
    const body = JSON.parse(event.body || '{}');
    const rawItems = Array.isArray(body.items)
      ? body.items
      : [{ sku: 'jockblock-100ml', quantity: body.quantity ?? 1 }];

    // Validate every line against the server-side catalog.
    const lineItems = [];
    for (const raw of rawItems) {
      const variant = VARIANTS[raw && raw.sku];
      if (!variant) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `Unknown product SKU: ${raw && raw.sku}` })
        };
      }
      const qty = Math.min(
        Math.max(parseInt(raw.quantity, 10) || 1, 1),
        MAX_QUANTITY_PER_LINE
      );
      lineItems.push({
        price_data: {
          currency: CURRENCY,
          product_data: {
            name: variant.name,
            description: variant.description,
            images: [variant.image]
          },
          unit_amount: variant.price
        },
        quantity: qty
      });
    }

    if (lineItems.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Cart is empty' })
      };
    }

    // Get the site URL for redirects
    const siteUrl = process.env.SITE_URL || `https://${event.headers.host}`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${siteUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?canceled=true`,
      // Collect shipping address
      shipping_address_collection: {
        allowed_countries: ['US', 'CA']
      },
      // Add shipping options
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 499,
              currency: 'usd'
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5
              },
              maximum: {
                unit: 'business_day',
                value: 7
              }
            }
          }
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 999,
              currency: 'usd'
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 2
              },
              maximum: {
                unit: 'business_day',
                value: 3
              }
            }
          }
        }
      ],
      // Collect billing address
      billing_address_collection: 'required',
      // Allow promo codes
      allow_promotion_codes: true
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url
      })
    };

  } catch (error) {
    console.error('Stripe checkout error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to create checkout session',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};
