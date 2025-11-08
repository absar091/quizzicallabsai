import { NextRequest, NextResponse } from 'next/server';
import { generateQuizFromDocumentServer } from '@/ai/server-only';
import { trackAIUsage } from '@/middleware/track-ai-usage';

async function quizFromDocumentHandler(request: NextRequest) {
  try {
    console.log('📄 Quiz from document generation API called');
    
    const body = await request.json();
    console.log('📝 Document quiz input:', { 
      hasDocument: !!body.documentDataUri, 
      documentLength: body.documentDataUri?.length,
      numberOfQuestions: body.numberOfQuestions,
      isPro: body.isPro 
    });

    // Validate required fields
    if (!body.documentDataUri) {
      return NextResponse.json(
        { error: 'No document provided. Please upload a document to generate a quiz.' },
        { status: 400 }
      );
    }

    if (!body.numberOfQuestions || body.numberOfQuestions < 1 || body.numberOfQuestions > 55) {
      return NextResponse.json(
        { error: 'Number of questions must be between 1 and 55.' },
        { status: 400 }
      );
    }

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Document quiz generation timed out after 3 minutes')), 180000);
    });

    const result = await Promise.race([
      generateQuizFromDocumentServer(body),
      timeoutPromise
    ]);

    console.log('✅ Document quiz generated successfully:', result.quiz?.length, 'questions');
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Document quiz generation error:', error.message);
    
    let errorMessage = error.message || 'Failed to generate quiz from document';
    
    if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
      errorMessage = 'Document quiz generation is taking longer than expected. Please try with a shorter document or try again later.';
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
export const POST = trackAIUsage(quizFromDocumentHandler, {
  estimateFromOutput: true,
  minimumTokens: 800
});
