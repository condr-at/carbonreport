import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';

const paramsSchema = z.object({
  id: z.string().min(1, 'Project id is required'),
});

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const rawParams = await context.params;
    const { id } = paramsSchema.parse(rawParams);

    const project = await db.project.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const contacts = await db.contact.findMany({
      where: {
        userId: project.userId,
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

    return NextResponse.json({ contacts });
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
