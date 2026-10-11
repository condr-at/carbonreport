import { QUESTION_DEFINITIONS, QUESTION_INDEX } from './questions'
import { REPORT_DEFINITIONS } from './reports'
import { RULES } from './rules'
import { VALIDATION_RULES } from './validation-rules'
import { sanitizeMultiSelectAnswer, sanitizeSingleSelectAnswer } from './answer-utils'
import {
  AnswerMap,
  EvaluationResult,
  PriorityLevel,
  Predicate,
  ResolvedReport,
  ReportDefinition,
  WarningMessage,
} from './types'

interface ReportMeta {
  sourceRules: Set<string>
  notes: Set<string>
  tags: Set<string>
  priorityOverride?: PriorityLevel
}

const PRIORITY_BASE: Record<PriorityLevel, number> = {
  CRITICAL: 100,
  HIGH: 70,
  MEDIUM: 45,
  LOW: 20,
}

const CATEGORY_BONUS = {
  REGULATORY: 10,
  CLIENT: 6,
  FINANCIAL: 6,
  PROGRAM: 4,
  INTERNAL: 2,
  PRODUCT: 5,
  SECTOR: 3,
  DATA: 2,
}

const CLIENT_CODES = new Set(['CLIENT_EXISTING', 'CLIENT_PROSPECT'])
const INTERNAL_CODES = new Set(['INTERNAL_TOP', 'INTERNAL_OTHER'])

export function evaluateQuestionnaire(rawAnswers: AnswerMap): EvaluationResult {
  const answers = normalizeAnswers(rawAnswers)
  const selection = new Map<string, ReportMeta>()
  const globalNotes = new Set<string>()

  // Step 1: apply rules
  for (const rule of RULES) {
    const currentSelected = new Set(selection.keys())
    if (!evaluateConditions(rule.conditions, answers, currentSelected)) continue

    if (rule.outputs.reports && rule.outputs.reports.length > 0) {
      for (const reportId of rule.outputs.reports) {
        if (!reportId) continue
        const entry = selection.get(reportId) ?? {
          sourceRules: new Set<string>(),
          notes: new Set<string>(),
          tags: new Set<string>(),
        }
        entry.sourceRules.add(rule.id)
        rule.outputs.notes?.forEach((note) => entry.notes.add(note))
        rule.outputs.tags?.forEach((tag) => entry.tags.add(tag))
        if (rule.outputs.priorityOverride) {
          entry.priorityOverride = rule.outputs.priorityOverride
        }
        selection.set(reportId, entry)
      }
    } else if (rule.outputs.notes) {
      rule.outputs.notes.forEach((note) => globalNotes.add(note))
    }
  }

  const selectedSet = new Set(selection.keys())
  const warnings: WarningMessage[] = []
  const forbidden = new Set<string>()
  const downgraded = new Map<string, PriorityLevel | 'AUTO'>()

  // Step 2: validations
  for (const validation of VALIDATION_RULES) {
    if (!evaluateConditions(validation.conditions, answers, selectedSet)) continue
    for (const effect of validation.effects) {
      switch (effect.type) {
        case 'forbid-report':
          forbidden.add(effect.reportId)
          break
        case 'downgrade-priority':
          downgraded.set(effect.reportId, effect.to ?? 'AUTO')
          break
        case 'add-warning':
          warnings.push({
            code: effect.warningCode,
            message: effect.message ?? effect.warningCode,
          })
          break
        default:
          break
      }
    }
  }

  const suppressedReports: string[] = []
  for (const reportId of forbidden) {
    if (selection.has(reportId)) {
      suppressedReports.push(reportId)
      selection.delete(reportId)
      selectedSet.delete(reportId)
    }
  }

  // Step 3: resolve reports
  const resolved: ResolvedReport[] = []
  const initiators = new Set(getAnswerArray('Q1.1', answers))
  for (const [reportId, meta] of selection) {
    const definition = REPORT_DEFINITIONS[reportId]
    if (!definition) continue

    let priorityLevel = meta.priorityOverride ?? definition.priorityLevel
    if (downgraded.has(reportId)) {
      const target = downgraded.get(reportId)
      priorityLevel = target === 'AUTO' ? downgradePriorityLevel(priorityLevel) : target ?? priorityLevel
    }

    // The questionnaire does not establish legal scope or validate an external
    // certification. Keep the existing recommendation buckets, but never label
    // an unresolved review as mandatory (including rules merged from sectors).
    const applicabilityReview = definition.applicabilityReview
    if (applicabilityReview) {
      meta.tags.delete('REGULATORY_MANDATORY')
      meta.tags.add('APPLICABILITY_REVIEW')
      if (priorityLevel === 'CRITICAL') priorityLevel = 'HIGH'
    }

    const priorityScore = computePriorityScore({
      reportId,
      definition,
      priorityLevel,
      initiators,
      warningCount: warnings.length,
      globalNotes,
    })

    resolved.push({
      id: reportId,
      definition,
      priorityLevel,
      sourceRules: Array.from(meta.sourceRules),
      notes: meta.notes.size ? Array.from(meta.notes) : undefined,
      tags: meta.tags.size ? Array.from(meta.tags) : undefined,
      priorityScore,
      applicabilityReview,
    })
  }

  // Step 4: sort and group
  resolved.sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) {
      return b.priorityScore - a.priorityScore
    }
    if (b.priorityLevel !== a.priorityLevel) {
      return priorityRank(b.priorityLevel) - priorityRank(a.priorityLevel)
    }
    if (a.definition.category !== b.definition.category) {
      return categoryRank(b.definition.category) - categoryRank(a.definition.category)
    }
    return a.definition.name.localeCompare(b.definition.name)
  })

  const mandatoryReports = resolved.filter(
    (report) =>
      !report.applicabilityReview &&
      report.tags?.includes('REGULATORY_MANDATORY') &&
      report.priorityLevel === 'CRITICAL' &&
      report.definition.category === 'REGULATORY',
  )
  const recommendedReports = resolved.filter(
    (report) =>
      !mandatoryReports.includes(report) && (report.priorityLevel === 'CRITICAL' || report.priorityLevel === 'HIGH'),
  )
  const optionalReports = resolved.filter(
    (report) => !mandatoryReports.includes(report) && !recommendedReports.includes(report),
  )

  return {
    mandatoryReports,
    recommendedReports,
    optionalReports,
    warnings,
    suppressedReports,
    engineNotes: globalNotes.size ? Array.from(globalNotes) : undefined,
  }
}

// =============================
// Helpers
// =============================

function normalizeAnswers(raw: AnswerMap): AnswerMap {
  const normalized: AnswerMap = {}
  const validIds = new Set(QUESTION_DEFINITIONS.map((q) => q.id))

  for (const key of Object.keys(raw)) {
    const value = raw[key]
    if (value === undefined || value === null) continue
    const question = QUESTION_INDEX[key]
    if (!question) {
      normalized[key] = Array.isArray(value)
        ? value.filter((item) => item !== undefined && item !== null).map((item) => String(item))
        : String(value)
      continue
    }

    if (question.type === 'multi') {
      const arr = Array.isArray(value) ? value : [value]
      const prepared = arr
        .filter((item) => item !== undefined && item !== null)
        .map((item) => String(item))
      normalized[key] = sanitizeMultiSelectAnswer(prepared)
    } else if (question.type === 'free-text') {
      const scalar = Array.isArray(value) ? value[0] : value
      if (scalar !== undefined && scalar !== null) {
        const text = String(scalar).trim()
        if (text.length > 0) {
          normalized[key] = text
        }
      }
    } else {
      const scalar = Array.isArray(value) ? value[0] : value
      if (scalar !== undefined && scalar !== null) {
        const single = sanitizeSingleSelectAnswer(String(scalar))
        if (single) {
          normalized[key] = single
        }
      }
    }
  }

  // Ensure keys exist even if not answered for easier checks
  for (const id of validIds) {
    if (!(id in normalized)) {
      normalized[id] = null
    }
  }

  return normalized
}

function evaluateConditions(
  predicates: Predicate[],
  answers: AnswerMap,
  selectedReports: Set<string>,
): boolean {
  return predicates.every((predicate) => evaluatePredicate(predicate, answers, selectedReports))
}

function evaluatePredicate(
  predicate: Predicate,
  answers: AnswerMap,
  selectedReports: Set<string>,
): boolean {
  switch (predicate.type) {
    case 'equals': {
      const answer = answers[predicate.questionId]
      if (Array.isArray(answer)) {
        return answer.length === 1 && answer[0] === predicate.value
      }
      return answer === predicate.value
    }
    case 'notEquals': {
      const arr = getAnswerArray(predicate.questionId, answers)
      if (arr.length === 0) return true
      return !arr.includes(predicate.value)
    }
    case 'anyOf': {
      const arr = getAnswerArray(predicate.questionId, answers)
      return arr.some((value) => predicate.values.includes(value))
    }
    case 'includes': {
      const arr = getAnswerArray(predicate.questionId, answers)
      return arr.includes(predicate.value)
    }
    case 'includesAny': {
      const arr = getAnswerArray(predicate.questionId, answers)
      return arr.some((value) => predicate.values.includes(value))
    }
    case 'excludes': {
      const arr = getAnswerArray(predicate.questionId, answers)
      return !arr.includes(predicate.value)
    }
    case 'allOf': {
      const arr = getAnswerArray(predicate.questionId, answers)
      return predicate.values.every((value) => arr.includes(value))
    }
    case 'hasAny': {
      const arr = getAnswerArray(predicate.questionId, answers)
      return arr.length > 0
    }
    case 'isEmpty': {
      const arr = getAnswerArray(predicate.questionId, answers)
      return arr.length === 0
    }
    case 'flag':
      return false
    case 'reportSelected':
      return selectedReports.has(predicate.reportId)
    case 'anyReportSelected':
      return predicate.reportIds.some((reportId) => selectedReports.has(reportId))
    default:
      return true
  }
}

function getAnswerArray(questionId: string, answers: AnswerMap): string[] {
  const value = answers[questionId]
  if (value === null || value === undefined) {
    return []
  }
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }
  if (typeof value === 'string' && value.length > 0) {
    return [value]
  }
  return []
}

function downgradePriorityLevel(current?: PriorityLevel): PriorityLevel {
  switch (current) {
    case 'CRITICAL':
      return 'HIGH'
    case 'HIGH':
      return 'MEDIUM'
    case 'MEDIUM':
      return 'LOW'
    default:
      return 'LOW'
  }
}

function priorityRank(level: PriorityLevel): number {
  switch (level) {
    case 'CRITICAL':
      return 3
    case 'HIGH':
      return 2
    case 'MEDIUM':
      return 1
    default:
      return 0
  }
}

function categoryRank(category: string): number {
  switch (category) {
    case 'REGULATORY':
      return 4
    case 'CLIENT':
      return 3
    case 'FINANCIAL':
      return 3
    case 'PROGRAM':
      return 2
    case 'PRODUCT':
      return 2
    case 'SECTOR':
      return 1
    case 'INTERNAL':
      return 1
    default:
      return 0
  }
}

interface ScoreInput {
  reportId: string
  definition: ReportDefinition
  priorityLevel: PriorityLevel
  initiators: Set<string>
  warningCount: number
  globalNotes: Set<string>
}

function computePriorityScore(input: ScoreInput): number {
  const { definition, priorityLevel, initiators, warningCount, globalNotes } = input
  let score = PRIORITY_BASE[priorityLevel] ?? 30
  score += CATEGORY_BONUS[definition.category as keyof typeof CATEGORY_BONUS] ?? 0

  if (definition.category === 'REGULATORY' && initiators.has('REGULATOR')) {
    score += 10
  }
  if (definition.category === 'REGULATORY' && initiators.has('EXCHANGE')) {
    score += 4
  }
  if (definition.category === 'CLIENT' && hasClientInitiator(initiators)) {
    score += 6
  }
  if (definition.category === 'FINANCIAL' && initiators.has('BANK_INVESTOR')) {
    score += 6
  }
  if (definition.category === 'PROGRAM' && initiators.has('PROGRAM')) {
    score += 4
  }
  if (definition.category === 'INTERNAL' && hasInternalInitiator(initiators)) {
    score += 3
  }

  if (globalNotes.has('PRIORITIZE_REGULATOR_OVER_CLIENT') && definition.category !== 'REGULATORY') {
    score -= 5
  }
  if (globalNotes.has('INTERNAL_REPORTS_MARK_OPTIONAL') && definition.category === 'INTERNAL') {
    score -= 8
  }
  if (globalNotes.has('PROGRAM_IS_BASELINE_INTERNAL_IS_EXTENSION') && definition.category === 'INTERNAL') {
    score -= 4
  }

  score -= warningCount * 2
  return score
}

function hasClientInitiator(initiators: Set<string>): boolean {
  for (const code of initiators) {
    if (CLIENT_CODES.has(code)) return true
  }
  return false
}

function hasInternalInitiator(initiators: Set<string>): boolean {
  for (const code of initiators) {
    if (INTERNAL_CODES.has(code)) return true
  }
  return false
}
