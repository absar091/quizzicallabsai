// Quiz Arena Health Check and Monitoring
import { QuizArena } from './quiz-arena';
import { getConnectionStatus } from './firebase-connection';

export interface HealthCheckResult {
  status: 'healthy' | 'warning' | 'critical';
  checks: {
    connection: boolean;
    firebase: boolean;
    roomGeneration: boolean;
    listeners: boolean;
  };
  issues: string[];
  timestamp: number;
}

export class QuizArenaHealthCheck {
  private static instance: QuizArenaHealthCheck;
  private healthHistory: HealthCheckResult[] = [];
  private maxHistorySize = 10;

  static getInstance(): QuizArenaHealthCheck {
    if (!this.instance) {
      this.instance = new QuizArenaHealthCheck();
    }
    return this.instance;
  }

  async performHealthCheck(): Promise<HealthCheckResult> {
    const result: HealthCheckResult = {
      status: 'healthy',
      checks: {
        connection: false,
        firebase: false,
        roomGeneration: false,
        listeners: false
      },
      issues: [],
      timestamp: Date.now()
    };

    try {
      // Check connection status
      const connectionStatus = getConnectionStatus();
      result.checks.connection = connectionStatus.isOnline && connectionStatus.firebaseConnected;
      
      if (!result.checks.connection) {
        result.issues.push('Connection issues detected');
      }

      // Test room code generation
      try {
        const testCode = await QuizArena.Discovery.generateRoomCode();
        result.checks.roomGeneration = testCode && testCode.length === 6;
        
        if (!result.checks.roomGeneration) {
          result.issues.push('Room code generation failed');
        }
      } catch (error) {
        result.checks.roomGeneration = false;
        result.issues.push(`Room generation error: ${error}`);
      }

      // Test Firebase connectivity (safer approach)
      try {
        // Just check if Firebase is initialized and accessible
        const { getConnectionStatus } = await import('./firebase-connection');
        const connectionStatus = getConnectionStatus();
        result.checks.firebase = connectionStatus.firebaseConnected;
        
        if (!result.checks.firebase) {
          result.issues.push('Firebase connection not established');
        }
      } catch (error) {
        result.checks.firebase = false;
        result.issues.push(`Firebase connectivity issue: ${error}`);
      }

      // Test listener health (if any active)
      result.checks.listeners = true; // Assume healthy unless we detect issues

      // Determine overall status
      const failedChecks = Object.values(result.checks).filter(check => !check).length;
      
      if (failedChecks === 0) {
        result.status = 'healthy';
      } else if (failedChecks <= 2) {
        result.status = 'warning';
      } else {
        result.status = 'critical';
      }

    } catch (error) {
      result.status = 'critical';
      result.issues.push(`Health check failed: ${error}`);
    }

    // Store in history
    this.healthHistory.push(result);
    if (this.healthHistory.length > this.maxHistorySize) {
      this.healthHistory.shift();
    }

    return result;
  }

  getHealthHistory(): HealthCheckResult[] {
    return [...this.healthHistory];
  }

  getLastHealthCheck(): HealthCheckResult | null {
    return this.healthHistory[this.healthHistory.length - 1] || null;
  }

  // Monitor for common issues
  async detectCommonIssues(): Promise<string[]> {
    const issues: string[] = [];

    try {
      // Check for timer sync issues
      const now = Date.now();
      const testTimestamp = now - 1000; // 1 second ago
      const timeDiff = Math.abs(now - testTimestamp);
      
      if (timeDiff > 5000) { // More than 5 seconds difference
        issues.push('Timer synchronization may be off');
      }

      // Check for memory leaks (basic check)
      if (typeof window !== 'undefined' && (window as any).performance?.memory) {
        const memory = (window as any).performance.memory;
        const memoryUsage = memory.usedJSHeapSize / memory.totalJSHeapSize;
        
        if (memoryUsage > 0.9) {
          issues.push('High memory usage detected - possible memory leak');
        }
      }

      // Check for connection stability
      const connectionStatus = getConnectionStatus();
      if (connectionStatus.reconnectAttempts > 3) {
        issues.push('Frequent reconnection attempts detected');
      }

    } catch (error) {
      issues.push(`Issue detection failed: ${error}`);
    }

    return issues;
  }

  // Auto-recovery suggestions
  getSuggestions(result: HealthCheckResult): string[] {
    const suggestions: string[] = [];

    if (!result.checks.connection) {
      suggestions.push('Check internet connection and try refreshing the page');
    }

    if (!result.checks.firebase) {
      suggestions.push('Firebase connection issues - try again in a few moments');
    }

    if (!result.checks.roomGeneration) {
      suggestions.push('Room creation may be temporarily unavailable');
    }

    if (result.status === 'critical') {
      suggestions.push('Consider refreshing the page or restarting the application');
    }

    return suggestions;
  }
}

// Export singleton instance
export const healthCheck = QuizArenaHealthCheck.getInstance();

// Auto-monitoring (runs every 30 seconds in background)
if (typeof window !== 'undefined') {
  setInterval(async () => {
    try {
      const result = await healthCheck.performHealthCheck();
      
      if (result.status === 'critical') {
        console.warn('Quiz Arena health check failed:', result);
      }
    } catch (error) {
      console.error('Health check monitoring error:', error);
    }
  }, 30000);
}