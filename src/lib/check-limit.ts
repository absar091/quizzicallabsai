/**
 * Token Limit Checking
 * Checks if user has remaining tokens before AI generation
 */

import { whopService } from "@/lib/whop";

export interface LimitCheckResult {
  allowed: boolean;
  remaining: number;
  limitReached?: boolean;
  planName?: string;
  tokensUsed?: number;
  tokensLimit?: number;
  upgradeUrl?: string;
  resetDate?: string;
  errorMessage?: string;
}

export async function checkTokenLimit(userId: string, userEmail?: string, userName?: string): Promise<LimitCheckResult> {
  try {
    let usage = await whopService.getUserUsage(userId);
    
    // If user doesn't exist, initialize them with free plan
    if (!usage) {
      console.log(`🆕 User ${userId} not found in Whop, initializing...`);
      
      // Try to initialize with available user info
      const email = userEmail || 'unknown@example.com';
      const name = userName || 'User';
      
      await whopService.initializeUser(userId, email, name);
      usage = await whopService.getUserUsage(userId);
      
      // If still no usage after initialization, something is wrong
      if (!usage) {
        console.error(`❌ Failed to initialize user ${userId}`);
        return { 
          allowed: false, 
          remaining: 0,
          errorMessage: 'Failed to initialize user account. Please contact support.'
        };
      }
    }

    const remaining = usage.tokens_remaining;
    const limitReached = remaining <= 0;

    // Calculate reset date (1st of next month)
    const now = new Date();
    const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const resetDateStr = resetDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });

    if (limitReached) {
      return {
        allowed: false,
        remaining: 0,
        limitReached: true,
        planName: usage.plan || 'Free',
        tokensUsed: usage.tokens_used,
        tokensLimit: usage.tokens_limit,
        upgradeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        resetDate: resetDateStr,
        errorMessage: `Your ${usage.plan || 'Free'} plan token limit has been reached. Upgrade to continue or wait until ${resetDateStr} for your limit to reset.`
      };
    }

    return {
      allowed: true,
      remaining,
      planName: usage.plan,
      tokensUsed: usage.tokens_used,
      tokensLimit: usage.tokens_limit,
    };
  } catch (error) {
    console.error('❌ Error checking token limit:', error);
    return { 
      allowed: false, 
      remaining: 0,
      errorMessage: 'Unable to verify your usage limits. Please try again or contact support.'
    };
  }
}

export async function checkQuizLimit(userId: string, userEmail?: string, userName?: string): Promise<LimitCheckResult> {
  try {
    let usage = await whopService.getUserUsage(userId);
    
    // If user doesn't exist, initialize them with free plan
    if (!usage) {
      console.log(`🆕 User ${userId} not found in Whop, initializing...`);
      
      // Try to initialize with available user info
      const email = userEmail || 'unknown@example.com';
      const name = userName || 'User';
      
      await whopService.initializeUser(userId, email, name);
      usage = await whopService.getUserUsage(userId);
      
      if (!usage) {
        console.error(`❌ Failed to initialize user ${userId}`);
        return { 
          allowed: false, 
          remaining: 0,
          errorMessage: 'Failed to initialize user account. Please contact support.'
        };
      }
    }

    const remaining = usage.quizzes_limit - usage.quizzes_used;
    const limitReached = remaining <= 0;

    // Calculate reset date (1st of next month)
    const now = new Date();
    const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const resetDateStr = resetDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });

    if (limitReached) {
      return {
        allowed: false,
        remaining: 0,
        limitReached: true,
        planName: usage.plan || 'Free',
        tokensUsed: usage.quizzes_used,
        tokensLimit: usage.quizzes_limit,
        upgradeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        resetDate: resetDateStr,
        errorMessage: `Your ${usage.plan || 'Free'} plan quiz limit has been reached. Upgrade to continue or wait until ${resetDateStr} for your limit to reset.`
      };
    }

    return {
      allowed: true,
      remaining,
      planName: usage.plan,
      tokensUsed: usage.quizzes_used,
      tokensLimit: usage.quizzes_limit,
    };
  } catch (error) {
    console.error('❌ Error checking quiz limit:', error);
    return { 
      allowed: false, 
      remaining: 0,
      errorMessage: 'Unable to verify your usage limits. Please try again or contact support.'
    };
  }
}
