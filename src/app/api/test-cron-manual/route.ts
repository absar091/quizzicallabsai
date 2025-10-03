import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Manual cron test started...');

    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      return NextResponse.json({
        success: false,
        error: 'CRON_SECRET not configured'
      }, { status: 500 });
    }

    // Test the cron endpoint with the correct secret
    const baseUrl = request.nextUrl.origin;
    const testUrl = `${baseUrl}/api/cron/send-reminders`;
    
    console.log('🔗 Testing URL:', testUrl);
    console.log('🔑 Using CRON_SECRET:', cronSecret.substring(0, 10) + '...');

    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { rawResponse: responseText };
    }

    console.log('📊 Response status:', response.status);
    console.log('📊 Response data:', responseData);

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      cronSecret: cronSecret.substring(0, 10) + '...',
      testUrl,
      response: responseData,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Manual cron test failed:', error);
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
    const { testType = 'reminders' } = body;

    console.log(`🧪 Manual cron test: ${testType}`);

    const cronSecret = process.env.CRON_SECRET;
    const baseUrl = request.nextUrl.origin;
    
    let testUrl;
    switch (testType) {
      case 'reminders':
        testUrl = `${baseUrl}/api/cron/send-reminders`;
        break;
      case 'main':
        testUrl = `${baseUrl}/api/cron?type=reminders`;
        break;
      case 'test':
        testUrl = `${baseUrl}/api/cron/test`;
        break;
      default:
        testUrl = `${baseUrl}/api/cron?type=test`;
    }

    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json'
      }
    });

    const responseData = await response.json();

    return NextResponse.json({
      success: response.ok,
      testType,
      status: response.status,
      testUrl,
      response: responseData,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Manual cron test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}