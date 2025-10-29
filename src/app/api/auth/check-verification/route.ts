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
      email: email.substring(0, 20) + '...'
    });

  } catch (error: any) {
    console.error('Check verification error:', error);
    return NextResponse.json({ 
      error: 'Failed to check verification status' 
    }, { status: 500 });
  }
}