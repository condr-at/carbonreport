import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Overview</h1>
          <p className="text-muted-foreground mt-1">
            Project ID: {params.id}
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Construction className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Coming Soon</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Project detail page is under construction
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
