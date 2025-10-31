import { NextRequest, NextResponse } from 'next/server';
import { isEmailVerified } from '@/lib/email-verification';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const verified = await isEmailVerified(email);

    return NextResponse.json({ 
      verified,
      email: email.substring(0, 20) + '...',
      cached: true // Indicate this might be cached
    });

  } catch (error: any) {
    console.error('Check verification error:', error);
    
    // FIXED: Handle quota exceeded specifically
    if (error.code === 8 || error.message?.includes('Quota exceeded')) {
      return NextResponse.json({ 
        error: 'Service temporarily unavailable due to high usage. Please try again later.',
        quotaExceeded: true
      }, { status: 503 }); // Service Unavailable
    }
    
    return NextResponse.json({ 
      error: 'Failed to check verification status',
      verified: false // Default to not verified on error
    }, { status: 500 });
  }
}