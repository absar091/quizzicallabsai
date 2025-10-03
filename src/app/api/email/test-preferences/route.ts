import { NextRequest, NextResponse } from 'next/server';
import { EmailAutomation } from '@/lib/email-automation';
import { checkEmailPreferences, getUserEmailPreferences } from '@/lib/email-preferences';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, emailType, action } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'check':
        if (!emailType) {
          return NextResponse.json(
            { success: false, error: 'Email type is required for check action' },
            { status: 400 }
          );
        }
        
        const checkResult = await checkEmailPreferences(email, emailType);
        return NextResponse.json({
          success: true,
          email,
          emailType,
          canSend: checkResult.canSend,
          reason: checkResult.reason
        });

      case 'get-preferences':
        const preferences = await getUserEmailPreferences(email);
        return NextResponse.json({
          success: true,
          email,
          preferences
        });

      case 'test-send':
        if (!emailType) {
          return NextResponse.json(
            { success: false, error: 'Email type is required for test send' },
            { status: 400 }
          );
        }

        // Send a test email based on type
        let result;
        switch (emailType) {
          case 'quizResults':
            const { sendAutomatedQuizResult } = await import('@/lib/email-automation');
            result = await sendAutomatedQuizResult(email, 'Test User', {
              topic: 'Test Quiz',
              score: 8,
              total: 10,
              percentage: 80,
              date: new Date().toLocaleDateString()
            });
            break;

          case 'studyReminders':
            const { sendAutomatedStudyReminder } = await import('@/lib/email-automation');
            result = await sendAutomatedStudyReminder(email, 'Test User', {
              lastActivity: '3 days ago',
              weakAreas: ['Mathematics', 'Science'],
              streakDays: 5
            });
            break;

          case 'promotions':
            const { sendAutomatedWelcomeEmail } = await import('@/lib/email-automation');
            result = await sendAutomatedWelcomeEmail(email, 'Test User', {
              planName: 'Free',
              signupDate: new Date().toLocaleDateString()
            });
            break;

          case 'loginAlerts':
            const { sendAutomatedLoginAlert } = await import('@/lib/email-automation');
            result = await sendAutomatedLoginAlert(email, 'Test User', {
              device: 'Chrome on Windows',
              location: 'New York, NY, USA',
              ipAddress: '192.168.1.1',
              time: new Date().toISOString()
            });
            break;

          default:
            return NextResponse.json(
              { success: false, error: 'Invalid email type for test send' },
              { status: 400 }
            );
        }

        return NextResponse.json({
          success: true,
          email,
          emailType,
          result
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use: check, get-preferences, or test-send' },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error('Email preferences test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to test email preferences'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { success: false, error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  try {
    const preferences = await getUserEmailPreferences(email);
    const eligibility = {
      quizResults: await EmailAutomation.canUserReceiveEmail(email, 'quizResults'),
      studyReminders: await EmailAutomation.canUserReceiveEmail(email, 'studyReminders'),
      loginAlerts: await EmailAutomation.canUserReceiveEmail(email, 'loginAlerts'),
      promotions: await EmailAutomation.canUserReceiveEmail(email, 'promotions'),
      newsletters: await EmailAutomation.canUserReceiveEmail(email, 'newsletters')
    };

    return NextResponse.json({
      success: true,
      email,
      preferences,
      eligibility
    });

  } catch (error: any) {
    console.error('Error getting email preferences:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get email preferences'
      },
      { status: 500 }
    );
  }
}