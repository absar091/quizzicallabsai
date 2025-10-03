import { NextRequest, NextResponse } from 'next/server';
import { 
  quizResultEmailTemplate, 
  welcomeEmailTemplate, 
  studyReminderEmailTemplate, 
  loginNotificationEmailTemplate 
} from '@/lib/email-templates-professional';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type') || 'all';
  
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
      device: 'Desktop Computer',
      location: 'Karachi, Pakistan',
      ipAddress: '39.50.139.118',
      time: new Date().toLocaleString()
    }
  };

  try {
    let templates: any = {};

    if (type === 'all' || type === 'quiz') {
      templates.quizResult = quizResultEmailTemplate(sampleData.userName, sampleData.quizData);
    }

    if (type === 'all' || type === 'welcome') {
      templates.welcome = welcomeEmailTemplate(sampleData.userName, sampleData.emailDetails);
    }

    if (type === 'all' || type === 'reminder') {
      templates.reminder = studyReminderEmailTemplate(sampleData.userName, sampleData.reminderData);
    }

    if (type === 'all' || type === 'security') {
      templates.security = loginNotificationEmailTemplate(sampleData.userName, sampleData.loginData);
    }

    if (type !== 'all') {
      const template = templates[type];
      if (template) {
        return new NextResponse(template.html, {
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }

    // Return all templates as JSON for comparison
    return NextResponse.json({
      success: true,
      templates,
      sampleData,
      availableTypes: ['quiz', 'welcome', 'reminder', 'security'],
      usage: 'Add ?type=quiz|welcome|reminder|security to preview individual templates'
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}