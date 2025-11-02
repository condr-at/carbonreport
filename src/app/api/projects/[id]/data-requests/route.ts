import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import prisma from '@/lib/db';
import { computeStatus } from '@/lib/data-requests/service';
import { getCacheValue, setCacheValue } from '@/lib/cache';

const paramsSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'project id is required'),
  }),
});

const statusParamSchema = z.enum(['active', 'closed', 'overdue', 'all']);
const sortParamSchema = z.enum(['requested_at', 'deadline', 'field_id']);
const ENABLE_TIMING = process.env.NODE_ENV !== 'production';

function logTiming(label: string, start: bigint) {
  if (!ENABLE_TIMING) {
    return;
  }

  const duration = Number(process.hrtime.bigint() - start) / 1_000_000;
  console.info(`[data-requests] ${label} took ${duration.toFixed(2)}ms`);
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const startedAt = ENABLE_TIMING ? process.hrtime.bigint() : BigInt(0);
    const paramsInput = await context.params;
    const { params } = paramsSchema.parse({ params: paramsInput });

    const url = new URL(request.url);
    const statusParamInput = (url.searchParams.get('status') ?? 'active').toLowerCase();
    const sortParamInput = (url.searchParams.get('sort') ?? 'requested_at').toLowerCase();

    const parsedStatus = statusParamSchema.safeParse(statusParamInput);
    const statusParam = parsedStatus.success ? parsedStatus.data : 'active';

    const parsedSort = sortParamSchema.safeParse(sortParamInput);
    const sortParam = parsedSort.success ? parsedSort.data : 'requested_at';
    const contactFilter = url.searchParams.get('contact');

    const cacheKey = `project:data-requests:${params.id}:${statusParam}:${contactFilter ?? 'all'}:${sortParam}`;
    const cached = getCacheValue<{ requests: unknown[] }>(cacheKey);

    if (cached) {
  logTiming(`GET /projects/${params.id}/data-requests (cache hit)`, startedAt);
  return NextResponse.json(cached, { status: 200 });
    }

    const where: Prisma.DataRequestWhereInput = {
      projectId: params.id,
    };

    const now = new Date();

    switch (statusParam) {
      case 'active':
        where.revokedAt = null;
        where.completedAt = null;
        break;
      case 'closed':
        where.OR = [
          { revokedAt: { not: null } },
          { completedAt: { not: null } },
        ];
        break;
      case 'overdue':
        where.revokedAt = null;
        where.completedAt = null;
        where.deadline = { not: null, lt: now };
        break;
      case 'all':
      default:
        break;
    }

    if (contactFilter) {
      where.contactId = contactFilter;
    }

    const orderBy: Prisma.DataRequestOrderByWithRelationInput = (() => {
      switch (sortParam) {
        case 'deadline':
          return { deadline: 'asc' };
        case 'field_id':
          return { dataPointId: 'asc' };
        case 'requested_at':
        default:
          return { requestedAt: 'desc' };
      }
    })();

    const requests = await prisma.dataRequest.findMany({
      where,
      include: {
        contact: true,
      },
      orderBy,
    });

    const fieldIds = Array.from(new Set(requests.map((request) => request.dataPointId))).filter((id) => !!id);
    const fieldDefinitions = fieldIds.length
      ? await prisma.datasetFieldDefinition.findMany({
          where: { fieldId: { in: fieldIds } },
          select: { fieldId: true, label: true, hint: true },
        })
      : [];

    const fieldMeta = new Map(fieldDefinitions.map((definition) => [definition.fieldId, definition]));

    const responsePayload = {
      requests: requests.map((request) => {
        const definition = fieldMeta.get(request.dataPointId);
        return {
          id: request.id,
          status: computeStatus(request),
          requestedAt: request.requestedAt.toISOString(),
          completedAt: request.completedAt?.toISOString() ?? null,
          revokedAt: request.revokedAt?.toISOString() ?? null,
          deadline: request.deadline?.toISOString() ?? null,
          contact: request.contact
            ? {
                id: request.contact.id,
                name: request.contact.name,
                email: request.contact.email,
                position: request.contact.position,
              }
            : null,
          dataPoint: {
            id: request.dataPointId,
            itemId: request.itemId,
            label: request.fieldLabel ?? definition?.label ?? null,
            hint: definition?.hint ?? null,
          },
        };
      }),
    };

  setCacheValue(cacheKey, responsePayload);

    const response = NextResponse.json(responsePayload, { status: 200 });
    logTiming(`GET /projects/${params.id}/data-requests`, startedAt);
    return response;
  } catch (error) {
    console.error('Failed to fetch data requests', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request parameters',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Unexpected error while fetching data requests',
      },
      { status: 500 }
    );
  }
}
