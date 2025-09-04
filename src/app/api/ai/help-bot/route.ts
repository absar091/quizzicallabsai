import { NextRequest, NextResponse } from 'next/server';
import { generateHelpBotResponseServer } from '@/ai/server-only';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, faqContext, userPlan } = body;

    const result = await generateHelpBotResponseServer({
      query,
      faqContext,
      userPlan
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating help bot response:', error);
    return NextResponse.json(
      { error: 'Failed to generate help bot response' },
      { status: 500 }
    );
  }
}