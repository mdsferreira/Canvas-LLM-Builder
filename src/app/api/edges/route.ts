import { db } from '@/drizzle/db';
import { edges } from '@/drizzle/schema';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();
    const { agentId, source, target, label } = body;

    const [edge] = await db.insert(edges).values(
        {
            agentId,
            source,
            target,
            label,
        }
    ).returning();

    return NextResponse.json({ edge });
}