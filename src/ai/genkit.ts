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
