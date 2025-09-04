import { NextRequest, NextResponse } from 'next/server';
import { generateNtsQuizServer } from '@/ai/server-only';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await generateNtsQuizServer(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating NTS quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate NTS quiz' },
      { status: 500 }
    );
  }
}