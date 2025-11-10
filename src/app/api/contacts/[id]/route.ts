import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getContactDetail } from '@/lib/server-data/contacts';
import { getGlobalDataRequests } from '@/lib/server-data/requests';

const paramsSchema = z.object({
  id: z.string().min(1, 'Contact id is required'),
});

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const rawParams = await context.params;
    const { id } = paramsSchema.parse(rawParams);

    const contact = await getContactDetail(id);

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    const requests = await getGlobalDataRequests({ contactId: id, status: 'all' });

    return NextResponse.json({ contact, requests });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid contact id',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Failed to load contact', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch contact',
      },
      { status: 500 }
    );
  }
}
