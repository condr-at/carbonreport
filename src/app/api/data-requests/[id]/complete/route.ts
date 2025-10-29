import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/db';

const paramsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid data request id'),
  }),
});

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const paramsInput = await context.params;
    const { params } = paramsSchema.parse({ params: paramsInput });

    const existing = await prisma.dataRequest.findUnique({
      where: { id: params.id },
      select: {
        revokedAt: true,
        completedAt: true,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Data request not found' }, { status: 404 });
    }

    if (existing.revokedAt) {
      return NextResponse.json(
        {
          error: 'Cannot complete a revoked request',
        },
        { status: 409 }
      );
    }

    const completionTimestamp = existing.completedAt ?? new Date();

    if (!existing.completedAt) {
      await prisma.dataRequest.update({
        where: { id: params.id },
        data: { completedAt: completionTimestamp },
      });
    }

    return NextResponse.json(
      {
        success: true,
        completedAt: completionTimestamp.toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request parameters',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Data request not found' }, { status: 404 });
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
