'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getProjectPrefill, ProjectPrefill } from '@/lib/project-prefill';
import { TrendingUp, FileText, Database, MailQuestion } from 'lucide-react';

const NAV_ITEMS = ['Overview', 'Dataset', 'Reports', 'Files'];

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ProjectLoading() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const projectId = useMemo(() => {
    if (!params) return '';
    const raw = Array.isArray(params.id) ? params.id[0] : params.id;
    return raw ?? '';
  }, [params]);

  const [prefill, setPrefill] = useState<ProjectPrefill | null>(null);
  const [pendingState, setPendingState] = useState<'idle' | 'waiting' | 'ready' | 'error'>('idle');

  useEffect(() => {
    if (!projectId) return;
    const cached = getProjectPrefill(projectId);
    if (cached) {
      setPrefill(cached);
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    if (prefill?.source !== 'project-create') return;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 10;

    const poll = async () => {
      attempts += 1;
      try {
        const res = await fetch(`/api/projects/${projectId}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          if (!cancelled) {
            setPendingState('ready');
            router.refresh();
          }
          return true;
        }
      } catch (error) {
        console.error('Error polling project creation:', error);
      }

      if (attempts >= maxAttempts && !cancelled) {
        setPendingState('error');
        return true;
      }

      return false;
    };

    setPendingState('waiting');
    poll();
    const interval = setInterval(async () => {
      const done = await poll();
      if (done) {
        clearInterval(interval);
      }
    }, 1200);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [prefill?.source, projectId, router]);

  const formattedCreatedAt = useMemo(() => formatDate(prefill?.createdAt), [prefill?.createdAt]);
  const reportsCount = prefill?.reportsCount ?? prefill?.templateCodes?.length ?? null;
  const completionValue = typeof prefill?.completion === 'number' ? Math.min(Math.max(prefill.completion, 0), 100) : null;
  const statusVariant = prefill?.status === 'ACTIVE' ? 'default' : 'secondary';

  if (!prefill) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-56 rounded-lg" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-48 rounded-md" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="flex flex-wrap gap-4">
                {NAV_ITEMS.map((_, index) => (
                  <Skeleton key={index} className="h-4 rounded-md" style={{ width: `${100 + index * 12}px` }} />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-xl border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </div>
                  <div className="space-y-4 pt-4">
                    <Skeleton className="h-8 w-24 rounded-md" />
                    <Skeleton className="h-3 w-3/4 rounded-md" />
                    <Skeleton className="h-3 w-2/3 rounded-md" />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border bg-card p-6">
              <div className="space-y-2 border-b pb-4">
                <Skeleton className="h-5 w-52 rounded-md" />
                <Skeleton className="h-4 w-64 rounded-md" />
              </div>
              <div className="max-h-[546px] space-y-4 overflow-hidden pt-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-48 rounded-md" />
                    <Skeleton className="h-3 w-56 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-start justify-between border-b pb-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48 rounded-md" />
                  <Skeleton className="h-4 w-40 rounded-md" />
                </div>
                <Skeleton className="h-9 w-28 rounded-md" />
              </div>
              <div className="max-h-[546px] space-y-3 overflow-hidden pt-4">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Skeleton className="mt-1 h-5 w-5 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full rounded-md" />
                      <Skeleton className="h-3 w-48 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{prefill.name}</h1>
                {prefill.status ? (
                  <Badge variant={statusVariant}>{prefill.status}</Badge>
                ) : (
                  <Skeleton className="h-6 w-20 rounded-full" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {formattedCreatedAt ? (
                  <>Created {formattedCreatedAt}</>
                ) : (
                  <Skeleton className="mt-2 h-4 w-48 rounded-md" />
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </div>

          <div className="border-b">
            <nav className="pointer-events-none flex gap-6 text-sm font-medium text-muted-foreground">
              {NAV_ITEMS.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center px-1 pb-4 border-b-2 border-transparent"
                >
                  {item}
                </span>
              ))}
            </nav>
            {pendingState === 'waiting' && (
              <p className="pt-2 text-xs text-muted-foreground">Finalizing project creation…</p>
            )}
            {pendingState === 'error' && (
              <div className="mt-2 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                We couldn’t confirm the project was created. Refresh the page or try again later.
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Overall Completion</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{completionValue ?? '--'}%</div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${completionValue ?? 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportsCount ?? '--'}</div>
                <CardDescription className="mt-1">
                  {prefill.templateCodes && prefill.templateCodes.length > 0
                    ? prefill.templateCodes.join(', ')
                    : 'Preparing report templates…'}
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Dataset</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-7 w-24 rounded-md" />
                <Skeleton className="h-3 w-3/5 rounded-md" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <MailQuestion className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-7 w-16 rounded-md" />
                <Skeleton className="h-3 w-2/3 rounded-md" />
              </CardContent>
            </Card>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <div className="space-y-2 border-b pb-4">
              <Skeleton className="h-5 w-52 rounded-md" />
              <Skeleton className="h-4 w-64 rounded-md" />
            </div>
            <div className="max-h-[546px] space-y-4 overflow-hidden pt-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-48 rounded-md" />
                  <Skeleton className="h-3 w-56 rounded-md" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-start justify-between border-b pb-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48 rounded-md" />
                <Skeleton className="h-4 w-40 rounded-md" />
              </div>
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
            <div className="max-h-[546px] space-y-3 overflow-hidden pt-4">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Skeleton className="mt-1 h-5 w-5 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-3 w-48 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
