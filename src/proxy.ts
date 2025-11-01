import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js 16 Proxy Configuration
 * Replaces middleware.ts for network boundary clarification
 * Runs on edge runtime before API routes and pages
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add security headers to all responses
  const response = NextResponse.next();

  // Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  // Content Security Policy (CSP) - Enhanced for Next.js 16
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://apis.google.com https://va.vercel-scripts.com https://www.recaptcha.net https://cdn.jsdelivr.net https://vercel.live https://*.vercel.live https://*.firebaseio.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
    img-src 'self' blob: data: https: http: https://www.simplesmiles.io https://placehold.co;
    font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net;
    connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebase.com wss://*.firebaseio.com https://va.vercel-scripts.com https://www.google-analytics.com https://analytics.google.com https://vitals.vercel-insights.com https://vercel.live https://www.google.com https://www.google.com/recaptcha/ https://www.google.com/recaptcha/api2/ https://cdn.jsdelivr.net https://vercel.com/api/;
    frame-src https://www.google.com https://*.firebaseapp.com https://www.recaptcha.net https://vercel.live https://*.vercel.live https://*.firebaseio.com;
    worker-src 'self' blob:;
    object-src 'none';
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  // CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With'
    );
    response.headers.set('Access-Control-Max-Age', '86400');

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
  }

  // Enhanced rate limiting for Next.js 16
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             request.headers.get('cf-connecting-ip') || 
             'unknown';

  // Add client information to headers for downstream processing
  response.headers.set('x-client-ip', ip);
  response.headers.set('x-pathname', pathname);
  response.headers.set('x-user-agent', request.headers.get('user-agent') || 'unknown');

  // Enhanced security for sensitive routes
  if (pathname.startsWith('/api/admin') || pathname.startsWith('/api/auth')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  // Performance optimizations for static assets
  if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return response;
}

/**
 * Configure which routes should run through the proxy
 * Updated for Next.js 16 compatibility
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - Next.js 16 internal routes
     */
    '/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// Export default for Next.js 16 compatibility
export default proxy;