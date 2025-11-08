import { NextRequest, NextResponse } from 'next/server';
import { generateSimpleExplanationServer } from '@/ai/server-only';
import { trackAIUsage } from '@/middleware/track-ai-usage';

async function simpleExplanationHandler(request: NextRequest) {
  try {
    console.log('💡 Simple explanation API called');
    
    const body = await request.json();
    const { question, correctAnswer, topic, isPro } = body;
    
    console.log('📝 Simple explanation input:', { 
      question: question?.substring(0, 50), 
      topic: topic?.substring(0, 30),
      isPro 
    });

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Simple explanation generation timed out after 45 seconds')), 45000);
    });

    const result = await Promise.race([
      generateSimpleExplanationServer({
        question,
        correctAnswer,
        topic,
        isPro
      }),
      timeoutPromise
    ]);

    console.log('✅ Simple explanation generated successfully');
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Simple explanation error:', error.message);
    
    let errorMessage = error.message || 'Failed to generate simple explanation';
    
    if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
      errorMessage = 'Explanation generation is taking longer than expected. Please try again.';
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
export const POST = trackAIUsage(simpleExplanationHandler, {
  estimateFromOutput: true,
  minimumTokens: 150
});
