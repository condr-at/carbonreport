'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { Loader2, Mail, RefreshCw, CheckCircle2, XCircle, Inbox, UserRound } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RequestDataModal } from '@/components/request-data-modal';
import { notifications } from '@/components/ui/notifications';
import {
  useDataRequests,
  useCompleteDataRequests,
  useRevokeDataRequests,
  useResendDataRequests,
  useReassignDataRequests,
} from '@/lib/data-client/data-requests';
import { useProjectContacts } from '@/lib/data-client/contacts';
import type { DataRequestSummary } from '@/lib/data-requests/types';
import type { ContactSummary } from '@/lib/contacts/types';
import { Skeleton } from '@/components/ui/skeleton';

interface DataRequestsPageClientProps {
  projectId: string;
  projectName: string;
  projectOwnerName: string;
  initialRequests?: DataRequestSummary[] | null;
  initialContacts: ContactSummary[];
  mailtoTemplate: { subject?: string; body?: string } | null;
  isInitialLazyLoad?: boolean;
}

type StatusFilter = 'all' | 'pending' | 'completed' | 'revoked';

interface NormalizedContact {
  id: string;
  name: string;
  email: string;
  position: string | null;
}

type ModalConfig = {
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
};

type ReassignConfig = {
  requests: DataRequestSummary[];
};

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'revoked', label: 'Revoked' },
];

const STATUS_LABELS: Record<Exclude<StatusFilter, 'all'>, string> = {
  pending: 'Pending',
  completed: 'Completed',
  revoked: 'Revoked',
};

const BADGE_VARIANT: Record<
  Exclude<StatusFilter, 'all'>,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'secondary',
  completed: 'default',
  revoked: 'outline',
};

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return '—';
  }

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export function DataRequestsPageClient({
  projectId,
  projectName,
  projectOwnerName,
  initialRequests,
  initialContacts,
  mailtoTemplate,
  isInitialLazyLoad = false,
}: DataRequestsPageClientProps) {
  const normalizeContact = useCallback(
    (contact: ContactSummary): NormalizedContact => {
      const name = (contact.name ?? '').trim();

      return {
        id: contact.id,
        email: contact.email,
        name: name || contact.email,
        position: contact.position ?? null,
      };
    },
    []
  );

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [contactFilter, setContactFilter] = useState<string>('all');
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [reassignConfig, setReassignConfig] = useState<ReassignConfig | null>(null);
  const [reassignContactId, setReassignContactId] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const {
    data: requests = [],
    refetch: refetchRequests,
    status: requestsStatus,
  } = useDataRequests(projectId, {
    status: 'all',
    initialData: isInitialLazyLoad ? undefined : initialRequests ?? undefined,
  });

  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(!isInitialLazyLoad);

  useEffect(() => {
    if (!isInitialLazyLoad || hasLoadedInitialData) {
      return;
    }

    if (requestsStatus !== 'pending') {
      setHasLoadedInitialData(true);
    }
  }, [hasLoadedInitialData, isInitialLazyLoad, requestsStatus]);

  const showInitialLoadingState = isInitialLazyLoad && !hasLoadedInitialData;

  const {
    data: contactsData = [],
    refetch: refetchContacts,
  } = useProjectContacts(projectId, initialContacts);

  const contacts = useMemo(
    () => contactsData.map((contact) => normalizeContact(contact)),
    [contactsData, normalizeContact]
  );

  const completeMutation = useCompleteDataRequests(projectId);
  const revokeMutation = useRevokeDataRequests(projectId);
  const resendMutation = useResendDataRequests(projectId);
  const reassignMutation = useReassignDataRequests(projectId);

  const resolvedMailtoTemplate = useMemo(() => {
    if (!mailtoTemplate) {
      return null;
    }

    const subject = typeof mailtoTemplate.subject === 'string' ? mailtoTemplate.subject.trim() : '';
    const body = typeof mailtoTemplate.body === 'string' ? mailtoTemplate.body.trim() : '';

    if (!body) {
      return null;
    }

    return {
      subject: subject || `Data Request for ${projectName}`,
      body,
    };
  }, [mailtoTemplate, projectName]);

  const contactOptions = useMemo(
    () => [
      { value: 'all', label: 'All contacts' },
      ...contacts.map((contact) => ({
        value: contact.id,
        label: contact.name,
      })),
    ],
    [contacts]
  );

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      if (statusFilter !== 'all' && request.status !== statusFilter) {
        return false;
      }

      if (contactFilter !== 'all') {
        const requestContactId = request.contact?.id ?? null;
        if (!requestContactId || requestContactId !== contactFilter) {
          return false;
        }
      }

      return true;
    });
  }, [requests, statusFilter, contactFilter]);

  useEffect(() => {
    setSelectedIds((prev) => {
      if (prev.size === 0) {
        return prev;
      }

      const allowed = new Set(filteredRequests.map((request) => request.id));
      const next = new Set<string>();
      prev.forEach((id) => {
        if (allowed.has(id)) {
          next.add(id);
        }
      });

      if (next.size === prev.size) {
        return prev;
      }

      return next;
    });
  }, [filteredRequests]);

  const toggleSelectAll = useCallback(
    (selectAll: boolean) => {
      if (!selectAll) {
        setSelectedIds(new Set());
        return;
      }

      setSelectedIds(new Set(filteredRequests.map((request) => request.id)));
    },
    [filteredRequests]
  );

  const handleHeaderCheckboxChange = useCallback(
    (checked: CheckedState) => {
      toggleSelectAll(checked === true);
    },
    [toggleSelectAll]
  );

  const toggleSelection = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const selectedRequests = useMemo(
    () => requests.filter((request) => selectedIds.has(request.id)),
    [requests, selectedIds]
  );

  const pendingSelected = useMemo(
    () => selectedRequests.filter((request) => request.status === 'pending'),
    [selectedRequests]
  );

  const hasSelection = selectedRequests.length > 0;
  const selectedCount = selectedRequests.length;
  const pendingCount = pendingSelected.length;
  const isBulkCompleting = completeMutation.isPending;
  const isBulkRevoking = revokeMutation.isPending;
  const isBulkResending = resendMutation.isPending;
  const isBulkReassigning = reassignMutation.isPending;
  const visibleSelectedCount = filteredRequests.filter((request) => selectedIds.has(request.id)).length;
  const headerCheckboxState: CheckedState =
    filteredRequests.length === 0
      ? false
      : visibleSelectedCount === 0
      ? false
      : visibleSelectedCount === filteredRequests.length
      ? true
      : 'indeterminate';

  const handleBulkComplete = useCallback(() => {
    if (pendingSelected.length === 0) {
      notifications.error('Select at least one pending request to mark complete.');
      return;
    }

    const ids = pendingSelected.map((request) => request.id);
    completeMutation.mutate(
      { ids },
      {
        onSuccess: () => {
          setSelectedIds(new Set());
        },
      }
    );
  }, [completeMutation, pendingSelected]);

  const handleBulkRevoke = useCallback(() => {
    if (pendingSelected.length === 0) {
      notifications.error('Select at least one pending request to revoke.');
      return;
    }

    const ids = pendingSelected.map((request) => request.id);
    revokeMutation.mutate(
      { ids },
      {
        onSuccess: () => {
          setSelectedIds(new Set());
        },
      }
    );
  }, [pendingSelected, revokeMutation]);

  const handleBulkResend = useCallback(() => {
    if (selectedRequests.length === 0) {
      notifications.error('Select at least one request to log a reminder or reopen.');
      return;
    }

    const ids = selectedRequests.map((request) => request.id);
    const requestedAt = new Date().toISOString();

    resendMutation.mutate(
      { ids, requestedAt },
      {
        onSuccess: () => {
          setSelectedIds(new Set());
        },
      }
    );
  }, [resendMutation, selectedRequests]);

  const openReassignDialog = useCallback((requestsToReassign: DataRequestSummary[]) => {
    const pendingRequests = requestsToReassign.filter((request) => request.status === 'pending');
    if (pendingRequests.length === 0) {
      notifications.error('Select at least one pending request to change contact.');
      return;
    }

    setReassignConfig({ requests: pendingRequests });
    setReassignContactId('');
  }, []);

  const handleBulkReassign = useCallback(() => {
    openReassignDialog(pendingSelected);
  }, [openReassignDialog, pendingSelected]);

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
      const requestedAt = new Date().toISOString();
      resendMutation.mutate({ ids: [request.id], requestedAt });
    },
    [resendMutation]
  );

  const handleRowReassign = useCallback(
    (request: DataRequestSummary) => {
      if (request.status !== 'pending') {
        return;
      }

      openReassignDialog([request]);
    },
    [openReassignDialog]
  );

  const openModalForRequest = useCallback((request: DataRequestSummary) => {
    const fields = request.dataPoint
      ? [
          {
            fieldId: request.dataPoint.id ?? '',
            fieldLabel: request.dataPoint.label ?? request.dataPoint.id ?? 'Field',
            itemId: request.dataPoint.itemId ?? null,
            fieldHint: request.dataPoint.hint ?? null,
          },
        ]
      : [];

    setModalConfig({
      fields,
      initialContact: {
        id: request.contact?.id,
        email: request.contact?.email ?? undefined,
        name: request.contact?.name ?? undefined,
      },
    });
  }, []);

  const openModalForSelection = useCallback(() => {
    if (!selectedRequests.length) {
      notifications.error('Select at least one request.');
      return;
    }

    const fields = selectedRequests
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
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    if (!fields.length) {
      notifications.error('Selected requests have no associated data points.');
      return;
    }

    setModalConfig({ fields, initialContact: undefined });
  }, [selectedRequests]);

  const closeModal = useCallback(() => {
    setModalConfig(null);
  }, []);

  const closeReassignDialog = useCallback(() => {
    if (reassignMutation.isPending) {
      return;
    }

    setReassignConfig(null);
    setReassignContactId('');
  }, [reassignMutation.isPending]);

  const handleConfirmReassign = useCallback(() => {
    if (!reassignConfig) {
      return;
    }

    const targetContact = contacts.find((contact) => contact.id === reassignContactId);
    if (!targetContact) {
      notifications.error('Choose a contact.');
      return;
    }

    const sameContactOnly = reassignConfig.requests.every(
      (request) => request.contact?.id === targetContact.id
    );

    if (sameContactOnly) {
      notifications.error('Choose a different contact.');
      return;
    }

    reassignMutation.mutate(
      {
        ids: reassignConfig.requests.map((request) => request.id),
        contact: {
          id: targetContact.id,
          email: targetContact.email,
          name: targetContact.name,
        },
        reassignedAt: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setSelectedIds(new Set());
          setReassignConfig(null);
          setReassignContactId('');
        },
      }
    );
  }, [contacts, reassignConfig, reassignContactId, reassignMutation]);

  const handleRefreshAfterLog = useCallback(async () => {
    const [contactsOutcome, requestsOutcome] = await Promise.allSettled([
      refetchContacts({ throwOnError: false }),
      refetchRequests({ throwOnError: false }),
    ]);

    if (contactsOutcome.status === 'rejected') {
      const messageText = contactsOutcome.reason instanceof Error ? contactsOutcome.reason.message : 'Failed to refresh contacts';
      notifications.error(messageText);
    } else if (contactsOutcome.value.error) {
      const messageText = contactsOutcome.value.error instanceof Error ? contactsOutcome.value.error.message : 'Failed to refresh contacts';
      notifications.error(messageText);
    }

    if (requestsOutcome.status === 'rejected') {
      const messageText = requestsOutcome.reason instanceof Error ? requestsOutcome.reason.message : 'Failed to refresh data requests';
      notifications.error(messageText);
      return;
    }

    if (requestsOutcome.value.error) {
      const messageText = requestsOutcome.value.error instanceof Error ? requestsOutcome.value.error.message : 'Failed to refresh data requests';
      notifications.error(messageText);
      return;
    }

    setSelectedIds(new Set());
  }, [refetchContacts, refetchRequests, setSelectedIds]);

  const bulkBusy = isBulkCompleting || isBulkRevoking || isBulkResending || isBulkReassigning;
  const reassignRequestCount = reassignConfig?.requests.length ?? 0;
  const reassignSourceContacts = reassignConfig
    ? Array.from(new Set(reassignConfig.requests.map((request) => request.contact?.id).filter(Boolean)))
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
              <SelectTrigger className="w-[150px]" aria-label="Filter requests by status">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={contactFilter} onValueChange={setContactFilter}>
              <SelectTrigger className="w-[180px]" aria-label="Filter requests by contact">
                <SelectValue placeholder="Filter contact" />
              </SelectTrigger>
              <SelectContent>
                {contactOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={openModalForSelection} disabled={!hasSelection}>
              <Mail className="mr-2 h-4 w-4" />
              Send email
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>
                {showInitialLoadingState
                  ? 'Loading…'
                  : `${requests.length} request${requests.length === 1 ? '' : 's'}`}
              </span>
              {hasSelection && (
                <span>
                  {selectedCount} selected · {pendingCount} pending
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
                {isBulkCompleting ? (
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
                {isBulkRevoking ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                Revoke
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkReassign}
                disabled={!pendingCount || bulkBusy || contacts.length === 0}
              >
                {isBulkReassigning ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserRound className="mr-2 h-4 w-4" />
                )}
                Change contact
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkResend}
                disabled={!hasSelection || bulkBusy}
                title="Record a reminder for pending requests or reopen closed requests. No email is sent."
              >
                {isBulkResending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                {pendingCount === selectedCount
                  ? 'Log reminder'
                  : pendingCount === 0
                  ? 'Reopen requests'
                  : 'Log reminders / reopen'}
              </Button>
            </div>
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
                      onCheckedChange={handleHeaderCheckboxChange}
                      disabled={filteredRequests.length === 0}
                    />
                  </th>
                  <th className="py-3 pr-3">Data point</th>
                  <th className="py-3 pr-3">Contact</th>
                  <th className="py-3 pr-3">Deadline</th>
                  <th className="py-3 pr-3">Status</th>
                  <th className="py-3 pr-3">Requested</th>
                  <th className="py-3 pr-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {showInitialLoadingState ? (
                  <DataRequestsTableSkeleton />
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Inbox className="h-10 w-10" />
                        <p className="font-medium">No data requests found</p>
                        <p className="text-sm">
                          Adjust your filters or send a new request to get started.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => {
                    const isSelected = selectedIds.has(request.id);
                    const contactName = (request.contact?.name ?? '').trim();
                    const contactLabel = contactName || request.contact?.email || 'Unassigned';

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
                        <td className="py-3 pr-3 align-top">
                          <div>{formatDateTime(request.deadline ?? null)}</div>
                        </td>
                        <td className="py-3 pr-3 align-top">
                          {(request.status === 'pending' || request.status === 'completed' || request.status === 'revoked') && (
                            <Badge variant={BADGE_VARIANT[request.status]}>{STATUS_LABELS[request.status]}</Badge>
                          )}
                        </td>
                        <td className="py-3 pr-3 align-top">
                          <div className="text-xs text-muted-foreground">{formatDateTime(request.requestedAt)}</div>
                          {request.completedAt && (
                            <div className="text-xs text-muted-foreground">Completed {formatDateTime(request.completedAt)}</div>
                          )}
                          {request.revokedAt && (
                            <div className="text-xs text-muted-foreground">Revoked {formatDateTime(request.revokedAt)}</div>
                          )}
                        </td>
                        <td className="py-3 pl-3 align-top text-right">
                          <div className="inline-flex flex-wrap justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openModalForRequest(request)}
                            >
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
                              onClick={() => handleRowReassign(request)}
                              disabled={request.status !== 'pending' || reassignMutation.isPending || contacts.length === 0}
                            >
                              {reassignMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <UserRound className="mr-2 h-4 w-4" />
                              )}
                              Change contact
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
      </Card>

      {modalConfig && (
        <RequestDataModal
          projectId={projectId}
          projectName={projectName}
          projectOwnerName={projectOwnerName}
          onClose={closeModal}
          fields={modalConfig.fields}
          initialContact={modalConfig.initialContact}
          mailtoTemplate={resolvedMailtoTemplate ?? undefined}
          contacts={contacts}
          onLogged={handleRefreshAfterLog}
        />
      )}

      <Dialog open={Boolean(reassignConfig)} onOpenChange={(open) => {
        if (!open) {
          closeReassignDialog();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change contact</DialogTitle>
            <DialogDescription>
              Reassign {reassignRequestCount} pending request{reassignRequestCount === 1 ? '' : 's'} to another contact.
              The current pending request{reassignRequestCount === 1 ? '' : 's'} will be revoked and new pending request{reassignRequestCount === 1 ? '' : 's'} will be created.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Select value={reassignContactId} onValueChange={setReassignContactId}>
              <SelectTrigger aria-label="Choose replacement contact">
                <SelectValue placeholder="Choose contact" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => {
                  const isOnlyCurrentContact = reassignSourceContacts.length === 1 && reassignSourceContacts[0] === contact.id;
                  return (
                    <SelectItem key={contact.id} value={contact.id} disabled={isOnlyCurrentContact}>
                      {contact.name} · {contact.email}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {contacts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No contacts are available yet. Use Email to create the first contact.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeReassignDialog} disabled={reassignMutation.isPending}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmReassign}
              disabled={!reassignContactId || reassignMutation.isPending}
            >
              {reassignMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserRound className="mr-2 h-4 w-4" />
              )}
              Change contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DataRequestsTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="border-b last:border-b-0">
          <td className="py-3 pr-3 align-top">
            <Skeleton className="h-4 w-4" />
          </td>
          <td className="py-3 pr-3 align-top">
            <div className="space-y-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-56" />
            </div>
          </td>
          <td className="py-3 pr-3 align-top">
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-48" />
            </div>
          </td>
          <td className="py-3 pr-3 align-top">
            <Skeleton className="h-4 w-28" />
          </td>
          <td className="py-3 pr-3 align-top">
            <Skeleton className="h-5 w-20 rounded-full" />
          </td>
          <td className="py-3 pr-3 align-top">
            <div className="space-y-2">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-3 w-32" />
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
