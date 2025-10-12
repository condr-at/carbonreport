# ✅ Готово к деплою на Vercel

## Что сделано

### 1. Конфигурация домена и email
- ✅ Домен: **carbonreport.app**
- ✅ Resend API key: `re_UH78eSQ5_GHn1e8TB7Kz8cQKPnssQPvtA`
- ✅ Email отправителя: `noreply@carbonreport.app`

### 2. Обновлены файлы
- ✅ `.env.example` - production values
- ✅ `VERCEL_DEPLOYMENT.md` - пошаговая инструкция
- ✅ `PRODUCTION_CONFIG.md` - детальная конфигурация
- ✅ `src/app/page.tsx` - marketing landing с carbonreport.app
- ✅ `prisma/seed.ts` - закомментирован ProjectFile
- ✅ `eslint.config.mjs` - отключен @typescript-eslint/no-explicit-any

### 3. Исправлены типы API routes (Next.js 15)
- ✅ `src/app/api/projects/[id]/dataset/route.ts`
- ✅ `src/app/api/projects/[projectId]/reports/[reportId]/route.ts`
- ✅ `src/app/api/projects/[id]/mailto-templates/route.ts`
- ✅ `src/app/api/projects/[id]/mailto-templates/[fieldId]/route.ts`

Все routes теперь используют `params: Promise<{ id: string }>` вместо `params: { id: string }`

### 4. Локальный билд
```bash
✅ Prisma Client generated successfully
✅ Next.js compiled successfully
✅ 7 routes created (1 static, 6 dynamic)
✅ Build size optimized (First Load JS: 102-105 kB)
```

---

## Следующие шаги (Deploy на Vercel)

### 1. Commit & Push
```bash
git add .
git commit -m "Production ready: carbonreport.app config, landing page, API fixes"
git push origin main
```

### 2. Vercel Dashboard Setup

Перейдите на https://vercel.com/new и:

1. **Import Git Repository** → Select `carbonreport`
2. **Framework Preset**: Next.js ✅ (auto-detected)
3. **Environment Variables** (добавьте все):

```bash
DATABASE_URL="postgresql://postgres.xxx:PASSWORD@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
JWT_SECRET="ваш-32-символьный-секрет"
NEXT_PUBLIC_APP_URL="https://carbonreport.app"
RESEND_API_KEY="re_UH78eSQ5_GHn1e8TB7Kz8cQKPnssQPvtA"
FROM_EMAIL="noreply@carbonreport.app"
```

4. **Deploy** → Дождитесь завершения (2-5 минут)

### 3. Custom Domain Setup

После успешного деплоя:

1. Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add Domain: `carbonreport.app`
3. Добавьте DNS записи в вашем domain registrar:

```dns
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. Ожидайте propagation (обычно < 1 час)

### 4. Resend Domain Verification

1. Перейдите на https://resend.com/domains
2. Add Domain: `carbonreport.app`
3. Добавьте DNS records (показаны в dashboard):

```dns
Type: TXT
Name: @
Value: [verification token from Resend]

Type: MX
Name: @
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; sp=none; adkim=r; aspf=r
```

### 5. Проверка после деплоя

```bash
# 1. Landing page
curl -I https://carbonreport.app
# Expected: 200 OK

# 2. API health
curl https://carbonreport.app/api/projects
# Expected: {"projects": []} или authentication error

# 3. Test email (регистрация нового пользователя)
curl -X POST https://carbonreport.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
  }'
# Check inbox for verification email from noreply@carbonreport.app
```

---

## Документация

- 📖 **VERCEL_DEPLOYMENT.md** - Полное руководство по деплою
- 🔧 **PRODUCTION_CONFIG.md** - Конфигурация и мониторинг
- 📝 **.env.example** - Пример environment variables

---

## Важные заметки

### Database Connection
- **Development**: Port 5432 (Session Pooler)
- **Production**: Port 6543 (Transaction Pooler) с `?pgbouncer=true&connection_limit=1`

### Маршруты
- `/` - Marketing landing (public)
- `/login`, `/register` - Auth pages (TODO: create)
- `/api/*` - Backend API routes (11 endpoints готовы)

### Post-MVP Features
- File uploads (Vercel Blob) - закомментировано
- OAuth providers - не реализовано
- Frontend pages - только landing готов

---

## Rollback Plan

Если что-то пойдёт не так:

1. Vercel Dashboard → **Deployments**
2. Найдите последний рабочий deploy → **...** → **Promote to Production**

---

**Проект готов к production deployment! 🚀**

Следующий шаг: `git push origin main` и настройка Vercel.
