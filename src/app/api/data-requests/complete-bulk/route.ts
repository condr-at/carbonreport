import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { completeRequestsBulk, DataRequestServiceError } from '@/lib/data-requests/service';

const bodySchema = z.object({
  ids: z.array(z.string().uuid()).min(1, 'ids must include at least one request id'),
  completedAt: z.string().optional().nullable(),
});

function parseCompletedAt(value: string | null | undefined) {
  if (!value) {
    return new Date();
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return new Date();
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('completedAt must be a valid ISO-8601 date string');
  }

  return parsed;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const { ids, completedAt } = bodySchema.parse(rawBody);
    const completedDate = parseCompletedAt(completedAt);

    const result = await completeRequestsBulk(ids, completedDate, prisma);

    return NextResponse.json(
      {
        success: true,
        updated: result.updated,
        requests: result.requests,
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

    console.error('Failed to mark data requests complete (bulk)', error);

    return NextResponse.json(
      {
        error: 'Unexpected error while completing data requests',
      },
      { status: 500 }
    );
  }
}
