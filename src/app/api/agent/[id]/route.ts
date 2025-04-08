import { db } from '@/drizzle/db';
import { agents, edges, states } from '@/drizzle/schema';
import { eq, inArray, sql, SQL } from 'drizzle-orm';
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
        // update the states with new positions
        const sqlChunks: SQL[] = [];
        const ids: string[] = [];
        sqlChunks.push(sql`(case `);
        for (const state of updatedStates) {
            sqlChunks.push(sql`when ${states.id} = ${state.id} then`),
                sqlChunks.push(sql`${state.position}::json`);
            ids.push(state.id);
        }
        sqlChunks.push(sql`end)`);
        const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '));
        await db.update(states).set({ position: finalSql }).where(inArray(states.id, ids));
    }
    return NextResponse.json({ success: true });
}