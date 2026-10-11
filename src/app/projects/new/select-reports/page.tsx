'use client';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layouts/page-header';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getReportTemplate, type ReportTemplate } from '@/lib/report-templates';
import { evaluateQuestionnaire, removeHiddenAnswers, type AnswerMap, type EvaluationResult } from '@/lib/questionnaires/decision-engine';
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
import {
  USER_FACING_REPORT_TEMPLATE_ORDER,
  getUserFacingReportMeta,
} from '@/lib/report-templates/user-facing';
import { deriveTemplateSelection, isSelectableReportTemplate, type TemplateSelection } from '@/lib/questionnaires/report-template-mapping';
import { organizationKeys, projectKeys } from '@/lib/data-client/keys';

export default function SelectReportsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<TemplateSelection['recommendations']>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState<'corporate' | 'product' | null>(null);
  const [hasStoredProgress, setHasStoredProgress] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const exitTargetRef = useRef<string | null>(null);
  const { activeOrganizationId, currentOrganization, isLoading: organizationsLoading, isBootstrapping } = useOrganizationContext();
  const organizationId = activeOrganizationId ?? currentOrganization?.id ?? null;
  const isOrgContextLoading = organizationsLoading || isBootstrapping;
  const mandatoryTemplates = useMemo(() => new Set(
    Object.entries(recommendations).filter(([, item]) => item?.level === 'mandatory').map(([code]) => code),
  ), [recommendations]);

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
    const scope = projectData.type === 'product' || projectData.type === 'corporate' ? projectData.type : null;
    setProjectType(scope);

    const decisionStr = sessionStorage.getItem('decisionEngineResult');

    let evaluation: EvaluationResult | null = null;
    const answersStr = sessionStorage.getItem('wizardAnswers');
    if (answersStr) {
      try {
        const answers = JSON.parse(answersStr);
        const validAnswers = answers && typeof answers === 'object' && !Array.isArray(answers) &&
          Object.values(answers).every((value) => value === null || typeof value === 'string' ||
            (Array.isArray(value) && value.every((item) => typeof item === 'string')));
        if (validAnswers) {
          evaluation = evaluateQuestionnaire(removeHiddenAnswers(answers as AnswerMap));
          sessionStorage.setItem('decisionEngineResult', JSON.stringify(evaluation));
        }
      } catch (error) {
        console.warn('Failed to refresh questionnaire recommendations', error);
      }
    }
    if (!evaluation && decisionStr) {
      try {
        evaluation = JSON.parse(decisionStr) as EvaluationResult;
      } catch (error) {
        console.warn('Failed to parse decisionEngineResult from sessionStorage', error);
      }
    }
    if (evaluation) {
      const selection = deriveTemplateSelection(evaluation, scope);
      setSelectedTemplates(selection.initiallySelected);
      setRecommendations(selection.recommendations);
      sessionStorage.setItem('recommendedTemplates', JSON.stringify(selection.initiallySelected));
    } else {
      // Legacy code-only caches cannot distinguish optional suggestions, format
      // alternatives or unresolved applicability. Let the user choose afresh.
      sessionStorage.removeItem('recommendedTemplates');
      setSelectedTemplates([]);
      setRecommendations({});
    }
  }, [router]);

  useEffect(() => {
    setHasStoredProgress(hasAnyWizardProgress());
  }, []);

  useEffect(() => {
    if (!isOrgContextLoading && !organizationId) {
      router.push('/no-organization');
    }
  }, [isOrgContextLoading, organizationId, router]);

  const userFacingTemplates = useMemo(() => {
    return USER_FACING_REPORT_TEMPLATE_ORDER
      .filter((code) => isSelectableReportTemplate(code, projectType))
      .map((code) => getReportTemplate(code))
      .filter((template): template is ReportTemplate => Boolean(template));
  }, [projectType]);
  
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

  const handleTemplateSelection = (code: string, checked: boolean) => {
    if (isSubmitting || mandatoryTemplates.has(code) || !isSelectableReportTemplate(code, projectType)) return;
    setSelectedTemplates((prev) =>
      checked
        ? prev.includes(code) ? prev : [...prev, code]
        : prev.filter((c) => c !== code)
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
          type: projectData.type,
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

      void queryClient.invalidateQueries({ queryKey: projectKeys.list(organizationId) });
      void queryClient.invalidateQueries({ queryKey: organizationKeys.current(organizationId) });
      void queryClient.invalidateQueries({ queryKey: organizationKeys.usage(organizationId) });
      void queryClient.invalidateQueries({ queryKey: organizationKeys.list(false) });
      void queryClient.invalidateQueries({ queryKey: organizationKeys.list(true) });

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
          description="Choose data templates for your reporting needs."
          actions={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close project wizard"
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
              Choose data templates for {projectName || 'this project'}. CBAM Supplier Review Package includes a guided form and ZIP download. Other templates support data collection; official submissions are not available.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {userFacingTemplates.map((template) => {
                const isMandatory = mandatoryTemplates.has(template.code);
                const recommendation = recommendations[template.code];
                const checked = selectedTemplates.includes(template.code);
                const meta = getUserFacingReportMeta(template.code);

                return (
                <label
                  key={template.code}
                  htmlFor={template.code}
                  className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                    isSubmitting || isMandatory ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-accent'
                  }`}
                >
                  <Checkbox
                    id={template.code}
                    aria-labelledby={`report-title-${template.code}`}
                    aria-describedby={`report-description-${template.code}${recommendation ? ` report-recommendation-${template.code}` : ''}`}
                    checked={checked}
                    onCheckedChange={(nextChecked) => handleTemplateSelection(template.code, nextChecked === true)}
                    disabled={isSubmitting || isMandatory}
                  />
                  <span className="flex-1 space-y-1">
                    <span id={`report-title-${template.code}`} className="block text-sm font-medium">
                      {meta?.title ?? template.name}
                    </span>
                    <span id={`report-description-${template.code}`} className="block text-sm text-muted-foreground">
                      {meta?.subtitle ?? template.description ?? `Version ${template.version ?? '1.0'}`}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Use when: {meta?.useWhen ?? template.description ?? 'Choose this template to include it in the project.'}
                    </span>
                    {recommendation && (
                      <span id={`report-recommendation-${template.code}`} className="block space-y-1 text-xs">
                        <span className="block font-medium text-primary">
                          {{ mandatory: 'Required by confirmed requirements', review: 'Check applicability', recommended: 'Recommended', choice: 'Choose the required format', optional: 'Optional suggestion' }[recommendation.level]}
                        </span>
                        {recommendation.reasons.map((reason) => <span key={reason} className="block text-muted-foreground">{reason}</span>)}
                        {recommendation.checks.length > 0 && (
                          <span className="block text-muted-foreground">Check: {recommendation.checks.join(' · ')}</span>
                        )}
                      </span>
                    )}
                  </span>
                </label>
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
            Selected report types determine which fields your project collects.
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
