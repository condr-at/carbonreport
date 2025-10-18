# Dataset Initialization Strategy

## Концепция

Датасет проекта должен содержать **все поля из всех шаблонов отчетов**, даже если значения пустые.

### Зачем это нужно?

1. **Полная видимость структуры** - пользователь видит все поля, которые нужно заполнить
2. **Точный трекинг прогресса** - можно корректно считать % заполненности
3. **Направление пользователя** - сразу видно, какие данные отсутствуют
4. **Единообразие интерфейса** - таблица dataset всегда показывает полную структуру

## Принципы

### До (неправильно) ❌
```json
{
  "data_points": [
    { "field_id": "Product_Name", "item_id": null, "value": "E-Bike" }
  ]
}
```
Проблема: Пользователь не видит, какие ещё поля нужно заполнить

### После (правильно) ✅
```json
{
  "data_points": [
    { "field_id": "Product_Name", "item_id": null, "value": "E-Bike" },
    { "field_id": "Product_Description", "item_id": null, "value": "" },
    { "field_id": "Product_Weight", "item_id": null, "value": "" },
    { "field_id": "Product_Category", "item_id": null, "value": "" },
    { "field_id": "Material_Name", "item_id": "1", "value": "" },
    { "field_id": "Material_Amount", "item_id": "1", "value": "" },
    { "field_id": "Energy_Consumption_Total", "item_id": null, "value": "" }
  ]
}
```
Преимущество: Видна вся структура, пустые поля показывают, что нужно заполнить

## Типы полей

### Singleton Fields (item_id = null)
Одиночные значения, присутствующие в единственном экземпляре:
- `Product_Name` - Название продукта
- `Product_Description` - Описание
- `Company_Name` - Название компании
- `Energy_Consumption_Total` - Общее потребление энергии
- Все поля с суффиксами `_Total`, `_Summary` и т.п.

**Инициализация**: Создаётся 1 data_point с `item_id = null` и `value = ""`

### Repeatable Fields (item_id = "1", "2", "3", ...)
Табличные данные, могут повторяться:
- `Material_Name`, `Material_Amount`, `Material_Unit` - материалы
- `Transport_Mode`, `Transport_Distance` - транспортные плечи
- `Packaging_Type`, `Packaging_Weight` - упаковка

**Инициализация**: 
- Если нет существующих данных: создаётся item_id = "1" как плейсхолдер
- Если есть данные: сохраняются все существующие items

**Логика определения**: Поля с префиксами `Material_`, `Transport_`, `Packaging_` считаются repeatable

## Реализация

### Функция инициализации

```typescript
// src/lib/dataset-init.ts

export function initializeDatasetFromTemplates(
  templates: ReportTemplate[],
  existingDataPoints: any[] = []
): DataPoint[]
```

**Процесс:**

1. **Сбор всех полей из шаблонов**
   ```typescript
   for (const template of templates) {
     for (const section of template.sections) {
       for (const field of section.fields) {
         // Добавить в список уникальных полей
       }
     }
   }
   ```

2. **Определение типа поля (singleton/repeatable)**
   ```typescript
   const isSingleton = !isRepeatableField(field.id);
   ```

3. **Создание data_points**
   - Для singleton: 1 точка с item_id = null
   - Для repeatable: все существующие + минимум 1 пустая

4. **Слияние с существующими данными**
   - Сохраняем заполненные значения
   - Добавляем пустые поля для новых полей из шаблонов

### Использование в странице

```typescript
// src/app/projects/[id]/dataset/page.tsx

const templates = project.reports
  .map(r => getReportTemplate(r.templateCode))
  .filter(Boolean);

const existingDataPoints = project.dataset?.data_points || [];

// Инициализация полной структуры
const completeDataPoints = initializeDatasetFromTemplates(
  templates,
  existingDataPoints
);
```

## Сценарии использования

### 1. Новый проект
```typescript
// Проект создан, выбран ISO14067
// dataset = { data_points: [] }

const templates = [ISO14067Template];
const dataPoints = initializeDatasetFromTemplates(templates, []);

// Результат: все поля ISO14067 со значениями ""
// Пользователь видит полную структуру сразу
```

### 2. Добавление нового отчета
```typescript
// Был ISO14067, добавили CBAM
// dataset уже содержит данные ISO14067

const templates = [ISO14067Template, CBAMTemplate];
const existingDataPoints = project.dataset.data_points;
const dataPoints = initializeDatasetFromTemplates(templates, existingDataPoints);

// Результат: 
// - Все старые данные ISO14067 сохранены
// - Добавлены новые пустые поля из CBAM
// - Общие поля (Product_Name) используются обоими отчетами
```

### 3. Частично заполненный проект
```typescript
// Проект с ISO14067, заполнено 30%

const dataPoints = [
  { field_id: "Product_Name", value: "E-Bike", item_id: null },
  { field_id: "Material_Name", value: "Aluminum", item_id: "1" },
  // ... остальные поля пустые
];

const complete = initializeDatasetFromTemplates([ISO14067Template], dataPoints);

// Результат:
// - Заполненные поля сохранены
// - Пустые поля добавлены для всех остальных полей шаблона
// - Progress bar: 30% заполнено
```

## Расчет прогресса

```typescript
export function calculateDatasetCompletion(dataPoints: any[]): number {
  if (dataPoints.length === 0) return 0;
  
  const filledCount = dataPoints.filter(
    dp => dp.value && dp.value.trim() !== ''
  ).length;
  
  return Math.round((filledCount / dataPoints.length) * 100);
}
```

**Пример:**
- Всего полей: 50
- Заполнено: 15
- Прогресс: 30%

## Преимущества подхода

### ✅ Для пользователя
1. **Полная видимость** - сразу видно все поля
2. **Понятный прогресс** - % показывает реальное заполнение
3. **Не пропустишь поле** - все поля на виду
4. **Единый интерфейс** - одна таблица со всеми данными

### ✅ Для разработчика
1. **Простая логика** - не нужно динамически добавлять поля
2. **Предсказуемая структура** - всегда полный набор полей
3. **Легко считать прогресс** - просто (filled / total)
4. **Удобная отладка** - видно всю структуру

### ✅ Для системы
1. **Целостность данных** - нет "потерянных" полей
2. **Простая валидация** - проверяем наличие всех обязательных полей
3. **Легко мигрировать** - добавление новых полей = пересоздание структуры
4. **Оптимизация запросов** - одна структура для всех проектов

## Migration Strategy

Если в проекте уже есть частично заполненный dataset:

```typescript
// В API endpoint или миграции
const project = await prisma.project.findUnique({ where: { id } });
const templates = getProjectTemplates(project.reports);

// Обновить dataset до полной структуры
const completeDataset = initializeDatasetFromTemplates(
  templates,
  project.dataset.data_points
);

await prisma.project.update({
  where: { id },
  data: { 
    dataset: { data_points: completeDataset }
  }
});
```

## Примеры

### ISO14067 Project (новый)
```json
{
  "data_points": [
    // === Product Info (singleton) ===
    { "field_id": "Product_Name", "item_id": null, "value": "" },
    { "field_id": "Product_Description", "item_id": null, "value": "" },
    { "field_id": "Product_Weight", "item_id": null, "value": "" },
    
    // === Materials (repeatable) ===
    { "field_id": "Material_Name", "item_id": "1", "value": "" },
    { "field_id": "Material_Amount", "item_id": "1", "value": "" },
    { "field_id": "Material_Unit", "item_id": "1", "value": "" },
    
    // === Energy (singleton) ===
    { "field_id": "Energy_Consumption_Total", "item_id": null, "value": "" },
    { "field_id": "Energy_Consumption_Renewable", "item_id": null, "value": "" },
    
    // === Transport (repeatable) ===
    { "field_id": "Transport_Mode", "item_id": "1", "value": "" },
    { "field_id": "Transport_Distance", "item_id": "1", "value": "" },
    
    // === Emissions (singleton) ===
    { "field_id": "Emission_Total_ISO14067", "item_id": null, "value": "" },
    { "field_id": "Emission_Scope1", "item_id": null, "value": "" },
    { "field_id": "Emission_Scope2", "item_id": null, "value": "" },
    { "field_id": "Emission_Scope3", "item_id": null, "value": "" }
  ]
}
```

### После заполнения (30%)
```json
{
  "data_points": [
    // Заполнено ✅
    { "field_id": "Product_Name", "item_id": null, "value": "E-Bike Model X" },
    { "field_id": "Product_Weight", "item_id": null, "value": "25" },
    { "field_id": "Material_Name", "item_id": "1", "value": "Aluminum" },
    { "field_id": "Material_Amount", "item_id": "1", "value": "8.5" },
    
    // Пусто, ждет заполнения ⏳
    { "field_id": "Product_Description", "item_id": null, "value": "" },
    { "field_id": "Material_Unit", "item_id": "1", "value": "" },
    { "field_id": "Energy_Consumption_Total", "item_id": null, "value": "" },
    // ...
  ]
}
```

## См. также

- [Requirements v0.0.1.md](./Requirements%20v0.0.1.md) - Основные требования к датасету
- [DATASET_TABLE_REQUIREMENTS.md](./DATASET_TABLE_REQUIREMENTS.md) - UI/UX таблицы
- [dataset-init.ts](../src/lib/dataset-init.ts) - Реализация
- [FieldId enum](../src/lib/field-ids.ts) - Определения полей
