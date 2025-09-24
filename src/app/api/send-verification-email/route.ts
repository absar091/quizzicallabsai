import { NextRequest, NextResponse } from 'next/server';
import { sendEmailVerificationEmail } from '@/lib/email';
import { auth as adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken, verificationLink, userEmail, userName } = body;

    if (!verificationLink) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: verificationLink' },
        { status: 400 }
      );
    }

    console.log('📧 Sending custom verification email');

    let email = userEmail;
    let name = userName || 'User';

    // If idToken is provided, try to extract user info from it
    if (idToken && adminAuth) {
      try {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        email = decodedToken.email || email;
        name = decodedToken.name || decodedToken.email?.split('@')[0] || name;
        console.log('✅ User info extracted from token:', { email: email?.substring(0, 20) + '...', name });
      } catch (tokenError) {
        console.warn('⚠️ Could not verify token, using provided data:', tokenError);
      }
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Missing user email' },
        { status: 400 }
      );
    }

    // Send the custom verification email
    const result = await sendEmailVerificationEmail(
      email,
      name,
      verificationLink
    );

    console.log('✅ Custom verification email sent successfully:', result.messageId);

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully!',
      messageId: result.messageId,
      sentTo: email.substring(0, 20) + '...'
    });

  } catch (error: any) {
    console.error('❌ Failed to send verification email:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}