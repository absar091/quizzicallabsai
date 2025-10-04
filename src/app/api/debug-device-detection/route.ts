import { NextRequest, NextResponse } from 'next/server';
import { detectDeviceInfo, shouldSendLoginNotification } from '@/lib/device-detection';
import { LoginCredentialsManager } from '@/lib/login-credentials';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId parameter required' },
        { status: 400 }
      );
    }

    // Get current device info
    const userAgent = request.headers.get('user-agent') || '';
    const xForwardedFor = request.headers.get('x-forwarded-for');
    const xRealIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    
    const ipAddress = cfConnectingIp || xRealIp || xForwardedFor?.split(',')[0] || 'unknown';

    const currentDeviceInfo = await detectDeviceInfo(userAgent, ipAddress);
    
    // Get stored credentials
    const credentialsManager = LoginCredentialsManager.getInstance();
    const storedCredentials = await credentialsManager.getStoredCredentials(userId);
    
    // Check if notification should be sent
    const shouldSendNotification = shouldSendLoginNotification(currentDeviceInfo, storedCredentials);

    // Calculate login stats
    const loginStats = {
      totalLogins: storedCredentials.length,
      uniqueDevices: new Set(storedCredentials.map(c => c.deviceFingerprint)).size,
      uniqueLocations: new Set(storedCredentials.map(c => c.location)).size,
      lastLogin: storedCredentials.length > 0 ? storedCredentials[storedCredentials.length - 1].timestamp : null
    };

    return NextResponse.json({
      success: true,
      debug: {
        currentDeviceInfo,
        storedCredentials,
        shouldSendNotification,
        loginStats
      }
    });

  } catch (error: any) {
    console.error('❌ Debug device detection error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Debug failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId required' },
        { status: 400 }
      );
    }

    if (action === 'simulate-login') {
      // Simulate a login from current device
      const userAgent = request.headers.get('user-agent') || '';
      const xForwardedFor = request.headers.get('x-forwarded-for');
      const xRealIp = request.headers.get('x-real-ip');
      const cfConnectingIp = request.headers.get('cf-connecting-ip');
      
      const ipAddress = cfConnectingIp || xRealIp || xForwardedFor?.split(',')[0] || 'unknown';

      const deviceInfo = await detectDeviceInfo(userAgent, ipAddress);
      
      // Get stored credentials before
      const credentialsManager = LoginCredentialsManager.getInstance();
      const credentialsBefore = await credentialsManager.getStoredCredentials(userId);
      const shouldNotifyBefore = shouldSendLoginNotification(deviceInfo, credentialsBefore);
      
      // Store the login
      await credentialsManager.storeLoginCredentials(userId, deviceInfo);
      
      // Get stored credentials after
      const credentialsAfter = await credentialsManager.getStoredCredentials(userId);
      const shouldNotifyAfter = shouldSendLoginNotification(deviceInfo, credentialsAfter);

      return NextResponse.json({
        success: true,
        message: 'Login simulated successfully',
        results: {
          deviceInfo,
          shouldNotifyBefore,
          shouldNotifyAfter,
          credentialsCountBefore: credentialsBefore.length,
          credentialsCountAfter: credentialsAfter.length
        }
      });

    } else if (action === 'clear-credentials') {
      // Clear all stored credentials
      const credentialsManager = LoginCredentialsManager.getInstance();
      await credentialsManager.clearStoredCredentials(userId);

      return NextResponse.json({
        success: true,
        message: 'All stored credentials cleared'
      });

    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Use "simulate-login" or "clear-credentials"' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('❌ Debug device detection POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Debug action failed' },
      { status: 500 }
    );
  }
}