# Как проверить, что браузер загрузил новый код

## 🔍 Быстрая проверка в DevTools

### Вариант 1: Network Tab (самый простой)
1. Открой **DevTools** (F12 или Cmd+Option+I)
2. Вкладка **Network**
3. Поставь галку **Disable cache**
4. Обнови страницу (Cmd+R)
5. Найди в списке файл `page.js` или `questionnaire`
6. Посмотри размер - если новый код, размер будет другой

### Вариант 2: Sources Tab (точная проверка)
1. DevTools → **Sources**
2. В левой панели разверни:
   ```
   webpack://carbonreport
   └── ./src/app/projects/new/questionnaire
       └── page.tsx
   ```
3. Открой `page.tsx`
4. Посмотри на строку 11-15:

**СТАРЫЙ КОД (если видишь это - кеш!):**
```typescript
const ASSESSMENT_GOALS = [
  { value: 'iso14067', label: 'ISO 14067 Certification', ...
```

**НОВЫЙ КОД (правильная версия):**
```typescript
import { 
  WIZARD_QUESTIONNAIRE, 
  getNextQuestion, 
  getVisibleQuestions,
  getRecommendedTemplates 
} from '@/lib/questionnaires/wizard-config';
```

### Вариант 3: Console Tab (проверка в рантайме)
1. DevTools → **Console**
2. Набери:
```javascript
// Проверить текущие данные wizard
sessionStorage.getItem('wizardAnswers')

// Проверить, есть ли новый импорт (если страница использует старый код, будет undefined)
window.WIZARD_QUESTIONNAIRE
```

## 🧹 Как очистить кеш (по приоритету)

### 1️⃣ Hard Reload (попробуй сначала)
```
Cmd + Shift + R (macOS)
Ctrl + Shift + R (Windows)
```

### 2️⃣ Empty Cache and Hard Reload
1. DevTools открыты (F12)
2. **Правый клик** на кнопке Refresh
3. Выбрать **"Empty Cache and Hard Reload"**

### 3️⃣ Полная очистка в DevTools
1. DevTools → **Application** tab
2. Левая панель → **Storage**
3. Клик → **Clear site data**
4. Галки на:
   - ✅ Local and session storage
   - ✅ Cache storage
   - ✅ Cookies
5. **Clear site data** → Обновить страницу

### 4️⃣ Инкогнито (гарантированно чистый)
```
Cmd + Shift + N (новое окно инкогнито)
```
Открой: http://localhost:3001/projects/new

### 5️⃣ Пересобрать Next.js (если всё остальное не помогло)
```bash
# Убить сервер
pkill -f "next dev"

# Удалить кеш Next.js
rm -rf .next

# Запустить заново
npm run dev
```

## ✅ Как убедиться что работает новый код

После очистки кеша проверь:

1. **Шаг счётчик динамический:**
   - ISO путь: "Step 2 of 3" (1 вопрос)
   - CBAM путь: "Step 2 of 4" или "Step 3 of 4" (2-3 вопроса)

2. **Прогресс бар динамический:**
   - Количество полосок меняется в зависимости от ответов

3. **Условные вопросы:**
   - Выбери "EU CBAM Compliance" → должен появиться вопрос "Product Type"
   - Выбери "ISO 14067" → сразу на Select Reports (без доп. вопросов)

4. **sessionStorage:**
   ```javascript
   // В Console DevTools
   JSON.parse(sessionStorage.getItem('wizardAnswers'))
   // Должен показать: { assessment_goal: "cbam", product_type: "cement", ... }
   ```

## 🚨 Если всё равно не работает

**Проверь порт сервера:**
```bash
# В терминале где запущен npm run dev
# Должно показать:
- Local: http://localhost:3001  # ← ЭТОТ порт используй!
```

**Возможно у тебя 2 сервера:**
- Старый на порту 3000
- Новый на порту 3001

**Открывай именно тот порт, где запущен НОВЫЙ сервер!**

---

## 📊 Тестовые сценарии

### ✅ Сценарий 1: ISO путь (1 вопрос)
1. http://localhost:3001/projects/new
2. Имя: "Test ISO"
3. Next → вопрос 1: **"ISO 14067 Certification"**
4. Next → **сразу Select Reports**
5. Проверь: **"Step 2 of 3"** + ISO pre-selected

### ✅ Сценарий 2: CBAM путь (3 вопроса)  
1. http://localhost:3001/projects/new
2. Имя: "Test CBAM"
3. Next → вопрос 1: **"EU CBAM Compliance"**
4. Next → вопрос 2: **"Iron & Steel"** (должен появиться!)
5. Next → вопрос 3: **"European Union"** (должен появиться!)
6. Next → Select Reports
7. Проверь: **CBAM pre-selected** ✅

---

## 🎯 TL;DR

**Самый быстрый способ:**
1. Открой DevTools (F12)
2. Правый клик на Refresh → **"Empty Cache and Hard Reload"**
3. Проверь вопросы - если CBAM показывает 3 шага = работает!

**Если не помогло:**
```bash
rm -rf .next && npm run dev
```
Потом открой в **инкогнито**: http://localhost:3001/projects/new
