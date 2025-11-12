'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  LogOut,
  Mail,
  ChevronsUpDown,
  Building2,
  Factory,
  Leaf,
  Plus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from '@/components/ui/sidebar';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Requests', href: '/requests', icon: Mail },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

type Organization = {
  id: string;
  name: string;
  plan: string;
  icon: LucideIcon;
};

const organizations: Organization[] = [
  {
    id: 'carbon-reporting',
    name: 'Carbon Reporting HQ',
    plan: 'Enterprise',
    icon: Building2,
  },
  {
    id: 'green-supply',
    name: 'Green Supply Collective',
    plan: 'Growth',
    icon: Leaf,
  },
  {
    id: 'northwind-csr',
    name: 'Northwind CSR Lab',
    plan: 'Starter',
    icon: Factory,
  },
];

export function MainSidebar() {
  const pathname = usePathname();
  const { setOpen } = useSidebar();
  const [activeOrganization, setActiveOrganization] = useState<Organization>(organizations[0]);

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
          organizations={organizations}
          active={activeOrganization}
          onSelect={setActiveOrganization}
        />
      </SidebarHeader>

      <SidebarContent className="space-y-1">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">U</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">User Name</p>
                <p className="truncate text-xs text-muted-foreground">user@example.com</p>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="sr-only">Open user menu</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-destructive">
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </>
  );
}

interface OrganizationSwitcherProps {
  organizations: Organization[];
  active: Organization;
  onSelect: (organization: Organization) => void;
}

function OrganizationSwitcher({ organizations, active, onSelect }: OrganizationSwitcherProps) {
  const ActiveIcon = active.icon;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
            <ActiveIcon className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{active.name}</p>
            <p className="truncate text-xs text-muted-foreground">{active.plan}</p>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Open organization menu</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((organization) => {
          const OrganizationIcon = organization.icon;
          const isActive = organization.id === active.id;
          return (
            <DropdownMenuItem
              key={organization.id}
              onSelect={() => onSelect(organization)}
              className={cn('gap-3 p-2', isActive && 'bg-muted text-foreground')}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                <OrganizationIcon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">{organization.name}</span>
                <span className="truncate text-xs text-muted-foreground">{organization.plan}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-3 p-2 text-muted-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
            <Plus className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">Add organization</span>
            <span className="truncate text-xs">Create a new workspace</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
