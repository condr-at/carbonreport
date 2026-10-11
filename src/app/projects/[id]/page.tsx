import { requirePageUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Database, TrendingUp, MailQuestion, CheckCircle2, Circle, Activity, ArrowRight, UserRound, ExternalLink } from 'lucide-react';
import { ProjectRoadmap } from '@/components/project-roadmap';
import { ProjectPrefillHydrator } from '@/components/project-prefill-hydrator';
import { getBaseUrl } from '@/lib/server-utils';
import { getProjectDataRequests, getProjectDataset } from '@/lib/server-data/projects';
import { buildProjectOverviewState, type OverviewChecklistItem } from '@/lib/projects/overview-state';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

type ProjectFetchStatus = 'ok' | 'not-found' | 'error';

interface ProjectFetchResult<TProject> {
  status: ProjectFetchStatus;
  project: TProject | null;
}

interface ProjectReport {
  id: string;
  templateCode: string;
  completion: number;
}

interface ProjectDetails {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  datasetVersion: number;
  reports: ProjectReport[];
  checklist?: unknown;
  ownerName?: string | null;
}

async function getProject(id: string): Promise<ProjectFetchResult<ProjectDetails>> {
  const baseUrl = await getBaseUrl();
  const headersList = await headers();

  try {
    const res = await fetch(`${baseUrl}/api/projects/${id}`, {
      cache: 'no-store',
      headers: {
        Cookie: headersList.get('Cookie') || '',
      },
    });

    if (res.ok) {
      const payload = await res.json().catch(() => null);
      const rawProject = payload?.project;

      if (!rawProject?.id) {
        console.error(`Project ${id} response missing payload.`);
        return { status: 'error', project: null };
      }

      const normalizedReports: ProjectReport[] = Array.isArray(rawProject.reports)
        ? rawProject.reports
            .map((report: any) => ({
              id: report?.id,
              templateCode: report?.template_code ?? report?.templateCode ?? '',
              completion: typeof report?.completion === 'number' ? report.completion : 0,
            }))
            .filter((report: ProjectReport) => Boolean(report.id))
        : [];

      const normalized: ProjectDetails = {
        id: rawProject.id,
        name: rawProject.name ?? 'Untitled project',
        status: rawProject.status ?? 'ACTIVE',
        createdAt: rawProject.created_at ?? rawProject.createdAt ?? new Date().toISOString(),
        updatedAt: rawProject.updated_at ?? rawProject.updatedAt ?? rawProject.created_at ?? rawProject.createdAt ?? null,
        datasetVersion: rawProject.dataset_version ?? rawProject.datasetVersion ?? 0,
        reports: normalizedReports,
        checklist: rawProject.checklist ?? null,
        ownerName: rawProject.owner_name ?? rawProject.ownerName ?? null,
      };

      return { status: 'ok', project: normalized };
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

function parseChecklistItems(value: unknown): OverviewChecklistItem[] {
  if (!value || typeof value !== 'object') {
    return [];
  }

  const items = (value as { items?: unknown }).items;
  if (!Array.isArray(items)) {
    return [];
  }

  const parsed: OverviewChecklistItem[] = [];

  for (const item of items) {
    if (!item || typeof item !== 'object') {
      continue;
    }

    const raw = item as Record<string, unknown>;
    const id = typeof raw.id === 'string' ? raw.id : null;
    const title = typeof raw.title === 'string' ? raw.title : null;
    const completed = typeof raw.completed === 'boolean' ? raw.completed : false;

    if (!id || !title) {
      continue;
    }

    parsed.push({
      id,
      title,
      description: typeof raw.description === 'string' ? raw.description : undefined,
      completed,
      dataPointIds: Array.isArray(raw.dataPointIds)
        ? raw.dataPointIds.filter((entry): entry is string => typeof entry === 'string')
        : undefined,
    });
  }

  return parsed;
}

export default async function ProjectOverviewPage({ params }: PageProps) {
  await requirePageUser();
  const { id } = await params;
  const [{ status, project }, datasetPayload, dataRequests] = await Promise.all([
    getProject(id),
    getProjectDataset(id),
    getProjectDataRequests(id),
  ]);

  if (status === 'not-found') {
    notFound();
  }

  if (status === 'error') {
    throw new Error(`Failed to fetch project ${id}`);
  }

  if (!project) {
    throw new Error(`Project ${id} data is unavailable`);
  }

  const checklistItems = parseChecklistItems(project.checklist);
  const overviewState = buildProjectOverviewState({
    projectId: project.id,
    status: project.status,
    datasetVersion: project.datasetVersion,
    ownerName: project.ownerName,
    reports: project.reports,
    checklistItems,
    dataset: datasetPayload?.dataset ?? null,
    dataRequests,
  });

  return (
    <>
      <ProjectPrefillHydrator
        project={{
          id: project.id,
          name: project.name,
          status: project.status,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt ?? project.createdAt,
          datasetVersion: project.datasetVersion,
        }}
        reports={project.reports.map((report) => ({
          id: report.id,
          templateCode: report.templateCode,
          completion: report.completion,
        }))}
      />
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{overviewState.hasSupplierPackage ? 'Report field coverage' : 'Overall Completion'}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-2xl font-bold">{Math.round(overviewState.avgCompletion)}%</div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${overviewState.avgCompletion}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {overviewState.completedReports} of {overviewState.totalReports} report{overviewState.totalReports === 1 ? '' : 's'} {overviewState.hasSupplierPackage ? 'with all required fields filled' : 'complete'}
                </p>
                {overviewState.hasSupplierPackage && <p className="mt-1 text-xs text-muted-foreground">Field coverage does not confirm package validation or download.</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewState.totalReports}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {project.reports.length > 0
                    ? project.reports.map((report) => report.templateCode).join(', ')
                    : 'No reports selected yet'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Dataset</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewState.totalDataPoints}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Data points tracked in version {project.datasetVersion}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Data Requests</CardTitle>
                <MailQuestion className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold">{overviewState.pendingRequests}</div>
                <p className="text-xs text-muted-foreground">Pending responses</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge variant="outline">{overviewState.completedRequests} completed</Badge>
                  <Badge variant="outline">{overviewState.revokedRequests} revoked</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Current Signals</CardTitle>
              <CardDescription>Real project state derived from reports, requests, dataset version, and roadmap progress.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-5 overflow-y-auto max-h-[546px]">
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Next action</p>
                    <p className="mt-1 text-sm font-semibold">{overviewState.primaryAction.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{overviewState.primaryAction.detail}</p>
                  </div>
                  <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <UserRound className="h-3.5 w-3.5" />
                  <span>{overviewState.primaryAction.ownerLabel}</span>
                  <Badge variant="outline" className="ml-auto capitalize">{overviewState.primaryAction.ownerType}</Badge>
                </div>
                {overviewState.primaryAction.href ? (
                  <Button asChild variant="outline" size="sm" className="mt-4 w-full justify-between">
                    <Link href={overviewState.primaryAction.href}>
                      Open next action
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                ) : null}
              </div>

              <div className="space-y-4">
                {overviewState.signals.map((signal) => (
                  <div key={signal.title} className="flex items-start gap-3">
                    {signal.tone === 'success' ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                    ) : signal.tone === 'warning' ? (
                      <Activity className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                    ) : (
                      <Circle className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{signal.title}</p>
                      <p className="text-xs text-muted-foreground">{signal.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                <p className="text-sm font-medium">Reports needing attention</p>
                {overviewState.reportsNeedingAttention.length > 0 ? (
                  <div className="space-y-3">
                    {overviewState.reportsNeedingAttention.map((report) => (
                      <div key={report.id} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium">{report.templateCode}</p>
                          <Badge variant="outline">{Math.round(report.completion)}%{report.templateCode === 'CBAM_DATA_PACKAGE' ? ' field coverage' : ''}</Badge>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${report.completion}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{overviewState.hasSupplierPackage ? 'All selected reports have their required fields filled. Open the supplier package to review validation.' : 'All selected reports are fully complete.'}</p>
                )}
              </div>

              <div className="space-y-3 border-t pt-4">
                <p className="text-sm font-medium">Open roadmap focus</p>
                {overviewState.topIncompleteItems.length > 0 ? (
                  <div className="space-y-2">
                    {overviewState.topIncompleteItems.map((item) => (
                      <div key={item.id} className="rounded-lg border p-3">
                        <p className="text-sm font-medium">{item.title}</p>
                        {item.description ? (
                          <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No open roadmap items yet.</p>
                )}
              </div>

              <div className="space-y-3 border-t pt-4">
                <p className="text-sm font-medium">Missing work and owners</p>
                {overviewState.missingWork.length > 0 ? (
                  <div className="space-y-2">
                    {overviewState.missingWork.map((item) => (
                      <div key={item.id} className="rounded-lg border p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                          </div>
                          <Badge variant="outline" className="capitalize">{item.ownerType}</Badge>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">Owner: {item.ownerLabel}</p>
                        {item.href ? (
                          <Button asChild variant="ghost" size="sm" className="mt-3 h-auto p-0 text-xs">
                            <Link href={item.href}>
                              Open related work
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{overviewState.hasSupplierPackage ? 'No field coverage gaps detected. Review the supplier package for validation checks.' : 'No missing work detected from the current project state.'}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <ProjectRoadmap items={checklistItems} incompleteCount={overviewState.incompleteCount} />
        </div>
      </div>
    </>
  );
}
