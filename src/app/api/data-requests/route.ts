import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getGlobalDataRequests } from '@/lib/server-data/requests';
import type { GlobalRequestFilters } from '@/lib/data-requests/filters';
import { ensureApiError, errorResponse } from '@/lib/api-error';

const statusValues = ['all', 'pending', 'completed', 'revoked'] as const;
const deadlineValues = ['all', 'due-soon', 'overdue', 'no-deadline'] as const;

type StatusValue = (typeof statusValues)[number];
type DeadlineValue = (typeof deadlineValues)[number];

const querySchema = z.object({
  status: z.enum(statusValues).optional(),
  projectId: z.string().optional(),
  contactId: z.string().optional(),
  deadline: z.enum(deadlineValues).optional(),
});

function normalizeIdentifier(value: string | undefined | null): string | undefined {
  if (!value || value === 'all' || value === 'null' || value === 'undefined') {
    return undefined;
  }

  return value;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const parsed = querySchema.parse({
      status: url.searchParams.get('status') ?? undefined,
      projectId: url.searchParams.get('projectId') ?? undefined,
      contactId: url.searchParams.get('contactId') ?? undefined,
      deadline: url.searchParams.get('deadline') ?? undefined,
    });

    const filters: GlobalRequestFilters = {
      status: parsed.status as StatusValue,
      projectId: normalizeIdentifier(parsed.projectId),
      contactId: normalizeIdentifier(parsed.contactId),
      deadline: parsed.deadline as DeadlineValue,
    };

    const requests = await getGlobalDataRequests(filters);

    return NextResponse.json({ requests });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid filters',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Failed to load data requests', error);

    return errorResponse(ensureApiError(error, 'Failed to fetch data requests'));
  }
}
