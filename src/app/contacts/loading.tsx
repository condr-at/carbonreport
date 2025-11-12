import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageHeader } from '@/components/layouts/page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ContactsLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Contacts"
          description="Manage your address book and track outstanding data requests per contact."
          actions={<Skeleton className="h-8 w-[120px]" />}
        />

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <Skeleton className="h-10 w-full lg:w-[320px]" />
              <div className="flex flex-col gap-3 sm:flex-row">
                <Skeleton className="h-10 w-[180px]" />
                <Skeleton className="h-10 w-[200px]" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
