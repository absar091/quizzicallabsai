
'use server';

/**
 * @fileOverview Generates a very simple AI explanation for a concept, as if explaining to a 5-year-old.
 *
 * - generateSimpleExplanation - A function that takes a concept and returns a simplified explanation.
 * - GenerateSimpleExplanationInput - The input type for the function.
 * - GenerateSimpleExplanationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSimpleExplanationInputSchema = z.object({
  question: z.string().describe('The quiz question.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  topic: z.string().describe('The topic of the question.'),
});
export type GenerateSimpleExplanationInput = z.infer<typeof GenerateSimpleExplanationInputSchema>;

const GenerateSimpleExplanationOutputSchema = z.object({
  explanation: z.string().describe('The AI-generated simple explanation.'),
});
export type GenerateSimpleExplanationOutput = z.infer<typeof GenerateSimpleExplanationOutputSchema>;

export async function generateSimpleExplanation(
  input: GenerateSimpleExplanationInput
): Promise<GenerateSimpleExplanationOutput> {
  return generateSimpleExplanationFlow(input);
}

const promptText = `You are an AI assistant that is an expert at explaining complex topics in a very simple way.

  Explain the following concept like I'm 5 years old. Use simple words, short sentences, and a real-world analogy if possible.

  The topic is "{{topic}}".
  The question was: "{{question}}"
  The correct answer is: "{{correctAnswer}}"

  Focus on explaining why the correct answer is right in the simplest terms possible.`;


const prompt15Flash = ai.definePrompt({
  name: 'generateSimpleExplanationPrompt15Flash',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: GenerateSimpleExplanationInputSchema},
  output: {schema: GenerateSimpleExplanationOutputSchema},
  prompt: promptText,
});

const prompt15Pro = ai.definePrompt({
  name: 'generateSimpleExplanationPrompt15Pro',
  model: 'googleai/gemini-1.5-pro',
  input: {schema: GenerateSimpleExplanationInputSchema},
  output: {schema: GenerateSimpleExplanationOutputSchema},
  prompt: promptText,
});


const generateSimpleExplanationFlow = ai.defineFlow(
  {
    name: 'generateSimpleExplanationFlow',
    inputSchema: GenerateSimpleExplanationInputSchema,
    outputSchema: GenerateSimpleExplanationOutputSchema,
  },
  async input => {
    let output;
    try {
      // Try the flash model first
        const result = await prompt15Flash(input);
        output = result.output;
    } catch (error: any) {
      // If flash model fails due to specific errors, try pro model
        if (error.message && (error.message.includes('503') || error.message.includes('overloaded') || error.message.includes('429'))) {
            // Fallback to gemini-1.5-pro if 1.5-flash is overloaded or rate limited
            console.log('Gemini 1.5 Flash unavailable, falling back to Gemini 1.5 Pro.');
            const result = await prompt15Pro(input);
            output = result.output;
        } else {
            // Log and re-throw other unexpected errors
            console.error('An unexpected error occurred during AI explanation generation:', error);
            throw error;
        }
    }

    // Validate the output structure and content
    if (!output || !output.explanation || output.explanation.trim() === '') {
      throw new Error("The AI model failed to return a valid simple explanation. Please try again.");
    }
    if (!output) {
      throw new Error("The AI model failed to return a valid simple explanation. Please try again.");
    }
    return output;
  }
);
