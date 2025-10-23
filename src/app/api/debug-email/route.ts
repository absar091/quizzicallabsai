import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userName, testType } = await request.json();
    
    console.log('🧪 Debug email test:', { userEmail, userName, testType });

    let response;
    
    switch (testType) {
      case 'welcome':
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
        response = await fetch(`${baseUrl}/api/notifications/welcome`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idToken: 'debug-token',
            userEmail,
            userName
          })
        });
        break;
        
      case 'quiz-result':
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
        response = await fetch(`${baseUrl}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'quiz-result',
            to: userEmail,
            userName,
            topic: 'Debug Test Quiz',
            score: 8,
            total: 10,
            percentage: 80,
            timeTaken: 300,
            date: new Date().toISOString()
          })
        });
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid test type' }, { status: 400 });
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Debug email test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email debug endpoint',
    usage: 'POST with { userEmail, userName, testType }'
  });
}