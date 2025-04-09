import { db } from '@/drizzle/db';
import { agents, states, edges } from '@/drizzle/schema';
import { Edge, State } from '@/lib/context';
import { NextResponse } from 'next/server';

export async function GET() {
    const allAgents = await db.select().from(agents);
    return NextResponse.json(allAgents);
}

export async function POST(req: Request) {
    const body = await req.json();
    const { globalPrompt, states: stateData, edges: edgesData } = body;
    // Create agent
    const [agent] = await db.insert(agents).values({ globalPrompt }).returning();

    // Create related states
    if (stateData && stateData.length) {
        await db.insert(states).values(
            stateData.map((s: State) => ({
                agentId: agent.id,
                prompt: s.prompt,
                name: s.name,
                position: s.position,
            }))
        );
    }
    if (edgesData && edgesData.length) {
        await db.insert(edges).values(
            edgesData.map((edge: Edge) => ({
                agentId: agent.id,
                source: edge.source,
                target: edge.target,
                label: edge.label,
            }))
        );
    }
    return NextResponse.json({ agent });
}