
import { googleAI } from '@genkit-ai/googleai';
import { ModelReference } from 'genkit/model';

// Centralized model names read from environment variables
const FREE_MODEL = process.env.NEXT_PUBLIC_FREE_MODEL_NAME || 'gemini-1.5-flash';
const FREE_FALLBACK = process.env.NEXT_PUBLIC_FREE_FALLBACK_MODEL || 'gemini-2.0-flash-exp';
const PRO_MODEL = process.env.NEXT_PUBLIC_PRO_MODEL_NAME || 'gemini-2.5-pro';
const PRO_FALLBACK = process.env.NEXT_PUBLIC_PRO_FALLBACK_MODEL || 'gemini-2.5-flash';

/**
 * Returns the appropriate Genkit model based on the user's plan with fallback support.
 * @param isPro - A boolean indicating if the user has a Pro plan.
 * @param useFallback - Whether to use fallback model (for retry scenarios).
 * @returns A Genkit ModelReference.
 */
export function getModel(isPro: boolean, useFallback: boolean = false): ModelReference<any, any> {
    let modelName: string;
    
    if (isPro) {
        modelName = useFallback ? PRO_FALLBACK : PRO_MODEL;
    } else {
        modelName = useFallback ? FREE_FALLBACK : FREE_MODEL;
    }
    
    try {
        return googleAI.model(modelName);
    } catch (error) {
        console.warn(`Failed to get model ${modelName}`);
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
    if (isPro) {
        return useFallback ? PRO_FALLBACK : PRO_MODEL;
    } else {
        return useFallback ? FREE_FALLBACK : FREE_MODEL;
    }
}

/**
 * Gets model with automatic fallback on failure.
 * @param isPro - A boolean indicating if the user has a Pro plan.
 * @returns Promise<ModelReference> with fallback handling.
 */
export async function getModelWithFallback(isPro: boolean): Promise<ModelReference<any, any>> {
    try {
        return getModel(isPro, false);
    } catch (error) {
        console.warn('Primary model failed, using fallback');
        return getModel(isPro, true);
    }
}
