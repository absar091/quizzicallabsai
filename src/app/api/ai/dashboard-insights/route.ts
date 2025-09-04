import { NextRequest, NextResponse } from 'next/server';
import { generateDashboardInsightsServer } from '@/ai/server-only';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userName, quizHistory, isPro } = body;

    const result = await generateDashboardInsightsServer({
      userName,
      quizHistory,
      isPro
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating dashboard insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate dashboard insights' },
      { status: 500 }
    );
  }
}