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

    // Clean the code input
    const cleanCode = String(code).trim().replace(/\s/g, '');

    if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
      console.log('Invalid code format:', cleanCode);
      return NextResponse.json({ 
        error: 'Code must be exactly 6 digits' 
      }, { status: 400 });
    }

    // Verify code from database
    const isValid = await verifyCodeFromDB(email, cleanCode);

    if (isValid) {
      // Try to update Firebase Auth user as verified
      try {
        const { auth } = await import('@/lib/firebase-admin');
        const user = await auth.getUserByEmail(originalEmail || email);
        if (!user.emailVerified) {
          await auth.updateUser(user.uid, { emailVerified: true });
          console.log('Firebase Auth user marked as verified:', user.uid);
        }
      } catch (authError: any) {
        console.log('Firebase Auth update failed (non-critical):', authError.message);
        // Don't fail the verification if Firebase Auth update fails
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email verified successfully'
      });
    } else {
      console.log('Verification failed for:', email, 'with code:', cleanCode);
      return NextResponse.json({ 
        error: 'Invalid or expired verification code. Please request a new code.' 
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Verify code error:', error.message);
    return NextResponse.json({ 
      error: 'Failed to verify code. Please try again.' 
    }, { status: 500 });
  }
}