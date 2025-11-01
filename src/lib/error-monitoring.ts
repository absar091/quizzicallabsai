// Enhanced Error Monitoring System for QuizzicalLabzᴬᴵ

interface ErrorContext {
  userId?: string;
  userAgent?: string;
  url?: string;
  timestamp: string;
  sessionId?: string;
  buildVersion?: string;
  environment: string;
}

interface ErrorReport {
  message: string;
  stack?: string;
  level: 'error' | 'warning' | 'info';
  context: ErrorContext;
  fingerprint?: string;
}

class ErrorMonitoring {
  private static instance: ErrorMonitoring;
  private isInitialized = false;

  static getInstance(): ErrorMonitoring {
    if (!ErrorMonitoring.instance) {
      ErrorMonitoring.instance = new ErrorMonitoring();
    }
    return ErrorMonitoring.instance;
  }

  initialize() {
    if (this.isInitialized) return;

    // Global error handler for unhandled errors
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.captureError(event.error, {
          level: 'error',
          context: {
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
          }
        });
      });

      // Handle unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.captureError(new Error(event.reason), {
          level: 'error',
          context: {
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
          }
        });
      });
    }

    this.isInitialized = true;
  }

  captureError(error: Error, options: {
    level: 'error' | 'warning' | 'info';
    context: Partial<ErrorContext>;
    tags?: Record<string, string>;
  }) {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      level: options.level,
      context: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        buildVersion: process.env.npm_package_version || '1.0.0',
        ...options.context
      },
      fingerprint: this.generateFingerprint(error)
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured:', errorReport);
    }

    // Send to monitoring service
    this.sendToMonitoringService(errorReport, options.tags);

    // Store locally for offline scenarios
    this.storeLocalError(errorReport);
  }

  private generateFingerprint(error: Error): string {
    // Create a unique fingerprint for error grouping
    const content = `${error.name}-${error.message}-${error.stack?.split('\n')[1] || ''}`;
    return btoa(content).substring(0, 16);
  }

  private async sendToMonitoringService(errorReport: ErrorReport, tags?: Record<string, string>) {
    try {
      // Send to internal API endpoint
      await fetch('/api/monitoring/error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...errorReport,
          tags
        })
      });

      // If external monitoring service is configured
      if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        // Send to Sentry (example)
        this.sendToSentry(errorReport, tags);
      }

    } catch (monitoringError) {
      console.error('Failed to send error to monitoring service:', monitoringError);
    }
  }

  private sendToSentry(errorReport: ErrorReport, tags?: Record<string, string>) {
    // Sentry integration (if configured)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(new Error(errorReport.message), {
        level: errorReport.level,
        tags,
        contexts: {
          error_context: errorReport.context
        }
      });
    }
  }

  private storeLocalError(errorReport: ErrorReport) {
    try {
      if (typeof window !== 'undefined') {
        const errors = JSON.parse(localStorage.getItem('error_reports') || '[]');
        errors.push(errorReport);
        
        // Keep only last 50 errors
        if (errors.length > 50) {
          errors.splice(0, errors.length - 50);
        }
        
        localStorage.setItem('error_reports', JSON.stringify(errors));
      }
    } catch (storageError) {
      console.error('Failed to store error locally:', storageError);
    }
  }

  // Method to capture custom errors with context
  captureMessage(message: string, level: 'error' | 'warning' | 'info' = 'info', context?: Partial<ErrorContext>) {
    this.captureError(new Error(message), {
      level,
      context: context || {}
    });
  }

  // Method to capture API errors
  captureAPIError(endpoint: string, status: number, response: any, context?: Partial<ErrorContext>) {
    this.captureError(new Error(`API Error: ${endpoint} returned ${status}`), {
      level: 'error',
      context: {
        ...context,
        url: endpoint
      },
      tags: {
        api_endpoint: endpoint,
        status_code: status.toString(),
        response_type: typeof response
      }
    });
  }

  // Method to capture performance issues
  capturePerformanceIssue(metric: string, value: number, threshold: number, context?: Partial<ErrorContext>) {
    if (value > threshold) {
      this.captureError(new Error(`Performance issue: ${metric} (${value}ms) exceeded threshold (${threshold}ms)`), {
        level: 'warning',
        context: context || {},
        tags: {
          performance_metric: metric,
          value: value.toString(),
          threshold: threshold.toString()
        }
      });
    }
  }

  // Get stored errors for debugging
  getStoredErrors(): ErrorReport[] {
    try {
      if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem('error_reports') || '[]');
      }
    } catch (error) {
      console.error('Failed to retrieve stored errors:', error);
    }
    return [];
  }

  // Clear stored errors
  clearStoredErrors() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('error_reports');
      }
    } catch (error) {
      console.error('Failed to clear stored errors:', error);
    }
  }
}

// Export singleton instance
export const errorMonitoring = ErrorMonitoring.getInstance();

// React Error Boundary hook
export function useErrorHandler() {
  return {
    captureError: (error: Error, context?: Partial<ErrorContext>) => {
      errorMonitoring.captureError(error, {
        level: 'error',
        context: context || {}
      });
    },
    captureMessage: (message: string, level: 'error' | 'warning' | 'info' = 'info') => {
      errorMonitoring.captureMessage(message, level);
    }
  };
}

// Initialize error monitoring
if (typeof window !== 'undefined') {
  errorMonitoring.initialize();
}