import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getAccessibleOrganizationIds } from '@/lib/server-data/access';
import { ensureApiError, errorResponse } from '@/lib/api-error';

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
    const organizationIds = await getAccessibleOrganizationIds();

    const project = await db.project.findFirst({
      where: { id, organizationId: { in: organizationIds } },
      select: {
        id: true,
        organizationId: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Contact creation/reassignment can run in another route worker; a local
    // response cache cannot guarantee that the next read sees the mutation.
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
    const response = NextResponse.json(payload, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
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

    return errorResponse(ensureApiError(error, 'Unexpected error while fetching contacts'));
  }
}
