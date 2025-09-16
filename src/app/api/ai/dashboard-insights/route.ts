import { NextRequest, NextResponse } from 'next/server';
import { generateDashboardInsightsServer } from '@/ai/server-only';

export async function POST(request: NextRequest) {
  try {
    console.log('📊 Dashboard insights API called');
    
    const body = await request.json();
    const { userName, quizHistory, isPro } = body;

    console.log('📝 Dashboard input:', { userName, historyLength: quizHistory?.length, isPro });

    // Reduced timeout from 60s to 30s due to optimizations
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Dashboard insights generation timed out')), 30000);
    });

    const result = await Promise.race([
      generateDashboardInsightsServer({
        userName,
        quizHistory,
        isPro
      }),
      timeoutPromise
    ]);

    console.log('✅ Dashboard insights generated successfully');
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Dashboard insights error:', error.message);
    
    let errorMessage = 'Failed to generate dashboard insights';
    
    if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
      errorMessage = 'Dashboard insights generation is taking longer than expected. Please try again.';
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMessage = 'AI service is currently busy. Please wait a moment and try again.';
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
