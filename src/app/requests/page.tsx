import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageHeader } from '@/components/layouts/page-header';
import { RequestsBoard } from '@/components/requests/requests-board';
import { queryClientOptions } from '@/lib/data-client/queryClient';
import { globalRequestsKeys } from '@/lib/data-client/keys';
import {
  DEFAULT_GLOBAL_REQUEST_FILTERS,
  type DataRequestStatusFilter,
  type DeadlineFilter,
  type GlobalRequestFilters,
} from '@/lib/data-requests/filters';
import { getContactsOverview } from '@/lib/server-data/contacts';
import { getGlobalDataRequests, getProjectsForRequests } from '@/lib/server-data/requests';

export const dynamic = 'force-dynamic';

const STATUS_VALUES: ReadonlyArray<DataRequestStatusFilter> = ['all', 'pending', 'completed', 'revoked'];
const DEADLINE_VALUES: ReadonlyArray<DeadlineFilter> = ['all', 'due-soon', 'overdue', 'no-deadline'];

type SearchValue = string | string[] | undefined;

type RequestsPageSearchParams = Record<string, SearchValue> & {
  status?: SearchValue;
  projectId?: SearchValue;
  contactId?: SearchValue;
  deadline?: SearchValue;
};

function toSingleValue(value: SearchValue): string | undefined {
  if (Array.isArray(value)) {
    return value.length ? value[0] : undefined;
  }
  return typeof value === 'string' ? value : undefined;
}

function resolveFilters(searchParams: RequestsPageSearchParams | undefined): GlobalRequestFilters {
  const filters: GlobalRequestFilters = {
    ...DEFAULT_GLOBAL_REQUEST_FILTERS,
  };

  if (!searchParams) {
    return filters;
  }

  const statusValue = toSingleValue(searchParams.status);
  if (statusValue && STATUS_VALUES.includes(statusValue as DataRequestStatusFilter)) {
    filters.status = statusValue as DataRequestStatusFilter;
  }

  const deadlineValue = toSingleValue(searchParams.deadline);
  if (deadlineValue && DEADLINE_VALUES.includes(deadlineValue as DeadlineFilter)) {
    filters.deadline = deadlineValue as DeadlineFilter;
  }

  const projectIdValue = toSingleValue(searchParams.projectId);
  if (projectIdValue && projectIdValue !== 'all') {
    filters.projectId = projectIdValue;
  }

  const contactIdValue = toSingleValue(searchParams.contactId);
  if (contactIdValue && contactIdValue !== 'all') {
    filters.contactId = contactIdValue;
  }

  return filters;
}

interface RequestsPageProps {
  searchParams?: Promise<RequestsPageSearchParams>;
}

export default async function RequestsPage({ searchParams }: RequestsPageProps) {
  const resolvedSearchParams = await searchParams;
  const initialFilters = resolveFilters(resolvedSearchParams);

  const [requests, contacts, projects] = await Promise.all([
    getGlobalDataRequests(initialFilters),
    getContactsOverview(),
    getProjectsForRequests(),
  ]);

  const queryClient = new QueryClient(queryClientOptions);
  queryClient.setQueryData(globalRequestsKeys.list(initialFilters), requests);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Requests"
          description="Monitor and action data requests across projects."
        />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <RequestsBoard
            initialFilters={initialFilters}
            initialRequests={requests}
            contacts={contacts}
            projectOptions={projects}
          />
        </HydrationBoundary>
      </div>
    </DashboardLayout>
  );
}
