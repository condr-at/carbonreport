# Dataset Table Requirements

## Overview

The Dataset view displays all project data points in a unified, editable table with visual grouping by field categories. Users can view, edit, add, delete, and request data for all fields in one place.

---

## Core Requirements

### 1. Data Structure

**Input Data:**
```typescript
// From Project.dataset (JSONB)
{
  data_points: [
    { field_id: 'Product_Name', item_id: null, value: 'E-Bike' },
    { field_id: 'Material_Name', item_id: '1', value: 'Aluminum' },
    { field_id: 'Material_Amount', item_id: '1', value: '8.5' },
    { field_id: 'Material_Name', item_id: '2', value: 'Battery' },
  ]
}

// From Report Template Config
{
  sections: [{
    fields: [
      { id: 'Product_Name', label: 'Product Name', type: 'text' },
      { id: 'Material_Name', label: 'Material Name', type: 'text' },
      { id: 'Material_Amount', label: 'Amount', type: 'number' },
    ]
  }]
}
```

**Processing:**
1. Join data_points with template fields by `field_id === field.id`
2. Group fields by prefix (`Product_*`, `Material_*`, `Energy_*`)
3. Within each group, separate singleton (item_id === null) vs repeatable (item_id !== null)
4. For repeatables: pivot by item_id (items as rows, fields as columns)

---

## 2. Table Structure

### Visual Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Search...] [Filter: All Groups ▼] [+ Add Field]                │
├──────────────────────────────────────────────────────────────────┤
│ Group         │ Field Name    │ Item │ Value      │ Actions     │
├──────────────────────────────────────────────────────────────────┤
│ 📦 Product    │ Name          │  -   │ E-Bike     │ [📧]        │ ← Group 1 (light bg)
│               │ Weight        │  -   │ 25         │ [📧]        │
├──────────────────────────────────────────────────────────────────┤
│ 🔩 Materials  │               │      │            │ [📧 All]    │ ← Group header
│               │ Name          │  1   │ Aluminum   │ [📧][🗑️]   │ ← Group 2 (blue bg)
│               │ Amount        │  1   │ 8.5        │ [📧][🗑️]   │
│               │ Unit          │  1   │ kg         │ [📧][🗑️]   │
│               │ Name          │  2   │ Battery    │ [📧][🗑️]   │ ← Same group
│               │ Amount        │  2   │ 2.5        │ [📧][🗑️]   │
│               │ [+ Add Material Item]                            │
├──────────────────────────────────────────────────────────────────┤
│ ⚡ Energy     │ Total         │  -   │ 45.5       │ [📧]        │ ← Group 3 (green bg)
│               │ Renewable %   │  -   │ 60         │ [📧]        │
└──────────────────────────────────────────────────────────────────┘
```

### Columns

1. **Group** (optional, visual indicator)
   - Icon + Group name (Product, Materials, Energy, Transport, etc.)
   - Merged cells spanning all rows in group
   - Background color for visual separation

2. **Field Name** (from template.field.label)
   - Human-readable label
   - For repeatables: only unique field names shown (no "Material Name #1, Material Name #2")

3. **Item** 
   - Shows item_id for repeatable fields (1, 2, 3...)
   - Shows "-" for singleton fields
   - Read-only

4. **Value**
   - Inline editable cell
   - Type based on template.field.type:
     - `text` → text input
     - `number` → number input with validation
     - `select` → dropdown
     - `textarea` → expandable text area
     - `date` → date picker
   - Click to edit, auto-save on blur or Enter
   - Validation feedback inline

5. **Actions**
   - **Singleton fields**: `[📧 Request Data]`
   - **Repeatable items**: `[📧 Request Data] [🗑️ Delete Item]`
   - **Repeatable group header**: `[📧 Request All]`

---

## 3. Grouping Logic

### Field Grouping by Prefix

```typescript
// Automatic grouping by field_id prefix
const groups = {
  'Product': ['Product_Name', 'Product_Weight', 'Product_Category'],
  'Material': ['Material_Name', 'Material_Amount', 'Material_Unit'],
  'Energy': ['Energy_Total', 'Energy_Renewable'],
  'Transport': ['Transport_Mode', 'Transport_Distance'],
  // ... etc
}
```

**Rules:**
1. Group name = first part before underscore (`Product_*` → "Product")
2. Icon assigned per group (Product: 📦, Material: 🔩, Energy: ⚡)
3. Background color per group for visual separation
4. Groups displayed in fixed order (configurable)

### Singleton vs Repeatable

**Singleton fields** (item_id === null):
- Display as simple rows: Field Name | Value
- No "Item" column value (shows "-")
- Cannot delete (fixed schema)
- Can request data individually

**Repeatable fields** (item_id !== null):
- Display as pivot table within group
- All fields with same item_id grouped together
- Item column shows item_id (1, 2, 3...)
- Can delete entire item (all fields with that item_id)
- Can add new item

---

## 4. Inline Editing

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

## 5. Actions

### Request Data

**Singleton Field:**
```typescript
// User clicks [📧] next to "Product Weight"
// Opens modal:
{
  title: "Request Data: Product Weight",
  fields: [
    { label: "Select Contact", type: "select", options: contacts },
    { label: "Or Add New Contact", type: "text" },
    { label: "Message", type: "textarea", value: mailtoTemplate }
  ],
  actions: ["Cancel", "Generate mailto Link"]
}

// On submit:
// 1. Create/select contact
// 2. Create DataRequest record
// 3. Generate mailto: link with template
// 4. Open user's email client
```

**Repeatable Group (Request All):**
```typescript
// User clicks [📧 Request All] in Materials header
// Same modal, but message includes ALL material fields
mailtoTemplate = `
  Hi {contact_name},
  
  Please provide the following material information:
  - Material Name (for all items)
  - Material Amount (for all items)
  - Material Unit (for all items)
  
  Project: {project_name}
`
```

**Repeatable Item:**
```typescript
// User clicks [📧] next to Material #1
// Message includes only fields for item_id='1'
mailtoTemplate = `
  Hi {contact_name},
  
  Please provide material information for Item 1:
  - Material Name
  - Material Amount
  - Material Unit
  
  Project: {project_name}
`
```

### Delete Item

**Repeatable Only:**
- Click [🗑️] next to any field in repeatable item
- Confirmation modal: "Delete Material Item #1? This will remove all fields for this item."
- On confirm:
  - DELETE all data_points with that item_id
  - Re-number remaining items (optional: 1,2,3 → 1,2 after deleting #2)
  - Optimistic UI update + background API call

**Singleton:**
- No delete button (fields are fixed schema)
- User can only clear value (set to empty string)

### Add Item

**Repeatable Groups:**
- Show `[+ Add Material Item]` button at bottom of group
- On click:
  - Find max item_id in group, add 1
  - Create empty data_points for all fields in group with new item_id
  - Insert new rows in table
  - Auto-focus first editable field

**Example:**
```typescript
// Materials group has items 1, 2
// User clicks [+ Add Material Item]
// Creates:
[
  { field_id: 'Material_Name', item_id: '3', value: '' },
  { field_id: 'Material_Amount', item_id: '3', value: '' },
  { field_id: 'Material_Unit', item_id: '3', value: '' },
]
// Adds to table, focuses on Material_Name[3] cell
```

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
- Only enabled if all selected rows are repeatable (have item_id)
- Confirmation modal with list of items to delete
- Deletes all data_points for selected item_ids
- Shows success/error toast

---

## 7. Filtering & Search

### Search Bar

- Top of table: `[🔍 Search fields...]`
- Searches in:
  - Field Name (label)
  - Value
  - Group name
- Real-time filtering (debounced 300ms)
- Highlights matching text
- Shows "X results" count

### Group Filter

- Dropdown: `[Filter: All Groups ▼]`
- Options: All, Product, Materials, Energy, Transport, etc.
- Filters rows to selected group
- Updates URL query param for deep linking

### Status Filter (Future)

- Options: All, Empty (no value), Completed, Requested
- Based on DataRequest status + value presence

---

## 8. Visual Design

### Color Scheme

**Group backgrounds:**
- Product: `bg-slate-50` (light gray)
- Material: `bg-blue-50` (light blue)
- Energy: `bg-green-50` (light green)
- Transport: `bg-amber-50` (light amber)
- Emission: `bg-red-50` (light red)
- Default: `bg-gray-50`

**Borders:**
- Group separator: thicker border (`border-t-2`)
- Row separator: thin border (`border-t`)
- Edit mode cell: `ring-2 ring-primary`

**Icons:**
- 📦 Product
- 🔩 Materials
- ⚡ Energy
- 🚚 Transport
- 💨 Emissions
- 🏭 Manufacturing
- 📊 Results

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

- Use TanStack Virtual for rendering only visible rows
- Handle 500+ data points without lag
- 50px row height, 10-row buffer

### Optimistic Updates

- UI updates immediately on edit
- Background API calls with retry logic
- Revert on error with clear feedback

### Data Loading

- Initial load: show skeleton rows
- Incremental updates via WebSocket (future)
- Debounced auto-save (500ms after last keystroke)

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

// 2. Load template configs
const templates = project.reports.map(r => getTemplate(r.templateCode))

// 3. Merge template fields with data_points
const enrichedData = project.dataset.data_points.map(dp => {
  const field = templates
    .flatMap(t => t.sections.flatMap(s => s.fields))
    .find(f => f.id === dp.field_id)
  
  return {
    ...dp,
    label: field?.label || dp.field_id,
    type: field?.type || 'text',
    group: dp.field_id.split('_')[0], // "Material_Name" → "Material"
  }
})

// 4. Group by prefix
const grouped = groupBy(enrichedData, 'group')

// 5. Within each group, pivot repeatables
const pivoted = Object.entries(grouped).map(([group, items]) => {
  const singletons = items.filter(i => !i.item_id)
  const repeatables = groupBy(
    items.filter(i => i.item_id), 
    'item_id'
  )
  
  return { group, singletons, repeatables }
})

// 6. Render with TanStack Table
```

### API Endpoints

**PATCH `/api/projects/:id/dataset`**
```typescript
// Update single field
{
  field_id: 'Material_Name',
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

**DELETE `/api/projects/:id/dataset/items/:itemId`**
```typescript
// Delete all data_points with item_id
// Request: DELETE /api/projects/abc/dataset/items/2
// Deletes: Material_*[2], Transport_*[2], etc.

// Response
{
  success: true,
  deletedCount: 3,
  datasetVersion: 7
}
```

**POST `/api/projects/:id/dataset/items`**
```typescript
// Add new repeatable item
{
  group: 'Material', // Used to determine which fields to create
  item_id: '3'       // New item ID
}

// Response
{
  success: true,
  datasetVersion: 8,
  createdDataPoints: [
    { field_id: 'Material_Name', item_id: '3', value: '' },
    { field_id: 'Material_Amount', item_id: '3', value: '' },
  ]
}
```

---

## 11. Edge Cases

### Empty Dataset

- Show empty state: "No data yet. Add fields from template or create custom fields."
- Button: [+ Add First Field]

### Missing Template Fields

- If data_point.field_id not in any template:
  - Show in "Other" group with warning icon
  - Display raw field_id as label
  - Allow editing/deleting (orphaned data cleanup)

### Conflicting item_ids

- If item_ids not sequential (1, 3, 5):
  - Display as-is, don't auto-renumber
  - [+ Add Item] uses max(item_id) + 1

### Validation Errors

- Show inline below cell
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
- ✅ Visual grouping by field prefix
- ✅ Inline editing with validation
- ✅ Request Data action for fields
- ✅ Delete repeatable items
- ✅ Add new repeatable items
- ✅ Search and filter
- ✅ Optimistic locking
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling

### Nice to Have (Post-MVP)

- ⏸️ Bulk actions (select multiple)
- ⏸️ CSV export
- ⏸️ Keyboard navigation (Tab, Arrow keys)
- ⏸️ Column sorting
- ⏸️ Field validation hints from template

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

- [ ] Field not in template (orphaned data)
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
- **react-hook-form** (optional) - for validation
- **zod** (optional) - schema validation

---

## References

- Requirements v0.0.1.md - Data model specification
- src/lib/field-ids.ts - Field ID enum
- src/lib/report-templates/ - Template configurations
- TanStack Table Docs: https://tanstack.com/table/v8
