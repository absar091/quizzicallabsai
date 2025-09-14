
/**
 * @fileOverview Generates a very simple AI explanation for a concept, as if explaining to a 5-year-old.
 *
 * - generateSimpleExplanation - A function that takes a concept and returns a simplified explanation.
 * - GenerateSimpleExplanationInput - The input type for the function.
 * - GenerateSimpleExplanationOutput - The return type for the function.
 */

import {ai, isAiAvailable} from '@/ai/genkit';
import { getModel } from '@/lib/getModel';
import {z} from 'genkit';

const GenerateSimpleExplanationInputSchema = z.object({
  question: z.string().describe('The quiz question.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  topic: z.string().describe('The topic of the question.'),
  isPro: z.boolean().default(false),
});
export type GenerateSimpleExplanationInput = z.infer<typeof GenerateSimpleExplanationInputSchema>;

const GenerateSimpleExplanationOutputSchema = z.object({
  explanation: z.string().describe('The AI-generated simple explanation.'),
});
export type GenerateSimpleExplanationOutput = z.infer<typeof GenerateSimpleExplanationOutputSchema>;

export async function generateSimpleExplanation(
  input: GenerateSimpleExplanationInput
): Promise<GenerateSimpleExplanationOutput> {
  if (typeof process === 'undefined' || !isAiAvailable()) {
    return { explanation: 'AI explanations are temporarily unavailable. Please try again later.' };
  }
  
  const aiInstance = ai || (await import('@/ai/genkit')).ai;
  if (!aiInstance) {
    return { explanation: 'AI explanations are temporarily unavailable. Please try again later.' };
  }
  
  try {
    const flow = generateSimpleExplanationFlow(aiInstance);
    return await flow(input);
  } catch (error: any) {
    console.error('Simple explanation generation failed:', error?.message || error);
    return { explanation: 'Unable to generate simple explanation at this time. Please try again.' };
  }
}

const getPromptText = (isPro: boolean) => `You are an AI assistant that is an expert at explaining complex topics in a very simple way.

${isPro ? '**PRO USER - ENHANCED SIMPLE EXPLANATION:**\r\n- Provide more detailed analogies and examples\r\n- Include additional context for deeper understanding\r\n- Offer multiple ways to think about the concept\r\n\r\n' : '**STANDARD SIMPLE EXPLANATION:**\r\n- Focus on basic understanding with clear analogies\r\n- Keep explanations concise and accessible\r\n\r\n'}

  Explain the following concept like I'm 5 years old. Use simple words, short sentences, and a real-world analogy if possible.

  The topic is "{{topic}}".
  The question was: "{{question}}"
  The correct answer is: "{{correctAnswer}}"

  Focus on explaining why the correct answer is right in the simplest terms possible.`;


const createPrompt = (aiInstance: any, isPro: boolean, useFallback: boolean = false) => aiInstance.definePrompt({
  name: 'generateSimpleExplanationPrompt',
  model: `googleai/${getModel(isPro, useFallback)}`,
  input: {schema: GenerateSimpleExplanationInputSchema},
  output: {schema: GenerateSimpleExplanationOutputSchema},
  prompt: getPromptText(isPro),
});


const generateSimpleExplanationFlow = (aiInstance: any) => aiInstance.defineFlow(
  {
    name: 'generateSimpleExplanationFlow',
    inputSchema: GenerateSimpleExplanationInputSchema,
    outputSchema: GenerateSimpleExplanationOutputSchema,
  },
  async input => {
    let output;
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        const prompt = createPrompt(aiInstance, input.isPro, retryCount > 0);
        const result = await prompt(input);
        output = result.output;

        if (output && output.explanation && output.explanation.trim() !== '') {
          return output;
        } else {
          throw new Error("AI returned empty explanation");
        }
      } catch (error: any) {
        retryCount++;
        const errorMsg = error?.message || 'Unknown error';
        console.error(`Simple explanation generation attempt ${retryCount} failed:`, errorMsg);

        if (retryCount > maxRetries) {
          if (errorMsg.includes('quota') || errorMsg.includes('rate limit')) {
            // Rotate to next API key for quota issues
            try {
              const { handleApiKeyError } = await import('@/lib/api-key-manager');
              handleApiKeyError();
              console.log('🔄 Rotated API key due to quota limit (simple explanation)');
            } catch (rotateError) {
              console.warn('Failed to rotate API key:', rotateError);
            }
            throw new Error('AI service quota exceeded. Please try again in a few minutes.');
          } else if (errorMsg.includes('timeout') || errorMsg.includes('deadline')) {
            throw new Error('Request timeout. The AI service is busy. Please try again.');
          } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
            throw new Error('Network connection issue. Please check your internet connection.');
          } else {
            throw new Error('Failed to generate simple explanation. Please try again.');
          }
        }

        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
    }

    if (!output || !output.explanation || output.explanation.trim() === '') {
      throw new Error("The AI model failed to return a valid simple explanation. Please try again.");
    }
    return output;
  }
);
