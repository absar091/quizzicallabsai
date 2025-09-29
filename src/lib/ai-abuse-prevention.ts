/**
 * AI Abuse Prevention System
 */

import { AIRateLimiter } from './ai-rate-limiter';
import { SecureLogger } from './secure-logger';
import { ContentSafetyFilter } from './content-safety-filter';

interface AbusePattern {
  userId: string;
  pattern: 'rapid_requests' | 'identical_requests' | 'large_requests' | 'suspicious_content';
  count: number;
  firstSeen: number;
  lastSeen: number;
}

export class AIAbusePreventionSystem {
  private static instance: AIAbusePreventionSystem;
  private rateLimiter = AIRateLimiter.getInstance();
  private abusePatterns: Map<string, AbusePattern> = new Map();
  private requestHashes: Map<string, { hash: string; timestamp: number }[]> = new Map();

  private constructor() {
    // Cleanup every 10 minutes
    setInterval(() => this.cleanup(), 10 * 60 * 1000);
  }

  static getInstance(): AIAbusePreventionSystem {
    if (!AIAbusePreventionSystem.instance) {
      AIAbusePreventionSystem.instance = new AIAbusePreventionSystem();
    }
    return AIAbusePreventionSystem.instance;
  }

  /**
   * Check if AI request should be allowed
   */
  async checkRequest(
    userId: string,
    operation: 'quiz_generation' | 'flashcard_generation' | 'explanation_generation' | 'image_analysis',
    requestData: any,
    isPro: boolean = false
  ): Promise<{ allowed: boolean; reason?: string; waitTime?: number }> {
    
    // 1. Rate limiting check
    const rateLimitResult = this.rateLimiter.canMakeRequest(userId, operation, isPro);
    if (!rateLimitResult.allowed) {
      SecureLogger.warn(`Rate limit exceeded for user ${userId.substring(0, 8)}... operation: ${operation}`);
      return rateLimitResult;
    }

    // 2. Check for abuse patterns
    const abuseCheck = this.checkAbusePatterns(userId, operation, requestData);
    if (!abuseCheck.allowed) {
      return abuseCheck;
    }

    // 3. Content validation
    const contentCheck = this.validateRequestContent(requestData);
    if (!contentCheck.allowed) {
      this.recordAbusePattern(userId, 'suspicious_content');
      return contentCheck;
    }

    // 4. Check for duplicate requests
    const duplicateCheck = this.checkDuplicateRequests(userId, requestData);
    if (!duplicateCheck.allowed) {
      this.recordAbusePattern(userId, 'identical_requests');
      return duplicateCheck;
    }

    // Record successful request
    this.recordRequest(userId, requestData);
    return { allowed: true };
  }

  /**
   * Check for abuse patterns
   */
  private checkAbusePatterns(userId: string, operation: string, requestData: any): { allowed: boolean; reason?: string } {
    const key = `${userId}:${operation}`;
    const pattern = this.abusePatterns.get(key);
    
    if (!pattern) return { allowed: true };

    const now = Date.now();
    const timeSinceFirst = now - pattern.firstSeen;
    
    // Permanent ban for severe abuse
    if (pattern.count >= 50 && timeSinceFirst < 24 * 60 * 60 * 1000) {
      const { AccountBanSystem } = require('./account-ban-system');
      const banSystem = AccountBanSystem.getInstance();
      banSystem.banAccount(userId, 'unknown@email.com', `Severe abuse pattern: ${pattern.pattern}`, true);
      
      SecureLogger.warn(`User ${userId.substring(0, 8)}... permanently banned for abuse pattern: ${pattern.pattern}`);
      return { 
        allowed: false, 
        reason: 'Account permanently banned for policy violations. Contact support@quizzicallabs.com if this is an error.' 
      };
    }

    // Progressive penalties
    if (pattern.count >= 20) {
      return { 
        allowed: false, 
        reason: 'Too many suspicious requests. Please wait before trying again.' 
      };
    }

    return { allowed: true };
  }

  /**
   * Validate request content for suspicious patterns
   */
  private validateRequestContent(requestData: any): { allowed: boolean; reason?: string } {
    const content = JSON.stringify(requestData).toLowerCase();
    
    // Check for harmful/inappropriate content
    const safetyCheck = ContentSafetyFilter.checkContent(
      content, 
      requestData.subject || requestData.topic
    );
    
    if (!safetyCheck.isSafe) {
      SecureLogger.warn(`Harmful content detected in AI request`);
      return {
        allowed: false,
        reason: safetyCheck.reason + '. ' + (safetyCheck.suggestion || '')
      };
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /hack|exploit|inject|script|eval|exec/,
      /\b(admin|root|system|config)\b/,
      /password|credential|token|key/,
      /<script|javascript:|data:/,
      /\.\.\//  // Path traversal
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        SecureLogger.warn(`Suspicious content detected in AI request: ${pattern.source}`);
        return { 
          allowed: false, 
          reason: 'Request contains suspicious content and has been blocked.' 
        };
      }
    }

    // Check request size (prevent large payload abuse)
    if (content.length > 50000) { // 50KB limit
      return { 
        allowed: false, 
        reason: 'Request too large. Please reduce the content size.' 
      };
    }

    return { allowed: true };
  }

  /**
   * Check for duplicate/identical requests
   */
  private checkDuplicateRequests(userId: string, requestData: any): { allowed: boolean; reason?: string } {
    const requestHash = this.hashRequest(requestData);
    const userHashes = this.requestHashes.get(userId) || [];
    const now = Date.now();
    
    // Check for identical requests in last 5 minutes
    const recentDuplicates = userHashes.filter(
      h => h.hash === requestHash && (now - h.timestamp) < 5 * 60 * 1000
    );
    
    if (recentDuplicates.length >= 3) {
      return { 
        allowed: false, 
        reason: 'Identical request detected. Please wait before submitting the same request again.' 
      };
    }

    return { allowed: true };
  }

  /**
   * Record abuse pattern
   */
  private recordAbusePattern(userId: string, patternType: AbusePattern['pattern']): void {
    const key = `${userId}:${patternType}`;
    const existing = this.abusePatterns.get(key);
    const now = Date.now();
    
    if (existing) {
      existing.count++;
      existing.lastSeen = now;
    } else {
      this.abusePatterns.set(key, {
        userId,
        pattern: patternType,
        count: 1,
        firstSeen: now,
        lastSeen: now
      });
    }
    
    SecureLogger.warn(`Abuse pattern recorded for user ${userId.substring(0, 8)}...: ${patternType}`);
  }

  /**
   * Record successful request
   */
  private recordRequest(userId: string, requestData: any): void {
    const requestHash = this.hashRequest(requestData);
    const userHashes = this.requestHashes.get(userId) || [];
    
    userHashes.push({
      hash: requestHash,
      timestamp: Date.now()
    });
    
    // Keep only last 10 requests
    if (userHashes.length > 10) {
      userHashes.shift();
    }
    
    this.requestHashes.set(userId, userHashes);
  }

  /**
   * Simple hash function for request deduplication
   */
  private hashRequest(requestData: any): string {
    const str = JSON.stringify(requestData);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  /**
   * Get user's current status
   */
  getUserStatus(userId: string): {
    isRestricted: boolean;
    abuseCount: number;
    remainingQuizzes: number;
    remainingFlashcards: number;
  } {
    const abusePatterns = Array.from(this.abusePatterns.values())
      .filter(p => p.userId === userId);
    
    const totalAbuseCount = abusePatterns.reduce((sum, p) => sum + p.count, 0);
    const isRestricted = totalAbuseCount >= 20;
    
    return {
      isRestricted,
      abuseCount: totalAbuseCount,
      remainingQuizzes: this.rateLimiter.getRemainingRequests(userId, 'quiz_generation', false),
      remainingFlashcards: this.rateLimiter.getRemainingRequests(userId, 'flashcard_generation', false)
    };
  }

  /**
   * Cleanup old data
   */
  private cleanup(): void {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    // Clean abuse patterns older than 7 days
    for (const [key, pattern] of this.abusePatterns.entries()) {
      if (now - pattern.lastSeen > 7 * dayMs) {
        this.abusePatterns.delete(key);
      }
    }
    
    // Clean old request hashes
    for (const [userId, hashes] of this.requestHashes.entries()) {
      const filtered = hashes.filter(h => now - h.timestamp < 60 * 60 * 1000); // Keep 1 hour
      if (filtered.length === 0) {
        this.requestHashes.delete(userId);
      } else {
        this.requestHashes.set(userId, filtered);
      }
    }
  }
}