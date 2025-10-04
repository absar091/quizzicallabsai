import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiting (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMITS = {
  free: {
    requests: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  pro: {
    requests: 1000,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  premium: {
    requests: 5000,
    windowMs: 60 * 60 * 1000, // 1 hour
  }
};

function getRateLimitStatus(identifier: string, tier: 'free' | 'pro' | 'premium' = 'free') {
  const now = Date.now();
  const limit = RATE_LIMITS[tier];
  
  const current = rateLimitStore.get(identifier);
  
  if (!current || now > current.resetTime) {
    // Reset or initialize
    const newEntry = {
      count: 0,
      resetTime: now + limit.windowMs
    };
    rateLimitStore.set(identifier, newEntry);
    
    return {
      limit: limit.requests,
      remaining: limit.requests,
      reset: newEntry.resetTime,
      resetIn: limit.windowMs,
      tier
    };
  }
  
  return {
    limit: limit.requests,
    remaining: Math.max(0, limit.requests - current.count),
    reset: current.resetTime,
    resetIn: current.resetTime - now,
    tier
  };
}

export async function GET(request: NextRequest) {
  try {
    // Get identifier (IP address or user ID)
    const xForwardedFor = request.headers.get('x-forwarded-for');
    const xRealIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    
    const identifier = cfConnectingIp || xRealIp || xForwardedFor?.split(',')[0] || 'unknown';
    
    // Get user tier from query params (in real app, this would come from auth)
    const { searchParams } = new URL(request.url);
    const tier = (searchParams.get('tier') as 'free' | 'pro' | 'premium') || 'free';
    
    const status = getRateLimitStatus(identifier, tier);
    
    return NextResponse.json({
      success: true,
      rateLimit: status,
      identifier: identifier.substring(0, 8) + '...', // Partial identifier for privacy
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Rate limit status error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get rate limit status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, tier = 'free' } = body;
    
    // Get identifier
    const xForwardedFor = request.headers.get('x-forwarded-for');
    const xRealIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    
    const identifier = cfConnectingIp || xRealIp || xForwardedFor?.split(',')[0] || 'unknown';
    
    if (action === 'increment') {
      // Increment the rate limit counter
      const now = Date.now();
      const limit = RATE_LIMITS[tier as keyof typeof RATE_LIMITS];
      
      const current = rateLimitStore.get(identifier);
      
      if (!current || now > current.resetTime) {
        // Reset or initialize
        rateLimitStore.set(identifier, {
          count: 1,
          resetTime: now + limit.windowMs
        });
      } else {
        // Increment
        current.count += 1;
        rateLimitStore.set(identifier, current);
      }
      
      const status = getRateLimitStatus(identifier, tier as 'free' | 'pro' | 'premium');
      
      return NextResponse.json({
        success: true,
        rateLimit: status,
        action: 'incremented'
      });
      
    } else if (action === 'reset') {
      // Reset rate limit for identifier
      rateLimitStore.delete(identifier);
      
      return NextResponse.json({
        success: true,
        message: 'Rate limit reset',
        action: 'reset'
      });
      
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Use "increment" or "reset"' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('❌ Rate limit action error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Rate limit action failed' },
      { status: 500 }
    );
  }
}