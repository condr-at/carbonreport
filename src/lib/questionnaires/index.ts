import { Questionnaire } from './types'
import { QuestionnaireV1 } from './v1'

/**
 * Questionnaires Registry
 * 
 * Central registry of all available questionnaires.
 * Currently only v1 is available, but this allows for future versions.
 */

export const QUESTIONNAIRES: Record<string, Questionnaire> = {
  'v1': QuestionnaireV1,
}

/**
 * Get the current active questionnaire
 * (In the future, this could be configurable per project or user preference)
 */
export function getCurrentQuestionnaire(): Questionnaire {
  return QuestionnaireV1
}

/**
 * Get a questionnaire by version
 */
export function getQuestionnaire(version: string): Questionnaire | null {
  return QUESTIONNAIRES[version] || null
}

/**
 * Get all available questionnaire versions
 */
export function getAllQuestionnaireVersions(): string[] {
  return Object.keys(QUESTIONNAIRES)
}

// Export types and questionnaires
export type { Questionnaire, Question, QuestionType } from './types'
export { QuestionnaireV1 }
