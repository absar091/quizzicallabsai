import { NextRequest, NextResponse } from 'next/server';
import { verifyCodeFromDB } from '@/lib/email-verification';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code, originalEmail } = body;

    console.log('Verify request received:', { email, code: code?.length, originalEmail });

    if (!email || !code) {
      console.log('Missing email or code');
      return NextResponse.json({ 
        error: 'Email and code are required' 
      }, { status: 400 });
    }

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      console.log('Invalid code format:', code);
      return NextResponse.json({ 
        error: 'Code must be 6 digits' 
      }, { status: 400 });
    }

    // Verify code from database
    const isValid = await verifyCodeFromDB(email, code);

    if (isValid) {
      // Try to update Firebase Auth user as verified
      try {
        const { auth } = await import('@/lib/firebase-admin');
        const user = await auth.getUserByEmail(originalEmail || email);
        if (!user.emailVerified) {
          await auth.updateUser(user.uid, { emailVerified: true });
        }
      } catch (authError: any) {
        console.log('Firebase Auth update failed:', authError.message);
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email verified successfully'
      });
    } else {
      return NextResponse.json({ 
        error: 'Invalid or expired verification code' 
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Verify code error:', error.message);
    return NextResponse.json({ 
      error: 'Failed to verify code' 
    }, { status: 500 });
  }
}