import type { ReactNode } from 'react'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
