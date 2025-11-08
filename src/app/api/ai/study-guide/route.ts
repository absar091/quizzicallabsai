import { NextRequest, NextResponse } from 'next/server';
import { generateStudyGuideServer } from '@/ai/server-only';
import { trackAIUsage } from '@/middleware/track-ai-usage';

async function studyGuideHandler(request: NextRequest) {
  try {
    console.log('📚 Study guide generation API called');
    
    const body = await request.json();
    console.log('📝 Study guide input:', { topic: body.topic?.substring(0, 50), isPro: body.isPro });

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Study guide generation timed out after 3 minutes')), 180000);
    });

    const result = await Promise.race([
      generateStudyGuideServer(body),
      timeoutPromise
    ]);

    console.log('✅ Study guide generated successfully');
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Study guide generation error:', error.message);
    
    let errorMessage = error.message || 'Failed to generate study guide';
    
    if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
      errorMessage = 'Study guide generation is taking longer than expected. Please try again later.';
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
export const POST = trackAIUsage(studyGuideHandler, {
  estimateFromOutput: true,
  minimumTokens: 1000 // Study guides use at least 1000 tokens
});