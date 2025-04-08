import { db } from '@/drizzle/db';
import { edges, states } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id: stateId } = await params
    const { prompt, name } = await req.json();
    if (!prompt || !name) {
        return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
    }
    const [state] = await db
        .update(states)
        .set({ prompt, name })
        .where(eq(states.id, stateId)).returning();
    return NextResponse.json({ state });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id: stateId } = await params

        const sourceEdge = await db.query.edges.findFirst({
            where: eq(edges.source, stateId),
        });
        const targetEdge = await db.query.edges.findFirst({
            where: eq(edges.target, stateId),
        });

        await db.delete(states).where(eq(states.id, stateId));
        if (targetEdge) await db.delete(edges).where(eq(edges.id, targetEdge.id));
        if (sourceEdge) await db.delete(edges).where(eq(edges.id, sourceEdge.id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[DELETE STATE]', error);
        return NextResponse.json({ error: 'Failed to delete state' }, { status: 500 });
    }
}