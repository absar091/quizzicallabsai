/**
 * API Security middleware and utilities
 */

import { NextRequest, NextResponse } from 'next/server';
import RateLimiter from './rate-limiter';
import { InputValidator } from './input-validator';
import { secureLog } from './secure-logger';

export interface SecurityConfig {
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
  requireAuth?: boolean;
  validateInput?: boolean;
  logRequests?: boolean;
}

export class ApiSecurity {
  private static rateLimiter = RateLimiter.getInstance();

  /**
   * Main security middleware
   */
  static async secureEndpoint(
    request: NextRequest,
    config: SecurityConfig = {}
  ): Promise<NextResponse | null> {
    const {
      rateLimit = { maxRequests: 100, windowMs: 60000 },
      requireAuth = false,
      validateInput = true,
      logRequests = true
    } = config;

    try {
      // Get client identifier
      const clientId = this.getClientIdentifier(request);

      // Log request if enabled
      if (logRequests) {
        secureLog('info', `API Request: ${request.method} ${request.url}`, {
          clientId: clientId.substring(0, 8) + '...',
          userAgent: request.headers.get('user-agent')?.substring(0, 100)
        });
      }

      // Rate limiting
      if (!this.rateLimiter.isAllowed(clientId, rateLimit.maxRequests, rateLimit.windowMs)) {
        secureLog('warn', `Rate limit exceeded for client: ${clientId.substring(0, 8)}...`);
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { 
            status: 429,
            headers: {
              'Retry-After': Math.ceil(this.rateLimiter.getResetTime(clientId) / 1000).toString()
            }
          }
        );
      }

      // Input validation
      if (validateInput && request.method !== 'GET') {
        const validationResult = await this.validateRequestInput(request);
        if (!validationResult.valid) {
          secureLog('warn', `Invalid input detected: ${validationResult.error}`);
          return NextResponse.json(
            { error: 'Invalid input' },
            { status: 400 }
          );
        }
      }

      // Authentication check
      if (requireAuth) {
        const authResult = await this.validateAuthentication(request);
        if (!authResult.valid) {
          secureLog('warn', `Authentication failed: ${authResult.error}`);
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          );
        }
      }

      return null; // Continue to endpoint
    } catch (error) {
      secureLog('error', 'Security middleware error', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  /**
   * Get client identifier for rate limiting
   */
  private static getClientIdentifier(request: NextRequest): string {
    // Try to get real IP from headers (for proxies/load balancers)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0] || realIp || request.ip || 'unknown';
    
    // Combine with user agent for better identification
    const userAgent = request.headers.get('user-agent') || '';
    return `${ip}:${userAgent.substring(0, 50)}`;
  }

  /**
   * Validate request input
   */
  private static async validateRequestInput(request: NextRequest): Promise<{
    valid: boolean;
    error?: string;
  }> {
    try {
      const contentType = request.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        const body = await request.clone().json();
        
        // Check for common injection patterns
        const bodyStr = JSON.stringify(body);
        const dangerousPatterns = [
          /<script/i,
          /javascript:/i,
          /on\w+\s*=/i,
          /eval\s*\(/i,
          /expression\s*\(/i
        ];
        
        for (const pattern of dangerousPatterns) {
          if (pattern.test(bodyStr)) {
            return { valid: false, error: 'Potentially malicious content detected' };
          }
        }
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, error: 'Invalid request format' };
    }
  }

  /**
   * Validate authentication
   */
  private static async validateAuthentication(request: NextRequest): Promise<{
    valid: boolean;
    error?: string;
  }> {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return { valid: false, error: 'Missing authorization header' };
    }

    // Basic validation - extend based on your auth system
    if (!authHeader.startsWith('Bearer ')) {
      return { valid: false, error: 'Invalid authorization format' };
    }

    const token = authHeader.substring(7);
    if (!token || token.length < 10) {
      return { valid: false, error: 'Invalid token' };
    }

    return { valid: true };
  }

  /**
   * Sanitize response data
   */
  static sanitizeResponse(data: any): any {
    if (typeof data === 'string') {
      return InputValidator.sanitizeHtml(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeResponse(item));
    }
    
    if (data && typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeResponse(value);
      }
      return sanitized;
    }
    
    return data;
  }
}