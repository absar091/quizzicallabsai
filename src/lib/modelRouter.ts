// Model Router Utility
// Centralized model selection based on user tier

type UserTier = "free" | "pro";

interface ModelConfig {
  primary: string;
  fallback: string;
}

const modelMap: Record<UserTier, ModelConfig> = {
  free: {
    primary: "gemini-1.5-flash",      // ✅ fast, cheap
    fallback: "gemini-2.0-flash",     // ✅ experimental but still cheap
  },
  pro: {
    primary: "gemini-2.5-pro",        // 🚀 powerful
    fallback: "gemini-2.5-flash",     // ⚡ faster, still strong
  },
};

export function getModelForUser(tier: UserTier): ModelConfig {
  return modelMap[tier];
}

export function getPrimaryModel(tier: UserTier): string {
  return modelMap[tier].primary;
}

export function getFallbackModel(tier: UserTier): string {
  return modelMap[tier].fallback;
}

// Helper function to get model with fallback support
export function getModelWithFallback(tier: UserTier, useFallback: boolean = false): string {
  const config = modelMap[tier];
  return useFallback ? config.fallback : config.primary;
}

// Get all available models for a tier
export function getAllModelsForTier(tier: UserTier): string[] {
  const config = modelMap[tier];
  return [config.primary, config.fallback];
}
