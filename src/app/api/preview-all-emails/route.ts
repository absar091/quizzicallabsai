import { NextRequest, NextResponse } from 'next/server';
import { 
  quizResultEmailTemplate, 
  welcomeEmailTemplate, 
  studyReminderEmailTemplate, 
  loginNotificationEmailTemplate 
} from '@/lib/email-templates-professional';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type') || 'security';
  
  const sampleData = {
    userName: 'Ahmad Rao',
    quizData: {
      quizTitle: 'Advanced JavaScript Concepts',
      score: 85,
      correct: '17',
      incorrect: '3',
      date: new Date().toLocaleDateString()
    },
    emailDetails: {
      userEmail: 'ahmad@example.com',
      planName: 'Pro',
      signupDate: new Date().toLocaleDateString()
    },
    reminderData: {
      lastActivity: '3 days ago',
      weakAreas: ['Async/Await', 'Closures', 'Prototypes'],
      streakDays: 12
    },
    loginData: {
      device: 'Windows Computer',
      browser: 'Google Chrome',
      location: 'Vehari, Punjab, Pakistan',
      ipAddress: '39.50.139.118',
      time: new Date().toLocaleString('en-US', { 
        timeZone: 'Asia/Karachi', 
        dateStyle: 'full', 
        timeStyle: 'medium' 
      })
    }
  };

  try {
    let template;

    switch (type) {
      case 'quiz':
        template = quizResultEmailTemplate(sampleData.userName, sampleData.quizData);
        break;
      case 'welcome':
        template = welcomeEmailTemplate(sampleData.userName, sampleData.emailDetails);
        break;
      case 'reminder':
        template = studyReminderEmailTemplate(sampleData.userName, sampleData.reminderData);
        break;
      case 'security':
      default:
        template = loginNotificationEmailTemplate(sampleData.userName, sampleData.loginData);
        break;
    }

    return new NextResponse(template.html, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      availableTypes: ['quiz', 'welcome', 'reminder', 'security'],
      usage: 'Add ?type=quiz|welcome|reminder|security to preview different templates'
    }, { status: 500 });
  }
}