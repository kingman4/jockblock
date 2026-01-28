/**
 * Netlify Function: Review Submission Webhook
 *
 * Triggered when a new review is submitted via Netlify Forms.
 * Sends an approval email to the admin with approve/reject links.
 *
 * Setup:
 * 1. Go to Netlify Dashboard → Forms → reviews → Settings → Form notifications
 * 2. Add outgoing webhook: https://yourdomain.com/.netlify/functions/review-webhook
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.FROM_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@jockblock.com';
const SITE_URL = process.env.SITE_URL || 'https://jockblock.com';
const REVIEW_APPROVAL_SECRET = process.env.REVIEW_APPROVAL_SECRET;

/**
 * Send approval email to admin
 */
async function sendApprovalEmail(review) {
  // Encode review data for the approval link
  const reviewData = Buffer.from(JSON.stringify({
    rating: review.rating,
    name: review.name,
    review: review.review,
    email: review.email,
    submittedAt: new Date().toISOString()
  })).toString('base64url');

  const approveUrl = `${SITE_URL}/.netlify/functions/approve-review?action=approve&data=${reviewData}&secret=${REVIEW_APPROVAL_SECRET}`;
  const rejectUrl = `${SITE_URL}/.netlify/functions/approve-review?action=reject&data=${reviewData}&secret=${REVIEW_APPROVAL_SECRET}`;

  const stars = '★'.repeat(parseInt(review.rating)) + '☆'.repeat(5 - parseInt(review.rating));

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Review Pending Approval (${review.rating}/5 stars)`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">New Review Submission</h2>

          <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>Rating:</strong> <span style="color: #D4A853;">${stars}</span></p>
            <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${review.name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${review.email || 'Not provided'}</p>
            <p style="margin: 0;"><strong>Review:</strong></p>
            <p style="margin: 10px 0 0 0; padding: 10px; background: white; border-radius: 4px;">${review.review}</p>
          </div>

          <div style="text-align: center;">
            <a href="${approveUrl}" style="display: inline-block; background-color: #00E676; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-right: 10px;">
              ✓ Approve
            </a>
            <a href="${rejectUrl}" style="display: inline-block; background-color: #ff4444; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              ✗ Reject
            </a>
          </div>

          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            This review was submitted on ${new Date().toLocaleString()}.
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

exports.handler = async (event) => {
  // Only allow POST (from Netlify Forms webhook)
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the form submission from Netlify
    const payload = JSON.parse(event.body);

    // Netlify Forms webhook sends data in payload.data for form submissions
    const formData = payload.data || payload;

    // Validate required fields
    if (!formData.rating || !formData.name || !formData.review) {
      console.log('Missing required fields:', formData);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Send approval email
    await sendApprovalEmail(formData);

    console.log(`Approval email sent for review by ${formData.name}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Approval email sent' })
    };

  } catch (error) {
    console.error('Error processing review webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process review' })
    };
  }
};
