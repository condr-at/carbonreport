import { AnswerMap, AnswerValue, QuestionDefinition, QuestionGroup } from './types'
import { QUESTION_DEFINITIONS, QUESTION_INDEX } from './questions'
import { computeGroupVisibility } from './block-visibility'
import { hasMeaningfulAnswer, sanitizeMultiSelectAnswer, sanitizeSingleSelectAnswer } from './answer-utils'
import { UNKNOWN_ANSWER_CODE } from './constants'

interface QuestionCondition {
  questionId: string
  values: string[]
}

// Follow the existing questionnaire branches; report recommendation rules remain unchanged.
const QUESTION_CONDITIONS: Record<string, QuestionCondition> = {
  'Q0.6': { questionId: 'Q0.2', values: ['FINANCE'] },
  'Q2.2': { questionId: 'Q2.1', values: ['EU'] },
  'Q2.2a': { questionId: 'Q2.2', values: ['CBAM'] },
  'Q2.3': { questionId: 'Q2.1', values: ['UK'] },
  'Q2.4': { questionId: 'Q2.1', values: ['US'] },
  'Q2.5': { questionId: 'Q2.1', values: ['RU'] },
  'Q3.2': { questionId: 'Q3.1', values: ['COMPANY_INFO'] },
  'Q3.3': { questionId: 'Q3.1', values: ['PRODUCT_INFO'] },
  'Q3.3a': { questionId: 'Q3.1', values: ['PRODUCT_INFO'] },
  'Q3.4': { questionId: 'Q3.1', values: ['UPSTREAM'] },
  'Q3.5': { questionId: 'Q3.1', values: ['CERTIFICATE'] },
  'Q3.6': { questionId: 'Q3.1', values: ['SCOPE3_DETAIL'] },
  'Q7.2': { questionId: 'Q7.1', values: ['UNDERSTAND_FOOTPRINT'] },
  'Q7.2a': { questionId: 'Q7.2', values: ['FIRST_TIME_NO_VERIF', 'FIRST_TIME_WITH_VERIF'] },
  'Q7.3': { questionId: 'Q7.1', values: ['PREPARE_FOR_REGULATION'] },
  'Q7.4': { questionId: 'Q7.1', values: ['SET_TARGETS'] },
  'Q7.5': { questionId: 'Q7.1', values: ['REPUTATION'] },
  'Q7.5a': { questionId: 'Q7.1', values: ['REPUTATION'] },
  'Q7.6': { questionId: 'Q7.1', values: ['TENDERS'] },
  'Q9.2': { questionId: 'Q9.1', values: ['YES', 'PLANNED'] },
  'Q9.3': { questionId: 'Q9.2', values: ['CBAM_GOODS'] },
  'Q11.1': { questionId: 'Q0.2', values: ['AVIATION'] },
  'Q11.2': { questionId: 'Q0.2', values: ['MARITIME'] },
  'Q11.3': { questionId: 'Q0.2', values: ['FINANCE'] },
  'Q11.4': { questionId: 'Q0.2', values: ['CONSTRUCTION'] },
  'Q11.5': { questionId: 'Q0.2', values: ['IT'] },
}

export function getVisibleQuestions(answers: AnswerMap): QuestionDefinition[] {
  const groupVisibility = computeGroupVisibility(answers)
  const isVisible = (question: QuestionDefinition): boolean => {
    if (!groupVisibility[question.group]) return false
    const condition = QUESTION_CONDITIONS[question.id]
    if (!condition) return true
    const parent = QUESTION_INDEX[condition.questionId]
    if (!parent || !isVisible(parent)) return false
    const value = answers[condition.questionId]
    const selected = Array.isArray(value)
      ? sanitizeMultiSelectAnswer(value)
      : [sanitizeSingleSelectAnswer(value)]
    return condition.values.some((candidate) => selected.includes(candidate))
  }

  return QUESTION_DEFINITIONS.filter(isVisible)
}

export function removeHiddenAnswers(answers: AnswerMap): AnswerMap {
  const visibleIds = new Set(getVisibleQuestions(answers).map((question) => question.id))
  const next = { ...answers }
  for (const question of QUESTION_DEFINITIONS) {
    if (!visibleIds.has(question.id)) delete next[question.id]
  }
  return next
}

export function hasProgressAnswer(value: AnswerValue): boolean {
  if (hasMeaningfulAnswer(value)) return true
  return Array.isArray(value)
    ? value.some((item) => typeof item === 'string' && item.trim() === UNKNOWN_ANSWER_CODE)
    : typeof value === 'string' && value.trim() === UNKNOWN_ANSWER_CODE
}

export function areQuestionGroupsComplete(answers: AnswerMap, groups: QuestionGroup[]): boolean {
  return getVisibleQuestions(answers)
    .filter((question) => groups.includes(question.group))
    .every((question) => hasProgressAnswer(answers[question.id]))
}

export function skipQuestionGroups(answers: AnswerMap, groups: QuestionGroup[]): AnswerMap {
  const next = { ...answers }
  for (const question of getVisibleQuestions(answers)) {
    if (!groups.includes(question.group) || hasProgressAnswer(answers[question.id])) continue
    // Free text has no "I don't know" option: keep it blank rather than inventing an answer.
    if (question.type === 'free-text') continue
    next[question.id] = question.type === 'multi' ? [UNKNOWN_ANSWER_CODE] : UNKNOWN_ANSWER_CODE
  }
  return next
}
