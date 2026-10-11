'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import type { CheckedState } from '@radix-ui/react-checkbox';
import {
  Mail,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
  Inbox,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RequestDataModal } from '@/components/request-data-modal';
import { notifications } from '@/components/ui/notifications';
import { useGlobalRequests, useGlobalCompleteRequests, useGlobalRevokeRequests, useGlobalResendRequests } from '@/lib/data-client/global-requests';
import type { GlobalRequestFilters } from '@/lib/data-requests/filters';
import type { DataRequestSummary } from '@/lib/data-requests/types';
import type { ContactOverview } from '@/lib/contacts/types';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_OPTIONS: Array<{ value: Exclude<GlobalRequestFilters['status'], undefined>; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'revoked', label: 'Revoked' },
];

const DEADLINE_OPTIONS: Array<{ value: Exclude<GlobalRequestFilters['deadline'], undefined>; label: string }> = [
  { value: 'all', label: 'All deadlines' },
  { value: 'due-soon', label: 'Due soon' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'no-deadline', label: 'No deadline' },
];

const STATUS_BADGE: Record<'pending' | 'completed' | 'revoked', 'secondary' | 'default' | 'outline'> = {
  pending: 'secondary',
  completed: 'default',
  revoked: 'outline',
};

interface ModalConfig {
  projectId: string;
  projectName: string;
  projectOwnerName: string;
  fields: Array<{
    fieldId: string;
    fieldLabel: string;
    itemId: string | null;
    fieldHint: string | null;
  }>;
  initialContact?: {
    id?: string | null;
    email?: string;
    name?: string | null;
  };
}

interface RequestsBoardProps {
  initialFilters: GlobalRequestFilters;
  initialRequests: DataRequestSummary[];
  contacts: ContactOverview[];
  projectOptions: Array<{ id: string; name: string }>;
  lockedContactId?: string;
  projectOwnerFallback?: string;
}

function filtersMatch(a: GlobalRequestFilters, b: GlobalRequestFilters): boolean {
  return (
    (a.status ?? 'all') === (b.status ?? 'all') &&
    (a.projectId ?? '') === (b.projectId ?? '') &&
    (a.contactId ?? '') === (b.contactId ?? '') &&
    (a.deadline ?? 'all') === (b.deadline ?? 'all')
  );
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return '—';
  }

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function normalizeContactName(contact: ContactOverview): string {
  const trimmed = (contact.name ?? '').trim();
  return trimmed.length ? trimmed : contact.email;
}

function ensureContactFilter(filter: GlobalRequestFilters, lockedContactId?: string): GlobalRequestFilters {
  if (!lockedContactId) {
    return filter;
  }

  return {
    ...filter,
    contactId: lockedContactId,
  };
}

export function RequestsBoard({
  initialFilters,
  initialRequests,
  contacts,
  projectOptions,
  lockedContactId,
  projectOwnerFallback = 'Carbon Report Team',
}: RequestsBoardProps) {
  const [filters, setFilters] = useState<GlobalRequestFilters>(() => ensureContactFilter(initialFilters, lockedContactId));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

  const normalizedContacts = useMemo(
    () =>
      contacts.map((contact) => ({
        id: contact.id,
        name: normalizeContactName(contact),
        email: contact.email,
        position: contact.position ?? null,
      })),
    [contacts]
  );

  const effectiveFilters = useMemo(() => ensureContactFilter(filters, lockedContactId), [filters, lockedContactId]);
  const initialData = useMemo(
    () => (filtersMatch(effectiveFilters, ensureContactFilter(initialFilters, lockedContactId)) ? initialRequests : undefined),
    [effectiveFilters, initialFilters, initialRequests, lockedContactId]
  );

  const {
    data: requests = [],
    isFetching,
    refetch,
  } = useGlobalRequests(effectiveFilters, initialData);

  const completeMutation = useGlobalCompleteRequests(effectiveFilters);
  const revokeMutation = useGlobalRevokeRequests(effectiveFilters);
  const resendMutation = useGlobalResendRequests(effectiveFilters);

  const resetSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const toggleSelection = useCallback((id: string, checked: boolean) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const filteredSelection = useMemo(
    () => requests.filter((request) => selectedIds.has(request.id)),
    [requests, selectedIds]
  );

  const pendingSelected = useMemo(
    () => filteredSelection.filter((request) => request.status === 'pending'),
    [filteredSelection]
  );

  const activeSelectionCount = filteredSelection.length;
  const pendingCount = pendingSelected.length;
  const bulkBusy = completeMutation.isPending || revokeMutation.isPending || resendMutation.isPending;

  const headerCheckboxState: CheckedState = useMemo(() => {
    if (!requests.length) {
      return false;
    }
    if (activeSelectionCount === 0) {
      return false;
    }
    if (activeSelectionCount === requests.length) {
      return true;
    }
    return 'indeterminate';
  }, [requests.length, activeSelectionCount]);

  const toggleSelectAll = useCallback((checked: CheckedState) => {
    if (checked === true) {
      setSelectedIds(new Set(requests.map((request) => request.id)));
      return;
    }
    setSelectedIds(new Set());
  }, [requests]);

  const handleBulkComplete = useCallback(() => {
    if (!pendingCount) {
      notifications.error('Select at least one pending request to mark complete.');
      return;
    }

    const ids = pendingSelected.map((request) => request.id);
    completeMutation.mutate(
      { ids },
      {
        onSuccess: () => {
          resetSelection();
        },
      }
    );
  }, [pendingCount, pendingSelected, completeMutation, resetSelection]);

  const handleBulkRevoke = useCallback(() => {
    if (!pendingCount) {
      notifications.error('Select at least one pending request to revoke.');
      return;
    }

    const ids = pendingSelected.map((request) => request.id);
    revokeMutation.mutate(
      { ids },
      {
        onSuccess: () => {
          resetSelection();
        },
      }
    );
  }, [pendingCount, pendingSelected, revokeMutation, resetSelection]);

  const handleBulkResend = useCallback(() => {
    if (!filteredSelection.length) {
      notifications.error('Select at least one request to log a reminder or reopen.');
      return;
    }

    const ids = filteredSelection.map((request) => request.id);
    resendMutation.mutate(
      { ids, requestedAt: new Date().toISOString() },
      {
        onSuccess: () => {
          resetSelection();
        },
      }
    );
  }, [filteredSelection, resendMutation, resetSelection]);

  const openModalForRequest = useCallback((request: DataRequestSummary) => {
    const projectId = request.project?.id;
    if (!projectId) {
      notifications.error('Unable to determine project for this request.');
      return;
    }

    const projectName = request.project?.name ?? 'Project';
    const ownerName = request.project?.ownerName ?? projectOwnerFallback;

    const fields = request.dataPoint?.id
      ? [
          {
            fieldId: request.dataPoint.id,
            fieldLabel: request.dataPoint.label ?? request.dataPoint.id,
            itemId: request.dataPoint.itemId ?? null,
            fieldHint: request.dataPoint.hint ?? null,
          },
        ]
      : [];

    setModalConfig({
      projectId,
      projectName,
      projectOwnerName: ownerName,
      fields,
      initialContact: {
        id: request.contact?.id,
        email: request.contact?.email ?? undefined,
        name: request.contact?.name ?? undefined,
      },
    });
  }, [projectOwnerFallback]);

  const openModalForSelection = useCallback(() => {
    if (!filteredSelection.length) {
      notifications.error('Select at least one request to send.');
      return;
    }

    const projectIds = new Set(
      filteredSelection
        .map((request) => request.project?.id)
        .filter((value): value is string => typeof value === 'string' && value.length > 0)
    );

    if (projectIds.size !== 1) {
      notifications.error('Select requests from a single project to send a combined email.');
      return;
    }

    const [projectId] = Array.from(projectIds);
    const reference = filteredSelection.find((request) => request.project?.id === projectId);

    if (!reference) {
      notifications.error('Unable to determine project for selected requests.');
      return;
    }

    const fields = filteredSelection
      .map((request) => {
        if (!request.dataPoint?.id) {
          return null;
        }

        return {
          fieldId: request.dataPoint.id,
          fieldLabel: request.dataPoint.label ?? request.dataPoint.id,
          itemId: request.dataPoint.itemId ?? null,
          fieldHint: request.dataPoint.hint ?? null,
        };
      })
      .filter((value): value is NonNullable<typeof value> => value !== null);

    if (!fields.length) {
      notifications.error('Selected requests have no associated data points.');
      return;
    }

    const sharedContactIds = new Set(
      filteredSelection
        .map((request) => request.contact?.id)
        .filter((value): value is string => typeof value === 'string' && value.length > 0)
    );
    const initialContact = sharedContactIds.size === 1 ? filteredSelection[0]?.contact : undefined;

    setModalConfig({
      projectId,
      projectName: reference.project?.name ?? 'Project',
      projectOwnerName: reference.project?.ownerName ?? projectOwnerFallback,
      fields,
      initialContact: initialContact
        ? {
            id: initialContact.id,
            email: initialContact.email ?? undefined,
            name: initialContact.name ?? undefined,
          }
        : undefined,
    });
  }, [filteredSelection, projectOwnerFallback]);

  const closeModal = useCallback(() => {
    setModalConfig(null);
  }, []);

  const handleRowComplete = useCallback(
    (request: DataRequestSummary) => {
      if (request.status !== 'pending') {
        return;
      }

      completeMutation.mutate({ ids: [request.id] });
    },
    [completeMutation]
  );

  const handleRowRevoke = useCallback(
    (request: DataRequestSummary) => {
      if (request.status !== 'pending') {
        return;
      }

      revokeMutation.mutate({ ids: [request.id] });
    },
    [revokeMutation]
  );

  const handleRowResend = useCallback(
    (request: DataRequestSummary) => {
      resendMutation.mutate({ ids: [request.id], requestedAt: new Date().toISOString() });
    },
    [resendMutation]
  );

  const contactOptions = useMemo(() => {
    if (lockedContactId) {
      const match = normalizedContacts.find((contact) => contact.id === lockedContactId);
      return match ? [{ value: lockedContactId, label: match.name }] : [];
    }

    return [
      { value: 'all', label: 'All contacts' },
      ...normalizedContacts.map((contact) => ({ value: contact.id, label: contact.name })),
    ];
  }, [lockedContactId, normalizedContacts]);

  const projectFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'All projects' },
      ...projectOptions.map((project) => ({ value: project.id, label: project.name })),
    ],
    [projectOptions]
  );

  const handleFiltersChange = useCallback(
    (changes: Partial<GlobalRequestFilters>) => {
      setFilters((previous) => ({
        ...previous,
        ...changes,
      }));
      setSelectedIds(new Set());
    },
    []
  );

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={effectiveFilters.status ?? 'all'} onValueChange={(value) => handleFiltersChange({ status: value as GlobalRequestFilters['status'] })}>
            <SelectTrigger className="w-[140px]" aria-label="Filter requests by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={effectiveFilters.deadline ?? 'all'} onValueChange={(value) => handleFiltersChange({ deadline: value as GlobalRequestFilters['deadline'] })}>
            <SelectTrigger className="w-[150px]" aria-label="Filter requests by deadline">
              <SelectValue placeholder="Deadline" />
            </SelectTrigger>
            <SelectContent>
              {DEADLINE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={effectiveFilters.projectId ?? 'all'} onValueChange={(value) => handleFiltersChange({ projectId: value === 'all' ? undefined : value })}>
            <SelectTrigger className="w-[180px]" aria-label="Filter requests by project">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              {projectFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!lockedContactId && (
            <Select value={effectiveFilters.contactId ?? 'all'} onValueChange={(value) => handleFiltersChange({ contactId: value === 'all' ? undefined : value })}>
              <SelectTrigger className="w-[200px]" aria-label="Filter requests by contact">
                <SelectValue placeholder="Contact" />
              </SelectTrigger>
              <SelectContent>
                {contactOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button size="sm" onClick={openModalForSelection} disabled={!filteredSelection.length}>
            <Mail className="mr-2 h-4 w-4" />
            Send email
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>
            {isFetching && !requests.length
              ? 'Loading requests…'
              : `${requests.length} request${requests.length === 1 ? '' : 's'} found`}
          </span>
          {activeSelectionCount > 0 && (
            <span>
              {activeSelectionCount} selected · {pendingCount} pending
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleBulkComplete}
            disabled={!pendingCount || bulkBusy}
          >
            {completeMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            )}
            Mark complete
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleBulkRevoke}
            disabled={!pendingCount || bulkBusy}
          >
            {revokeMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="mr-2 h-4 w-4" />
            )}
            Revoke
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleBulkResend}
            disabled={!activeSelectionCount || bulkBusy}
            title="Record a reminder for pending requests or reopen closed requests. No email is sent."
          >
            {resendMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {pendingCount === activeSelectionCount
              ? 'Log reminder'
              : pendingCount === 0
              ? 'Reopen requests'
              : 'Log reminders / reopen'}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b text-xs uppercase tracking-wide text-muted-foreground">
              <tr className="text-left">
                <th className="py-3 pr-3">
                  <Checkbox
                    aria-label="Select all visible requests"
                    className="translate-y-[1px]"
                    checked={headerCheckboxState}
                    onCheckedChange={toggleSelectAll}
                    disabled={!requests.length}
                  />
                </th>
                <th className="py-3 pr-3">Project</th>
                <th className="py-3 pr-3">Data point</th>
                <th className="py-3 pr-3">Contact</th>
                <th className="py-3 pr-3">Deadline</th>
                <th className="py-3 pr-3">Status</th>
                <th className="py-3 pr-3">Requested</th>
                <th className="py-3 pr-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isFetching && !requests.length ? (
                <RequestsTableSkeleton />
              ) : !requests.length ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Inbox className="h-10 w-10" />
                      <p className="font-medium">No data requests found</p>
                      <p className="text-sm">
                        Adjust filters or create a new request to get started.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((request) => {
                  const isSelected = selectedIds.has(request.id);
                  const projectLink = request.project?.id ? `/projects/${request.project.id}` : undefined;
                  const contactLabel = (request.contact?.name ?? '').trim() || request.contact?.email || 'Unassigned';

                  return (
                    <tr key={request.id} className="border-b last:border-b-0">
                      <td className="py-3 pr-3 align-top">
                        <Checkbox
                          aria-label={`Select request for ${request.dataPoint?.label ?? request.dataPoint?.id ?? 'data field'} from ${contactLabel}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => toggleSelection(request.id, checked === true)}
                        />
                      </td>
                      <td className="py-3 pr-3 align-top">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {projectLink ? (
                            <Link href={projectLink} className="font-medium hover:underline">
                              {request.project?.name ?? 'Project'}
                            </Link>
                          ) : (
                            <span className="font-medium">{request.project?.name ?? 'Project'}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-3 align-top">
                        <div className="font-medium">
                          {request.dataPoint?.label ?? request.dataPoint?.id ?? 'Data field'}
                        </div>
                        {request.dataPoint?.hint && (
                          <p className="text-xs text-muted-foreground">{request.dataPoint.hint}</p>
                        )}
                      </td>
                      <td className="py-3 pr-3 align-top">
                        <div className="font-medium">{contactLabel}</div>
                        {request.contact?.email && (
                          <p className="text-xs text-muted-foreground">{request.contact.email}</p>
                        )}
                      </td>
                      <td className="py-3 pr-3 align-top">{formatDate(request.deadline)}</td>
                      <td className="py-3 pr-3 align-top">
                        {(request.status === 'pending' || request.status === 'completed' || request.status === 'revoked') && (
                          <Badge variant={STATUS_BADGE[request.status]}>{request.status}</Badge>
                        )}
                      </td>
                      <td className="py-3 pr-3 align-top text-muted-foreground">
                        <div>{formatDate(request.requestedAt)}</div>
                        {request.completedAt && <div>Completed {formatDate(request.completedAt)}</div>}
                        {request.revokedAt && <div>Revoked {formatDate(request.revokedAt)}</div>}
                      </td>
                      <td className="py-3 pl-3 align-top text-right">
                        <div className="inline-flex flex-wrap justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => openModalForRequest(request)}>
                            <Mail className="mr-2 h-4 w-4" /> Email
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRowComplete(request)}
                            disabled={request.status !== 'pending' || completeMutation.isPending}
                          >
                            {completeMutation.isPending ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                            )}
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRowRevoke(request)}
                            disabled={request.status !== 'pending' || revokeMutation.isPending}
                          >
                            {revokeMutation.isPending ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="mr-2 h-4 w-4" />
                            )}
                            Revoke
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRowResend(request)}
                            disabled={resendMutation.isPending}
                            title={request.status === 'pending'
                              ? 'Record a reminder already sent. No email is sent.'
                              : 'Return this request to pending. No email is sent.'}
                          >
                            {resendMutation.isPending ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <RefreshCw className="mr-2 h-4 w-4" />
                            )}
                            {request.status === 'pending' ? 'Log reminder' : 'Reopen request'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      {modalConfig && (
        <RequestDataModal
          projectId={modalConfig.projectId}
          projectName={modalConfig.projectName}
          projectOwnerName={modalConfig.projectOwnerName}
          onClose={closeModal}
          fields={modalConfig.fields}
          initialContact={modalConfig.initialContact}
          contacts={normalizedContacts}
          onLogged={async () => {
            await refetch({ throwOnError: false });
            resetSelection();
          }}
        />
      )}
    </Card>
  );
}

function RequestsTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="border-b last:border-b-0">
          <td className="py-3 pr-3 align-top">
            <Skeleton className="h-4 w-4" />
          </td>
          <td className="py-3 pr-3 align-top">
            <Skeleton className="h-4 w-40" />
          </td>
          <td className="py-3 pr-3 align-top">
            <Skeleton className="h-4 w-48" />
          </td>
          <td className="py-3 pr-3 align-top">
            <Skeleton className="h-4 w-36" />
          </td>
          <td className="py-3 pr-3 align-top">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="py-3 pr-3 align-top">
            <Skeleton className="h-5 w-20 rounded-full" />
          </td>
          <td className="py-3 pr-3 align-top">
            <div className="space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-28" />
            </div>
          </td>
          <td className="py-3 pl-3 align-top text-right">
            <div className="flex justify-end gap-2">
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-7 w-20" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
