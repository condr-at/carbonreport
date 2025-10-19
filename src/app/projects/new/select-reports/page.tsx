'use client';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { MainSidebar } from '@/components/layouts/main-sidebar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useRef } from 'react';
import { getAllReportTemplates } from '@/lib/report-templates';
import { getRecommendedTemplates } from '@/lib/questionnaires/wizard-config';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
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
import { saveProjectPrefill } from '@/lib/project-prefill';

export default function SelectReportsPage() {
  const router = useRouter();
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [hasStoredProgress, setHasStoredProgress] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const exitTargetRef = useRef<string | null>(null);

  useEffect(() => {
    // Load project data from sessionStorage
    const projectDataStr = sessionStorage.getItem('projectData');
    if (!projectDataStr) {
      // No project data, redirect back
      router.push('/projects/new');
      return;
    }

    const projectData = JSON.parse(projectDataStr);
    setProjectName(projectData.name || '');

    // Calculate recommendations from wizard answers
    const wizardAnswersStr = sessionStorage.getItem('wizardAnswers');
    if (wizardAnswersStr) {
      const wizardAnswers = JSON.parse(wizardAnswersStr);
      const recommended = getRecommendedTemplates(wizardAnswers);
      setSelectedTemplates(recommended);
    } else {
      // Fallback: check old recommendedTemplates format
      const recommendedStr = sessionStorage.getItem('recommendedTemplates');
      if (recommendedStr) {
        const recommended = JSON.parse(recommendedStr);
        setSelectedTemplates(recommended);
      }
    }
  }, [router]);

  useEffect(() => {
    setHasStoredProgress(hasAnyWizardProgress());
  }, []);

  const allTemplates = useMemo(() => getAllReportTemplates(), []);
  const hasSelection = selectedTemplates.length > 0;
  const hasProgress = hasStoredProgress || hasSelection;

  const requestExit = (target: string) => {
    if (isSubmitting) return;
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

  const handleToggleTemplate = (code: string) => {
    if (isSubmitting) return;
    setSelectedTemplates((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code]
    );
  };

  const handleSubmit = async () => {
    if (selectedTemplates.length === 0) {
      alert('Please select at least one report type');
      return;
    }

    const projectDataStr = sessionStorage.getItem('projectData');
    if (!projectDataStr) {
      router.push('/projects/new');
      return;
    }

    const projectData = JSON.parse(projectDataStr);

  setIsSubmitting(true);

    // Generate client-side ID (UUID v4) for immediate navigation
    const clientId = crypto.randomUUID();

    // Optimistic prefill and immediate navigation
    saveProjectPrefill({
      id: clientId,
      name: projectData.name,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      datasetVersion: 0,
      reportsCount: selectedTemplates.length,
      completion: 0,
      templateCodes: selectedTemplates,
      source: 'project-create',
    });

    // Clear wizard progress before navigation
    clearWizardProgress();

    // Navigate immediately using the client-generated ID
    router.push(`/projects/${clientId}`);

    // Fire-and-forget: create on server with the same ID to converge
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: clientId,
          name: projectData.name,
          templateCodes: selectedTemplates,
          userId: '550e8400-e29b-41d4-a716-446655440000', // Mock user ID
        }),
      });

      if (!response.ok) {
        // Optional: could update a transient error state in prefill
        console.error('Background project create failed', await response.json());
      } else {
        const result = await response.json();
        // Server will hydrate via ProjectPrefillHydrator when page loads
      }
    } catch (error) {
      console.error('Error creating project (background):', error);
    } finally {
      // Allow the button to return to idle if we’re still on this screen (e.g. navigation failed).
      setIsSubmitting(false);
    }
  };
  const handleBack = () => {
    if (isSubmitting) return;
    router.push('/projects/new/questionnaire?resume=1');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
            <p className="text-muted-foreground mt-1">
              Step 3 of 3: Select Report Types
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => requestExit('/dashboard')}
            disabled={isSubmitting}
            className={isSubmitting ? 'pointer-events-none opacity-60' : undefined}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-primary rounded-full" />
          <div className="flex-1 h-2 bg-primary rounded-full" />
          <div className={`flex-1 h-2 rounded-full ${hasSelection ? 'bg-primary' : 'bg-primary/40'}`} />
        </div>

        {/* Report Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Report Types</CardTitle>
            <CardDescription>
              Choose which reporting standards you need for {projectName || 'this project'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {allTemplates.map((template) => (
                <div
                  key={template.code}
                  className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                    isSubmitting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-accent'
                  }`}
                  onClick={() => handleToggleTemplate(template.code)}
                >
                  <Checkbox
                    id={template.code}
                    checked={selectedTemplates.includes(template.code)}
                    onCheckedChange={() => handleToggleTemplate(template.code)}
                    disabled={isSubmitting}
                  />
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor={template.code}
                      className="font-medium cursor-pointer"
                    >
                      {template.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Version {template.version} — {template.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {selectedTemplates.length === 0 && (
              <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                ℹ️ Please select at least one report type to continue
              </div>
            )}

            <div className="flex items-center gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={handleSubmit}
                disabled={selectedTemplates.length === 0 || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Project...
                  </>
                ) : (
                  <>Create Project ({selectedTemplates.length} {selectedTemplates.length === 1 ? 'report' : 'reports'})</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Helper text */}
        <div className="text-sm text-muted-foreground text-center">
          <p>
            You can add or remove report types anytime after creating the project.
          </p>
        </div>
      </div>
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex overflow-hidden bg-background/95 backdrop-blur-sm">
          <div className="absolute right-8 top-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner size="md" variant="default" />
            <span>Создаём проект…</span>
          </div>
          <div className="pointer-events-none opacity-90" aria-hidden="true">
            <MainSidebar />
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto max-w-7xl space-y-6 p-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-64 rounded-lg" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-48 rounded-md" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                  </div>
                </div>
                <div className="border-b border-accent/40 pb-2">
                  <div className="flex gap-6">
                    {[120, 96, 108, 102].map((width, index) => (
                      <div key={index} className="pb-4">
                        <Skeleton className="h-4 rounded-md" style={{ width: `${width}px` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-accent/35 bg-background/40 p-6"
                    >
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32 rounded-md" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </div>
                      <div className="space-y-4 pt-4">
                        <Skeleton className="h-8 w-24 rounded-md" />
                        {index === 0 ? (
                          <div className="h-3 w-full overflow-hidden rounded-full border border-accent/25 bg-background/60">
                            <Skeleton className="h-full w-3/4 rounded-full" />
                          </div>
                        ) : (
                          <Skeleton className="h-3 w-3/4 rounded-md" />
                        )}
                        {index !== 0 && (
                          <Skeleton className="h-3 w-2/3 rounded-md" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-accent/35 bg-background/40 p-6">
                  <div className="space-y-2 border-b border-accent/25 pb-4">
                    <Skeleton className="h-5 w-40 rounded-md" />
                    <Skeleton className="h-4 w-56 rounded-md" />
                  </div>
                  <div className="max-h-[546px] space-y-4 overflow-hidden pt-4">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <div key={index} className="space-y-2">
                        <Skeleton className="h-4 w-48 rounded-md" />
                        <Skeleton className="h-3 w-60 rounded-md" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-accent/35 bg-background/40 p-6">
                  <div className="flex items-start justify-between border-b border-accent/25 pb-4">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-44 rounded-md" />
                      <Skeleton className="h-4 w-36 rounded-md" />
                    </div>
                    <Skeleton className="h-9 w-28 rounded-md" />
                  </div>
                  <div className="max-h-[546px] space-y-3 overflow-hidden pt-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Skeleton className="mt-1 h-5 w-5 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-full rounded-md" />
                          <Skeleton className="h-3 w-48 rounded-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <AlertDialog open={isExitDialogOpen} onOpenChange={(open) => !open && handleExitCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave the project wizard?</AlertDialogTitle>
            <AlertDialogDescription>
              Selected report types and form data will be cleared if you exit now.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleExitCancel}>Stay</AlertDialogCancel>
            <AlertDialogAction onClick={handleExitConfirm}>Leave wizard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
