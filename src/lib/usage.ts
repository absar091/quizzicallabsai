/**
 * Token Usage Tracking
 * Tracks actual token usage from Gemini API responses
 */

import { whopService } from "@/lib/whop";

export async function trackTokenUsage(userId: string, usedTokens: number) {
  if (!userId || usedTokens <= 0) return;

  try {
    await whopService.trackTokenUsage(userId, usedTokens);
    console.log(`✅ Tracked ${usedTokens} tokens for user: ${userId}`);
  } catch (err) {
    console.error("❌ Failed to track tokens:", err);
  }
}
