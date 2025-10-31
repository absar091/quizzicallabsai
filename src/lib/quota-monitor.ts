// Firebase Quota Monitoring and Management
// Prevents excessive database usage and handles quota limits gracefully

interface QuotaStats {
  reads: number;
  writes: number;
  deletes: number;
  lastReset: number;
}

class QuotaMonitor {
  private stats: QuotaStats = {
    reads: 0,
    writes: 0,
    deletes: 0,
    lastReset: Date.now()
  };

  private readonly DAILY_READ_LIMIT = 50000; // Firebase free tier daily limit
  private readonly HOURLY_READ_LIMIT = 5000; // Conservative hourly limit
  private readonly WARNING_THRESHOLD = 0.8; // Warn at 80% usage

  // Track a database read operation
  trackRead(): boolean {
    this.resetIfNewDay();
    this.stats.reads++;
    
    if (this.stats.reads > this.DAILY_READ_LIMIT) {
      console.error('🚨 QUOTA EXCEEDED: Daily read limit reached');
      return false;
    }
    
    if (this.stats.reads > this.DAILY_READ_LIMIT * this.WARNING_THRESHOLD) {
      console.warn('⚠️ QUOTA WARNING: Approaching daily read limit', {
        current: this.stats.reads,
        limit: this.DAILY_READ_LIMIT,
        percentage: (this.stats.reads / this.DAILY_READ_LIMIT * 100).toFixed(1)
      });
    }
    
    return true;
  }

  // Track a database write operation
  trackWrite(): boolean {
    this.resetIfNewDay();
    this.stats.writes++;
    return true;
  }

  // Track a database delete operation
  trackDelete(): boolean {
    this.resetIfNewDay();
    this.stats.deletes++;
    return true;
  }

  // Check if we're approaching quota limits
  isApproachingLimit(): boolean {
    return this.stats.reads > this.DAILY_READ_LIMIT * this.WARNING_THRESHOLD;
  }

  // Check if quota is exceeded
  isQuotaExceeded(): boolean {
    return this.stats.reads >= this.DAILY_READ_LIMIT;
  }

  // Get current usage stats
  getStats(): QuotaStats & { percentage: number } {
    return {
      ...this.stats,
      percentage: (this.stats.reads / this.DAILY_READ_LIMIT) * 100
    };
  }

  // Reset stats if it's a new day
  private resetIfNewDay(): void {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (now - this.stats.lastReset > oneDayMs) {
      console.log('📊 Resetting daily quota stats');
      this.stats = {
        reads: 0,
        writes: 0,
        deletes: 0,
        lastReset: now
      };
    }
  }

  // Get time until quota reset
  getTimeUntilReset(): number {
    const oneDayMs = 24 * 60 * 60 * 1000;
    const timeSinceReset = Date.now() - this.stats.lastReset;
    return Math.max(0, oneDayMs - timeSinceReset);
  }
}

// Global quota monitor instance
export const quotaMonitor = new QuotaMonitor();

// Wrapper for Firebase operations with quota tracking
export async function withQuotaTracking<T>(
  operation: () => Promise<T>,
  operationType: 'read' | 'write' | 'delete' = 'read'
): Promise<T> {
  // Check quota before operation
  if (operationType === 'read' && quotaMonitor.isQuotaExceeded()) {
    throw new Error('Daily quota exceeded. Please try again tomorrow.');
  }

  try {
    const result = await operation();
    
    // Track successful operation
    switch (operationType) {
      case 'read':
        quotaMonitor.trackRead();
        break;
      case 'write':
        quotaMonitor.trackWrite();
        break;
      case 'delete':
        quotaMonitor.trackDelete();
        break;
    }
    
    return result;
  } catch (error: any) {
    // Handle quota exceeded errors
    if (error.code === 8 || error.message?.includes('Quota exceeded')) {
      console.error('🚨 Firebase quota exceeded:', error);
      throw new Error('Service temporarily unavailable due to high usage. Please try again later.');
    }
    
    throw error;
  }
}

// Utility to check if operation should be cached vs fresh
export function shouldUseCache(lastCheck: number, cacheMinutes: number = 5): boolean {
  const cacheMs = cacheMinutes * 60 * 1000;
  const isApproachingLimit = quotaMonitor.isApproachingLimit();
  
  // Use longer cache if approaching quota limits
  const effectiveCacheMs = isApproachingLimit ? cacheMs * 3 : cacheMs;
  
  return (Date.now() - lastCheck) < effectiveCacheMs;
}

// Log quota usage for monitoring
export function logQuotaUsage(): void {
  const stats = quotaMonitor.getStats();
  console.log('📊 Firebase Quota Usage:', {
    reads: stats.reads,
    writes: stats.writes,
    deletes: stats.deletes,
    percentage: stats.percentage.toFixed(1) + '%',
    timeUntilReset: Math.round(quotaMonitor.getTimeUntilReset() / (60 * 60 * 1000)) + ' hours'
  });
}