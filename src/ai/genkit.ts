import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { getNextApiKey, handleApiKeyError } from '@/lib/api-key-manager';

// Check if we're in a server environment and API key is available
const isServer = typeof process !== 'undefined';
const hasApiKey = isServer && process.env?.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('Dummy');

if (!isServer) {
  console.warn('AI features are only available on the server side.');
}

if (!hasApiKey && isServer) {
  console.warn('GEMINI_API_KEY not found or invalid. AI features will be disabled.');
}

// Lazy initialization to prevent SSR issues
let _ai: any = null;
let _currentApiKey: string | null = null;

const initializeAI = () => {
  if (!isServer || !hasApiKey) return null;
  if (_ai) return _ai;

  try {
    // Get the next API key from rotation
    const apiKey = getNextApiKey();
    _currentApiKey = apiKey;

    console.log(`🔑 Using API Key rotation - Current key: ${apiKey.substring(0, 20)}...`);

    _ai = genkit({
      plugins: [
        googleAI({
          apiKey: apiKey,
        }),
      ],
    });
    return _ai;
  } catch (error) {
    console.error('Failed to initialize AI:', error);
    // Try rotating to next key on initialization failure
    try {
      handleApiKeyError();
      const fallbackKey = getNextApiKey();
      console.log(`🔄 Fallback: Using next API key: ${fallbackKey.substring(0, 20)}...`);

      _ai = genkit({
        plugins: [
          googleAI({
            apiKey: fallbackKey,
          }),
        ],
      });
      return _ai;
    } catch (fallbackError) {
      console.error('Fallback AI initialization also failed:', fallbackError);
      return null;
    }
  }
};

export const ai = typeof process !== 'undefined' ? initializeAI() : null;

// Helper function to check if AI is available
export const isAiAvailable = () => {
  if (typeof process === 'undefined') return false;
  return hasApiKey && (ai !== null || initializeAI() !== null);
};

// Model selection based on user plan
export const getModelForPlan = (isPro: boolean) => {
  if (typeof process === 'undefined' || !hasApiKey) {
    return isPro ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
  }
  return isPro ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
};

// Enhanced prompt for Pro users
export const getEnhancedPrompt = (basePrompt: string, isPro: boolean) => {
  if (!isPro) return basePrompt;
  
  return `${basePrompt}

IMPORTANT: This is a PRO user request. Please provide:
- More detailed and comprehensive content
- Better quality questions with nuanced difficulty
- More thorough explanations
- Advanced concepts and deeper insights
- Professional-grade output quality`;
};

// Safe AI check for components
export const canUseAI = () => {
  if (typeof process === 'undefined') return false;
  return hasApiKey && (ai !== null || initializeAI() !== null);
};
