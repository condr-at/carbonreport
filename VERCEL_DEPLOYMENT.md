# Vercel Deployment Guide

## Prerequisites

- GitHub account with this repository pushed
- Vercel account (free tier works)
- Supabase project with database ready

---

## Step 1: Prepare Environment Variables

You'll need these values from your Supabase project:

### Get Database URL (Transaction Pooler)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → **Settings** → **Database**
3. Scroll to **Connection String** section
4. Copy **Transaction Pooler** (port **6543**)
5. Replace `[YOUR-PASSWORD]` with your actual database password

Example:
```
postgresql://postgres.xxx:YOUR_PASSWORD@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

### Generate JWT Secret

```bash
openssl rand -base64 32
```

Or use any 32+ character random string.

---

## Step 2: Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

## Step 3: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your GitHub repository
4. **Framework Preset**: Next.js (auto-detected)
5. Click **Environment Variables** → Add the following:

| Key | Value | Environment |
|-----|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres.xxx:PASSWORD@...pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1` | Production |
| `JWT_SECRET` | `your-generated-32-char-secret` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://carbonreport.app` | Production |
| `RESEND_API_KEY` | `re_UH78eSQ5_GHn1e8TB7Kz8cQKPnssQPvtA` | Production |
| `FROM_EMAIL` | `noreply@carbonreport.app` | Production |

6. Click **Deploy**

### Option B: Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

Follow prompts, then add environment variables:

```bash
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add NEXT_PUBLIC_APP_URL production
```

---

## Step 4: Verify Deployment

### Check Build Logs

1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click latest deployment → **Building** tab
3. Look for:
   ```
   ✓ Prisma Client generated successfully
   ✓ Next.js build completed
   ```

### Test Endpoints

```bash
# Test database connection
curl https://carbonreport.app/api/projects

# Should return: {"projects": []}
```

### Check Landing Page

Open `https://carbonreport.app` in browser - should see Carbon Report landing page.

---

## Step 5: Database Migrations (if needed)

If you haven't run `prisma db push` yet on Supabase:

```bash
# Locally with Transaction Pooler URL
DATABASE_URL="postgresql://...6543/postgres?pgbouncer=true&connection_limit=1" \
npx prisma db push
```

Or use Vercel CLI:

```bash
vercel env pull .env.production
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) \
npx prisma db push
```

---

## Step 6: Seed Database (Optional)

```bash
# Use Session Pooler (port 5432) for migrations
DATABASE_URL="postgresql://...5432/postgres" \
npm run db:seed
```

**Note**: Use port **5432** for seeding, port **6543** only for production runtime.

---

## Troubleshooting

### Build fails: "Prisma Client not generated"

**Solution**: Check `package.json` has:
```json
"scripts": {
  "build": "prisma generate && next build",
  "postinstall": "prisma generate"
}
```

### Runtime error: "Can't reach database server"

**Solution**: Verify `DATABASE_URL` uses **port 6543** (Transaction Pooler) with `?pgbouncer=true&connection_limit=1`

### 500 error on `/api/projects`

**Solution**: Check Vercel logs:
1. Dashboard → Your Project → **Functions** tab
2. Find `/api/projects` → Click **View Logs**
3. Look for database connection errors

### Landing page shows 404

**Solution**: Check `src/app/page.tsx` exists and is not in `(auth)` or `(dashboard)` route group.

---

## Post-Deployment

### Custom Domain (Optional)

1. Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add your custom domain
3. Update `NEXT_PUBLIC_APP_URL` environment variable

### Enable Preview Deployments

Every push to non-main branches creates preview deployment automatically.

### Monitor Performance

1. Vercel Dashboard → **Analytics** tab
2. Check response times, error rates
3. Add alerts for downtime (Settings → Integrations)

---

## Environment Variables Reference

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Supabase Transaction Pooler (6543) | `postgresql://...6543/postgres?pgbouncer=true&connection_limit=1` |
| `JWT_SECRET` | 32+ character secret | `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | Your app URL | `https://carbonreport.app` |
| `RESEND_API_KEY` | Email service API key | `re_UH78eSQ5_GHn1e8TB7Kz8cQKPnssQPvtA` |
| `FROM_EMAIL` | Sender email address | `noreply@carbonreport.app` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_ACCESS_TOKEN_EXPIRES_IN` | Token expiry | `24h` |
| `JWT_REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiry | `90d` |

---

## Rollback

### Revert to Previous Deployment

1. Vercel Dashboard → **Deployments**
2. Find working deployment → Click **...** → **Promote to Production**

### Revert Database Changes

If schema changed, manually revert in Prisma Studio or SQL:
```bash
npx prisma studio
# Or run SQL commands in Supabase SQL Editor
```

---

## Next Steps

- [ ] Set up custom domain
- [ ] Configure auth endpoints (`/api/auth/*`)
- [ ] Test project creation flow
- [ ] Implement email service (Resend)
- [ ] Add monitoring/alerts

---

**Need Help?** Check [Vercel Docs](https://vercel.com/docs) or Supabase logs.
