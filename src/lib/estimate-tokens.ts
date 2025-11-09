/**
 * Simple token estimation utility
 * Estimates tokens from text (roughly 1 token per 4 characters)
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}
