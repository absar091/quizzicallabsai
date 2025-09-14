import { NextRequest, NextResponse } from 'next/server';
import { explainImageServer } from '@/ai/server-only';

export async function POST(request: NextRequest) {
  try {
    console.log('🖼️ Explain image API called');
    
    const body = await request.json();
    console.log('📝 Image explanation input:', { 
      hasImage: !!body.imageDataUri,
      query: body.query?.substring(0, 50)
    });

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Image explanation timed out after 90 seconds')), 90000);
    });

    const result = await Promise.race([
      explainImageServer(body),
      timeoutPromise
    ]);

    console.log('✅ Image explanation generated successfully');
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Image explanation error:', error.message);
    
    let errorMessage = error.message || 'Failed to explain image';
    
    if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
      errorMessage = 'Image explanation is taking longer than expected. Please try again.';
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