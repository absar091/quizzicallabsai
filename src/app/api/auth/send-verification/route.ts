import { NextRequest, NextResponse } from 'next/server';
import { generateVerificationCode, storeVerificationCode } from '@/lib/email-verification';
import { sanitizeEmail, sanitizeString } from '@/lib/input-sanitizer';
import { escapeHtml } from '@/lib/html-sanitizer';
import { securityHeaders, rateLimitCheck } from '@/middleware/security';
import { getTransporter, getFromAddress } from '@/lib/email-config';
import fs from 'fs';
import path from 'path';



export async function POST(request: NextRequest) {
  // Rate limiting check
  if (!rateLimitCheck(request)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  
  try {
    const { email: rawEmail, name: rawName } = await request.json();
    
    const email = sanitizeEmail(rawEmail);
    const name = sanitizeString(rawName || '');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Skip reCAPTCHA for localhost
    const isLocalhost = request.headers.get('host')?.includes('localhost') || 
                       request.headers.get('host')?.includes('127.0.0.1');
    
    if (!isLocalhost) {
      // Add reCAPTCHA verification for production
      // const { recaptchaToken } = await request.json();
      // if (!recaptchaToken) {
      //   return NextResponse.json({ error: 'reCAPTCHA required' }, { status: 400 });
      // }
    }

    // Generate verification code
    const code = generateVerificationCode();
    
    // Store in database
    await storeVerificationCode(email, code);

    // Load and customize email template
    const templatePath = path.join(process.cwd(), 'src', 'templates', 'email-verification.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    
    // Replace template variables
    const emailHtml = htmlTemplate
      .replace(/%DISPLAY_NAME%/g, escapeHtml(name || 'User'))
      .replace(/%EMAIL%/g, escapeHtml(email))
      .replace(/%CODE%/g, code)
      .replace(/%EXPIRY_MINUTES%/g, '15')
      .replace(/%SUPPORT_EMAIL%/g, 'hello@quizzicallabz.qzz.io');

    const transporter = getTransporter('verification');
    const fromAddress = getFromAddress('verification');
    
    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: 'Verify Your Email - Quizzicallabzᴬᴵ',
      html: emailHtml,
      text: `Your verification code is: ${code}. This code expires in 15 minutes.`
    });

    const response = NextResponse.json({ 
      success: true, 
      message: 'Verification code sent successfully'
    });
    
    return securityHeaders(response);

  } catch (error: any) {
    const { secureLog } = await import('@/lib/secure-logger');
    secureLog('error', 'Send verification error', { error: error.message });
    const response = NextResponse.json({ 
      error: 'Failed to send verification code' 
    }, { status: 500 });
    
    return securityHeaders(response);
  }
}