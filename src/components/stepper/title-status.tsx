'use client';

import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Stepper, StepperIndicator, StepperItem, StepperNav, StepperTrigger } from '@/components/ui/stepper';

export interface TitleStatusStep {
  id: string;
  title: string;
}

interface TitleStatusStepperLabels {
  completed: string;
  active: string;
  upcoming: string;
}

const DEFAULT_LABELS: TitleStatusStepperLabels = {
  completed: 'Готово',
  active: 'Текущий блок',
  upcoming: 'Ожидает',
};

export interface TitleStatusStepperProps {
  steps: TitleStatusStep[];
  activeIndex: number;
  onStepChange?: (nextIndex: number) => void;
  className?: string;
  labels?: Partial<TitleStatusStepperLabels>;
  disableFutureSteps?: boolean;
}

export function TitleStatusStepper({
  steps,
  activeIndex,
  onStepChange,
  className,
  labels,
  disableFutureSteps = false,
}: TitleStatusStepperProps) {
  const mergedLabels = { ...DEFAULT_LABELS, ...labels };

  const handleValueChange = (value: number) => {
    const nextIndex = Math.max(0, Math.min(steps.length - 1, value - 1));
    if (disableFutureSteps && nextIndex > activeIndex) return;
    if (nextIndex === activeIndex) return;
    onStepChange?.(nextIndex);
  };

  return (
    <Stepper
      value={Math.min(steps.length, Math.max(1, activeIndex + 1))}
      onValueChange={handleValueChange}
      indicators={{ completed: <Check className="h-4 w-4" /> }}
      className={cn('space-y-3', className)}
    >
      <StepperNav className="flex w-full flex-wrap gap-3">
        {steps.map((step, index) => {
          const isCompleted = index < activeIndex;
          const status = isCompleted
            ? mergedLabels.completed
            : index === activeIndex
              ? mergedLabels.active
              : mergedLabels.upcoming;

          return (
            <StepperItem
              key={step.id}
              step={index + 1}
              completed={isCompleted}
              disabled={disableFutureSteps && index > activeIndex}
              className="min-w-[220px] flex-1 items-stretch"
            >
              <StepperTrigger
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors',
                  'data-[state=active]:border-primary data-[state=active]:bg-primary/5',
                  'data-[state=completed]:border-primary/60 data-[state=completed]:bg-primary/5',
                  'data-[state=inactive]:border-border data-[state=inactive]:bg-muted/20',
                )}
              >
                <StepperIndicator className="flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold data-[state=completed]:border-primary data-[state=active]:border-primary">
                  {index + 1}
                </StepperIndicator>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold leading-snug">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{status}</p>
                </div>
              </StepperTrigger>
            </StepperItem>
          );
        })}
      </StepperNav>
    </Stepper>
  );
}

