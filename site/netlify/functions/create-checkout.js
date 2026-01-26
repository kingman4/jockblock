/**
 * Netlify Serverless Function: Create Stripe Checkout Session
 *
 * This function securely creates a Stripe Checkout session server-side,
 * keeping the secret key secure and never exposing it to the client.
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Product configuration
const PRODUCT = {
  name: 'Jock Block Antifungal Spray',
  description: 'Homeopathic antifungal spray with Sulfur 6X HPUS - 60mL',
  price: parseInt(process.env.STRIPE_PRICE_AMOUNT) || 1999, // cents
  currency: 'usd',
  image: 'https://jockblock.com/images/product-main.png' // Update with actual image URL
};

// CORS headers for local development and production
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

exports.handler = async (event, context) => {
  // Handle preflight CORS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
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
    // Parse request body
    const { quantity = 1 } = JSON.parse(event.body || '{}');

    // Validate quantity
    const validQuantity = Math.min(Math.max(parseInt(quantity) || 1, 1), 10);

    // Get the site URL for redirects
    const siteUrl = process.env.SITE_URL || `https://${event.headers.host}`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: PRODUCT.currency,
            product_data: {
              name: PRODUCT.name,
              description: PRODUCT.description,
              images: [PRODUCT.image]
            },
            unit_amount: PRODUCT.price
          },
          quantity: validQuantity
        }
      ],
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
