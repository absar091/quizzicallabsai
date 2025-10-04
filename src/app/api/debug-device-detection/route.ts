import { NextRequest, NextResponse } from 'next/server';
import { detectDeviceInfo } from '@/lib/device-detection';
import { loginCredentialsManager } from '@/lib/login-credentials';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'test-user-123';
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    
    // Get real IP address
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const clientIP = request.headers.get('x-client-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIP || clientIP || '39.50.139.118';

    console.log('🧪 Debug Device Detection Test');
    console.log('User ID:', userId);
    console.log('User Agent:', userAgent);
    console.log('IP Address:', ipAddress);

    // Detect current device info
    const currentDeviceInfo = await detectDeviceInfo(userAgent, ipAddress);
    console.log('Current Device Info:', currentDeviceInfo);

    // Get stored credentials
    const storedCredentials = await loginCredentialsManager.getLoginCredentials(userId);
    console.log('Stored Credentials:', storedCredentials);

    // Check if notification should be sent
    const shouldNotify = await loginCredentialsManager.shouldSendNotification(userId, currentDeviceInfo);
    console.log('Should Send Notification:', shouldNotify);

    // Get login stats
    const loginStats = await loginCredentialsManager.getLoginStats(userId);
    console.log('Login Stats:', loginStats);

    return NextResponse.json({
      success: true,
      debug: {
        userId,
        userAgent,
        ipAddress,
        currentDeviceInfo,
        storedCredentials,
        shouldSendNotification: shouldNotify,
        loginStats,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ Debug device detection error:', error);
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
    const { userId = 'test-user-123', action = 'simulate-login' } = body;
    
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const clientIP = request.headers.get('x-client-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIP || clientIP || '39.50.139.118';

    console.log('🧪 Debug Device Detection Action:', action);

    if (action === 'simulate-login') {
      // Simulate a login
      const deviceInfo = await detectDeviceInfo(userAgent, ipAddress);
      
      // Check if notification should be sent BEFORE storing
      const shouldNotifyBefore = await loginCredentialsManager.shouldSendNotification(userId, deviceInfo);
      
      // Store the login
      await loginCredentialsManager.storeLoginCredentials(userId, deviceInfo);
      
      // Check again after storing
      const shouldNotifyAfter = await loginCredentialsManager.shouldSendNotification(userId, deviceInfo);
      
      return NextResponse.json({
        success: true,
        message: 'Login simulated successfully',
        results: {
          deviceInfo,
          shouldNotifyBefore,
          shouldNotifyAfter,
          timestamp: new Date().toISOString()
        }
      });
    }

    if (action === 'clear-credentials') {
      await loginCredentialsManager.clearUserCredentials(userId);
      return NextResponse.json({
        success: true,
        message: 'User credentials cleared successfully'
      });
    }

    if (action === 'get-trusted-devices') {
      const trustedDevices = await loginCredentialsManager.getTrustedDevices(userId);
      return NextResponse.json({
        success: true,
        trustedDevices
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Unknown action'
    }, { status: 400 });

  } catch (error: any) {
    console.error('❌ Debug device detection POST error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}