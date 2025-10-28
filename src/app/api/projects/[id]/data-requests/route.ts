import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const paramsSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'project id is required'),
  }),
});

const mockRequests = [
  {
    id: 'mock-req-1',
    projectId: 'any-project',
    contact: {
      id: 'contact-1',
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
    },
    dataPoint: {
      id: 'organization_name',
      label: 'Organization name',
      hint: 'Legal entity responsible for the report.',
    },
    requestedAt: '2025-10-15T09:30:00.000Z',
    completedAt: null,
    revokedAt: null,
  },
  {
    id: 'mock-req-2',
    projectId: 'any-project',
    contact: {
      id: 'contact-2',
      name: 'Priya Desai',
      email: 'priya.desai@example.com',
    },
    dataPoint: {
      id: 'total_cfp_co2e',
      label: 'Total CFP (kg CO₂e)',
      hint: 'Total carbon footprint result for the functional unit.',
    },
    requestedAt: '2025-10-10T14:15:00.000Z',
    completedAt: '2025-10-12T16:45:00.000Z',
    revokedAt: null,
  },
  {
    id: 'mock-req-3',
    projectId: 'any-project',
    contact: {
      id: 'contact-3',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
    },
    dataPoint: {
      id: 'material_input_name',
      label: 'Material name',
      hint: 'Name of the input material used in production.',
    },
    requestedAt: '2025-09-05T11:00:00.000Z',
    completedAt: null,
    revokedAt: '2025-09-12T09:05:00.000Z',
  },
];

function deriveStatus(request: { completedAt: string | null; revokedAt: string | null }) {
  if (request.revokedAt) {
    return 'revoked';
  }

  if (request.completedAt) {
    return 'completed';
  }

  return 'pending';
}

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const paramsInput = await context.params;
    const { params } = paramsSchema.parse({ params: paramsInput });

    console.info('Mock data requests queried for project', params.id);

    const result = mockRequests.map((entry) => ({
      id: entry.id,
      status: deriveStatus(entry),
      requestedAt: entry.requestedAt,
      completedAt: entry.completedAt,
      revokedAt: entry.revokedAt,
      contact: entry.contact,
      dataPoint: entry.dataPoint,
      projectId: params.id,
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Failed to serve mock data requests', error);

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
        error: 'Unexpected error while fetching data requests',
      },
      { status: 500 }
    );
  }
}
