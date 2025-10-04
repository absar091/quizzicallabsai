import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { sendAutomatedWelcomeEmail } from '@/lib/email-automation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken, userEmail, userName } = body;

    // Verify authentication
    if (!idToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (error) {
      console.error('Invalid token:', error);
      return NextResponse.json(
        { success: false, error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;
    const email = userEmail || decodedToken.email;
    const name = userName || decodedToken.name || 'Student';

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address required' },
        { status: 400 }
      );
    }

    console.log(`📧 Sending welcome email to: ${email}`);

    // Send welcome email
    try {
      const result = await sendAutomatedWelcomeEmail(
        email,
        name,
        {
          planName: 'Free',
          signupDate: new Date().toLocaleDateString()
        }
      );

      if (result.success) {
        console.log('✅ Welcome email sent successfully');
        return NextResponse.json({
          success: true,
          message: 'Welcome email sent successfully'
        });
      } else {
        console.error('❌ Welcome email failed:', result);
        const isBlocked = 'blocked' in result ? result.blocked : false;
        return NextResponse.json(
          { 
            success: false, 
            error: isBlocked ? 'User has opted out of emails' : 'Failed to send email',
            blocked: isBlocked
          },
          { status: isBlocked ? 200 : 500 }
        );
      }

    } catch (emailError: any) {
      console.error('❌ Welcome email error:', emailError);
      return NextResponse.json(
        { success: false, error: emailError.message || 'Email service error' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('❌ Welcome notification error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests for testing
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Welcome notification endpoint is active',
    timestamp: new Date().toISOString()
  });
}