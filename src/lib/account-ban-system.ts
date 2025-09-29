/**
 * Account Ban System for Policy Violations
 */

import { SecureLogger } from './secure-logger';

interface BanRecord {
  userId: string;
  email: string;
  reason: string;
  bannedAt: number;
  banType: 'temporary' | 'permanent';
  expiresAt?: number;
}

export class AccountBanSystem {
  private static instance: AccountBanSystem;
  private bannedAccounts: Map<string, BanRecord> = new Map();
  private bannedEmails: Set<string> = new Set();

  private constructor() {}

  static getInstance(): AccountBanSystem {
    if (!AccountBanSystem.instance) {
      AccountBanSystem.instance = new AccountBanSystem();
    }
    return AccountBanSystem.instance;
  }

  /**
   * Ban account for policy violation
   */
  banAccount(userId: string, email: string, reason: string, permanent: boolean = true): void {
    const banRecord: BanRecord = {
      userId,
      email,
      reason,
      bannedAt: Date.now(),
      banType: permanent ? 'permanent' : 'temporary',
      expiresAt: permanent ? undefined : Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    this.bannedAccounts.set(userId, banRecord);
    this.bannedEmails.add(email.toLowerCase());

    SecureLogger.warn(`Account banned: ${userId.substring(0, 8)}... Email: ${email} Reason: ${reason}`);
  }

  /**
   * Check if account is banned
   */
  isAccountBanned(userId: string): { banned: boolean; reason?: string; contactSupport?: boolean } {
    const banRecord = this.bannedAccounts.get(userId);
    
    if (!banRecord) return { banned: false };

    // Check if temporary ban expired
    if (banRecord.banType === 'temporary' && banRecord.expiresAt && Date.now() > banRecord.expiresAt) {
      this.bannedAccounts.delete(userId);
      this.bannedEmails.delete(banRecord.email.toLowerCase());
      return { banned: false };
    }

    return {
      banned: true,
      reason: banRecord.reason,
      contactSupport: true
    };
  }

  /**
   * Check if email is banned
   */
  isEmailBanned(email: string): boolean {
    return this.bannedEmails.has(email.toLowerCase());
  }

  /**
   * Unban account (support use only)
   */
  unbanAccount(userId: string): boolean {
    const banRecord = this.bannedAccounts.get(userId);
    if (banRecord) {
      this.bannedAccounts.delete(userId);
      this.bannedEmails.delete(banRecord.email.toLowerCase());
      SecureLogger.info(`Account unbanned: ${userId.substring(0, 8)}...`);
      return true;
    }
    return false;
  }
}