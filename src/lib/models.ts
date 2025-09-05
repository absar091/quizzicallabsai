
import { googleAI } from '@genkit-ai/googleai';
import { getModelWithFallback as getModelFromRouter } from './modelRouter';

/**
 * Returns the appropriate Genkit model based on the user's plan with fallback support.
 * @param isPro - A boolean indicating if the user has a Pro plan.
 * @param useFallback - Whether to use fallback model (for retry scenarios).
 * @returns A Genkit ModelReference.
 */
export function getModel(isPro: boolean, useFallback: boolean = false) {
    const tier: "free" | "pro" = isPro ? "pro" : "free";
    const modelName = getModelFromRouter(tier, useFallback);

    try {
        return googleAI.model(modelName);
    } catch (error) {
        console.warn(`Failed to get model ${modelName}, using fallback`);
        // Final fallback to most reliable model
        return googleAI.model('gemini-1.5-flash');
    }
}

/**
 * Returns the name of the appropriate model based on the user's plan.
 * @param isPro - A boolean indicating if the user has a Pro plan.
 * @param useFallback - Whether to use fallback model.
 * @returns The model name as a string.
 */
export function getModelName(isPro: boolean, useFallback: boolean = false): string {
    const tier: "free" | "pro" = isPro ? "pro" : "free";
    return getModelFromRouter(tier, useFallback);
}

/**
 * Gets model with automatic fallback on failure.
 * @param isPro - A boolean indicating if the user has a Pro plan.
 * @returns Promise<ModelReference> with fallback handling.
 */
export async function getModelWithFallback(isPro: boolean) {
    try {
        return getModel(isPro, false);
    } catch (error) {
        console.warn('Primary model failed, using fallback');
        return getModel(isPro, true);
    }
}
