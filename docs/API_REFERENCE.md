# API Reference

**Version**: 0.0.1  
**Last Updated**: October 12, 2025  
**Base URL**: `/api`

---

## Overview

This document describes the REST API endpoints for the Carbon Report Platform. All endpoints follow the architecture defined in `Requirements v0.0.1.md`:

- **Single Source of Truth**: All field data stored in `Project.dataset` JSONB
- **Optimistic Locking**: Concurrent edit prevention via `datasetVersion` counter
- **Code-Based Templates**: Report templates and questionnaires in `src/lib/`
 - **Type Safety**: DB-backed field IDs (DatasetFieldDefinition, snake_case) and Zod validation throughout

---

## Authentication

**Status**: Not implemented (MVP)  
**Future**: JWT-based authentication with session cookies

For now, endpoints accept `userId` in request body or return all data.

**⚠️ IMPORTANT - Development Workaround**:
- `POST /api/projects` currently auto-creates users via `upsert()` to bypass foreign key constraints
- This is a **temporary dev hack** and must be removed when implementing proper authentication
- See: `src/app/api/projects/route.ts` - search for "Auto-create user if doesn't exist"
- **TODO**: Replace with proper JWT session validation and remove the `upsert` block

---

## Projects

### List Projects

```http
GET /api/projects
```

**Response**:
```json
{
  "projects": [
    {
      "id": "uuid",
      "name": "Project Name",
      "status": "ACTIVE" | "ARCHIVED" | "DELETED",
      "reportsCount": 2,
      "datasetVersion": 5,
      "createdAt": "2025-10-12T10:00:00Z"
    }
  ]
}
```

**Filters**: Currently none (returns all non-deleted projects)

---

### Create Project

```http
POST /api/projects
```

**Request Body**:
```json
{
  "name": "My New Project",
  "templateCodes": ["ISO14067", "CBAM"],
  "userId": "uuid"
}
```

**Response**:
```json
{
  "project": {
    "id": "uuid",
    "name": "My New Project",
    "status": "ACTIVE",
    "datasetVersion": 0,
    "createdAt": "2025-10-12T10:00:00Z"
  },
  "reports": [
    {
      "id": "uuid",
      "templateCode": "ISO14067",
      "completion": 0
    }
  ]
}
```

**Initialization**:
- `dataset`: `{ data_points: [] }`
- `datasetVersion`: `0`
- `mailtoTemplates`: Extracted from template configs
- `checklist`: `{ items: [] }`
- Creates Report records for each templateCode

**Validation**:
- `name`: Min 3 characters
- `templateCodes`: At least 1 valid code
- `userId`: Valid UUID

---

## Dataset

### Get Dataset

```http
GET /api/projects/:id/dataset
```

**Response**:
```json
{
  "projectId": "uuid",
  "projectName": "Project Name",
  "dataset": {
    "data_points": [
      {
        "field_id": "product_name",
        "item_id": null,
        "value": "Electric Bicycle"
      }
    ]
  },
  "datasetVersion": 5
}
```

**Notes**:
- Returns full dataset with current version
- Optional validation applied (non-breaking)

---

### Update Dataset

```http
PUT /api/projects/:id/dataset
```

**Request Body**:
```json
{
  "dataset": {
    "data_points": [
      {
        "field_id": "product_name",
        "item_id": null,
        "value": "Electric Bicycle"
      }
    ]
  },
  "datasetVersion": 5
}
```

**Response (Success)**:
```json
{
  "success": true,
  "projectId": "uuid",
  "datasetVersion": 6,
  "message": "Dataset updated successfully"
}
```

**Response (Conflict)**:
```json
{
  "error": "Concurrent edit detected",
  "message": "Someone else has modified this project. Please reload and try again.",
  "code": "VERSION_CONFLICT"
}
```
Status: `409 Conflict`

**Optimistic Locking**:
1. Client sends current `datasetVersion` (e.g., 5)
2. Server checks: `WHERE id = :id AND datasetVersion = 5`
3. If match: Update dataset, increment to 6
4. If no match: Return 409 error (someone else updated first)

**Validation**:
 - Dataset structure validated with Zod
 - All `field_id` values must exist in the database (`DatasetFieldDefinition.fieldId`, snake_case)
- `item_id` can be null or string
- `value` must be string

---

## Reports

### Get Report Data

```http
GET /api/projects/:projectId/reports/:reportId
```

**Response**:
```json
{
  "reportInfo": {
    "id": "uuid",
    "projectId": "uuid",
    "templateCode": "ISO14067",
    "createdAt": "2025-10-12T10:00:00Z",
    "updatedAt": "2025-10-12T11:00:00Z"
  },
  "template": {
    "code": "ISO14067",
    "name": "ISO 14067:2018 Carbon Footprint",
    "version": "1.0.0",
    "description": "Product carbon footprint standard",
    "sections": [
      {
        "id": "product_info",
        "title": "Product Information",
        "fields": [
          {
            "id": "product_name",
            "label": "Product Name",
            "type": "text",
            "required": true
          }
        ]
      }
    ]
  },
  "dataset": {
    "data_points": [
      {
  "field_id": "product_name",
        "item_id": null,
        "value": "Electric Bicycle"
      }
    ]
  },
  "datasetVersion": 5,
  "completion": 33,
  "metadata": {}
}
```

**Data Filtering**:
- Loads template from `src/lib/report-templates/[templateCode].ts`
- Extracts all `field_id` values from template sections
- Filters `Project.dataset` to include only those fields
- **Does NOT read `Report.data`** (field removed from schema)

**Completion Calculation**:
```
completion = (filled_required_fields / total_required_fields) * 100
```

---

## Mailto Templates

### Get All Templates

```http
GET /api/projects/:id/mailto-templates
```

**Response**:
```json
{
  "projectId": "uuid",
  "projectName": "Project Name",
  "mailtoTemplates": {
  "product_name": {
      "subject": "Request for Product Name",
      "body": "Hi {{contact_name}}, ..."
    },
    "Material_Name": {
      "subject": "Request for Material Name",
      "body": "..."
    }
  }
}
```

**Storage**: `Project.mailtoTemplates` JSONB field

---

### Update Single Template

```http
PUT /api/projects/:id/mailto-templates/:fieldId
```

**Request Body**:
```json
{
  "subject": "Custom Subject",
  "body": "Custom body with {{contact_name}} placeholder"
}
```

**Response**:
```json
{
  "success": true,
  "fieldId": "product_name",
  "template": {
    "subject": "Custom Subject",
    "body": "Custom body with {{contact_name}} placeholder"
  },
  "message": "Mailto template updated successfully"
}
```

**Allowed Placeholders**:
- `{{contact_name}}` — Recipient name
- `{{project_name}}` — Project name
- `{{field_display_name}}` — Field label from the template
- `{{field_list}}` — Bullet list of selected fields for bulk requests
- `{{deadline}}` — Optional deadline date
- `{{user_name}}` — Current user name

**Validation**:
- `subject`: Required, min 1 character
- `body`: Required, min 1 character
- Placeholder validation not enforced (planned)

---

### Reset All Templates

```http
POST /api/projects/:id/mailto-templates
```

**Response**:
```json
{
  "success": true,
  "message": "Mailto templates reset to defaults",
  "mailtoTemplates": {
  "product_name": {
      "subject": "...",
      "body": "..."
    }
  }
}
```

**Behavior**:
- Reloads defaults from all report template configs
- Overwrites entire `Project.mailtoTemplates` JSONB
- Useful after template updates or to undo customizations

---

## Error Responses

### Validation Error (400)

```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["name"],
      "message": "Project name must be at least 3 characters"
    }
  ]
}
```

### Not Found (404)

```json
{
  "error": "Project not found"
}
```

### Conflict (409)

```json
{
  "error": "Concurrent edit detected",
  "message": "Someone else has modified this project. Please reload and try again.",
  "code": "VERSION_CONFLICT"
}
```

**Client Handling**:
```typescript
if (response.status === 409) {
  // Reload data and prompt user to retry
  const freshData = await fetchDataset(projectId)
  showConflictDialog(freshData)
}
```

### Server Error (500)

```json
{
  "error": "Failed to create project"
}
```

Logs contain detailed error information.

---

## Data Structures

### Dataset Schema

```typescript
{
  data_points: Array<{
  field_id: string,       // Must match DB (DatasetFieldDefinition.fieldId - snake_case)
    item_id: string | null, // For repeatable items (e.g., materials list)
    value: string           // All values stored as strings
  }>
}
```

**Validation**: `src/lib/dataset-validation.ts`

**Uniqueness**: Combination of `field_id + item_id` must be unique

---

## Helpers & Utilities

### Dataset Validation

**File**: `src/lib/dataset-validation.ts`

```typescript
import { validateDataset, upsertDataPoint, calculateCompletion } from '@/lib/dataset-validation'

// Validate structure
const dataset = validateDataset(rawData) // Throws if invalid

// Add/update field
const updated = upsertDataPoint(dataset, 'product_name', 'Electric Bicycle')

// Calculate completion
const percent = calculateCompletion(dataset, ['product_name', 'material_input_name'])
// Returns: 50 (if only Product_Name filled)
```

### Report Templates

**File**: `src/lib/report-templates/index.ts`

```typescript
import { getReportTemplate } from '@/lib/report-templates'

const template = getReportTemplate('ISO14067')
// Returns: { code, name, version, sections, mailto }
```

---

## Implementation Status

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /api/projects` | ✅ Complete | Returns all non-deleted projects |
| `POST /api/projects` | ✅ Complete | Initializes mailtoTemplates, dataset, reports |
| `GET /api/projects/:id/dataset` | ✅ Complete | With optional validation |
| `PUT /api/projects/:id/dataset` | ✅ Complete | Optimistic locking implemented |
| `GET /api/projects/:projectId/reports/:reportId` | ✅ Complete | Filters by template field_ids |
| `GET /api/projects/:id/mailto-templates` | ✅ Complete | Returns JSONB |
| `PUT /api/projects/:id/mailto-templates/:fieldId` | ✅ Complete | Zod validation |
| `POST /api/projects/:id/mailto-templates` | ✅ Complete | Resets to defaults |

**Not Implemented (Optional)**:
- `POST /api/projects/:id/duplicate` — Clone project
- `POST /api/projects/:id/reports` — Add report type
- `PUT /api/projects/:id/reports/:reportId/metadata` — Report settings

---

## Testing

### Manual Testing

**Create Project**:
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "templateCodes": ["ISO14067"],
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Update Dataset**:
```bash
curl -X PUT http://localhost:3000/api/projects/:id/dataset \
  -H "Content-Type: application/json" \
  -d '{
    "dataset": {
      "data_points": [
        {
          "field_id": "Product_Name",
          "item_id": null,
          "value": "Electric Bicycle"
        }
      ]
    },
    "datasetVersion": 0
  }'
```

**Test Conflict**:
1. Open two browser tabs
2. Load same dataset in both
3. Edit and save in tab 1 → Success (version 0 → 1)
4. Edit and save in tab 2 → 409 Conflict (still has version 0)

---

## Future Enhancements

**Planned** (Post-MVP):
- WebSocket updates for real-time collaboration
- Batch operations for dataset updates
- Advanced filtering and pagination
- Audit log for all changes
- Role-based access control
- API rate limiting
- GraphQL alternative

**Under Consideration**:
- Versioned snapshots of datasets
- Undo/redo functionality
- Diff view for concurrent edits
- Auto-merge non-conflicting changes

---

**Last Updated**: October 18, 2025  
**Maintained By**: Development Team  
**Questions**: Refer to `Requirements v0.0.1.md` or `IMPLEMENTATION_CHECKLIST.md`
