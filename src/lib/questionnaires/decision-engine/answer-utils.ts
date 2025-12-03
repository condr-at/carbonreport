import { AnswerValue } from './types'
import { UNKNOWN_ANSWER_CODE } from './constants'

export function sanitizeSingleSelectAnswer(value: AnswerValue): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed || trimmed === UNKNOWN_ANSWER_CODE) {
    return null
  }
  return trimmed
}

export function sanitizeMultiSelectAnswer(value: AnswerValue): string[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is string => typeof item === 'string' && item.length > 0)
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && item !== UNKNOWN_ANSWER_CODE)
}

export function hasMeaningfulAnswer(value: AnswerValue): boolean {
  if (Array.isArray(value)) {
    return sanitizeMultiSelectAnswer(value).length > 0
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 && trimmed !== UNKNOWN_ANSWER_CODE
  }
  return false
}
