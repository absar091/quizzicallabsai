import { NextRequest, NextResponse } from 'next/server';

export function securityHeaders(response: NextResponse) {
  // Prevent XSS attacks
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy - Allow reCAPTCHA and other services
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.recaptcha.net; " +
    "style-src 'self' 'unsafe-inline' https://www.google.com; " +
    "img-src 'self' data: https:; " +
    "frame-src https://www.google.com https://www.recaptcha.net; " +
    "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebase.com wss://*.firebaseio.com https://va.vercel-scripts.com https://www.google-analytics.com https://analytics.google.com https://vitals.vercel-insights.com https://vercel.live https://www.google.com https://www.recaptcha.net wss://*.pusher.com;"
  );
  
  return response;
}

export function rateLimitCheck(request: NextRequest): boolean {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  // Basic rate limiting - implement proper rate limiting in production
  return true;
}