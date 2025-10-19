'use client';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
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
          };
        }
      } catch {}
      return undefined;
    })(),
  });

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

    sessionStorage.setItem('projectData', JSON.stringify({ name, description: '' }));
    router.push('/projects/new/select-reports');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
            <p className="text-muted-foreground mt-1">
              Step 1 of 3: Project Information
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
          <div className="flex-1 h-2 bg-primary rounded-full" />
          <div className="flex-1 h-2 bg-muted rounded-full" />
          <div className="flex-1 h-2 bg-muted rounded-full" />
        </div>

        {/* Form */}
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
                <Button type="submit" className="flex-1">
                  Next: Questionnaire
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleSkipToReports}
                >
                  Skip to Report Selection
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Helper text */}
        <div className="text-sm text-muted-foreground text-center">
          <p>
            Next: Answer a few questions to help us recommend the right reports,
            or skip directly to manual selection.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
