
'use server';

/**
 * @fileOverview Generates a very simple AI explanation for a concept, as if explaining to a 5-year-old.
 *
 * - generateSimpleExplanation - A function that takes a concept and returns a simplified explanation.
 * - GenerateSimpleExplanationInput - The input type for the function.
 * - GenerateSimpleExplanationOutput - The return type for the function.
 */

import {ai, isAiAvailable} from '@/ai/genkit';
import { getModel } from '@/lib/models';
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
  if (!isAiAvailable() || !ai) {
    return { explanation: 'AI explanations are temporarily unavailable. Please try again later.' };
  }
  
  try {
    return await generateSimpleExplanationFlow(input);
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


const createPrompt = (isPro: boolean, useFallback: boolean = false) => ai!.definePrompt({
  name: 'generateSimpleExplanationPrompt',
  input: {schema: GenerateSimpleExplanationInputSchema},
  output: {schema: GenerateSimpleExplanationOutputSchema},
  prompt: getPromptText(isPro),
});


const generateSimpleExplanationFlow = ai!.defineFlow(
  {
    name: 'generateSimpleExplanationFlow',
    inputSchema: GenerateSimpleExplanationInputSchema,
    outputSchema: GenerateSimpleExplanationOutputSchema,
  },
  async input => {
    let output;
    try {
        const model = getModel(input.isPro, false);
        const prompt = createPrompt(input.isPro, false);
        const result = await prompt(input, { model });
        output = result.output;
    } catch (error: any) {
        console.error('Gemini 1.5 Flash failed with unhandled error:', error);
        throw new Error(`Failed to generate simple explanation: ${error.message}`);
    }

    if (!output || !output.explanation || output.explanation.trim() === '') {
      throw new Error("The AI model failed to return a valid simple explanation. Please try again.");
    }
    return output;
  }
);
