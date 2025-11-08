import { NextRequest, NextResponse } from 'next/server';
import { generateCustomQuizServer } from '@/ai/server-only';
import { trackAIUsage } from '@/middleware/track-ai-usage';

async function customQuizHandler(request: NextRequest) {
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

    console.log('✅ Quiz generated successfully:', (result as any).quiz?.length, 'questions');

    // Track quiz creation if 15+ questions
    if ((result as any).quiz && (result as any).quiz.length >= 15) {
      try {
        const { whopService } = await import('@/lib/whop');
        const authHeader = request.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
          const token = authHeader.split('Bearer ')[1];
          const { auth } = await import('@/lib/firebase-admin');
          const decodedToken = await auth.verifyIdToken(token);
          await whopService.trackQuizCreation(decodedToken.uid);
          console.log(`✅ Tracked quiz creation for user ${decodedToken.uid}`);
        }
      } catch (error) {
        console.error('❌ Failed to track quiz creation:', error);
      }
    }

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

// Wrap with usage tracking middleware
export const POST = trackAIUsage(customQuizHandler, {
  estimateFromOutput: true,
  minimumTokens: 500 // Quizzes use at least 500 tokens
});
