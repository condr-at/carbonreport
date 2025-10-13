# Database Mock Data

## Обзор

Database seed script создаёт реалистичные mock данные для тестирования системы.

## Запуск

```bash
# Очистить БД и заполнить mock данными
npm run db:seed

# Альтернативно (через Prisma CLI)
npx prisma db seed
```

## Созданные данные

### 👤 User (1)

```typescript
{
  name: "John Doe",
  email: "john@example.com",
  emailVerified: true
}
```

### 📇 Contacts (2)

```typescript
[
  {
    name: "Ivan Petrov",
    position: "Production Manager",
    email: "ivan@supplier.com"
  },
  {
    name: "Maria Garcia",
    position: "Logistics Coordinator",
    email: "maria@logistics.com"
  }
]
```

### 📁 Projects (2)

#### Project 1: Electric Bicycle Carbon Assessment

**Тип**: ISO 14067
**Статус**: ACTIVE
**Dataset**: 162 поля (12 заполнено = 7%)

**Заполненные поля**:
```
ReportMetadata_OrganizationName: "GreenCycle Manufacturing"
ReportMetadata_ReportDate: "2025-10-13"
ReportMetadata_ReportLanguage: "English"
ProductDescription_ProductName: "E-Bike Model X Pro"
ProductDescription_ProductDescription: "Electric bicycle with 750W motor and lithium battery"
ProductDescription_IntendedUse: "Urban commuting and recreational cycling"
ProductDescription_Market: "European Union, North America"
GoalAndScope_StudyGoal: "Calculate carbon footprint according to ISO 14067"
GoalAndScope_FunctionalUnit: "1 electric bicycle"
GoalAndScope_SystemBoundary: "Cradle-to-gate including raw materials, manufacturing, and packaging"
LifeCycleInventoryInputs_MaterialInputName: "Aluminum Frame" (item 1)
LifeCycleInventoryInputs_MaterialInputAmount: "8.5" (item 1)
LifeCycleInventoryInputs_MaterialInputUnit: "kg" (item 1)
LifeCycleInventoryInputs_MaterialInputSource: "Alcoa Aluminum Supplier" (item 1)
ImpactAssessmentResults_TotalCFPCO2e: "145.5"
ImpactAssessmentResults_CFPUnit: "kg CO2e"
```

**Checklist**:
- ✅ Gather product specifications (completed)
- ⏳ Collect material data
- ⏳ Calculate carbon footprint

**Report**: ISO14067 (7% complete)

---

#### Project 2: Steel Components CBAM Report

**Тип**: CBAM
**Статус**: ACTIVE
**Dataset**: 162 поля (9 заполнено = 6%)

**Заполненные поля**:
```
ReportMetadata_OrganizationName: "Steel Manufacturing Ltd"
ReportMetadata_ReportDate: "2025-10-13"
ReportMetadata_ReportLanguage: "English"
ProductDescription_ProductName: "Steel Beam 200x100"
ProductDescription_ProductDescription: "Structural steel beam for construction"
ProductDescription_IntendedUse: "Building construction and infrastructure"
ProductDescription_Market: "European Union"
GoalAndScope_StudyGoal: "CBAM compliance reporting"
GoalAndScope_FunctionalUnit: "1 ton of steel beams"
GoalAndScope_SystemBoundary: "Cradle-to-gate: mining, processing, manufacturing"
ImpactAssessmentResults_TotalCFPCO2e: "1850"
ImpactAssessmentResults_CFPUnit: "kg CO2e"
```

**Checklist**:
- ✅ Fill company information (completed)
- ⏳ Calculate total emissions

**Report**: CBAM (6% complete)

---

### 📧 Data Requests (1)

```typescript
{
  project: "Electric Bicycle Carbon Assessment",
  contact: "Ivan Petrov",
  dataPointId: "LifeCycleInventoryInputs_EnergyInputType",
  externalAccess: false
}
```

## Структура данных

### Full Dataset (162 fields)

Каждый проект инициализируется с **полным датасетом** из 162 полей:
- **120 singleton fields** (item_id = null)
- **42 repeatable fields** (минимум 1 item с item_id = "1")

**Источник**: `src/lib/dataset-schema.json`

### Mock data strategy

```typescript
function createMockDataset(projectType: 'ebike' | 'steel') {
  // 1. Инициализируем полный датасет (162 поля)
  const fullDataset = initializeFullDataset();
  
  // 2. Заполняем некоторые поля mock значениями
  const updates = {
    'ReportMetadata_OrganizationName': '...',
    'ProductDescription_ProductName': '...',
    // ... и т.д.
  };
  
  // 3. Применяем updates к датасету
  return updatedDataset;
}
```

**Результат**: Проект имеет все 162 поля, но только некоторые заполнены (для реалистичности).

## Mailto Templates

Default templates для 4 типов полей:

```typescript
{
  'ProductDescription_ProductName': 'Hi {contact_name}, ...',
  'LifeCycleInventoryInputs_MaterialInputName': 'Dear {contact_name}, ...',
  'LifeCycleInventoryInputs_EnergyInputType': 'Hi {contact_name}, ...',
  'Transportation_TransportMode': 'Hello {contact_name}, ...'
}
```

**Плейсхолдеры**:
- `{contact_name}` - имя контакта
- `{project_name}` - название проекта
- `{field_label}` - название поля
- `{user_name}` - имя пользователя
- `{deadline}` - дедлайн

## Проверка данных

### Список проектов

```bash
node -e "const { PrismaClient } = require('@prisma/client'); \
  const prisma = new PrismaClient(); \
  prisma.project.findMany({ include: { reports: true } }).then(projects => { \
    console.log('Projects:', projects.map(p => ({ \
      name: p.name, \
      filled: p.dataset.data_points.filter(dp => dp.value).length, \
      total: p.dataset.data_points.length \
    }))); \
    prisma.\$disconnect(); \
  });"
```

### Детальный просмотр

```bash
# Открыть Prisma Studio
npm run db:studio
```

## Использование в dev

### 1. Страница датасета

```
http://localhost:3001/projects/{project_id}/dataset
```

**Что увидите**:
- Все 162 поля в таблице
- Заполненные поля (12 или 9) показывают значения
- Пустые поля (150+) показывают "Click to edit"
- Repeatable fields имеют минимум один item

### 2. Dashboard

```
http://localhost:3001/dashboard
```

**Что увидите**:
- 2 проекта (E-Bike и Steel)
- Прогресс: 7% и 6%
- Статус: ACTIVE

### 3. Contacts

```
http://localhost:3001/contacts
```

**Что увидите**:
- Ivan Petrov (Production Manager)
- Maria Garcia (Logistics Coordinator)

## Расширение mock данных

### Добавить больше заполненных полей

Отредактируйте `prisma/seed.ts`:

```typescript
if (projectType === 'ebike') {
  updates['ProductDescription_ProductName'] = 'E-Bike Model X Pro';
  updates['ProductDescription_ProductIdentifier'] = 'EB-2025-001'; // ← NEW
  updates['ProductDescription_PackagingIncluded'] = 'Cardboard box with foam'; // ← NEW
  // ... добавьте больше полей
}
```

Затем:
```bash
npm run db:seed
```

### Добавить третий проект

Добавьте в `main()` функцию:

```typescript
const project3 = await prisma.project.create({
  data: {
    userId: user.id,
    name: 'Solar Panel Life Cycle Assessment',
    status: 'ACTIVE',
    datasetVersion: 0,
    mailtoTemplates: defaultMailtoTemplates,
    dataset: createMockDataset('solar'), // ← Создайте новый тип
    checklist: { items: [] },
  },
});
```

## Troubleshooting

### "Seed script не работает"

```bash
# Проверьте подключение к БД
npx prisma db push

# Проверьте .env файл
cat .env | grep DATABASE_URL

# Запустите с debug
npx tsx --inspect prisma/seed.ts
```

### "Дублирующиеся данные"

Seed script **очищает БД** перед заполнением:

```typescript
await prisma.dataRequest.deleteMany()
await prisma.report.deleteMany()
await prisma.project.deleteMany()
await prisma.contact.deleteMany()
await prisma.user.deleteMany()
```

**Осторожно**: Не запускайте в production! 🚨

---

**См. также**:
- [prisma/seed.ts](../prisma/seed.ts) - Исходный код
- [DATASET_QUICK_REFERENCE.md](./DATASET_QUICK_REFERENCE.md) - Работа с датасетом
- [FULL_DATASET_SCHEMA.md](./FULL_DATASET_SCHEMA.md) - Структура 162 полей
