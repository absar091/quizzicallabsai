import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, sendQuizResultEmail, sendWelcomeEmail, sendStudyReminderEmail } from '@/lib/email';

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
        result = await sendWelcomeEmail(to, data.userName);
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
          { success: false, error: 'Invalid email type. Use: quiz-result, welcome, study-reminder, or custom' },
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