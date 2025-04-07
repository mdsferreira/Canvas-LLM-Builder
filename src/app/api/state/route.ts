import { db } from '@/drizzle/db';
import { states } from '@/drizzle/schema';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    const body = await req.json();
    const { agentId, prompt, position, name } = body;
    const [state] = await db.insert(states).values(
        {
            agentId,
            prompt,
            name,
            position
        }
    ).returning();

    return NextResponse.json({ state });
}