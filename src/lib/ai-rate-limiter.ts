/**
 * AI-specific rate limiting for expensive operations
 */

interface AIRateLimit {
  lastRequest: number;
  requestCount: number;
  resetTime: number;
}

export class AIRateLimiter {
  private static instance: AIRateLimiter;
  private limits: Map<string, AIRateLimit> = new Map();

  private constructor() {
    // Cleanup expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  static getInstance(): AIRateLimiter {
    if (!AIRateLimiter.instance) {
      AIRateLimiter.instance = new AIRateLimiter();
    }
    return AIRateLimiter.instance;
  }

  /**
   * Check if AI operation is allowed with cooldown
   */
  canMakeRequest(
    userId: string,
    operation: 'quiz_generation' | 'flashcard_generation' | 'explanation_generation' | 'image_analysis',
    isPro: boolean = false
  ): { allowed: boolean; waitTime?: number; reason?: string } {
    const now = Date.now();
    const key = `${userId}:${operation}`;
    const limit = this.limits.get(key);

    // Get operation-specific limits
    const config = this.getOperationConfig(operation, isPro);
    
    if (!limit) {
      // First request
      this.limits.set(key, {
        lastRequest: now,
        requestCount: 1,
        resetTime: now + config.windowMs
      });
      return { allowed: true };
    }

    // Check cooldown period
    const timeSinceLastRequest = now - limit.lastRequest;
    if (timeSinceLastRequest < config.cooldownMs) {
      return {
        allowed: false,
        waitTime: config.cooldownMs - timeSinceLastRequest,
        reason: `Cooldown period active. Wait ${Math.ceil((config.cooldownMs - timeSinceLastRequest) / 1000)}s`
      };
    }

    // Check if window has reset
    if (now > limit.resetTime) {
      this.limits.set(key, {
        lastRequest: now,
        requestCount: 1,
        resetTime: now + config.windowMs
      });
      return { allowed: true };
    }

    // Check request count within window
    if (limit.requestCount >= config.maxRequests) {
      return {
        allowed: false,
        waitTime: limit.resetTime - now,
        reason: `Rate limit exceeded. ${limit.requestCount}/${config.maxRequests} requests used`
      };
    }

    // Update counters
    limit.lastRequest = now;
    limit.requestCount++;
    
    return { allowed: true };
  }

  /**
   * Get operation-specific configuration
   */
  private getOperationConfig(operation: string, isPro: boolean) {
    const configs = {
      quiz_generation: {
        free: { maxRequests: 5, windowMs: 60 * 60 * 1000, cooldownMs: 30 * 1000 }, // 5/hour, 30s cooldown
        pro: { maxRequests: 20, windowMs: 60 * 60 * 1000, cooldownMs: 10 * 1000 }  // 20/hour, 10s cooldown
      },
      flashcard_generation: {
        free: { maxRequests: 10, windowMs: 60 * 60 * 1000, cooldownMs: 15 * 1000 }, // 10/hour, 15s cooldown
        pro: { maxRequests: 50, windowMs: 60 * 60 * 1000, cooldownMs: 5 * 1000 }   // 50/hour, 5s cooldown
      },
      explanation_generation: {
        free: { maxRequests: 20, windowMs: 60 * 60 * 1000, cooldownMs: 10 * 1000 }, // 20/hour, 10s cooldown
        pro: { maxRequests: 100, windowMs: 60 * 60 * 1000, cooldownMs: 3 * 1000 }  // 100/hour, 3s cooldown
      },
      image_analysis: {
        free: { maxRequests: 3, windowMs: 60 * 60 * 1000, cooldownMs: 60 * 1000 }, // 3/hour, 60s cooldown
        pro: { maxRequests: 15, windowMs: 60 * 60 * 1000, cooldownMs: 20 * 1000 }  // 15/hour, 20s cooldown
      }
    };

    return configs[operation as keyof typeof configs]?.[isPro ? 'pro' : 'free'] || 
           { maxRequests: 5, windowMs: 60 * 60 * 1000, cooldownMs: 30 * 1000 };
  }

  /**
   * Get remaining requests for user
   */
  getRemainingRequests(userId: string, operation: string, isPro: boolean): number {
    const key = `${userId}:${operation}`;
    const limit = this.limits.get(key);
    const config = this.getOperationConfig(operation, isPro);
    
    if (!limit || Date.now() > limit.resetTime) {
      return config.maxRequests;
    }
    
    return Math.max(0, config.maxRequests - limit.requestCount);
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, limit] of this.limits.entries()) {
      if (now > limit.resetTime + 60 * 60 * 1000) { // Keep for 1 hour after reset
        this.limits.delete(key);
      }
    }
  }
}