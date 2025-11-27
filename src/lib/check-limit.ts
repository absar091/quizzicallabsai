/**
 * Token Limit Checking
 * Checks if user has remaining tokens before AI generation
 */

import { whopService } from "@/lib/whop";

export async function checkTokenLimit(userId: string) {
  try {
    let usage = await whopService.getUserUsage(userId);
    
    // If user doesn't exist, initialize them with free plan
    if (!usage) {
      console.log(`🆕 User ${userId} not found in Whop, initializing...`);
      await whopService.initializeUser(userId);
      usage = await whopService.getUserUsage(userId);
      
      // If still no usage after initialization, something is wrong
      if (!usage) {
        console.error(`❌ Failed to initialize user ${userId}`);
        return { allowed: false, remaining: 0 };
      }
    }

    const remaining = usage.tokens_remaining;
    return {
      allowed: remaining > 0,
      remaining,
    };
  } catch (error) {
    console.error('❌ Error checking token limit:', error);
    return { allowed: false, remaining: 0 };
  }
}
