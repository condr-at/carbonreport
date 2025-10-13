# Dataset Structure Visual Guide

## 📊 Полная структура датасета

```
┌─────────────────────────────────────────────────────────────────┐
│                       DATASET (162 fields)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ SINGLETON FIELDS (120)                                   │  │
│  │ item_id = null                                           │  │
│  │ ❌ Нельзя удалить                                        │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • Report Metadata (14 fields)                           │  │
│  │   - OrganizationName                                     │  │
│  │   - ReportID                                             │  │
│  │   - ReportDate                                           │  │
│  │   - ...                                                  │  │
│  │                                                          │  │
│  │ • Product Description (10 fields)                        │  │
│  │   - ProductName                                          │  │
│  │   - ProductIdentifier                                    │  │
│  │   - ...                                                  │  │
│  │                                                          │  │
│  │ • Goal and Scope (25 fields)                             │  │
│  │ • Data Quality (10 fields)                               │  │
│  │ • ... (и другие секции)                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ REPEATABLE FIELDS (42)                                   │  │
│  │ item_id = "1", "2", "3", ...                             │  │
│  │ ⚠️  Минимум ОДИН item всегда                             │  │
│  │ ✅ Можно добавлять/удалять items (кроме последнего)      │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • Life Cycle Inventory - Inputs (11 fields)              │  │
│  │   ┌────────────────────────────────┐                     │  │
│  │   │ Item 1 (item_id="1") ← минимум │                     │  │
│  │   │ - MaterialInputName            │                     │  │
│  │   │ - MaterialInputAmount          │                     │  │
│  │   │ - MaterialInputUnit            │                     │  │
│  │   └────────────────────────────────┘                     │  │
│  │   ┌────────────────────────────────┐                     │  │
│  │   │ Item 2 (item_id="uuid-2")      │                     │  │
│  │   │ - MaterialInputName            │                     │  │
│  │   │ - MaterialInputAmount          │                     │  │
│  │   │ - MaterialInputUnit            │                     │  │
│  │   │                     [Delete ✅] │ ← Можно удалить     │  │
│  │   └────────────────────────────────┘                     │  │
│  │                                                          │  │
│  │ • Transportation (6 fields)                               │  │
│  │ • Use Phase (7 fields)                                    │  │
│  │ • End-of-Life (9 fields)                                  │  │
│  │ • Packaging Information (5 fields)                        │  │
│  │ • ... (и другие repeatable группы)                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Правила для UI

### Singleton Fields (120)

```
┌─────────────────────────────────────────────────────┐
│ Field: Product Name                                 │
│ Item:  -                                            │
│ Value: [E-Bike Model X_______________]              │
│ Actions: [📧 Request Data]  ❌ NO Delete button     │
└─────────────────────────────────────────────────────┘
           ↑
           Singleton: item_id = null
           Кнопка Delete НИКОГДА не показывается
```

### Repeatable Fields - Один item (минимум)

```
┌─────────────────────────────────────────────────────┐
│ Field: Raw Material Name                            │
│ Item:  1                                            │
│ Value: [Steel_________________________]             │
│ Actions: [📧 Request Data]  ❌ NO Delete button     │
└─────────────────────────────────────────────────────┘
           ↑
           Repeatable: item_id = "1"
           Последний item: кнопка Delete СКРЫТА
```

### Repeatable Fields - Несколько items

```
┌─────────────────────────────────────────────────────┐
│ Field: Raw Material Name                            │
│ Item:  1                                            │
│ Value: [Steel_________________________]             │
│ Actions: [📧 Request Data] [🗑️ Delete]  ✅ Can delete│
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│ Field: Raw Material Name                            │
│ Item:  2                                            │
│ Value: [Plastic_______________________]             │
│ Actions: [📧 Request Data] [🗑️ Delete]  ✅ Can delete│
└─────────────────────────────────────────────────────┘
           ↑
           НЕ последний item: кнопка Delete ВИДНА
```

## 🔄 Workflow: Добавление/удаление items

### Начальное состояние

```
Life Cycle Inventory - Inputs
├── Material Input Name (item 1)     [value: ""]
├── Material Input Amount (item 1)   [value: ""]
└── Material Input Unit (item 1)     [value: ""]
    
    [+ Add Item] ← Всегда доступна
```

### После добавления второго item

```
Life Cycle Inventory - Inputs
├── Material Input Name (item 1)     [value: "Steel"]  [Delete ✅]
├── Material Input Amount (item 1)   [value: "100"]    [Delete ✅]
├── Material Input Unit (item 1)     [value: "kg"]     [Delete ✅]
│
├── Material Input Name (item 2)     [value: ""]       [Delete ✅]
├── Material Input Amount (item 2)   [value: ""]       [Delete ✅]
└── Material Input Unit (item 2)     [value: ""]       [Delete ✅]
    
    [+ Add Item]
```

### После удаления второго item

```
Life Cycle Inventory - Inputs
├── Material Input Name (item 1)     [value: "Steel"]  ← Delete скрыта
├── Material Input Amount (item 1)   [value: "100"]
└── Material Input Unit (item 1)     [value: "kg"]
    
    [+ Add Item]
```

## 🧠 Логика в коде

### Проверка "последний ли item"

```typescript
// В dataset-table.tsx
const repeatableItemsInGroup = rows.filter(
  r => r.group === currentRow.group && !r.isSingleton
);

const uniqueItemIds = new Set(
  repeatableItemsInGroup.map(r => r.itemId).filter(Boolean)
);

const isLastRepeatableItem = 
  uniqueItemIds.size === 1 && !currentRow.isSingleton;

// Показываем Delete только если:
// 1. НЕ singleton
// 2. НЕ последний repeatable item
const showDelete = !currentRow.isSingleton && !isLastRepeatableItem;
```

### Инициализация датасета

```typescript
// В dataset-schema-parser.ts
export function generateInitialDataPoints(schema) {
  const dataPoints = [];
  
  for (const fieldDef of schema.allFields) {
    if (fieldDef.isRepeatable) {
      // ✅ Repeatable: создаём минимум один item
      dataPoints.push({
        field_id: fieldId,
        item_id: '1', // Placeholder
        value: '',
      });
    } else {
      // ✅ Singleton: item_id = null
      dataPoints.push({
        field_id: fieldId,
        item_id: null,
        value: '',
      });
    }
  }
  
  return dataPoints;
}
```

## 📋 Таблица решений

| Сценарий | Singleton | Repeatable (1 item) | Repeatable (2+ items) |
|----------|-----------|---------------------|----------------------|
| **Видно в таблице** | ✅ Да | ✅ Да | ✅ Да |
| **Можно редактировать** | ✅ Да | ✅ Да | ✅ Да |
| **Request Data** | ✅ Да | ✅ Да | ✅ Да |
| **Delete кнопка** | ❌ Нет | ❌ Нет | ✅ Да |
| **Add Item** | ❌ Нет | ✅ Да | ✅ Да |

## 💡 Best Practices

### ✅ DO

```typescript
// Всегда проверяй, последний ли это item
if (!isSingleton && !isLastItem) {
  showDeleteButton = true;
}

// Инициализируй repeatable fields с одним item
const initialData = {
  field_id: "LCI_Inputs_MaterialName",
  item_id: "1",
  value: ""
};
```

### ❌ DON'T

```typescript
// ❌ Не позволяй удалять последний repeatable item
if (!isSingleton) {
  showDeleteButton = true; // WRONG!
}

// ❌ Не создавай repeatable fields без items
const initialData = {
  field_id: "LCI_Inputs_MaterialName",
  item_id: null, // WRONG! Should be "1"
  value: ""
};
```

---

**См. также:**
- [DATASET_REPEATABLE_FIX.md](./DATASET_REPEATABLE_FIX.md) - Детали исправления
- [DATASET_QUICK_REFERENCE.md](./DATASET_QUICK_REFERENCE.md) - Краткая справка
- [FULL_DATASET_SCHEMA.md](./FULL_DATASET_SCHEMA.md) - Полная документация
