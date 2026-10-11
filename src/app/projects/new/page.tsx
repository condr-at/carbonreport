'use client';

import { PageHeader } from '@/components/layouts/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, X, Building, Package, ChevronDown, Sparkles } from 'lucide-react';
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
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const exitTargetRef = useRef<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    setError,
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
    if (typeValue === 'corporate') {
      setShowAdvancedOptions(true);
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
    const { name, description, type } = getValues();
    
    if (!name || name.length < 3) {
      setError('name', {
        type: 'manual',
        message: 'Project name must be at least 3 characters',
      });
      return;
    }

    if (!type) {
      setStep('type-selection');
      return;
    }

    sessionStorage.setItem('projectData', JSON.stringify({ name, description: description || '', type }));
    router.push('/projects/new/select-reports');
  };

  return (
    <>
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader
          title="Create New Project"
          description={step === 'type-selection' ? "Start with the reporting workflow that fits your project. Product carbon reporting is the recommended path for most teams." : "Provide the basic project details to get started."}
          actions={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close project wizard"
              onClick={() => requestExit('/dashboard')}
            >
              <X className="h-4 w-4" />
            </Button>
          }
        />

        {step === 'type-selection' ? (
          <div className="space-y-4">
            <Card 
              className="relative border-primary/40 bg-primary/5 transition-colors hover:border-primary"
            >
              <button
                type="button"
                className="absolute inset-0 cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-labelledby="product-project-title"
                aria-describedby="product-project-description"
                onClick={() => handleTypeSelect('product')}
              />
              <CardHeader>
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Package className="h-8 w-8" />
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-background px-2 py-1 text-xs font-medium">
                    <Sparkles className="h-3.5 w-3.5" />
                    Recommended
                  </span>
                </div>
                <CardTitle id="product-project-title">Product Carbon Project</CardTitle>
                <CardDescription id="product-project-description">
                  Best for CBAM, ISO 14067, PCF, EPD, and client-specific product reporting from one shared dataset.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Use this when one product or SKU is the reporting subject.</li>
                  <li>Recommended for supplier data collection and deadline-driven product compliance work.</li>
                </ul>
              </CardContent>
            </Card>

            <div className="rounded-lg border border-dashed p-4">
              <button
                type="button"
                className="flex w-full items-center justify-between text-left"
                aria-expanded={showAdvancedOptions}
                aria-controls="corporate-project-option"
                onClick={() => setShowAdvancedOptions((current) => !current)}
              >
                <div>
                  <p className="font-medium">Need broader corporate reporting?</p>
                  <p className="text-sm text-muted-foreground">
                    Reveal advanced options for company-level disclosures and inventories.
                  </p>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`}
                />
              </button>

              {showAdvancedOptions ? (
                <Card
                  id="corporate-project-option"
                  className="relative mt-4 transition-colors hover:border-primary"
                >
                  <button
                    type="button"
                    className="absolute inset-0 cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-labelledby="corporate-project-title"
                    aria-describedby="corporate-project-description"
                    onClick={() => handleTypeSelect('corporate')}
                  />
                  <CardHeader>
                    <Building className="mb-2 h-8 w-8 text-primary" />
                    <CardTitle id="corporate-project-title">Corporate Reporting Workspace</CardTitle>
                    <CardDescription id="corporate-project-description">
                      Advanced path for company-level disclosures such as CSRD, CDP, TCFD, and corporate GHG reporting.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      Use this when the reporting subject is the organization as a whole rather than a single product.
                    </p>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>
        ) : (
          /* Form */
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                {typeValue === 'corporate'
                  ? 'Set up the company-level reporting workspace.'
                  : 'Set up the product-level reporting workspace.'}
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
                    placeholder={typeValue === 'corporate' ? 'e.g., 2026 Corporate GHG Reporting Cycle' : 'e.g., Electric Bicycle Carbon Assessment'}
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
            <p>Most teams should start with a product project. Corporate reporting remains available as an advanced path.</p>
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
