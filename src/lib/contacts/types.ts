export interface ContactSummary {
  id: string;
  name: string | null;
  email: string;
  position: string | null;
}

export interface ContactOverview extends ContactSummary {
  createdAt: string;
  updatedAt: string;
  activeRequests: number;
  totalRequests: number;
  lastRequestedAt: string | null;
}

export interface ContactDetail extends ContactOverview {
  archived: boolean;
}
