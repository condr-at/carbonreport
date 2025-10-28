import { NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  projectId: z.string().min(1, 'projectId is required'),
  contact: z.object({
    email: z.string().email('contact.email must be a valid email'),
    name: z.string().min(1).optional(),
  }),
  deadline: z.string().optional().nullable(),
  fields: z
    .array(
      z.object({
        dataPointId: z.string().min(1).optional().nullable(),
        fieldLabel: z.string().min(1).optional().nullable(),
        itemId: z.string().min(1).optional().nullable(),
        group: z.string().min(1).optional().nullable(),
      })
    )
    .min(1, 'fields array must include at least one entry'),
  mailtoPreview: z.object({
    subject: z.string().min(1, 'mailtoPreview.subject is required'),
    body: z.string().min(1, 'mailtoPreview.body is required'),
  }),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = requestSchema.parse(payload);

    console.info('Mock data request received', JSON.stringify(parsed, null, 2));

    return NextResponse.json(
      {
        ok: true,
        message: 'Data request logged (mock)',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Mock data request failed', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid payload',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Unexpected error while logging data request',
      },
      { status: 500 }
    );
  }
}
