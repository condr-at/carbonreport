# Deployment Files Overview

## 📁 Environment Files

### `.env.example`
- **Purpose**: Development template
- **Usage**: `cp .env.example .env` for local development
- **Committed**: ✅ Yes (safe, no secrets)

### `.env.production`
- **Purpose**: Production values reference
- **Usage**: Reference for manual Vercel setup
- **Committed**: ❌ No (gitignored)

### `vercel.env.template`
- **Purpose**: Import-ready file for Vercel
- **Usage**: Edit DATABASE_URL & JWT_SECRET → Import in Vercel Dashboard
- **Committed**: ✅ Yes (placeholders only)
- **Action Required**: 
  1. Replace `DATABASE_URL` with your Supabase URL (port 6543)
  2. Replace `JWT_SECRET` with generated secret: `openssl rand -base64 32`

---

## 📖 Documentation Files

### `READY_TO_DEPLOY.md` ⭐ **START HERE**
Quick checklist and two deployment options (CLI vs Dashboard)

### `VERCEL_CLI_DEPLOY.md`
Step-by-step CLI deployment guide with troubleshooting

### `VERCEL_DEPLOYMENT.md`
Comprehensive dashboard deployment guide

### `PRODUCTION_CONFIG.md`
DNS, Resend, monitoring, and rollback procedures

---

## 🚀 Quick Start Options

### Option A: CLI (5 minutes)
```bash
cp vercel.env.template .env.production.local
# Edit DATABASE_URL and JWT_SECRET
vercel login
vercel link
vercel --prod
```

### Option B: Dashboard (10 minutes)
1. Push to GitHub
2. Import repo in Vercel
3. Upload edited `vercel.env.template`
4. Deploy

---

## ✅ Deployment Checklist

Before deploying:
- [ ] Code pushed to GitHub
- [ ] `vercel.env.template` edited (DATABASE_URL, JWT_SECRET)
- [ ] Supabase database ready (port 6543 Transaction Pooler)
- [ ] JWT secret generated: `openssl rand -base64 32`

After deploying:
- [ ] Custom domain `carbonreport.app` added in Vercel
- [ ] DNS A record: `@` → `76.76.21.21`
- [ ] DNS CNAME: `www` → `cname.vercel-dns.com`
- [ ] Resend domain verified (TXT, MX, DMARC records)
- [ ] Test landing page: `https://carbonreport.app`
- [ ] Test API: `curl https://carbonreport.app/api/projects`

---

## 📂 File Structure

```
carbonreport/
├── .env.example              # Dev template (committed)
├── .env.production           # Prod reference (gitignored)
├── vercel.env.template       # Vercel import (committed) ⭐
├── READY_TO_DEPLOY.md        # Quick start guide ⭐
├── VERCEL_CLI_DEPLOY.md      # CLI guide
├── VERCEL_DEPLOYMENT.md      # Dashboard guide
├── PRODUCTION_CONFIG.md      # DNS & monitoring
└── .vercelignore             # Deployment exclusions
```

---

## 🔐 Security Notes

**Never commit to git:**
- `.env` (local dev with real secrets)
- `.env.production.local` (prod secrets)
- `.env.*.local` (any local overrides)

**Safe to commit:**
- `.env.example` (placeholders)
- `vercel.env.template` (placeholders)

**Current .gitignore:**
```gitignore
.env*
!.env.example
!vercel.env.template
```

---

## 🛠️ Environment Variables

| Variable | Required | Example | Where to get |
|----------|----------|---------|--------------|
| `DATABASE_URL` | ✅ | `postgresql://...6543/...` | Supabase Dashboard → Database → Connection String (Transaction Pooler) |
| `JWT_SECRET` | ✅ | `32+ chars` | Generate: `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | ✅ | `https://carbonreport.app` | Your domain |
| `RESEND_API_KEY` | ✅ | `re_xxx...` | Already set: `re_UH78eSQ5_GHn1e8TB7Kz8cQKPnssQPvtA` |
| `FROM_EMAIL` | ✅ | `noreply@carbonreport.app` | Already set |
| `JWT_ACCESS_TOKEN_EXPIRES_IN` | ❌ | `24h` | Default: 24h |
| `JWT_REFRESH_TOKEN_EXPIRES_IN` | ❌ | `90d` | Default: 90d |

---

## 📞 Support

If deployment fails:
1. Check **VERCEL_CLI_DEPLOY.md** → Troubleshooting section
2. Verify environment variables: `vercel env ls`
3. Check Vercel logs: `vercel logs --follow`
4. Check build output in Vercel Dashboard → Deployments → Building tab

---

**Next Step**: Open `READY_TO_DEPLOY.md` and choose deployment method! 🚀
