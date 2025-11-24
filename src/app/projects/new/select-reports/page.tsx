'use client';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layouts/page-header';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useRef } from 'react';
import { getAllReportTemplates } from '@/lib/report-templates';
import type { EvaluationResult } from '@/lib/questionnaires/decision-engine';
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
  const [mandatoryTemplates, setMandatoryTemplates] = useState<Set<string>>(new Set());
  const [recommendedTemplates, setRecommendedTemplates] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [hasStoredProgress, setHasStoredProgress] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const exitTargetRef = useRef<string | null>(null);
  const { activeOrganizationId, currentOrganization, isLoading: organizationsLoading, isBootstrapping } = useOrganizationContext();
  const organizationId = activeOrganizationId ?? currentOrganization?.id ?? null;
  const isOrgContextLoading = organizationsLoading || isBootstrapping;

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

    const recommendedStr = sessionStorage.getItem('recommendedTemplates');
    const decisionStr = sessionStorage.getItem('decisionEngineResult');

    const initialSelected = new Set<string>();
    const mandatory = new Set<string>();
    const recommended = new Set<string>();

    if (recommendedStr) {
      try {
        const parsed = JSON.parse(recommendedStr) as string[];
        parsed.forEach((code) => initialSelected.add(code));
      } catch (error) {
        console.warn('Failed to parse recommendedTemplates from sessionStorage', error);
      }
    }

    if (decisionStr) {
      try {
        const parsed = JSON.parse(decisionStr) as EvaluationResult;
        const extractTemplateCodes = (reports: { id: string; definition?: { category?: string } }[]) => {
          return reports
            .map((report) => report.id)
            .filter((id): id is string => typeof id === 'string' && id.length > 0);
        };

        // We only track mandatory/recommended flags by template code; mapping is already applied on questionnaire step
        const engineRecommended = new Set<string>();
        if (recommendedStr) {
          try {
            const parsedTemplates = JSON.parse(recommendedStr) as string[];
            parsedTemplates.forEach((code) => engineRecommended.add(code));
          } catch {
            // ignore
          }
        }

        // Mark all mapped templates from mandatory reports as mandatory
        extractTemplateCodes(parsed.mandatoryReports).forEach((code) => {
          mandatory.add(code);
          initialSelected.add(code);
        });

        // Mark templates from recommended reports as recommended (but not mandatory)
        extractTemplateCodes(parsed.recommendedReports).forEach((code) => {
          if (!mandatory.has(code)) {
            recommended.add(code);
            initialSelected.add(code);
          }
        });

        // Optional reports do not affect mandatory/recommended flags here
      } catch (error) {
        console.warn('Failed to parse decisionEngineResult from sessionStorage', error);
      }
    }

    setSelectedTemplates(Array.from(initialSelected));
    setMandatoryTemplates(mandatory);
    setRecommendedTemplates(recommended);
  }, [router]);

  useEffect(() => {
    setHasStoredProgress(hasAnyWizardProgress());
  }, []);

  useEffect(() => {
    if (!isOrgContextLoading && !organizationId) {
      router.push('/no-organization');
    }
  }, [isOrgContextLoading, organizationId, router]);

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
    <>
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader
          title="Create New Project"
          description="Choose which reporting standards you want to include."
          actions={
            <Button
              variant="ghost"
              size="icon"
              onClick={() => requestExit('/dashboard')}
              disabled={isSubmitting}
              className={isSubmitting ? 'pointer-events-none opacity-60' : undefined}
            >
              <X className="h-4 w-4" />
            </Button>
          }
        />

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
              {allTemplates.map((template) => {
                const isMandatory = mandatoryTemplates.has(template.code);
                const isRecommended = !isMandatory && recommendedTemplates.has(template.code);
                const checked = selectedTemplates.includes(template.code);

                return (
                <div
                  key={template.code}
                  className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                    isSubmitting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-accent'
                  }`}
                  onClick={() => !isMandatory && handleToggleTemplate(template.code)}
                >
                  <Checkbox
                    id={template.code}
                    checked={checked}
                    onCheckedChange={() => !isMandatory && handleToggleTemplate(template.code)}
                    disabled={isSubmitting || isMandatory}
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
                    {(isMandatory || isRecommended) && (
                      <p className="text-xs font-medium text-primary">
                        {isMandatory ? 'Обязательно по требованиям' : 'Рекомендовано движком'}
                      </p>
                    )}
                  </div>
                </div>
              );})}
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
    </>
  );
}
