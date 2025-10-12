# 🗂️ ENV Files Explained

## Файлы в проекте:

### 1. `.env` 🔴 GITIGNORED
**Назначение**: Твой локальный development  
**Где**: Только на твоём компе  
**Содержит**: 
- Твой реальный Supabase DATABASE_URL (port 5432)
- Твой Resend API key
- Локальные настройки

**Статус**: ✅ УЖЕ НАСТРОЕН с реальными данными

---

### 2. `.env.example` ✅ COMMITTED
**Назначение**: Шаблон для других разработчиков  
**Где**: В Git (безопасно, только placeholders)  
**Содержит**: Примеры без реальных секретов  

**Использование**: Другие делают `cp .env.example .env` и подставляют свои данные

---

### 3. `vercel.env.template` ✅ COMMITTED  
**Назначение**: Шаблон для импорта в Vercel Dashboard  
**Где**: В Git (только placeholders - безопасно!)  
**Содержит**: 
- ❌ DATABASE_URL - placeholder (замени на свой Supabase URL)
- ❌ JWT_SECRET - placeholder (сгенерируй для production)
- ✅ Resend API key (публичный, безопасно)
- ✅ carbonreport.app domain

**Что делать:**
```bash
# 1. Скопируй
cp vercel.env.template .env.vercel

# 2. Отредактируй .env.vercel - замени 2 значения:
#    DATABASE_URL → твой Supabase URL (port 6543)
#    JWT_SECRET → openssl rand -base64 32

# 3. Импортируй .env.vercel в Vercel Dashboard
# 4. НЕ коммить .env.vercel! (уже в .gitignore)
```

### 4. `.env.vercel` 🔴 GITIGNORED (создашь локально)
**Назначение**: Готовый файл с реальными данными для импорта  
**Где**: Только локально, НЕ в Git  
**Содержит**: Все реальные секреты для production  
**Использование**: Импортируешь в Vercel один раз

---

## Почему Resend API key в template?

**Resend API key** можно коммитить потому что:
1. ✅ Он привязан к домену `carbonreport.app`
2. ✅ Без доступа к DNS нельзя подтвердить другой домен
3. ✅ Есть rate limits от Resend
4. ✅ Можно отозвать и создать новый в любой момент

**DATABASE_URL и JWT_SECRET** - НЕ коммитим:
1. ❌ Пароль БД дает полный доступ к данным
2. ❌ JWT_SECRET позволяет подделывать токены
3. ❌ Эти данные должны быть уникальны для каждого deployment

---

## Итого: какой файл использовать?

### Для разработки:
```bash
.env  # Уже настроен ✅
```

### Для Vercel деплоя:
```bash
vercel.env.template  # Замени JWT_SECRET → импортируй в Vercel
```

### Для других разработчиков:
```bash
.env.example  # Шаблон без секретов
```

---

## Упрощённая инструкция для Vercel:

```bash
# 1. Сгенерируй production JWT secret
openssl rand -base64 32

# 2. Скопируй vercel.env.template
cp vercel.env.template .env.vercel

# 3. Открой .env.vercel и замени:
JWT_SECRET=ЗАМЕНИ_НА_РЕЗУЛЬТАТ_openssl_rand_base64_32
# на реальное значение из шага 1

# 4. Vercel Dashboard → Import .env.vercel
```

---

## Что удалил:

- ❌ `.env.production` - был дубликатом, путал
- ❌ S3 переменные из .env - Post-MVP feature

---

## Безопасность:

| Файл | В Git? | Содержит секреты? | Назначение |
|------|--------|-------------------|------------|
| `.env` | ❌ Нет | ✅ Да (твои локальные) | Development |
| `.env.example` | ✅ Да | ❌ Нет (placeholders) | Шаблон для разработчиков |
| `vercel.env.template` | ✅ Да | ❌ Нет (только Resend key) | Шаблон для Vercel |
| `.env.vercel` | ❌ Нет | ✅ Да (реальные данные) | Импорт в Vercel |

---

**TL;DR**: Используй `vercel.env.template`, замени JWT_SECRET, импортируй в Vercel. Готово! 🚀
