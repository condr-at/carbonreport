import type { ReportTemplateCode } from '@/lib/report-templates/types'
import type { EvaluationResult } from '@/lib/questionnaires/decision-engine'

export const ENGINE_TO_TEMPLATE_MAP: Record<string, ReportTemplateCode> = {
  CSRD: 'CSRD',
  EU_ETS: 'EU_ETS',
  CBAM: 'CBAM',
  UK_SECR: 'UK_SECR',
  SEC_CLIMATE: 'SEC_CLIMATE',
  CORSIA: 'CORSIA',
  EU_MRV: 'EU_MRV',
  SFDR: 'SFDR',
  UK_TCFD: 'UK_TCFD',
  HKEX_ESG: 'HKEX_ESG',
  ISO_14064_CERT: 'ISO14064',
  CDP_DISCLOSURE: 'CDP',
  CORP_GHG: 'CORP_GHG',
  CORP_GHG_VERIFIED: 'CORP_GHG',
  CORP_GHG_SIMPLIFIED: 'CORP_GHG',
  CORP_GHG_ANNUAL: 'CORP_GHG',
  CORP_GHG_PUBLIC: 'CORP_GHG',
  CORP_GHG_INTERNAL: 'CORP_GHG',
  ECOVADIS_SCORE: 'ECOVADIS',
  EPD_OR_ISO_14067: 'ISO14067',
  PRODUCT_PCF: 'ISO14067',
  CLIENT_SCOPE3_PACKAGE: 'SCOPE3_PACKAGE',
  CLIENT_TEMPLATE_FILL: 'CLIENT_TEMPLATE',
  SCOPE3_DETAILED: 'SCOPE3_DETAILED',
  CARBON_NEUTRAL_CERT: 'CARBON_NEUTRAL',
  TCFD_REPORT: 'TCFD',
}

export function mapEngineReportIdToTemplateCode(reportId: string): ReportTemplateCode | null {
  return ENGINE_TO_TEMPLATE_MAP[reportId] ?? null
}

export function deriveTemplateCodesFromEvaluation(result: EvaluationResult): ReportTemplateCode[] {
  const codes = new Set<ReportTemplateCode>()
  const allReports = [...result.mandatoryReports, ...result.recommendedReports, ...result.optionalReports]

  allReports.forEach((report) => {
    const mapped = mapEngineReportIdToTemplateCode(report.id)
    if (mapped) {
      codes.add(mapped)
    }
  })

  return Array.from(codes)
}
