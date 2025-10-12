/**
 * Report Template Types
 * 
 * Defines the structure for report templates configuration
 */

export type FieldType = 'text' | 'number' | 'boolean' | 'select' | 'multiselect' | 'textarea' | 'date' | 'json'

export interface ReportField {
  id: string
  label: string
  type: FieldType
  required: boolean
  placeholder?: string
  hint?: string
  options?: string[] // For select/multiselect
  defaultValue?: any
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export interface ReportSection {
  id: string
  title: string
  description?: string
  fields: ReportField[]
}

export interface MailtoTemplate {
  subject: string
  body: string
  // Variables: {{contact_name}}, {{user_name}}, {{data_point_label}}, {{deadline}}
}

export interface ReportTemplate {
  code: string
  name: string
  version: string
  description: string
  sections: ReportSection[]
  mailto?: MailtoTemplate
}

export type ReportTemplateCode = 'ISO14067' | 'CBAM'
