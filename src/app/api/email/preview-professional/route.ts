import { NextRequest, NextResponse } from 'next/server';
import {
  quizResultEmailTemplate,
  welcomeEmailTemplate,
  studyReminderEmailTemplate,
  loginNotificationEmailTemplate
} from '@/lib/email-templates-professional';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'quiz-result';
  const format = searchParams.get('format') || 'html';

  try {
    let template;
    
    switch (type) {
      case 'quiz-result':
        template = quizResultEmailTemplate('John Doe', {
          quizTitle: 'Advanced Machine Learning Concepts',
          score: '87',
          correct: '13',
          incorrect: '2',
          date: new Date().toLocaleDateString()
        });
        break;
        
      case 'welcome':
        template = welcomeEmailTemplate('Sarah Johnson', {
          userEmail: 'sarah.johnson@example.com',
          planName: 'Professional',
          signupDate: new Date().toLocaleDateString()
        });
        break;
        
      case 'study-reminder':
        template = studyReminderEmailTemplate('Alex Chen', {
          lastActivity: '4 days ago',
          weakAreas: ['Data Structures', 'Algorithms', 'System Design'],
          streakDays: 12
        });
        break;
        
      case 'login-alert':
        template = loginNotificationEmailTemplate('Maria Rodriguez', {
          device: 'Chrome on macOS',
          location: 'San Francisco, CA, USA',
          ipAddress: '192.168.1.100',
          time: new Date().toLocaleString()
        });
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid template type. Use: quiz-result, welcome, study-reminder, login-alert' },
          { status: 400 }
        );
    }

    if (format === 'html') {
      return new Response(template.html, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    } else {
      return NextResponse.json({
        success: true,
        type,
        subject: template.subject,
        html: template.html,
        text: template.text
      });
    }

  } catch (error: any) {
    console.error('Error generating email preview:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, userData, format = 'html' } = body;

    if (!type || !userData) {
      return NextResponse.json(
        { error: 'Type and userData are required' },
        { status: 400 }
      );
    }

    let template;
    
    switch (type) {
      case 'quiz-result':
        template = quizResultEmailTemplate(userData.userName, userData.quizData);
        break;
        
      case 'welcome':
        template = welcomeEmailTemplate(userData.userName, userData.emailDetails);
        break;
        
      case 'study-reminder':
        template = studyReminderEmailTemplate(userData.userName, userData.reminderData);
        break;
        
      case 'login-alert':
        template = loginNotificationEmailTemplate(userData.userName, userData.loginData);
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid template type' },
          { status: 400 }
        );
    }

    if (format === 'html') {
      return new Response(template.html, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    } else {
      return NextResponse.json({
        success: true,
        type,
        subject: template.subject,
        html: template.html,
        text: template.text
      });
    }

  } catch (error: any) {
    console.error('Error generating custom email preview:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}