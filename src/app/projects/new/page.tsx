'use client';

import { PageHeader } from '@/components/layouts/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, X, Building, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { clearWizardProgress, hasAnyWizardProgress } from '@/lib/wizard-progress';

const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().optional(),
  type: z.enum(['corporate', 'product'], { required_error: 'Please select a project type' }),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [storedProgress, setStoredProgress] = useState(false);
  const [step, setStep] = useState<'type-selection' | 'details'>('type-selection');
  const exitTargetRef = useRef<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: (() => {
      if (typeof window === 'undefined') return undefined;
      try {
        const stored = sessionStorage.getItem('projectData');
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<ProjectFormData>;
          return {
            name: parsed.name || '',
            description: parsed.description || '',
            type: parsed.type,
          };
        }
      } catch {}
      return undefined;
    })(),
  });

  const nameValue = watch('name');
  const descriptionValue = watch('description');
  const typeValue = watch('type');

  useEffect(() => {
    setStoredProgress(hasAnyWizardProgress());
    // If type is already selected (e.g. from back button or prefill), go to details
    if (typeValue) {
      setStep('details');
    }
  }, [typeValue]);

  const hasProgress =
    storedProgress ||
    Boolean(nameValue?.trim()) ||
    Boolean(descriptionValue?.trim()) ||
    Boolean(typeValue);

  const requestExit = (target: string) => {
    if (!hasProgress) {
      clearWizardProgress();
      router.push(target);
      return;
    }

    exitTargetRef.current = target;
    setIsExitDialogOpen(true);
  };

  const handleExitCancel = () => {
    exitTargetRef.current = null;
    setIsExitDialogOpen(false);
  };

  const handleExitConfirm = () => {
    const target = exitTargetRef.current ?? '/dashboard';
    clearWizardProgress();
    setIsExitDialogOpen(false);
    exitTargetRef.current = null;
    router.push(target);
  };

  const handleTypeSelect = (type: 'corporate' | 'product') => {
    setValue('type', type);
    setStep('details');
  };

  const onSubmit = (data: ProjectFormData) => {
    // Store data in sessionStorage and navigate to questionnaire
    sessionStorage.setItem('projectData', JSON.stringify(data));
    router.push('/projects/new/questionnaire');
  };

  const handleSkipToReports = () => {
    // Get current form values
    const name = (document.getElementById('name') as HTMLInputElement)?.value;
    
    if (!name || name.length < 3) {
      alert('Please enter a project name (at least 3 characters)');
      return;
    }

    if (!typeValue) {
      alert('Please select a project type');
      setStep('type-selection');
      return;
    }

    sessionStorage.setItem('projectData', JSON.stringify({ name, description: descriptionValue || '', type: typeValue }));
    router.push('/projects/new/select-reports');
  };

  return (
    <>
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader
          title="Create New Project"
          description={step === 'type-selection' ? "Select the type of project you want to create." : "Provide the basic project details to get started."}
          actions={
            <Button
              variant="ghost"
              size="icon"
              onClick={() => requestExit('/dashboard')}
            >
              <X className="h-4 w-4" />
            </Button>
          }
        />

        {step === 'type-selection' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleTypeSelect('corporate')}
            >
              <CardHeader>
                <Building className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Organization (Corporate)</CardTitle>
                <CardDescription>
                  Report for the entire company (Scope 1, 2, 3), CSRD, GHG Protocol Corporate.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleTypeSelect('product')}
            >
              <CardHeader>
                <Package className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Product</CardTitle>
                <CardDescription>
                  Carbon footprint of a specific product, CBAM, ISO 14067.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        ) : (
          /* Form */
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Give your project a name and description
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Project Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Electric Bicycle Carbon Assessment"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of the project"
                    {...register('description')}
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep('type-selection')}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    Next: Questionnaire
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-muted-foreground"
                    onClick={handleSkipToReports}
                  >
                    Skip to Report Selection
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Helper text */}
        <div className="text-sm text-muted-foreground text-center">
          {step === 'type-selection' ? (
            <p>Select a project type to continue.</p>
          ) : (
            <p>
              Next: Answer a few questions to help us recommend the right reports,
              or skip directly to manual selection.
            </p>
          )}
        </div>
      </div>
      <AlertDialog open={isExitDialogOpen} onOpenChange={(open) => !open && handleExitCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave the project setup?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress in the project wizard will be cleared if you exit now.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleExitCancel}>Stay</AlertDialogCancel>
            <AlertDialogAction onClick={handleExitConfirm}>Leave wizard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
