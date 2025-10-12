/**
 * Questionnaire Types
 * 
 * Defines the structure for project initialization questionnaires
 */

export type QuestionType = 'text' | 'number' | 'boolean' | 'select' | 'multiselect' | 'textarea'

export interface QuestionOption {
  value: string
  label: string
}

export interface Question {
  id: string
  text: string
  type: QuestionType
  required: boolean
  options?: QuestionOption[]
  placeholder?: string
  hint?: string
  mapsTo: string[] // Array of dataset field IDs this question populates
}

export interface MappingRule {
  field_id: string
  transform: 'string' | 'number' | 'boolean' | 'array' | 'json'
  defaultValue?: any
}

export interface Questionnaire {
  version: string
  name: string
  description: string
  questions: Question[]
  mappingRules: Record<string, MappingRule>
}
