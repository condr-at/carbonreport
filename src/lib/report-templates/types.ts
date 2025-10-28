/**
 * Report Template Types
 *
 * Defines the structure for report templates configuration that is now backed by the database.
 */

export type JsonObject = Record<string, unknown>

export interface ReportTemplateFieldMapping {
  fieldId: string
  displayLabel?: string
  isRequired?: boolean
  displayOrder?: number
  config?: JsonObject
}

export interface ReportTemplateSectionConfig extends JsonObject {
  repeatableKey?: string
}

export interface ReportTemplateSection {
  key: string
  title: string
  description?: string
  blockComponent: string
  config?: ReportTemplateSectionConfig
  fields: ReportTemplateFieldMapping[]
}

export interface ReportTemplateLayoutMeta extends JsonObject {
  layout?: string
}

export interface MailtoTemplate {
  subject: string
  body: string
  // Variables: {{contact_name}}, {{user_name}}, {{field_display_name}}, {{field_list}}, {{deadline}}
}

export interface ReportTemplate {
  code: string
  name: string
  version?: string
  description?: string
  layoutMeta?: ReportTemplateLayoutMeta
  sections: ReportTemplateSection[]
  mailto?: MailtoTemplate
}

export type ReportTemplateCode = 'ISO14067' | 'CBAM'
