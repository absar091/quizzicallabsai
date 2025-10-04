import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { sendEmail } from '@/lib/email';
import { subscriptionConfirmationEmailTemplate } from '@/lib/email-templates';
import { SecureLogger } from '@/lib/secure-logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      idToken, 
      userEmail, 
      userName, 
      planName, 
      amount, 
      currency, 
      orderId 
    } = body;

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
      return NextResponse.json(
        { success: false, error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;

    SecureLogger.info('Sending subscription confirmation email', {
      userId,
      userEmail,
      planName,
      orderId
    });

    // Prepare subscription data
    const subscriptionData = {
      planName: planName || 'Pro Plan',
      amount: amount || '2.00',
      currency: currency || 'USD',
      orderId: orderId || 'N/A',
      activationDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    // Generate email template
    const emailTemplate = subscriptionConfirmationEmailTemplate(
      userName || userEmail?.split('@')[0] || 'User',
      subscriptionData
    );

    // Send email
    const emailResult = await sendEmail({
      to: userEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    });

    if (emailResult.success) {
      SecureLogger.info('Subscription confirmation email sent successfully', {
        userId,
        userEmail,
        planName
      });

      return NextResponse.json({
        success: true,
        message: 'Subscription confirmation email sent successfully'
      });
    } else {
      SecureLogger.error('Failed to send subscription confirmation email', {
        userId,
        userEmail,
        error: emailResult.error
      });

      return NextResponse.json(
        { success: false, error: 'Failed to send confirmation email' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    SecureLogger.error('Subscription confirmation email error', {
      error: error.message,
      stack: error.stack?.substring(0, 500)
    });

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}