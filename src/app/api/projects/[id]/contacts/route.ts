import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getCacheValue, setCacheValue } from '@/lib/cache';

const ENABLE_TIMING = process.env.NODE_ENV !== 'production';

function logTiming(label: string, start: bigint) {
  if (!ENABLE_TIMING) {
    return;
  }

  const duration = Number(process.hrtime.bigint() - start) / 1_000_000;
  console.info(`[contacts] ${label} took ${duration.toFixed(2)}ms`);
}

const paramsSchema = z.object({
  id: z.string().min(1, 'Project id is required'),
});

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const startedAt = ENABLE_TIMING ? process.hrtime.bigint() : BigInt(0);
    const rawParams = await context.params;
    const { id } = paramsSchema.parse(rawParams);

    const project = await db.project.findUnique({
      where: { id },
      select: {
        id: true,
        organizationId: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const cacheKey = `project:contacts:${project.id}`;
    const cached = getCacheValue<{ contacts: unknown[] }>(cacheKey);

    if (cached) {
      logTiming(`GET /projects/${project.id}/contacts (cache hit)`, startedAt);
      return NextResponse.json(cached);
    }

    const contacts = await db.contact.findMany({
      where: {
        organizationId: project.organizationId,
        archived: false,
      },
      orderBy: [{ name: 'asc' }],
      select: {
        id: true,
        name: true,
        email: true,
        position: true,
      },
    });

    const payload = { contacts } as const;
    setCacheValue(cacheKey, payload);

    const response = NextResponse.json(payload);
    logTiming(`GET /projects/${project.id}/contacts`, startedAt);
    return response;
  } catch (error) {
    console.error('Failed to load project contacts', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid project id',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Unexpected error while fetching contacts',
      },
      { status: 500 }
    );
  }
}
