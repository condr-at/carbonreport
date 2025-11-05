import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import {
  DataRequestServiceError,
  executeBulk,
  prepareBulk,
  serializeRequests,
} from '@/lib/data-requests/service';

const fieldSchema = z.object({
  dataPointId: z.string().min(1, 'fieldId is required'),
  fieldLabel: z.string().optional().nullable(),
  itemId: z.string().optional().nullable(),
  group: z.string().optional().nullable(),
});

const requestSchema = z.object({
  projectId: z.string().min(1, 'projectId is required'),
  contact: z.object({
    id: z.string().uuid().optional(),
    email: z.string().email('contact.email must be a valid email'),
    name: z.string().optional().nullable(),
  }),
  deadline: z.string().optional().nullable(),
  fields: z.array(fieldSchema).min(1, 'fields array must include at least one entry'),
  mailtoPreview: z.object({
    subject: z.string().min(1, 'mailtoPreview.subject is required'),
    body: z.string().min(1, 'mailtoPreview.body is required'),
  }),
});

type ParsedRequest = z.infer<typeof requestSchema>;

function parseDeadline(deadline: ParsedRequest['deadline']) {
  if (!deadline) return null;

  const value = deadline.trim();
  if (value.length === 0) return null;

  const normalized = value.includes('T') ? value : `${value}T00:00:00Z`;
  const parsed = new Date(normalized);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Deadline must be a valid ISO-8601 date string');
  }

  return parsed;
}

export async function POST(request: Request) {
  try {
    const rawPayload = await request.json();
    const payload = requestSchema.parse(rawPayload);

    const project = await prisma.project.findUnique({
      where: { id: payload.projectId },
      select: { id: true, userId: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const deadlineDate = parseDeadline(payload.deadline);
    const now = new Date();

    const plan = await prepareBulk(
      {
        projectId: payload.projectId,
        userId: project.userId,
        contact: payload.contact,
        deadline: deadlineDate,
        fields: payload.fields,
        now,
      },
      prisma
    );

    const result = await executeBulk(plan, prisma);
    const serialized = await serializeRequests(result.createdIds, prisma);

    return NextResponse.json(
      {
        success: true,
        created: result.createdCount,
        revoked: result.revokedCount,
        requests: serialized,
        version: result.version,
        updatedAt: result.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to log data requests', error);

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

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unexpected error while logging data request',
      },
      { status: 500 }
    );
  }
}
