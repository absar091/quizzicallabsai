
'use server';

/**
 * @fileOverview Generates AI explanations for incorrect quiz answers.
 *
 * - generateExplanationsForIncorrectAnswers - A function that takes incorrect answers and returns AI-generated explanations.
 * - GenerateExplanationsInput - The input type for the generateExplanationsForIncorrectAnswers function.
 * - GenerateExplanationsOutput - The return type for the generateExplanationsForIncorrectAnswers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExplanationsInputSchema = z.object({
  question: z.string().describe('The question that was answered incorrectly.'),
  studentAnswer: z.string().describe('The student’s incorrect answer.'),
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

const prompt = ai.definePrompt({
  name: 'generateExplanationsPrompt',
  model: 'googleai/gemini-2.0-flash-preview',
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
    let output;
    try {
        const result = await prompt(input);
        output = result.output;
    } catch (error: any) {
        console.error('Gemini 2.0 Flash failed with unhandled error:', error);
        throw new Error(`Failed to generate explanations: ${error.message}`);
    }
    
    if (!output || !output.explanation || output.explanation.trim() === '') {
      throw new Error("The AI model failed to return a valid explanation. Please try again.");
    }
    return output;
  }
);
