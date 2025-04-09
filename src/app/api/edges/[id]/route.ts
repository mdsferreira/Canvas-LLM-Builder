import { db } from '@/drizzle/db';
import { edges } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

interface Params {
    params: Promise<{ id: string }>
}

export async function PUT(req: Request, { params }: Params) {
    const { id: edgeId } = await params
    const { keywords } = await req.json();
    if (!Array.isArray(keywords)) {
        return NextResponse.json({ error: 'Invalid keywords' }, { status: 400 });
    }
    const [edge] = await db
        .update(edges)
        .set({ label: keywords.join(', '), keywords })
        .where(eq(edges.id, edgeId)).returning();
    return NextResponse.json({ edge });
}


export async function DELETE(_: Request, { params }: Params) {
    try {
        const { id: edgeId } = await params
        await db.delete(edges).where(eq(edges.id, edgeId));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[DELETE EDGE]', error);
        return NextResponse.json({ error: 'Failed to delete edge' }, { status: 500 });
    }
}