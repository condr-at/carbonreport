# Database Migration Guide

## Overview

This guide documents the database schema changes required to implement the updated architecture with optimistic locking and per-project mailto templates.

## Changes in This Migration

### 1. Projects Table

**Added fields:**
- `dataset_version` (INTEGER, default 0) — Optimistic locking counter for concurrent edit prevention
- `mailto_templates` (JSONB, nullable) — Per-project mailto template customization

### 2. Reports Table

**Modified fields:**
- Removed: `data` (JSONB) — Field values now only in `Project.dataset`
- Added: `metadata` (JSONB, nullable) — Report-specific UI settings (optional)

## SQL Migration Script

```sql
-- Migration: add_dataset_version_and_mailto_templates
-- Date: 2025-10-12

BEGIN;

-- Add dataset_version to Projects table
ALTER TABLE "projects" 
ADD COLUMN "dataset_version" INTEGER NOT NULL DEFAULT 0;

-- Add mailto_templates to Projects table
ALTER TABLE "projects" 
ADD COLUMN "mailto_templates" JSONB;

-- Remove data column from Reports table
ALTER TABLE "reports" 
DROP COLUMN IF EXISTS "data";

-- Add metadata column to Reports table
ALTER TABLE "reports" 
ADD COLUMN "metadata" JSONB;

-- Add comment explaining dataset_version
COMMENT ON COLUMN "projects"."dataset_version" IS 'Optimistic locking counter. Incremented on each dataset update to prevent concurrent edit conflicts.';

-- Add comment explaining mailto_templates
COMMENT ON COLUMN "projects"."mailto_templates" IS 'Per-project mailto template customization. Initialized from template defaults, editable by user.';

-- Add comment explaining Report.metadata
COMMENT ON COLUMN "reports"."metadata" IS 'Report-specific UI settings: field visibility overrides, export preferences. All field VALUES are in Project.dataset.';

COMMIT;
```

## Applying the Migration

### Option 1: Using Prisma Migrate (Recommended)

```bash
# 1. Ensure database is accessible
npx prisma db push --skip-generate

# 2. Create migration
npx prisma migrate dev --name add_dataset_version_and_mailto_templates

# 3. Apply migration
npx prisma migrate deploy
```

### Option 2: Manual SQL Execution

If Prisma Migrate is not available:

```bash
# Connect to PostgreSQL
psql $DATABASE_URL

# Copy-paste the SQL migration script above
```

### Option 3: Raw SQL via Prisma Studio

```bash
npx prisma studio
# Use SQL editor to execute migration script
```

## Data Migration Notes

### For Existing Projects

If you have existing projects with data in `Report.data`:

```sql
-- Optional: Merge Report.data into Project.dataset (if needed)
-- This is project-specific and depends on your data structure

-- Example pseudocode (adapt to your schema):
UPDATE projects p
SET dataset = jsonb_set(
  p.dataset,
  '{data_points}',
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'field_id', dp->>'field_id',
        'item_id', dp->>'item_id',
        'value', dp->>'value'
      )
    )
    FROM reports r
    CROSS JOIN LATERAL jsonb_array_elements(r.data->'data_points') dp
    WHERE r.project_id = p.id
  ),
  true
)
WHERE EXISTS (
  SELECT 1 FROM reports r WHERE r.project_id = p.id AND r.data IS NOT NULL
);
```

**Note**: For MVP with no production data, this step can be skipped.

### For Existing Reports

The `Report.data` column is dropped. Ensure all data is migrated to `Project.dataset` before running this migration in production.

## Verification Steps

After migration, verify:

```sql
-- Check new columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'projects' 
  AND column_name IN ('dataset_version', 'mailto_templates');

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'reports' 
  AND column_name IN ('metadata', 'data');
-- 'data' should NOT appear, 'metadata' should exist

-- Verify dataset_version defaults
SELECT id, name, dataset_version 
FROM projects 
LIMIT 5;
-- All should have dataset_version = 0
```

## Rollback

If you need to rollback:

```sql
BEGIN;

-- Remove new columns
ALTER TABLE "projects" DROP COLUMN IF EXISTS "dataset_version";
ALTER TABLE "projects" DROP COLUMN IF EXISTS "mailto_templates";
ALTER TABLE "reports" DROP COLUMN IF EXISTS "metadata";

-- Restore data column (empty)
ALTER TABLE "reports" ADD COLUMN "data" JSONB DEFAULT '{}';

COMMIT;
```

**Warning**: Rollback will lose all mailto_templates and Report.metadata. Ensure backups before rollback.

## Testing Optimistic Locking

After migration, test the optimistic locking:

```typescript
// Test: Concurrent edit detection
const project = await prisma.project.findUnique({ where: { id } })
const currentVersion = project.datasetVersion

// Simulate concurrent edit
try {
  await prisma.project.update({
    where: {
      id: projectId,
      datasetVersion: currentVersion // Will fail if another update happened
    },
    data: {
      dataset: updatedDataset,
      datasetVersion: { increment: 1 }
    }
  })
  console.log('Update successful')
} catch (error) {
  console.error('Concurrent edit detected:', error)
  // Handle conflict: reload data, show conflict resolution UI
}
```

## Performance Considerations

### GIN Index for Dataset JSONB

Recommended for projects with large datasets:

```sql
-- Add GIN index for faster JSONB queries
CREATE INDEX idx_projects_dataset_gin ON projects USING GIN (dataset);

-- Add GIN index for mailto_templates (optional, if querying templates)
CREATE INDEX idx_projects_mailto_templates_gin ON projects USING GIN (mailto_templates);
```

**When to apply**: After 100+ projects or if dataset queries are slow.

## Next Steps

After migration:

1. ✅ Update application code to use `Project.mailtoTemplates`
2. ✅ Implement optimistic locking in API routes
3. ✅ Seed default mailto templates on project creation
4. ✅ Update Reports rendering to read from `Project.dataset` only
5. ✅ Test concurrent edit scenarios

## References

- Prisma Migrate Docs: https://www.prisma.io/docs/concepts/components/prisma-migrate
- PostgreSQL JSONB: https://www.postgresql.org/docs/current/datatype-json.html
- Optimistic Locking Pattern: https://en.wikipedia.org/wiki/Optimistic_concurrency_control
