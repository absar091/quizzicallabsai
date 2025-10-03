import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing cron job setup...');

    // Test environment variables
    const envCheck = {
      CRON_SECRET: !!process.env.CRON_SECRET,
      SMTP_HOST: !!process.env.SMTP_HOST,
      SMTP_USER: !!process.env.SMTP_USER,
      SMTP_PASS: !!process.env.SMTP_PASS,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    };

    console.log('🔧 Environment check:', envCheck);

    // Test Firebase connection
    let firebaseTest = false;
    try {
      const { firestore } = await import('@/lib/firebase');
      const { collection, limit, query, getDocs } = await import('firebase/firestore');
      
      const testQuery = query(collection(firestore, 'users'), limit(1));
      const testSnapshot = await getDocs(testQuery);
      firebaseTest = true;
      console.log('✅ Firebase connection successful');
    } catch (error) {
      console.error('❌ Firebase connection failed:', error);
    }

    // Test email automation import
    let emailAutomationTest = false;
    try {
      const { EmailAutomation } = await import('@/lib/email-automation');
      emailAutomationTest = !!EmailAutomation;
      console.log('✅ Email automation import successful');
    } catch (error) {
      console.error('❌ Email automation import failed:', error);
    }

    // Test email templates import
    let emailTemplatesTest = false;
    try {
      const { studyReminderEmailTemplate } = await import('@/lib/email-templates');
      emailTemplatesTest = !!studyReminderEmailTemplate;
      console.log('✅ Email templates import successful');
    } catch (error) {
      console.error('❌ Email templates import failed:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Cron job test completed',
      checks: {
        environment: envCheck,
        firebase: firebaseTest,
        emailAutomation: emailAutomationTest,
        emailTemplates: emailTemplatesTest
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Cron test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testEmail } = body;

    if (!testEmail) {
      return NextResponse.json(
        { success: false, error: 'testEmail is required' },
        { status: 400 }
      );
    }

    console.log(`🧪 Testing email sending to: ${testEmail}`);

    // Test sending a study reminder email
    const { sendAutomatedStudyReminder } = await import('@/lib/email-automation');
    
    const result = await sendAutomatedStudyReminder(testEmail, 'Test User', {
      lastActivity: '3 days ago',
      weakAreas: ['Mathematics', 'Science'],
      streakDays: 5
    });

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Test email failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}