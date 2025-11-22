'use client'

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { TitleStatusStepper } from '@/components/stepper/title-status'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { clearWizardProgress, hasAnyWizardProgress } from '@/lib/wizard-progress'
import {
  AnswerMap,
  AnswerOption,
  AnswerValue,
  QUESTION_DEFINITIONS,
  QuestionDefinition,
  QuestionGroup,
  EvaluationResult,
  evaluateQuestionnaire,
  GroupVisibilityMap,
  computeGroupVisibility,
  UNKNOWN_ANSWER_CODE,
  UNKNOWN_ANSWER_LABEL,
  UNKNOWN_ANSWER_DESCRIPTION,
  hasMeaningfulAnswer,
} from '@/lib/questionnaires/decision-engine'
import { ReportTemplateCode } from '@/lib/report-templates/types'
import { ArrowLeft, ArrowRight, Loader2, X } from 'lucide-react'

const QUESTION_GROUP_TITLES: Record<QuestionGroup, { title: string; description?: string }> = {
  profile: { title: 'Профиль компании', description: 'Базовые сведения о юрисдикции и размерах' },
  initiator: { title: 'Кто запросил отчёт', description: 'Понимаем мотивацию и обязательность' },
  regulator: { title: 'Регуляторные требования', description: 'Конкретизируем применимые режимы' },
  client: { title: 'Запросы клиентов', description: 'Какие форматы требуют контрагенты' },
  financial: { title: 'Финансовые запросы', description: 'Инвесторы, банки и фонды' },
  program: { title: 'Программы и рейтинги', description: 'CDP, SBTi и другие инициативы' },
  exchange: { title: 'Биржевые требования', description: 'Публичные листинги и раскрытия' },
  internal: { title: 'Внутренние инициативы', description: 'Совет директоров, топ-менеджмент' },
  operations: { title: 'Операционная деятельность', description: 'Границы учёта и процессы' },
  trade: { title: 'Экспорт и CBAM', description: 'Торговые операции с ЕС' },
  constraints: { title: 'Ограничения по срокам и бюджету', description: 'Реалистичность внедрения' },
  sector: { title: 'Отраслевые особенности', description: 'Детализируем контекст бизнеса' },
}

const QUESTION_GROUP_ORDER: QuestionGroup[] = [
  'profile',
  'initiator',
  'regulator',
  'client',
  'financial',
  'program',
  'exchange',
  'internal',
  'operations',
  'trade',
  'constraints',
  'sector',
]

const WIZARD_ACTIVE_STEP_KEY = 'wizardActiveStepIndex'

interface StepDefinition {
  id: string
  title: string
  description: string
  groups: QuestionGroup[]
}

const STEP_DEFINITIONS: StepDefinition[] = [
  {
    id: 'company-profile',
    title: 'Профиль компании',
    description: 'Базовые сведения перед выбором драйверов',
    groups: ['profile'],
  },
  {
    id: 'drivers',
    title: 'Внешние драйверы',
    description: 'Инициаторы, регуляторы и клиенты',
    groups: ['initiator', 'regulator', 'client', 'financial', 'program', 'exchange'],
  },
  {
    id: 'internal',
    title: 'Внутренний контекст',
    description: 'Внутренние инициативы и границы расчёта',
    groups: ['internal', 'operations'],
  },
  {
    id: 'execution',
    title: 'Экспорт и ограничения',
    description: 'Торговые цепочки, сроки и ресурсы',
    groups: ['trade', 'constraints'],
  },
  {
    id: 'sector',
    title: 'Отраслевые детали',
    description: 'Специфические вопросы для отрасли',
    groups: ['sector'],
  },
]

type StepState = StepDefinition & { visibleGroups: QuestionGroup[] }

const ENGINE_TO_TEMPLATE_MAP: Record<string, ReportTemplateCode> = {
  CBAM: 'CBAM',
  CBAM_REPORT: 'CBAM',
  CBAM_ALLOWANCES: 'CBAM',
  CBAM_DATA_PACKAGE: 'CBAM',
  CBAM_PREP_METHOD: 'CBAM',
  ISO_14067_CERT: 'ISO14067',
  PRODUCT_PCF: 'ISO14067',
  LCA_PRODUCT: 'ISO14067',
}

const ACTION_BAR_HEIGHT = 112
const ACTION_BAR_GAP = 24
const CONTENT_BOTTOM_PADDING = ACTION_BAR_HEIGHT + ACTION_BAR_GAP

export default function QuestionnairePage() {
  return (
    <DashboardLayout contentPadding="horizontal">
      <QuestionnaireContent />
    </DashboardLayout>
  )
}

function QuestionnaireContent() {
  const router = useRouter()
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [storedProgress, setStoredProgress] = useState(false)
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false)
  const exitTargetRef = useRef<string | null>(null)
  const hasRestoredStepIndex = useRef(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [activeStepIndex, setActiveStepIndex] = useState(0)

  const groupedQuestions = useMemo(() => {
    const grouping: Record<QuestionGroup, QuestionDefinition[]> = {
      profile: [],
      initiator: [],
      regulator: [],
      client: [],
      financial: [],
      program: [],
      exchange: [],
      internal: [],
      operations: [],
      trade: [],
      constraints: [],
      sector: [],
    }

    QUESTION_DEFINITIONS.forEach((question) => {
      grouping[question.group].push(question)
    })

    return grouping
  }, [])

  const groupVisibility = useMemo<GroupVisibilityMap>(() => computeGroupVisibility(answers), [answers])

  const persistAnswers = useCallback((nextAnswers: AnswerMap) => {
    setAnswers(nextAnswers)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('wizardAnswers', JSON.stringify(nextAnswers))
    }
  }, [])

  const clearStoredStepIndex = useCallback(() => {
    if (typeof window === 'undefined') return
    sessionStorage.removeItem(WIZARD_ACTIVE_STEP_KEY)
  }, [])

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? sessionStorage.getItem('wizardAnswers') : null
      if (stored) {
        const parsed = JSON.parse(stored) as AnswerMap
        setAnswers(coerceStoredAnswers(parsed))
      }
    } catch (error) {
      console.warn('Failed to restore questionnaire answers', error)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || hasRestoredStepIndex.current) return
    const storedIndex = sessionStorage.getItem(WIZARD_ACTIVE_STEP_KEY)
    if (storedIndex !== null) {
      const parsedIndex = Number.parseInt(storedIndex, 10)
      if (!Number.isNaN(parsedIndex) && parsedIndex >= 0) {
        setActiveStepIndex(parsedIndex)
      }
    }
    hasRestoredStepIndex.current = true
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !hasRestoredStepIndex.current) return
    sessionStorage.setItem(WIZARD_ACTIVE_STEP_KEY, String(activeStepIndex))
  }, [activeStepIndex])

  useEffect(() => {
    setStoredProgress(hasAnyWizardProgress())
  }, [answers])

  const stepStates = useMemo<StepState[]>(() => {
    return STEP_DEFINITIONS.map((step) => ({
      ...step,
      visibleGroups: step.groups.filter(
        (group) => groupVisibility[group] && (groupedQuestions[group]?.length ?? 0) > 0,
      ),
    }))
  }, [groupVisibility, groupedQuestions])

  const activeSteps = useMemo(() => stepStates.filter((step) => step.visibleGroups.length > 0), [stepStates])
  const stepperSteps = useMemo(() => activeSteps.map((step) => ({ id: step.id, title: step.title })), [activeSteps])

  useEffect(() => {
    if (activeSteps.length === 0) {
      setActiveStepIndex(0)
      return
    }
    if (activeStepIndex >= activeSteps.length) {
      setActiveStepIndex(activeSteps.length - 1)
    }
  }, [activeSteps, activeStepIndex])

  const currentStep = activeSteps[activeStepIndex] ?? null
  const isLastStep = activeSteps.length > 0 && activeStepIndex === activeSteps.length - 1
  const hasPreviousStep = activeStepIndex > 0
  const isCurrentStepComplete = useMemo(() => {
    if (!currentStep) {
      return false
    }

    return currentStep.visibleGroups.every((group) => {
      const questions = groupedQuestions[group] ?? []
      if (questions.length === 0) {
        return true
      }
      return questions.every((question) => hasProgressAnswer(answers[question.id]))
    })
  }, [answers, currentStep, groupedQuestions])

  const clearGroups = useCallback(
    (groups: QuestionGroup[]) => {
      const nextAnswers: AnswerMap = { ...answers }
      let changed = false
      groups.forEach((group) => {
        groupedQuestions[group]?.forEach((question) => {
          if (nextAnswers[question.id] !== undefined) {
            delete nextAnswers[question.id]
            changed = true
          }
        })
      })
      if (changed) {
        persistAnswers(nextAnswers)
      }
    },
    [answers, groupedQuestions, persistAnswers],
  )

  const goToNextStep = useCallback(() => {
    if (activeSteps.length === 0) return
    setActiveStepIndex((prev) => Math.min(prev + 1, activeSteps.length - 1))
  }, [activeSteps.length])

  const goToPreviousStep = useCallback(() => {
    setActiveStepIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  const handleSkipCurrentStep = () => {
    if (!currentStep) return
    clearGroups(currentStep.groups)
    goToNextStep()
  }

  const handleNextStep = () => {
    if (!isLastStep) {
      goToNextStep()
    }
  }

  const handlePreviousStep = () => {
    if (hasPreviousStep) {
      goToPreviousStep()
    }
  }

  useEffect(() => {
    if (!answers || Object.keys(answers).length === 0) {
      return
    }

    const nextAnswers: AnswerMap = { ...answers }
    let changed = false

    QUESTION_GROUP_ORDER.forEach((group) => {
      if (groupVisibility[group]) return
      groupedQuestions[group]?.forEach((question) => {
        if (nextAnswers[question.id] !== undefined) {
          delete nextAnswers[question.id]
          changed = true
        }
      })
    })

    if (changed) {
      setAnswers(nextAnswers)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('wizardAnswers', JSON.stringify(nextAnswers))
      }
    }
  }, [answers, groupVisibility, groupedQuestions])

  const answeredCount = useMemo(() => {
    return QUESTION_DEFINITIONS.filter((question) => hasAnswer(answers[question.id])).length
  }, [answers])

  const totalQuestions = QUESTION_DEFINITIONS.length
  const progressRatio = totalQuestions > 0 ? answeredCount / totalQuestions : 0

  const handleSingleChange = (questionId: string, value: string) => {
    persistAnswers({
      ...answers,
      [questionId]: value,
    })
  }

  const handleMultiToggle = (questionId: string, optionValue: string) => {
    const current = Array.isArray(answers[questionId]) ? (answers[questionId] as string[]) : []

    if (optionValue === UNKNOWN_ANSWER_CODE) {
      const next = current.includes(UNKNOWN_ANSWER_CODE) ? [] : [UNKNOWN_ANSWER_CODE]
      persistAnswers({
        ...answers,
        [questionId]: next,
      })
      return
    }

    const filtered = current.filter((value) => value !== UNKNOWN_ANSWER_CODE)
    const exists = filtered.includes(optionValue)
    const next = exists ? filtered.filter((value) => value !== optionValue) : [...filtered, optionValue]
    persistAnswers({
      ...answers,
      [questionId]: next,
    })
  }

  const handleFreeTextChange = (questionId: string, value: string) => {
    persistAnswers({
      ...answers,
      [questionId]: value,
    })
  }

  const requestExit = (target: string) => {
    const hasProgress = storedProgress || Object.keys(answers).length > 0
    if (!hasProgress) {
      clearWizardProgress()
      clearStoredStepIndex()
      setActiveStepIndex(0)
      router.push(target)
      return
    }

    exitTargetRef.current = target
    setIsExitDialogOpen(true)
  }

  const handleExitCancel = () => {
    exitTargetRef.current = null
    setIsExitDialogOpen(false)
  }

  const handleExitConfirm = () => {
    const target = exitTargetRef.current ?? '/dashboard'
    clearWizardProgress()
    clearStoredStepIndex()
    setActiveStepIndex(0)
    setIsExitDialogOpen(false)
    exitTargetRef.current = null
    router.push(target)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    const hasAtLeastOneAnswer = Object.values(answers).some((value) => hasAnswer(value))
    if (!hasAtLeastOneAnswer) {
      setSubmissionError('Пожалуйста, ответьте хотя бы на один вопрос перед продолжением.')
      return
    }

    setSubmissionError(null)
    setIsSubmitting(true)

    try {
      const evaluation = evaluateQuestionnaire(answers)
      persistEvaluation(evaluation)
      persistAnswers(answers)
      router.push('/projects/new/select-reports')
    } catch (error) {
      console.error('Failed to evaluate questionnaire', error)
      setSubmissionError('Не удалось обработать ответы. Попробуйте ещё раз или обратитесь в поддержку.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const persistEvaluation = (result: EvaluationResult) => {
    if (typeof window === 'undefined') return
    sessionStorage.setItem('decisionEngineResult', JSON.stringify(result))
    const templateCodes = deriveTemplateCodes(result)
    sessionStorage.setItem('recommendedTemplates', JSON.stringify(templateCodes))
  }

  const deriveTemplateCodes = (result: EvaluationResult): ReportTemplateCode[] => {
    const codes = new Set<ReportTemplateCode>()
    const allReports = [...result.mandatoryReports, ...result.recommendedReports, ...result.optionalReports]
    allReports.forEach((report) => {
      const mapped = ENGINE_TO_TEMPLATE_MAP[report.id]
      if (mapped) {
        codes.add(mapped)
      }
    })
    return Array.from(codes)
  }

  return (
    <>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="sticky top-0 z-20 bg-background/95 pb-4 pt-6 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Расширенный опросник</h1>
              <p className="text-muted-foreground mt-1">
                Ответьте на вопросы — движок рекомендаций подберёт релевантные отчёты.
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => requestExit('/dashboard')}>
              <X className="h-4 w-4" />
            </Button>
          </header>

          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.max(5, progressRatio * 100)}%` }}
                />
              </div>
            </div>
            {activeSteps.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Блоки опросника</p>
                <TitleStatusStepper
                  steps={stepperSteps}
                  activeIndex={activeStepIndex}
                  onStepChange={setActiveStepIndex}
                />
              </div>
            )}
          </div>
        </div>

        {submissionError && (
          <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {submissionError}
          </div>
        )}

        <form className="space-y-6" style={{ paddingBottom: CONTENT_BOTTOM_PADDING }} onSubmit={handleSubmit}>
          {currentStep ? (
            currentStep.visibleGroups.map((group) => {
              const meta = QUESTION_GROUP_TITLES[group]
              const questions = groupedQuestions[group]
              if (!questions || questions.length === 0) return null
              return (
                <Card key={group} className="border-muted">
                  <CardHeader>
                    <CardTitle>{meta?.title ?? group}</CardTitle>
                    {meta?.description && <CardDescription>{meta.description}</CardDescription>}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {questions.map((question) => (
                      <QuestionField
                        key={question.id}
                        question={question}
                        value={answers[question.id]}
                        onSingleChange={handleSingleChange}
                        onMultiToggle={handleMultiToggle}
                        onFreeTextChange={handleFreeTextChange}
                      />
                    ))}
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>Нет вопросов для отображения</CardTitle>
                <CardDescription>
                  Похоже, текущий набор условий не включает активных блоков. Вернитесь назад или измените ответы.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <div
            className="pointer-events-none fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
            style={{ minHeight: ACTION_BAR_HEIGHT }}
          >
            <div className="pointer-events-auto mx-auto w-full max-w-7xl px-6 py-4">
              <div className="mx-auto flex w-full max-w-2xl flex-wrap items-center justify-between gap-3">
                <Button type="button" variant="outline" onClick={handlePreviousStep} disabled={!hasPreviousStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Предыдущий блок
                </Button>
                <div className="flex flex-1 justify-end gap-2 sm:flex-none">
                  {!isLastStep && (
                    <Button type="button" variant="ghost" onClick={handleSkipCurrentStep} disabled={!currentStep}>
                      Пропустить блок
                    </Button>
                  )}
                  {isLastStep ? (
                    <Button type="submit" className="flex-1 sm:flex-none" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Обрабатываем ответы…
                        </>
                      ) : (
                        <>
                          Перейти к выбору отчётов
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="flex-1 sm:flex-none"
                      onClick={handleNextStep}
                      disabled={!currentStep || !isCurrentStepComplete}
                    >
                      Далее
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <AlertDialog open={isExitDialogOpen} onOpenChange={(open) => !open && handleExitCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Выйти из мастера?</AlertDialogTitle>
            <AlertDialogDescription>
              Введённые ответы будут очищены, если покинуть шаг сейчас.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleExitCancel}>Остаться</AlertDialogCancel>
            <AlertDialogAction onClick={handleExitConfirm}>Выйти</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

interface QuestionFieldProps {
  question: QuestionDefinition
  value: AnswerValue
  onSingleChange: (questionId: string, value: string) => void
  onMultiToggle: (questionId: string, value: string) => void
  onFreeTextChange: (questionId: string, value: string) => void
}

function QuestionField({ question, value, onSingleChange, onMultiToggle, onFreeTextChange }: QuestionFieldProps) {
  const selectedValues = Array.isArray(value) ? value : []
  const optionsWithUnknown = useMemo(() => {
    if (!question.options) return undefined
    if (question.type === 'free-text') return question.options
    return ensureUnknownOption(question.options)
  }, [question.options, question.type])

  return (
    <div className="space-y-3">
      <div>
        <p className="text-base font-semibold">{question.text}</p>
        {question.hint && <p className="text-sm text-muted-foreground">{question.hint}</p>}
      </div>

      {question.type === 'single' && optionsWithUnknown && (
        <RadioGroup
          value={typeof value === 'string' ? value : ''}
          onValueChange={(nextValue) => onSingleChange(question.id, nextValue)}
        >
          <div className="space-y-2">
            {optionsWithUnknown.map((option) => (
              <label
                key={option.code}
                className="flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 hover:bg-accent"
              >
                <RadioGroupItem value={option.code} id={`${question.id}-${option.code}`} />
                <div className="space-y-1">
                  <p className="font-medium leading-none">{option.label}</p>
                  {option.description && (
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </RadioGroup>
      )}

      {question.type === 'multi' && optionsWithUnknown && (
        <div className="space-y-2">
          {optionsWithUnknown.map((option) => (
            <label
              key={option.code}
              className="flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 hover:bg-accent"
            >
              <Checkbox
                id={`${question.id}-${option.code}`}
                checked={selectedValues.includes(option.code)}
                onCheckedChange={() => onMultiToggle(question.id, option.code)}
              />
              <div className="space-y-1">
                <p className="font-medium leading-none">{option.label}</p>
                {option.description && (
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                )}
              </div>
            </label>
          ))}
        </div>
      )}

      {question.type === 'free-text' && (
        <Input
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onFreeTextChange(question.id, event.target.value)}
          placeholder="Ваш ответ"
        />
      )}
    </div>
  )
}

function hasAnswer(value: AnswerValue): boolean {
  return hasMeaningfulAnswer(value)
}

function hasProgressAnswer(value: AnswerValue): boolean {
  if (hasMeaningfulAnswer(value)) {
    return true
  }
  return includesUnknownAnswer(value)
}

function includesUnknownAnswer(value: AnswerValue): boolean {
  if (typeof value === 'string') {
    return value.trim() === UNKNOWN_ANSWER_CODE
  }
  if (Array.isArray(value)) {
    return value.some((item) => typeof item === 'string' && item.trim() === UNKNOWN_ANSWER_CODE)
  }
  return false
}

function ensureUnknownOption(options: AnswerOption[]): AnswerOption[] {
  if (options.some((option) => option.code === UNKNOWN_ANSWER_CODE)) {
    return options
  }

  return [
    ...options,
    {
      code: UNKNOWN_ANSWER_CODE,
      label: UNKNOWN_ANSWER_LABEL,
      description: UNKNOWN_ANSWER_DESCRIPTION,
    },
  ]
}

function coerceStoredAnswers(raw: AnswerMap): AnswerMap {
  const result: AnswerMap = { ...raw }

  QUESTION_DEFINITIONS.forEach((question) => {
    const value = raw[question.id]
    if (value === undefined) {
      return
    }

    if (question.type === 'multi') {
      if (Array.isArray(value)) {
        return
      }
      if (value === null || value === '') {
        result[question.id] = []
        return
      }
      result[question.id] = [String(value)]
      return
    }

    if (Array.isArray(value)) {
      result[question.id] = value.length > 0 ? value[0] : null
    }
  })

  return result
}
