// Security utilities for input sanitization and validation

// Sanitize HTML content to prevent XSS
export function sanitizeHtml(html: string): string {
  // Simple HTML sanitization without external dependency
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
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

// Sanitize string input to prevent injection
export function sanitizeString(input: string): string {
  if (!input) return '';
  return input.replace(/[<>"'&]/g, (match) => {
    const entities: { [key: string]: string } = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;'
    };
    return entities[match] || match;
  }).substring(0, 100);
}