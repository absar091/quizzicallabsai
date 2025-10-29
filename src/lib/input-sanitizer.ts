// Input sanitization utilities for security
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase().replace(/[<>\"'&]/g, '');
}

export function sanitizeCode(code: string): string {
  if (!code || typeof code !== 'string') return '';
  return code.replace(/\D/g, '').slice(0, 6);
}

export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input.replace(/[<>\"'&]/g, '').substring(0, 100);
}