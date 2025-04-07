import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
    const { globalPrompt, currentStatePrompt, message } = await req.json();

    const systemPrompt = `${globalPrompt}\n\nCurrent State Prompt:\n${currentStatePrompt}`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
        ],
    });

    const reply = response.choices[0].message.content;
    return NextResponse.json({ reply });
}
