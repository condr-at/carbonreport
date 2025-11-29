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
  | 'BANK_TEMPLATE_FILL'
  | 'BCORP_IMPACT_ASSESSMENT'
  | 'BUILDING_CARBON_FOOTPRINT'
  | 'BUILDING_LCA'
  | 'CARBON_NEUTRAL'
  | 'CARBON_NEUTRAL_CERT'
  | 'CBAM'
  | 'CBAM_ALLOWANCES'
  | 'CBAM_DATA_PACKAGE'
  | 'CBAM_MONITORING_ALERT'
  | 'CBAM_PREP_METHOD'
  | 'CBAM_REPORT'
  | 'CDP'
  | 'CDP_DISCLOSURE'
  | 'CLIENT_SCOPE3_PACKAGE'
  | 'CLIENT_TEMPLATE'
  | 'CLIENT_TEMPLATE_FILL'
  | 'CLIMATE_ACTION_PLAN'
  | 'CORP_GHG'
  | 'CORP_GHG_ANNUAL'
  | 'CORP_GHG_INTERNAL'
  | 'CORP_GHG_PUBLIC'
  | 'CORP_GHG_SIMPLIFIED'
  | 'CORP_GHG_VERIFIED'
  | 'CORSIA'
  | 'CSRD'
  | 'ECOVADIS'
  | 'ECOVADIS_SCORE'
  | 'ENERGY_AUDIT_SCOPE12'
  | 'EPD'
  | 'EPD_OR_ISO_14067'
  | 'EU_ETS'
  | 'EU_MRV'
  | 'GHG_PROTOCOL_CORPORATE'
  | 'GRESB_ASSESSMENT'
  | 'HKEX_ESG'
  | 'IFRS_S2'
  | 'IFRS_S2_CLIMATE'
  | 'ISO14064'
  | 'ISO14067'
  | 'ISO_14064_CERT'
  | 'ISO_14067'
  | 'PPA_STRATEGY'
  | 'PREP_GHG'
  | 'PRODUCT_PCF'
  | 'RE100_REPORTING'
  | 'RECS_OR_PPA_STRATEGY'
  | 'RECS_STRATEGY'
  | 'SBTI_COMMITMENT'
  | 'SCOPE123_DATASET'
  | 'SCOPE2_DETAILED'
  | 'SCOPE3_CATEGORY1_SUPPLIERS'
  | 'SCOPE3_DETAILED'
  | 'SCOPE3_PACKAGE'
  | 'SEC_CLIMATE'
  | 'SFDR'
  | 'TCFD'
  | 'TCFD_REPORT'
  | 'UK_SECR'
  | 'UK_TCFD'