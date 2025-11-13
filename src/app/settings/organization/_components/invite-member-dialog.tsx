'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInviteOrganizationMember } from '@/lib/data-client/organizations';
import { Loader2, UserPlus2 } from 'lucide-react';

type SeatMeta = {
  limit: number | null;
  used: number;
};

type InviteMemberDialogProps = {
  organizationId: string;
  editorSeats: SeatMeta;
  verifierSeats: SeatMeta;
  verifierRoleEnabled: boolean;
};

function seatsRemaining(seat: SeatMeta): number | null {
  if (seat.limit === null) {
    return null;
  }
  const remaining = seat.limit - seat.used;
  return remaining < 0 ? 0 : remaining;
}

export function InviteMemberDialog({ organizationId, editorSeats, verifierSeats, verifierRoleEnabled }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string>('VIEWER_READONLY');
  const inviteMutation = useInviteOrganizationMember(organizationId);

  const editorRemaining = seatsRemaining(editorSeats);
  const verifierRemaining = seatsRemaining(verifierSeats);

  const editorLimitReached = editorRemaining !== null && editorRemaining <= 0;
  const verifierLimitReached = verifierRemaining !== null && verifierRemaining <= 0;
  const verifierDisabled = !verifierRoleEnabled || verifierLimitReached;

  useEffect(() => {
    if (!open) {
      setEmail('');
      setRole('VIEWER_READONLY');
    }
  }, [open]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    inviteMutation.mutate(
      {
        email,
        role,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  const isSubmitting = inviteMutation.isPending;
  const canSubmit = email.trim().length > 0 && !isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus2 className="mr-2 h-4 w-4" aria-hidden />
          Invite member
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite teammate</DialogTitle>
          <DialogDescription>
            Teammates need an existing Carbon Report account. Seat limits enforce editor and verifier roles automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="teammate@company.com"
              required
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="invite-role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="invite-role" className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent align="start" className="w-[240px]">
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="EDITOR" disabled={editorLimitReached} title={editorLimitReached ? 'No editor seats available' : undefined}>
                  Editor
                  {editorRemaining !== null ? (
                    <span className="text-xs text-muted-foreground">{editorRemaining} left</span>
                  ) : null}
                </SelectItem>
                <SelectItem value="VIEWER_READONLY">Viewer (read-only)</SelectItem>
                <SelectItem
                  value="VIEWER_VERIFIER"
                  disabled={verifierDisabled}
                  title={
                    !verifierRoleEnabled
                      ? 'Approval tools coming soon'
                      : verifierLimitReached
                        ? 'No verifier seats available'
                        : undefined
                  }
                >
                  Viewer (verifier)
                  {verifierRemaining !== null ? (
                    <span className="text-xs text-muted-foreground">{verifierRemaining} left</span>
                  ) : null}
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Admins can manage billing and members. Editors contribute data. Verifiers unlock approval tools when enabled.
            </p>
          </div>

          <DialogFooter className="sm:justify-between">
            <div className="space-y-1 text-xs text-muted-foreground">
              {editorRemaining !== null ? (
                <p>Editor seats remaining: {editorRemaining} / {editorSeats.limit}</p>
              ) : (
                <p>Editor seats: unlimited</p>
              )}
              {verifierRoleEnabled ? (
                verifierRemaining !== null ? (
                  <p>Verifier seats remaining: {verifierRemaining} / {verifierSeats.limit}</p>
                ) : (
                  <p>Verifier seats: unlimited</p>
                )
              ) : (
                <p className="text-amber-600">Verifier role disabled (Approval tools coming soon)</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
                Send invite
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
