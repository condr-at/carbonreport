# Dataset Schema Fix - Summary

## 🎯 Исправление

Реализовано правильное поведение для **repeatable fields** в датасете.

## ✅ Изменения

### 1. Генерация схемы
**Файл**: `src/lib/dataset-schema-parser.ts`
- Repeatable fields теперь **всегда** создаются с минимум одним item (item_id = "1")
- Добавлена документация о placeholder item_id

### 2. UI таблицы
**Файл**: `src/components/dataset-table.tsx`
- Кнопка "Delete" скрыта для **singleton полей** (item_id = null)
- Кнопка "Delete" скрыта для **последнего repeatable item**
- Добавлена логика подсчета уникальных items в группе

### 3. Схема данных
**Файл**: `src/lib/dataset-schema.json`
- Перегенерирована с правильной структурой:
  - 120 singleton fields (item_id = null)
  - 42 repeatable fields (item_id = "1")

### 4. Документация
**Обновлены**:
- `FULL_DATASET_SCHEMA.md` - раздел про repeatable fields
- `DATASET_QUICK_REFERENCE.md` - правила и примеры
- `DATASET_REPEATABLE_FIX.md` - детальное описание исправления

## 📊 Структура данных

```typescript
// ПРАВИЛЬНАЯ структура датасета
{
  "data_points": [
    // Singleton: 120 полей (нельзя удалить)
    { "field_id": "ProductDescription_ProductName", "item_id": null, "value": "" },
    
    // Repeatable: 42 поля x 1 минимальный item (можно добавлять/удалять items, но не последний)
    { "field_id": "LCI_Inputs_RawMaterialName", "item_id": "1", "value": "" },
    { "field_id": "LCI_Inputs_RawMaterialAmount", "item_id": "1", "value": "" },
  ]
}
```

## 🔒 Правила удаления

| Тип | Item ID | Delete кнопка | Причина |
|-----|---------|---------------|---------|
| Singleton | `null` | ❌ Скрыта | Фиксированная структура |
| Repeatable (последний) | `"1"` | ❌ Скрыта | Минимум один item |
| Repeatable (не последний) | `"2"`, `"3"`, ... | ✅ Видна | Можно удалить |

## ✅ Валидация

```bash
# Проверка структуры
$ node -e "const s = require('./src/lib/dataset-schema.json'); \
  console.log('Total:', s.meta.totalFields); \
  console.log('Singleton:', s.initialDataset.data_points.filter(d => d.item_id === null).length); \
  console.log('Repeatable:', s.initialDataset.data_points.filter(d => d.item_id === '1').length);"

Total: 162
Singleton: 120
Repeatable: 42
✅ PASS
```

## 📝 Commits

```
fix: repeatable fields always have minimum one item
- Update dataset-schema-parser.ts: ensure repeatable fields have item_id='1'
- Update dataset-table.tsx: hide Delete button for last repeatable item
- Regenerate dataset-schema.json with correct structure (120+42)
- Update docs with repeatable field rules
```

---

**Status**: ✅ COMPLETED
**Date**: 2025-10-13
**Impact**: UI + Schema + Docs
