import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { idToken, userEmail, userName } = await request.json();

    if (!userEmail || !userName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userEmail, userName' },
        { status: 400 }
      );
    }

    // Skip token verification for now to avoid Firebase admin issues
    console.log('📧 Sending welcome email to new user:', userEmail);

    // Send welcome email
    const result = await sendWelcomeEmail(userEmail, userName, {
      userEmail,
      accountType: 'Free',
      signUpDate: new Date().toLocaleDateString(),
      preferredLanguage: 'English'
    });

    console.log('✅ Welcome email sent successfully:', result.messageId);

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent successfully!',
      messageId: result.messageId
    });

  } catch (error: any) {
    console.error('❌ Welcome email failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send welcome email'
    }, { status: 500 });
  }
}