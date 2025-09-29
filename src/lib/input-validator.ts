/**
 * Input validation utilities to prevent various injection attacks
 */

import { URL } from 'url';
import path from 'path';

export class InputValidator {
  /**
   * Validates and sanitizes email addresses
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  /**
   * Sanitizes HTML content to prevent XSS
   */
  static sanitizeHtml(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Validates file paths to prevent path traversal attacks
   */
  static validateFilePath(filePath: string, allowedDirectory: string): boolean {
    try {
      const normalizedPath = path.normalize(filePath);
      const normalizedAllowedDir = path.normalize(allowedDirectory);
      
      // Check for path traversal attempts
      if (normalizedPath.includes('..')) {
        return false;
      }
      
      // Ensure path is within allowed directory
      const resolvedPath = path.resolve(normalizedAllowedDir, normalizedPath);
      return resolvedPath.startsWith(path.resolve(normalizedAllowedDir));
    } catch {
      return false;
    }
  }

  /**
   * Validates URLs to prevent SSRF attacks
   */
  static validateUrl(url: string, allowedHosts?: string[]): boolean {
    try {
      const parsedUrl = new URL(url);
      
      // Only allow HTTPS
      if (parsedUrl.protocol !== 'https:') {
        return false;
      }
      
      // Block private IP ranges
      const hostname = parsedUrl.hostname;
      const privateIpRanges = [
        /^127\./,           // 127.0.0.0/8
        /^10\./,            // 10.0.0.0/8
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // 172.16.0.0/12
        /^192\.168\./,      // 192.168.0.0/16
        /^169\.254\./,      // 169.254.0.0/16 (link-local)
        /^::1$/,            // IPv6 localhost
        /^fc00:/,           // IPv6 unique local
        /^fe80:/            // IPv6 link-local
      ];
      
      if (privateIpRanges.some(range => range.test(hostname))) {
        return false;
      }
      
      // Check against allowed hosts if provided
      if (allowedHosts && !allowedHosts.includes(hostname)) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validates display names to prevent injection
   */
  static validateDisplayName(name: string): boolean {
    // Allow alphanumeric, spaces, and common punctuation
    const nameRegex = /^[a-zA-Z0-9\s\-_.,']+$/;
    return nameRegex.test(name) && name.length >= 1 && name.length <= 100;
  }

  /**
   * Validates redirect URLs to prevent open redirect attacks
   */
  static validateRedirectUrl(url: string, allowedDomains: string[]): boolean {
    try {
      const parsedUrl = new URL(url);
      return allowedDomains.includes(parsedUrl.hostname);
    } catch {
      // If it's a relative URL, it's safe
      return url.startsWith('/') && !url.startsWith('//');
    }
  }

  /**
   * Removes dangerous characters from user input
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
      .trim()
      .substring(0, 1000); // Limit length
  }
}