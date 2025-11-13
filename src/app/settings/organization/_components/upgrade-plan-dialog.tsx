'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePlanUpgradeRequest } from '@/lib/data-client/organizations';
import { Loader2, Rocket } from 'lucide-react';

const PLAN_OPTIONS = [
  { code: 'pro_beta', label: 'Pro Beta' },
];

type UpgradePlanDialogProps = {
  organizationId: string;
  currentPlanCode: string;
};

export function UpgradePlanDialog({ organizationId, currentPlanCode }: UpgradePlanDialogProps) {
  const [open, setOpen] = useState(false);
  const [targetPlan, setTargetPlan] = useState('pro_beta');
  const [contactEmail, setContactEmail] = useState('');
  const [notes, setNotes] = useState('');
  const upgradeMutation = usePlanUpgradeRequest(organizationId);

  useEffect(() => {
    if (!open) {
      setTargetPlan('pro_beta');
      setContactEmail('');
      setNotes('');
    }
  }, [open]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    upgradeMutation.mutate(
      {
        target_plan_code: targetPlan,
        contact_email: contactEmail || undefined,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  const isSubmitting = upgradeMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Rocket className="mr-2 h-4 w-4" aria-hidden />
          Request upgrade
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request plan upgrade</DialogTitle>
          <DialogDescription>
            Upgrades are handled manually during beta. Provide context so the team can unblock you quickly.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="plan-select">Target plan</Label>
            <Select value={targetPlan} onValueChange={setTargetPlan}>
              <SelectTrigger id="plan-select" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" className="w-[240px]">
                {PLAN_OPTIONS.map((option) => (
                  <SelectItem key={option.code} value={option.code} disabled={option.code === currentPlanCode}>
                    {option.label}
                    {option.code === currentPlanCode ? (
                      <span className="ml-2 text-xs text-muted-foreground">Current plan</span>
                    ) : null}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="upgrade-email">Contact email (optional)</Label>
            <Input
              id="upgrade-email"
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              placeholder="you@company.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="upgrade-notes">Notes</Label>
            <textarea
              id="upgrade-notes"
              value={notes}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setNotes(event.target.value)}
              rows={4}
              placeholder="Share context around project load, team size, or urgency."
              className="min-h-[120px] resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
              Submit request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
