import { NextRequest, NextResponse } from 'next/server';
import { 
  loginNotificationEmailTemplate,
  welcomeEmailTemplate,
  studyReminderEmailTemplate,
  quizResultEmailTemplate
} from '@/lib/email-templates-professional';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const template = searchParams.get('template') || 'login';
    
    let emailTemplate;
    
    switch (template) {
      case 'login':
        emailTemplate = loginNotificationEmailTemplate('John Doe', {
          device: 'iPhone 15 Pro',
          browser: 'Safari 17.2',
          location: 'New York, NY, USA',
          ipAddress: '192.168.1.100',
          time: new Date().toLocaleString('en-US', { 
            timeZone: 'America/New_York', 
            dateStyle: 'full', 
            timeStyle: 'medium' 
          })
        });
        break;
        
      case 'welcome':
        emailTemplate = welcomeEmailTemplate('Sarah Johnson', {
          userEmail: 'sarah.johnson@example.com',
          planName: 'Pro',
          signupDate: new Date().toLocaleDateString()
        });
        break;
        
      case 'reminder':
        emailTemplate = studyReminderEmailTemplate('Alex Smith', {
          lastActivity: '5 days ago',
          weakAreas: ['Mathematics', 'Physics', 'Chemistry'],
          streakDays: 12
        });
        break;
        
      case 'quiz':
        emailTemplate = quizResultEmailTemplate('Emma Wilson', {
          quizTitle: 'Advanced Mathematics Quiz',
          score: '85',
          correct: '17',
          incorrect: '3',
          date: new Date().toLocaleDateString()
        });
        break;
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid template type. Use: login, welcome, reminder, or quiz'
        }, { status: 400 });
    }
    
    return new NextResponse(emailTemplate.html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
    
  } catch (error: any) {
    console.error('❌ Template preview error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { template = 'login', userName = 'Test User', ...templateData } = body;
    
    let emailTemplate;
    
    switch (template) {
      case 'login':
        emailTemplate = loginNotificationEmailTemplate(userName, {
          device: templateData.device || 'Desktop Computer',
          browser: templateData.browser || 'Google Chrome',
          location: templateData.location || 'Vehari, Punjab, Pakistan',
          ipAddress: templateData.ipAddress || '39.50.139.118',
          time: templateData.time || new Date().toLocaleString()
        });
        break;
        
      case 'welcome':
        emailTemplate = welcomeEmailTemplate(userName, {
          userEmail: templateData.userEmail || 'user@example.com',
          planName: templateData.planName || 'Free',
          signupDate: templateData.signupDate || new Date().toLocaleDateString()
        });
        break;
        
      case 'reminder':
        emailTemplate = studyReminderEmailTemplate(userName, {
          lastActivity: templateData.lastActivity || '3 days ago',
          weakAreas: templateData.weakAreas || ['Mathematics'],
          streakDays: templateData.streakDays || 0
        });
        break;
        
      case 'quiz':
        emailTemplate = quizResultEmailTemplate(userName, {
          quizTitle: templateData.quizTitle || 'Sample Quiz',
          score: templateData.score || '80',
          correct: templateData.correct || '8',
          incorrect: templateData.incorrect || '2',
          date: templateData.date || new Date().toLocaleDateString()
        });
        break;
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid template type'
        }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      template: template,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    });
    
  } catch (error: any) {
    console.error('❌ Template generation error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}