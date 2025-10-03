import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const testEmail = 'test@example.com';
    
    console.log('🧪 Testing email preferences API...');
    
    // Test 1: Get default preferences
    console.log('📖 Testing GET preferences...');
    const getResponse = await fetch(`${request.nextUrl.origin}/api/email/preferences?email=${testEmail}`);
    const getResult = await getResponse.json();
    
    console.log('GET result:', getResult);
    
    // Test 2: Update preferences
    console.log('📝 Testing POST preferences...');
    const postResponse = await fetch(`${request.nextUrl.origin}/api/email/preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testEmail,
        preferences: {
          quizResults: true,
          studyReminders: false,
          loginAlerts: true,
          promotions: false,
          newsletters: true
        }
      })
    });
    
    const postResult = await postResponse.json();
    console.log('POST result:', postResult);
    
    // Test 3: Get updated preferences
    console.log('📖 Testing GET updated preferences...');
    const getUpdatedResponse = await fetch(`${request.nextUrl.origin}/api/email/preferences?email=${testEmail}`);
    const getUpdatedResult = await getUpdatedResponse.json();
    
    console.log('GET updated result:', getUpdatedResult);
    
    return NextResponse.json({
      success: true,
      message: 'Email preferences test completed',
      tests: {
        getDefault: {
          status: getResponse.status,
          result: getResult
        },
        updatePreferences: {
          status: postResponse.status,
          result: postResult
        },
        getUpdated: {
          status: getUpdatedResponse.status,
          result: getUpdatedResult
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Email preferences test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}