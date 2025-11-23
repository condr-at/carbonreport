import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import type { ReactNode } from 'react';

export default function NewProjectLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
