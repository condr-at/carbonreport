import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { NextStepsWidget } from '@/components/blocks/next-steps-widget';
import { PageHeader } from '@/components/layouts/page-header';
import { getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';
import { MarkDashboardVisited } from '@/components/dashboard/mark-visited';
import prisma from '@/lib/db';
import { DashboardGreeting } from '@/components/dashboard/dashboard-greeting';
import { OrganizationMembershipInviteStatus, OrganizationStatus, ProjectStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

function getGreetingName(user: Awaited<ReturnType<typeof getCurrentUser>>) {
  const normalized = (value?: string | null) => value?.trim() ?? '';
  const first = normalized(user.firstName);
  if (first) {
    return first;
  }

  const fullName = normalized(user.name);
  if (fullName) {
    const [firstToken] = fullName.split(/\s+/);
    if (firstToken) {
      return firstToken;
    }
  }

  const fallbackLast = normalized(user.lastName);
  if (fallbackLast) {
    return fallbackLast;
  }

  const emailHandle = user.email.split('@')[0];
  if (emailHandle) {
    return emailHandle;
  }

  return null;
}

async function getProjects(userId: string) {
  try {
    // 1. Find the "current" organization (first accepted membership)
    const membership = await prisma.organizationMembership.findFirst({
      where: {
        userId: userId,
        inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
        organization: {
          status: {
            not: OrganizationStatus.DELETED,
          },
        },
      },
      orderBy: [{ createdAt: 'asc' }],
      select: {
        organizationId: true,
      },
    });

    if (!membership) {
      return [];
    }

    const organizationId = membership.organizationId;

    // 2. Fetch projects for this organization
    const projects = await prisma.project.findMany({
      where: {
        organizationId: organizationId,
        status: {
          not: ProjectStatus.DELETED,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        reports: {
          select: {
            id: true,
            templateCode: true,
            completion: true,
          },
        },
      },
    });

    return projects.map((project) => ({
      id: project.id,
      name: project.name,
      status: project.status,
      createdAt: project.createdAt.toISOString(),
      reportsCount: project.reports.length,
      reports: project.reports.map((report) => ({
        id: report.id,
        templateCode: report.templateCode,
        completion: report.completion,
      })),
      checklist: project.checklist,
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const projects = await getProjects(user.id);
  const cookieStore = await cookies();
  const hasVisited = cookieStore.has('dashboard_visited');
  
  const greetingName = getGreetingName(user);
  
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
      <MarkDashboardVisited />
      <div className="space-y-6">
        <PageHeader
          title={<DashboardGreeting name={greetingName} hasVisited={hasVisited} />}
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
              <CardTitle className="text-sm font-medium">Reports in Projects</CardTitle>
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
