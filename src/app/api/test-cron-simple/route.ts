import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Simple cron test starting...');
    
    // Test the main cron endpoint with proper auth
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      return NextResponse.json({
        success: false,
        error: 'CRON_SECRET not configured'
      }, { status: 500 });
    }

    // Create a test request to the cron endpoint
    const testUrl = new URL('/api/cron', request.url);
    testUrl.searchParams.set('type', 'reminders');
    
    const testRequest = new Request(testUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cronSecret}`
      }
    });

    // Import and call the cron handler directly
    const { GET: cronHandler } = await import('../cron/route');
    const cronResponse = await cronHandler(testRequest as NextRequest);
    const cronResult = await cronResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Cron test completed',
      cronResult,
      testInfo: {
        cronSecret: !!cronSecret,
        testUrl: testUrl.toString(),
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ Simple cron test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}