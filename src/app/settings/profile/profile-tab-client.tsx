'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { notifications } from '@/components/ui/notifications';
import { useUpdateOrganizationProfile } from '@/lib/data-client/organizations';
import { SquareImageUploader, type SquareImageValue } from '@/components/uploads/square-image-uploader';

const RETENTION_NOTE = 'Logo updates apply immediately after save. Max size 512 KB, formats: PNG, JPEG, SVG.';

function formatPlanValidity(date: string | null) {
  if (!date) {
    return 'No expiry';
  }

  try {
    return new Date(date).toLocaleDateString();
  } catch {
    return date;
  }
}

function ensureLines(value: string) {
  return value.replace(/\r\n/g, '\n');
}

export interface OrganizationProfileTabProps {
  organizationId: string;
  organization: {
    display_name: string;
    description: string | null;
    slug: string;
    logo_asset_id: string | null;
    logo_url: string | null;
    plan: {
      label: string;
      code: string;
      valid_until: string | null;
    };
  };
}

export function OrganizationProfileTab({ organizationId, organization }: OrganizationProfileTabProps) {
  const updateMutation = useUpdateOrganizationProfile(organizationId);
  const [displayName, setDisplayName] = useState(organization.display_name);
  const [description, setDescription] = useState(ensureLines(organization.description ?? ''));
  const [logoValue, setLogoValue] = useState<SquareImageValue>({ assetId: organization.logo_asset_id, url: organization.logo_url });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setDisplayName(organization.display_name);
    setDescription(ensureLines(organization.description ?? ''));
    setLogoValue({ assetId: organization.logo_asset_id, url: organization.logo_url });
    setHasChanges(false);
  }, [organization]);

  const planValidity = useMemo(() => formatPlanValidity(organization.plan.valid_until), [organization.plan.valid_until]);

  const handleLogoChange = (next: SquareImageValue) => {
    setLogoValue(next);
    setHasChanges(true);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const trimmedName = displayName.trim();
    const normalizedDescription = description.trim();

    const payload: {
      display_name?: string;
      description?: string | null;
      logo_asset_id?: string | null;
    } = {};

    if (trimmedName && trimmedName !== organization.display_name) {
      payload.display_name = trimmedName;
    }

    const originalDescription = organization.description ?? '';
    if (normalizedDescription !== originalDescription.trim()) {
      payload.description = normalizedDescription.length ? normalizedDescription : null;
    }

    if (logoValue.assetId !== organization.logo_asset_id) {
      payload.logo_asset_id = logoValue.assetId ?? null;
    }

    if (Object.keys(payload).length === 0) {
      notifications.info('No changes to save.');
      return;
    }

    updateMutation.mutate(payload, {
      onSuccess: () => {
        setHasChanges(false);
      },
    });
  };

  const isSaving = updateMutation.isPending;
  const disableSubmit = isSaving;

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card className="order-2 lg:order-1">
        <CardHeader>
          <CardTitle>Organization Profile</CardTitle>
          <CardDescription>Update how your workspace appears to teammates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="org-name">Display name</Label>
            <Input
              id="org-name"
              value={displayName}
              onChange={(event) => {
                setDisplayName(event.target.value);
                setHasChanges(true);
              }}
              placeholder="Acme Sustainability"
              maxLength={64}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="org-description">Description</Label>
            <textarea
              id="org-description"
              value={description}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                setDescription(event.target.value);
                setHasChanges(true);
              }}
              placeholder="Tell teammates what this organization owns or why it exists."
              maxLength={4000}
              rows={4}
              className="min-h-[120px] resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/4000 characters. Longer text is truncated in menus.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="org-slug">Slug</Label>
            <Input id="org-slug" value={organization.slug} readOnly disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">Used in URLs and integrations.</p>
          </div>

          <div className="flex items-center justify-between rounded-md border p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Plan</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary">{organization.plan.label}</Badge>
                <span>Expires: {planValidity}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={disableSubmit || !hasChanges}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
              Save changes
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setDisplayName(organization.display_name);
                setDescription(ensureLines(organization.description ?? ''));
                setLogoValue({ assetId: organization.logo_asset_id, url: organization.logo_url });
                setHasChanges(false);
              }}
              disabled={disableSubmit || !hasChanges}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="order-1 lg:order-2">
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>{RETENTION_NOTE}</CardDescription>
        </CardHeader>
        <CardContent>
          <SquareImageUploader
            resourceType="org_logo"
            value={logoValue}
            onChange={handleLogoChange}
            label="Organization logo"
            description="PNG, JPEG, or SVG · auto-cropped to square"
          />
        </CardContent>
      </Card>
    </form>
  );
}
