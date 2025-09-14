/**
 * Model Router Helper for AI Services
 * Centralized model selection logic for different user plans
 */

// Model Router Constants - Working model names confirmed by API
const MODEL_ROUTER_FREE_PRIMARY = process.env.MODEL_ROUTER_FREE_PRIMARY || 'gemini-1.5-flash';
const MODEL_ROUTER_FREE_FALLBACK = process.env.MODEL_ROUTER_FREE_FALLBACK || 'gemini-1.5-flash-8b';
const MODEL_ROUTER_PRO_PRIMARY = process.env.MODEL_ROUTER_PRO_PRIMARY || 'gemini-1.5-pro';
const MODEL_ROUTER_PRO_FALLBACK = process.env.MODEL_ROUTER_PRO_FALLBACK || 'gemini-1.5-flash';

interface ModelConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}



/**
 * Get the appropriate AI model for a user's request
 * Returns model name string for compatibility with AI flows
 */
export function getModel(isPro: boolean = false, useFallback: boolean = false): string {
  // Determine which model set to use
  const primaryModel = isPro ? MODEL_ROUTER_PRO_PRIMARY : MODEL_ROUTER_FREE_PRIMARY;
  const fallbackModel = isPro ? MODEL_ROUTER_PRO_FALLBACK : MODEL_ROUTER_FREE_FALLBACK;

  // Use fallback if requested or if primary is unavailable
  return useFallback ? fallbackModel : primaryModel;
}

/**
 * Get model configuration object (for advanced use cases)
 */
export function getModelConfig(isPro: boolean = false, useFallback: boolean = false): ModelConfig {
  const selectedModel = getModel(isPro, useFallback);

  return {
    model: selectedModel,
    temperature: 0.3, // Lower for more accurate quiz generation
    maxTokens: isPro ? 4000 : 2000, // Higher limits for pro users
    topP: 0.9
  };
}

/**
 * Get model configuration optimized for specific use cases
 */
export function getModelForUseCase(useCase: 'quiz' | 'flashcard' | 'explanation' | 'general', isPro: boolean = false): ModelConfig {
  const selectedModel = getModel(isPro);

  // Adjust parameters based on use case
  switch (useCase) {
    case 'quiz':
      return {
        model: selectedModel,
        temperature: 0.2, // More deterministic for quiz generation
        maxTokens: isPro ? 8000 : 4000,
        topP: 0.9
      };
    case 'flashcard':
      return {
        model: selectedModel,
        temperature: 0.3,
        maxTokens: isPro ? 4000 : 2000,
        topP: 0.9
      };
    case 'explanation':
      return {
        model: selectedModel,
        temperature: 0.4, // More creative for explanations
        maxTokens: isPro ? 6000 : 3000,
        topP: 0.9
      };
    case 'general':
    default:
      return {
        model: selectedModel,
        temperature: 0.3,
        maxTokens: isPro ? 4000 : 2000,
        topP: 0.9
      };
  }
}

/**
 * Check if a model is available
 */
export function isModelAvailable(modelName: string): boolean {
  const availableModels = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-2.0-flash',
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-1.0-pro'
  ];

  return availableModels.includes(modelName);
}

/**
 * Get models suitable for free tier users
 */
export function getFreeTierModels(): string[] {
  return [MODEL_ROUTER_FREE_PRIMARY, MODEL_ROUTER_FREE_FALLBACK];
}

/**
 * Get models suitable for pro users
 */
export function getProTierModels(): string[] {
  return [MODEL_ROUTER_PRO_PRIMARY, MODEL_ROUTER_PRO_FALLBACK];
}

/**
 * Validate model configuration
 */
export function validateModelConfig(config: ModelConfig): boolean {
  if (!config.model || typeof config.model !== 'string') {
    return false;
  }

  if (config.temperature !== undefined && (config.temperature < 0 || config.temperature > 2)) {
    return false;
  }

  if (config.maxTokens !== undefined && (config.maxTokens <= 0 || config.maxTokens > 32000)) {
    return false;
  }

  if (config.topP !== undefined && (config.topP <= 0 || config.topP > 1)) {
    return false;
  }

  return true;
}
