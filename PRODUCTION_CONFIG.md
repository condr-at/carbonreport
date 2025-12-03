# Production Configuration Summary

## Domain: carbonreport.app

### Environment Variables (Production)

```bash
# Database
DATABASE_URL="postgresql://postgres.xxx:PASSWORD@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Authentication
JWT_SECRET="your-generated-32-char-secret"
JWT_ACCESS_TOKEN_EXPIRES_IN="24h"
JWT_REFRESH_TOKEN_EXPIRES_IN="90d"

# Email (Resend)
RESEND_API_KEY="re_UH78eSQ5_GHn1e8TB7Kz8cQKPnssQPvtA"
FROM_EMAIL="noreply@carbonreport.app"

# Application
NEXT_PUBLIC_APP_URL="https://carbonreport.app"
NODE_ENV="production"
```

---

## Vercel Environment Variables Checklist

Add these in Vercel Dashboard → Your Project → Settings → Environment Variables:

- [ ] `DATABASE_URL` - Supabase Transaction Pooler (port 6543)
- [ ] `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- [ ] `NEXT_PUBLIC_APP_URL` - `https://carbonreport.app`
- [ ] `RESEND_API_KEY` - `re_UH78eSQ5_GHn1e8TB7Kz8cQKPnssQPvtA`
- [ ] `FROM_EMAIL` - `noreply@carbonreport.app`

Optional (defaults work):
- [ ] `JWT_ACCESS_TOKEN_EXPIRES_IN` - `24h`
- [ ] `JWT_REFRESH_TOKEN_EXPIRES_IN` - `90d`
- [ ] `NODE_ENV` - `production`

---

## Domain Configuration

### Vercel Custom Domain Setup

1. Go to Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter: `carbonreport.app`
4. Add DNS records in your domain provider:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

5. Add subdomain (if needed):
```
Type: CNAME
Name: *
Value: cname.vercel-dns.com
```

6. Wait for DNS propagation (up to 48 hours, usually < 1 hour)

---

## Email Configuration (Resend)

### Domain Verification

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add domain: `carbonreport.app`
3. Add these DNS records:

```
Type: TXT
Name: @
Value: [resend verification token from dashboard]

Type: MX
Name: @
Value: feedback-smtp.us-east-1.amazonses.com (Priority: 10)

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; sp=none; adkim=r; aspf=r
```

4. Wait for verification (usually < 15 minutes)

### Test Email Sending

```bash
curl -X POST https://carbonreport.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "name": "Test User"
  }'
```

Check that verification email arrives at `test@example.com`.

---

## Pre-Deployment Checklist

- [x] S3 removed from all documentation
- [x] Build script fixed (prisma generate)
- [x] Marketing landing page created
- [x] .env.example updated with production values
- [x] .vercelignore created
- [x] schema.prisma updated (ProjectFile commented)
- [x] Domain configured (carbonreport.app)
- [x] Resend API key added
- [x] FROM_EMAIL set (noreply@carbonreport.app)

---

## Post-Deployment Testing

### 1. Test Landing Page
```bash
curl -I https://carbonreport.app
# Expected: 200 OK
```

### 2. Test API Health
```bash
curl https://carbonreport.app/api/projects
# Expected: {"projects": []} or authentication error
```

### 3. Test Database Connection
Check Vercel logs for Prisma Client initialization:
- Dashboard → Your Project → **Functions** → `/api/projects`
- Look for: `Prisma Client initialized successfully`

### 4. Test Email Service (Optional)
Try registration flow to verify Resend integration.

---

## Rollback Plan

If deployment fails:

1. **Revert Vercel Deployment**:
   - Dashboard → **Deployments**
   - Find last working deployment → Click **...** → **Promote to Production**

2. **Fix Issue Locally**:
   ```bash
   npm run build  # Test build locally
   git revert HEAD  # Revert last commit if needed
   ```

3. **Redeploy**:
   ```bash
   git push origin main
   ```

---

## Monitoring

### Vercel Analytics
- Dashboard → Your Project → **Analytics**
- Monitor response times, error rates, traffic

### Supabase Database
- Dashboard → Your Project → **Database** → **Logs**
- Monitor query performance, connection pool usage

### Resend Email Logs
- Dashboard → **Logs**
- Check email delivery rates, bounces, complaints

---

## Next Steps After Deployment

1. [ ] Verify domain resolves to Vercel
2. [ ] Test all API endpoints
3. [ ] Configure monitoring/alerts
4. [ ] Set up backup strategy
5. [ ] Implement frontend pages (auth, dashboard)
6. [ ] Add error tracking (Sentry)
7. [ ] Set up CI/CD pipeline

---

**Production URL**: https://carbonreport.app
**Support Email**: noreply@carbonreport.app (change to support@carbonreport.app later)
**API Base**: https://carbonreport.app/api

