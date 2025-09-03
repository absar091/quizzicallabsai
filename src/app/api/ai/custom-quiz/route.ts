import { NextRequest, NextResponse } from 'next/server';
import { generateCustomQuizServer } from '@/ai/server-only';

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    const result = await generateCustomQuizServer(input);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}