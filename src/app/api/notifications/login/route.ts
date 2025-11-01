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

    // FIXED: Get device information with real server-side IP
    console.log('🔍 Server-side device detection with IP:', ipAddress);
    const deviceInfo = await detectDeviceInfo(userAgent || 'Server-side Request', ipAddress);

    // Check if we should send notification (only for untrusted devices)
    const shouldNotify = await loginCredentialsManager.shouldSendNotification(decodedToken.uid, deviceInfo);

    if (shouldNotify) {
      console.log('🔐 SENDING LOGIN NOTIFICATION - UNTRUSTED DEVICE DETECTED');

      // FIXED: Prepare login data for email with actual detected values
      const formatLocation = (city: string, region: string, country: string) => {
        // Use actual detected values, only fallback if truly unknown
        const actualCity = city && city !== 'Unknown' ? city : 'Unknown City';
        const actualRegion = region && region !== 'Unknown' ? region : 'Unknown Region';
        const actualCountry = country && country !== 'Unknown' ? country : 'Unknown Country';
        
        return `${actualCity}, ${actualRegion}, ${actualCountry}`;
      };

      // FIXED: Use actual detected device information
      const loginData = {
        timestamp: new Date(deviceInfo.timestamp).toISOString(),
        browser: deviceInfo.browser || 'Unknown Browser',
        device: deviceInfo.device || 'Unknown Device',
        location: formatLocation(deviceInfo.city, deviceInfo.region, deviceInfo.country),
        ipAddress: deviceInfo.ip || 'Unknown IP',
        userAgent: userAgent || 'Unknown User Agent'
      };

      // FIXED: Log actual device info for debugging
      console.log('🔍 Actual Device Info Detected:', {
        browser: deviceInfo.browser,
        device: deviceInfo.device,
        os: deviceInfo.os,
        city: deviceInfo.city,
        region: deviceInfo.region,
        country: deviceInfo.country,
        ip: deviceInfo.ip,
        location: deviceInfo.location,
        userAgent: userAgent
      });

      // FIXED: Log what will be sent in email
      console.log('📧 Email Data Being Sent:', {
        device: loginData.device,
        browser: loginData.browser,
        location: loginData.location,
        ipAddress: loginData.ipAddress,
        timestamp: loginData.timestamp
      });

      // Send login notification email using preferences system
      const { sendEmailWithPreferences } = await import('@/lib/email');
      const { loginNotificationEmailTemplate } = await import('@/lib/email-templates-professional');
      
      const template = loginNotificationEmailTemplate(userName, {
        device: loginData.device,
        browser: loginData.browser,
        location: loginData.location,
        ipAddress: loginData.ipAddress,
        time: new Date(loginData.timestamp).toLocaleString('en-US', { 
          timeZone: 'Asia/Karachi', 
          dateStyle: 'full', 
          timeStyle: 'medium' 
        })
      });
      
      const emailResult = await sendEmailWithPreferences({
        to: userEmail,
        subject: template.subject,
        html: template.html,
        text: template.text
      }, 'loginAlerts');

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
