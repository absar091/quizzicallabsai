import DOMPurify from 'dompurify';
import CryptoJS from 'crypto-js';

// Sanitize HTML content to prevent XSS
export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined') {
    // Server-side fallback - basic sanitization
    return dirty
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
  return DOMPurify.sanitize(dirty);
}

// Sanitize log input to prevent log injection
export function sanitizeLogInput(input: string): string {
  return input
    .replace(/[\r\n]/g, '_')
    .replace(/[\t]/g, ' ')
    .substring(0, 1000); // Limit length
}

// Time-safe string comparison to prevent timing attacks
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  const hashA = CryptoJS.SHA256(a).toString();
  const hashB = CryptoJS.SHA256(b).toString();
  
  return hashA === hashB;
}

// Validate and sanitize user input
export function validateInput(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    .substring(0, maxLength)
    .replace(/[<>]/g, ''); // Remove potential HTML tags
}

// Generate safe ID for database operations
export function generateSafeId(input: string): string {
  return CryptoJS.SHA256(input)
    .toString()
    .substring(0, 32)
    .replace(/[^a-zA-Z0-9]/g, '');
}