import { db } from '@/drizzle/db';
import { edges } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id: edgeId } = await params
    const { keywords } = await req.json();

    if (!Array.isArray(keywords)) {
        return NextResponse.json({ error: 'Invalid keywords' }, { status: 400 });
    }

    await db
        .update(edges)
        .set({ keywords, label: keywords.join(', ') })
        .where(eq(edges.id, edgeId));

    return NextResponse.json({ success: true });
}
