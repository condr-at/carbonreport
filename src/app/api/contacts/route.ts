import { NextResponse } from 'next/server';
import { getContactsOverview } from '@/lib/server-data/contacts';

export async function GET() {
  try {
    const contacts = await getContactsOverview();
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Failed to load contacts', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}
