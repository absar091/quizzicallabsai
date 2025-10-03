import { NextRequest, NextResponse } from 'next/server';
import { detectDeviceInfo } from '@/lib/device-detection';
import { loginCredentialsManager } from '@/lib/login-credentials';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userAgent, testIP, testLocation } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    console.log('🧪 Testing login detection for user:', userId);

    // Get real IP from headers if not provided
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const clientIP = request.headers.get('x-client-ip');
    const ipAddress = testIP || forwardedFor?.split(',')[0] || realIP || clientIP || 'Unknown';

    console.log('🌐 Using IP address:', ipAddress);

    // Detect device info
    const deviceInfo = await detectDeviceInfo(
      userAgent || request.headers.get('user-agent') || 'Test Browser',
      ipAddress
    );

    console.log('📱 Detected device info:', deviceInfo);

    // Check if notification should be sent
    const shouldNotify = await loginCredentialsManager.shouldSendNotification(userId, deviceInfo);

    console.log('🔔 Should send notification:', shouldNotify);

    // Store the login credentials
    await loginCredentialsManager.storeLoginCredentials(userId, deviceInfo);

    // Get current stored credentials
    const storedCredentials = await loginCredentialsManager.getLoginCredentials(userId);

    return NextResponse.json({
      success: true,
      shouldNotify,
      deviceInfo,
      storedCredentials: storedCredentials.map(cred => ({
        id: cred.id,
        device: cred.device,
        browser: cred.browser,
        os: cred.os,
        ip: cred.ip,
        location: cred.location,
        country: cred.country,
        city: cred.city,
        isTrusted: cred.isTrusted,
        loginCount: cred.loginCount,
        lastLoginTime: cred.lastLoginTime
      })),
      message: shouldNotify ? 'New device/location detected - notification would be sent' : 'Trusted device - no notification needed'
    });

  } catch (error: any) {
    console.error('❌ Login detection test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'userId parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Get stored credentials for user
    const storedCredentials = await loginCredentialsManager.getLoginCredentials(userId);
    const loginStats = await loginCredentialsManager.getLoginStats(userId);

    return NextResponse.json({
      success: true,
      userId,
      credentialsCount: storedCredentials.length,
      loginStats,
      storedCredentials: storedCredentials.map(cred => ({
        id: cred.id,
        device: cred.device,
        browser: cred.browser,
        os: cred.os,
        ip: cred.ip,
        location: cred.location,
        country: cred.country,
        city: cred.city,
        isTrusted: cred.isTrusted,
        loginCount: cred.loginCount,
        firstLoginTime: cred.firstLoginTime,
        lastLoginTime: cred.lastLoginTime
      }))
    });

  } catch (error: any) {
    console.error('❌ Error getting login credentials:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'userId parameter is required' },
      { status: 400 }
    );
  }

  try {
    await loginCredentialsManager.clearUserCredentials(userId);

    return NextResponse.json({
      success: true,
      message: `Cleared all login credentials for user ${userId}`
    });

  } catch (error: any) {
    console.error('❌ Error clearing login credentials:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}