import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function ContactsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your contact address book
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Construction className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Coming Soon</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Contacts management is under construction
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
