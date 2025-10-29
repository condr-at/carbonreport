import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';

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

function computeStatus(request: { revokedAt: Date | null; completedAt: Date | null }) {
  if (request.revokedAt) return 'revoked';
  if (request.completedAt) return 'completed';
  return 'pending';
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

    const contactRecord = await resolveContact(payload.contact, project.userId);

    const createdRequests = await prisma.$transaction(async (tx) => {
      const results = [] as Array<{
        id: string;
        dataPointId: string;
        itemId: string | null;
        fieldLabel: string | null;
        requestedAt: Date;
        revokedAt: Date | null;
        completedAt: Date | null;
        deadline: Date | null;
      }>;

      for (const field of payload.fields) {
        await tx.dataRequest.updateMany({
          where: {
            projectId: payload.projectId,
            dataPointId: field.dataPointId,
            itemId: field.itemId ?? null,
            revokedAt: null,
            completedAt: null,
            contactId: { not: contactRecord.id },
          },
          data: { revokedAt: now },
        });

        const created = await tx.dataRequest.create({
          data: {
            projectId: payload.projectId,
            userId: project.userId,
            contactId: contactRecord.id,
            dataPointId: field.dataPointId,
            itemId: field.itemId ?? null,
            fieldLabel: field.fieldLabel ?? null,
            deadline: deadlineDate,
          },
          select: {
            id: true,
            dataPointId: true,
            itemId: true,
            fieldLabel: true,
            requestedAt: true,
            revokedAt: true,
            completedAt: true,
            deadline: true,
          },
        });

        results.push(created);
      }

      return results;
    });

    const fieldIds = Array.from(new Set(createdRequests.map((r) => r.dataPointId)));
    const fieldDefinitions = await prisma.datasetFieldDefinition.findMany({
      where: { fieldId: { in: fieldIds } },
      select: { fieldId: true, label: true, hint: true },
    });

    const fieldMeta = new Map(fieldDefinitions.map((def) => [def.fieldId, def]));

    const responsePayload = {
      requests: createdRequests.map((request) => {
        const definition = fieldMeta.get(request.dataPointId);
        return {
          id: request.id,
          status: computeStatus(request),
          requestedAt: request.requestedAt.toISOString(),
          completedAt: request.completedAt?.toISOString() ?? null,
          revokedAt: request.revokedAt?.toISOString() ?? null,
          deadline: request.deadline?.toISOString() ?? null,
          contact: {
            id: contactRecord.id,
            name: contactRecord.name,
            email: contactRecord.email,
            position: contactRecord.position,
          },
          dataPoint: {
            id: request.dataPointId,
            itemId: request.itemId,
            label: request.fieldLabel ?? definition?.label ?? null,
            hint: definition?.hint ?? null,
          },
        };
      }),
    };

    return NextResponse.json(responsePayload, { status: 201 });
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

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unexpected error while logging data request',
      },
      { status: 500 }
    );
  }
}

async function resolveContact(contact: ParsedRequest['contact'], userId: string) {
  if (contact.id) {
    const existing = await prisma.contact.findUnique({ where: { id: contact.id } });

    if (!existing || existing.userId !== userId) {
      throw new Error('Contact not found for current project');
    }

    return existing;
  }

  const existingByEmail = await prisma.contact.findFirst({
    where: {
      userId,
      email: contact.email,
    },
  });

  if (existingByEmail) {
    return existingByEmail;
  }

  const name = contact.name?.trim();

  return prisma.contact.create({
    data: {
      userId,
      email: contact.email,
      name: name && name.length > 0 ? name : contact.email,
      position: null,
    },
  });
}
