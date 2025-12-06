// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { sendStudyReminderEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userName } = await request.json();

    if (!userEmail || !userName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userEmail, userName' },
        { status: 400 }
      );
    }

    console.log('📧 Sending study reminder email to:', userEmail);

    // Send study reminder email
    const result = await sendStudyReminderEmail(userEmail, userName);

    console.log('✅ Study reminder email sent successfully:', result.messageId);

    return NextResponse.json({
      success: true,
      message: 'Study reminder email sent successfully!',
      messageId: result.messageId
    });

  } catch (error: any) {
    console.error('❌ Study reminder email failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send study reminder email'
    }, { status: 500 });
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'Study reminder endpoint. Use POST with { "userEmail": "email@example.com", "userName": "User Name" }'
  });
}