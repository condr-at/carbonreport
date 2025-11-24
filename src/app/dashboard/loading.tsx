import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageHeader } from '@/components/layouts/page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const GREETING_TITLE = 'Hello, there 👋';
const GREETING_DESCRIPTION = 'Loading your carbon overview...';

export default function DashboardLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title={GREETING_TITLE}
          description={GREETING_DESCRIPTION}
          actions={<Skeleton className="h-9 w-[140px]" />}
        />

        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
