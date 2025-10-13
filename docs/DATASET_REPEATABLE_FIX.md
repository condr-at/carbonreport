# Dataset Schema Fix: Repeatable Fields Rules

## Дата
13 октября 2025 (после Iteration 6)

## Проблема

Неправильное понимание работы repeatable полей:
- ❌ **Было**: Repeatable поля могут быть полностью пустыми (без items)
- ❌ **Было**: Можно удалять все items, включая последний
- ❌ **Было**: Структура датасета не фиксированная

## Правильное понимание

### 1. Фиксированная структура датасета

**Датасет = 162 фиксированных поля:**
- 120 singleton полей (item_id = null) - нельзя удалить
- 42 repeatable поля (item_id не null) - можно добавлять/удалять items

### 2. Repeatable fields всегда имеют минимум один item

```typescript
// ✅ Правильно: repeatable field с одним пустым item
{
  "data_points": [
    { "field_id": "LCI_Inputs_RawMaterialName", "item_id": "1", "value": "" },
    { "field_id": "LCI_Inputs_RawMaterialAmount", "item_id": "1", "value": "" }
  ]
}

// ❌ Неправильно: repeatable field без items
{
  "data_points": []
}
```

**Причины:**
1. **Видимость структуры** - пользователь сразу видит, какие поля можно заполнить
2. **UX** - не нужно искать кнопку "Add Item", чтобы начать заполнение
3. **Консистентность** - датасет всегда содержит ВСЕ 162 поля

### 3. Правила удаления

| Тип поля | Item ID | Можно удалить? | Причина |
|----------|---------|----------------|---------|
| Singleton | `null` | ❌ НЕТ | Фиксированная структура |
| Repeatable (последний) | не `null` | ❌ НЕТ | Минимум один item |
| Repeatable (не последний) | не `null` | ✅ ДА | Можно иметь несколько |

## Реализованные изменения

### 1. Парсер схемы (`dataset-schema-parser.ts`)

```typescript
// Функция generateInitialDataPoints()
if (fieldDef.isRepeatable) {
  // ✅ Всегда создаём минимум один item
  dataPoints.push({
    field_id: fieldId,
    item_id: '1', // Placeholder, будет заменён на UUID
    value: '',
  });
}
```

### 2. UI таблицы (`dataset-table.tsx`)

```typescript
// В колонке Actions
{
  id: 'actions',
  cell: ({ row }) => {
    const currentRow = row.original;
    
    // Проверяем, последний ли это item в repeatable группе
    const repeatableItemsInGroup = rows.filter(
      r => r.group === currentRow.group && !r.isSingleton
    );
    const uniqueItemIds = new Set(
      repeatableItemsInGroup.map(r => r.itemId).filter(Boolean)
    );
    const isLastRepeatableItem = uniqueItemIds.size === 1 && !currentRow.isSingleton;
    
    return (
      <div>
        {/* Request Data - всегда доступна */}
        <Button onClick={() => onRequestData(...)}>
          <Mail />
        </Button>
        
        {/* Delete - только для:
            1. Repeatable полей (не singleton)
            2. НЕ последнего item (минимум один должен остаться)
        */}
        {!currentRow.isSingleton && !isLastRepeatableItem && (
          <Button onClick={() => onDeleteItem(...)}>
            <Trash2 />
          </Button>
        )}
      </div>
    );
  }
}
```

### 3. Документация

Обновлены файлы:
- `FULL_DATASET_SCHEMA.md` - добавлен раздел про repeatable fields
- `DATASET_QUICK_REFERENCE.md` - добавлены правила и примеры

## Примеры

### Пример 1: Инициализация датасета

```typescript
// После initializeFullDataset() получаем:
const dataset = {
  data_points: [
    // Singleton fields (120)
    { field_id: "ReportMetadata_OrganizationName", item_id: null, value: "" },
    { field_id: "ProductDescription_ProductName", item_id: null, value: "" },
    // ...
    
    // Repeatable fields (42) - каждый с минимум одним item
    { field_id: "LCI_Inputs_RawMaterialName", item_id: "1", value: "" },
    { field_id: "LCI_Inputs_RawMaterialAmount", item_id: "1", value: "" },
    { field_id: "Transportation_TransportMode", item_id: "1", value: "" },
    // ...
  ]
};
```

### Пример 2: UI behavior

```
┌─────────────────────────────────────────────────────────────┐
│ Life Cycle Inventory - Inputs                               │
├──────────────────────┬──────┬─────────┬──────────────────────┤
│ Field                │ Item │ Value   │ Actions              │
├──────────────────────┼──────┼─────────┼──────────────────────┤
│ Raw Material Name    │ 1    │ Steel   │ [Mail] [Trash]       │ ← Можно удалить
│ Raw Material Amount  │ 1    │ 100     │ [Mail] [Trash]       │
│ Raw Material Name    │ 2    │ Plastic │ [Mail] [Trash]       │ ← Можно удалить
│ Raw Material Amount  │ 2    │ 50      │ [Mail] [Trash]       │
└──────────────────────┴──────┴─────────┴──────────────────────┘

После удаления item "2":

┌─────────────────────────────────────────────────────────────┐
│ Life Cycle Inventory - Inputs                               │
├──────────────────────┬──────┬─────────┬──────────────────────┤
│ Field                │ Item │ Value   │ Actions              │
├──────────────────────┼──────┼─────────┼──────────────────────┤
│ Raw Material Name    │ 1    │ Steel   │ [Mail]               │ ← Нельзя удалить!
│ Raw Material Amount  │ 1    │ 100     │ [Mail]               │   (последний item)
└──────────────────────┴──────┴─────────┴──────────────────────┘
```

### Пример 3: Singleton field

```
┌─────────────────────────────────────────────────────────────┐
│ Product Description                                         │
├──────────────────────┬──────┬─────────┬──────────────────────┤
│ Field                │ Item │ Value   │ Actions              │
├──────────────────────┼──────┼─────────┼──────────────────────┤
│ Product Name         │ -    │ E-Bike  │ [Mail]               │ ← Нельзя удалить
│ Product Identifier   │ -    │ EB-001  │ [Mail]               │   (singleton)
└──────────────────────┴──────┴─────────┴──────────────────────┘
```

## Техническая валидация

### Schema generation

```bash
$ npx tsx scripts/generate-dataset-schema.ts
✅ Generated dataset schema with 162 fields
   - Sections: 19
   - Singleton fields: 120
   - Repeatable fields: 42

# Проверка repeatable fields
$ node -e "const s = require('./src/lib/dataset-schema.json'); \
  console.log('Repeatable with item_id=1:', \
  s.initialDataset.data_points.filter(d => d.item_id === '1').length);"
Repeatable with item_id=1: 42  ✅
```

### UI проверка

1. Открыть `/projects/{id}/dataset`
2. Найти repeatable group (например, "Life Cycle Inventory - Inputs")
3. Убедиться:
   - ✅ Видны поля с item_id = "1"
   - ✅ Кнопка Delete скрыта (только один item)
   - ✅ Кнопка Add Item работает
4. Добавить второй item
5. Убедиться:
   - ✅ Кнопка Delete появилась для обоих items
6. Удалить второй item
7. Убедиться:
   - ✅ Кнопка Delete снова скрылась (остался один)

## Файлы изменены

```
src/lib/
├── dataset-schema-parser.ts     ✅ Обновлена документация в generateInitialDataPoints
└── dataset-schema.json          ✅ Перегенерирована (42 repeatable с item_id="1")

src/components/
└── dataset-table.tsx            ✅ Логика скрытия кнопки Delete

docs/
├── FULL_DATASET_SCHEMA.md       ✅ Добавлен раздел про repeatable
├── DATASET_QUICK_REFERENCE.md   ✅ Добавлены правила
└── DATASET_REPEATABLE_FIX.md    ✅ Этот файл
```

## Status

✅ **FIXED** - Правильное поведение repeatable fields реализовано

---

**Дата**: 13 октября 2025
**Автор**: GitHub Copilot
**Reviewer**: User
