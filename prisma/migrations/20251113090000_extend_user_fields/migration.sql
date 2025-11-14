-- Extend users table with profile fields and avatar asset reference
ALTER TABLE "users"
  ADD COLUMN "first_name" TEXT,
  ADD COLUMN "last_name" TEXT,
  ADD COLUMN "job_title" TEXT,
  ADD COLUMN "timezone" TEXT,
  ADD COLUMN "avatar_asset_id" TEXT;

ALTER TABLE "users"
  ADD CONSTRAINT "users_avatar_asset_id_fkey"
  FOREIGN KEY ("avatar_asset_id")
  REFERENCES "assets"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;
