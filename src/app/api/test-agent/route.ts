import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
    const { globalPrompt, currentStatePrompt, message, chatHistory } = await req.json();

    const messages = [
        { role: 'system', content: globalPrompt },
        ...(currentStatePrompt ? [{ role: 'system', content: currentStatePrompt }] : []),
        ...chatHistory,
        { role: 'user', content: message },
    ];

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
    });

    const reply = response.choices[0].message.content;
    return NextResponse.json({ reply });
}
