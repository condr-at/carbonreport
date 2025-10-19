'use client';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight, ArrowLeft, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  WIZARD_QUESTIONNAIRE, 
  getNextQuestion, 
  getVisibleQuestions,
  getRecommendedTemplates 
} from '@/lib/questionnaires/wizard-config';

export default function QuestionnairePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeMode = searchParams.get('resume') === '1';
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('target_region');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedValue, setSelectedValue] = useState<string>('');

  // Load existing answers from sessionStorage on mount
  useEffect(() => {
    const savedAnswers = sessionStorage.getItem('wizardAnswers');
    const parsed: Record<string, string> = savedAnswers ? JSON.parse(savedAnswers) : {};
    setAnswers(parsed);

    const visible = getVisibleQuestions(parsed);
    if (visible.length === 0) {
      setCurrentQuestionId('target_region');
      setSelectedValue(parsed['target_region'] ?? '');
      return;
    }

    if (resumeMode) {
      const lastId = visible[visible.length - 1].id;
      setCurrentQuestionId(lastId);
      setSelectedValue(parsed[lastId] ?? '');
      return;
    }

    const firstUnanswered = visible.find((question) => !parsed[question.id]);
    const startId = firstUnanswered?.id ?? visible[0].id;
    setCurrentQuestionId(startId);
    setSelectedValue(parsed[startId] ?? '');
  }, [resumeMode]);

  const currentQuestion = WIZARD_QUESTIONNAIRE[currentQuestionId];
  const visibleQuestions = getVisibleQuestions(answers);
  const currentQuestionIndex = visibleQuestions.findIndex(q => q.id === currentQuestionId);
  const answeredCount = visibleQuestions.filter(q => answers[q.id]).length;
  const totalQuestions = visibleQuestions.length;
  const questionnaireProgress = totalQuestions > 0 ? Math.min(100, Math.round((answeredCount / totalQuestions) * 100)) : 0;

  // If current question becomes hidden (due to answer changes), move to nearest valid question
  useEffect(() => {
    const visible = getVisibleQuestions(answers);
    if (visible.length === 0) return;
    const stillVisible = visible.some((question) => question.id === currentQuestionId);
    if (!stillVisible) {
      const firstUnanswered = visible.find((question) => !answers[question.id]);
      const fallbackId = firstUnanswered?.id ?? visible[visible.length - 1].id;
      setCurrentQuestionId(fallbackId);
      setSelectedValue(answers[fallbackId] ?? '');
    }
  }, [answers, currentQuestionId]);

  const handleNext = () => {
    if (!selectedValue) {
      alert('Please select an option');
      return;
    }

    // Save answer
    const updatedAnswers = { ...answers, [currentQuestionId]: selectedValue };
    setAnswers(updatedAnswers);
    sessionStorage.setItem('wizardAnswers', JSON.stringify(updatedAnswers));

    // Check if there's a next question
    const nextQuestion = getNextQuestion(currentQuestionId, updatedAnswers);
    
    if (nextQuestion) {
      // Go to next question
      setCurrentQuestionId(nextQuestion.id);
      setSelectedValue(''); // Reset selection for next question
    } else {
  // No more questions, calculate recommendations and go to select-reports
      const recommendedTemplates = getRecommendedTemplates(updatedAnswers);
      sessionStorage.setItem('recommendedTemplates', JSON.stringify(recommendedTemplates));
      router.push('/projects/new/select-reports');
    }
  };

  const handleSkip = () => {
    // Skip all remaining questions, no recommendations
    sessionStorage.setItem('recommendedTemplates', JSON.stringify([]));
    router.push('/projects/new/select-reports');
  };

  const handleBack = () => {
    // Find previous question in visible questions
    const currentIndex = visibleQuestions.findIndex(q => q.id === currentQuestionId);
    
    if (currentIndex > 0) {
      // Go to previous question in the flow
      const prevQuestion = visibleQuestions[currentIndex - 1];
      setCurrentQuestionId(prevQuestion.id);
      setSelectedValue(answers[prevQuestion.id] || '');
    } else {
      // First question, go back to project name step
      router.push('/projects/new');
    }
  };

  if (!currentQuestion) {
    router.push('/projects/new/select-reports');
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
            <p className="text-muted-foreground mt-1">Questionnaire</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress indicator (fixed 3 segments) */}
        <div className="flex items-center gap-2">
          {/* Segment 1: Project Info (completed) */}
          <div className="flex-1 h-2 bg-primary rounded-full" />

          {/* Segment 2: Questionnaire (split into micro-steps) */}
          <div className="flex-1 h-2 bg-muted overflow-hidden">
            {totalQuestions > 0 ? (
              <div
                className="grid h-full w-full gap-[2px]"
                style={{ gridTemplateColumns: `repeat(${totalQuestions}, 1fr)` }}
              >
                {Array.from({ length: totalQuestions }).map((_, idx) => {
                  const isFilled = idx < answeredCount;
                  return (
                    <div
                      key={idx}
                      className={`h-full transition-colors ${
                        isFilled ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="h-full w-full bg-muted" />
            )}
          </div>

          {/* Segment 3: Select Reports (upcoming) */}
          <div className="flex-1 h-2 bg-muted rounded-full" />
        </div>

        {/* Question */}
        <Card>
          <CardHeader>
            <CardTitle>{currentQuestion.question}</CardTitle>
            <CardDescription>
              {currentQuestion.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => setSelectedValue(option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <div className="flex-1 space-y-1">
                      <Label
                        htmlFor={option.value}
                        className="font-medium cursor-pointer"
                      >
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <div className="flex items-center gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={handleNext}
                disabled={!selectedValue}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkip}
              >
                Skip
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Helper text */}
        <div className="text-sm text-muted-foreground text-center">
          <p>
            Based on your selection, we&apos;ll recommend specific report templates.
            You can always add or remove reports later.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
