import { NextRequest, NextResponse } from 'next/server';
import { generateStudyGuideServer } from '@/ai/server-only';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await generateStudyGuideServer(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating study guide:', error);
    return NextResponse.json(
      { error: 'Failed to generate study guide' },
      { status: 500 }
    );
  }
}