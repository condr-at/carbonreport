import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { isApiError } from '@/lib/api-error';
import { assertCanMutateDataRequests } from '@/lib/data-requests/authorization';
import { DataRequestServiceError, reassignRequestsBulk } from '@/lib/data-requests/service';

const bodySchema = z.object({
  ids: z.array(z.string().uuid()).min(1, 'ids must include at least one request id'),
  contact: z.object({
    id: z.string().uuid().optional(),
    email: z.string().email('contact.email must be a valid email'),
    name: z.string().optional().nullable(),
  }),
  reassignedAt: z.string().optional().nullable(),
});

function parseReassignedAt(value?: string | null) {
  if (!value) {
    return new Date();
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('reassignedAt must be a valid ISO-8601 date string');
  }

  return parsed;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const { ids, contact, reassignedAt } = bodySchema.parse(rawBody);
    const user = await getCurrentUser();
    const reassignedDate = parseReassignedAt(reassignedAt);

    await assertCanMutateDataRequests(ids, user.id, prisma);
    const result = await reassignRequestsBulk(ids, contact, user.id, reassignedDate, prisma);

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to reassign data requests', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 },
      );
    }

    if (error instanceof DataRequestServiceError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.status },
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
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unexpected error while reassigning data requests',
      },
      { status: 500 },
    );
  }
}
