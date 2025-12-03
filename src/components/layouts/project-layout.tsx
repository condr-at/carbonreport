'use client';

import { ReactNode, useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreVertical, Copy, Archive, ArchiveRestore, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUpdateProjectStatus } from '@/lib/data-client/projects';
import { clearProjectPrefill } from '@/lib/project-prefill';

interface ProjectLayoutProps {
  children: ReactNode;
  project: {
    id: string;
    name: string;
    status: string;
    projectType: string;
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
  const [currentStatus, setCurrentStatus] = useState(project.status);
  const normalizedStatus = currentStatus?.toString() ?? 'ACTIVE';
  const statusVariant = normalizedStatus.toLowerCase() === 'active' ? 'default' : 'secondary';
  const isArchived = normalizedStatus.toUpperCase() === 'ARCHIVED';
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [isArchiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'archive' | 'restore' | 'delete' | null>(null);
  const skipNextValueChange = useRef(false);
  const statusMutation = useUpdateProjectStatus();
  const isMutationPending = statusMutation.isPending;
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setCurrentStatus(project.status);
  }, [project.status]);

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
      startTransition(() => {
        router.push(`${baseHref}${target.href}`);
      });
    },
    [activeTab, baseHref, router],
  );

  const handleArchiveConfirm = () => {
    const nextStatus = isArchived ? 'active' : 'archived';
    setPendingAction(isArchived ? 'restore' : 'archive');
    statusMutation.mutate(
      { projectId: project.id, status: nextStatus },
      {
        onSuccess: (data) => {
          setCurrentStatus(data?.project?.status ?? (nextStatus === 'archived' ? 'ARCHIVED' : 'ACTIVE'));
          setArchiveDialogOpen(false);
          setPendingAction(null);
          router.refresh();
        },
        onSettled: () => {
          setPendingAction(null);
        },
      },
    );
  };

  const handleDeleteConfirm = () => {
    setPendingAction('delete');
    statusMutation.mutate(
      { projectId: project.id, status: 'deleted' },
      {
        onSuccess: () => {
          clearProjectPrefill(project.id);
          setDeleteDialogOpen(false);
          setPendingAction(null);
          router.replace('/projects');
        },
        onSettled: () => {
          setPendingAction(null);
        },
      },
    );
  };

  const archiveLabel = isArchived ? 'Restore Project' : 'Archive Project';
  const ArchiveActionIcon = isArchived ? ArchiveRestore : Archive;
  const archiveActionLabel = pendingAction === 'restore' ? 'Restoring...' : 'Archiving...';

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
                <DropdownMenuItem
                  onClick={() => {
                    if (isMutationPending) return;
                    setPendingAction(null);
                    setArchiveDialogOpen(true);
                  }}
                  disabled={isMutationPending}
                >
                  <ArchiveActionIcon className="mr-2 h-4 w-4" />
                  {archiveLabel}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => {
                    if (isMutationPending) return;
                    setPendingAction(null);
                    setDeleteDialogOpen(true);
                  }}
                  disabled={isMutationPending}
                >
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

      <AlertDialog
        open={isArchiveDialogOpen}
        onOpenChange={(open) => {
          if (isMutationPending) return;
          setArchiveDialogOpen(open);
          if (!open) {
            setPendingAction(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isArchived ? 'Restore project?' : 'Archive project?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isArchived
                ? 'This project will become active again and reappear in your main list.'
                : 'Archiving removes the project from your active list without deleting any data. You can restore it later.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isMutationPending}
              onClick={() => {
                if (isMutationPending) return;
                setArchiveDialogOpen(false);
                setPendingAction(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleArchiveConfirm} disabled={isMutationPending}>
              {isMutationPending && pendingAction && pendingAction !== 'delete' ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {archiveActionLabel}
                </span>
              ) : (
                isArchived ? 'Restore' : 'Archive'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (isMutationPending) return;
          setDeleteDialogOpen(open);
          if (!open) {
            setPendingAction(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting will move this project to the retention queue. It can be recovered until the retention window
              expires.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isMutationPending}
              onClick={() => {
                if (isMutationPending) return;
                setDeleteDialogOpen(false);
                setPendingAction(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isMutationPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isMutationPending && pendingAction === 'delete' ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </span>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
