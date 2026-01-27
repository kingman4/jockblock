# Jock Block

E-commerce website for Jock Block, a homeopathic antifungal spray for temporary relief of jock itch, athlete's foot, and ringworm.

**Company:** King-Tech Industry, Inc.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (vanilla, no frameworks)
- **Hosting:** Netlify (static site + serverless functions)
- **Payments:** Stripe (Prebuilt Checkout)
- **Email:** Resend (transactional emails)
- **Forms:** Netlify Forms
- **Testing:** Jest (unit), Playwright (e2e)

## Features

- Single-product e-commerce store
- Stripe checkout integration
- Contact form with spam protection
- Post-purchase review request emails
- Review submission system
- 30-day returns policy page
- Mobile-responsive design
- FDA-compliant product copy

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/jockblock.git
cd jockblock/site

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your actual keys

# Run locally
npx netlify dev
```

## Deployment

### Netlify Setup

1. Connect your GitHub repo to Netlify
2. Configure build settings:
   - **Base directory:** `site`
   - **Build command:** `npm install`
   - **Publish directory:** `site`
   - **Functions directory:** `site/netlify/functions`
3. Add environment variables in Site Settings → Environment Variables

### Stripe Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/.netlify/functions/stripe-webhook`
3. Select event: `checkout.session.completed`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET` in Netlify

### Resend Setup

1. Create account at [resend.com](https://resend.com)
2. Get API key from dashboard
3. Verify your domain (for production emails)
4. Add `RESEND_API_KEY` and `FROM_EMAIL` to Netlify environment variables

### Domain Setup

1. Add custom domain in Netlify → Site Settings → Domain Management
2. Update DNS at your registrar (or use Netlify DNS)
3. SSL certificate provisions automatically

## Project Structure

```
site/
├── css/
│   ├── variables.css    # Design tokens
│   ├── reset.css        # CSS reset
│   ├── base.css         # Base styles
│   ├── components.css   # UI components
│   └── layout.css       # Page layouts
├── js/
│   ├── main.js          # App initialization
│   ├── cart.js          # Shopping cart logic
│   └── form-validation.js
├── netlify/
│   └── functions/
│       ├── create-checkout.js   # Stripe session creation
│       └── stripe-webhook.js    # Post-purchase handler
├── __tests__/
│   ├── unit/            # Jest unit tests
│   └── e2e/             # Playwright e2e tests
├── index.html           # Homepage
├── success.html         # Post-checkout confirmation
├── review.html          # Review submission form
├── returns.html         # Returns policy
├── netlify.toml         # Netlify configuration
└── package.json
```

## Testing

```bash
# Run unit tests
npm test

# Run unit tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e

# Run e2e tests with browser visible
npm run test:e2e:headed
```

## Scripts

```bash
npm test          # Run Jest unit tests
npm run dev       # Start local server (port 3000)
npm run test:e2e  # Run Playwright e2e tests
```

Or use the Makefile:

```bash
make test         # Run unit tests
make dev          # Start dev server
make test-e2e     # Run e2e tests
```

## License

Proprietary - King-Tech Industry, Inc.
