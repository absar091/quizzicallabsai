import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Get user document
    const userDoc = await firestore.collection('users').doc(email).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ 
        error: 'No verification data found for this email',
        email,
        exists: false
      });
    }

    const userData = userDoc.data();
    const now = Date.now();

    return NextResponse.json({
      email,
      exists: true,
      data: {
        hasToken: !!userData?.emailVerificationToken,
        hasExpires: !!userData?.emailVerificationExpires,
        token: userData?.emailVerificationToken ? `${userData.emailVerificationToken.substring(0, 2)}****` : null,
        expires: userData?.emailVerificationExpires ? new Date(userData.emailVerificationExpires).toISOString() : null,
        isExpired: userData?.emailVerificationExpires ? userData.emailVerificationExpires <= now : null,
        timeLeft: userData?.emailVerificationExpires ? Math.max(0, Math.round((userData.emailVerificationExpires - now) / 1000 / 60)) : null,
        isVerified: userData?.isEmailVerified || false,
        now: new Date(now).toISOString()
      }
    });

  } catch (error: any) {
    console.error('Debug verification error:', error);
    return NextResponse.json({ 
      error: 'Failed to debug verification',
      details: error.message 
    }, { status: 500 });
  }
}