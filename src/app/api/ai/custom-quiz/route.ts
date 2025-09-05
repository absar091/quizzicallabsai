import { NextRequest, NextResponse } from 'next/server';
import { generateCustomQuizServer } from '@/ai/server-only';

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Quiz generation API called');

    const input = await request.json();
    console.log('📝 Input received:', {
      topic: input.topic,
      difficulty: input.difficulty,
      numberOfQuestions: input.numberOfQuestions,
      isPro: input.isPro
    });

    const result = await generateCustomQuizServer(input);
    console.log('✅ Quiz generated successfully:', result.quiz?.length, 'questions');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Quiz generation API error:', error.message);
    console.error('Stack trace:', error.stack);

    return NextResponse.json({
      error: error.message || 'Failed to generate quiz',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
