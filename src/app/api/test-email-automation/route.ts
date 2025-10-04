import { NextRequest, NextResponse } from 'next/server';
import { EmailAutomation } from '@/lib/email-automation';
import { checkEmailPreferences, getUserEmailPreferences } from '@/lib/email-preferences';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'furqanrao091@gmail.com';
    const emailType = searchParams.get('type') || 'studyReminders';
    
    console.log(`🧪 Testing email automation for: ${email} (${emailType})`);
    
    // Test 1: Check if user can receive this email type
    const canReceive = await EmailAutomation.canUserReceiveEmail(email, emailType as any);
    console.log(`📧 Can receive ${emailType}:`, canReceive);
    
    // Test 2: Get detailed preference check
    const preferenceCheck = await checkEmailPreferences(email, emailType as any);
    console.log('🔍 Preference check result:', preferenceCheck);
    
    // Test 3: Get user preferences
    const userPrefs = await getUserEmailPreferences(email);
    console.log('👤 User preferences:', userPrefs);
    
    // Test 4: Test sending a study reminder (dry run)
    let sendResult = null;
    if (emailType === 'studyReminders') {
      try {
        const { studyReminderEmailTemplate } = await import('@/lib/email-templates-professional');
        const template = studyReminderEmailTemplate('Test User', {
          lastActivity: '3 days ago',
          weakAreas: ['Mathematics', 'Physics'],
          streakDays: 5
        });
        
        // Don't actually send, just test the automation logic
        console.log('📧 Would send email with template:', {
          subject: template.subject,
          hasHtml: !!template.html,
          hasText: !!template.text
        });
        
        sendResult = {
          wouldSend: preferenceCheck.canSend,
          reason: preferenceCheck.reason,
          template: {
            subject: template.subject,
            htmlLength: template.html?.length || 0,
            textLength: template.text?.length || 0
          }
        };
      } catch (error: any) {
        sendResult = { error: error.message };
      }
    }
    
    return NextResponse.json({
      success: true,
      email,
      emailType,
      tests: {
        canReceiveEmail: canReceive,
        preferenceCheck,
        userPreferences: userPrefs,
        sendTest: sendResult
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Email automation test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email = 'furqanrao091@gmail.com', 
      emailType = 'studyReminders',
      actualSend = false 
    } = body;
    
    console.log(`🧪 Testing email send for: ${email} (${emailType})`);
    console.log(`📧 Actually send email: ${actualSend}`);
    
    if (!actualSend) {
      return NextResponse.json({
        success: false,
        message: 'Set actualSend: true to actually send test email',
        email,
        emailType
      });
    }
    
    let result = null;
    
    switch (emailType) {
      case 'studyReminders':
        const { sendAutomatedStudyReminder } = await import('@/lib/email-automation');
        result = await sendAutomatedStudyReminder(email, 'Test User', {
          lastActivity: '3 days ago',
          weakAreas: ['Mathematics', 'Physics'],
          streakDays: 5
        });
        break;
        
      case 'quizResults':
        const { sendAutomatedQuizResult } = await import('@/lib/email-automation');
        result = await sendAutomatedQuizResult(email, 'Test User', {
          topic: 'Sample Quiz',
          score: 8,
          total: 10,
          percentage: 80,
          date: new Date().toLocaleDateString()
        });
        break;
        
      case 'loginAlerts':
        const { sendAutomatedLoginAlert } = await import('@/lib/email-automation');
        result = await sendAutomatedLoginAlert(email, 'Test User', {
          device: 'Chrome on Windows',
          location: 'Vehari, Pakistan',
          ipAddress: '192.168.1.1',
          time: new Date().toLocaleString()
        });
        break;
        
      default:
        throw new Error(`Unsupported email type: ${emailType}`);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      email,
      emailType,
      result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Email send test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}