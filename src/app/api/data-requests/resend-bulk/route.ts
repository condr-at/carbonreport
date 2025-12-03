import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { DataRequestServiceError, resendRequestsBulk } from '@/lib/data-requests/service';

const bodySchema = z.object({
  ids: z.array(z.string().uuid()).min(1, 'ids must include at least one request id'),
  requestedAt: z.string().optional().nullable(),
});

function parseRequestedAt(value: string | null | undefined) {
  if (!value) {
    return new Date();
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return new Date();
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('requestedAt must be a valid ISO-8601 date string');
  }

  return parsed;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const { ids, requestedAt } = bodySchema.parse(rawBody);
    const requestedDate = parseRequestedAt(requestedAt);

    const result = await resendRequestsBulk(ids, requestedDate, prisma);

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

    if (error instanceof Error && error.message.includes('ISO-8601')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.error('Failed to resend data requests (bulk)', error);

    return NextResponse.json(
      {
        error: 'Unexpected error while resending data requests',
      },
      { status: 500 }
    );
  }
}
