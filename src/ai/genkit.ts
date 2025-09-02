import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Check if we're in a server environment and API key is available
const hasApiKey = process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('Dummy');

if (!hasApiKey) {
  console.warn('GEMINI_API_KEY not found or invalid. AI features will be disabled.');
}

// Only initialize genkit if API key is available
export const ai = hasApiKey ? genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY!,
    }),
  ],
  enableTracingAndMetrics: false, // Disable for production
}) : null;

// Helper function to check if AI is available
export const isAiAvailable = () => {
  return ai !== null && hasApiKey;
};

// Model selection based on user plan
export const getModelForPlan = (isPro: boolean) => {
  if (!hasApiKey) {
    console.warn('AI not available, returning default model name');
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
  return hasApiKey && ai !== null;
};
