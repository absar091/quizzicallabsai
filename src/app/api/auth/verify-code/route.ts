import { NextRequest, NextResponse } from 'next/server';
import { verifyCodeFromDB } from '@/lib/email-verification';
import { sanitizeEmail, sanitizeCode } from '@/lib/input-sanitizer';
import { securityHeaders, rateLimitCheck } from '@/middleware/security';

export async function POST(request: NextRequest) {
  // Rate limiting check
  if (!rateLimitCheck(request)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  
  try {
    const { email: rawEmail, code: rawCode } = await request.json();
    
    const email = sanitizeEmail(rawEmail);
    const code = sanitizeCode(rawCode);

    if (!email || !code || code.length !== 6) {
      return NextResponse.json({ 
        error: 'Valid email and 6-digit code are required' 
      }, { status: 400 });
    }

    // Skip reCAPTCHA for localhost
    const isLocalhost = request.headers.get('host')?.includes('localhost') || 
                       request.headers.get('host')?.includes('127.0.0.1');

    // Verify code from database
    const isValid = await verifyCodeFromDB(email, code);

    if (isValid) {
      const response = NextResponse.json({ 
        success: true, 
        message: 'Email verified successfully',
        verified: true
      });
      
      return securityHeaders(response);
    } else {
      const response = NextResponse.json({ 
        error: 'Invalid or expired verification code' 
      }, { status: 400 });
      
      return securityHeaders(response);
    }

  } catch (error: any) {
    const { secureLog } = await import('@/lib/secure-logger');
    secureLog('error', 'Verify code error', { error: error.message });
    const response = NextResponse.json({ 
      error: 'Failed to verify code' 
    }, { status: 500 });
    
    return securityHeaders(response);
  }
}