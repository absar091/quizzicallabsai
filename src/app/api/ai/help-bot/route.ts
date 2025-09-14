import { NextRequest, NextResponse } from 'next/server';
import { generateHelpBotResponseServer } from '@/ai/server-only';

export async function POST(request: NextRequest) {
  try {
    console.log('🤖 Help bot API called');
    
    const body = await request.json();
    const { query, faqContext, userPlan } = body;
    
    console.log('📝 Help bot input:', { 
      query: query?.substring(0, 50), 
      userPlan,
      hasFaqContext: !!faqContext 
    });

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Help bot response timed out after 30 seconds')), 30000);
    });

    const result = await Promise.race([
      generateHelpBotResponseServer({
        query,
        faqContext,
        userPlan
      }),
      timeoutPromise
    ]);

    console.log('✅ Help bot response generated successfully');
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Help bot response error:', error.message);
    
    let errorMessage = error.message || 'Failed to generate help bot response';
    
    if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
      errorMessage = 'Help bot is taking longer than expected. Please try again.';
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