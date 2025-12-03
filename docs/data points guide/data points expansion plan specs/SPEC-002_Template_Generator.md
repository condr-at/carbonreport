# ТЗ-2: Template Generator Engine (Автоматизация)

**Статус:** Черновик
**Дата:** 29.11.2025
**Приоритет:** Высокий (Зависит от ТЗ-1)

## 1. Цель
Автоматизировать создание TypeScript-конфигураций отчетов на основе CSV-матриц (`datapoints-reports-CORPORATE-2026.csv` и `datapoints-reports-PRODUCT-2026.csv`). Это исключит ручной труд и ошибки при обновлении стандартов.

## 2. Входные данные
*   `docs/data points guide/datapoints-reports-CORPORATE-2026.csv`
*   `docs/data points guide/datapoints-reports-PRODUCT-2026.csv`
*   `temp/dataset-extra-fields.json` (список "Common" полей, которые нужно добавить вручную).

## 3. Технические требования

### 3.1. Скрипт генерации
Файл: `scripts/generate-templates.ts`

1.  **Парсинг CSV**:
    *   Использовать библиотеку `csv-parse` или аналог.
    *   Считать заголовки колонок (первая строка) — это коды отчетов (например, `CSRD`, `CBAM`).
    *   Считать строки — это `field_id` и метаданные (обязательность `M`/`O`).

2.  **Логика маппинга**:
    *   Для каждого столбца (отчета) собрать список полей, где стоит `M` (Mandatory) или `O` (Optional).
    *   Определить `scope` шаблона:
        *   Если из файла `...CORPORATE...csv` -> `scope: 'corporate'`.
        *   Если из файла `...PRODUCT...csv` -> `scope: 'product'`.

3.  **Инъекция Common-полей**:
    *   Перед генерацией списка полей добавить "Header Section" с полями из списка "Common" (19 полей: `organization_name`, `report_date` и т.д.), если их нет в CSV.
    *   Эти поля должны быть помечены как `isRequired: true`.

4.  **Генерация файлов**:
    *   Целевая папка: `src/lib/report-templates/generated/`.
    *   Для каждого отчета создать отдельный файл, например `csrd.ts`.
    *   Формат файла:
        ```typescript
        import { ReportTemplate } from '../types';

        export const CSRDTemplate: ReportTemplate = {
          code: 'CSRD',
          name: 'CSRD (Corporate Sustainability Reporting Directive)',
          scope: 'corporate',
          sections: [
            {
              key: 'header',
              title: 'Report Header',
              blockComponent: 'default',
              fields: [ ... ] // Common fields
            },
            {
              key: 'data',
              title: 'Report Data',
              blockComponent: 'default',
              fields: [ ... ] // Fields from CSV
            }
          ]
        };
        ```

5.  **Индексный файл**:
    *   Сгенерировать `src/lib/report-templates/generated/index.ts`, который экспортирует все шаблоны.

### 3.2. Интеграция в приложение
Файл: `src/lib/report-templates/index.ts`

*   Обновить основной реестр шаблонов, чтобы он импортировал сгенерированные шаблоны.
*   Оставить возможность "перекрытия" (overrides) для кастомных шаблонов, которые нельзя описать в CSV (если такие будут).

## 4. Критерии приемки (DoD)
1.  Запуск `npm run generate-templates` создает валидные `.ts` файлы для всех колонок из обоих CSV.
2.  В сгенерированных шаблонах присутствуют как поля из CSV, так и "Common" поля.
3.  Приложение компилируется и видит новые шаблоны через `getAllReportTemplates()`.
