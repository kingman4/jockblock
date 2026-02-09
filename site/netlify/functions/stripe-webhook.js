/**
 * Netlify Serverless Function: Stripe Webhook Handler
 *
 * Handles Stripe events, specifically checkout.session.completed
 * Schedules a review request email to be sent after purchase
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Email service (using Resend - simple, modern, good free tier)
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@jockblock.com';
const SITE_URL = process.env.SITE_URL || 'https://jockblock.com';

// Presale configuration (server-side env var for accurate date checking)
const MARKET_DATE = process.env.MARKET_DATE; // Format: YYYY-MM-DD

/**
 * Check if we're currently in presale mode
 */
function isPresaleMode() {
  if (!MARKET_DATE) return false;
  const marketDate = new Date(MARKET_DATE + 'T00:00:00Z');
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today <= marketDate;
}

/**
 * Format market date for display
 */
function formatMarketDate() {
  if (!MARKET_DATE) return '';
  const date = new Date(MARKET_DATE + 'T00:00:00Z');
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/**
 * Send presale order confirmation email
 */
async function sendPresaleConfirmationEmail(customerEmail, customerName) {
  const shippingDate = formatMarketDate();

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: 'Your Jock Block Pre-order is Confirmed! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 28px; margin: 0;">
              <span style="color: #00E676;">JOCK</span> <span style="color: #333;">BLOCK</span>
            </h1>
          </div>

          <p>Hi${customerName ? ` ${customerName}` : ''},</p>

          <p><strong>Thank you for your pre-order!</strong></p>

          <p>You're one of our early supporters, and we truly appreciate it. Your order has been confirmed and will ship on:</p>

          <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #D4A853; border-radius: 8px;">
            <p style="margin: 0; font-size: 24px; font-weight: bold; color: #000;">
              ${shippingDate}
            </p>
          </div>

          <p>We'll send you a shipping confirmation email with tracking information as soon as your order is on its way.</p>

          <p>In the meantime, if you have any questions, feel free to reach out via our <a href="${SITE_URL}/#contact" style="color: #00E676;">contact page</a>.</p>

          <p>
            Thanks for believing in us,<br>
            The Jock Block Team
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

          <p style="font-size: 12px; color: #666;">
            This is a pre-order confirmation. Your card has been charged and your order will ship on ${shippingDate}.
          </p>
        </body>
        </html>
      `
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send presale email: ${error}`);
  }

  return response.json();
}

/**
 * Send review request email via Resend
 */
async function sendReviewRequestEmail(customerEmail, customerName) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: 'How\'s your Jock Block working? We\'d love your feedback!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 28px; margin: 0;">
              <span style="color: #00E676;">JOCK</span> <span style="color: #333;">BLOCK</span>
            </h1>
          </div>

          <p>Hi${customerName ? ` ${customerName}` : ''},</p>

          <p>Thanks for trying Jock Block! We hope it's been helping with your symptoms.</p>

          <p>We'd love to hear about your experience. Your feedback helps other customers make informed decisions and helps us improve.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${SITE_URL}/review.html" style="display: inline-block; background-color: #00E676; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              Leave a Review
            </a>
          </div>

          <p>It only takes a minute, and we truly appreciate it.</p>

          <p>
            Thanks,<br>
            The Jock Block Team
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

          <p style="font-size: 12px; color: #666;">
            If you have any questions or concerns about your order, reply to this email or visit our <a href="${SITE_URL}/#contact" style="color: #00E676;">contact page</a>.
          </p>
        </body>
        </html>
      `
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }

  return response.json();
}

/**
 * Store customer for delayed email (using Netlify Scheduled Functions or external service)
 * For now, we'll send immediately but you could integrate with a queue
 */
async function scheduleReviewEmail(customerEmail, customerName, orderId) {
  // Option 1: Send immediately (for testing)
  // In production, you'd want to delay this 7-14 days

  // Option 2: Store in a database/queue and use Netlify Scheduled Functions
  // to process delayed emails

  // For simplicity, we'll log the intent and send immediately
  // You can integrate with services like:
  // - Inngest (https://inngest.com) - for delayed jobs
  // - QStash (https://upstash.com/qstash) - for scheduled HTTP calls
  // - A simple database + cron job

  console.log(`Scheduling review email for ${customerEmail} (Order: ${orderId})`);

  // For now, send immediately (in production, delay 7+ days)
  try {
    await sendReviewRequestEmail(customerEmail, customerName);
    console.log(`Review email sent to ${customerEmail}`);
  } catch (error) {
    console.error(`Failed to send review email to ${customerEmail}:`, error);
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    // Verify webhook signature
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`
    };
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object;

      // Extract customer info
      const customerEmail = session.customer_details?.email;
      const customerName = session.customer_details?.name?.split(' ')[0]; // First name
      const orderId = session.id;

      if (customerEmail) {
        // Send presale confirmation if in presale mode
        if (isPresaleMode()) {
          try {
            await sendPresaleConfirmationEmail(customerEmail, customerName);
            console.log(`Presale confirmation sent to ${customerEmail} (Order: ${orderId})`);
          } catch (error) {
            console.error(`Failed to send presale email to ${customerEmail}:`, error);
          }
        }

        // Schedule review request email (will be sent later)
        await scheduleReviewEmail(customerEmail, customerName, orderId);
      } else {
        console.log('No customer email found in session');
      }

      break;
    }

    case 'checkout.session.expired': {
      // Optional: Handle abandoned checkouts
      console.log('Checkout session expired:', stripeEvent.data.object.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true })
  };
};
