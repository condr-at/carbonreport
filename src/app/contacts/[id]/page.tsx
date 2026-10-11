import Link from 'next/link'
import { notFound } from 'next/navigation'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { PageHeader } from '@/components/layouts/page-header'
import { Button } from '@/components/ui/button'
import { RequestsBoard } from '@/components/requests/requests-board'
import { getContactDetail } from '@/lib/server-data/contacts'
import { getGlobalDataRequests, getProjectsForRequests } from '@/lib/server-data/requests'
import { queryClientOptions } from '@/lib/data-client/queryClient'
import { globalRequestsKeys } from '@/lib/data-client/keys'
import type { GlobalRequestFilters } from '@/lib/data-requests/filters'

export default async function ContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const contact = await getContactDetail(id)
  if (!contact) notFound()

  const filters: GlobalRequestFilters = { contactId: id, status: 'all' }
  const [requests, projects] = await Promise.all([
    getGlobalDataRequests(filters),
    getProjectsForRequests(),
  ])
  const queryClient = new QueryClient(queryClientOptions)
  queryClient.setQueryData(globalRequestsKeys.list(filters), requests)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title={contact.name?.trim() || contact.email}
          description={[contact.email, contact.position].filter(Boolean).join(' · ')}
          actions={<Button variant="outline" asChild><Link href="/contacts">Back to contacts</Link></Button>}
        />
        <p className="text-sm text-muted-foreground">
          {contact.activeRequests} pending · {contact.totalRequests} total requests
        </p>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <RequestsBoard
            initialFilters={filters}
            initialRequests={requests}
            contacts={[contact]}
            projectOptions={projects}
            lockedContactId={id}
          />
        </HydrationBoundary>
      </div>
    </DashboardLayout>
  )
}
