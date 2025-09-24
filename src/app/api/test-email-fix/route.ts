import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing email fix...');
    
    // Test nodemailer import
    const nodemailer = await import('nodemailer');
    console.log('📧 Nodemailer import test:', {
      hasDefault: !!nodemailer.default,
      hasCreateTransporter: !!(nodemailer.default?.createTransporter || nodemailer.createTransporter),
      type: typeof nodemailer.default
    });
    
    // Test environment variables
    const envCheck = {
      SMTP_HOST: !!process.env.SMTP_HOST,
      SMTP_USER: !!process.env.SMTP_USER,
      SMTP_PASS: !!process.env.SMTP_PASS,
      EMAIL_FROM: !!process.env.EMAIL_FROM
    };
    console.log('🔧 Environment variables:', envCheck);
    
    // Test transporter creation
    const mailer = nodemailer.default || nodemailer;
    if (typeof mailer.createTransporter !== 'function') {
      throw new Error('createTransporter is not a function');
    }
    
    const testTransporter = mailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    
    console.log('✅ Transporter created successfully');
    
    // Test connection (optional)
    await testTransporter.verify();
    console.log('✅ SMTP connection verified');
    
    return NextResponse.json({
      success: true,
      message: 'Email system is working correctly',
      checks: {
        nodemailerImport: true,
        environmentVariables: envCheck,
        transporterCreation: true,
        smtpConnection: true
      }
    });
    
  } catch (error: any) {
    console.error('❌ Email test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        code: error.code,
        stack: error.stack?.split('\n').slice(0, 5)
      }
    }, { status: 500 });
  }
}