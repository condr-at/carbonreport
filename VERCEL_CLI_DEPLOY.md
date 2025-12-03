# Quick Vercel Deployment with CLI

## Prerequisites
```bash
npm i -g vercel
vercel login
```

## Option 1: Import from file (Fastest)

### 1. Prepare environment file
```bash
cp vercel.env.template .env.production.local

# Edit .env.production.local and replace:
# - DATABASE_URL (your Supabase connection string with port 6543)
# - JWT_SECRET (generate with: openssl rand -base64 32)
```

### 2. Link to Vercel project
```bash
vercel link
# Follow prompts to connect to your Vercel project
```

### 3. Import environment variables
```bash
# Import all variables at once
vercel env add < .env.production.local

# Or use vercel env pull/push workflow:
vercel env add DATABASE_URL production
# Paste your value when prompted
# Repeat for each variable
```

### 4. Deploy
```bash
vercel --prod
```

---

## Option 2: Manual Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository `carbonreport`
3. Settings → Environment Variables → Import .env
4. Upload `vercel.env.template` (after editing placeholders)

---

## Environment Variables Checklist

Make sure you have values for:

- [ ] **DATABASE_URL** - Supabase Transaction Pooler (port 6543)
  ```
  postgresql://postgres.xxx:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
  ```

- [ ] **JWT_SECRET** - 32+ character secret
  ```bash
  openssl rand -base64 32
  ```

- [ ] **NEXT_PUBLIC_APP_URL** - `https://carbonreport.app`

- [ ] **RESEND_API_KEY** - `re_UH78eSQ5_GHn1e8TB7Kz8cQKPnssQPvtA`

- [ ] **FROM_EMAIL** - `noreply@carbonreport.app`

Optional (have defaults):
- [ ] **JWT_ACCESS_TOKEN_EXPIRES_IN** - `24h`
- [ ] **JWT_REFRESH_TOKEN_EXPIRES_IN** - `90d`
- [ ] **NODE_ENV** - `production`

---

## Verify Deployment

```bash
# Check deployment URL
vercel ls

# Test landing page
curl -I https://carbonreport.app

# Test API
curl https://carbonreport.app/api/projects

# View logs
vercel logs
```

---

## Troubleshooting

### Build fails: "Prisma Client not generated"
```bash
# Check package.json has:
"scripts": {
  "build": "prisma generate && next build",
  "postinstall": "prisma generate"
}
```

### Database connection error
```bash
# Verify DATABASE_URL:
# 1. Uses port 6543 (Transaction Pooler)
# 2. Has ?pgbouncer=true&connection_limit=1
# 3. Password is correct (no special chars causing issues)
```

### Environment variables not loading
```bash
# Check environment scope:
vercel env ls

# Pull latest:
vercel env pull .env.vercel.local

# Redeploy:
vercel --prod --force
```

---

## Quick Reference

```bash
# Link project
vercel link

# Add single env var
vercel env add JWT_SECRET production

# List all env vars
vercel env ls

# Remove env var
vercel env rm JWT_SECRET production

# Deploy to production
vercel --prod

# Check logs
vercel logs --follow
```

---

**File to edit**: `vercel.env.template` (replace DATABASE_URL and JWT_SECRET)
**Don't commit**: `.env.production.local` (add to .gitignore)
