import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (use Redis in production for multi-instance deployments)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyPrefix?: string;
}

/**
 * Rate limiter for API routes
 * Returns true if request should be allowed, false if rate limit exceeded
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const key = `${config.keyPrefix || 'rl'}:${identifier}`;
  const now = Date.now();

  let entry = rateLimitStore.get(key);

  // Create new entry or reset if window expired
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
  }

  // Increment counter
  entry.count++;

  const allowed = entry.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);

  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client identifier from request (IP address or user ID)
 */
export function getClientIdentifier(request: NextRequest, user?: any): string {
  // Use user ID if authenticated
  if (user?.uid) {
    return `user:${user.uid}`;
  }

  // Otherwise use IP address
  const ip =
    request.headers.get('x-client-ip') ||
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown';

  return `ip:${ip}`;
}

/**
 * Middleware wrapper for rate limiting API routes
 */
export function withRateLimit(
  config: RateLimitConfig,
  handler: (request: NextRequest, user?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, user?: any) => {
    const identifier = getClientIdentifier(request, user);
    const result = checkRateLimit(identifier, config);

    // Add rate limit headers
    const headers = {
      'X-RateLimit-Limit': config.maxRequests.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
    };

    if (!result.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            ...headers,
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Call handler and add rate limit headers to response
    const response = await handler(request, user);

    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  };
}

/**
 * Combined auth + rate limit middleware
 */
export function withAuthAndRateLimit(
  rateLimitConfig: RateLimitConfig,
  authRequired: boolean,
  handler: (request: NextRequest, user?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    // Import here to avoid circular dependencies
    const { verifyAuthToken } = await import('./auth-middleware');

    // Verify authentication
    const { authorized, user, error } = await verifyAuthToken(request);

    if (authRequired && !authorized) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: 401 }
      );
    }

    // Apply rate limiting
    const identifier = getClientIdentifier(request, user);
    const result = checkRateLimit(identifier, rateLimitConfig);

    const headers = {
      'X-RateLimit-Limit': rateLimitConfig.maxRequests.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
    };

    if (!result.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            ...headers,
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Call handler
    const response = await handler(request, authorized ? user : undefined);

    // Add headers to response
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  };
}

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  // Strict limits for expensive AI operations
  AI_GENERATION: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
    keyPrefix: 'ai',
  },

  // Moderate limits for API calls
  API_STANDARD: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    keyPrefix: 'api',
  },

  // Lenient limits for read operations
  API_READ: {
    maxRequests: 300,
    windowMs: 60 * 1000, // 1 minute
    keyPrefix: 'read',
  },

  // Very strict limits for authentication attempts
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    keyPrefix: 'auth',
  },

  // Free tier limits
  FREE_TIER: {
    maxRequests: 50,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    keyPrefix: 'free',
  },

  // Pro tier limits
  PRO_TIER: {
    maxRequests: 1000,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    keyPrefix: 'pro',
  },
};