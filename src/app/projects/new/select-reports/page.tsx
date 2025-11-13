'use client';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useRef } from 'react';
import { getAllReportTemplates } from '@/lib/report-templates';
import { getRecommendedTemplates } from '@/lib/questionnaires/wizard-config';
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
import { useOrganizationContext } from '@/lib/organizations/context';
import { notifications } from '@/components/ui/notifications';

export default function SelectReportsPage() {
  const router = useRouter();
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [hasStoredProgress, setHasStoredProgress] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const exitTargetRef = useRef<string | null>(null);
  const { activeOrganizationId, currentOrganization, isLoading: organizationsLoading } = useOrganizationContext();
  const organizationId = activeOrganizationId ?? currentOrganization?.id ?? null;

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

  useEffect(() => {
    if (!organizationsLoading && !organizationId) {
      router.push('/no-organization');
    }
  }, [organizationsLoading, organizationId, router]);

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

    if (!organizationId) {
      router.push('/no-organization');
      return;
    }

    const projectDataStr = sessionStorage.getItem('projectData');
    if (!projectDataStr) {
      router.push('/projects/new');
      return;
    }

    const projectData = JSON.parse(projectDataStr);

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organization_id: organizationId,
          name: projectData.name,
          template_codes: selectedTemplates,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message = errorBody?.error ?? 'Failed to create project. Please try again.';
        throw new Error(message);
      }

      const result = await response.json();
      const createdProject = result?.project;
      const createdReports = Array.isArray(result?.reports) ? result.reports : [];

      if (!createdProject?.id) {
        throw new Error('Created project response is missing an id.');
      }

      saveProjectPrefill({
        id: createdProject.id,
        name: createdProject.name ?? projectData.name,
        status: createdProject.status ?? 'ACTIVE',
        createdAt: createdProject.created_at ?? new Date().toISOString(),
        datasetVersion: createdProject.dataset_version ?? 0,
        reportsCount: createdReports.length,
        completion: 0,
        templateCodes: createdReports
          .map((report: any) => report?.template_code ?? report?.templateCode)
          .filter((code: unknown): code is string => typeof code === 'string' && code.length > 0),
        source: 'project-create',
      });

      clearWizardProgress();
      router.replace(`/projects/${createdProject.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      const fallbackMessage = error instanceof Error ? error.message : 'Failed to create project.';
      notifications.error(fallbackMessage);
    } finally {
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
