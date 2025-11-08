import { NextRequest, NextResponse } from 'next/server';
import { generateFlashcardsServer } from '@/ai/server-only';
import { trackAIUsage } from '@/middleware/track-ai-usage';

async function flashcardsHandler(request: NextRequest) {
  try {
    console.log('🃏 Flashcards generation API called');
    
    const body = await request.json();
    const { topic, incorrectQuestions } = body;
    
    console.log('📝 Flashcards input:', { 
      topic: topic?.substring(0, 50), 
      incorrectQuestionsCount: incorrectQuestions?.length 
    });

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Flashcards generation timed out after 90 seconds')), 90000);
    });

    const result = await Promise.race([
      generateFlashcardsServer({
        topic,
        incorrectQuestions
      }),
      timeoutPromise
    ]);

    console.log('✅ Flashcards generated successfully:', result.flashcards?.length, 'cards');
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Flashcards generation error:', error.message);
    
    let errorMessage = error.message || 'Failed to generate flashcards';
    
    if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
      errorMessage = 'Flashcards generation is taking longer than expected. Please try again.';
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMessage = 'AI service is currently busy. Please wait a moment and try again.';
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      errorMessage = 'Network connection issue. Please check your internet connection and try again.';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Wrap with usage tracking middleware
export const POST = trackAIUsage(flashcardsHandler, {
  estimateFromOutput: true,
  minimumTokens: 300
});
