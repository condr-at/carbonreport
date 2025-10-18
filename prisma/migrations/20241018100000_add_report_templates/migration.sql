-- Create table for report templates
CREATE TABLE "report_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT,
    "description" TEXT,
    "layout_meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "report_templates_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "report_templates_code_key" ON "report_templates"("code");

-- Create table for template sections
CREATE TABLE "report_template_sections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "template_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "block_type" TEXT NOT NULL,
    "config" JSONB,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "report_template_sections_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "report_template_sections_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "report_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "report_template_sections_template_id_key_key" ON "report_template_sections"("template_id", "key");

-- Create table for section-to-dataset field mappings
CREATE TABLE "report_template_field_mappings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "section_id" UUID NOT NULL,
    "dataset_field_definition_id" UUID NOT NULL,
    "display_label" TEXT,
    "is_required" BOOLEAN NOT NULL DEFAULT FALSE,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "config" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "report_template_field_mappings_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "report_template_field_mappings_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "report_template_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "report_template_field_mappings_dataset_field_definition_id_fkey" FOREIGN KEY ("dataset_field_definition_id") REFERENCES "dataset_field_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "report_template_field_mappings_section_id_dataset_field_definition_id_key"
  ON "report_template_field_mappings"("section_id", "dataset_field_definition_id");
