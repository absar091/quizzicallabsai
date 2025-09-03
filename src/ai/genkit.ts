import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Check if we're in a server environment and API key is available
const hasApiKey = typeof process !== 'undefined' && process.env?.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('Dummy');

if (!hasApiKey && typeof process !== 'undefined') {
  console.warn('GEMINI_API_KEY not found or invalid. AI features will be disabled.');
}

// Lazy initialization to prevent SSR issues
let _ai: any = null;

const initializeAI = () => {
  if (!hasApiKey) return null;
  if (_ai) return _ai;
  
  try {
    _ai = genkit({
      plugins: [
        googleAI({
          apiKey: process.env.GEMINI_API_KEY!,
        }),
      ],
      enableTracingAndMetrics: false,
    });
    return _ai;
  } catch (error) {
    console.error('Failed to initialize AI:', error);
    return null;
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
    return isPro ? 'gemini-2.0-flash-exp' : 'gemini-1.5-flash';
  }
  return isPro ? 'gemini-2.0-flash-exp' : 'gemini-1.5-flash';
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
