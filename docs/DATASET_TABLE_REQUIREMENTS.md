# Dataset Table Requirements

## Overview

The Dataset view displays **all 162 fixed data points** from the master schema in a unified, editable table. 

**Key principles:**
- ✅ **162 fields are fixed** - defined in database, cannot be added/removed by users
- ✅ **No grouping** - fields shown in flat list (singletons first, then repeatables)
- ✅ **No enrichment** - field metadata (labels, hints, types) already stored in DB
- ✅ **Only repeatable ITEMS can be added/deleted** - not fields themselves

Users can: edit values, add/delete repeatable items, request data from contacts.

---

## Core Requirements

### 1. Data Structure

**All 162 fields are pre-defined in database:**
```typescript
// DatasetFieldDefinition (database) - 162 rows total
{
  field_id: 'ProductDescription_ProductName',
  label: 'Product Name',
  hint: 'The commercial name of the product being assessed',
  type: 'text',
  validation: { maxLength: 200 },
  is_repeatable: false,
  repeatable_key: null
}
```

**User project data contains only values:**
```typescript
// Project.dataset (JSONB) - stores only values for the 162 fields
{
  data_points: [
    { field_id: 'ProductDescription_ProductName', item_id: null, value: 'E-Bike' },
    { field_id: 'LifeCycleInventoryInputs_MaterialInputName', item_id: '1', value: 'Aluminum' },
    { field_id: 'LifeCycleInventoryInputs_MaterialInputAmount', item_id: '1', value: '8.5' },
    { field_id: 'LifeCycleInventoryInputs_MaterialInputName', item_id: '2', value: 'Battery' },
  ]
}
```

**Processing:**
1. Fetch ALL 162 field definitions from database: `GET /api/dataset-fields` (cached)
2. Initialize empty values for any missing fields
3. Join data_points with field definitions by `field_id`
4. Sort: singletons first (alphabetically by label), then repeatables (by repeatable_key → item_id → label)

---

## 2. Table Structure

### Visual Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Search...] [Clear All Values]                                  │
├──────────────────────────────────────────────────────────────────┤
│ Field Name                │ Item │ Value      │ Actions         │
├──────────────────────────────────────────────────────────────────┤
│ Product Name 💡           │  -   │ E-Bike     │ [📧]            │
│ Product Identifier 💡     │  -   │ EBK-2025   │ [📧]            │
│ Report Date 💡            │  -   │ 2024-01-15 │ [📧]            │
│ ... (150 more singletons) │  -   │ ...        │ [📧]            │
├──────────────────────────────────────────────────────────────────┤
│ Material Input Name 💡    │  1   │ Aluminum   │ [📧][🗑️]      │
│ Material Input Amount 💡  │  1   │ 8.5        │ [📧][🗑️]      │
│ Material Input Unit 💡    │  1   │ kg         │ [📧][🗑️]      │
├──────────────────────────────────────────────────────────────────┤
│ Material Input Name 💡    │  2   │ Battery    │ [📧][🗑️]      │
│ Material Input Amount 💡  │  2   │ 2.5        │ [📧][🗑️]      │
│ Material Input Unit 💡    │  2   │ kg         │ [📧][🗑️]      │
│ [+ Add Material Input]                                          │
├──────────────────────────────────────────────────────────────────┤
│ Energy Input Type 💡      │  1   │ Electricity│ [📧][🗑️]      │
│ Energy Input Amount 💡    │  1   │ 450        │ [📧][🗑️]      │
│ [+ Add Energy Input]                                            │
└──────────────────────────────────────────────────────────────────┘

💡 = Hover to see hint/description
🗑️ = Delete this item (only for repeatables)
```

**Important notes:**
- No visual grouping or colored backgrounds
- Separator line between different repeatable_key groups
- "[+ Add {repeatable_key}]" button appears after last item of each repeatable group

### Columns

1. **Field Name** (from DatasetFieldDefinition.label)
   - Human-readable label from database (e.g., "Product Name", not "ProductDescription_ProductName")
   - Icon 💡 when hint is available (tooltip on hover shows full hint text)
   - Badge "Required" if validation requires non-empty value
   - **Same label shown for each item** in repeatable fields (no "Material Name #1", "Material Name #2")

2. **Item** 
   - Shows item_id for repeatable fields (1, 2, 3...)
   - Shows "-" for singleton fields
   - Read-only, auto-incremented

3. **Value**
   - Inline editable cell
   - Type based on DatasetFieldDefinition.type:
     - `text` → text input
     - `number` → number input with validation
     - `select` → dropdown (options from field definition)
     - `textarea` → expandable text area
     - `date` → date picker
   - Click to edit, auto-save on blur or Enter
   - Validation feedback inline (from field definition)

4. **Actions**
   - **Singleton fields**: `[📧 Request Data]` only
   - **Repeatable items**: `[📧 Request Data] [🗑️ Delete Item]`

---

## 3. Field Definitions from Database

### DatasetFieldDefinition Model

**All 162 fields are pre-defined in database.** Users cannot add or remove fields.

```typescript
interface DatasetFieldDefinition {
  id: string
  field_id: string                    // e.g., "ProductDescription_ProductName"
  label: string                       // "Product Name" (what users see)
  hint: string | null                 // "The commercial name of the product..."
  type: string                        // "text" | "number" | "select" | "date" | "textarea"
  options: Json | null                // For select: ["Option 1", "Option 2"]
  validation: Json | null             // { required: true, min: 0, max: 100 }
  is_repeatable: boolean              // true for tabular fields
  repeatable_key: string | null       // "LifeCycleInventoryInputs" for grouping
  created_at: DateTime
  updated_at: DateTime
}
```

### Data Flow (No Enrichment!)

```typescript
// 1. Fetch field definitions once (cached globally)
const fieldDefs = await fetch('/api/dataset-fields') // 162 fields

// 2. Fetch project dataset (only contains values)
const project = await fetch(`/api/projects/${id}`)
const dataPoints = project.dataset.data_points // might be empty or partial

// 3. Initialize ALL 162 fields (fill missing with empty values)
const completeDataPoints = initializeFullDataset(dataPoints, fieldDefs)

// 4. Join with definitions for display
const tableRows = completeDataPoints.map(dp => {
  const fieldDef = fieldDefs.find(f => f.field_id === dp.field_id)
  
  return {
    field_id: dp.field_id,
    label: fieldDef.label,           // From DB
    hint: fieldDef.hint,              // From DB
    type: fieldDef.type,              // From DB
    item_id: dp.item_id,              // From project
    value: dp.value,                  // From project
    is_repeatable: fieldDef.is_repeatable,
    repeatable_key: fieldDef.repeatable_key,
  }
})

// 5. Sort for display
const singletons = tableRows.filter(r => !r.is_repeatable)
  .sort((a, b) => a.label.localeCompare(b.label))

const repeatables = tableRows.filter(r => r.is_repeatable)
  .sort((a, b) => {
    // Sort by: repeatable_key → item_id → label
    if (a.repeatable_key !== b.repeatable_key) {
      return a.repeatable_key.localeCompare(b.repeatable_key)
    }
    if (a.item_id !== b.item_id) {
      return parseInt(a.item_id) - parseInt(b.item_id)
    }
    return a.label.localeCompare(b.label)
  })

const finalRows = [...singletons, ...repeatables]
```

### Key Points

✅ **162 fields fixed** - seeded from `dataset-schema.json` into DB on setup
✅ **No runtime enrichment** - metadata already in DB, just JOIN
✅ **Labels from DB** - consistent across all projects
✅ **Hints in DB** - rich tooltips without bloating project data
✅ **Types in DB** - validation rules centralized

---

## 4. Singleton vs Repeatable Fields

**Singleton fields** (item_id === null, is_repeatable === false):
- Fixed, non-repeating values (e.g., Product Name, Report Date)
- Always present in dataset (initialized with empty value if missing)
- **Cannot be deleted** - field stays, only value can be cleared
- Display as simple rows with "-" in Item column
- Examples: ~154 fields like ProductDescription_ProductName, ReportMetadata_ReportDate

**Repeatable fields** (item_id !== null, is_repeatable === true):
- Tabular data with multiple items (e.g., Material Inputs, Transportation records)
- **Items can be added/deleted**, not fields themselves
- All fields with same repeatable_key + item_id shown together
- Item column shows item_id (1, 2, 3...)
- Examples: ~8 repeatable groups like LifeCycleInventoryInputs, Transportation

### Repeatable Items Logic

When user clicks **[+ Add Material Input]**:
1. Find all field definitions where `repeatable_key === "LifeCycleInventoryInputs"`
2. Find max existing item_id for those fields (e.g., max is 2)
3. Create new data_points for **ALL fields in that group** with `item_id = "3"`:
   ```typescript
   [
     { field_id: 'LifeCycleInventoryInputs_MaterialInputName', item_id: '3', value: '' },
     { field_id: 'LifeCycleInventoryInputs_MaterialInputAmount', item_id: '3', value: '' },
     { field_id: 'LifeCycleInventoryInputs_MaterialInputUnit', item_id: '3', value: '' },
     // ... all other MaterialInputs fields
   ]
   ```

When user clicks **[🗑️ Delete]** on item #2:
1. Delete ALL data_points where `item_id === "2"` AND field matches repeatable_key
2. **Do NOT renumber** other items (1, 3, 4 stay as is)
3. Remove rows from UI

---

## 5. Inline Editing

### Edit Behavior

**Trigger:**
- Click on Value cell → enters edit mode
- Cell border highlights, input appears

**Save:**
- Blur (click outside) → auto-save
- Enter key → save + move to next cell
- Escape → cancel edits

**Validation:**
- Client-side validation per field.type
- Error shown inline below cell
- Cannot save invalid values
- Server validation on blur/save

**Optimistic Updates:**
- UI updates immediately
- Background PATCH request to `/api/projects/:id/dataset`
- On error: revert + show toast notification
- Include `datasetVersion` for optimistic locking

---

## 6. Actions

### Request Data

**Singleton Field:**
```typescript
// User clicks [📧] next to "Product Name"
// Opens modal with field context:
{
  title: "Request Data: Product Name",
  hint: "The commercial name of the product being assessed", // From field definition
  fields: [
    { label: "Select Contact", type: "select", options: contacts },
    { label: "Or Add New Contact", type: "text" },
    { label: "Message", type: "textarea", value: mailtoTemplate }
  ],
  actions: ["Cancel", "Generate mailto Link"]
}

// On submit: creates DataRequest record, opens mailto: link
```

**Repeatable Item:**
```typescript
// User clicks [📧] next to Material Input #2
// Message includes only that specific item:
mailtoTemplate = `
  Hi {contact_name},
  
  Please provide material input information for Item 2:
  - Material Input Name: [current value or empty]
  - Material Input Amount: [current value or empty]
  - Material Input Unit: [current value or empty]
  
  Project: {project_name}
`
```

### Delete Item

**Repeatable Only:**
- Click [🗑️] next to any field in repeatable item
- Confirmation modal: "Delete Item #2? This will remove all fields for this item."
- On confirm:
  - DELETE all data_points where `item_id === "2"` for this repeatable_key
  - Do NOT renumber remaining items
  - Optimistic UI update + background API call
  - On error: revert + show toast

**Singleton:**
- **No delete button** - fields cannot be removed
- User can only clear the value (set to empty string)

### Add Item

**Repeatable Fields Only:**
- Show `[+ Add {label}]` button after last item in each repeatable_key group
- Button label uses human-readable name (e.g., "Add Material Input", not "Add LifeCycleInventoryInputs")
- On click:
  1. Find all field_ids where `repeatable_key === "LifeCycleInventoryInputs"`
  2. Find max existing item_id → add 1
  3. POST to API with repeatable_key
  4. API creates empty data_points for ALL fields in that group
  5. Refresh table to show new rows
  6. Auto-focus first editable field in new item

**NOT Possible:**
- ❌ Cannot add new field types (162 fixed)
- ❌ Cannot delete singleton fields
- ❌ Cannot create "custom fields"

---

## 6. Bulk Actions

### Selection

- Checkbox column (leftmost)
- Header checkbox: select/deselect all visible rows
- Individual row checkboxes
- Shift+click for range selection
- Visual highlight for selected rows

### Bulk Operations

**Toolbar (appears when rows selected):**
```
[N selected] [📧 Request Data for Selected] [🗑️ Delete Selected] [✕ Clear Selection]
```

**Request Data for Selected:**
- Opens modal with contact picker
- Generates mailto with all selected fields
- Creates DataRequest records for each field

**Delete Selected:**
- **Only enabled if all selected rows are repeatable items (have item_id)**
- If any singleton field is selected → button disabled with tooltip: "Cannot delete singleton fields"
- Confirmation modal: "Delete {count} items? This will remove all data for these items."
- Deletes all data_points for selected item_ids + their repeatable_key groups
- **Important:** Deletion is at item level (e.g., deletes entire "Material Input #2"), not individual fields
- Shows success/error toast
- On error: reverts optimistic update

---

## 7. Filtering & Search

### Search Bar

- Top of table: `[🔍 Search fields...]`
- Searches in:
  - Field label
  - Field hint
  - Value
- Real-time filtering (debounced 300ms)
- Highlights matching text
- Shows "X results" count

### Report Filter

- Dropdown: `[Filter: All Reports ▼]`
- Options from field definitions:
  ```typescript
  filterOptions = [
    { value: "all", label: "All Fields" },
    { value: "iso14067", label: "ISO 14067" },
    { value: "cbam", label: "CBAM" },
  ]
  ```
- Filters by `report_template_ids` array in field definitions (stored in DB)
- "All Fields" shows all 162 fields
- Specific report shows only fields with that template ID in their report_template_ids

### Repeatable Group Filter

- Dropdown with all unique repeatable_key values from field definitions
- Shows human-readable labels:
  - Query: `SELECT DISTINCT repeatable_key FROM DatasetFieldDefinition WHERE repeatable_key IS NOT NULL`
  - Transform repeatable_key to label (e.g., "LifeCycleInventoryInputs" → "Material Inputs")
- Example options: "Material Inputs", "Emission Sources", "Geographic Information"
- Filters table to show only rows where field.repeatable_key matches selected value
- **Important:** This is a data filter, NOT a visual grouping mechanism

### Field Type Filter (Optional)

- Dropdown: `[Filter: All Types ▼]`
- Options: All, Text, Number, Select, Date
- Filters rows to selected type from field definitions
- Updates URL query param for deep linking

### Status Filter (Future)

- Options: All, Empty (no value), Completed, Requested
- Based on DataRequest status + value presence

---

## 8. Visual Design

### Colors & Styling

**Row separators:**
- Between different repeatable groups: thicker border (`border-t-2`)
- Between items within same group: thin border (`border-t`)
- Edit mode cell: `ring-2 ring-primary`

**Hints:**
- � icon next to field label when hint is available
- Tooltip appears on hover with full hint text
- Subtle gray color for hint icon

**Validation:**
- Required fields: small "Required" badge
- Invalid values: red border + error message below
- Valid values: subtle green checkmark

### Responsive

**Desktop (≥1024px):**
- All columns visible
- Wide table layout

**Tablet (768px - 1023px):**
- Group column hidden (show icon only)
- Actions column: icon buttons without text

**Mobile (<768px):**
- Card layout instead of table
- Each row as a card with fields stacked vertically

---

## 9. Performance

### Virtualization

- Use TanStack Virtual (`@tanstack/react-virtual`) for rendering only visible rows
- Handle 500+ data points without lag
- 50px row height, 10-row buffer
- Update virtualizer on scroll events

### Optimistic Updates

- UI updates immediately on edit
- Background API calls with retry logic
- Revert on error with clear feedback toast
- Include `datasetVersion` for optimistic locking

### Data Loading Strategy

```typescript
// 1. Initial load: Server-side rendering (Next.js)
// Fetch 162 field definitions (cached aggressively)
const fieldDefs = await unstable_cache(
  () => prisma.datasetFieldDefinition.findMany(),
  ['dataset-field-definitions'],
  { revalidate: 3600 } // 1 hour cache
)()

// 2. Fetch project's data points (NO cache - user edits frequently)
const dataPoints = await prisma.dataPoint.findMany({
  where: { dataset_id: datasetId }
})

// 3. JOIN in application layer (not SQL)
const enrichedRows = dataPoints.map(dp => {
  const fieldDef = fieldDefs.find(f => f.field_id === dp.field_id)
  if (!fieldDef) {
    console.warn(`No field definition for ${dp.field_id}`)
    return null
  }
  return { ...dp, ...fieldDef }
}).filter(Boolean)

// 4. Pass to client component as prop
<DatasetTable initialData={enrichedRows} fieldDefs={fieldDefs} />
```

### Caching Strategy

- **Field definitions:** Aggressive caching (1 hour), rarely change
- **Data points:** NO cache, user edits frequently
- **API route caching:** Use Next.js `revalidate` option for GET /api/dataset-fields

### Performance Notes

- Field definitions query is cheap (~162 rows, simple SELECT)
- Data points query is the bottleneck (filter by dataset_id with index)
- Consider pagination if dataset exceeds 2000 rows
- Debounced auto-save (500ms after last keystroke) to reduce API calls

---

## 10. Technical Implementation

### Library: TanStack Table v8

**Why:**
- ✅ Headless - full control over UI
- ✅ Built-in sorting, filtering, selection
- ✅ TypeScript support
- ✅ Works with shadcn/ui components
- ✅ Excellent performance with large datasets

### Data Flow

```typescript
// 1. Fetch project data
const { data: project } = await fetch(`/api/projects/${id}`)

// 2. Fetch field definitions (can be cached)
const { data: fieldDefs } = await fetch('/api/dataset-fields')

// 3. Join data_points with field definitions
const enrichedData = project.dataset.data_points.map(dp => {
  const fieldDef = fieldDefs.find(f => f.field_id === dp.field_id)
  
  if (!fieldDef) {
    console.warn(`No field definition for ${dp.field_id}`)
    return null
  }
  
  return {
    ...dp,
    label: fieldDef.label,
    hint: fieldDef.hint,
    type: fieldDef.type,
    validation: fieldDef.validation,
    is_repeatable: fieldDef.is_repeatable,
    repeatable_key: fieldDef.repeatable_key,
  }
}).filter(Boolean)

// 4. Separate and sort
const singletons = enrichedData
  .filter(d => !d.is_repeatable)
  .sort((a, b) => a.label.localeCompare(b.label))

const repeatables = enrichedData
  .filter(d => d.is_repeatable)

// 5. Group repeatables by repeatable_key + item_id
const groupedRepeatables = groupBy(repeatables, d => 
  `${d.repeatable_key}_${d.item_id}`
)

// 6. Flatten for table
const tableRows = [
  ...singletons.map(s => ({ ...s, item_id: null })),
  ...Object.values(groupedRepeatables).flat()
]

// 7. Render with TanStack Table
```

### API Endpoints

**GET `/api/dataset-fields`**
```typescript
// Get all field definitions (cached, rarely changes)
// Response
{
  fields: [
    {
      id: "uuid",
      field_id: "ProductDescription_ProductName",
      label: "Product Name",
      hint: "The commercial name of the product being assessed",
      type: "text",
      options: null,
      validation: { required: true, maxLength: 200 },
      is_repeatable: false,
      repeatable_key: null
    },
    {
      field_id: "LifeCycleInventoryInputs_MaterialInputName",
      label: "Material Name",
      hint: "Name or description of the material",
      type: "text",
      is_repeatable: true,
      repeatable_key: "MaterialInputs"
    },
    // ... 162 total fields
  ]
}
```

**PATCH `/api/projects/:id/dataset`**
```typescript
// Update single field
{
  field_id: 'LifeCycleInventoryInputs_MaterialInputName',
  item_id: '1',
  value: 'Aluminum Alloy',
  datasetVersion: 5 // optimistic locking
}

// Response
{
  success: true,
  datasetVersion: 6,
  updatedDataPoint: { ... }
}
```

**POST `/api/projects/:id/dataset/items`**
```typescript
// Add new repeatable item
{
  repeatable_key: 'MaterialInputs', // Used to find all fields to create
  datasetVersion: 5
}

// Response
{
  success: true,
  datasetVersion: 6,
  itemId: '3',
  createdDataPoints: [
    { field_id: 'LifeCycleInventoryInputs_MaterialInputName', item_id: '3', value: '' },
    { field_id: 'LifeCycleInventoryInputs_MaterialInputAmount', item_id: '3', value: '' },
    { field_id: 'LifeCycleInventoryInputs_MaterialInputUnit', item_id: '3', value: '' },
  ]
}
```

**DELETE `/api/projects/:id/dataset/items/:itemId`**
```typescript
// Delete all data_points with item_id
{
  repeatable_key: 'MaterialInputs', // Optional: delete only within this group
  datasetVersion: 5
}

// Response
{
  success: true,
  deletedCount: 3,
  datasetVersion: 6
}
```

---

## 11. Edge Cases

### Empty Dataset

- Show empty state: "No data yet. Initialize dataset or import from template."
- Button: [+ Initialize Dataset]

### Missing Field Definitions

- If data_point.field_id not in field definitions:
  - Show raw field_id as label with warning icon ⚠️
  - Allow editing/deleting (orphaned data cleanup)
  - Log warning to console for debugging

### Conflicting item_ids

- If item_ids not sequential (1, 3, 5):
  - Display as-is, don't auto-renumber
  - [+ Add Item] uses max(item_id) + 1

### Validation Errors

- Show inline below cell with field definition's validation.message
- Prevent saving invalid value
- Allow user to fix or revert

### Concurrent Edits (Optimistic Locking)

- If datasetVersion mismatch:
  - Show conflict modal with diff
  - Options: "Keep your changes" or "Use server version"
  - Update UI with resolved state

---

## 12. Future Enhancements (Post-MVP)

- [ ] CSV Import/Export
- [ ] Copy/paste from Excel
- [ ] Undo/Redo
- [ ] Formula support for calculated fields
- [ ] Real-time collaboration (WebSocket)
- [ ] Field history/audit log
- [ ] Custom field creation (not just from templates)
- [ ] Drag-and-drop row reordering
- [ ] Column show/hide
- [ ] Saved views/filters
- [ ] Export to PDF with formatting

---

## 13. Acceptance Criteria

### Must Have (MVP)

- ✅ Display all data_points in unified table
- ✅ Field labels and hints from database
- ✅ Inline editing with validation from field definitions
- ✅ Request Data action for fields
- ✅ Delete repeatable items
- ✅ Add new repeatable items (grouped by repeatable_key)
- ✅ Search and filter
- ✅ Optimistic locking
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Tooltip hints on hover

### Nice to Have (Post-MVP)

- ⏸️ Bulk actions (select multiple)
- ⏸️ CSV export
- ⏸️ Keyboard navigation (Tab, Arrow keys)
- ⏸️ Column sorting
- ⏸️ Field definition management UI (admin)
- ⏸️ Custom field creation (user-defined)

---

## 14. Testing Checklist

### Functional Tests

- [ ] Create new repeatable item
- [ ] Edit singleton field value
- [ ] Edit repeatable field value
- [ ] Delete repeatable item
- [ ] Request data for singleton field
- [ ] Request data for repeatable item
- [ ] Request data for entire group
- [ ] Search fields by name/value
- [ ] Filter by group
- [ ] Handle validation errors
- [ ] Handle concurrent edit conflicts
- [ ] Empty dataset state
- [ ] Large dataset (500+ rows) performance

### Edge Cases

- [ ] Field definition not found (orphaned data)
- [ ] Non-sequential item_ids
- [ ] Empty values
- [ ] Very long text values
- [ ] Special characters in values
- [ ] Network error during save
- [ ] Optimistic locking conflict

### Browser/Device Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Android
- [ ] Tablet landscape/portrait

---

## Dependencies

- **TanStack Table v8** (`@tanstack/react-table`)
- **TanStack Virtual** (`@tanstack/react-virtual`) - for virtualization
- **shadcn/ui components**: Input, Select, Textarea, Button, Checkbox, Card
- **lucide-react** - icons
- **zod** - schema validation

---

## References

- Requirements v0.0.1.md - Data model specification
- prisma/schema.prisma - DatasetFieldDefinition model
- src/lib/dataset-schema.json - Master field definitions source
- TanStack Table Docs: https://tanstack.com/table/v8
