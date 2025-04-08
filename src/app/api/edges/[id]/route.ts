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
    const [edge] = await db
        .update(edges)
        .set({ keywords, label: keywords.join(', ') })
        .where(eq(edges.id, edgeId)).returning();
    return NextResponse.json({ edge });
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await db.delete(edges).where(eq(edges.id, params.id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[DELETE EDGE]', error);
        return NextResponse.json({ error: 'Failed to delete edge' }, { status: 500 });
    }
}