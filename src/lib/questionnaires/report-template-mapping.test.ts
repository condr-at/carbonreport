import assert from 'node:assert/strict'
import test from 'node:test'
import { getReportTemplate } from '../report-templates'
import { REPORT_DEFINITIONS } from './decision-engine/reports'
import type { EvaluationResult, ResolvedReport } from './decision-engine/types'
import {
  deriveTemplateCodesFromEvaluation,
  deriveTemplateSelection,
  isSelectableReportTemplate,
  mapEngineReportIdToTemplateCode,
  mapEngineReportIdToTemplateCodes,
} from './report-template-mapping'

function report(id: string): ResolvedReport {
  const definition = REPORT_DEFINITIONS[id]
  assert.ok(definition, id)
  return { id, definition, priorityLevel: definition.priorityLevel, sourceRules: ['test'], priorityScore: 1 }
}

function evaluation(overrides: Partial<EvaluationResult> = {}): EvaluationResult {
  return { mandatoryReports: [], recommendedReports: [], optionalReports: [], warnings: [], suppressedReports: [], ...overrides }
}

test('every engine output resolves to selectable registered templates', () => {
  for (const id of Object.keys(REPORT_DEFINITIONS)) {
    const codes = mapEngineReportIdToTemplateCodes(id)
    assert.ok(codes.length > 0, `${id} has no template`)
    for (const code of codes) {
      assert.ok(getReportTemplate(code), `${id} points to missing ${code}`)
      assert.ok(isSelectableReportTemplate(code), `${id} points to hidden ${code}`)
    }
  }
  assert.deepEqual(mapEngineReportIdToTemplateCodes('NOT_A_REPORT'), [])
  assert.deepEqual(mapEngineReportIdToTemplateCodes('toString'), [])
})

test('exact report variants keep their identity instead of collapsing into another report', () => {
  for (const id of ['CORP_GHG_VERIFIED', 'CORP_GHG_ANNUAL', 'CORP_GHG_PUBLIC', 'CORP_GHG_INTERNAL', 'CORP_GHG_SIMPLIFIED', 'PRODUCT_PCF']) {
    assert.equal(mapEngineReportIdToTemplateCode(id), id)
  }
  for (const id of ['ISO_14064_CERT', 'CDP_DISCLOSURE', 'ECOVADIS_SCORE', 'CLIENT_SCOPE3_PACKAGE', 'CLIENT_TEMPLATE_FILL', 'CARBON_NEUTRAL_CERT', 'TCFD_REPORT']) {
    assert.equal(mapEngineReportIdToTemplateCode(id), id)
  }
})

test('combined recommendations offer distinct alternatives without choosing either for the user', () => {
  const result = evaluation({ recommendedReports: [report('EPD_OR_ISO_14067'), report('RECS_OR_PPA_STRATEGY')] })
  const selection = deriveTemplateSelection(result)
  assert.deepEqual(new Set(Object.keys(selection.recommendations)), new Set(['EPD', 'ISO14067', 'RECS_STRATEGY', 'PPA_STRATEGY']))
  assert.deepEqual(selection.initiallySelected, [])
  assert.equal(mapEngineReportIdToTemplateCode('EPD_OR_ISO_14067'), null)
  assert.equal(mapEngineReportIdToTemplateCode('RECS_OR_PPA_STRATEGY'), null)
  assert.ok(selection.recommendations.EPD?.reasons.some((reason) => reason.includes('different deliverables')))
})

test('optional reports remain available but are not silently preselected', () => {
  const result = evaluation({ recommendedReports: [report('CORP_GHG')], optionalReports: [report('SCOPE3_DETAILED')] })
  const selection = deriveTemplateSelection(result, 'corporate')
  assert.deepEqual(selection.initiallySelected, ['CORP_GHG'])
  assert.equal(selection.recommendations.SCOPE3_DETAILED?.level, 'optional')
  assert.deepEqual(deriveTemplateCodesFromEvaluation(result, 'corporate'), ['CORP_GHG'])
})

test('a legacy cached mandatory result cannot bypass current applicability review', () => {
  const legacy = report('CSRD')
  legacy.definition = { ...legacy.definition, applicabilityReview: undefined }
  legacy.priorityLevel = 'CRITICAL'
  const selection = deriveTemplateSelection(evaluation({ mandatoryReports: [legacy] }), 'corporate')
  assert.equal(selection.recommendations.CSRD?.level, 'review')
  assert.ok(selection.recommendations.CSRD?.reasons.length)
  assert.ok(selection.recommendations.CSRD?.checks.length)
  assert.deepEqual(selection.initiallySelected, [])
})

test('selection and badges exclude templates hidden by project scope', () => {
  const result = evaluation({ recommendedReports: [report('PRODUCT_PCF'), report('CORP_GHG'), report('CSRD')] })
  const product = deriveTemplateSelection(result, 'product')
  assert.deepEqual(product.initiallySelected, ['PRODUCT_PCF'])
  assert.equal(product.recommendations.CORP_GHG, undefined)
  assert.equal(product.recommendations.CSRD, undefined)
  const corporate = deriveTemplateSelection(result, 'corporate')
  assert.equal(corporate.recommendations.PRODUCT_PCF, undefined)
  assert.ok(corporate.recommendations.CORP_GHG)
  assert.equal(isSelectableReportTemplate('ISO14064', 'corporate'), false)
  assert.equal(isSelectableReportTemplate('PRODUCT_PCF', 'corporate'), false)
})

test('repeated reasons for one template do not create duplicate selected codes', () => {
  const result = evaluation({ recommendedReports: [report('CORP_GHG'), report('CORP_GHG')], optionalReports: [report('CORP_GHG')] })
  const selection = deriveTemplateSelection(result, 'corporate')
  assert.deepEqual(selection.initiallySelected, ['CORP_GHG'])
  assert.equal(selection.recommendations.CORP_GHG?.level, 'recommended')
})
