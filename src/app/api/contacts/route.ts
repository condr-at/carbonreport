import { NextResponse } from 'next/server';
import { getContactsOverview } from '@/lib/server-data/contacts';
import { ensureApiError, errorResponse } from '@/lib/api-error';

export async function GET() {
  try {
    const contacts = await getContactsOverview();
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Failed to load contacts', error);
    return errorResponse(ensureApiError(error, 'Failed to fetch contacts'));
  }
}
