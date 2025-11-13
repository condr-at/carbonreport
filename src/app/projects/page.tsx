'use client';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageHeader } from '@/components/layouts/page-header';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/blocks/project-card';
import { EmptyState } from '@/components/blocks/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, FolderOpen, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOrganizationContext } from '@/lib/organizations/context';
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
import { useUpdateProjectStatus } from '@/lib/data-client/projects';

interface Report {
  id: string;
  templateCode: string;
  completion: number;
}

interface Project {
  id: string;
  name: string;
  status: string;
  reportsCount: number;
  reports: Report[];
  createdAt: string;
  checklist?: any;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{ type: 'archive' | 'restore' | 'delete'; projectId: string } | null>(null);
  const { activeOrganizationId, currentOrganization, isLoading: organizationsLoading } = useOrganizationContext();
  const organizationId = activeOrganizationId ?? currentOrganization?.id ?? null;
  const statusMutation = useUpdateProjectStatus();
  const isProcessing = statusMutation.isPending;
  
  // Filter & sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');

  // Fetch projects
  useEffect(() => {
    async function fetchProjects() {
      if (organizationsLoading) {
        return
      }

      if (!organizationId) {
        setProjects([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/projects?organization_id=${organizationId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        const normalized = (data.projects || []).map((project: any) => ({
          id: project.id,
          name: project.name,
          status: project.status,
          reportsCount: project.reports_count ?? project.reports?.length ?? 0,
          reports: Array.isArray(project.reports)
            ? project.reports.map((report: any) => ({
                id: report.id,
                templateCode: report.template_code,
                completion: report.completion,
              }))
            : [],
          createdAt: project.created_at,
          checklist: project.checklist,
        }));
        setProjects(normalized);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [organizationId, organizationsLoading]);

  useEffect(() => {
    if (!organizationsLoading && !organizationId) {
      router.push('/no-organization');
    }
  }, [organizationsLoading, organizationId, router]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Search filter
    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter.toUpperCase());
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [projects, searchQuery, statusFilter, sortBy]);

  const handleDuplicate = (projectId: string) => {
    console.log('Duplicate project:', projectId);
    // TODO: Implement duplication
  };

  const handleArchive = (projectId: string) => {
    const target = projects.find((project) => project.id === projectId);
    if (!target) {
      return;
    }

    const type = target.status === 'ARCHIVED' ? 'restore' : 'archive';
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
        onSuccess: (data) => {
          if (nextStatus === 'deleted') {
            setProjects((prev) => prev.filter((project) => project.id !== projectId));
          } else {
            setProjects((prev) =>
              prev.map((project) =>
                project.id === projectId
                  ? {
                      ...project,
                      status: data?.project?.status ?? project.status,
                    }
                  : project,
              ),
            );
          }
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
      return 'The project will return to your active list.';
    }
    return 'Archiving removes the project from the active list without deleting any data. You can restore it later.';
  })();

  const confirmActionLabel = pendingAction
    ? pendingAction.type === 'delete'
      ? 'Delete'
      : pendingAction.type === 'restore'
        ? 'Restore'
        : 'Archive'
    : 'Confirm';

  const confirmPendingLabel = pendingAction
    ? pendingAction.type === 'delete'
      ? 'Deleting...'
      : pendingAction.type === 'restore'
        ? 'Restoring...'
        : 'Archiving...'
    : 'Working...';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Projects"
          description="Manage all your carbon footprint projects"
          actions={(
            <Button asChild>
              <Link href="/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>
          )}
        />

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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

        {/* Content */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[200px] w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
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
            />
          )
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDuplicate={handleDuplicate}
                  onArchive={handleArchive}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            
            {/* Results count */}
            <div className="text-center text-sm text-muted-foreground">
              Showing {filteredProjects.length} of {projects.length} projects
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
  );
}
