import { getReportTemplate, isValidTemplateCode } from '@/lib/report-templates'
import { isUserFacingReportTemplate } from '@/lib/report-templates/user-facing'
import type { ProjectScope, ReportTemplateCode } from '@/lib/report-templates/types'
import { REPORT_DEFINITIONS } from '@/lib/questionnaires/decision-engine/reports'
import type { EvaluationResult, ResolvedReport } from '@/lib/questionnaires/decision-engine/types'

// A combined engine recommendation is a choice, not an alias for either output.
// All other registered IDs retain their exact code, including GHG variants.
export const ENGINE_TO_TEMPLATE_MAP: Record<string, readonly ReportTemplateCode[]> = {
  ...Object.fromEntries(
    Object.keys(REPORT_DEFINITIONS)
      .filter(isValidTemplateCode)
      .map((code) => [code, [code]]),
  ),
  EPD_OR_ISO_14067: ['EPD', 'ISO14067'],
  RECS_OR_PPA_STRATEGY: ['RECS_STRATEGY', 'PPA_STRATEGY'],
}

const FORMAT_CHOICES: Record<string, string> = {
  EPD_OR_ISO_14067: 'Confirm whether your recipient needs an EPD or an ISO 14067 product footprint. They are different deliverables.',
  RECS_OR_PPA_STRATEGY: 'Choose a certificate strategy, a power purchase agreement strategy, or both for your procurement needs.',
}

export function mapEngineReportIdToTemplateCodes(reportId: string): readonly ReportTemplateCode[] {
  return Object.hasOwn(ENGINE_TO_TEMPLATE_MAP, reportId) ? ENGINE_TO_TEMPLATE_MAP[reportId] : []
}

// Retained for callers expecting an unambiguous single result.
export function mapEngineReportIdToTemplateCode(reportId: string): ReportTemplateCode | null {
  const codes = mapEngineReportIdToTemplateCodes(reportId)
  return codes.length === 1 ? codes[0] : null
}

export function isSelectableReportTemplate(code: string, scope?: ProjectScope | null): code is ReportTemplateCode {
  if (!isValidTemplateCode(code) || !isUserFacingReportTemplate(code)) return false
  const template = getReportTemplate(code)
  return Boolean(template && (!scope || scope === 'both' || template.scope === 'both' || template.scope === scope))
}

export type TemplateRecommendationLevel = 'mandatory' | 'review' | 'recommended' | 'choice' | 'optional'

export interface TemplateRecommendation {
  level: TemplateRecommendationLevel
  reasons: string[]
  checks: string[]
}

export interface TemplateSelection {
  recommendations: Partial<Record<ReportTemplateCode, TemplateRecommendation>>
  initiallySelected: ReportTemplateCode[]
}

const LEVEL_ORDER: Record<TemplateRecommendationLevel, number> = {
  review: 5,
  mandatory: 4,
  recommended: 3,
  choice: 2,
  optional: 1,
}

/** Resolve presentation and selection together, so hidden or optional reports are not submitted. */
export function deriveTemplateSelection(result: EvaluationResult, scope?: ProjectScope | null): TemplateSelection {
  const recommendations: TemplateSelection['recommendations'] = {}
  const groups: [TemplateRecommendationLevel, ResolvedReport[]][] = [
    ['mandatory', result.mandatoryReports],
    ['recommended', result.recommendedReports],
    ['optional', result.optionalReports],
  ]

  for (const [group, reports] of groups) {
    if (!Array.isArray(reports)) continue
    for (const report of reports) {
      if (!report || typeof report.id !== 'string') continue
      const codes = mapEngineReportIdToTemplateCodes(report.id)
      // A saved evaluation can predate the current applicability safeguards.
      const review = REPORT_DEFINITIONS[report.id]?.applicabilityReview ?? report.applicabilityReview
      const choice = FORMAT_CHOICES[report.id]
      const level = review ? 'review' : choice ? 'choice' : group
      const reasons = [review?.reason, choice].filter((reason): reason is string => Boolean(reason))

      for (const code of codes) {
        if (!isSelectableReportTemplate(code, scope)) continue
        const previous = recommendations[code]
        recommendations[code] = {
          level: previous && LEVEL_ORDER[previous.level] > LEVEL_ORDER[level] ? previous.level : level,
          reasons: [...new Set([...(previous?.reasons ?? []), ...reasons])],
          checks: [...new Set([...(previous?.checks ?? []), ...(review?.checks ?? [])])],
        }
      }
    }
  }

  const initiallySelected = (Object.keys(recommendations) as ReportTemplateCode[]).filter((code) => {
    const level = recommendations[code]?.level
    return level === 'mandatory' || level === 'recommended'
  })
  return { recommendations, initiallySelected }
}

export function deriveTemplateCodesFromEvaluation(result: EvaluationResult, scope?: ProjectScope | null): ReportTemplateCode[] {
  return deriveTemplateSelection(result, scope).initiallySelected
}
