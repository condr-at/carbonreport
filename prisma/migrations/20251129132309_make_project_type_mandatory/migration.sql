/*
  Warnings:

  - Added the required column `project_type` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "project_type" AS ENUM ('product', 'corporate');

-- CreateEnum
CREATE TYPE "project_scope" AS ENUM ('product', 'corporate', 'both');

-- AlterTable
ALTER TABLE "dataset_field_definitions" ADD COLUMN     "data_type" TEXT NOT NULL DEFAULT 'text',
ADD COLUMN     "is_required" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scope" "project_scope" NOT NULL DEFAULT 'both',
ADD COLUMN     "unit" TEXT;

-- AlterTable
ALTER TABLE "organization_memberships" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "plan_definitions" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "dataset_schema_version" INTEGER,
ADD COLUMN     "project_type" "project_type" NOT NULL;

-- AlterTable
ALTER TABLE "report_templates" ADD COLUMN     "scope" "project_scope" NOT NULL DEFAULT 'both';

-- CreateIndex
CREATE INDEX "dataset_field_definitions_scope_idx" ON "dataset_field_definitions"("scope");

-- CreateIndex
CREATE INDEX "report_templates_scope_idx" ON "report_templates"("scope");
