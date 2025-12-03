import { Suspense } from 'react';
import { MainSidebar } from '@/components/layouts/main-sidebar';
import { OrganizationGate } from '@/components/layouts/organization-gate';
import { Sidebar, SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { PanelsTopLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ContentPadding = 'default' | 'horizontal' | 'none';

interface DashboardLayoutProps {
  children: React.ReactNode;
  contentPadding?: ContentPadding;
  contentClassName?: string;
}

const paddingClassMap: Record<ContentPadding, string> = {
  default: 'p-6',
  horizontal: 'px-6',
  none: '',
};

export function DashboardLayout({ children, contentPadding = 'default', contentClassName }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="fixed inset-0 flex overflow-hidden bg-background">
        <Sidebar>
          <MainSidebar />
        </Sidebar>
        <SidebarInset className="flex flex-1 flex-col">
          <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <OrganizationGate>
              <header className="flex items-center justify-between border-b px-4 py-3 md:hidden">
                <div className="flex items-center gap-2">
                  <SidebarTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Toggle menu">
                      <PanelsTopLeft className="h-4 w-4" />
                    </Button>
                  </SidebarTrigger>
                  <span className="text-sm font-medium text-muted-foreground">Carbon Report</span>
                </div>
              </header>
              <main className="flex-1 overflow-y-auto">
                <div className={cn('container mx-auto max-w-7xl', paddingClassMap[contentPadding], contentClassName)}>
                  {children}
                </div>
              </main>
            </OrganizationGate>
          </Suspense>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
