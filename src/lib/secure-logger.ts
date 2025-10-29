// Secure logging utility to prevent log injection
export function sanitizeLogData(data: any): string {
  if (typeof data === 'string') {
    return data.replace(/[\r\n\t]/g, ' ').replace(/[<>\"'&]/g, '').substring(0, 500);
  }
  if (typeof data === 'object') {
    return JSON.stringify(data).replace(/[\r\n\t]/g, ' ').substring(0, 500);
  }
  return String(data).replace(/[\r\n\t]/g, ' ').substring(0, 500);
}

export function secureLog(level: 'info' | 'warn' | 'error', message: string, data?: any) {
  const sanitizedMessage = sanitizeLogData(message);
  const sanitizedData = data ? sanitizeLogData(data) : '';
  const timestamp = new Date().toISOString();
  
  switch (level) {
    case 'info':
      console.info(`[${timestamp}] ${sanitizedMessage}`, sanitizedData);
      break;
    case 'warn':
      console.warn(`[${timestamp}] ${sanitizedMessage}`, sanitizedData);
      break;
    case 'error':
      console.error(`[${timestamp}] ${sanitizedMessage}`, sanitizedData);
      break;
  }
}

// SecureLogger class for compatibility
export class SecureLogger {
  static log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    secureLog(level, message, data);
  }
  
  static info(message: string, data?: any) {
    secureLog('info', message, data);
  }
  
  static warn(message: string, data?: any) {
    secureLog('warn', message, data);
  }
  
  static error(message: string, data?: any) {
    secureLog('error', message, data);
  }
}

// Default export for compatibility
export default SecureLogger;