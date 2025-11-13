-- Reset data in dependent tables to enable schema transitions
TRUNCATE TABLE "data_requests" CASCADE;
TRUNCATE TABLE "reports" CASCADE;
TRUNCATE TABLE "projects" CASCADE;
TRUNCATE TABLE "contacts" CASCADE;

-- Drop legacy foreign keys
ALTER TABLE "projects" DROP CONSTRAINT IF EXISTS "projects_user_id_fkey";
ALTER TABLE "contacts" DROP CONSTRAINT IF EXISTS "contacts_user_id_fkey";

-- Adjust project status enum to new lowercase variant and add reported state
ALTER TABLE "projects" ALTER COLUMN "status" DROP DEFAULT;
ALTER TYPE "ProjectStatus" RENAME TO "project_status_old";
ALTER TABLE "projects" ALTER COLUMN "status" TYPE TEXT USING "status"::text;
DROP TYPE "project_status_old";
CREATE TYPE "project_status" AS ENUM ('active', 'archived', 'reported', 'deleted');
ALTER TABLE "projects" ALTER COLUMN "status" TYPE "project_status" USING CASE "status"
  WHEN 'ACTIVE' THEN 'active'::project_status
  WHEN 'ARCHIVED' THEN 'archived'::project_status
  WHEN 'DELETED' THEN 'deleted'::project_status
  ELSE 'active'::project_status
END;
ALTER TABLE "projects" ALTER COLUMN "status" SET DEFAULT 'active';

-- Remove legacy ownership columns
ALTER TABLE "projects" DROP COLUMN IF EXISTS "user_id";
ALTER TABLE "contacts" DROP COLUMN IF EXISTS "user_id";

-- Create enums for organizations, memberships, and assets
CREATE TYPE "organization_status" AS ENUM ('active', 'deleted', 'pending_transfer');
CREATE TYPE "organization_membership_role" AS ENUM ('OWNER', 'ADMIN', 'EDITOR', 'VIEWER_READONLY', 'VIEWER_VERIFIER');
CREATE TYPE "organization_membership_invite_status" AS ENUM ('pending', 'accepted', 'declined', 'revoked');
CREATE TYPE "asset_type" AS ENUM ('org_logo', 'user_avatar');

-- Create core multi-org tables
CREATE TABLE "plan_definitions" (
    "plan_code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "max_active_projects" INTEGER NOT NULL,
    "max_editors" INTEGER NOT NULL,
    "max_verifiers" INTEGER NOT NULL,
    "max_viewers" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "plan_definitions_pkey" PRIMARY KEY ("plan_code")
);

CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "type" "asset_type" NOT NULL,
    "url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "file_size_bytes" INTEGER NOT NULL,
    "uploaded_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "plan_code" TEXT NOT NULL,
    "plan_assigned_at" TIMESTAMP(3) NOT NULL,
    "plan_valid_until" TIMESTAMP(3),
    "logo_asset_id" TEXT,
    "logo_url" TEXT,
    "created_by_user_id" TEXT NOT NULL,
    "status" "organization_status" NOT NULL DEFAULT 'active',
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "organization_memberships" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "organization_membership_role" NOT NULL,
    "invite_status" "organization_membership_invite_status" NOT NULL DEFAULT 'pending',
    "invited_by_user_id" TEXT,
    "joined_at" TIMESTAMP(3),
    "last_active_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "organization_memberships_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "organization_usage_snapshots" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "computed_at" TIMESTAMP(3) NOT NULL,
    "active_projects" INTEGER NOT NULL,
    "active_editors" INTEGER NOT NULL,
    "active_verifiers" INTEGER NOT NULL,
    "active_viewers" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "organization_usage_snapshots_pkey" PRIMARY KEY ("id")
);

-- Extend existing tables with organization scope
ALTER TABLE "projects"
  ADD COLUMN "organization_id" TEXT,
  ADD COLUMN "created_by_user_id" TEXT;

ALTER TABLE "contacts"
  ADD COLUMN "organization_id" TEXT,
  ADD COLUMN "created_by_user_id" TEXT;

-- Enforce NOT NULL constraints after data reset
ALTER TABLE "projects"
  ALTER COLUMN "organization_id" SET NOT NULL,
  ALTER COLUMN "created_by_user_id" SET NOT NULL;

ALTER TABLE "contacts"
  ALTER COLUMN "organization_id" SET NOT NULL,
  ALTER COLUMN "created_by_user_id" SET NOT NULL;

-- Indices for organizations and limits
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations" ("slug");
CREATE INDEX "organizations_plan_code_idx" ON "organizations" ("plan_code");
CREATE UNIQUE INDEX "organization_memberships_organization_id_user_id_key" ON "organization_memberships" ("organization_id", "user_id");
CREATE INDEX "organization_memberships_organization_id_role_invite_status_idx" ON "organization_memberships" ("organization_id", "role", "invite_status");
CREATE INDEX "organization_usage_snapshots_organization_id_computed_at_idx" ON "organization_usage_snapshots" ("organization_id", "computed_at" DESC);
CREATE INDEX "assets_uploaded_by_user_id_idx" ON "assets" ("uploaded_by_user_id");
CREATE INDEX "projects_organization_id_status_idx" ON "projects" ("organization_id", "status");
CREATE INDEX "projects_status_deleted_at_idx" ON "projects" ("status", "deleted_at");

-- Foreign keys for new relationships
ALTER TABLE "assets"
  ADD CONSTRAINT "assets_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "organizations"
  ADD CONSTRAINT "organizations_plan_code_fkey" FOREIGN KEY ("plan_code") REFERENCES "plan_definitions"("plan_code") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "organizations_logo_asset_id_fkey" FOREIGN KEY ("logo_asset_id") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "organizations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "organization_memberships"
  ADD CONSTRAINT "organization_memberships_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "organization_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "organization_memberships_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "organization_usage_snapshots"
  ADD CONSTRAINT "organization_usage_snapshots_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "projects"
  ADD CONSTRAINT "projects_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "projects_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "contacts"
  ADD CONSTRAINT "contacts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "contacts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
