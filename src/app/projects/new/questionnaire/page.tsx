'use client';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight, ArrowLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  WIZARD_QUESTIONNAIRE, 
  getNextQuestion, 
  getVisibleQuestions,
  getRecommendedTemplates 
} from '@/lib/questionnaires/wizard-config';

export default function QuestionnairePage() {
  const router = useRouter();
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('assessment_goal');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedValue, setSelectedValue] = useState<string>('');

  // Load existing answers from sessionStorage on mount
  useEffect(() => {
    const savedAnswers = sessionStorage.getItem('wizardAnswers');
    if (savedAnswers) {
      const parsed = JSON.parse(savedAnswers);
      setAnswers(parsed);
      
      // Set current value if already answered
      if (parsed[currentQuestionId]) {
        setSelectedValue(parsed[currentQuestionId]);
      }
    }
  }, [currentQuestionId]);

  const currentQuestion = WIZARD_QUESTIONNAIRE[currentQuestionId];
  const visibleQuestions = getVisibleQuestions(answers);
  const currentStepNumber = visibleQuestions.findIndex(q => q.id === currentQuestionId) + 1;
  const totalSteps = visibleQuestions.length + 1; // +1 for final select-reports step

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
            <p className="text-muted-foreground mt-1">
              Step {currentStepNumber} of {totalSteps}: Questionnaire
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          {/* Step 1: Project name (completed) */}
          <div className="flex-1 h-2 bg-primary rounded-full" />
          
          {/* Question steps (dynamic based on visible questions) */}
          {visibleQuestions.map((q, index) => (
            <div
              key={q.id}
              className={`flex-1 h-2 rounded-full ${
                index < currentStepNumber - 1 ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
          
          {/* Final step: Select reports */}
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
                Next: Select Reports
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
