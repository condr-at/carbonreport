import { MainSidebar } from '@/components/layouts/main-sidebar';
import { Sidebar, SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { PanelsTopLeft } from 'lucide-react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar>
          <MainSidebar />
        </Sidebar>
        <SidebarInset className="flex flex-1 flex-col">
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
            <div className="container mx-auto max-w-7xl p-6">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
