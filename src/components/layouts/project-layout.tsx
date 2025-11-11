'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Copy, Archive, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProjectLayoutProps {
  children: ReactNode;
  project: {
    id: string;
    name: string;
    status: string;
    updatedAt: string;
  };
}

const TABS = [
  { id: 'overview', label: 'Overview', href: '' },
  { id: 'dataset', label: 'Dataset', href: '/dataset' },
  { id: 'requests', label: 'Data Requests', href: '/data-requests' },
  { id: 'reports', label: 'Reports', href: '/reports' },
  { id: 'emails', label: 'Email Templates', href: '/mailto-templates' },
  { id: 'files', label: 'Files', href: '/files' },
] as const;

export function ProjectLayout({ children, project }: ProjectLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const baseHref = `/projects/${project.id}`;
  const normalizedStatus = project.status?.toString() ?? 'active';
  const statusVariant = normalizedStatus.toLowerCase() === 'active' ? 'default' : 'secondary';
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const skipNextValueChange = useRef(false);

  // Determine active tab
  const getActiveTab = () => {
    if (pathname === baseHref) return 'overview'
    if (pathname.includes('/dataset')) return 'dataset'
    if (pathname.includes('/data-requests')) return 'requests'
    if (pathname.includes('/reports')) return 'reports'
    if (pathname.includes('/mailto-templates')) return 'emails'
    if (pathname.includes('/files')) return 'files'
    return 'overview'
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    setPendingTab(null);
  }, [activeTab]);

  const handleNavigate = useCallback(
    (nextTabId: string) => {
      if (nextTabId === activeTab) {
        return;
      }

      const target = TABS.find((tab) => tab.id === nextTabId);
      if (!target) {
        return;
      }

      setPendingTab(nextTabId);
      router.push(`${baseHref}${target.href}`);
    },
    [activeTab, baseHref, router],
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Project Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                <Badge variant={statusVariant}>
                  {normalizedStatus}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Last updated {new Date(project.updatedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate Project
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive Project
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tabs Navigation */}
          <Tabs
            value={pendingTab ?? activeTab}
            onValueChange={(value) => {
              if (skipNextValueChange.current) {
                skipNextValueChange.current = false;
                return;
              }
              handleNavigate(value);
            }}
            className="w-full"
          >
            <TabsList aria-label="Project tabs">
              {TABS.map((tab) => {
                const href = `${baseHref}${tab.href}`;
                return (
                  <TabsTrigger key={tab.id} value={tab.id} asChild>
                    <Link
                      href={href}
                      onClick={(event) => {
                        if (
                          event.metaKey ||
                          event.ctrlKey ||
                          event.shiftKey ||
                          event.altKey ||
                          event.button !== 0
                        ) {
                          return;
                        }

                        event.preventDefault();
                        skipNextValueChange.current = true;
                        handleNavigate(tab.id);
                      }}
                    >
                      {tab.label}
                    </Link>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Tab Content */}
        <div>{children}</div>
      </div>
    </DashboardLayout>
  );
}
