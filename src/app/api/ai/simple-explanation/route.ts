import { NextRequest, NextResponse } from 'next/server';
import { generateSimpleExplanationServer } from '@/ai/server-only';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, correctAnswer, topic, isPro } = body;

    const result = await generateSimpleExplanationServer({
      question,
      correctAnswer,
      topic,
      isPro
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating simple explanation:', error);
    return NextResponse.json(
      { error: 'Failed to generate simple explanation' },
      { status: 500 }
    );
  }
}