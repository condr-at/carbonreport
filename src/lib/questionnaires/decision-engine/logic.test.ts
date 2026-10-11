import assert from 'node:assert/strict'
import test from 'node:test'

import { AnswerMap } from './types'
import {
  UNKNOWN_ANSWER_CODE,
  hasMeaningfulAnswer,
  computeGroupVisibility,
  getVisibleQuestions,
  removeHiddenAnswers,
  areQuestionGroupsComplete,
  skipQuestionGroups,
  evaluateQuestionnaire,
  REPORT_DEFINITIONS,
} from './index'

test('hasMeaningfulAnswer treats UNKNOWN as empty', () => {
  assert.equal(hasMeaningfulAnswer(UNKNOWN_ANSWER_CODE), false)
  assert.equal(hasMeaningfulAnswer('EU'), true)
  assert.equal(hasMeaningfulAnswer([UNKNOWN_ANSWER_CODE]), false)
  assert.equal(hasMeaningfulAnswer(['CLIENT_EXISTING']), true)
})

test('computeGroupVisibility hides optional blocks until drivers present', () => {
  const baseAnswers: AnswerMap = {
    'Q0.1': null,
    'Q0.2': null,
    'Q0.3': null,
    'Q0.4': null,
    'Q0.5': null,
    'Q0.6': null,
    'Q1.1': ['UNKNOWN'],
  }

  const visibility = computeGroupVisibility(baseAnswers)
  assert.equal(visibility.regulator, false)
  assert.equal(visibility.client, false)
  assert.equal(visibility.operations, false)
  assert.equal(visibility.trade, false)
})

test('computeGroupVisibility enables regulator trade path for EU companies', () => {
  const answers: AnswerMap = {
    'Q0.1': 'EU',
    'Q0.2': null,
    'Q1.1': ['REGULATOR'],
  }

  const visibility = computeGroupVisibility(answers)
  assert.equal(visibility.regulator, true)
  assert.equal(visibility.operations, true)
  assert.equal(visibility.trade, true)
})

test('trade answers keep the block visible even without an operations driver', () => {
  const answers: AnswerMap = {
    'Q0.1': 'OTHER',
    'Q1.1': [UNKNOWN_ANSWER_CODE],
    'Q9.1': null,
    'Q9.2': null,
    'Q9.3': null,
  }

  const noTradeVisibility = computeGroupVisibility(answers)
  assert.equal(noTradeVisibility.trade, false)

  const withTradeAnswers: AnswerMap = {
    ...answers,
    'Q9.1': 'YES',
  }

  const tradeVisible = computeGroupVisibility(withTradeAnswers)
  assert.equal(tradeVisible.trade, true)
})

test('non-EU client suppliers can reach CBAM trade questions without implying legal applicability', () => {
  for (const initiators of [['CLIENT_EXISTING'], ['CLIENT_EXISTING', 'REGULATOR']]) {
    const answers: AnswerMap = {
      'Q0.1': 'OTHER', 'Q0.2': 'MANUFACTURING', 'Q1.1': initiators,
      'Q2.1': ['EU'], 'Q2.2': ['CBAM'],
    }
    const tradeQuestions = (input: AnswerMap) => getVisibleQuestions(input)
      .filter((question) => question.group === 'trade').map((question) => question.id)

    assert.equal(computeGroupVisibility(answers).trade, true)
    assert.deepEqual(tradeQuestions(answers), ['Q9.1'])
    assert.deepEqual(tradeQuestions({ ...answers, 'Q9.1': 'YES' }), ['Q9.1', 'Q9.2'])

    const supplier: AnswerMap = {
      ...answers, 'Q9.1': 'YES', 'Q9.2': ['CBAM_GOODS'], 'Q9.3': 'SUPPLIER_ONLY',
    }
    assert.deepEqual(tradeQuestions(supplier), ['Q9.1', 'Q9.2', 'Q9.3'])
    const result = evaluateQuestionnaire(removeHiddenAnswers(supplier))
    const packet = result.recommendedReports.find((report) => report.id === 'CBAM_DATA_PACKAGE')
    assert.equal(packet?.applicabilityReview?.status, 'required')
    assert.deepEqual(result.mandatoryReports, [])

    const noExports = removeHiddenAnswers({ ...supplier, 'Q9.1': 'NO' })
    assert.deepEqual(tradeQuestions(noExports), ['Q9.1'])
    assert.equal(noExports['Q9.2'], undefined)
    assert.equal(noExports['Q9.3'], undefined)
  }
})

test('manufacturing company can complete its profile without financial-sector assets', () => {
  const answers: AnswerMap = {
    'Q0.1': 'OTHER',
    'Q0.2': 'MANUFACTURING',
    'Q0.3': 'EMP_50_249',
    'Q0.4': 'REV_10_40M',
    'Q0.5': 'PRIVATE',
  }
  assert.equal(getVisibleQuestions(answers).some((question) => question.id === 'Q0.6'), false)
  assert.equal(areQuestionGroupsComplete(answers, ['profile']), true)

  const financeAnswers = { ...answers, 'Q0.2': 'FINANCE' }
  assert.equal(areQuestionGroupsComplete(financeAnswers, ['profile']), false)
  assert.equal(areQuestionGroupsComplete({ ...financeAnswers, 'Q0.6': 'AUM_<500M' }, ['profile']), true)
})

test('product client request requires only its own follow-up questions', () => {
  const answers: AnswerMap = {
    'Q1.1': ['CLIENT_EXISTING'],
    'Q3.1': ['PRODUCT_INFO'],
    'Q3.3': 'Aluminium profile',
    'Q3.3a': 'CERT_NOT_REQUIRED',
  }
  assert.deepEqual(
    getVisibleQuestions(answers).filter((question) => question.group === 'client').map((question) => question.id),
    ['Q3.1', 'Q3.3', 'Q3.3a'],
  )
  assert.equal(areQuestionGroupsComplete(answers, ['initiator', 'client']), true)
  assert.equal(areQuestionGroupsComplete({ ...answers, 'Q3.3': '' }, ['client']), false)
})

test('multiple client request types show the union of their follow-up questions', () => {
  const answers: AnswerMap = {
    'Q1.1': ['CLIENT_PROSPECT'],
    'Q3.1': ['COMPANY_INFO', 'UPSTREAM', 'CERTIFICATE', 'SCOPE3_DETAIL'],
  }
  assert.deepEqual(
    getVisibleQuestions(answers).filter((question) => question.group === 'client').map((question) => question.id),
    ['Q3.1', 'Q3.2', 'Q3.4', 'Q3.5', 'Q3.6'],
  )
})

test('switching branches removes stale answers including nested CBAM details', () => {
  const answers: AnswerMap = {
    'Q1.1': ['REGULATOR', 'CLIENT_EXISTING'],
    'Q2.1': ['UK'],
    'Q2.2': ['CBAM'],
    'Q2.2a': ['ALUMINUM'],
    'Q2.3': ['UK_SECR'],
    'Q3.1': ['PRODUCT_INFO'],
    'Q3.2': 'CDP',
    'Q3.3': 'Aluminium profile',
    'Q3.3a': 'CERT_NOT_REQUIRED',
    'Q3.6': ['PURCHASED_GOODS'],
  }
  const next = removeHiddenAnswers(answers)
  assert.equal(next['Q2.2'], undefined)
  assert.equal(next['Q2.2a'], undefined)
  assert.deepEqual(next['Q2.3'], ['UK_SECR'])
  assert.equal(next['Q3.2'], undefined)
  assert.equal(next['Q3.6'], undefined)
  assert.equal(next['Q3.3'], 'Aluminium profile')
  assert.equal(answers['Q3.2'], 'CDP', 'pruning must not mutate the previous answer map')
  const evaluation = evaluateQuestionnaire(next)
  const reports = [
    ...evaluation.mandatoryReports, ...evaluation.recommendedReports, ...evaluation.optionalReports,
  ].map((report) => report.id)
  assert.ok(reports.includes('PRODUCT_PCF'))
  assert.equal(reports.includes('CDP_DISCLOSURE'), false)
  assert.equal(reports.includes('SCOPE3_DETAILED'), false)
})

test('unknown client requirements do not reveal or require unrelated follow-ups', () => {
  const answers: AnswerMap = { 'Q1.1': ['CLIENT_EXISTING'], 'Q3.1': [UNKNOWN_ANSWER_CODE] }
  assert.deepEqual(
    getVisibleQuestions(answers).filter((question) => question.group === 'client').map((question) => question.id),
    ['Q3.1'],
  )
  assert.equal(areQuestionGroupsComplete(answers, ['client']), true)
})

test('sector questions follow the selected sector only', () => {
  for (const [sector, questionId] of [
    ['AVIATION', 'Q11.1'], ['MARITIME', 'Q11.2'], ['FINANCE', 'Q11.3'],
    ['CONSTRUCTION', 'Q11.4'], ['IT', 'Q11.5'],
  ]) {
    assert.deepEqual(
      getVisibleQuestions({ 'Q0.2': sector }).filter((question) => question.group === 'sector').map((question) => question.id),
      [questionId],
    )
  }
})

test('skipping a partly answered block preserves drivers, product details and later groups', () => {
  const answers: AnswerMap = {
    'Q1.1': ['CLIENT_EXISTING'],
    'Q3.1': ['PRODUCT_INFO'],
    'Q3.3': 'Aluminium profile',
  }
  const next = skipQuestionGroups(answers, ['initiator', 'client'])
  assert.deepEqual(next['Q1.1'], ['CLIENT_EXISTING'])
  assert.deepEqual(next['Q3.1'], ['PRODUCT_INFO'])
  assert.equal(next['Q3.3'], 'Aluminium profile')
  assert.equal(next['Q3.3a'], UNKNOWN_ANSWER_CODE)
  assert.equal(next['Q3.2'], undefined)
  assert.equal(computeGroupVisibility(next).operations, true)
  assert.equal(answers['Q3.3a'], undefined)
})


// Applicability is not established by the questionnaire's coarse profile fields.
function evaluatedReports(answers: AnswerMap) {
  const result = evaluateQuestionnaire(answers)
  return {
    result,
    reports: [...result.mandatoryReports, ...result.recommendedReports, ...result.optionalReports],
  }
}

test('old CSRD employee and revenue shortcuts no longer determine scope', () => {
  const { reports } = evaluatedReports({
    'Q0.1': 'EU', 'Q0.5': 'PUBLIC', 'Q0.3': 'EMP_250_499', 'Q0.4': 'REV_40_50M',
  })
  assert.equal(reports.some((report) => report.id === 'CSRD'), false)

  const candidate = evaluatedReports({
    'Q0.1': 'EU', 'Q0.5': 'PRIVATE', 'Q0.3': 'EMP_500+', 'Q0.4': 'REV_>50M',
  })
  const csrd = candidate.reports.find((report) => report.id === 'CSRD')
  assert.equal(csrd?.applicabilityReview?.status, 'required')
  assert.ok(csrd?.applicabilityReview?.checks.some((check) => /reporting year/i.test(check)))
  assert.equal(candidate.result.mandatoryReports.length, 0)
})

test('explicit CSRD request survives small-private profile and unknown inputs', () => {
  const profiles: AnswerMap[] = [
    { 'Q0.1': 'EU', 'Q0.5': 'PRIVATE', 'Q0.3': 'EMP_<50', 'Q0.4': 'REV_<10M' },
    { 'Q0.1': UNKNOWN_ANSWER_CODE, 'Q0.3': UNKNOWN_ANSWER_CODE },
  ]
  for (const profile of profiles) {
    const { result, reports } = evaluatedReports({ ...profile, 'Q2.2': ['CSRD'] })
    assert.equal(reports.find((report) => report.id === 'CSRD')?.applicabilityReview?.status, 'required')
    assert.equal(result.suppressedReports.includes('CSRD'), false)
    assert.equal(result.mandatoryReports.length, 0)
  }
})

test('CBAM supplier and planned export do not become importer filing or certificate duties', () => {
  for (const tradeStatus of ['YES', 'PLANNED']) {
    const { result, reports } = evaluatedReports({
      'Q9.1': tradeStatus, 'Q9.2': ['CBAM_GOODS'], 'Q9.3': 'SUPPLIER_ONLY',
    })
    assert.equal(result.mandatoryReports.length, 0)
    assert.equal(reports.some((report) => ['CBAM_REPORT', 'CBAM_ALLOWANCES'].includes(report.id)), false)
    const summary = reports.find((report) => report.id === 'CBAM')
    assert.equal(summary?.applicabilityReview?.status, 'required')
    assert.ok(summary?.applicabilityReview?.checks.some((check) => /electricity or hydrogen/.test(check)))
    if (tradeStatus === 'YES') {
      const supplier = reports.find((report) => report.id === 'CBAM_DATA_PACKAGE')
      assert.equal(supplier?.definition.category, 'CLIENT')
      assert.equal(supplier?.definition.frequency, 'ON_DEMAND')
    }
  }
})

test('no-export answer does not suppress a CBAM importer or an explicit CBAM request', () => {
  const { result, reports } = evaluatedReports({
    'Q0.1': 'EU', 'Q9.1': 'NO', 'Q9.3': 'IMPORTER_OF_RECORD', 'Q2.2': ['CBAM'],
  })
  for (const id of ['CBAM', 'CBAM_REPORT', 'CBAM_ALLOWANCES']) {
    assert.equal(reports.find((report) => report.id === id)?.applicabilityReview?.status, 'required')
    assert.equal(result.suppressedReports.includes(id), false)
  }
  assert.equal(result.mandatoryReports.length, 0)
  assert.ok(result.warnings.some((warning) => warning.code === 'CBAM_TRADE_ROLE_REVIEW'))
})

test('CBAM period and certificate terms remain explicit when the questionnaire has no reporting year', () => {
  const { reports } = evaluatedReports({ 'Q9.3': 'IMPORTER_OF_RECORD' })
  const filing = reports.find((report) => report.id === 'CBAM_REPORT')
  assert.equal(filing?.definition.frequency, 'ANNUAL')
  assert.match(filing?.definition.notes ?? '', /2023–2025/)
  assert.match(filing?.definition.notes ?? '', /30\.09\.2027/)
  assert.ok(filing?.applicabilityReview?.checks.some((check) => /through 2025; annual declarations from 2026/.test(check)))
  const ledger = reports.find((report) => report.id === 'CBAM_ALLOWANCES')
  assert.equal(ledger?.definition.category, 'INTERNAL')
  assert.match(ledger?.definition.summary ?? '', /не EU ETS allowances/)
  assert.match(ledger?.definition.notes ?? '', /01\.02\.2027/)
})

test('stayed SEC rule remains an optional review, including explicit regulator requests', () => {
  const cases: AnswerMap[] = [{ 'Q6.1': ['NYSE_NASDAQ'] }, { 'Q2.4': ['SEC_CLIMATE'] }]
  for (const answers of cases) {
    const { result, reports } = evaluatedReports(answers)
    const sec = reports.find((report) => report.id === 'SEC_CLIMATE')
    assert.equal(sec?.applicabilityReview?.status, 'required')
    assert.equal(sec?.priorityLevel, 'MEDIUM')
    assert.ok(result.optionalReports.some((report) => report.id === 'SEC_CLIMATE'))
    assert.equal(result.mandatoryReports.length, 0)
    assert.equal(sec?.definition.scopes.scope3, 'not_applicable')
    assert.match(sec?.applicabilityReview?.reason ?? '', /stayed.*not a final repeal/)
  }
})

test('SFDR review is independent of the arbitrary AUM bands', () => {
  for (const aum of ['AUM_<500M', 'AUM_500M_1B', 'AUM_>1B', UNKNOWN_ANSWER_CODE]) {
    const { result, reports } = evaluatedReports({
      'Q0.1': 'EU', 'Q0.2': 'FINANCE', 'Q0.6': aum, 'Q11.3': ['FUNDS'],
    })
    const sfdr = reports.find((report) => report.id === 'SFDR')
    assert.equal(sfdr?.applicabilityReview?.status, 'required')
    assert.ok(sfdr?.sourceRules.includes('R8_SFDR'))
    assert.equal(sfdr?.tags?.includes('REGULATORY_MANDATORY'), false)
    assert.equal(result.mandatoryReports.length, 0)
  }
})

test('UK unquoted and small listed candidates require scope review instead of a public-only exemption', () => {
  const profiles: AnswerMap[] = [
    { 'Q0.1': 'UK', 'Q0.5': 'PRIVATE', 'Q0.3': 'EMP_500+' },
    { 'Q0.1': 'UK', 'Q0.5': 'PUBLIC', 'Q0.3': 'EMP_<50' },
    { 'Q2.3': ['UK_SECR'] },
  ]
  for (const profile of profiles) {
    const { result, reports } = evaluatedReports(profile)
    assert.equal(reports.find((report) => report.id === 'UK_SECR')?.applicabilityReview?.status, 'required')
    assert.equal(result.mandatoryReports.length, 0)
  }
})

test('listing and sector signals retain period-specific checks and never prove mandatory scope', () => {
  const cases: [AnswerMap, string, RegExp][] = [
    [{ 'Q6.1': ['LSE'] }, 'UK_TCFD', /2027/],
    [{ 'Q6.1': ['HKEX'] }, 'HKEX_ESG', /Reporting year/],
    [{ 'Q0.2': 'AVIATION', 'Q11.1': 'INTERNATIONAL' }, 'CORSIA', /2024–2026.*2027–2035/],
    [{ 'Q0.2': 'MARITIME', 'Q11.2': 'EU_PORTS' }, 'EU_MRV', /Reporting year/],
    [{ 'Q2.2': ['EU_ETS'] }, 'EU_ETS', /Reporting year/],
  ]
  for (const [answers, id, periodCheck] of cases) {
    const { result, reports } = evaluatedReports(answers)
    const report = reports.find((candidate) => candidate.id === id)
    assert.equal(report?.applicabilityReview?.status, 'required', id)
    assert.ok(report?.applicabilityReview?.checks.some((check) => periodCheck.test(check)), id)
    assert.equal(report?.tags?.includes('REGULATORY_MANDATORY'), false, id)
    assert.equal(result.mandatoryReports.length, 0, id)
    assert.equal(report?.priorityLevel, 'HIGH', id)
  }
})

test('ambiguous EPD and neutrality requests require output review without promising certification', () => {
  const epd = evaluatedReports({ 'Q3.1': ['PRODUCT_INFO'], 'Q3.3a': 'CERT_REQUIRED' })
    .reports.find((report) => report.id === 'EPD_OR_ISO_14067')
  assert.equal(epd?.applicabilityReview?.status, 'required')
  assert.match(epd?.applicabilityReview?.reason ?? '', /carbon footprint or.*EPD/)
  assert.notEqual(epd?.definition.verificationLevel, 'MANDATORY')
  assert.equal(REPORT_DEFINITIONS.CARBON_NEUTRAL_CERT.applicabilityReview?.status, 'required')
  assert.doesNotMatch(REPORT_DEFINITIONS.CARBON_NEUTRAL_CERT.name, /PAS 2060|сертификат/i)
  assert.doesNotMatch(REPORT_DEFINITIONS.ISO_14064_CERT.name, /сертификация/i)
})

test('missing or unknown answers do not create a mandatory conclusion or an exemption', () => {
  const cases: AnswerMap[] = [{}, { 'Q0.1': UNKNOWN_ANSWER_CODE, 'Q0.2': UNKNOWN_ANSWER_CODE, 'Q2.2': [UNKNOWN_ANSWER_CODE] }]
  for (const answers of cases) {
    const result = evaluateQuestionnaire(answers)
    assert.deepEqual(result.mandatoryReports, [])
    assert.deepEqual(result.suppressedReports, [])
  }
})
