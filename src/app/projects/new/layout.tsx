import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import type { ReactNode } from 'react';

export default function NewProjectLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background">
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}
