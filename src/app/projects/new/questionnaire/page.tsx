'use client'

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  AnswerValue,
  QUESTION_DEFINITIONS,
  QuestionDefinition,
  QuestionGroup,
  EvaluationResult,
  evaluateQuestionnaire,
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

export default function QuestionnairePage() {
  return (
    <DashboardLayout>
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
  const [submissionError, setSubmissionError] = useState<string | null>(null)

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

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? sessionStorage.getItem('wizardAnswers') : null
      if (stored) {
        const parsed = JSON.parse(stored) as AnswerMap
        setAnswers(parsed)
      }
    } catch (error) {
      console.warn('Failed to restore questionnaire answers', error)
    }
  }, [])

  useEffect(() => {
    setStoredProgress(hasAnyWizardProgress())
  }, [answers])

  const answeredCount = useMemo(() => {
    return QUESTION_DEFINITIONS.filter((question) => hasAnswer(answers[question.id])).length
  }, [answers])

  const totalQuestions = QUESTION_DEFINITIONS.length
  const progressRatio = totalQuestions > 0 ? answeredCount / totalQuestions : 0

  const persistAnswers = useCallback((nextAnswers: AnswerMap) => {
    setAnswers(nextAnswers)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('wizardAnswers', JSON.stringify(nextAnswers))
    }
  }, [])

  const handleSingleChange = (questionId: string, value: string) => {
    persistAnswers({
      ...answers,
      [questionId]: value,
    })
  }

  const handleMultiToggle = (questionId: string, optionValue: string) => {
    const current = Array.isArray(answers[questionId]) ? (answers[questionId] as string[]) : []
    const exists = current.includes(optionValue)
    const next = exists ? current.filter((value) => value !== optionValue) : [...current, optionValue]
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
      <div className="max-w-5xl mx-auto space-y-6 py-8">
        <header className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase text-muted-foreground">Шаг 2 из 3</p>
            <h1 className="text-3xl font-bold tracking-tight">Расширенный опросник</h1>
            <p className="text-muted-foreground mt-1">
              Ответьте на вопросы — движок рекомендаций подберёт релевантные отчёты.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => requestExit('/dashboard')}>
            <X className="h-4 w-4" />
          </Button>
        </header>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${Math.max(5, progressRatio * 100)}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {answeredCount} / {totalQuestions} вопросов
          </span>
        </div>

        {submissionError && (
          <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {submissionError}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {QUESTION_GROUP_ORDER.map((group) => {
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
          })}

          <div className="flex items-center gap-4">
            <Button type="button" variant="outline" onClick={() => router.push('/projects/new')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Обрабатываем ответы…
                </>
              ) : (
                <>
                  Рассчитать рекомендации
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>

        <footer className="text-center text-sm text-muted-foreground">
          <p>
            Движок рекомендаций сопоставит правила, приоритеты и ограничения и передаст результат на шаг выбора отчётов.
          </p>
        </footer>
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

  return (
    <div className="space-y-3">
      <div>
        <p className="text-base font-semibold">{question.text}</p>
        {question.hint && <p className="text-sm text-muted-foreground">{question.hint}</p>}
      </div>

      {question.type === 'single' && question.options && (
        <RadioGroup
          value={typeof value === 'string' ? value : ''}
          onValueChange={(nextValue) => onSingleChange(question.id, nextValue)}
        >
          <div className="space-y-2">
            {question.options.map((option) => (
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

      {question.type === 'multi' && question.options && (
        <div className="space-y-2">
          {question.options.map((option) => (
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
  if (Array.isArray(value)) {
    return value.length > 0
  }
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return false
}
