# Mock Data Implementation - Summary

## ✅ Завершено

Реализованы реалистичные mock данные для разработки и тестирования.

## Что создано

### 1. Обновлённый seed script (`prisma/seed.ts`)

**До**:
- 7 полей вручную (старый FieldId enum)
- Hardcoded значения
- Нет полного датасета

**После**:
- 162 поля из `dataset-schema.json`
- Mock данные для 2 типов проектов
- Полный датасет с выборочным заполнением

### 2. Mock данные в БД

```
✅ Users: 1 (John Doe)
✅ Contacts: 2 (Ivan Petrov, Maria Garcia)
✅ Projects: 2 (E-Bike, Steel)
✅ Reports: 2 (ISO14067, CBAM)
✅ Data Requests: 1
```

### 3. Проекты с реалистичными данными

#### Project 1: E-Bike
- **Dataset**: 12/162 fields filled (7%)
- **Mock data**: Organization, Product, Materials, Impact
- **Repeatable**: 1 material item (Aluminum Frame)

#### Project 2: Steel
- **Dataset**: 9/162 fields filled (6%)
- **Mock data**: Organization, Product, Scope, Impact
- **Repeatable**: Minimal items

### 4. Документация

- ✅ `DATABASE_MOCK_DATA.md` - Полное описание mock данных
- ✅ Примеры данных
- ✅ Команды для проверки
- ✅ Инструкции по расширению

## Запуск

```bash
# Заполнить БД mock данными
npm run db:seed

# Проверить в браузере
# Проект 1 (E-Bike):
http://localhost:3001/projects/6d62c309-9faa-49a9-85b1-413b86f522b2/dataset

# Dashboard:
http://localhost:3001/dashboard
```

## Проверка

### В терминале

```bash
# Список проектов
node -e "const { PrismaClient } = require('@prisma/client'); \
  const prisma = new PrismaClient(); \
  prisma.project.findMany().then(projects => { \
    console.log('Projects:', projects.length); \
    projects.forEach(p => console.log(\`  - \${p.name}\`)); \
    prisma.\$disconnect(); \
  });"

# Вывод:
Projects: 2
  - Electric Bicycle Carbon Assessment
  - Steel Components CBAM Report
```

### В Prisma Studio

```bash
npm run db:studio
# Открывается http://localhost:5555
```

## Структура mock данных

```
User: John Doe (john@example.com)
│
├── Contacts (2)
│   ├── Ivan Petrov (Production Manager)
│   └── Maria Garcia (Logistics Coordinator)
│
├── Project 1: E-Bike
│   ├── Dataset: 162 fields
│   │   ├── Filled: 12 (Organization, Product, Materials, Impact)
│   │   └── Empty: 150
│   ├── Report: ISO14067 (7% complete)
│   ├── Checklist: 3 items (1 completed)
│   └── Data Request → Ivan Petrov
│
└── Project 2: Steel
    ├── Dataset: 162 fields
    │   ├── Filled: 9 (Organization, Product, Scope, Impact)
    │   └── Empty: 153
    ├── Report: CBAM (6% complete)
    └── Checklist: 2 items (1 completed)
```

## Файлы изменены

```
prisma/
└── seed.ts                      ✅ Полностью переписан

docs/
└── DATABASE_MOCK_DATA.md        ✅ Создан

src/lib/
├── dataset-init.ts              ✅ Используется в seed
└── dataset-schema.json          ✅ Источник для инициализации
```

## Следующие шаги

### Добавить больше mock данных

Отредактируйте `createMockDataset()` в `prisma/seed.ts`:

```typescript
// Добавьте больше заполненных полей
updates['ProductDescription_ProductIdentifier'] = 'EB-2025-001';
updates['GoalAndScope_ReferenceYear'] = '2025';
updates['DataQuality_DataQualityDescription'] = 'Primary data from supplier';
// ... и т.д.
```

### Добавить третий проект

```typescript
const project3 = await prisma.project.create({
  data: {
    userId: user.id,
    name: 'Solar Panel LCA',
    status: 'ACTIVE',
    dataset: createMockDataset('solar'), // Создайте новый тип
    // ...
  },
});
```

### Тестирование UI

1. Откройте dataset page
2. Проверьте:
   - ✅ Видны все 162 поля
   - ✅ Заполненные показывают mock значения
   - ✅ Пустые показывают "Click to edit"
   - ✅ Repeatable fields имеют минимум 1 item
   - ✅ Search работает
   - ✅ Group filter работает

---

**Status**: ✅ COMPLETED
**Date**: 2025-10-13
**Impact**: Database + Seed + Docs
