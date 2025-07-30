
'use server';

/**
 * @fileOverview Generates AI explanations for incorrect quiz answers.
 *
 * - generateExplanationsForIncorrectAnswers - A function that takes incorrect answers and returns AI-generated explanations.
 * - GenerateExplanationsInput - The input type for the generateExplanationsForIncorrectAnswers function.
 * - GenerateExplanationsOutput - The return type for the generateExplanationsForIncorrectAnswers function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const GenerateExplanationsInputSchema = z.object({
  question: z.string().describe('The question that was answered incorrectly.'),
  studentAnswer: z.string().describe('The student\u2019s incorrect answer.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  topic: z.string().describe('The topic of the question.'),
});
export type GenerateExplanationsInput = z.infer<typeof GenerateExplanationsInputSchema>;

const GenerateExplanationsOutputSchema = z.object({
  explanation: z.string().describe('The AI-generated explanation for the correct answer.'),
});
export type GenerateExplanationsOutput = z.infer<typeof GenerateExplanationsOutputSchema>;

export async function generateExplanationsForIncorrectAnswers(
  input: GenerateExplanationsInput
): Promise<GenerateExplanationsOutput> {
  return generateExplanationsFlow(input);
}

const promptText = `You are an AI assistant that provides clear and concise explanations for quiz questions.

  Here is the question:
  {{question}}

  The student answered:
  {{studentAnswer}}

  The correct answer is:
  {{correctAnswer}}

  Topic: {{topic}}

  Provide a detailed explanation of why the correct answer is correct, and where the student went wrong in their thinking.  Focus on the specific topic at hand.`;

const prompt15Flash = ai.definePrompt({
  name: 'generateExplanationsPrompt15Flash',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: GenerateExplanationsInputSchema},
  output: {schema: GenerateExplanationsOutputSchema},
  prompt: promptText,
});

const prompt20Flash = ai.definePrompt({
  name: 'generateExplanationsPrompt20Flash',
  model: googleAI.model('gemini-2.0-flash'),
  input: {schema: GenerateExplanationsInputSchema},
  output: {schema: GenerateExplanationsOutputSchema},
  prompt: promptText,
});

const generateExplanationsFlow = ai.defineFlow(
  {
    name: 'generateExplanationsFlow',
    inputSchema: GenerateExplanationsInputSchema,
    outputSchema: GenerateExplanationsOutputSchema,
  },
  async input => {
    try {
        const {output} = await prompt15Flash(input);
        return output!;
    } catch (error: any) {
        if (error.message && (error.message.includes('503') || error.message.includes('overloaded') || error.message.includes('429'))) {
            // Fallback to gemini-2.0-flash if 1.5-flash is overloaded or rate limited
            console.log('Gemini 1.5 Flash unavailable, falling back to Gemini 2.0 Flash.');
            const {output} = await prompt20Flash(input);
            return output!;
        }
        // Re-throw other errors
        throw error;
    }
  }
);
