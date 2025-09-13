// Error logging and monitoring system for Quizzicallabs AI

interface ErrorLog {
  id: string;
  timestamp: string;
  userId?: string;
  sessionId: string;
  error: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
  context: {
    operation: string;
    component: string;
    userAgent: string;
    url: string;
    userPlan?: string;
    isPro?: boolean;
  };
  metadata: {
    retryCount?: number;
    apiEndpoint?: string;
    requestId?: string;
    responseTime?: number;
    userFeedback?: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

interface PerformanceMetric {
  id: string;
  timestamp: string;
  operation: string;
  duration: number;
  success: boolean;
  metadata: Record<string, any>;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private logs: ErrorLog[] = [];
  private metrics: PerformanceMetric[] = [];
  private maxLogs = 100; // Keep last 100 logs in memory
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        this.logError(new Error(event.reason), {
          operation: 'unhandled_promise_rejection',
          component: 'global',
          severity: 'high'
        });
      });

      // Handle global JavaScript errors
      window.addEventListener('error', (event) => {
        this.logError(event.error || new Error(event.message), {
          operation: 'javascript_error',
          component: 'global',
          severity: 'high'
        });
      });
    }
  }

  logError(
    error: Error | string | any,
    context: {
      operation: string;
      component: string;
      severity?: 'low' | 'medium' | 'high' | 'critical';
      userId?: string;
      userPlan?: string;
      retryCount?: number;
      apiEndpoint?: string;
      requestId?: string;
      responseTime?: number;
    }
  ) {
    try {
      // Enhanced error handling for various error types
      let errorObj: Error;

      if (!error) {
        // Handle null/undefined
        errorObj = new Error('Unknown error occurred (received null/undefined)');
      } else if (typeof error === 'object' && Object.keys(error).length === 0) {
        // Handle empty objects - this is specifically the issue we're seeing
        errorObj = new Error('Empty error object received');
      } else if (typeof error === 'string') {
        errorObj = new Error(error);
      } else if (error instanceof Error) {
        errorObj = error;
      } else {
        // Handle objects that aren't proper Error instances
        let errorMsg = '';
        try {
          // Try to extract meaningful information from the object
          if (error?.message) {
            errorMsg = error.message;
          } else if (error?.toString && error.toString !== Object.prototype.toString) {
            errorMsg = error.toString();
          } else {
            // If object has properties, try to stringify them
            errorMsg = `Object error: ${JSON.stringify(error).slice(0, 200)}`;
          }

          if (!errorMsg || errorMsg === '{}' || errorMsg === '[object Object]') {
            errorMsg = 'Object error without meaningful message';
          }
        } catch (stringifyError) {
          errorMsg = `Unparseable error object: ${typeof error}`;
        }

        errorObj = new Error(errorMsg);
        // Create a more detailed stack trace
        errorObj.stack = `Error object details: ${JSON.stringify(error, null, 2)}\nOriginal stack: ${new Error().stack}`;
      }

      // Ensure we have valid error properties
      if (!errorObj.name || errorObj.name === 'Error') {
        errorObj.name = 'QuizzicallabsError';
      }

      if (!errorObj.message || errorObj.message.length === 0) {
        errorObj.message = 'An error occurred without a message';
      }

      console.log('🔍 Debug: Error processing result:', {
        originalError: error,
        processedErrorName: errorObj.name,
        processedErrorMessage: errorObj.message,
        errorType: typeof error,
        isEmptyObject: error && typeof error === 'object' && Object.keys(error).length === 0
      });

      const logEntry: ErrorLog = {
        id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        userId: context.userId,
        sessionId: this.sessionId,
        error: {
          name: errorObj.name || 'UnknownError',
          message: errorObj.message || 'No message available',
          stack: errorObj.stack,
          code: (errorObj as any).code
        },
        context: {
          operation: context.operation,
          component: context.component,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          url: typeof window !== 'undefined' ? window.location.href : 'unknown',
          userPlan: context.userPlan,
          isPro: context.userPlan === 'Pro'
        },
        metadata: {
          retryCount: context.retryCount,
          apiEndpoint: context.apiEndpoint,
          requestId: context.requestId,
          responseTime: context.responseTime,
          originalErrorType: typeof error,
          originalErrorKeys: error && typeof error === 'object' ? Object.keys(error) : 'not-object'
        },
        severity: context.severity || 'medium',
        resolved: false
      };

      // Validate logEntry is not empty
      if (!logEntry.id || !logEntry.error.message) {
        console.error('🚨 CRITICAL: LogEntry is incomplete:', logEntry);
        // Create a guaranteed working log entry
        const fallbackLogEntry: ErrorLog = {
          id: `error_fallback_${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: context.userId,
          sessionId: this.sessionId,
          error: {
            name: 'ErrorProcessingFailure',
            message: 'Failed to create proper error log entry',
            stack: 'This is a fallback entry after processing failure'
          },
          context: {
            operation: context.operation || 'unknown',
            component: context.component || 'unknown',
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
            url: typeof window !== 'undefined' ? window.location.href : 'unknown',
            userPlan: context.userPlan || 'Unknown',
            isPro: false
          },
          metadata: {
            retryCount: context.retryCount || 0,
            originalError: JSON.stringify(error).slice(0, 500)
          },
          severity: 'high',
          resolved: false
        };
        this.logs.unshift(fallbackLogEntry);
        console.error('🚨 Fallback Error Logged:', fallbackLogEntry);
        return fallbackLogEntry.id;
      }

      this.logs.unshift(logEntry);

      // Keep only the most recent logs
      if (this.logs.length > this.maxLogs) {
        this.logs = this.logs.slice(0, this.maxLogs);
      }

      // Log to console in development with better formatting
      if (process.env.NODE_ENV === 'development') {
        console.group('🚨 Error Logged');
        console.log('Error Details:', {
          name: logEntry.error.name,
          message: logEntry.error.message,
          operation: logEntry.context.operation,
          component: logEntry.context.component,
          severity: logEntry.severity
        });
        console.log('Full Entry:', logEntry);
        console.groupEnd();
      }

      // Send to external logging service in production
      if (process.env.NODE_ENV === 'production') {
        this.sendToExternalService(logEntry);
      }

      return logEntry.id;

    } catch (criticalError) {
      // Ultimate fallback for when error logging itself fails
      console.error('🚨 CRITICAL: Error logger itself failed - original error:', error, 'logger error:', criticalError);

      const ultimateFallback: ErrorLog = {
        id: `error_critical_${Date.now()}`,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId || 'unknown',
        error: {
          name: 'CriticalErrorLoggerFailure',
          message: 'Error logger failed to process error properly',
          stack: 'This indicates the error logging system has a fundamental issue'
        },
        context: {
          operation: 'error_logging_critical_failure',
          component: 'error_logger_system',
          userAgent: 'unknown',
          url: 'unknown',
          userPlan: 'Unknown',
          isPro: false
        },
        metadata: {
          originalError: error ? JSON.stringify(error).slice(0, 200) : 'undefined/null original error',
          loggerError: criticalError instanceof Error ? criticalError.message : String(criticalError)
        },
        severity: 'critical',
        resolved: false
      };

      try {
        this.logs.unshift(ultimateFallback);
        console.error('🚨 Ultimate Fallback Error Logged:', ultimateFallback);
      } catch {
        // If even this fails, log directly to console
        console.error('🚨 LOGGING SYSTEM FAILURE - EVEN FALLBACK FAILED');
        console.error('Original error:', error, 'Critical error:', criticalError);
      }

      return ultimateFallback.id;
    }
  }

  logPerformanceMetric(
    operation: string,
    duration: number,
    success: boolean,
    metadata: Record<string, any> = {}
  ) {
    const metric: PerformanceMetric = {
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      operation,
      duration,
      success,
      metadata
    };

    this.metrics.unshift(metric);

    // Keep only recent metrics
    if (this.metrics.length > 500) {
      this.metrics = this.metrics.slice(0, 500);
    }

    // Log slow operations
    if (duration > 5000) {
      this.logError(
        new Error(`Slow operation: ${operation} took ${duration}ms`),
        {
          operation,
          component: 'performance',
          severity: 'low'
        }
      );
    }
  }

  private async sendToExternalService(logEntry: ErrorLog) {
    try {
      // This would integrate with services like Sentry, LogRocket, etc.
      // For now, we'll just store in localStorage for debugging
      const existingLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      existingLogs.unshift(logEntry);
      if (existingLogs.length > 50) {
        existingLogs.splice(50);
      }
      localStorage.setItem('errorLogs', JSON.stringify(existingLogs));
    } catch (error) {
      console.error('Failed to send error to external service:', error);
    }
  }

  getLogs(filters?: {
    severity?: string;
    operation?: string;
    component?: string;
    resolved?: boolean;
    limit?: number;
  }): ErrorLog[] {
    let filteredLogs = [...this.logs];

    if (filters) {
      if (filters.severity) {
        filteredLogs = filteredLogs.filter(log => log.severity === filters.severity);
      }
      if (filters.operation) {
        filteredLogs = filteredLogs.filter(log => log.context.operation === filters.operation);
      }
      if (filters.component) {
        filteredLogs = filteredLogs.filter(log => log.context.component === filters.component);
      }
      if (filters.resolved !== undefined) {
        filteredLogs = filteredLogs.filter(log => log.resolved === filters.resolved);
      }
      if (filters.limit) {
        filteredLogs = filteredLogs.slice(0, filters.limit);
      }
    }

    return filteredLogs;
  }

  getMetrics(filters?: {
    operation?: string;
    success?: boolean;
    limit?: number;
  }): PerformanceMetric[] {
    let filteredMetrics = [...this.metrics];

    if (filters) {
      if (filters.operation) {
        filteredMetrics = filteredMetrics.filter(metric => metric.operation === filters.operation);
      }
      if (filters.success !== undefined) {
        filteredMetrics = filteredMetrics.filter(metric => metric.success === filters.success);
      }
      if (filters.limit) {
        filteredMetrics = filteredMetrics.slice(0, filters.limit);
      }
    }

    return filteredMetrics;
  }

  markResolved(logId: string) {
    const log = this.logs.find(l => l.id === logId);
    if (log) {
      log.resolved = true;
    }
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  clearLogs() {
    this.logs = [];
  }

  getSessionId(): string {
    return this.sessionId;
  }

  // Analytics helpers
  getErrorRate(operation?: string): number {
    const relevantLogs = operation
      ? this.logs.filter(log => log.context.operation === operation)
      : this.logs;

    const totalOperations = this.metrics.filter(m => !operation || m.operation === operation).length;
    const errorCount = relevantLogs.length;

    return totalOperations > 0 ? (errorCount / totalOperations) * 100 : 0;
  }

  getAverageResponseTime(operation?: string): number {
    const relevantMetrics = operation
      ? this.metrics.filter(m => m.operation === operation)
      : this.metrics;

    if (relevantMetrics.length === 0) return 0;

    const totalTime = relevantMetrics.reduce((sum, m) => sum + m.duration, 0);
    return totalTime / relevantMetrics.length;
  }
}

// Performance monitoring decorator
export function withPerformanceMonitoring<T extends (...args: any[]) => Promise<any>>(
  operation: string,
  fn: T
): T {
  return (async (...args: any[]) => {
    const logger = ErrorLogger.getInstance();
    const startTime = Date.now();

    try {
      const result = await fn(...args);
      const duration = Date.now() - startTime;

      logger.logPerformanceMetric(operation, duration, true, {
        args: args.length,
        resultType: typeof result
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      logger.logPerformanceMetric(operation, duration, false, {
        error: error instanceof Error ? error.message : String(error)
      });

      throw error;
    }
  }) as T;
}

// Error boundary helper
export function logErrorBoundary(
  error: Error,
  errorInfo: { componentStack: string },
  componentName: string,
  userId?: string
) {
  const logger = ErrorLogger.getInstance();

  logger.logError(error, {
    operation: 'react_error_boundary',
    component: componentName,
    severity: 'high',
    userId
  });
}

// API error helper
export function logApiError(
  error: Error | string,
  endpoint: string,
  method: string,
  userId?: string,
  retryCount?: number
) {
  const logger = ErrorLogger.getInstance();

  logger.logError(error, {
    operation: `api_${method.toLowerCase()}`,
    component: 'api',
    severity: 'medium',
    userId,
    apiEndpoint: endpoint,
    retryCount
  });
}

// Export singleton instance
export const errorLogger = ErrorLogger.getInstance();

// Helper hooks for React components
export function useErrorLogger() {
  return {
    logError: (error: Error | string, context: Parameters<ErrorLogger['logError']>[1]) =>
      errorLogger.logError(error, context),
    logPerformance: (operation: string, duration: number, success: boolean, metadata?: Record<string, any>) =>
      errorLogger.logPerformanceMetric(operation, duration, success, metadata),
    getLogs: (filters?: Parameters<ErrorLogger['getLogs']>[0]) =>
      errorLogger.getLogs(filters),
    getMetrics: (filters?: Parameters<ErrorLogger['getMetrics']>[0]) =>
      errorLogger.getMetrics(filters)
  };
}
