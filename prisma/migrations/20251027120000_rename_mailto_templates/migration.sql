-- Rename column only if legacy plural name exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'projects'
      AND column_name = 'mailto_templates'
  ) THEN
    ALTER TABLE "projects"
      RENAME COLUMN "mailto_templates" TO "mailto_template";
  END IF;
END
$$;

-- Transform stored JSON from per-field map to single template structure
WITH transformed AS (
  SELECT
    id,
    CASE
      WHEN mailto_template IS NULL THEN NULL
      WHEN jsonb_typeof(mailto_template) <> 'object' THEN NULL
      WHEN mailto_template ? 'subject' OR mailto_template ? 'body' THEN mailto_template
      ELSE (
        SELECT jsonb_build_object(
                 'subject', first_template.value->>'subject',
                 'body', first_template.value->>'body'
               )
        FROM LATERAL (
          SELECT value
          FROM jsonb_each(mailto_template)
          ORDER BY key
          LIMIT 1
        ) AS first_template
      )
    END AS new_template
  FROM projects
)
UPDATE projects p
SET mailto_template = transformed.new_template
FROM transformed
WHERE p.id = transformed.id;

-- Normalize empty objects to NULL for consistency
UPDATE projects
SET mailto_template = NULL
WHERE mailto_template = '{}'::jsonb;