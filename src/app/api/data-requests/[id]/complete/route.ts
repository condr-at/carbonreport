import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { completeRequest, DataRequestServiceError } from '@/lib/data-requests/service';

const paramsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid data request id'),
  }),
});

const bodySchema = z.object({
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

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const paramsInput = await context.params;
    const { params } = paramsSchema.parse({ params: paramsInput });

    let rawBody: unknown = {};
    try {
      rawBody = await request.json();
    } catch (error) {
      if (error instanceof SyntaxError) {
        return NextResponse.json(
          { error: 'Request body must be valid JSON' },
          { status: 400 }
        );
      }
    }

    const { completedAt } = bodySchema.parse(rawBody ?? {});
    const completedDate = parseCompletedAt(completedAt);

    const requestSummary = await completeRequest(params.id, completedDate, prisma);

    return NextResponse.json(
      {
        success: true,
        request: requestSummary,
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

    if (error instanceof Error && error.message.includes('ISO-8601')) {
      return NextResponse.json(
        { error: error.message },
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

    console.error('Failed to mark data request complete', error);

    return NextResponse.json(
      {
        error: 'Unexpected error while completing data request',
      },
      { status: 500 }
    );
  }
}
