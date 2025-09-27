import { NextRequest, NextResponse } from 'next/server';
import { sendLoginNotificationEmail } from '@/lib/email';
import { loginCredentialsManager } from '@/lib/login-credentials';
import { detectDeviceInfo, DeviceInfo } from '@/lib/device-detection';
import { auth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, userName, userAgent, idToken } = body;

    // Get real IP address from request headers (server-side)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const clientIP = request.headers.get('x-client-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIP || clientIP || 'Unknown';

    console.log('🌐 IP Detection:', { forwardedFor, realIP, clientIP, finalIP: ipAddress });

    // Verify the user token for security
    if (!idToken) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing authentication token' },
        { status: 401 }
      );
    }

    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Verify the email matches the token
    if (decodedToken.email !== userEmail) {
      return NextResponse.json(
        { error: 'Email mismatch - Security violation' },
        { status: 403 }
      );
    }

    // Get device information with real IP
    const deviceInfo = await detectDeviceInfo(userAgent || 'Server-side Request', ipAddress);

    // Check if we should send notification (only for untrusted devices)
    const shouldNotify = await loginCredentialsManager.shouldSendNotification(decodedToken.uid, deviceInfo);

    if (shouldNotify) {
      console.log('🔐 SENDING LOGIN NOTIFICATION - UNTRUSTED DEVICE DETECTED');

      // Prepare login data for email
      const loginData = {
        timestamp: new Date(deviceInfo.timestamp).toISOString(),
        browser: deviceInfo.browser,
        device: deviceInfo.device,
        location: `${deviceInfo.city}, ${deviceInfo.region}, ${deviceInfo.country}`,
        ipAddress: deviceInfo.ip,
        userAgent: userAgent || 'Unknown'
      };

      // Send login notification email using the fixed function
      const emailResult = await sendLoginNotificationEmail(userEmail, userName, loginData);

      console.log('✅ Login notification sent successfully for untrusted device');
    } else {
      console.log('✅ TRUSTED DEVICE DETECTED - No notification needed');
    }

    // Always store/update login credentials
    await loginCredentialsManager.storeLoginCredentials(decodedToken.uid, deviceInfo);
    console.log('✅ Login credentials stored/updated');

    return NextResponse.json({
      success: true,
      message: shouldNotify ? 'Login notification sent successfully' : 'Trusted device - no notification needed',
      deviceInfo: {
        device: deviceInfo.device,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        location: deviceInfo.location,
        ip: deviceInfo.ip,
        country: deviceInfo.country,
        city: deviceInfo.city,
        region: deviceInfo.region,
        timezone: deviceInfo.timezone
      }
    });

  } catch (error: any) {
    console.error('Login notification API error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to process login notification'
      },
      { status: 500 }
    );
  }
}
