// Security utilities for input sanitization and validation
import DOMPurify from 'isomorphic-dompurify';

// Sanitize HTML content to prevent XSS
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
    ALLOWED_ATTR: []
  });
}

// Sanitize log data to prevent log injection
export function sanitizeLog(data: any): string {
  if (typeof data === 'string') {
    return data.replace(/[\r\n\t]/g, ' ').substring(0, 200);
  }
  return JSON.stringify(data).replace(/[\r\n\t]/g, ' ').substring(0, 200);
}

// Validate file paths to prevent traversal
export function validatePath(path: string): boolean {
  return !path.includes('..') && !path.includes('~') && !/[<>:"|?*]/.test(path);
}

// Sanitize URLs to prevent SSRF
export function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && !parsed.hostname.includes('localhost');
  } catch {
    return false;
  }
}