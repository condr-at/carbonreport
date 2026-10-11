'use client';

import { fetchWithSession } from '@/lib/session-client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { FolderOpen, Loader2, Plus, Search } from 'lucide-react';

import { ProjectCard } from '@/components/blocks/project-card';
import { EmptyState } from '@/components/blocks/empty-state';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageHeader } from '@/components/layouts/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useOrganizationContext } from '@/lib/organizations/context';
import { notifications } from '@/components/ui/notifications';
import {
  useProjectsList,
  useUpdateProjectStatus,
  type ProjectListViewItem,
} from '@/lib/data-client/projects';

type PendingAction = { type: 'archive' | 'restore' | 'delete'; projectId: string } | null;

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <ProjectsPageContent />
    </Suspense>
  );
}

function ProjectsPageContent() {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const { activeOrganizationId, currentOrganization, isLoading: organizationsLoading, isBootstrapping } = useOrganizationContext();
  const organizationId = activeOrganizationId ?? currentOrganization?.id ?? null;
  const isOrgContextLoading = organizationsLoading || isBootstrapping;

  const {
    data: projects = [],
    isLoading,
    isFetching,
    isError,
    error: projectsError,
    refetch,
  } = useProjectsList(organizationId);

  const statusMutation = useUpdateProjectStatus();
  const isProcessing = statusMutation.isPending;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');

  useEffect(() => {
    if (!isOrgContextLoading && !organizationId) {
      router.replace('/no-organization');
    }
  }, [isOrgContextLoading, organizationId, router]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const targetStatus = statusFilter !== 'all' ? statusFilter.toUpperCase() : null;

    const result = projects.filter((project) => {
      const matchesQuery = query ? project.name.toLowerCase().includes(query) : true;
      const matchesStatus = targetStatus ? project.status === targetStatus : true;
      return matchesQuery && matchesStatus;
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-desc':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [projects, searchQuery, statusFilter, sortBy]);

  if (!organizationId && !isOrgContextLoading) {
    return null;
  }

  const handleDuplicate = async (projectId: string) => {
    if (createDisabled) {
      notifications.error('Active project limit reached. Duplicate unavailable.');
      return;
    }
    try {
      const res = await fetchWithSession(`/api/projects/${projectId}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset_completion: false }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        const message = err?.error || 'Failed to duplicate project.';
        throw new Error(message);
      }
      notifications.success('Project duplicated');
      await refetch();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Duplicate failed';
      notifications.error(msg);
    }
  };

  const handleArchive = (projectId: string) => {
    const target = projects.find((project) => project.id === projectId);
    if (!target) {
      return;
    }

    const type = target.status === 'ARCHIVED' || target.status === 'DELETED' ? 'restore' : 'archive';
    setPendingAction({ type, projectId });
  };

  const handleDelete = (projectId: string) => {
    setPendingAction({ type: 'delete', projectId });
  };

  const closeDialog = () => {
    if (isProcessing) {
      return;
    }
    setPendingAction(null);
  };

  const handleConfirmAction = () => {
    if (!pendingAction) {
      return;
    }

    const { projectId, type } = pendingAction;
    const nextStatus = type === 'archive' ? 'archived' : type === 'restore' ? 'active' : 'deleted';

    statusMutation.mutate(
      { projectId, status: nextStatus },
      {
        onSuccess: () => {
          setPendingAction(null);
        },
      },
    );
  };

  const pendingProject = pendingAction
    ? projects.find((project) => project.id === pendingAction.projectId) ?? null
    : null;

  const confirmTitle = pendingAction
    ? `${pendingAction.type === 'delete' ? 'Delete' : pendingAction.type === 'restore' ? 'Restore' : 'Archive'} project${pendingProject ? ` "${pendingProject.name}"` : ''}?`
    : '';

  const confirmDescription = (() => {
    if (!pendingAction) {
      return '';
    }
    if (pendingAction.type === 'delete') {
      return 'The project will be marked as deleted and can be restored during the retention window.';
    }
    if (pendingAction.type === 'restore') {
      if (pendingProject?.status === 'DELETED') {
        return 'The project will be restored to your archived list with its data intact. You can activate it afterward if your plan has capacity.';
      }
      return 'The project will return to your active list.';
    }
    return 'Archiving removes the project from the active list without deleting any data. You can restore it later.';
  })();

  const confirmActionLabel = pendingAction
    ? pendingAction.type === 'delete'
      ? 'Delete'
      : pendingAction.type === 'restore'
        ? pendingProject?.status === 'DELETED' ? 'Restore to archived' : 'Restore'
        : 'Archive'
    : 'Confirm';

  const confirmPendingLabel = pendingAction
    ? pendingAction.type === 'delete'
      ? 'Deleting...'
      : pendingAction.type === 'restore'
        ? 'Restoring...'
        : 'Archiving...'
    : 'Working...';

  const activeProjectsLimit = currentOrganization?.plan?.max_active_projects ?? null;
  const activeProjectsUsage = currentOrganization?.usage?.active_projects ?? null;
  const hasActiveProjectsLimit = typeof activeProjectsLimit === 'number';
  const createDisabled =
    hasActiveProjectsLimit && typeof activeProjectsUsage === 'number' && activeProjectsUsage >= activeProjectsLimit;

  const isLoadingInitial = (isLoading || isOrgContextLoading) && projects.length === 0;
  const totalProjects = projects.length;

  const projectsErrorMessage = projectsError instanceof Error ? projectsError.message : 'Failed to load projects';
  const projectLimitHint =
    'You have reached the active project limit. Archive or delete an existing project, or upgrade in organization settings.';

  const newProjectAction = createDisabled ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{projectLimitHint}</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    <Button asChild>
      <Link href="/projects/new">
        <Plus className="mr-2 h-4 w-4" />
        New Project
      </Link>
    </Button>
  );

  return (
    <TooltipProvider delayDuration={150}>
      <DashboardLayout>
        <div className="space-y-6">
        <PageHeader
          title="Projects"
          description={
            hasActiveProjectsLimit && typeof activeProjectsUsage === 'number'
              ? `Active projects: ${activeProjectsUsage}/${activeProjectsLimit}`
              : 'Manage all your carbon footprint projects'
          }
            actions={newProjectAction}
        />

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoadingInitial ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[200px] w-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="py-12 text-center">
            <p className="text-destructive">{projectsErrorMessage}</p>
            <Button onClick={() => refetch()} className="mt-4">
              Retry
            </Button>
          </div>
        ) : filteredProjects.length === 0 ? (
          searchQuery || statusFilter !== 'all' ? (
            <EmptyState
              icon={Search}
              title="No projects found"
              description="Try adjusting your search or filters"
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
            />
          ) : (
            <EmptyState
              icon={FolderOpen}
              title="No projects yet"
              description="Create your first project to get started with carbon reporting"
              actionLabel="Create Project"
              onAction={() => router.push('/projects/new')}
              actionDisabled={createDisabled}
              actionTooltip={createDisabled ? projectLimitHint : undefined}
            />
          )
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project: ProjectListViewItem) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDuplicate={handleDuplicate}
                  onArchive={handleArchive}
                  onDelete={handleDelete}
                  canDuplicate={!createDisabled}
                />
              ))}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Showing {filteredProjects.length} of {totalProjects} projects
              {isFetching ? (
                <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Updating…
                </span>
              ) : null}
            </div>
          </>
        )}

        <AlertDialog
          open={Boolean(pendingAction)}
          onOpenChange={(open) => {
            if (!open) {
              closeDialog();
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
              <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isProcessing} onClick={closeDialog}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isProcessing}
                onClick={handleConfirmAction}
                className={pendingAction?.type === 'delete' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : undefined}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {confirmPendingLabel}
                  </span>
                ) : (
                  confirmActionLabel
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      </DashboardLayout>
    </TooltipProvider>
  );
}
