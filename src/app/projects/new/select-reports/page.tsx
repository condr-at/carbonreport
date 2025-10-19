'use client';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getAllReportTemplates } from '@/lib/report-templates';
import { getRecommendedTemplates } from '@/lib/questionnaires/wizard-config';

export default function SelectReportsPage() {
  const router = useRouter();
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectName, setProjectName] = useState('');

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

  const allTemplates = getAllReportTemplates();

  const handleToggleTemplate = (code: string) => {
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

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectData.name,
          templateCodes: selectedTemplates,
          userId: '550e8400-e29b-41d4-a716-446655440000', // Mock user ID
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create project');
      }

      const result = await response.json();

      // Clear sessionStorage
      sessionStorage.removeItem('projectData');
      sessionStorage.removeItem('recommendedTemplates');

      // Redirect to project overview
      router.push(`/projects/${result.project.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      alert(error instanceof Error ? error.message : 'Failed to create project');
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
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
            onClick={() => {
              sessionStorage.removeItem('projectData');
              sessionStorage.removeItem('recommendedTemplates');
              router.push('/dashboard');
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-primary rounded-full" />
          <div className="flex-1 h-2 bg-primary rounded-full" />
          <div className="flex-1 h-2 bg-primary rounded-full" />
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
                  className="flex items-start space-x-4 p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleToggleTemplate(template.code)}
                >
                  <Checkbox
                    id={template.code}
                    checked={selectedTemplates.includes(template.code)}
                    onCheckedChange={() => handleToggleTemplate(template.code)}
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
    </DashboardLayout>
  );
}
