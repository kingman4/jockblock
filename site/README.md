# Jock Block

E-commerce website for Jock Block homeopathic antifungal spray.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Hosting**: Netlify
- **Payments**: Stripe Checkout
- **Email**: Resend
- **Storage**: Netlify Blobs (for reviews)
- **Forms**: Netlify Forms
- **Testing**: Jest (unit), Playwright (e2e)
- **CI/CD**: GitHub Actions

## Prerequisites

- Node.js 18+
- npm
- Stripe account
- Resend account
- Netlify account

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/jockblock.git
   cd jockblock/site
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers (for e2e tests):
   ```bash
   npx playwright install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your actual values (see [Environment Variables](#environment-variables) below).

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `STRIPE_PUBLISHABLE_KEY` | Stripe public key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_SECRET_KEY` | Stripe secret key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | Stripe Dashboard → Webhooks |
| `RESEND_API_KEY` | Email API key | [Resend](https://resend.com/api-keys) |
| `FROM_EMAIL` | Verified sender email | Must be verified in Resend |
| `ADMIN_EMAIL` | Receives review approvals | Your admin email |
| `REVIEW_APPROVAL_SECRET` | Secures approval links | Generate a random string |

## Running Locally

Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:3000`.

For Netlify Functions (checkout, webhooks), use the Netlify CLI:
```bash
npm install -g netlify-cli
netlify dev
```

## Testing

Run unit tests:
```bash
npm test
```

Run unit tests with coverage:
```bash
npm run test:coverage
```

Run e2e tests:
```bash
npm run test:e2e
```

Run e2e tests with browser visible:
```bash
npm run test:e2e:headed
```

Run linting:
```bash
npm run lint
```

## Project Structure

```
site/
├── __tests__/
│   ├── unit/           # Jest unit tests
│   └── e2e/            # Playwright e2e tests
├── css/                # Stylesheets
├── data/               # Static data (sample reviews)
├── js/                 # Client-side JavaScript
├── netlify/
│   └── functions/      # Serverless functions
├── index.html          # Homepage
├── review.html         # Review submission page
├── returns.html        # Returns policy
└── success.html        # Post-checkout success
```

## Deployment

The site deploys automatically to Netlify when changes are pushed to the `main` branch.

### Manual Deployment

1. Connect your GitHub repo to Netlify
2. Set build settings:
   - Base directory: `site`
   - Build command: `npm run build`
   - Publish directory: `site`
3. Add environment variables in Netlify dashboard
4. Configure Stripe webhook to point to `https://your-site.netlify.app/.netlify/functions/stripe-webhook`

## License

UNLICENSED - All rights reserved.
