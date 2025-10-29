import { NextRequest, NextResponse } from 'next/server';
import { verifyCodeFromDB } from '@/lib/email-verification';
import { sanitizeEmail, sanitizeCode } from '@/lib/input-sanitizer';
import { securityHeaders, rateLimitCheck } from '@/middleware/security';
import { auth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  // Rate limiting check
  if (!rateLimitCheck(request)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  
  try {
    const { email: rawEmail, code: rawCode, originalEmail } = await request.json();
    
    const email = sanitizeEmail(rawEmail);
    const code = sanitizeCode(rawCode);

    if (!email || !code || code.length !== 6) {
      return NextResponse.json({ 
        error: 'Valid email and 6-digit code are required' 
      }, { status: 400 });
    }

    // Verify code from database
    const isValid = await verifyCodeFromDB(email, code);

    if (isValid) {
      // Also update Firebase Auth user as verified
      try {
        let user;
        try {
          user = await auth.getUserByEmail(email);
        } catch (emailError: any) {
          if (originalEmail && originalEmail !== email) {
            user = await auth.getUserByEmail(originalEmail);
            await auth.updateUser(user.uid, {
              email: email,
              emailVerified: true
            });
          } else {
            throw emailError;
          }
        }
        
        if (user && !user.emailVerified) {
          await auth.updateUser(user.uid, {
            emailVerified: true
          });
        }
      } catch (authError: any) {
        const { secureLog } = await import('@/lib/secure-logger');
        secureLog('warning', 'Failed to update Firebase Auth verification', { 
          email, 
          error: authError.message 
        });
      }
      
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