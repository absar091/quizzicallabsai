/**
 * Utility functions for sanitizing user input to prevent XSS attacks
 */

/**
 * Sanitize a string by removing potentially dangerous characters
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/[<>'"&]/g, (match) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[match] || match;
    })
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

/**
 * Sanitize URL parameters and slugs
 */
export function sanitizeSlug(slug: string): string {
  if (!slug) return '';
  
  return slug
    .replace(/[^a-zA-Z0-9-_]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Sanitize HTML content by removing script tags and dangerous attributes
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');
}