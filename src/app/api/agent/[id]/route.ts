import { db } from '@/drizzle/db';
import { agents, edges, states } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const { id: agentId } = await params
    const agentData = await db.query.agents.findFirst({
        where: eq(agents.id, agentId),
    });

    const stateData = await db.query.states.findMany({
        where: eq(states.agentId, agentId),
    });

    const edgesData = await db.query.edges.findMany({
        where: eq(edges.agentId, agentId),
    });

    return NextResponse.json({
        ...agentData,
        states: stateData,
        edges: edgesData
    });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id: agentId } = await params
    const { globalPrompt, states: updatedStates, edges: updatedEdges } = await req.json();

    // Update agent global prompt
    if (globalPrompt)
        await db.update(agents).set({ globalPrompt }).where(eq(agents.id, agentId));

    if (updatedStates && updatedEdges.length) {
        await db.delete(states).where(eq(states.agentId, agentId));
        await db.insert(states).values(
            updatedStates.map((state: any) => ({
                prompt: state.prompt,
                name: state.name,
                position: state.position,
                agentId: agentId,
            }))
        );
    }

    if (updatedEdges && updatedEdges.length) {
        await db.delete(edges).where(eq(edges.agentId, agentId));
        await db.insert(edges).values(
            updatedEdges.map((edge) => ({
                agentId,
                source: edge.source,
                target: edge.target,
                label: edge.label,
                keywords: edge.keywords
            }))
        );
    }
    return NextResponse.json({ success: true });
}