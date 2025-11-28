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
  // Variables: {{contact_name}}, {{requester_signature}}, {{field_display_name}}, {{field_list}}, {{deadline}}
}

export type ProjectScope = 'product' | 'corporate' | 'both'

export interface ReportTemplate {
  code: ReportTemplateCode
  name: string
  version?: string
  description?: string
  scope: ProjectScope // Which project types can use this template
  layoutMeta?: ReportTemplateLayoutMeta
  sections: ReportTemplateSection[]
  mailto?: MailtoTemplate
}

export type ReportTemplateCode =
  | 'ISO14067'
  | 'CBAM'
  | 'CSRD'
  | 'EU_ETS'
  | 'UK_SECR'
  | 'SEC_CLIMATE'
  | 'CORSIA'
  | 'GHG_PROTOCOL_CORPORATE'
  | 'CDP'
  | 'IFRS_S2'
  | 'TCFD'
  | 'BUILDING_LCA'
  | 'EU_MRV'
  | 'SFDR'
  | 'UK_TCFD'
  | 'HKEX_ESG'
  | 'ISO14064'
  | 'CDP'
  | 'CORP_GHG'
  | 'ECOVADIS'
  | 'SCOPE3_PACKAGE'
  | 'CLIENT_TEMPLATE'
  | 'SCOPE3_DETAILED'
  | 'CARBON_NEUTRAL'
  | 'TCFD'
