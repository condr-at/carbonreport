export type DataRequestStatus = 'pending' | 'completed' | 'revoked';

export interface DataRequestSummary {
  id: string;
  status: DataRequestStatus;
  requestedAt: string;
  completedAt: string | null;
  revokedAt: string | null;
  deadline?: string | null;
  contact?: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
  } | null;
  dataPoint?: {
    id?: string | null;
    label?: string | null;
    hint?: string | null;
    itemId?: string | null;
  } | null;
}
