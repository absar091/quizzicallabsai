import { NextRequest, NextResponse } from 'next/server';
import { getTransporter, getFromAddress } from '@/lib/email-config';

export async function POST(request: NextRequest) {
  try {
    const { testEmail } = await request.json();
    
    if (!testEmail) {
      return NextResponse.json({ error: 'Test email required' }, { status: 400 });
    }

    const results = [];

    // Test Verification SMTP Service
    try {
      const verificationTransporter = getTransporter('verification');
      const verificationFrom = getFromAddress('verification');
      
      await verificationTransporter.sendMail({
        from: verificationFrom,
        to: testEmail,
        subject: 'SMTP Test - Verification Service',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #4f46e5;">Verification SMTP Test</h2>
            <p><strong>Service:</strong> Verification Email Service</p>
            <p><strong>SMTP User:</strong> ${process.env.SMTP_USER}</p>
            <p><strong>From Address:</strong> ${verificationFrom}</p>
            <p><strong>Status:</strong> ✅ Working</p>
            <p>This email was sent using the verification SMTP service (ahmadraoabsar@gmail.com)</p>
          </div>
        `,
        text: `Verification SMTP Test - Service is working correctly`
      });
      
      results.push({
        service: 'verification',
        status: 'success',
        smtpUser: process.env.SMTP_USER,
        fromAddress: verificationFrom
      });
    } catch (error: any) {
      results.push({
        service: 'verification',
        status: 'failed',
        error: error.message,
        smtpUser: process.env.SMTP_USER
      });
    }

    // Test Marketing SMTP Service
    try {
      const marketingTransporter = getTransporter('marketing');
      const marketingFrom = getFromAddress('marketing');
      
      await marketingTransporter.sendMail({
        from: marketingFrom,
        to: testEmail,
        subject: 'SMTP Test - Marketing Service',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #7c4dff;">Marketing SMTP Test</h2>
            <p><strong>Service:</strong> Marketing Email Service</p>
            <p><strong>SMTP User:</strong> ${process.env.WELCOME_SMTP_USER}</p>
            <p><strong>From Address:</strong> ${marketingFrom}</p>
            <p><strong>Status:</strong> ✅ Working</p>
            <p>This email was sent using the marketing SMTP service (quizzicallabs.ai@gmail.com)</p>
          </div>
        `,
        text: `Marketing SMTP Test - Service is working correctly`
      });
      
      results.push({
        service: 'marketing',
        status: 'success',
        smtpUser: process.env.WELCOME_SMTP_USER,
        fromAddress: marketingFrom
      });
    } catch (error: any) {
      results.push({
        service: 'marketing',
        status: 'failed',
        error: error.message,
        smtpUser: process.env.WELCOME_SMTP_USER
      });
    }

    return NextResponse.json({
      success: true,
      message: 'SMTP services tested',
      results,
      configuration: {
        verification: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER,
          from: process.env.EMAIL_FROM
        },
        marketing: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.WELCOME_SMTP_USER,
          from: process.env.WELCOME_EMAIL_FROM
        }
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}