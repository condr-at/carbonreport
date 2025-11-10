export type DataRequestStatusFilter = 'all' | 'pending' | 'completed' | 'revoked';

export type DeadlineFilter = 'all' | 'due-soon' | 'overdue' | 'no-deadline';

export interface GlobalRequestFilters {
  status?: DataRequestStatusFilter;
  projectId?: string | null;
  contactId?: string | null;
  deadline?: DeadlineFilter;
}

export const DEFAULT_GLOBAL_REQUEST_FILTERS: Readonly<GlobalRequestFilters> = Object.freeze({
  status: 'all',
  deadline: 'all',
});
