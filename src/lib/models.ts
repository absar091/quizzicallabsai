
import { googleAI } from '@genkit-ai/googleai';
import { ModelReference } from 'genkit/model';

// Centralized model names read from environment variables
const FREE_MODEL = process.env.NEXT_PUBLIC_FREE_MODEL_NAME || 'gemini-1.5-flash';
const PRO_MODEL = process.env.NEXT_PUBLIC_PRO_MODEL_NAME || 'gemini-2.5-pro';

/**
 * Returns the appropriate Genkit model based on the user's plan.
 * @param isPro - A boolean indicating if the user has a Pro plan.
 * @returns A Genkit ModelReference.
 */
export function getModel(isPro: boolean): ModelReference<any, any> {
    const modelName = isPro ? PRO_MODEL : FREE_MODEL;
    return googleAI.model(modelName);
}

/**
 * Returns the name of the appropriate model based on the user's plan.
 * @param isPro - A boolean indicating if the user has a Pro plan.
 * @returns The model name as a string.
 */
export function getModelName(isPro: boolean): string {
    return isPro ? PRO_MODEL : FREE_MODEL;
}
