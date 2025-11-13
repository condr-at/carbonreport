'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useOrganizationUsage } from '@/lib/data-client/organizations';
import { UpgradePlanDialog } from './upgrade-plan-dialog';

function formatDate(value: string | null) {
  if (!value) {
    return 'No expiry';
  }
  try {
    const date = new Date(value);
    return date.toLocaleDateString();
  } catch {
    return value;
  }
}

function computeDaysUntilExpiry(source: string | null): number | null {
  if (!source) {
    return null;
  }
  const now = new Date();
  const expiry = new Date(source);
  const diff = expiry.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

type UsageTabProps = {
  organizationId: string;
  plan: {
    code: string;
    label: string;
    valid_until: string | null;
  };
  billingUiEnabled: boolean;
};

type UsageMetric = {
  label: string;
  used: number;
  limit: number | null;
  help?: string;
};

function UsageBar({ metric }: { metric: UsageMetric }) {
  const { used, limit } = metric;
  const percentage = limit === null || limit === 0 ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const label = limit === null ? `${used} · unlimited` : `${used} / ${limit}`;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{metric.label}</span>
        <span className="text-muted-foreground">{label}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        {limit === null ? (
          <div className="h-full rounded-full bg-primary/70" style={{ width: '20%' }} />
        ) : (
          <div className="h-full rounded-full bg-primary" style={{ width: `${percentage}%` }} />
        )}
      </div>
      {metric.help ? <p className="text-xs text-muted-foreground">{metric.help}</p> : null}
    </div>
  );
}

export function UsageTab({ organizationId, plan, billingUiEnabled }: UsageTabProps) {
  const { data, isLoading, isError, refetch } = useOrganizationUsage(organizationId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage & Limits</CardTitle>
          <CardDescription>Checking usage metrics…</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`usage-skeleton-${index}`} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage & Limits</CardTitle>
          <CardDescription>Unable to load usage right now.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-destructive">Try refreshing the data. If this persists, contact support.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  const metrics: UsageMetric[] = [
    {
      label: 'Active projects',
      used: data.usage.active_projects,
      limit: data.limits.max_active_projects,
      help: 'Projects in active status count toward the plan limit.',
    },
    {
      label: 'Editors',
      used: data.usage.active_editors,
      limit: data.limits.max_editors,
      help: 'Editors can modify data and manage requests.',
    },
    {
      label: 'Verifiers',
      used: data.usage.active_verifiers,
      limit: data.limits.max_verifiers,
      help: 'Verifier workflows are gated by approvals feature flag.',
    },
    {
      label: 'Viewers',
      used: data.usage.active_viewers,
      limit: data.limits.max_viewers,
      help: 'Viewers include read-only and verifier seats.',
    },
  ];

  const expiryLabel = formatDate(data.plan_valid_until ?? plan.valid_until);
  const planLabel = plan.label;

  const daysUntilExpiry = computeDaysUntilExpiry(data.plan_valid_until ?? plan.valid_until);

  const expiryBadge = daysUntilExpiry !== null && daysUntilExpiry <= 14 ? (
    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
      Expires in {daysUntilExpiry} day{daysUntilExpiry === 1 ? '' : 's'}
    </Badge>
  ) : null;

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <CardTitle>Usage & Limits</CardTitle>
          <CardDescription>
            Monitor seat and project consumption for the {planLabel} plan.
          </CardDescription>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Valid until: {expiryLabel}</span>
            {expiryBadge}
          </div>
        </div>
        {billingUiEnabled ? (
          <UpgradePlanDialog organizationId={organizationId} currentPlanCode={plan.code} />
        ) : null}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {metrics.map((metric) => (
            <UsageBar key={metric.label} metric={metric} />
          ))}
        </div>

        <div>
          <h3 className="text-sm font-semibold">Usage snapshots</h3>
          {data.snapshots && data.snapshots.length > 0 ? (
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full table-fixed border-collapse text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Date</th>
                    <th className="pb-2 pr-4 font-medium">Projects</th>
                    <th className="pb-2 pr-4 font-medium">Editors</th>
                    <th className="pb-2 pr-4 font-medium">Verifiers</th>
                    <th className="pb-2 font-medium">Viewers</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.snapshots.map((snapshot) => (
                    <tr key={snapshot.computed_at}>
                      <td className="py-2 pr-4 text-xs text-muted-foreground">{formatDate(snapshot.computed_at)}</td>
                      <td className="py-2 pr-4">{snapshot.active_projects}</td>
                      <td className="py-2 pr-4">{snapshot.active_editors}</td>
                      <td className="py-2 pr-4">{snapshot.active_verifiers}</td>
                      <td className="py-2">{snapshot.active_viewers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Snapshots populate after the nightly usage job runs.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
