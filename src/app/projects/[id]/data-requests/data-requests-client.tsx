'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import type { DataRequestSummary } from '@/components/dataset-table';
import { Loader2, Mail, RefreshCw, CheckCircle2, XCircle, Inbox } from 'lucide-react';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { notifications } from '@/components/ui/notifications';

interface ContactSummary {
  id: string;
  name: string | null;
  email: string;
  position: string | null;
}

interface DataRequestsPageClientProps {
  projectId: string;
  projectName: string;
  projectOwnerName: string;
  initialRequests: DataRequestSummary[];
  initialContacts: ContactSummary[];
  mailtoTemplate: { subject?: string; body?: string } | null;
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

const BADGE_VARIANT: Record<Exclude<StatusFilter, 'all'>, 'default' | 'secondary' | 'destructive' | 'outline'> = {
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

  const [requests, setRequests] = useState<DataRequestSummary[]>(initialRequests);
  const [contacts, setContacts] = useState<NormalizedContact[]>(
    initialContacts.map((contact) => normalizeContact(contact))
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [contactFilter, setContactFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkCompleting, setIsBulkCompleting] = useState(false);
  const [isBulkRevoking, setIsBulkRevoking] = useState(false);

  useEffect(() => {
    setRequests(initialRequests);
  }, [initialRequests]);

  useEffect(() => {
    setContacts(initialContacts.map((contact) => normalizeContact(contact)));
  }, [initialContacts, normalizeContact]);

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
    (checked: boolean) => {
      if (!checked) {
        setSelectedIds(new Set());
        return;
      }

      setSelectedIds(new Set(filteredRequests.map((request) => request.id)));
    },
    [filteredRequests]
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
  const bulkBusy = isBulkCompleting || isBulkRevoking;
  const selectedCount = selectedRequests.length;
  const pendingCount = pendingSelected.length;
  const visibleSelectedCount = filteredRequests.filter((request) => selectedIds.has(request.id)).length;
  const headerCheckboxState: CheckedState =
    filteredRequests.length === 0
      ? false
      : visibleSelectedCount === 0
      ? false
      : visibleSelectedCount === filteredRequests.length
      ? true
      : 'indeterminate';

  const refreshRequests = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/data-requests?status=all`, {
        cache: 'no-store',
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const errorMessage = payload?.error ?? 'Failed to refresh data requests';
        throw new Error(errorMessage);
      }

      const nextRequests = Array.isArray(payload?.requests)
        ? (payload.requests as DataRequestSummary[])
        : [];
      setRequests(nextRequests);
      setSelectedIds(new Set());
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Failed to refresh data requests';
      notifications.error(messageText);
    } finally {
      setIsRefreshing(false);
    }
  }, [projectId]);

  const refreshContacts = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/contacts`, {
        cache: 'no-store',
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        return;
      }

      if (Array.isArray(payload?.contacts)) {
        setContacts(
          (payload.contacts as ContactSummary[]).map((contact) => normalizeContact(contact))
        );
      }
    } catch (error) {
      console.error('Failed to refresh contacts', error);
    }
  }, [projectId, normalizeContact]);
  const applyUpdates = useCallback((next: DataRequestSummary[]) => {
    if (next.length === 0) {
      return;
    }

    const updates = new Map(next.map((request) => [request.id, request]));
    setRequests((prev) => prev.map((item) => updates.get(item.id) ?? item));
  }, []);

  const handleBulkComplete = useCallback(async () => {
    if (pendingSelected.length === 0) {
      notifications.error('Select at least one pending request to mark complete.');
      return;
    }

    const ids = pendingSelected.map((request) => request.id);
    const snapshots = new Map(pendingSelected.map((request) => [request.id, request]));
    const revertSelection = new Set(ids);
    const optimisticCompletedAt = new Date().toISOString();

    setIsBulkCompleting(true);

    // Optimistic status swap so the table responds immediately.
    setRequests((prev) =>
      prev.map((item) =>
        snapshots.has(item.id)
          ? {
              ...item,
              status: 'completed',
              completedAt: optimisticCompletedAt,
              revokedAt: null,
            }
          : item
      )
    );
    setSelectedIds(new Set());

    try {
      const response = await fetch('/api/data-requests/complete-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const errorMessage = payload?.error ?? 'Failed to mark requests complete';
        throw new Error(errorMessage);
      }

      const updatedRequests = Array.isArray(payload?.requests)
        ? (payload.requests as DataRequestSummary[])
        : [];

      applyUpdates(updatedRequests);

      const updatedCount = typeof payload?.updated === 'number' ? payload.updated : updatedRequests.length;

      notifications.success(
        `Marked ${updatedCount} request${updatedCount === 1 ? '' : 's'} as completed.`
      );
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Failed to mark requests complete';
      setRequests((prev) =>
        prev.map((item) => (snapshots.has(item.id) ? snapshots.get(item.id)! : item))
      );
      setSelectedIds(revertSelection);
      notifications.error(messageText);
    } finally {
      setIsBulkCompleting(false);
    }
  }, [applyUpdates, pendingSelected]);

  const handleBulkRevoke = useCallback(async () => {
    if (pendingSelected.length === 0) {
      notifications.error('Select at least one pending request to revoke.');
      return;
    }

    const ids = pendingSelected.map((request) => request.id);
    const snapshots = new Map(pendingSelected.map((request) => [request.id, request]));
    const revertSelection = new Set(ids);
    const optimisticRevokedAt = new Date().toISOString();

    setIsBulkRevoking(true);

    // Optimistic status swap mirrors the backend update to avoid perceived lag.
    setRequests((prev) =>
      prev.map((item) =>
        snapshots.has(item.id)
          ? {
              ...item,
              status: 'revoked',
              revokedAt: optimisticRevokedAt,
              completedAt: null,
            }
          : item
      )
    );
    setSelectedIds(new Set());

    try {
      const response = await fetch('/api/data-requests/revoke-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const errorMessage = payload?.error ?? 'Failed to revoke requests';
        throw new Error(errorMessage);
      }

      const updatedRequests = Array.isArray(payload?.requests)
        ? (payload.requests as DataRequestSummary[])
        : [];

      applyUpdates(updatedRequests);

      const updatedCount = typeof payload?.updated === 'number' ? payload.updated : updatedRequests.length;

      notifications.success(`Revoked ${updatedCount} request${updatedCount === 1 ? '' : 's'}.`);
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Failed to revoke requests';
      setRequests((prev) =>
        prev.map((item) => (snapshots.has(item.id) ? snapshots.get(item.id)! : item))
      );
      setSelectedIds(revertSelection);
      notifications.error(messageText);
    } finally {
      setIsBulkRevoking(false);
    }
  }, [applyUpdates, pendingSelected]);

  const handleBulkResend = useCallback(() => {
    if (pendingSelected.length === 0) {
      notifications.error('Select at least one pending request to resend.');
      return;
    }

    const fields: ModalConfig['fields'] = [];
    const contactKeys = new Set<string>();

    for (const request of pendingSelected) {
      const fieldId = request.dataPoint?.id ?? '';
      if (!fieldId) {
        notifications.error('Selected request is missing field metadata.');
        return;
      }

      const fieldLabel = request.dataPoint?.label ?? request.dataPoint?.id ?? 'Requested field';
      fields.push({
        fieldId,
        fieldLabel,
        itemId: request.dataPoint?.itemId ?? null,
        fieldHint: request.dataPoint?.hint ?? null,
      });

      const key = request.contact?.id ?? request.contact?.email ?? '__missing__';
      contactKeys.add(key);
    }

    if (contactKeys.size > 1) {
      notifications.error('Select requests that share the same contact before resending.');
      return;
    }

    const first = pendingSelected[0];
    const initialContact = first.contact
      ? {
          id: first.contact.id ?? undefined,
          email: first.contact.email ?? undefined,
          name: first.contact.name ?? undefined,
        }
      : undefined;

    setModalConfig({
      fields,
      initialContact,
    });
  }, [pendingSelected]);

  const handleModalLogged = useCallback(async () => {
    await Promise.all([refreshRequests(), refreshContacts()]);
  }, [refreshContacts, refreshRequests]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Data Requests</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track outstanding requests, resend emails, and close out completed items.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-md border p-1">
            {STATUS_OPTIONS.map((option) => {
              const isActive = statusFilter === option.value;
              return (
                <Button
                  key={option.value}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={isActive ? '' : 'hover:bg-muted'}
                  onClick={() => setStatusFilter(option.value)}
                >
                  {option.label}
                </Button>
              );
            })}
          </div>

          <Select value={contactFilter} onValueChange={setContactFilter}>
            <SelectTrigger className="w-44" size="sm">
              <SelectValue placeholder="Filter contacts" />
            </SelectTrigger>
            <SelectContent align="end">
              {contactOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={refreshRequests}
            disabled={isRefreshing}
          >
            {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {hasSelection && (
          <div className="mb-4 flex flex-col gap-3 rounded-md border border-border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedCount} request{selectedCount === 1 ? '' : 's'} selected · {pendingCount} pending
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={handleBulkResend}
                disabled={bulkBusy || pendingCount === 0}
              >
                <Mail className="mr-2 h-4 w-4" />
                Resend email
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={handleBulkComplete}
                disabled={bulkBusy || pendingCount === 0}
              >
                {isBulkCompleting && pendingCount > 0 ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                Mark complete
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkRevoke}
                disabled={bulkBusy || pendingCount === 0}
              >
                {isBulkRevoking && pendingCount > 0 ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                Revoke
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedIds(new Set())}
                disabled={bulkBusy}
              >
                Clear selection
              </Button>
            </div>
          </div>
        )}

        {filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-12 text-center">
            <Inbox className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium">No requests match the current filters.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try choosing a different status or contact to continue.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-3 pl-3 pr-2 text-left">
                    <Checkbox
                      aria-label="Select all requests"
                      checked={headerCheckboxState}
                      onCheckedChange={(state) => toggleSelectAll(state === true)}
                    />
                  </th>
                  <th className="py-3 text-left">Field</th>
                  <th className="py-3 text-left">Contact</th>
                  <th className="py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => {
                  const status = request.status as Exclude<StatusFilter, 'all'>;
                  const badgeVariant = BADGE_VARIANT[status] ?? 'secondary';
                  const contactName = (request.contact?.name ?? '').trim() || request.contact?.email || '—';
                  const isSelected = selectedIds.has(request.id);

                  return (
                    <tr key={request.id} className="border-b last:border-0">
                      <td className="py-4 pl-3 pr-2 align-top">
                        <Checkbox
                          aria-label="Select request"
                          checked={isSelected}
                          onCheckedChange={(state) => toggleSelection(request.id, state === true)}
                        />
                      </td>
                      <td className="py-4 align-top">
                        <div className="font-medium">
                          {request.dataPoint?.label ?? request.dataPoint?.id ?? 'Unknown field'}
                        </div>
                        {request.dataPoint?.itemId && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            Item {request.dataPoint.itemId}
                          </div>
                        )}
                        {request.dataPoint?.hint && (
                          <p className="mt-2 text-xs text-muted-foreground max-w-md">
                            {request.dataPoint.hint}
                          </p>
                        )}
                      </td>
                      <td className="py-4 align-top">
                        <div className="font-medium">{contactName}</div>
                        {request.contact?.email && (
                          <div className="text-xs text-muted-foreground">{request.contact.email}</div>
                        )}
                      </td>
                      <td className="py-4 align-top">
                        <Badge variant={badgeVariant}>{STATUS_LABELS[status]}</Badge>
                        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                          <p>Requested: {formatDateTime(request.requestedAt)}</p>
                          <p>Completed: {formatDateTime(request.completedAt)}</p>
                          <p>Revoked: {formatDateTime(request.revokedAt)}</p>
                          <p>Deadline: {formatDateTime(request.deadline ?? null)}</p>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {modalConfig && (
        <RequestDataModal
          projectId={projectId}
          projectName={projectName}
          projectOwnerName={projectOwnerName}
          fields={modalConfig.fields}
          mailtoTemplate={resolvedMailtoTemplate ?? undefined}
          contacts={contacts}
          initialContact={modalConfig.initialContact}
          onClose={() => setModalConfig(null)}
          onLogged={handleModalLogged}
        />
      )}
    </Card>
  );
}
