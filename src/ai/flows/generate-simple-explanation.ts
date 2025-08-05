
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
    try {
        const {output} = await prompt15Flash(input);
        if (!output) {
            throw new Error('AI model returned an empty or invalid response.');
        }
        return output;
    } catch (error: any) {
        if (error.message && (error.message.includes('503') || error.message.includes('overloaded') || error.message.includes('429'))) {
            // Fallback to gemini-1.5-pro if 1.5-flash is overloaded or rate limited
            console.log('Gemini 1.5 Flash unavailable, falling back to Gemini 1.5 Pro.');
            const {output} = await prompt15Pro(input);
            if (!output) {
                throw new Error('Fallback AI model also returned an empty or invalid response.');
            }
            return output;
        }
        // Re-throw other errors
        throw error;
    }
  }
);
