'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useDeleteOrganization } from '@/lib/data-client/organizations';

const RETENTION_DAYS = 30;

type DangerZoneTabProps = {
  organizationId: string;
  slug: string;
  organizationName: string;
  onDeleted: () => void;
};

export function DangerZoneTab({ organizationId, slug, organizationName, onDeleted }: DangerZoneTabProps) {
  const [confirmationInput, setConfirmationInput] = useState('');
  const deleteMutation = useDeleteOrganization(organizationId);
  const confirmationMatches = confirmationInput.trim() === slug;

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setConfirmationInput('');
        onDeleted();
      },
    });
  };

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" aria-hidden />
          Delete organization
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Deleting {organizationName} immediately revokes access for all members and soft deletes associated projects. You can restore within {RETENTION_DAYS} days before data is permanently purged.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Confirm by typing the slug</p>
          <p className="text-xs text-muted-foreground">
            This action cascades a soft delete across all projects. Restoring requires the retention window and available plan capacity.
          </p>
          <Input
            value={confirmationInput}
            onChange={(event) => setConfirmationInput(event.target.value)}
            placeholder={slug}
            aria-label="Confirm organization slug"
          />
        </div>
        <Button
          type="button"
          variant="destructive"
          disabled={!confirmationMatches || deleteMutation.isPending}
          onClick={handleDelete}
        >
          {deleteMutation.isPending ? 'Deleting…' : 'Delete organization'}
        </Button>
      </CardContent>
    </Card>
  );
}
