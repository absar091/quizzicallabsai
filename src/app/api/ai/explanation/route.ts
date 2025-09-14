import { NextRequest, NextResponse } from 'next/server';
import { generateExplanationsServer } from '@/ai/server-only';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Explanation API called');
    
    const body = await request.json();
    const { question, studentAnswer, correctAnswer, topic, isPro } = body;
    
    console.log('📝 Explanation input:', { 
      question: question?.substring(0, 50), 
      topic: topic?.substring(0, 30),
      isPro 
    });

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Explanation generation timed out after 60 seconds')), 60000);
    });

    const result = await Promise.race([
      generateExplanationsServer({
        question,
        studentAnswer,
        correctAnswer,
        topic,
        isPro
      }),
      timeoutPromise
    ]);

    console.log('✅ Explanation generated successfully');
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Explanation generation error:', error.message);
    
    let errorMessage = error.message || 'Failed to generate explanation';
    
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