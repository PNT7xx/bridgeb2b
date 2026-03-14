# BridgeB2B — Deployment Guide

## Project Structure

```
bridgeb2b/
├── api/
│   └── search.js        ← Serverless function (API key lives here, server-side only)
├── public/
│   └── index.html       ← Your entire frontend
├── vercel.json          ← Vercel routing config
├── package.json
└── .gitignore
```

---

## Deploy to Vercel (Step-by-Step)

### Step 1 — Create a free Vercel account
Go to https://vercel.com and sign up (use "Continue with GitHub" for easiest setup).

### Step 2 — Install the Vercel CLI (optional but handy)
```bash
npm install -g vercel
```

### Step 3 — Push your code to GitHub
1. Go to https://github.com/new and create a new repository called `bridgeb2b`
2. In your project folder, run:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/bridgeb2b.git
git push -u origin main
```

### Step 4 — Import to Vercel
1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Select your `bridgeb2b` GitHub repository
4. Click **Deploy** — Vercel auto-detects the config from `vercel.json`

### Step 5 — Add your Anthropic API key (IMPORTANT)
Your API key must NEVER go in your code or GitHub. Add it as an environment variable:

1. In your Vercel project dashboard, go to **Settings → Environment Variables**
2. Add a new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from https://console.anthropic.com
   - **Environment:** Production, Preview, Development (check all three)
3. Click **Save**
4. Go to **Deployments** and click **Redeploy** so it picks up the new variable

### Step 6 — Your site is live!
Vercel gives you a URL like `https://bridgeb2b.vercel.app` instantly.
You can also add a custom domain in **Settings → Domains**.

---

## Local Development

```bash
# Install dependencies
npm install

# Create a local env file (never commit this!)
echo "ANTHROPIC_API_KEY=your_key_here" > .env

# Run locally (Vercel dev simulates serverless functions)
npm run dev
```

Then open http://localhost:3000

---

## Getting Your Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign in or create an account
3. Navigate to **API Keys** → **Create Key**
4. Copy the key and paste it into Vercel's environment variables

> **Note:** You'll need to add a payment method and have credits in your Anthropic account.
> Each search costs roughly $0.01–0.02 in API usage.

---

## Optional: Add a Custom Domain

1. In Vercel dashboard → your project → **Settings → Domains**
2. Enter your domain (e.g. `bridgeb2b.com`)
3. Update your domain's DNS records as instructed by Vercel
4. SSL is automatic and free

---

## Cost Estimate (Vercel + Anthropic)

| Service | Cost |
|---------|------|
| Vercel Hobby plan | Free |
| Anthropic API (per search) | ~$0.01–0.02 |
| Custom domain (optional) | ~$10–15/year |

For low traffic (under a few hundred searches/day), total cost is nearly zero.
