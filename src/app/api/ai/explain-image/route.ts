import { NextRequest, NextResponse } from 'next/server';
import { explainImageServer } from '@/ai/server-only';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await explainImageServer(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error explaining image:', error);
    return NextResponse.json(
      { error: 'Failed to explain image' },
      { status: 500 }
    );
  }
}