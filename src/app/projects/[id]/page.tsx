import { ProjectLayout } from '@/components/layouts/project-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, FileText, Database, TrendingUp, MailQuestion } from 'lucide-react';
import Link from 'next/link';
import { ProjectRoadmap } from '@/components/project-roadmap';
import { ProjectPrefillHydrator } from '@/components/project-prefill-hydrator';
import ProjectLoading from './loading';
import { getBaseUrl } from '@/lib/server-utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

type ProjectFetchStatus = 'ok' | 'not-found' | 'error';

interface ProjectFetchResult<TProject> {
  status: ProjectFetchStatus;
  project: TProject | null;
}

async function getProject(id: string): Promise<ProjectFetchResult<any>> {
  const baseUrl = await getBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/api/projects/${id}`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const project = await res.json();
      return { status: 'ok', project };
    }

    if (res.status === 404) {
      return { status: 'not-found', project: null };
    }

    console.error(`Failed to fetch project ${id}:`, res.status, res.statusText);
    return { status: 'error', project: null };
  } catch (error) {
    console.error('Error fetching project:', error);
    return { status: 'error', project: null };
  }
}

export default async function ProjectOverviewPage({ params }: PageProps) {
  const { id } = await params;
  const { status, project } = await getProject(id);

  if (status !== 'ok' || !project) {
    return (
      <ProjectLoading initialPendingState={status === 'error' ? 'error' : 'idle'} />
    );
  }

  // Calculate completion from reports
  const totalReports = project.reports?.length || 0;
  const avgCompletion = totalReports > 0
    ? project.reports.reduce((sum: number, r: any) => sum + (r.completion || 0), 0) / totalReports
    : 0;

  // Get incomplete roadmap items
  const incompleteItems = project.checklist?.items?.filter((item: any) => !item.completed) || [];

  // Mock roadmap data (replace with real data from project.checklist when ready)
  const mockRoadmapItems = [
    { id: '1', title: 'Product Name', completed: true },
    { id: '2', title: 'Product Description', completed: true },
    { id: '3', title: 'Product Weight', completed: true },
    { id: '4', title: 'Material Name (Item 1)', completed: false },
    { id: '5', title: 'Material Amount (Item 1)', completed: false },
    { id: '6', title: 'Energy Consumption Total', completed: false },
    { id: '7', title: 'Transport Distance (Air)', completed: false },
    { id: '8', title: 'Transport Distance (Sea)', completed: false },
    { id: '9', title: 'Transport Distance (Road)', completed: false },
    { id: '10', title: 'Electricity Consumption', completed: false },
    { id: '11', title: 'Fuel Consumption', completed: false },
    { id: '12', title: 'Waste Generated', completed: false },
    { id: '13', title: 'Packaging Material', completed: false },
    { id: '14', title: 'End-of-Life Treatment', completed: false },
    { id: '15', title: 'Total Carbon Emissions', completed: false },
    { id: '16', title: 'Emission Factor (Scope 1)', completed: false },
    { id: '17', title: 'Emission Factor (Scope 2)', completed: false },
    { id: '18', title: 'Emission Factor (Scope 3)', completed: false },
    { id: '19', title: 'Water Consumption', completed: false },
    { id: '20', title: 'Company Name', completed: false },
    { id: '21', title: 'Company Address', completed: false },
    { id: '22', title: 'Production Volume', completed: false },
    { id: '23', title: 'Reporting Period Start', completed: false },
    { id: '24', title: 'Reporting Period End', completed: false },
    { id: '25', title: 'Recycled Content Percentage', completed: false },
    { id: '26', title: 'Renewable Energy Percentage', completed: false },
    { id: '27', title: 'Carbon Offset Credits', completed: false },
    { id: '28', title: 'Third-Party Verification', completed: false },
    { id: '29', title: 'Functional Unit', completed: false },
    { id: '30', title: 'Reference Flow', completed: false },
  ];

  const mockIncompleteCount = mockRoadmapItems.filter(item => !item.completed).length;

  // Count pending data requests (placeholder - will be real API later)
  const pendingDataRequests = 0; // TODO: Get from API when data_requests table implemented

  return (
    <ProjectLayout project={project}>
      <ProjectPrefillHydrator
        project={{
          id: project.id,
          name: project.name,
          status: project.status,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          datasetVersion: project.datasetVersion,
        }}
        reports={project.reports}
      />
      <div className="space-y-6">
        {/* Three Columns Layout */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column: Stats Cards (stacked vertically) */}
          <div className="space-y-4">
            {/* Overall Completion Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Overall Completion</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{Math.round(avgCompletion)}%</div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${avgCompletion}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Reports Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalReports}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {project.reports?.map((r: any) => r.templateCode).join(', ') || 'None'}
                </p>
              </CardContent>
            </Card>

            {/* Dataset Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Dataset</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {project.dataset?.data_points?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Data points</p>
              </CardContent>
            </Card>

            {/* Pending Data Requests Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <MailQuestion className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingDataRequests}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column: Recent Activity (full height) */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest changes to this project</CardDescription>
            </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto max-h-[546px]">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Report updated</p>
                  <p className="text-xs text-muted-foreground">ISO 14067 PCF - 2 hours ago</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Dataset edited</p>
                  <p className="text-xs text-muted-foreground">
                    3 data points updated - Yesterday
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Data requested</p>
                  <p className="text-xs text-muted-foreground">
                    Electricity consumption data from John Smith - 2 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Report completion increased</p>
                  <p className="text-xs text-muted-foreground">CBAM Report now at 75% - 3 days ago</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Checklist updated</p>
                  <p className="text-xs text-muted-foreground">
                    Marked &quot;Gather raw data&quot; as complete - 4 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Report created</p>
                  <p className="text-xs text-muted-foreground">Added CBAM Report - 5 days ago</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Dataset edited</p>
                  <p className="text-xs text-muted-foreground">5 data points added - 5 days ago</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact added</p>
                  <p className="text-xs text-muted-foreground">John Smith - 6 days ago</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Data requested</p>
                  <p className="text-xs text-muted-foreground">
                    Transportation emissions from Sarah Johnson - 1 week ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Report updated</p>
                  <p className="text-xs text-muted-foreground">
                    ISO 14067 PCF - Field &quot;Product weight&quot; filled - 1 week ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Dataset edited</p>
                  <p className="text-xs text-muted-foreground">
                    Updated &quot;Raw materials&quot; section - 1 week ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Data request revoked</p>
                  <p className="text-xs text-muted-foreground">
                    Cancelled request to Mike Brown - 1 week ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Report completion increased</p>
                  <p className="text-xs text-muted-foreground">
                    ISO 14067 PCF now at 45% - 8 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact added</p>
                  <p className="text-xs text-muted-foreground">Sarah Johnson - 9 days ago</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Checklist updated</p>
                  <p className="text-xs text-muted-foreground">
                    Marked &quot;Select report templates&quot; as complete - 9 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Dataset edited</p>
                  <p className="text-xs text-muted-foreground">
                    Added &quot;Energy consumption&quot; data points - 10 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Report created</p>
                  <p className="text-xs text-muted-foreground">Added ISO 14067 PCF - 10 days ago</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Project status changed</p>
                  <p className="text-xs text-muted-foreground">
                    Changed from Draft to Active - 11 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Checklist updated</p>
                  <p className="text-xs text-muted-foreground">
                    Marked &quot;Define project scope&quot; as complete - 11 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Dataset edited</p>
                  <p className="text-xs text-muted-foreground">
                    Updated &quot;Transport distance&quot; fields - 12 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Data requested</p>
                  <p className="text-xs text-muted-foreground">
                    Fuel consumption data from Mike Brown - 12 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Report updated</p>
                  <p className="text-xs text-muted-foreground">
                    CBAM Report - Field &quot;Company name&quot; filled - 13 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact added</p>
                  <p className="text-xs text-muted-foreground">Mike Brown - 13 days ago</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Dataset edited</p>
                  <p className="text-xs text-muted-foreground">
                    Added &quot;Waste generated&quot; data point - 14 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Report completion increased</p>
                  <p className="text-xs text-muted-foreground">
                    ISO 14067 PCF now at 30% - 14 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Checklist updated</p>
                  <p className="text-xs text-muted-foreground">
                    Marked &quot;Collect material data&quot; as in-progress - 15 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Data requested</p>
                  <p className="text-xs text-muted-foreground">
                    Packaging material info from supplier - 15 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Dataset edited</p>
                  <p className="text-xs text-muted-foreground">
                    Added &quot;End-of-life treatment&quot; data - 16 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Report updated</p>
                  <p className="text-xs text-muted-foreground">
                    ISO 14067 PCF - Multiple fields updated - 16 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Data request completed</p>
                  <p className="text-xs text-muted-foreground">
                    Received transport data from Sarah Johnson - 17 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Dataset edited</p>
                  <p className="text-xs text-muted-foreground">
                    Updated &quot;Material amounts&quot; - 18 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Report completion increased</p>
                  <p className="text-xs text-muted-foreground">
                    CBAM Report now at 25% - 18 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Checklist updated</p>
                  <p className="text-xs text-muted-foreground">
                    Marked &quot;Set up project structure&quot; as complete - 19 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Dataset edited</p>
                  <p className="text-xs text-muted-foreground">
                    Initial dataset structure created - 19 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Report template selected</p>
                  <p className="text-xs text-muted-foreground">
                    Added ISO 14067 and CBAM templates - 20 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Project name updated</p>
                  <p className="text-xs text-muted-foreground">
                    Renamed to current name - 20 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Mailto template customized</p>
                  <p className="text-xs text-muted-foreground">
                    Updated template for energy data requests - 21 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Data requested</p>
                  <p className="text-xs text-muted-foreground">
                    Emission factors from John Smith - 21 days ago
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Dataset version updated</p>
                  <p className="text-xs text-muted-foreground">Version 5 saved - 22 days ago</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Project created</p>
                  <p className="text-xs text-muted-foreground">3 weeks ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Project Roadmap (full height) */}
          <ProjectRoadmap items={mockRoadmapItems} incompleteCount={mockIncompleteCount} />
        </div>
      </div>
    </ProjectLayout>
  );
}
