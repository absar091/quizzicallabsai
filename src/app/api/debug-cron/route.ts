import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug cron job environment...');
    
    // Check environment variables
    const envCheck = {
      CRON_SECRET: !!process.env.CRON_SECRET,
      SMTP_HOST: !!process.env.SMTP_HOST,
      SMTP_USER: !!process.env.SMTP_USER,
      SMTP_PASS: !!process.env.SMTP_PASS,
      FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
      NODE_ENV: process.env.NODE_ENV
    };

    console.log('Environment check:', envCheck);

    // Check headers
    const authHeader = request.headers.get('Authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
    
    console.log('Auth header:', authHeader);
    console.log('Expected auth:', expectedAuth);
    console.log('Auth match:', authHeader === expectedAuth);

    // Test basic functionality
    const testResult = {
      timestamp: new Date().toISOString(),
      environment: envCheck,
      authentication: {
        headerPresent: !!authHeader,
        secretConfigured: !!process.env.CRON_SECRET,
        authMatch: authHeader === expectedAuth
      },
      url: request.url,
      method: request.method
    };

    return NextResponse.json({
      success: true,
      message: 'Debug information collected',
      data: testResult
    });

  } catch (error: any) {
    console.error('❌ Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}