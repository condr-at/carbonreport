-- Enforce a single pending data request per field
CREATE UNIQUE INDEX "data_requests_pending_unique"
ON "data_requests" ("project_id", "data_point_id", COALESCE("item_id", ''))
WHERE "revoked_at" IS NULL AND "completed_at" IS NULL;
