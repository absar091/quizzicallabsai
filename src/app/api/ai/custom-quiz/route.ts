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

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Quiz generation timed out after 2 minutes')), 120000);
    });

    const result = await Promise.race([
      generateCustomQuizServer(input),
      timeoutPromise
    ]);

    console.log('✅ Quiz generated successfully:', result.quiz?.length, 'questions');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Quiz generation API error:', error.message);
    console.error('Stack trace:', error.stack);

    // Provide more specific error messages
    let errorMessage = error.message || 'Failed to generate quiz';
    
    if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
      errorMessage = 'Quiz generation is taking longer than expected. Please try with fewer questions or try again later.';
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMessage = 'AI service is currently busy. Please wait a moment and try again.';
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      errorMessage = 'Network connection issue. Please check your internet connection and try again.';
    }

    return NextResponse.json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
