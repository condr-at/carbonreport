'use client';

import { useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useOrganizationMembers, useOrganizationUsage, useRemoveMembership, useUpdateMembershipRole } from '@/lib/data-client/organizations';
import type { OrganizationMember } from '@/lib/data-client/organizations';
import { InviteMemberDialog } from './invite-member-dialog';
import { Loader2, MoreHorizontal } from 'lucide-react';

const ROLE_BADGE_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  OWNER: 'default',
  ADMIN: 'default',
  EDITOR: 'secondary',
  VIEWER_READONLY: 'outline',
  VIEWER_VERIFIER: 'outline',
};

const ROLE_LABELS: Record<string, string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  EDITOR: 'Editor',
  VIEWER_READONLY: 'Viewer',
  VIEWER_VERIFIER: 'Verifier',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Invite pending',
  accepted: 'Active',
  declined: 'Declined',
  revoked: 'Revoked',
};

type MembersTabProps = {
  organizationId: string;
  limits: {
    max_editors: number;
    max_verifiers: number;
  };
  featureFlags: {
    verifierRoleEnabled: boolean;
  };
};

function initialsFromName(name: string | null, email: string | null) {
  const source = name?.trim() || email?.trim() || '??';
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((segment) => segment.charAt(0)?.toUpperCase() ?? '')
    .join('')
    .padEnd(2, '?');
}

function formatDate(value: string | null) {
  if (!value) {
    return '—';
  }

  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
}

function normalizeMembers(members: OrganizationMember[]): OrganizationMember[] {
  return members.slice().sort((a, b) => {
    const statusRank = (status: string) => {
      switch (status) {
        case 'accepted':
          return 0;
        case 'pending':
          return 1;
        case 'declined':
          return 2;
        default:
          return 3;
      }
    };

    const statusCompare = statusRank(a.invite_status) - statusRank(b.invite_status);
    if (statusCompare !== 0) {
      return statusCompare;
    }

    return (a.name ?? a.email ?? '').localeCompare(b.name ?? b.email ?? '');
  });
}

export function MembersTab({ organizationId, limits, featureFlags }: MembersTabProps) {
  const { data: members, isLoading, isError, refetch } = useOrganizationMembers(organizationId);
  const { data: usage } = useOrganizationUsage(organizationId);
  const updateRoleMutation = useUpdateMembershipRole(organizationId);
  const removeMutation = useRemoveMembership(organizationId);

  const normalizedMembers = useMemo(() => (members ? normalizeMembers(members) : []), [members]);
  const editorSeats = {
    limit: limits.max_editors,
    used: usage?.usage.active_editors ?? 0,
  };
  const verifierSeats = {
    limit: limits.max_verifiers,
    used: usage?.usage.active_verifiers ?? 0,
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>Loading organization members…</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={`member-skeleton-${index}`} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>We could not load organization members.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-destructive">Try reloading the page or refresh memberships.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  const editorRemaining = editorSeats.limit === null ? null : Math.max(0, editorSeats.limit - editorSeats.used);
  const verifierRemaining = verifierSeats.limit === null ? null : Math.max(0, verifierSeats.limit - verifierSeats.used);

  const handleRoleChange = (membershipId: string, nextRole: string) => {
    updateRoleMutation.mutate({ membershipId, role: nextRole });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <CardTitle>Members</CardTitle>
            <CardDescription>Manage roles and invitations for your organization.</CardDescription>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>
                Editor seats: {editorRemaining === null ? 'unlimited' : `${editorRemaining} remaining`}
              </span>
              <span>
                Verifier seats: {featureFlags.verifierRoleEnabled ? (verifierRemaining === null ? 'unlimited' : `${verifierRemaining} remaining`) : 'disabled'}
              </span>
            </div>
          </div>
          <InviteMemberDialog
            organizationId={organizationId}
            editorSeats={editorSeats}
            verifierSeats={verifierSeats}
            verifierRoleEnabled={featureFlags.verifierRoleEnabled}
          />
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full table-fixed border-collapse text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="w-[28%] pb-2 pr-4 font-medium">Member</th>
                <th className="w-[18%] pb-2 pr-4 font-medium">Role</th>
                <th className="w-[18%] pb-2 pr-4 font-medium">Status</th>
                <th className="w-[18%] pb-2 pr-4 font-medium">Joined</th>
                <th className="w-[18%] pb-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {normalizedMembers.map((member) => {
                const isOwner = member.role === 'OWNER';
                const statusLabel = STATUS_LABEL[member.invite_status] ?? member.invite_status;
                const roleBadgeVariant = ROLE_BADGE_VARIANT[member.role] ?? 'outline';
                const name = member.name ?? member.email ?? 'Unknown user';
                const canUpdateRole = !isOwner && member.invite_status === 'accepted';
                const canRemove = !isOwner;
                const editorLimitReached = editorRemaining !== null && editorRemaining <= 0;
                const verifierLimitReached = verifierRemaining !== null && verifierRemaining <= 0;

                return (
                  <tr key={member.membership_id} className="align-middle">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          {member.avatar_url ? (
                            <AvatarImage src={member.avatar_url} alt={name} />
                          ) : (
                            <AvatarFallback>{initialsFromName(member.name, member.email)}</AvatarFallback>
                          )}
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{name}</p>
                          <p className="truncate text-xs text-muted-foreground">{member.email ?? '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={roleBadgeVariant}>{ROLE_LABELS[member.role] ?? member.role}</Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs text-muted-foreground">{statusLabel}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs text-muted-foreground">{formatDate(member.joined_at)}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" aria-hidden />
                              <span className="sr-only">Open actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              disabled={!canUpdateRole || updateRoleMutation.isPending}
                              onClick={() => handleRoleChange(member.membership_id, 'ADMIN')}
                            >
                              Make admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={
                                !canUpdateRole || updateRoleMutation.isPending || (member.role !== 'EDITOR' && editorLimitReached)
                              }
                              onClick={() => handleRoleChange(member.membership_id, 'EDITOR')}
                            >
                              Make editor
                              {editorLimitReached && member.role !== 'EDITOR' ? (
                                <span className="ml-auto text-[10px] uppercase text-destructive">No seats</span>
                              ) : null}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={!canUpdateRole || updateRoleMutation.isPending}
                              onClick={() => handleRoleChange(member.membership_id, 'VIEWER_READONLY')}
                            >
                              Make viewer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={
                                !canUpdateRole ||
                                updateRoleMutation.isPending ||
                                !featureFlags.verifierRoleEnabled ||
                                (member.role !== 'VIEWER_VERIFIER' && verifierLimitReached)
                              }
                              onClick={() => handleRoleChange(member.membership_id, 'VIEWER_VERIFIER')}
                              title={
                                featureFlags.verifierRoleEnabled
                                  ? verifierLimitReached && member.role !== 'VIEWER_VERIFIER'
                                    ? 'No verifier seats remaining'
                                    : undefined
                                  : 'Approval tools coming soon'
                              }
                            >
                              Make verifier
                              {!featureFlags.verifierRoleEnabled ? (
                                <span className="ml-auto text-[10px] uppercase text-amber-600">Disabled</span>
                              ) : verifierLimitReached && member.role !== 'VIEWER_VERIFIER' ? (
                                <span className="ml-auto text-[10px] uppercase text-destructive">No seats</span>
                              ) : null}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  disabled={!canRemove || removeMutation.isPending}
                                >
                                  Remove from org
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove member</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {member.name ?? member.email} will lose access immediately. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel disabled={removeMutation.isPending}>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => removeMutation.mutate({ membershipId: member.membership_id })}
                                    disabled={removeMutation.isPending}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    {removeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
                                    Remove member
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {normalizedMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    No teammates yet. Invite your first member to collaborate.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
}
