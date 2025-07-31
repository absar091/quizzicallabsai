
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

const promptText = `You are an expert AI tutor. Your goal is to provide a clear, insightful, and helpful explanation for a quiz question that a student answered incorrectly.

**Context:**
- **Topic:** {{topic}}
- **Question:** "{{question}}"
- **The correct answer is:** "{{correctAnswer}}"
- **The student incorrectly answered:** "{{studentAnswer}}"

**Your Task:**
Generate an explanation that does the following, in this order:

1.  **Explain the Correct Answer:** Start by clearly and concisely explaining *why* "{{correctAnswer}}" is the correct choice. Break down the core concept being tested.
2.  **Analyze the Incorrect Answer:** Explain *why* the student's answer, "{{studentAnswer}}", is incorrect. Address the specific misconception or error in thinking that likely led to this choice. If the incorrect answer is a plausible distractor, explain what makes it incorrect in the context of the question.
3.  **Provide a Concluding Summary:** Briefly summarize the key takeaway to reinforce the learning.

**Tone:** Be encouraging, clear, and educational. Avoid jargon where possible, or explain it if necessary. The output should be just the text of the explanation itself.`;

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
