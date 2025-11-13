'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/layouts/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useOrganizationContext } from '@/lib/organizations/context';
import { OrganizationProfileTab } from './_components/profile-tab';
import { MembersTab } from './_components/members-tab';
import { UsageTab } from './_components/usage-tab';
import { DangerZoneTab } from './_components/danger-zone-tab';
import { CreateOrganizationForm } from './_components/create-organization-form';

export default function OrganizationSettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCreateMode = searchParams.get('mode') === 'create';
  const {
    isLoading,
    isError,
    error,
    refetch,
    activeOrganizationId,
    currentOrganization,
    setActiveOrganizationId,
  } = useOrganizationContext();

  useEffect(() => {
    if (!isLoading && !activeOrganizationId && !isCreateMode) {
      router.replace('/no-organization');
    }
  }, [isLoading, activeOrganizationId, router, isCreateMode]);

  const handleCreateModalClose = () => {
    if (activeOrganizationId) {
      router.replace('/settings/organization');
    } else {
      router.replace('/no-organization');
    }
  };

  const createOrganizationDialog = (
    <Dialog
      open={isCreateMode}
      onOpenChange={(open) => {
        if (!open) {
          handleCreateModalClose();
        }
      }}
    >
      <DialogContent className="max-w-3xl sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>
            Set up a workspace for your company. You can invite teammates after creation.
          </DialogDescription>
        </DialogHeader>
        <CreateOrganizationForm
          variant="plain"
          onCreated={(organizationId) => {
            setActiveOrganizationId(organizationId);
            void refetch();
            router.replace('/settings/organization');
          }}
          onCancel={handleCreateModalClose}
        />
      </DialogContent>
    </Dialog>
  );

  if (isLoading) {
    return (
      <>
        <div className="space-y-6">
          <PageHeader title="Organization Settings" description="Manage workspace profile, seats, and lifecycle." />
          <Card>
            <CardContent className="space-y-4 py-10">
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
        {createOrganizationDialog}
      </>
    );
  }

  if (isError) {
    return (
      <>
        <div className="space-y-6">
          <PageHeader title="Organization Settings" description="Manage workspace profile, seats, and lifecycle." />
          <Card>
            <CardHeader>
              <CardTitle>Unable to load organization</CardTitle>
              <CardDescription>We couldn&apos;t find your active workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-destructive">{error instanceof Error ? error.message : 'Unknown error occurred.'}</p>
              <Button onClick={() => refetch()}>Retry</Button>
            </CardContent>
          </Card>
        </div>
        {createOrganizationDialog}
      </>
    );
  }

  if (!activeOrganizationId || !currentOrganization) {
    return (
      <>
        <div className="space-y-6">
          <PageHeader title="Organization Settings" description="Manage workspace profile, seats, and lifecycle." />
          <Card>
            <CardHeader>
              <CardTitle>No active organization</CardTitle>
              <CardDescription>Switch to an existing organization or create a new one to configure settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/no-organization')}>Go to onboarding</Button>
            </CardContent>
          </Card>
        </div>
        {createOrganizationDialog}
      </>
    );
  }

  const featureFlags = currentOrganization.feature_flags;

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="Organization Settings"
          description={`${currentOrganization.display_name} · ${currentOrganization.slug}`}
        />

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
            <TabsTrigger value="danger" className="text-destructive">Danger zone</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <OrganizationProfileTab
              organizationId={activeOrganizationId}
              organization={{
                display_name: currentOrganization.display_name,
                description: currentOrganization.description,
                slug: currentOrganization.slug,
                logo_asset_id: currentOrganization.logo_asset_id,
                logo_url: currentOrganization.logo_url,
                plan: {
                  label: currentOrganization.plan.label,
                  code: currentOrganization.plan.code,
                  valid_until: currentOrganization.plan.valid_until,
                },
              }}
            />
          </TabsContent>

          <TabsContent value="members">
            <MembersTab
              organizationId={activeOrganizationId}
              limits={{
                max_editors: currentOrganization.plan.max_editors,
                max_verifiers: currentOrganization.plan.max_verifiers,
              }}
              featureFlags={featureFlags}
            />
          </TabsContent>

          <TabsContent value="usage">
            <UsageTab
              organizationId={activeOrganizationId}
              plan={{
                code: currentOrganization.plan.code,
                label: currentOrganization.plan.label,
                valid_until: currentOrganization.plan.valid_until,
              }}
              billingUiEnabled={featureFlags.billingUiEnabled}
            />
          </TabsContent>

          <TabsContent value="danger">
            <DangerZoneTab
              organizationId={activeOrganizationId}
              slug={currentOrganization.slug}
              organizationName={currentOrganization.display_name}
              onDeleted={() => {
                refetch();
                router.replace('/no-organization');
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
      {createOrganizationDialog}
    </>
  );
}
