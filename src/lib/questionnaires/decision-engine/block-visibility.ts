import { AnswerMap, QuestionGroup } from './types'
import { sanitizeMultiSelectAnswer, sanitizeSingleSelectAnswer, hasMeaningfulAnswer } from './answer-utils'

const OPERATIONS_DRIVERS = new Set([
  'REGULATOR',
  'CLIENT_EXISTING',
  'CLIENT_PROSPECT',
  'BANK_INVESTOR',
  'PROGRAM',
  'INTERNAL_TOP',
  'INTERNAL_OTHER',
])

const CLIENT_DRIVERS = new Set(['CLIENT_EXISTING', 'CLIENT_PROSPECT'])
const INTERNAL_DRIVERS = new Set(['INTERNAL_TOP', 'INTERNAL_OTHER'])
const TRADE_REGIONS = new Set(['EU', 'UK', 'US'])
const SECTOR_SPECIFIC_CODES = new Set(['AVIATION', 'MARITIME', 'FINANCE', 'CONSTRUCTION', 'IT'])

export type GroupVisibilityMap = Record<QuestionGroup, boolean>

export function computeGroupVisibility(answers: AnswerMap): GroupVisibilityMap {
  const initiators = new Set(sanitizeMultiSelectAnswer(answers['Q1.1']))
  const country = sanitizeSingleSelectAnswer(answers['Q0.1'])
  const sector = sanitizeSingleSelectAnswer(answers['Q0.2'])

  const regulatorSelected = initiators.has('REGULATOR')
  const exchangeSelected = initiators.has('EXCHANGE')
  const clientSelected = intersects(initiators, CLIENT_DRIVERS)
  const financialSelected = initiators.has('BANK_INVESTOR')
  const programSelected = initiators.has('PROGRAM')
  const internalSelected = intersects(initiators, INTERNAL_DRIVERS)
  const operationsEnabled = intersects(initiators, OPERATIONS_DRIVERS)
  const regulatorInTradeRegion = regulatorSelected && !!country && TRADE_REGIONS.has(country)
  const tradeAnswersExist =
    hasMeaningfulAnswer(answers['Q9.1']) ||
    hasMeaningfulAnswer(answers['Q9.2']) ||
    hasMeaningfulAnswer(answers['Q9.3'])

  return {
    profile: true,
    initiator: true,
    regulator: regulatorSelected || exchangeSelected,
    client: clientSelected,
    financial: financialSelected,
    program: programSelected,
    exchange: exchangeSelected,
    internal: internalSelected,
    operations: operationsEnabled,
    trade: (operationsEnabled && regulatorInTradeRegion) || tradeAnswersExist,
    constraints: true,
    sector: !!sector && SECTOR_SPECIFIC_CODES.has(sector),
  }
}

function intersects(source: Set<string>, targets: Set<string>): boolean {
  for (const value of targets) {
    if (source.has(value)) return true
  }
  return false
}
