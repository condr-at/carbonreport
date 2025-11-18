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
import { useOrganizationContext } from '@/lib/organizations/context'
import type { OrganizationSummary } from '@/lib/data-client/organizations'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserSettings } from '@/lib/data-client/user-settings'
import { notifications } from '@/components/ui/notifications'
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
  const hasAcceptedOrganizations = acceptedOrganizations.length > 0
  const { data: userSettings } = useUserSettings()
  const user = userSettings?.user

  const userDisplayName = user?.name ?? user?.email ?? 'Your account'
  const userEmail = user?.email ?? 'user@example.com'
  const userAvatarUrl = user?.avatar_url ?? null
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
    if (isLoading || isBootstrapping) {
      return
    }

    if (!hasAcceptedOrganizations) {
      if (
        pathname !== '/no-organization' &&
        !pathname?.startsWith('/settings')
      ) {
        router.replace('/no-organization')
      }
      return
    }

    if (!activeOrganization) {
      return
    }

    if (pathname === '/no-organization') {
      router.replace('/dashboard')
    }
  }, [activeOrganization, hasAcceptedOrganizations, isBootstrapping, isLoading, pathname, router])

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
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

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

      router.replace('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed', error)
      notifications.error('Failed to logout. Please try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }, [isLoggingOut, router])

  const showLockedNav = !isLoading && !isBootstrapping && !activeOrganization

  return (
    <>
      <SidebarHeader className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">C</span>
          </div>
          <span className="text-xl font-bold">Carbon Report</span>
        </div>

        <OrganizationSwitcher
          activeOrganization={activeOrganization}
          acceptedOrganizations={acceptedOrganizations}
          pendingInvites={pendingInvites}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
          onSelect={(id) => setActiveOrganizationId(id)}
          onCreate={() => router.push('/settings/profile?mode=create')}
          activeUsage={currentOrganization?.usage.active_projects ?? null}
          usageLimit={currentOrganization?.plan.max_active_projects ?? null}
          planLabel={currentOrganization?.plan.label ?? activeOrganization?.plan_label ?? '—'}
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
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
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
  onSelect: (organizationId: string) => void
  onCreate: () => void
  activeUsage: number | null
  usageLimit: number | null
  planLabel: string
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
}: OrganizationSwitcherProps) {
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
        <Button variant="link" size="sm" onClick={onRetry} className="px-0 text-destructive">
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
  const activeLogoUrl = activeOrganization.logo_url ?? null

  const usageLabel =
    typeof activeUsage === 'number' && typeof usageLimit === 'number'
      ? `${activeUsage} / ${usageLimit}`
      : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
        >
          <Avatar className="h-9 w-9 rounded-md">
            {activeLogoUrl ? (
              <AvatarImage src={activeLogoUrl} alt={`${activeOrganization.display_name} logo`} />
            ) : null}
            <AvatarFallback className="rounded-md bg-muted text-sm font-semibold">
              {initials || '—'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{activeOrganization.display_name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {planLabel}
              {usageLabel ? ` · ${usageLabel} projects` : null}
            </p>
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
              onSelect={() => onSelect(organization.id)}
              className={cn('gap-3 p-2', isActive && 'bg-muted text-foreground')}
            >
              <Avatar className="h-8 w-8 rounded-md">
                {logoUrl ? (
                  <AvatarImage src={logoUrl} alt={`${organization.display_name} logo`} />
                ) : null}
                <AvatarFallback className="rounded-md bg-muted text-sm font-semibold">
                  {initialsLabel || '—'}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">{organization.display_name}</span>
                <span className="truncate text-xs text-muted-foreground">{organization.plan_label}</span>
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
                <DropdownMenuItem key={invite.id} disabled className="gap-3 p-2">
                  <Avatar className="h-8 w-8 rounded-md">
                    {logoUrl ? (
                      <AvatarImage src={logoUrl} alt={`${invite.display_name} logo`} />
                    ) : null}
                    <AvatarFallback className="rounded-md bg-muted text-sm font-semibold text-muted-foreground">
                      {initialsLabel || '—'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-muted-foreground">
                      {invite.display_name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">Invite pending</span>
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

function NavigationSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={`sidebar-skeleton-${index}`} className="h-10 w-full rounded-lg" />
      ))}
    </div>
  )
}
