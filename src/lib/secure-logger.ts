/**
 * Secure logging utility to prevent log injection attacks (CWE-117)
 */

export class SecureLogger {
  /**
   * Sanitizes input to prevent log injection attacks
   */
  private static sanitizeInput(input: any): string {
    if (typeof input !== 'string') {
      input = String(input);
    }
    
    // Remove or encode dangerous characters that could break log integrity
    return input
      .replace(/\r\n/g, '\\r\\n')  // Replace CRLF
      .replace(/\r/g, '\\r')       // Replace CR
      .replace(/\n/g, '\\n')       // Replace LF
      .replace(/\t/g, '\\t')       // Replace tabs
      .replace(/\x00/g, '\\0')     // Replace null bytes
      .replace(/[\x01-\x1F\x7F]/g, ''); // Remove other control characters
  }

  /**
   * Secure info logging
   */
  static info(message: string, ...args: any[]): void {
    const sanitizedMessage = this.sanitizeInput(message);
    const sanitizedArgs = args.map(arg => this.sanitizeInput(arg));
    console.info(`[INFO] ${sanitizedMessage}`, ...sanitizedArgs);
  }

  /**
   * Secure error logging
   */
  static error(message: string, error?: any): void {
    const sanitizedMessage = this.sanitizeInput(message);
    if (error) {
      const sanitizedError = this.sanitizeInput(error.message || error);
      console.error(`[ERROR] ${sanitizedMessage}`, sanitizedError);
    } else {
      console.error(`[ERROR] ${sanitizedMessage}`);
    }
  }

  /**
   * Secure warning logging
   */
  static warn(message: string, ...args: any[]): void {
    const sanitizedMessage = this.sanitizeInput(message);
    const sanitizedArgs = args.map(arg => this.sanitizeInput(arg));
    console.warn(`[WARN] ${sanitizedMessage}`, ...sanitizedArgs);
  }

  /**
   * Secure debug logging (only in development)
   */
  static debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      const sanitizedMessage = this.sanitizeInput(message);
      const sanitizedArgs = args.map(arg => this.sanitizeInput(arg));
      console.debug(`[DEBUG] ${sanitizedMessage}`, ...sanitizedArgs);
    }
  }
}