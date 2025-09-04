import { NextRequest, NextResponse } from 'next/server';
import { generateExplanationsServer } from '@/ai/server-only';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, studentAnswer, correctAnswer, topic, isPro } = body;

    const result = await generateExplanationsServer({
      question,
      studentAnswer,
      correctAnswer,
      topic,
      isPro
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating explanation:', error);
    return NextResponse.json(
      { error: 'Failed to generate explanation' },
      { status: 500 }
    );
  }
}