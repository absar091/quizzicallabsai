// 🔒 SECURE LOGGING SYSTEM - NO DATA EXPOSURE
// Replaces all console.log statements to prevent data leaks

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface SecureLogOptions {
  level: LogLevel;
  category?: string;
  sanitize?: boolean;
}

class SecureLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  // Sensitive data patterns to filter out
  private sensitivePatterns = [
    /api[_-]?key/i,
    /secret/i,
    /password/i,
    /token/i,
    /credential/i,
    /firebase/i,
    /auth/i,
    /question/i,
    /quiz/i,
    /answer/i,
    /correctIndex/i,
    /correctAnswer/i,
    /options/i,
    /uid/i,
    /email/i,
    /phone/i,
    /address/i
  ];

  private sanitizeData(data: any): any {
    if (this.isProduction) {
      return '[REDACTED - PRODUCTION]';
    }

    if (typeof data === 'string') {
      // Check if string contains sensitive information
      if (this.sensitivePatterns.some(pattern => pattern.test(data))) {
        return '[REDACTED - SENSITIVE]';
      }
      return data;
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (this.sensitivePatterns.some(pattern => pattern.test(key))) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeData(value);
        }
      }
      return sanitized;
    }

    return data;
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log errors
    if (this.isProduction) {
      return level === 'error';
    }
    
    // In development, log everything except debug in production builds
    return true;
  }

  info(message: string, data?: any, options?: SecureLogOptions) {
    if (!this.shouldLog('info')) return;
    
    const sanitizedData = data ? this.sanitizeData(data) : undefined;
    const prefix = options?.category ? `[${options.category}]` : '[INFO]';
    
    if (sanitizedData) {
      console.info(`${prefix} ${message}`, sanitizedData);
    } else {
      console.info(`${prefix} ${message}`);
    }
  }

  warn(message: string, data?: any, options?: SecureLogOptions) {
    if (!this.shouldLog('warn')) return;
    
    const sanitizedData = data ? this.sanitizeData(data) : undefined;
    const prefix = options?.category ? `[${options.category}]` : '[WARN]';
    
    if (sanitizedData) {
      console.warn(`${prefix} ${message}`, sanitizedData);
    } else {
      console.warn(`${prefix} ${message}`);
    }
  }

  error(message: string, error?: any, options?: SecureLogOptions) {
    if (!this.shouldLog('error')) return;
    
    const prefix = options?.category ? `[${options.category}]` : '[ERROR]';
    
    if (error) {
      // Only log error message and type, not full error object
      const safeError = {
        name: error.name || 'Unknown',
        message: error.message || 'Unknown error',
        code: error.code || undefined
      };
      console.error(`${prefix} ${message}`, safeError);
    } else {
      console.error(`${prefix} ${message}`);
    }
  }

  debug(message: string, data?: any, options?: SecureLogOptions) {
    if (!this.shouldLog('debug') || this.isProduction) return;
    
    const sanitizedData = data ? this.sanitizeData(data) : undefined;
    const prefix = options?.category ? `[${options.category}]` : '[DEBUG]';
    
    if (sanitizedData) {
      console.debug(`${prefix} ${message}`, sanitizedData);
    } else {
      console.debug(`${prefix} ${message}`);
    }
  }

  // Special method for quiz arena operations
  quizArena(message: string, data?: any) {
    if (this.isProduction) {
      // In production, only log basic status without data
      this.info(message, undefined, { level: 'info', category: 'QUIZ' });
    } else {
      // In development, sanitize quiz data
      const sanitizedData = data ? {
        roomCode: data.roomCode || '[REDACTED]',
        playerCount: data.playerCount || 0,
        status: data.status || 'unknown',
        // Never log actual questions or answers
        hasQuestions: data.quiz ? data.quiz.length > 0 : false,
        questionCount: data.quiz ? data.quiz.length : 0
      } : undefined;
      
      this.info(message, sanitizedData, { level: 'info', category: 'QUIZ' });
    }
  }

  // Method to completely disable logging in production
  production(message: string) {
    if (this.isDevelopment) {
      console.info(`[PROD-ONLY] ${message}`);
    }
  }
}

// Export singleton instance
export const secureLogger = new SecureLogger();

// Convenience exports
export const log = secureLogger;
export const logger = secureLogger;