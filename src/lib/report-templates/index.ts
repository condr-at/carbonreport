import { GeneratedReportTemplates } from './generated';
import { ReportTemplate, ReportTemplateCode } from './types'
import { ISO14067Template } from './iso14067'
import { CBAMTemplate } from './cbam'

/**
 * Report Templates Registry
 * 
 * Central registry of all available report templates.
 * Import this in your application to access templates.
 */

export const REPORT_TEMPLATES: Partial<Record<ReportTemplateCode, ReportTemplate>> = {
  ...GeneratedReportTemplates,
  ISO14067: ISO14067Template,
  CBAM: CBAMTemplate,
}

/**
 * Get a report template by code
 */
export function getReportTemplate(code: ReportTemplateCode): ReportTemplate | null {
  return REPORT_TEMPLATES[code] || null
}

/**
 * Get all available report templates
 */
export function getAllReportTemplates(): ReportTemplate[] {
  return Object.values(REPORT_TEMPLATES)
}

/**
 * Check if a template code is valid
 */
export function isValidTemplateCode(code: string): code is ReportTemplateCode {
  return code in REPORT_TEMPLATES
}

// Export types
export type {
  ReportTemplate,
  ReportTemplateCode,
  ReportTemplateFieldMapping,
  ReportTemplateSection,
  ReportTemplateSectionConfig,
  ReportTemplateLayoutMeta,
  MailtoTemplate,
} from './types'
