import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { getNextApiKey, handleApiKeyError, getNextWorkingApiKey } from '@/lib/api-key-manager';

// Check if we're in a server environment and API key is available
const isServer = typeof process !== 'undefined';

// Simple check for API keys - assume they're available if environment suggests they exist
const hasApiKey = isServer && (
  process.env.GEMINI_API_KEY_1 ||
  process.env.GEMINI_API_KEY_2 ||
  process.env.GEMINI_API_KEY_3 ||
  process.env.GEMINI_API_KEY_4 ||
  process.env.GEMINI_API_KEY_5 ||
  process.env.GEMINI_API_KEY
);

console.log(`🔑 AI Key Check: ${hasApiKey ? 'Keys detected' : 'No keys found'}`);

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
    // Try next working key on initialization failure
    try {
      const fallbackKey = getNextWorkingApiKey();
      console.log(`🔄 Fallback: Using next working API key: ${fallbackKey.substring(0, 20)}...`);

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
