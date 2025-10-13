# Dataset System Quick Reference

## Концепция

**Датасет проекта** = 162 поля из `REFERENCE_iso_report_data.csv`
**Шаблоны отчетов** = Фильтры, показывающие подмножество полей

### Важное правило: Repeatable Fields

**Repeatable fields всегда имеют минимум один item (даже пустой):**

```typescript
// ✅ Правильно
const dataPoints = [
  { field_id: "LCI_Inputs_RawMaterialName", item_id: "1", value: "" }, // Минимум один
];

// ❌ Нельзя удалить последний item!
```

**UI Behavior:**
- Кнопка "Delete" скрыта для последнего repeatable item
- Кнопка "Delete" никогда не показывается для singleton полей (item_id = null)

## Основные файлы

```
src/lib/
├── dataset-schema.json          # Master schema (162 fields)
├── dataset-schema-parser.ts     # CSV parser
├── dataset-init.ts              # Initialization logic
└── dataset-utils.ts             # Transform utilities

src/components/
├── dataset-table.tsx            # TanStack Table component
└── request-data-modal.tsx       # Email request modal

src/app/projects/[id]/dataset/
├── page.tsx                     # Server component
└── dataset-page-client.tsx      # Client component

scripts/
├── test-dataset-parser.ts       # Test parser
└── generate-dataset-schema.ts   # Generate schema
```

## Команды

### Регенерация схемы

```bash
# После изменения REFERENCE_iso_report_data.csv
npx tsx scripts/generate-dataset-schema.ts
```

### Тестирование

```bash
# Тест парсера
npx tsx scripts/test-dataset-parser.ts

# Dev server
npm run dev
```

## API

### Обновить поле

```typescript
PATCH /api/projects/:id/dataset
{
  "field_id": "ProductDescription_ProductName",
  "item_id": null,
  "value": "E-Bike Model X"
}
```

### Добавить repeatable item

```typescript
POST /api/projects/:id/dataset/items
{
  "field_id": "LCI_Inputs_RawMaterialName"
}
// Returns: { item_id: "123e4567-..." }
```

### Удалить repeatable item

```typescript
DELETE /api/projects/:id/dataset/items/:itemId
```

## Code Examples

### Инициализация датасета

```typescript
import { initializeFullDataset } from '@/lib/dataset-init';

// Загрузить существующий датасет и дополнить до 162 полей
const completeDataset = initializeFullDataset(
  project.dataset?.data_points || []
);
```

### Обогащение метаданными

```typescript
import { enrichDataPoints } from '@/lib/dataset-utils';

const enriched = enrichDataPoints(completeDataset, templates);
// Добавляет label, hint, section из шаблонов
```

### Группировка

```typescript
import { groupDataPoints } from '@/lib/dataset-utils';

const grouped = groupDataPoints(enriched);
// Группирует по префиксу field_id
```

### Преобразование в строки таблицы

```typescript
import { flattenToTableRows } from '@/lib/dataset-utils';

const tableRows = flattenToTableRows(grouped);
// Готово для TanStack Table
```

## Структура данных

### DataPoint

```typescript
interface DataPoint {
  field_id: string;        // "ProductDescription_ProductName"
  item_id: string | null;  // null для singleton, "uuid" для repeatable
  value: string;           // Значение поля
  
  // Метаданные (добавляются через enrichDataPoints):
  label?: string;          // "Product Name"
  hint?: string;           // "Official product name"
  section?: string;        // "Product Description"
  group?: string;          // "Product Description"
}
```

### TableRow

```typescript
interface TableRow {
  id: string;              // "ProductDescription_ProductName"
  field_id: string;
  item_id: string | null;
  label: string;
  value: string;
  hint: string;
  section: string;
  group: string;
}
```

## Визуальная группировка

```typescript
// src/lib/dataset-utils.ts
export const GROUP_CONFIGS: Record<string, GroupConfig> = {
  'ReportMetadata': {
    color: 'blue',
    icon: '📄',
    label: 'Report Metadata'
  },
  'ProductDescription': {
    color: 'green',
    icon: '📦',
    label: 'Product Description'
  },
  // ... остальные группы
};
```

## Workflow: Добавление нового поля

### 1. Обновить CSV

```csv
# docs/REFERENCE_iso_report_data.csv
Section,Field,ItemID,Value
New Section,NewField,,sample_value
```

### 2. Регенерировать схему

```bash
npx tsx scripts/generate-dataset-schema.ts
# ✅ Generated dataset schema with 163 fields
```

### 3. (Опционально) Обновить FieldId enum

```typescript
// src/lib/field-ids.ts
export enum FieldId {
  // ... existing
  NewSection_NewField = 'NewSection_NewField',
}
```

### 4. Перезапустить приложение

```bash
npm run dev
```

**Готово!** Все проекты получат новое поле при следующей загрузке.

## Troubleshooting

### TypeScript ошибка "Cannot find module"

```bash
# Перезапустить TypeScript server
CMD/CTRL + Shift + P → "Restart TypeScript Server"
```

### Поле не отображается в таблице

1. Проверить `dataset-schema.json` - есть ли поле?
2. Проверить `initializeFullDataset()` - загружается ли схема?
3. Проверить `enrichDataPoints()` - добавляется ли label?

### Не работает inline editing

1. Проверить API endpoint - отвечает ли 200?
2. Проверить `onFieldUpdate` в `dataset-page-client.tsx`
3. Проверить валидацию в `/api/projects/[id]/dataset/route.ts`

## Best Practices

### ✅ Do

- Используйте `initializeFullDataset()` при загрузке проекта
- Обогащайте метаданными через `enrichDataPoints()`
- Добавляйте новые поля через CSV + регенерацию схемы
- Используйте TypeScript enum для field_id (если нужна типизация)

### ❌ Don't

- Не создавайте датасет вручную - используйте schema.json
- Не храните label/hint в БД - добавляйте через enrichment
- Не фильтруйте поля на уровне инициализации - делайте на UI
- Не парсите CSV в runtime - используйте pre-generated schema

## Resources

- [Full Documentation](./FULL_DATASET_SCHEMA.md)
- [Completion Report](./ITERATION_6_COMPLETION.md)
- [User Guide](./DATASET_TABLE_USER_GUIDE.md)
- [Requirements](./DATASET_TABLE_REQUIREMENTS.md)

---

**Last Updated**: 2025-10-13
**Version**: 1.0.0
