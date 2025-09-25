import { NextRequest, NextResponse } from 'next/server';
import { sendLoginNotificationEmail } from '@/lib/email';
import { getDeviceInfo, getUserAgent } from '@/lib/device-detection';
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
    const deviceInfo = await getDeviceInfo(userAgent || getUserAgent(), ipAddress);

    // Prepare login data for email
    const loginData = {
      timestamp: deviceInfo.timestamp,
      browser: deviceInfo.browser,
      device: deviceInfo.device,
      location: deviceInfo.location || 'Unknown',
      ipAddress: deviceInfo.ipAddress || 'Unknown',
      userAgent: deviceInfo.userAgent
    };

    // Send login notification email
    try {
      await sendLoginNotificationEmail(userEmail, userName, loginData);

      return NextResponse.json({
        success: true,
        message: 'Login notification sent successfully',
        loginData: {
          timestamp: loginData.timestamp,
          browser: loginData.browser,
          device: loginData.device,
          location: loginData.location
        }
      });
    } catch (emailError: any) {
      console.error('Failed to send login notification email:', emailError);

      // Don't fail the login if email fails, just log it
      return NextResponse.json({
        success: true,
        message: 'Login successful but notification email failed',
        warning: 'Email notification could not be sent',
        loginData: {
          timestamp: loginData.timestamp,
          browser: loginData.browser,
          device: loginData.device,
          location: loginData.location
        }
      });
    }

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
