/**
 * Rate Limiting and Brute Force Protection System
 * Implements comprehensive security measures to prevent automated attacks
 */

interface LoginAttempt {
  email: string;
  attempts: number;
  lockUntil?: number;
  lastAttempt: number;
  ipAddress?: string;
}

interface RateLimitEntry {
  count: number;
  lastAttempt: number;
  blocked: boolean;
  blockUntil?: number;
}

class RateLimiter {
  private static instance: RateLimiter;
  private attempts = new Map<string, RateLimitEntry>();
  private maxAttempts = 5;
  private lockTime = 15 * 60 * 1000; // 15 minutes
  private windowTime = 60 * 1000; // 1 minute window

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  private constructor() {
    // Clean up expired entries every 5 minutes
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Check if an action is allowed
   */
  isAllowed(key: string, action: string = 'general'): boolean {
    const fullKey = `${key}:${action}`;
    const entry = this.attempts.get(fullKey);

    if (!entry) {
      return true; // First attempt, allow
    }

    // Check if currently blocked
    if (entry.blocked && entry.blockUntil) {
      if (Date.now() < entry.blockUntil) {
        return false; // Still blocked
      } else {
        // Block period expired, reset
        entry.blocked = false;
        entry.blockUntil = undefined;
        entry.count = 0;
      }
    }

    // Check if within time window
    if (entry.lastAttempt < Date.now() - this.windowTime) {
      // Reset counter if outside window
      entry.count = 0;
      return true;
    }

    // Check attempt count
    if (entry.count >= this.maxAttempts) {
      entry.blocked = true;
      entry.blockUntil = Date.now() + this.lockTime;
      return false;
    }

    return true;
  }

  /**
   * Record a failed attempt
   */
  recordFailedAttempt(key: string, action: string = 'general'): void {
    const fullKey = `${key}:${action}`;
    let entry = this.attempts.get(fullKey);

    if (!entry) {
      entry = {
        count: 0,
        lastAttempt: Date.now(),
        blocked: false
      };
      this.attempts.set(fullKey, entry);
    }

    entry.count++;
    entry.lastAttempt = Date.now();

    // Log security event
    this.logSecurityEvent('FAILED_ATTEMPT', key, action, entry);
  }

  /**
   * Record a successful attempt (resets counter)
   */
  recordSuccessfulAttempt(key: string, action: string = 'general'): void {
    const fullKey = `${key}:${action}`;
    const entry = this.attempts.get(fullKey);

    if (entry) {
      entry.count = Math.max(0, entry.count - 1); // Reduce counter slightly
      entry.lastAttempt = Date.now();
      this.logSecurityEvent('SUCCESSFUL_ATTEMPT', key, action, entry);
    }
  }

  /**
   * Get remaining attempts before lockout
   */
  getRemainingAttempts(key: string, action: string = 'general'): number {
    const fullKey = `${key}:${action}`;
    const entry = this.attempts.get(fullKey);

    if (!entry) return this.maxAttempts;

    return Math.max(0, this.maxAttempts - entry.count);
  }

  /**
   * Get lockout status
   */
  getLockoutStatus(key: string, action: string = 'general'): {
    isLocked: boolean;
    remainingLockTime?: number;
  } {
    const fullKey = `${key}:${action}`;
    const entry = this.attempts.get(fullKey);

    if (!entry || !entry.blocked) {
      return { isLocked: false };
    }

    const remainingTime = entry.blockUntil ? entry.blockUntil - Date.now() : 0;
    return {
      isLocked: remainingTime > 0,
      remainingLockTime: Math.max(0, remainingTime)
    };
  }

  /**
   * Log security event
   */
  private logSecurityEvent(
    eventType: string,
    key: string,
    action: string,
    entry: RateLimitEntry
  ): void {
    const logData = {
      timestamp: new Date().toISOString(),
      eventType,
      key: key.substring(0, 10) + '...', // Mask key for privacy
      action,
      attempts: entry.count,
      blocked: entry.blocked,
      lastAttempt: entry.lastAttempt
    };

    // In production, send to security monitoring service
    console.warn(`🔐 Security Event: ${eventType}`, logData);

    // Store in error logger if available
    if (typeof window === 'undefined') {
      try {
        // Server-side logging
        const { errorLogger } = require('./error-logger');
        errorLogger.logSecurityEvent(eventType, logData);
      } catch (error) {
        // Error logger not available, continue silently
      }
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const expiryTime = this.windowTime * 2; // Keep records for 2x window time

    for (const [key, entry] of this.attempts.entries()) {
      if (entry.lastAttempt < now - expiryTime && !entry.blocked) {
        this.attempts.delete(key);
      }
    }
  }

  /**
   * Force unlock a key (admin function)
   */
  forceUnlock(key: string, action: string = 'general'): boolean {
    const fullKey = `${key}:${action}`;
    const entry = this.attempts.get(fullKey);

    if (entry) {
      entry.blocked = false;
      entry.blockUntil = undefined;
      entry.count = 0;
      this.logSecurityEvent('FORCED_UNLOCK', key, action, entry);
      return true;
    }

    return false;
  }

  /**
   * Get statistics for debugging
   */
  getStats(): { totalEntries: number; blockedCount: number; activeCount: number } {
    let blockedCount = 0;
    let activeCount = 0;

    for (const entry of this.attempts.values()) {
      if (entry.blocked) blockedCount++;
      if (entry.count > 0) activeCount++;
    }

    return {
      totalEntries: this.attempts.size,
      blockedCount,
      activeCount
    };
  }
}

// Export singleton instance
export const rateLimiter = RateLimiter.getInstance();

// Specific functions for authentication
export function isLoginAllowed(email: string): boolean {
  return rateLimiter.isAllowed(email, 'login');
}

export function recordLoginFailure(email: string): void {
  rateLimiter.recordFailedAttempt(email, 'login');
}

export function recordLoginSuccess(email: string): void {
  rateLimiter.recordSuccessfulAttempt(email, 'login');
}

export function getLoginRemainingAttempts(email: string): number {
  return rateLimiter.getRemainingAttempts(email, 'login');
}

export function getLoginLockoutStatus(email: string) {
  return rateLimiter.getLockoutStatus(email, 'login');
}

export function isSignupAllowed(email: string): boolean {
  return rateLimiter.isAllowed(email, 'signup');
}

export function recordSignupFailure(email: string): void {
  rateLimiter.recordFailedAttempt(email, 'signup');
}

export function recordSignupSuccess(email: string): void {
  rateLimiter.recordSuccessfulAttempt(email, 'signup');
}

// Progressive delay function for UI
export function getProgressiveDelay(attempts: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s, 16s...
  const baseDelay = 1000; // 1 second
  return Math.min(baseDelay * Math.pow(2, attempts - 1), 30000); // Max 30 seconds
}

// Format time remaining for user display
export function formatTimeRemaining(ms: number): string {
  if (ms < 60000) { // Less than 1 minute
    return `${Math.ceil(ms / 1000)} seconds`;
  } else if (ms < 3600000) { // Less than 1 hour
    return `${Math.ceil(ms / 60000)} minutes`;
  } else {
    return `${Math.ceil(ms / 3600000)} hours`;
  }
}
