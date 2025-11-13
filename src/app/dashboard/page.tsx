import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { NextStepsWidget } from '@/components/blocks/next-steps-widget';
import { PageHeader } from '@/components/layouts/page-header';

export const dynamic = 'force-dynamic';

// Mock user for now (will be replaced with real auth)
const MOCK_USER = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'John Doe',
};

async function getProjects() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const organizationResponse = await fetch(`${baseUrl}/api/organizations/current`, {
      cache: 'no-store',
    })

    if (!organizationResponse.ok) {
      if (organizationResponse.status !== 404) {
        console.error('Failed to resolve current organization:', organizationResponse.statusText)
      }
      return []
    }

    const organizationData = await organizationResponse.json()
    const organizationId = organizationData?.organization?.id

    if (!organizationId) {
      return []
    }

    const response = await fetch(`${baseUrl}/api/projects?organization_id=${organizationId}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error('Failed to fetch projects:', response.statusText);
      return [];
    }
    
    const data = await response.json();
    return (data.projects || []).map((project: any) => ({
      id: project.id,
      name: project.name,
      status: project.status,
      createdAt: project.created_at,
      reportsCount: project.reports_count ?? project.reports?.length ?? 0,
      reports: Array.isArray(project.reports)
        ? project.reports.map((report: any) => ({
            id: report.id,
            templateCode: report.template_code,
            completion: report.completion,
          }))
        : [],
      checklist: project.checklist,
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default async function DashboardPage() {
  const projects = await getProjects();
  
  // Calculate stats
  const totalProjects = projects.length;
  const inProgressProjects = projects.filter((p: any) => {
    // Project is "in progress" if it has reports but not all are 100% complete
    const completion = p.reportsCount > 0 ? (p.reports?.some((r: any) => r.completion < 100)) : true;
    return p.status === 'ACTIVE' && completion;
  }).length;
  const completedProjects = projects.filter((p: any) => {
    // All reports are 100% complete
    return p.reportsCount > 0 && p.reports?.every((r: any) => r.completion === 100);
  }).length;
  const totalReports = projects.reduce((sum: number, p: any) => sum + (p.reportsCount || 0), 0);
  
  // Get current date/time
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title={`Hello, ${MOCK_USER.name} 👋`}
          description={dateStr}
          actions={(
            <Button asChild>
              <Link href="/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>
          )}
        />

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressProjects}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Being worked on
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedProjects}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Finished projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReports}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all projects
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Next Steps or Empty State */}
        {projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No projects yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create your first project to get started with carbon reporting
                  </p>
                </div>
                <Button asChild>
                  <Link href="/projects/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Next Steps Widget */}
            <NextStepsWidget projects={projects} />

            {/* Quick Actions or Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks to help you work faster</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/projects">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View All Projects
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/projects/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Project
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/contacts">
                    <Plus className="mr-2 h-4 w-4" />
                    Manage Contacts
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
