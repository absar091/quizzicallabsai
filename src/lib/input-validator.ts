// Input validation utilities to prevent injection attacks
import { z } from 'zod';

// Sanitize string input
export function sanitizeString(input: string, maxLength = 1000): string {
  return input
    .replace(/[<>\"'&]/g, '') // Remove HTML/script chars
    .replace(/[\r\n\t]/g, ' ') // Replace line breaks with spaces
    .trim()
    .substring(0, maxLength);
}

// Validate email format
export function validateEmail(email: string): boolean {
  const emailSchema = z.string().email();
  return emailSchema.safeParse(email).success;
}

// Validate URL format and prevent SSRF
export function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && 
           !parsed.hostname.includes('localhost') &&
           !parsed.hostname.includes('127.0.0.1') &&
           !parsed.hostname.includes('0.0.0.0');
  } catch {
    return false;
  }
}

// Validate file path to prevent traversal
export function validateFilePath(path: string): boolean {
  return !path.includes('..') && 
         !path.includes('~') && 
         !/[<>:"|?*]/.test(path) &&
         path.length < 255;
}

// Sanitize for logging
export function sanitizeForLog(data: any): string {
  if (typeof data === 'string') {
    return data.replace(/[\r\n\t]/g, ' ').substring(0, 200);
  }
  return JSON.stringify(data).replace(/[\r\n\t]/g, ' ').substring(0, 200);
}

// Input validator class
export class InputValidator {
  static sanitizeString = sanitizeString;
  static validateEmail = validateEmail;
  static validateUrl = validateUrl;
  static validateFilePath = validateFilePath;
  static sanitizeForLog = sanitizeForLog;
}