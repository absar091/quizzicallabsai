import { NextRequest, NextResponse } from 'next/server';
import { generateQuizFromDocumentServer } from '@/ai/server-only';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await generateQuizFromDocumentServer(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating quiz from document:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz from document' },
      { status: 500 }
    );
  }
}