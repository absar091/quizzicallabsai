import { NextRequest, NextResponse } from 'next/server';
import { generateFlashcardsServer } from '@/ai/server-only';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, incorrectQuestions } = body;

    const result = await generateFlashcardsServer({
      topic,
      incorrectQuestions
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    );
  }
}