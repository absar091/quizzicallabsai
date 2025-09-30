import { NextRequest, NextResponse } from 'next/server';
import { auth } from './firebase-admin';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    uid: string;
    email?: string;
    emailVerified: boolean;
    displayName?: string;
    photoURL?: string;
  };
}

/**
 * Middleware to verify Firebase authentication tokens
 * Use this to protect API routes that require authentication
 */
export async function verifyAuthToken(
  request: NextRequest
): Promise<{ authorized: boolean; user?: any; error?: string }> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        authorized: false,
        error: 'No authorization token provided',
      };
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      return {
        authorized: false,
        error: 'Invalid authorization header format',
      };
    }

    // Verify token with Firebase Admin
    if (!auth) {
      console.error('Firebase Admin Auth not initialized');
      return {
        authorized: false,
        error: 'Authentication service unavailable',
      };
    }

    const decodedToken = await auth.verifyIdToken(token);

    return {
      authorized: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified || false,
        displayName: decodedToken.name,
        photoURL: decodedToken.picture,
      },
    };
  } catch (error: any) {
    console.error('Auth verification error:', error);

    // Handle specific Firebase errors
    if (error.code === 'auth/id-token-expired') {
      return {
        authorized: false,
        error: 'Token expired',
      };
    }

    if (error.code === 'auth/id-token-revoked') {
      return {
        authorized: false,
        error: 'Token revoked',
      };
    }

    return {
      authorized: false,
      error: 'Invalid authentication token',
    };
  }
}

/**
 * Helper function to create authenticated API route handlers
 *
 * Usage:
 * export const POST = withAuth(async (request, user) => {
 *   // user is guaranteed to be authenticated here
 *   return NextResponse.json({ message: 'Success' });
 * });
 */
export function withAuth(
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const { authorized, user, error } = await verifyAuthToken(request);

    if (!authorized) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: 401 }
      );
    }

    return handler(request, user);
  };
}

/**
 * Optional auth - allows both authenticated and unauthenticated requests
 * but provides user info if authenticated
 */
export function withOptionalAuth(
  handler: (request: NextRequest, user?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const { authorized, user } = await verifyAuthToken(request);
    return handler(request, authorized ? user : undefined);
  };
}

/**
 * Verify user has specific plan level
 */
export async function verifyPlanAccess(
  user: any,
  requiredPlan: 'free' | 'pro' | 'enterprise'
): Promise<boolean> {
  // This would typically query your database to check the user's plan
  // For now, returning true to allow development
  // TODO: Implement actual plan checking from MongoDB
  return true;
}

/**
 * Middleware wrapper that checks both auth and plan access
 */
export function withPlanAccess(
  requiredPlan: 'free' | 'pro' | 'enterprise',
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const { authorized, user, error } = await verifyAuthToken(request);

    if (!authorized) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const hasAccess = await verifyPlanAccess(user, requiredPlan);

    if (!hasAccess) {
      return NextResponse.json(
        { error: `This feature requires ${requiredPlan} plan or higher` },
        { status: 403 }
      );
    }

    return handler(request, user);
  };
}