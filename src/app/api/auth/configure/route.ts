import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    if (!auth) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    // Configure action code settings for password reset and email verification
    const actionCodeSettings = {
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://quizzicallabs.vercel.app'}/auth/action`,
      handleCodeInApp: false,
    };

    return NextResponse.json({ 
      success: true, 
      actionUrl: actionCodeSettings.url,
      message: 'Firebase auth configured successfully' 
    });
  } catch (error: any) {
    console.error('Firebase auth configuration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}