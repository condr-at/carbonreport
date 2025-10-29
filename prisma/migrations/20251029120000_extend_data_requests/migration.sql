-- Extend data_requests with item metadata, deadlines, and completion timestamps
ALTER TABLE "data_requests"
  ADD COLUMN IF NOT EXISTS "item_id" TEXT,
  ADD COLUMN IF NOT EXISTS "field_label" TEXT,
  ADD COLUMN IF NOT EXISTS "completed_at" TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS "deadline" TIMESTAMPTZ;
