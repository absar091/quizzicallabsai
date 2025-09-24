import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, sendQuizResultEmail, sendWelcomeEmail, sendStudyReminderEmail, sendEmailVerificationEmail, sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, to, ...data } = body;

    console.log('📧 Email API called:', { type, to: to?.substring(0, 20) + '...' });

    if (!to || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: to, type' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'quiz-result':
        if (!data.userName || !data.topic || data.score === undefined) {
          return NextResponse.json(
            { success: false, error: 'Missing quiz result data' },
            { status: 400 }
          );
        }
        result = await sendQuizResultEmail(to, data);
        break;

      case 'welcome':
        if (!data.userName) {
          return NextResponse.json(
            { success: false, error: 'Missing userName for welcome email' },
            { status: 400 }
          );
        }
        result = await sendWelcomeEmail(to, data.userName, {
          userEmail: data.userEmail || to,
          accountType: data.accountType || 'Free',
          signUpDate: data.signUpDate || new Date().toLocaleDateString(),
          preferredLanguage: data.preferredLanguage || 'English'
        });
        break;

      case 'study-reminder':
        if (!data.userName) {
          return NextResponse.json(
            { success: false, error: 'Missing userName for reminder email' },
            { status: 400 }
          );
        }
        result = await sendStudyReminderEmail(to, data.userName);
        break;

      case 'email-verification':
        if (!data.userName || !data.verificationLink) {
          return NextResponse.json(
            { success: false, error: 'Missing userName or verificationLink for verification email' },
            { status: 400 }
          );
        }
        result = await sendEmailVerificationEmail(to, data.userName, data.verificationLink);
        break;

      case 'password-reset':
        if (!data.userName || !data.resetLink) {
          return NextResponse.json(
            { success: false, error: 'Missing userName or resetLink for password reset email' },
            { status: 400 }
          );
        }
        result = await sendPasswordResetEmail(to, data.userName, data.resetLink);
        break;

      case 'custom':
        if (!data.subject || !data.html) {
          return NextResponse.json(
            { success: false, error: 'Missing subject or html for custom email' },
            { status: 400 }
          );
        }
        result = await sendEmail({
          to,
          subject: data.subject,
          html: data.html,
          text: data.text
        });
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid email type. Use: quiz-result, welcome, study-reminder, email-verification, password-reset, or custom' },
          { status: 400 }
        );
    }

    console.log('✅ Email sent successfully:', result.messageId);
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully!',
      messageId: result.messageId
    });

  } catch (error: any) {
    console.error('❌ Email sending failed:', error);
    
    let errorMessage = 'Failed to send email';
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check SMTP credentials.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Failed to connect to email server. Please check network connection.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}