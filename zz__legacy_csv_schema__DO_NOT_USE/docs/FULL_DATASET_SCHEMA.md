# Full Dataset Schema Implementation

## Обзор

Реализована система полного датасета на основе референсного CSV файла с 162 полями.

## Ключевая концепция

**Датасет проекта ≠ Шаблон отчета**

- **Датасет проекта** - это ПОЛНЫЙ набор всех возможных полей (162 из `REFERENCE_iso_report_data.csv`)
- **Шаблоны отчетов** (ISO14067, CBAM) - это фильтры/представления, показывающие подмножество полей

### Почему так?

1. **Один источник правды** - все данные в одном месте
2. **Гибкость** - можно добавлять/удалять отчеты без потери данных
3. **Переиспользование** - поля используются несколькими отчетами
4. **Расширяемость** - легко добавить новые поля

### Важно: Repeatable Fields

**Repeatable fields** (поля с `item_id`) **всегда** содержат **минимум один item**, даже если он пустой:

```typescript
// ✅ Правильно: repeatable field всегда имеет хотя бы один item
[
  { field_id: "LCI_Inputs_RawMaterialName", item_id: "1", value: "" },
  { field_id: "LCI_Inputs_RawMaterialAmount", item_id: "1", value: "" },
]

// ❌ Неправильно: repeatable field без items не имеет смысла
// (нельзя удалить последний item!)
```

**Причины:**
- Пользователь должен сразу видеть структуру данных
- Можно начать заполнение сразу, не добавляя items
- Консистентность: датасет всегда полный

## Структура данных

### Master Schema (dataset-schema.json)

Сгенерирован из `REFERENCE_iso_report_data.csv`:

```json
{
  "meta": {
    "totalFields": 162,
    "totalSections": 19,
    "generatedAt": "2025-10-13T...",
    "source": "REFERENCE_iso_report_data.csv"
  },
  "fieldIds": [
    "ReportMetadata_OrganizationName",
    "ReportMetadata_ReportID",
    ...
  ],
  "sections": [
    {
      "name": "Report Metadata",
      "fieldCount": 14,
      "fields": [...]
    },
    ...
  ],
  "initialDataset": {
    "data_points": [
      {
        "field_id": "ReportMetadata_OrganizationName",
        "item_id": null,
        "value": ""
      },
      ...
    ]
  }
}
```

### Breakdown

```
Total: 162 fields
├── Singleton fields: 120 (item_id = null)
└── Repeatable fields: 42 (item_id = "1", "2", ...)

Sections: 19
├── Report Metadata (14 fields)
├── Product Description (10 fields)
├── Goal and Scope (25 fields)
├── Data Quality (10 fields)
├── Life Cycle Inventory - Inputs (11 repeatable fields)
├── Life Cycle Inventory - Outputs (17 fields)
├── Transportation (6 repeatable fields)
├── Use Phase (7 repeatable fields)
├── End-of-Life (9 repeatable fields)
├── Impact Assessment & Results (14 fields)
└── ... (10 more sections)
```

## Реализация

### 1. Парсер схемы (`dataset-schema-parser.ts`)

```typescript
// Парсит CSV и извлекает структуру
const schema = parseDatasetSchemaFromCSV('REFERENCE_iso_report_data.csv');

// Генерирует Field IDs в формате PascalCase
const fieldIds = generateFieldIds(schema);
// ["ReportMetadata_OrganizationName", "ProductDescription_ProductName", ...]

// Создает начальные data_points
const dataPoints = generateInitialDataPoints(schema);
```

### 2. Генератор схемы (`generate-dataset-schema.ts`)

Скрипт который:
1. Парсит CSV
2. Создает `dataset-schema.json` с полной структурой
3. Сохраняет в `/src/lib/dataset-schema.json`

**Запуск:**
```bash
npx tsx scripts/generate-dataset-schema.ts
```

### 3. Инициализация датасета (`dataset-init.ts`)

```typescript
// Инициализирует ПОЛНЫЙ датасет (162 поля)
export function initializeFullDataset(
  existingDataPoints: any[] = []
): DataPoint[]

// Использование:
const completeDataset = initializeFullDataset(project.dataset?.data_points || []);
// Результат: 162 data_points, заполненные сохраняются, новые добавляются с value=""
```

### 4. Страница датасета (`page.tsx`)

```typescript
// 1. Загружаем проект
const project = await getProject(id);

// 2. Инициализируем ПОЛНЫЙ датасет (независимо от выбранных отчетов!)
const completeDataPoints = initializeFullDataset(
  project.dataset?.data_points || []
);

// 3. Обогащаем метаданными из шаблонов (для labels, hints)
const enrichedDataPoints = enrichDataPoints(completeDataPoints, templates);

// 4. Показываем в таблице
const tableRows = flattenToTableRows(groupedData);
```

## Примеры

### Новый проект

```typescript
// При создании проекта:
const newProject = {
  name: "My Product Assessment",
  dataset: {
    data_points: initializeFullDataset() // 162 пустых поля
  }
};

// Пользователь видит ВСЕ 162 поля сразу
// Прогресс: 0/162 = 0%
```

### Существующий проект

```typescript
// Проект с 20 заполненными полями:
const existingDataPoints = [
  { field_id: "ProductDescription_ProductName", value: "E-Bike" },
  // ... 19 more
];

const completeDataset = initializeFullDataset(existingDataPoints);
// Результат: 162 поля
// - 20 с заполненными значениями
// - 142 пустых
// Прогресс: 20/162 = 12%
```

### Фильтрация для отчета

```typescript
// ISO14067 отчет нужно показать только определенные поля
// Это делается НА УРОВНЕ UI/ФИЛЬТРАЦИИ, не на уровне датасета

// Вариант 1: Фильтрация на фронтенде
const iso14067Fields = [
  "ProductDescription_ProductName",
  "GoalAndScope_StudyGoal",
  "ImpactAssessmentResults_TotalCFPCO2e",
  // ... остальные поля для ISO14067
];

const filteredDataPoints = completeDataset.filter(dp =>
  iso14067Fields.includes(dp.field_id)
);

// Вариант 2: Отдельная страница отчета с фильтром
// /projects/:id/reports/iso14067 - показывает только нужные поля
```

## Преимущества подхода

### ✅ Единый источник данных
- Все поля в одном месте
- Нет дублирования данных
- Легко искать и редактировать

### ✅ Независимость от отчетов
- Можно добавить/удалить отчет без потери данных
- Поля переиспользуются между отчетами
- Данные сохраняются при переключении отчетов

### ✅ Полная видимость
- Пользователь видит ВСЕ возможные поля
- Понятно, что можно заполнить
- Прогресс считается от полного набора

### ✅ Расширяемость
- Легко добавить новые поля в CSV
- Перегенерировать schema.json
- Старые проекты автоматически получат новые поля

## Workflow

### Добавление новых полей

1. **Обновить CSV**
   ```csv
   Section,Field,ItemID,Value
   New Section,NewField,,sample_value
   ```

2. **Регенерировать схему**
   ```bash
   npx tsx scripts/generate-dataset-schema.ts
   ```

3. **Обновить FieldId enum** (если нужна типизация)
   ```typescript
   // src/lib/field-ids.ts
   export enum FieldId {
     // ... existing
     NewSection_NewField = 'NewSection_NewField',
   }
   ```

4. **Готово!**
   - Все новые проекты получат новое поле
   - Существующие проекты получат при следующей загрузке

### Обновление существующих проектов

```typescript
// Автоматически при открытии датасета
const completeDataset = initializeFullDataset(project.dataset.data_points);

// До: 7 полей из seed
// После: 162 поля (7 заполненных + 155 пустых)
```

## Тестирование

### Проверить парсер
```bash
npx tsx scripts/test-dataset-parser.ts
```

### Проверить генерацию схемы
```bash
npx tsx scripts/generate-dataset-schema.ts
```

### Проверить в UI
1. Открыть проект: `/projects/{id}/dataset`
2. Увидеть все 162 поля в таблице
3. Заполненные показывают значения
4. Пустые показывают "Click to edit"

## Файлы

```
src/lib/
├── dataset-schema-parser.ts     # Парсер CSV
├── dataset-schema.json          # Сгенерированная схема (162 поля)
├── dataset-init.ts              # Инициализация датасета
└── dataset-utils.ts             # Утилиты для работы с данными

scripts/
├── test-dataset-parser.ts       # Тест парсера
└── generate-dataset-schema.ts   # Генератор схемы

docs/
├── REFERENCE_iso_report_data.csv       # Источник данных (162 поля)
└── FULL_DATASET_SCHEMA.md              # Эта документация
```

## Следующие шаги

### MVP (сейчас)
- ✅ Полный датасет из CSV (162 поля)
- ✅ Автоматическая инициализация
- ✅ Отображение в таблице
- ✅ Редактирование

### Post-MVP
- [ ] Фильтрация полей по отчетам
- [ ] Добавление полей из других стандартов (CBAM, PEF, etc.)
- [ ] Валидация по типам полей
- [ ] Импорт данных из файлов
- [ ] Экспорт в разные форматы

## См. также

- [DATASET_INITIALIZATION.md](./DATASET_INITIALIZATION.md) - Концепция инициализации
- [DATASET_TABLE_REQUIREMENTS.md](./DATASET_TABLE_REQUIREMENTS.md) - UI требования
- [Requirements v0.0.1.md](./Requirements%20v0.0.1.md) - Общие требования
