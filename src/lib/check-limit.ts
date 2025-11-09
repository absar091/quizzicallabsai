/**
 * Token Limit Checking
 * Checks if user has remaining tokens before AI generation
 */

import { whopService } from "@/lib/whop";

export async function checkTokenLimit(userId: string) {
  const usage = await whopService.getUserUsage(userId);
  if (!usage) return { allowed: false, remaining: 0 };

  const remaining = usage.tokens_remaining;
  return {
    allowed: remaining > 0,
    remaining,
  };
}
