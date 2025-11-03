import { db } from '@/lib/firebase';
import { ref, get, update, push, set } from 'firebase/database';
import { whopService, PLAN_LIMITS } from '@/lib/whop';

export interface UsageViolation {
  id: string;
  type: 'token_limit_exceeded' | 'quiz_limit_exceeded' | 'rate_limit_exceeded';
  attempted_usage: number;
  current_limit: number;
  plan: string;
  action_taken: 'blocked' | 'warning_sent' | 'account_suspended';
  timestamp: string;
  user_id: string;
}

export interface UsageWarning {
  tokens_warning_sent: boolean;
  quizzes_warning_sent: boolean;
  limit_reached_notifications: number;
  last_warning_sent: string;
}

class UsageController {
  // Check if user can perform action before allowing it
  async checkUsagePermission(
    userId: string, 
    actionType: 'token' | 'quiz', 
    amount: number = 1
  ): Promise<{
    allowed: boolean;
    reason?: string;
    remainingUsage?: number;
    warningLevel?: 'none' | 'low' | 'critical' | 'exceeded';
  }> {
    try {
      const userRef = ref(db, `users/${userId}/subscription`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        // Initialize user if not exists
        await whopService.initializeUser(userId, '', '');
        return { allowed: true, warningLevel: 'none' };
      }

      const subscription = snapshot.val();
      const currentUsage = actionType === 'token' ? subscription.tokens_used || 0 : subscription.quizzes_used || 0;
      const limit = actionType === 'token' ? subscription.tokens_limit || PLAN_LIMITS.free.tokens : subscription.quizzes_limit || PLAN_LIMITS.free.quizzes;
      const remaining = limit - currentUsage;

      // Check if action would exceed limit
      if (currentUsage + amount > limit) {
        await this.logUsageViolation(userId, actionType, amount, limit, subscription.plan);
        return {
          allowed: false,
          reason: `${actionType === 'token' ? 'Token' : 'Quiz'} limit exceeded. Upgrade your plan to continue.`,
          remainingUsage: 0,
          warningLevel: 'exceeded'
        };
      }

      // Determine warning level
      const usagePercentage = ((currentUsage + amount) / limit) * 100;
      let warningLevel: 'none' | 'low' | 'critical' | 'exceeded' = 'none';
      
      if (usagePercentage >= 100) warningLevel = 'exceeded';
      else if (usagePercentage >= 90) warningLevel = 'critical';
      else if (usagePercentage >= 75) warningLevel = 'low';

      // Send warnings if needed
      if (warningLevel !== 'none') {
        await this.sendUsageWarning(userId, actionType, usagePercentage, remaining);
      }

      return {
        allowed: true,
        remainingUsage: remaining - amount,
        warningLevel
      };
    } catch (error) {
      console.error('❌ Usage permission check failed:', error);
      return { allowed: false, reason: 'Unable to verify usage limits' };
    }
  }

  // Log usage violations for analytics and monitoring
  private async logUsageViolation(
    userId: string,
    actionType: 'token' | 'quiz',
    attemptedUsage: number,
    currentLimit: number,
    plan: string
  ): Promise<void> {
    try {
      const violationRef = push(ref(db, `usage_violations/${userId}`));
      const violation: Omit<UsageViolation, 'id'> = {
        type: actionType === 'token' ? 'token_limit_exceeded' : 'quiz_limit_exceeded',
        attempted_usage: attemptedUsage,
        current_limit: currentLimit,
        plan,
        action_taken: 'blocked',
        timestamp: new Date().toISOString(),
        user_id: userId,
      };

      await set(violationRef, violation);
      console.log('📊 Usage violation logged:', violation);
    } catch (error) {
      console.error('❌ Failed to log usage violation:', error);
    }
  }

  // Send usage warnings to users
  private async sendUsageWarning(
    userId: string,
    actionType: 'token' | 'quiz',
    usagePercentage: number,
    remaining: number
  ): Promise<void> {
    try {
      const warningsRef = ref(db, `users/${userId}/usage_warnings`);
      const snapshot = await get(warningsRef);
      const warnings: UsageWarning = snapshot.exists() ? snapshot.val() : {
        tokens_warning_sent: false,
        quizzes_warning_sent: false,
        limit_reached_notifications: 0,
        last_warning_sent: '',
      };

      const warningKey = actionType === 'token' ? 'tokens_warning_sent' : 'quizzes_warning_sent';
      const now = new Date().toISOString();
      const lastWarning = new Date(warnings.last_warning_sent || 0);
      const hoursSinceLastWarning = (Date.now() - lastWarning.getTime()) / (1000 * 60 * 60);

      // Only send warning if:
      // 1. Haven't sent this type of warning yet, OR
      // 2. It's been more than 24 hours since last warning, OR
      // 3. Usage is critical (>90%)
      const shouldSendWarning = 
        !warnings[warningKey] || 
        hoursSinceLastWarning > 24 || 
        usagePercentage >= 90;

      if (shouldSendWarning) {
        // Update warning status
        await update(warningsRef, {
          [warningKey]: true,
          limit_reached_notifications: warnings.limit_reached_notifications + 1,
          last_warning_sent: now,
        });

        // Send email notification
        await this.sendUsageWarningEmail(userId, actionType, usagePercentage, remaining);
        
        console.log(`⚠️ Usage warning sent to user ${userId}: ${actionType} at ${usagePercentage.toFixed(1)}%`);
      }
    } catch (error) {
      console.error('❌ Failed to send usage warning:', error);
    }
  }

  // Send email notification about usage limits
  private async sendUsageWarningEmail(
    userId: string,
    actionType: 'token' | 'quiz',
    usagePercentage: number,
    remaining: number
  ): Promise<void> {
    try {
      // Get user info
      const userRef = ref(db, `users/${userId}`);
      const userSnapshot = await get(userRef);
      
      if (!userSnapshot.exists()) return;
      
      const userData = userSnapshot.val();
      const email = userData.email;
      const name = userData.fullName || userData.displayName || 'User';
      const plan = userData.subscription?.plan || 'free';

      if (!email) return;

      // Prepare email content
      const resourceType = actionType === 'token' ? 'AI tokens' : 'quiz creations';
      const warningLevel = usagePercentage >= 90 ? 'CRITICAL' : 'WARNING';
      
      const emailData = {
        to: email,
        subject: `${warningLevel}: ${resourceType} usage at ${usagePercentage.toFixed(1)}%`,
        template: 'usage-warning',
        data: {
          name,
          resourceType,
          usagePercentage: usagePercentage.toFixed(1),
          remaining,
          plan,
          upgradeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
          warningLevel,
        },
      };

      // Send email via your email service
      await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });

    } catch (error) {
      console.error('❌ Failed to send usage warning email:', error);
    }
  }

  // Get user's usage analytics
  async getUserUsageAnalytics(userId: string): Promise<{
    currentUsage: {
      tokens: { used: number; limit: number; percentage: number };
      quizzes: { used: number; limit: number; percentage: number };
    };
    monthlyTrend: Array<{ month: string; tokens: number; quizzes: number }>;
    violations: UsageViolation[];
    warnings: UsageWarning;
  } | null> {
    try {
      // Get current usage
      const userRef = ref(db, `users/${userId}/subscription`);
      const userSnapshot = await get(userRef);
      
      if (!userSnapshot.exists()) return null;
      
      const subscription = userSnapshot.val();
      
      // Get monthly usage trend (last 6 months)
      const now = new Date();
      const monthlyTrend = [];
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        
        const usageRef = ref(db, `usage/${userId}/${year}/${month}`);
        const usageSnapshot = await get(usageRef);
        
        monthlyTrend.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          tokens: usageSnapshot.exists() ? usageSnapshot.val().tokens_used || 0 : 0,
          quizzes: usageSnapshot.exists() ? usageSnapshot.val().quizzes_created || 0 : 0,
        });
      }

      // Get violations
      const violationsRef = ref(db, `usage_violations/${userId}`);
      const violationsSnapshot = await get(violationsRef);
      const violations: UsageViolation[] = violationsSnapshot.exists() 
        ? Object.entries(violationsSnapshot.val()).map(([id, data]: [string, any]) => ({ id, ...data }))
        : [];

      // Get warnings
      const warningsRef = ref(db, `users/${userId}/usage_warnings`);
      const warningsSnapshot = await get(warningsRef);
      const warnings: UsageWarning = warningsSnapshot.exists() ? warningsSnapshot.val() : {
        tokens_warning_sent: false,
        quizzes_warning_sent: false,
        limit_reached_notifications: 0,
        last_warning_sent: '',
      };

      return {
        currentUsage: {
          tokens: {
            used: subscription.tokens_used || 0,
            limit: subscription.tokens_limit || PLAN_LIMITS.free.tokens,
            percentage: ((subscription.tokens_used || 0) / (subscription.tokens_limit || PLAN_LIMITS.free.tokens)) * 100,
          },
          quizzes: {
            used: subscription.quizzes_used || 0,
            limit: subscription.quizzes_limit || PLAN_LIMITS.free.quizzes,
            percentage: ((subscription.quizzes_used || 0) / (subscription.quizzes_limit || PLAN_LIMITS.free.quizzes)) * 100,
          },
        },
        monthlyTrend,
        violations: violations.slice(-10), // Last 10 violations
        warnings,
      };
    } catch (error) {
      console.error('❌ Failed to get usage analytics:', error);
      return null;
    }
  }

  // Reset warnings when user upgrades plan
  async resetUsageWarnings(userId: string): Promise<void> {
    try {
      const warningsRef = ref(db, `users/${userId}/usage_warnings`);
      await set(warningsRef, {
        tokens_warning_sent: false,
        quizzes_warning_sent: false,
        limit_reached_notifications: 0,
        last_warning_sent: '',
      });
      
      console.log('✅ Usage warnings reset for user:', userId);
    } catch (error) {
      console.error('❌ Failed to reset usage warnings:', error);
    }
  }

  // Suspend user account for abuse (multiple violations)
  async suspendUserForAbuse(userId: string, reason: string): Promise<void> {
    try {
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, {
        account_status: 'suspended',
        suspension_reason: reason,
        suspended_at: new Date().toISOString(),
      });

      // Log the suspension
      const violationRef = push(ref(db, `usage_violations/${userId}`));
      await set(violationRef, {
        type: 'account_suspended',
        attempted_usage: 0,
        current_limit: 0,
        plan: 'suspended',
        action_taken: 'account_suspended',
        timestamp: new Date().toISOString(),
        user_id: userId,
        reason,
      });

      console.log('🚫 User account suspended:', userId, reason);
    } catch (error) {
      console.error('❌ Failed to suspend user account:', error);
    }
  }
}

export const usageController = new UsageController();