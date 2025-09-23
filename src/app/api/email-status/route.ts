import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const emailConfig = {
      smtpHost: process.env.SMTP_HOST,
      smtpPort: process.env.SMTP_PORT,
      smtpUser: process.env.SMTP_USER,
      emailFrom: process.env.EMAIL_FROM,
      hasSmtpPass: !!process.env.SMTP_PASS,
      nodeEnv: process.env.NODE_ENV,
      cronSecret: !!process.env.CRON_SECRET
    };

    // Check if all required email config is present
    const missingConfig = [];
    if (!emailConfig.smtpHost) missingConfig.push('SMTP_HOST');
    if (!emailConfig.smtpPort) missingConfig.push('SMTP_PORT');
    if (!emailConfig.smtpUser) missingConfig.push('SMTP_USER');
    if (!emailConfig.hasSmtpPass) missingConfig.push('SMTP_PASS');
    if (!emailConfig.emailFrom) missingConfig.push('EMAIL_FROM');

    const status = {
      emailConfigured: missingConfig.length === 0,
      missingConfig,
      config: emailConfig,
      endpoints: {
        sendEmail: '/api/send-email',
        welcomeNotification: '/api/notifications/welcome',
        reminderNotification: '/api/notifications/reminder',
        cronJob: '/api/cron'
      },
      automaticEmails: {
        welcomeEmail: {
          status: 'Configured',
          trigger: 'New user signup in AuthContext',
          endpoint: '/api/notifications/welcome',
          notes: 'Triggered automatically when isNewUser is true'
        },
        quizResultEmail: {
          status: 'Configured',
          trigger: 'Quiz completion in generate-quiz page',
          endpoint: '/api/send-email (type: quiz-result)',
          notes: 'Sent after quiz submission'
        },
        reminderEmail: {
          status: 'Partially Configured',
          trigger: 'Cron job (needs external scheduler)',
          endpoint: '/api/cron?type=daily',
          notes: 'Requires external cron service like Vercel Cron or GitHub Actions'
        }
      },
      troubleshooting: [
        'Check that Gmail 2FA is enabled and app password is used (not regular password)',
        'Verify SMTP_PASS is the 16-character app password from Gmail',
        'Check spam folder for test emails',
        'Monitor browser console for error messages',
        'For reminder emails, set up external cron job to call /api/cron?type=daily'
      ]
    };

    return NextResponse.json(status);

  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to check email status',
      details: error.message
    }, { status: 500 });
  }
}