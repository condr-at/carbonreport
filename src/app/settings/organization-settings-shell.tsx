'use client'

import { Suspense, useEffect, type ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/layouts/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useOrganizationContext } from '@/lib/organizations/context'
import { CreateOrganizationForm } from './create-organization-form'

type TabKey = 'profile' | 'members' | 'usage' | 'billing' | 'danger'

const TAB_ROUTES: Record<TabKey, { label: string; href: string; destructive?: boolean }> = {
  profile: { label: 'Profile', href: '/settings/profile' },
  members: { label: 'Members', href: '/settings/members' },
  usage: { label: 'Usage & Limits', href: '/settings/usage' },
  billing: { label: 'Billing', href: '/settings/billing' },
  danger: { label: 'Danger zone', href: '/settings/danger', destructive: true },
}

type OrganizationSettingsShellProps = {
  activeTab: TabKey
  renderContent: (context: {
    organizationId: string
    currentOrganization: NonNullable<ReturnType<typeof useOrganizationContext>['currentOrganization']>
    featureFlags: NonNullable<ReturnType<typeof useOrganizationContext>['currentOrganization']>['feature_flags']
    refetch: () => void
  }) => ReactNode
}

function OrganizationSettingsFallback() {
  return (
    <div className="space-y-6">
      <PageHeader title="Organization Settings" description="Manage workspace profile, seats, and lifecycle." />
      <Card>
        <CardContent className="space-y-4 py-10">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

function OrganizationSettingsError({
  error,
  onRetry,
}: {
  error: unknown
  onRetry: () => void
}) {
  return (
    <div className="space-y-6">
      <PageHeader title="Organization Settings" description="Manage workspace profile, seats, and lifecycle." />
      <Card>
        <CardHeader>
          <CardTitle>Unable to load organization</CardTitle>
          <CardDescription>We couldn&apos;t find your active workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : 'Unknown error occurred.'}
          </p>
          <Button onClick={onRetry}>Retry</Button>
        </CardContent>
      </Card>
    </div>
  )
}

function OrganizationSettingsEmpty() {
  const router = useRouter()
  return (
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
  )
}

export function OrganizationSettingsShell({ activeTab, renderContent }: OrganizationSettingsShellProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isCreateMode = searchParams.get('mode') === 'create'
  const {
    isLoading,
    isError,
    error,
    refetch,
    activeOrganizationId,
    currentOrganization,
    setActiveOrganizationId,
    isBootstrapping,
  } = useOrganizationContext()

  useEffect(() => {
    if (!isLoading && !isBootstrapping && !activeOrganizationId && !isCreateMode) {
      router.replace('/no-organization')
    }
  }, [isLoading, isBootstrapping, activeOrganizationId, router, isCreateMode])

  const handleCreateModalClose = () => {
    if (activeOrganizationId) {
      router.replace('/settings/profile')
    } else {
      router.replace('/no-organization')
    }
  }

  const createOrganizationDialog = (
    <Dialog
      open={isCreateMode}
      onOpenChange={(open) => {
        if (!open) {
          handleCreateModalClose()
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
          onCreated={async (organizationId) => {
            await refetch()
            setActiveOrganizationId(organizationId)
            router.replace('/settings/profile')
          }}
          onCancel={handleCreateModalClose}
        />
      </DialogContent>
    </Dialog>
  )

  if (isLoading || isBootstrapping) {
    return (
      <>
        <OrganizationSettingsFallback />
        {createOrganizationDialog}
      </>
    )
  }

  if (isError) {
    return (
      <>
        <OrganizationSettingsError error={error} onRetry={refetch} />
        {createOrganizationDialog}
      </>
    )
  }

  if (!activeOrganizationId || !currentOrganization) {
    return (
      <>
        <OrganizationSettingsEmpty />
        {createOrganizationDialog}
      </>
    )
  }

  const featureFlags = currentOrganization.feature_flags
  const content = renderContent({
    organizationId: activeOrganizationId,
    currentOrganization,
    featureFlags,
    refetch,
  })

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="Organization Settings"
          description={`${currentOrganization.display_name} · ${currentOrganization.slug}`}
          actions={(
            <Button variant="outline" onClick={() => router.push('/profile')}>
              Profile settings
            </Button>
          )}
        />

        <Tabs value={activeTab} className="space-y-6" onValueChange={(value) => {
          const tabKey = value as TabKey
          const nextRoute = TAB_ROUTES[tabKey]
          if (nextRoute && tabKey !== activeTab) {
            router.push(nextRoute.href)
          }
        }}>
          <TabsList>
            {Object.entries(TAB_ROUTES).map(([key, config]) => (
              <TabsTrigger
                key={key}
                value={key}
                className={config.destructive ? 'text-destructive' : undefined}
              >
                {config.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeTab}>{content}</TabsContent>
        </Tabs>
      </div>
      {createOrganizationDialog}
    </>
  )
}

export function OrganizationSettingsShellWithSuspense(props: OrganizationSettingsShellProps) {
  return (
    <Suspense fallback={<OrganizationSettingsFallback />}>
      <OrganizationSettingsShell {...props} />
    </Suspense>
  )
}
