import { NextRequest, NextResponse } from 'next/server';
import { quizResultEmailTemplate } from '@/lib/email-templates-professional';

export async function GET(request: NextRequest) {
  try {
    // Generate a test email with logo
    const template = quizResultEmailTemplate('Test User', {
      quizTitle: 'Logo Test Quiz',
      score: '95',
      correct: '19',
      incorrect: '1',
      date: new Date().toLocaleDateString()
    });

    // Return the HTML for preview
    return new Response(template.html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error: any) {
    console.error('Error generating logo test:', error);
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
    const { testEmail } = body;

    if (!testEmail) {
      return NextResponse.json(
        { success: false, error: 'testEmail is required' },
        { status: 400 }
      );
    }

    // Send a test email to verify logo display
    const { sendEmail } = await import('@/lib/email');
    
    const template = quizResultEmailTemplate('Logo Test User', {
      quizTitle: 'Logo Display Test',
      score: '100',
      correct: '10',
      incorrect: '0',
      date: new Date().toLocaleDateString()
    });

    const result = await sendEmail({
      to: testEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });

    return NextResponse.json({
      success: true,
      message: 'Logo test email sent successfully',
      result,
      logoUrl: 'https://iili.io/K1oSsrx.png',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error sending logo test email:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}