/**
 * Decision Engine Types
 *
 * Shared type definitions for the questionnaire rules engine.
 */

export type QuestionGroup =
	| 'profile'
	| 'initiator'
	| 'regulator'
	| 'client'
	| 'financial'
	| 'program'
	| 'exchange'
	| 'internal'
	| 'operations'
	| 'trade'
	| 'constraints'
	| 'sector'

export type QuestionType = 'single' | 'multi' | 'free-text'

export interface AnswerOption {
	code: string
	label: string
	description?: string
}

export interface QuestionDefinition {
	id: string
	group: QuestionGroup
	text: string
	type: QuestionType
	options?: AnswerOption[]
	hint?: string
	dependsOn?: string[] // Optional list of question IDs this question depends on
}

export type AnswerValue = string | string[] | null

export type AnswerMap = Record<string, AnswerValue>

export type ReportCategory =
	| 'REGULATORY'
	| 'CLIENT'
	| 'FINANCIAL'
	| 'PROGRAM'
	| 'INTERNAL'
	| 'PRODUCT'
	| 'SECTOR'
	| 'DATA'

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'

export type VerificationLevel = 'MANDATORY' | 'RECOMMENDED' | 'OPTIONAL' | 'NOT_NEEDED'

export type ScopeRequirementLevel = 'required' | 'partial' | 'optional' | 'not_applicable'

export interface ScopeRequirements {
	scope1: ScopeRequirementLevel
	scope2: ScopeRequirementLevel
	scope3: ScopeRequirementLevel
	notes?: string
}

export type Frequency = 'ANNUAL' | 'QUARTERLY' | 'MONTHLY' | 'ONE_OFF' | 'ON_DEMAND'

/** A recommendation to check scope/output, not a determination of a legal obligation. */
export interface ApplicabilityReview {
	status: 'required'
	reason: string
	checks: string[]
	checkedOn: string
	/** Internal references into docs/report-reference/research. */
	sourceRefs: string[]
}

export interface ReportDefinition {
	id: string
	name: string
	category: ReportCategory
	priorityLevel: PriorityLevel
	verificationLevel: VerificationLevel
	scopes: ScopeRequirements
	frequency?: Frequency
	summary?: string
	notes?: string
	tags?: string[]
	timelineMonths?: [number, number]
	budgetEUR?: [number, number]
	applicabilityReview?: ApplicabilityReview
}

// =============================
// Rule Definitions
// =============================

export type Predicate =
	| {
			type: 'equals'
			questionId: string
			value: string
		}
	| {
			type: 'notEquals'
			questionId: string
			value: string
		}
	| {
			type: 'anyOf'
			questionId: string
			values: string[]
		}
	| {
			type: 'includes'
			questionId: string
			value: string
		}
	| {
			type: 'includesAny'
			questionId: string
			values: string[]
		}
	| {
			type: 'excludes'
			questionId: string
			value: string
		}
	| {
			type: 'allOf'
			questionId: string
			values: string[]
		}
	| {
			type: 'hasAny'
			questionId: string
		}
	| {
			type: 'isEmpty'
			questionId: string
		}
	| {
			type: 'reportSelected'
			reportId: string
		}
	| {
			type: 'anyReportSelected'
			reportIds: string[]
		}
	| {
			type: 'flag'
			flagId: string
			value: boolean
		}

export interface RuleOutput {
	reports?: string[]
	notes?: string[]
	priorityOverride?: PriorityLevel
	tags?: string[]
}

export interface RuleDefinition {
	id: string
	source: string // Link back to brief row number or doc reference
	description?: string
	conditions: Predicate[]
	outputs: RuleOutput
}

export type ValidationEffect =
	| {
			type: 'forbid-report'
			reportId: string
		}
	| {
			type: 'downgrade-priority'
			reportId: string
			to?: PriorityLevel
		}
	| {
			type: 'add-warning'
			warningCode: string
			message?: string
		}

export interface ValidationRule {
	id: string
	description?: string
	conditions: Predicate[]
	effects: ValidationEffect[]
}

export interface ResolvedReport {
	id: string
	definition: ReportDefinition
	priorityLevel: PriorityLevel
	sourceRules: string[]
	notes?: string[]
	tags?: string[]
	priorityScore: number
	applicabilityReview?: ApplicabilityReview
}

export interface WarningMessage {
	code: string
	message: string
}

export interface EvaluationResult {
	mandatoryReports: ResolvedReport[]
	recommendedReports: ResolvedReport[]
	optionalReports: ResolvedReport[]
	warnings: WarningMessage[]
	suppressedReports: string[]
	engineNotes?: string[]
}
