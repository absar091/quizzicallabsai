import { NextRequest, NextResponse } from 'next/server';
import { loginNotificationEmailTemplate } from '@/lib/email-templates-professional';
import { detectDeviceInfo } from '@/lib/device-detection';

export async function GET(request: NextRequest) {
  try {
    // Get real device info from current request
    const userAgent = request.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const ipAddress = '39.50.139.118'; // Your actual IP
    
    // Detect device info
    const deviceInfo = await detectDeviceInfo(userAgent, ipAddress);
    
    // Create sample login data with real device detection
    const sampleLoginData = {
      device: deviceInfo.device || 'Windows Computer',
      browser: deviceInfo.browser || 'Google Chrome',
      location: deviceInfo.location && deviceInfo.location !== 'Unknown, Unknown, Unknown' ? deviceInfo.location : 'Vehari, Punjab, Pakistan',
      ipAddress: deviceInfo.ip || '39.50.139.118',
      time: new Date().toLocaleString('en-US', { 
        timeZone: 'Asia/Karachi', 
        dateStyle: 'full', 
        timeStyle: 'medium' 
      })
    };
    
    console.log('🔍 Sample login data:', sampleLoginData);
    
    // Generate the email template
    const template = loginNotificationEmailTemplate('Ahmad Rao', sampleLoginData);
    
    // Return HTML for preview
    return new NextResponse(template.html, {
      headers: { 'Content-Type': 'text/html' }
    });
    
  } catch (error: any) {
    console.error('❌ Security email test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}