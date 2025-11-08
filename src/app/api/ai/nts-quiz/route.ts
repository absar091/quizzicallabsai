import { NextRequest, NextResponse } from 'next/server';
import { generateNtsQuizServer } from '@/ai/server-only';
import { trackAIUsage } from '@/middleware/track-ai-usage';

async function ntsQuizHandler(request: NextRequest) {
  try {
    console.log('🎯 NTS quiz generation API called');
    
    const body = await request.json();
    console.log('📝 NTS input:', { category: body.category, topic: body.topic?.substring(0, 50) });

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('NTS quiz generation timed out after 2 minutes')), 120000);
    });

    const result = await Promise.race([
      generateNtsQuizServer(body),
      timeoutPromise
    ]);

    console.log('✅ NTS quiz generated successfully:', result.quiz?.length, 'questions');
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ NTS quiz generation error:', error.message);
    
    let errorMessage = error.message || 'Failed to generate NTS quiz';
    
    if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
      errorMessage = 'NTS quiz generation is taking longer than expected. Please try with fewer questions or try again later.';
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
export const POST = trackAIUsage(ntsQuizHandler, {
  estimateFromOutput: true,
  minimumTokens: 500
});
