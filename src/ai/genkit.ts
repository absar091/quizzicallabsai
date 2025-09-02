import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Validate API key exists
if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY not found. AI features will be disabled.');
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  enableTracingAndMetrics: false, // Disable for production
});
