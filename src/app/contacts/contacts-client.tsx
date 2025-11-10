'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/blocks/empty-state';
import { useContactsList } from '@/lib/data-client/contacts-global';
import type { ContactOverview } from '@/lib/contacts/types';
import { PageHeader } from '@/components/layouts/page-header';

interface ContactsPageClientProps {
  initialContacts: ContactOverview[];
}

type ActiveFilter = 'all' | 'active' | 'inactive';
type SortOption = 'name-asc' | 'name-desc' | 'activity-desc' | 'recent';

function normalizeName(contact: ContactOverview): string {
  const trimmed = (contact.name ?? '').trim();
  if (trimmed.length > 0) {
    return trimmed;
  }
  return contact.email;
}

function formatRelativeDate(value: string | null): string {
  if (!value) {
    return '—';
  }

  try {
    const date = new Date(value);
    return date.toLocaleString();
  } catch {
    return value;
  }
}

function initialsFromContact(contact: ContactOverview): string {
  const name = normalizeName(contact);
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) {
    return name.slice(0, 2).toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
}

export function ContactsPageClient({ initialContacts }: ContactsPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const {
    data: contacts = [],
    isFetching,
  } = useContactsList(initialContacts);

  const filteredContacts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const list = contacts.filter((contact) => {
      const matchesQuery = query.length
        ? normalizeName(contact).toLowerCase().includes(query) || contact.email.toLowerCase().includes(query)
        : true;

      if (!matchesQuery) {
        return false;
      }

      if (activeFilter === 'active') {
        return contact.activeRequests > 0;
      }

      if (activeFilter === 'inactive') {
        return contact.activeRequests === 0;
      }

      return true;
    });

    return list.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return normalizeName(a).localeCompare(normalizeName(b));
        case 'name-desc':
          return normalizeName(b).localeCompare(normalizeName(a));
        case 'activity-desc': {
          if (a.activeRequests === b.activeRequests) {
            return (b.totalRequests ?? 0) - (a.totalRequests ?? 0);
          }
          return b.activeRequests - a.activeRequests;
        }
        case 'recent':
        default: {
          const aTime = a.lastRequestedAt ? new Date(a.lastRequestedAt).getTime() : 0;
          const bTime = b.lastRequestedAt ? new Date(b.lastRequestedAt).getTime() : 0;
          return bTime - aTime;
        }
      }
    });
  }, [contacts, activeFilter, searchTerm, sortBy]);

  const hasContacts = contacts.length > 0;
  const showEmpty = !filteredContacts.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts"
        description="Manage your address book and track outstanding data requests per contact."
        actions={(
          <Button disabled size="sm">
            <ChevronDown className="mr-2 h-4 w-4" />
            New Contact
          </Button>
        )}
      />

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Select value={activeFilter} onValueChange={(value) => setActiveFilter(value as ActiveFilter)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter contacts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All contacts</SelectItem>
                  <SelectItem value="active">With active requests</SelectItem>
                  <SelectItem value="inactive">No active requests</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort contacts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently requested</SelectItem>
                  <SelectItem value="activity-desc">Most active</SelectItem>
                  <SelectItem value="name-asc">Name A → Z</SelectItem>
                  <SelectItem value="name-desc">Name Z → A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!hasContacts && isFetching ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          ) : showEmpty ? (
            <div className="p-12">
              <EmptyState
                icon={Search}
                title={hasContacts ? 'No contacts match your filters' : 'No contacts yet'}
                description={
                  hasContacts
                    ? 'Adjust your filters or search query to see more contacts.'
                    : 'Add contacts to streamline data requests across your projects.'
                }
                actionLabel={hasContacts ? 'Clear filters' : undefined}
                onAction={hasContacts ? () => {
                  setSearchTerm('');
                  setActiveFilter('all');
                } : undefined}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                  <tr className="text-left">
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Active requests</th>
                    <th className="px-4 py-3">Last requested</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => {
                    const displayName = normalizeName(contact);

                    return (
                      <tr key={contact.id} className="border-b last:border-b-0">
                        <td className="px-4 py-3 align-middle">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="text-sm">
                                {initialsFromContact(contact)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium leading-tight">{displayName}</p>
                              {contact.position && (
                                <p className="text-xs text-muted-foreground">{contact.position}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <p className="font-medium">{contact.email}</p>
                        </td>
                        <td className="px-4 py-3 align-middle">
                          {contact.activeRequests > 0 ? (
                            <Badge variant="secondary">{contact.activeRequests} pending</Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">None</span>
                          )}
                        </td>
                        <td className="px-4 py-3 align-middle text-muted-foreground">
                          {formatRelativeDate(contact.lastRequestedAt)}
                        </td>
                        <td className="px-4 py-3 align-middle text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/contacts/${contact.id}`}>View details</Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
