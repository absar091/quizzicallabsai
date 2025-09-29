// Input validation and sanitization utilities
export const inputValidator = {
  // Sanitize email input
  sanitizeEmail: (email: string): string => {
    return email.trim().toLowerCase().replace(/[^\w@.-]/g, '');
  },

  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Sanitize display name
  sanitizeDisplayName: (name: string): string => {
    return name.trim().replace(/[<>\"'&]/g, '').substring(0, 50);
  },

  // Validate redirect URL to prevent open redirects
  isValidRedirect: (url: string): boolean => {
    return url.startsWith('/') && !url.startsWith('//') && !url.includes('..') && url.length < 200;
  },

  // Sanitize user input for logging
  sanitizeForLog: (input: string): string => {
    return input.replace(/[\r\n]/g, ' ').substring(0, 100);
  }
};