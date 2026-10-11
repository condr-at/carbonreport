import { fetchWithSession } from './session-client';

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface RequestOptions extends RequestInit {
  headers?: HeadersInit;
}

export async function request<T>(input: RequestInfo, init?: RequestOptions): Promise<T> {
  const response = await fetchWithSession(input, {
    cache: 'no-store',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message = typeof payload?.error === 'string' ? payload.error : response.statusText;
    throw new ApiError(message || 'Request failed', response.status, payload?.code, payload?.details ?? payload);
  }

  if (!isJson) {
    // @ts-expect-error allow returning void for 204
    return undefined;
  }

  return payload as T;
}
