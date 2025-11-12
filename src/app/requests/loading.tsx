import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageHeader } from '@/components/layouts/page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function RequestsLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Requests"
          description="Monitor and action data requests across projects."
          actions={<Skeleton className="h-9 w-[120px]" />}
        />

        <Card>
          <CardHeader className="space-y-4">
            <div className="grid gap-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-48" />
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, column) => (
            <Card key={column} className="flex flex-col">
              <CardHeader className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="space-y-2 rounded-lg border p-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex justify-between gap-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
