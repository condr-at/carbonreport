import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { DataRequestServiceError, revokeRequestsBulk } from '@/lib/data-requests/service';
import { getCurrentUser } from '@/lib/auth';
import { assertCanMutateDataRequests } from '@/lib/data-requests/authorization';
import { isApiError } from '@/lib/api-error';

const bodySchema = z.object({
  ids: z.array(z.string().uuid()).min(1, 'ids must include at least one request id'),
  revokedAt: z.string().optional().nullable(),
});

function parseRevokedAt(value: string | null | undefined) {
  if (!value) {
    return new Date();
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return new Date();
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('revokedAt must be a valid ISO-8601 date string');
  }

  return parsed;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const { ids, revokedAt } = bodySchema.parse(rawBody);
    const revokedDate = parseRevokedAt(revokedAt);
    const user = await getCurrentUser();

    await assertCanMutateDataRequests(ids, user.id, prisma);
    const result = await revokeRequestsBulk(ids, revokedDate, prisma);

    return NextResponse.json(
      {
        success: true,
        updated: result.updated,
        requests: result.requests,
        version: result.version,
        updatedAt: result.updatedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    if (error instanceof DataRequestServiceError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.status }
      );
    }

    if (isApiError(error)) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          details: error.details,
        },
        { status: error.status },
      );
    }

    if (error instanceof Error && error.message.includes('ISO-8601')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.error('Failed to revoke data requests (bulk)', error);

    return NextResponse.json(
      {
        error: 'Unexpected error while revoking data requests',
      },
      { status: 500 }
    );
  }
}
