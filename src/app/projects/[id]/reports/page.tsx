import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getBaseUrl } from '@/lib/server-utils';
import { getReportTemplate } from '@/lib/report-templates';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchProjectWithReports(id: string) {
  const baseUrl = await getBaseUrl();
  const headersList = await headers();
  const res = await fetch(`${baseUrl}/api/projects/${id}`, {
    cache: 'no-store',
    headers: {
      Cookie: headersList.get('Cookie') || '',
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch project reports');
  }

  return res.json();
}

export default async function ReportsPage({ params }: PageProps) {
  const { id } = await params;
  const payload = await fetchProjectWithReports(id);
  const project = payload?.project ?? null;

  if (!project) {
    notFound();
  }

  const reports = Array.isArray(project.reports)
    ? project.reports.map((report: any) => ({
        id: report?.id,
        templateCode: report?.template_code ?? report?.templateCode ?? '',
        completion: typeof report?.completion === 'number' ? report.completion : 0,
      }))
      .filter((r: any) => Boolean(r.id))
    : [];

  return (
    <div className="space-y-6">
      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FileText className="mb-4 h-16 w-16 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No reports yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Reports will appear here after you select templates during project setup.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report: any) => {
            const template = getReportTemplate(report.templateCode as any);
            const completion = report.completion ?? 0;

            return (
              <Card key={report.id} className="border border-muted">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        {template?.name ?? report.templateCode}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Template code: {report.templateCode}
                      </CardDescription>
                    </div>
                    <Badge>{Math.round(completion)}%</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-4">
                  <p className="flex-1 text-sm text-muted-foreground">
                    {template?.description ?? 'No description available.'}
                  </p>
                  <Link
                    href={`/projects/${project.id}/reports/${report.id}`}
                    className="inline-flex items-center rounded-md border border-transparent bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                  >
                    Open
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
