import { NextRequest, NextResponse } from 'next/server';
import { detectDeviceInfo } from '@/lib/device-detection';

export async function GET(request: NextRequest) {
  try {
    // Get real IP and user agent
    const userAgent = request.headers.get('user-agent') || 'Unknown User Agent';
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const clientIP = request.headers.get('x-client-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIP || clientIP || '39.50.139.118'; // Use your IP as fallback

    console.log('🔍 Testing device detection...');
    console.log('User Agent:', userAgent);
    console.log('IP Address:', ipAddress);

    // Test device detection
    const deviceInfo = await detectDeviceInfo(userAgent, ipAddress);

    // Also test with a few sample user agents
    const testCases = [
      {
        name: 'Chrome on Windows',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ip: '39.50.139.118'
      },
      {
        name: 'Safari on iPhone',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        ip: '39.50.139.118'
      },
      {
        name: 'Firefox on Linux',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0',
        ip: '39.50.139.118'
      }
    ];

    const testResults = [];
    for (const testCase of testCases) {
      const result = await detectDeviceInfo(testCase.userAgent, testCase.ip);
      testResults.push({
        testCase: testCase.name,
        result
      });
    }

    return NextResponse.json({
      success: true,
      currentRequest: {
        userAgent,
        ipAddress,
        deviceInfo
      },
      testResults,
      headers: {
        'x-forwarded-for': forwardedFor,
        'x-real-ip': realIP,
        'x-client-ip': clientIP
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Device detection test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}