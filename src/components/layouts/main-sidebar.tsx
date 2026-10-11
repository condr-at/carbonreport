'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  AlertCircle,
  ChevronsUpDown,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mail,
  Plus,
  Settings,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from '@/components/ui/sidebar'
import { ThemeDropdownMenu } from '@/components/ui/mode-toggle'
import { useOrganizationContext } from '@/lib/organizations/context'
import type { OrganizationSummary } from '@/lib/data-client/organizations'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { useUserSettings } from '@/lib/data-client/user-settings'
import { notifications } from '@/components/ui/notifications'
import { usePendingAssetPreview } from '@/lib/uploads/pending-previews'
import { logoutSession } from '@/lib/session-client'
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Requests', href: '/requests', icon: Mail },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function MainSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { setOpen } = useSidebar()
  const [pendingHref, setPendingHref] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [pendingOrganizationSwitch, setPendingOrganizationSwitch] = useState<{
    id: string
    name: string
    startedAt: number
  } | null>(null)
  const [lastSwitchToastId, setLastSwitchToastId] = useState<string | null>(null)
  const {
    acceptedOrganizations,
    pendingInvites,
    activeOrganizationId,
    setActiveOrganizationId,
    isLoading,
    isError,
    error,
    currentOrganization,
    refetch,
    isBootstrapping,
  } = useOrganizationContext()
  const { data: userSettings } = useUserSettings()
  const user = userSettings?.user

  const userDisplayName = user?.name ?? user?.email ?? 'Your account'
  const userEmail = user?.email ?? 'user@example.com'
  const pendingUserAvatarByUser = usePendingAssetPreview(user ? `user-avatar:${user.id}` : null)
  const pendingUserAvatarByAsset = usePendingAssetPreview(user?.avatar_asset_id ?? null)
  const userAvatarUrl = pendingUserAvatarByUser ?? pendingUserAvatarByAsset ?? user?.avatar_url ?? null
  const userInitials = useMemo(() => {
    const source = user?.name || user?.email || 'U'
    return source
      .split(/[\s@]+/)
      .filter(Boolean)
      .map((segment) => segment[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 2) || 'U'
  }, [user?.name, user?.email])

  const activeOrganization = useMemo<OrganizationSummary | null>(() => {
    if (!acceptedOrganizations.length) {
      return null
    }

    return acceptedOrganizations.find((org) => org.id === activeOrganizationId) ?? acceptedOrganizations[0]
  }, [acceptedOrganizations, activeOrganizationId])

  useEffect(() => {
    if (isLoading || !activeOrganization) {
      return
    }

    navigation.forEach((item) => {
      router.prefetch(item.href)
    })
  }, [router, isLoading, activeOrganization])

  useEffect(() => {
    if (isLoading || isBootstrapping || pathname !== '/no-organization') {
      return
    }

    if (acceptedOrganizations.length > 0 && activeOrganization) {
      router.replace('/dashboard')
    }
  }, [acceptedOrganizations.length, activeOrganization, isBootstrapping, isLoading, pathname, router])

  useEffect(() => {
    if (!pendingHref) {
      return
    }

    if (pathname === pendingHref || pathname?.startsWith(`${pendingHref}/`)) {
      setPendingHref(null)
    }
  }, [pathname, pendingHref])

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)
    try {
      const response = await logoutSession()

      if (!response.ok) {
        throw new Error('Failed to logout')
      }

      if (typeof window !== 'undefined') {
        try {
          window.localStorage.removeItem('carbonreport.activeOrganizationId')
        } catch {
          // ignore storage errors
        }
      }

      window.location.assign('/login')
    } catch (error) {
      console.error('Logout failed', error)
      notifications.error('Failed to logout. Please try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }, [isLoggingOut])

  const showLockedNav = !isLoading && !isBootstrapping && !activeOrganization

  const handleOrganizationSelect = useCallback((organization: OrganizationSummary) => {
    if (organization.id === activeOrganization?.id) {
      return
    }

    setPendingOrganizationSwitch({
      id: organization.id,
      name: organization.display_name,
      startedAt: Date.now(),
    })
    setActiveOrganizationId(organization.id)
  }, [activeOrganization?.id, setActiveOrganizationId])

  useEffect(() => {
    if (!pendingOrganizationSwitch) {
      return
    }

    if (activeOrganizationId !== pendingOrganizationSwitch.id) {
      return
    }

    const MIN_DISPLAY_MS = 400
    const elapsed = Date.now() - pendingOrganizationSwitch.startedAt
    const remaining = Math.max(MIN_DISPLAY_MS - elapsed, 0)

    const timeout = window.setTimeout(() => {
      setPendingOrganizationSwitch(null)
    }, remaining)

    if (lastSwitchToastId !== pendingOrganizationSwitch.id) {
      const label = activeOrganization?.display_name ?? pendingOrganizationSwitch.name
      notifications.success(`Switched to ${label}`)
      setLastSwitchToastId(pendingOrganizationSwitch.id)
    }

    return () => {
      window.clearTimeout(timeout)
    }
  }, [activeOrganization?.display_name, activeOrganizationId, lastSwitchToastId, pendingOrganizationSwitch])

  return (
    <>
      <SidebarHeader className="space-y-4">


        <OrganizationSwitcher
          activeOrganization={activeOrganization}
          acceptedOrganizations={acceptedOrganizations}
          pendingInvites={pendingInvites}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
          onSelect={handleOrganizationSelect}
          onCreate={() => router.push('/settings/profile?mode=create')}
          activeUsage={currentOrganization?.usage.active_projects ?? null}
          usageLimit={currentOrganization?.plan.max_active_projects ?? null}
          planLabel={currentOrganization?.plan.label ?? activeOrganization?.plan_label ?? '—'}
          planValidUntil={currentOrganization?.plan.valid_until ?? activeOrganization?.plan_valid_until ?? null}
          isSwitching={Boolean(pendingOrganizationSwitch)}
        />
      </SidebarHeader>

      <SidebarContent className="space-y-1">
        {isLoading ? (
          <NavigationSkeleton />
        ) : showLockedNav ? (
          <div className="rounded-lg border border-dashed border-muted-foreground/40 p-4 text-sm">
            <p className="font-medium text-foreground">Workspace locked</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Join an existing organization or create a new one to unlock navigation.
            </p>
          </div>
        ) : (
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isExactMatch = pathname === item.href
              const isWithinSection = !isExactMatch && pathname?.startsWith(item.href + '/')
              const isActive = isExactMatch || isWithinSection
              const Icon = item.icon
              const isPending = pendingHref === item.href
              const isHighlighted = pendingHref ? isPending : isActive

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(event) => {
                    if (
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey ||
                      event.button !== 0
                    ) {
                      setOpen(false)
                      return
                    }

                    event.preventDefault()

                    if (!isExactMatch) {
                      setPendingHref(item.href)
                      router.push(item.href)
                    } else {
                      setPendingHref(null)
                    }

                    setOpen(false)
                  }}
                  aria-current={isActive && !pendingHref ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isHighlighted
                      ? 'bg-accent text-accent-foreground font-semibold'
                      : 'text-foreground hover:bg-accent/50 hover:text-accent-foreground',
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        )}
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
            >
              <Avatar className="h-9 w-9">
                {userAvatarUrl ? <AvatarImage src={userAvatarUrl} alt={userDisplayName} /> : null}
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{userDisplayName}</p>
                <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="sr-only">Open user menu</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{userDisplayName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2"
              onSelect={(event) => {
                event.preventDefault()
                router.push('/profile')
              }}
            >
              <Settings className="h-4 w-4" />
              Profile settings
            </DropdownMenuItem>
            <ThemeDropdownMenu />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-destructive"
              onSelect={(event) => {
                event.preventDefault()
                void handleLogout()
              }}
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? 'Logging out…' : 'Logout'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      {pendingOrganizationSwitch ? (
        <OrganizationSwitchPreloader organizationName={pendingOrganizationSwitch.name} />
      ) : null}
    </>
  )
}

type OrganizationSwitcherProps = {
  activeOrganization: OrganizationSummary | null
  acceptedOrganizations: OrganizationSummary[]
  pendingInvites: OrganizationSummary[]
  isLoading: boolean
  isError: boolean
  error: unknown
  onRetry: () => void
  onSelect: (organization: OrganizationSummary) => void
  onCreate: () => void
  activeUsage: number | null
  usageLimit: number | null
  planLabel: string
  planValidUntil: string | null
  isSwitching: boolean
}

function OrganizationSwitcher({
  activeOrganization,
  acceptedOrganizations,
  pendingInvites,
  isLoading,
  isError,
  error,
  onRetry,
  onSelect,
  onCreate,
  activeUsage,
  usageLimit,
  planLabel,
  planValidUntil,
  isSwitching,
}: OrganizationSwitcherProps) {
  const router = useRouter()
  const pendingActiveLogo = usePendingAssetPreview(activeOrganization ? `org-logo:${activeOrganization.id}` : null)

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>Failed to load organizations.</span>
        </div>
        <Button variant="foreground" mode="link" size="sm" onClick={onRetry} className="px-0 text-destructive">
          Retry
        </Button>
        {error instanceof Error ? (
          <p className="mt-1 text-xs text-destructive/80">{error.message}</p>
        ) : null}
      </div>
    )
  }
  if (!activeOrganization) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-md border border-dashed border-muted-foreground/40 p-4 text-sm">
        <div className="space-y-1 text-left">
          <p className="font-medium text-foreground">No organization yet</p>
          <p className="text-muted-foreground">
            If your company already uses Carbon Report, ask a teammate to invite you from Organization → Members.
          </p>
          <p className="text-xs text-muted-foreground">
            Only create a new organization if you are the first person from your company to join the platform.
          </p>
        </div>
        <Button size="sm" onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create organization
        </Button>
      </div>
    )
  }

  const getInitials = (value: string) =>
    value
      .split(' ')
      .map((segment) => segment[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  const initials = getInitials(activeOrganization.display_name)
  const activeLogoUrl = pendingActiveLogo ?? activeOrganization.logo_url ?? null

  const usageLabel =
    typeof activeUsage === 'number' && typeof usageLimit === 'number'
      ? `${activeUsage} / ${usageLimit}`
      : null
  const expiryWarning = getPlanExpiryWarning(planValidUntil)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
        >
          <OrganizationAvatarImage
            organizationId={activeOrganization.id}
            displayName={activeOrganization.display_name}
            logoUrl={activeLogoUrl}
            initials={initials || '—'}
            className="h-9 w-9 rounded-md"
            fallbackClassName="rounded-md bg-muted text-sm font-semibold"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{activeOrganization.display_name}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {isSwitching ? <Spinner className="h-3 w-3 text-primary" aria-hidden="true" /> : null}
              <span className="truncate">
                {planLabel}
                {usageLabel ? ` · ${usageLabel} projects` : null}
              </span>
              {expiryWarning ? (
                <Badge variant={expiryWarning.expired ? 'destructive' : 'secondary'} className="shrink-0 text-[10px]">
                  {expiryWarning.label}
                </Badge>
              ) : null}
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Open organization menu</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {acceptedOrganizations.map((organization) => {
          const initialsLabel = getInitials(organization.display_name)
          const logoUrl = organization.logo_url ?? null
          const isActive = organization.id === activeOrganization.id
          const limit = organization.limits?.max_active_projects
          const usage = organization.active_projects

          return (
            <DropdownMenuItem
              key={organization.id}
              onSelect={() => onSelect(organization)}
              className={cn('gap-3 p-2', isActive && 'bg-muted text-foreground')}
            >
              <OrganizationAvatarImage
                organizationId={organization.id}
                displayName={organization.display_name}
                logoUrl={logoUrl}
                initials={initialsLabel || '—'}
                className="h-8 w-8 rounded-md"
                fallbackClassName="rounded-md bg-muted text-sm font-semibold"
              />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">{organization.display_name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {organization.plan_label}
                  {getPlanExpiryWarning(organization.plan_valid_until)?.label
                    ? ` · ${getPlanExpiryWarning(organization.plan_valid_until)?.label}`
                    : ''}
                </span>
              </div>
              {typeof usage === 'number' && typeof limit === 'number' ? (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {usage} / {limit}
                </Badge>
              ) : null}
            </DropdownMenuItem>
          )
        })}

        {pendingInvites.length ? (
          <>
            <Separator className="my-1" />
            <DropdownMenuLabel className="text-xs text-muted-foreground">Pending invites</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {pendingInvites.map((invite) => {
              const initialsLabel = getInitials(invite.display_name)
              const logoUrl = invite.logo_url ?? null

              return (
                <DropdownMenuItem key={invite.id} onSelect={() => router.push('/invitations')} className="gap-3 p-2">
                  <OrganizationAvatarImage
                    organizationId={invite.id}
                    displayName={invite.display_name}
                    logoUrl={logoUrl}
                    initials={initialsLabel || '—'}
                    className="h-8 w-8 rounded-md"
                    fallbackClassName="rounded-md bg-muted text-sm font-semibold text-muted-foreground"
                  />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-muted-foreground">
                      {invite.display_name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">Review invitation</span>
                  </div>
                </DropdownMenuItem>
              )
            })}
          </>
        ) : null}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-3 p-2 text-muted-foreground" onSelect={onCreate}>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
            <Plus className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">Create organization</span>
            <span className="truncate text-xs">Spin up a new workspace</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function getPlanExpiryWarning(validUntil: string | null) {
  if (!validUntil) {
    return null
  }

  const expiry = new Date(validUntil)
  if (Number.isNaN(expiry.getTime())) {
    return null
  }

  const diffMs = expiry.getTime() - Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  const days = Math.ceil(diffMs / dayMs)

  if (days > 14) {
    return null
  }

  if (days < 0) {
    return { label: 'Expired', expired: true }
  }

  if (days === 0) {
    return { label: 'Expires today', expired: false }
  }

  return { label: `Expires in ${days}d`, expired: false }
}

type OrganizationAvatarImageProps = {
  organizationId: string
  displayName: string
  logoUrl: string | null
  initials: string
  className?: string
  fallbackClassName?: string
}

function OrganizationAvatarImage({
  organizationId,
  displayName,
  logoUrl,
  initials,
  className,
  fallbackClassName,
}: OrganizationAvatarImageProps) {
  const pendingLogo = usePendingAssetPreview(`org-logo:${organizationId}`)
  const src = pendingLogo ?? logoUrl ?? null

  return (
    <Avatar className={className}>
      {src ? <AvatarImage src={src} alt={`${displayName} logo`} /> : null}
      <AvatarFallback className={fallbackClassName}>{initials || '—'}</AvatarFallback>
    </Avatar>
  )
}

function NavigationSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={`sidebar-skeleton-${index}`} className="h-10 w-full rounded-lg" />
      ))}
    </div>
  )
}

function OrganizationSwitchPreloader({ organizationName }: { organizationName: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm" role="status" aria-live="assertive">
      <Card className="flex items-center gap-3 px-6 py-4 shadow-lg">
        <Spinner className="h-6 w-6 text-primary" aria-hidden="true" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">Switching organization…</span>
          <span className="text-xs text-muted-foreground">{organizationName}</span>
        </div>
      </Card>
    </div>
  )
}
