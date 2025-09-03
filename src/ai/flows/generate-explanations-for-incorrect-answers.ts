
/**
 * @fileOverview Generates AI explanations for incorrect quiz answers.
 *
 * - generateExplanationsForIncorrectAnswers - A function that takes incorrect answers and returns AI-generated explanations.
 * - GenerateExplanationsInput - The input type for the generateExplanationsForIncorrectAnswers function.
 * - GenerateExplanationsOutput - The return type for the generateExplanationsForIncorrectAnswers function.
 */

import {ai, isAiAvailable} from '@/ai/genkit';
import { getModel } from '@/lib/models';
import {z} from 'genkit';

const GenerateExplanationsInputSchema = z.object({
  question: z.string().describe('The question that was answered incorrectly.'),
  studentAnswer: z.string().describe('The student’s incorrect answer.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  topic: z.string().describe('The topic of the question.'),
  isPro: z.boolean().default(false),
});
export type GenerateExplanationsInput = z.infer<typeof GenerateExplanationsInputSchema>;

const GenerateExplanationsOutputSchema = z.object({
  explanation: z.string().describe('The AI-generated explanation for the correct answer.'),
});
export type GenerateExplanationsOutput = z.infer<typeof GenerateExplanationsOutputSchema>;

export async function generateExplanationsForIncorrectAnswers(
  input: GenerateExplanationsInput
): Promise<GenerateExplanationsOutput> {
  if (typeof process === 'undefined' || !isAiAvailable()) {
    return { explanation: 'AI explanations are temporarily unavailable. Please try again later.' };
  }
  
  const aiInstance = ai || (await import('@/ai/genkit')).ai;
  if (!aiInstance) {
    return { explanation: 'AI explanations are temporarily unavailable. Please try again later.' };
  }
  
  try {
    const flow = generateExplanationsFlow(aiInstance);
    return await flow(input);
  } catch (error: any) {
    console.error('Explanation generation failed:', error?.message || error);
    return { explanation: 'Unable to generate explanation at this time. Please try again.' };
  }
}

const getPromptText = (isPro: boolean) => `You are an expert AI tutor. Your goal is to provide a clear, insightful, and helpful explanation for a quiz question that a student answered incorrectly.

${isPro ? '**PRO USER - ENHANCED EXPLANATION:**\r\n- Provide deeper conceptual understanding\r\n- Include advanced insights and connections\r\n- Offer additional context and real-world applications\r\n- Use more sophisticated pedagogical approaches\r\n\r\n' : '**STANDARD EXPLANATION:**\r\n- Focus on core concepts and clear understanding\r\n- Keep explanations accessible and straightforward\r\n\r\n'}

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

// Dynamic prompt creation based on user plan
const createPrompt = (aiInstance: any, isPro: boolean, useFallback: boolean = false) => aiInstance.definePrompt({
  name: 'generateExplanationsPrompt',
  input: {schema: GenerateExplanationsInputSchema},
  output: {schema: GenerateExplanationsOutputSchema},
  prompt: getPromptText(isPro),
});


const generateExplanationsFlow = (aiInstance: any) => aiInstance.defineFlow(
  {
    name: 'generateExplanationsFlow',
    inputSchema: GenerateExplanationsInputSchema,
    outputSchema: GenerateExplanationsOutputSchema,
  },
  async input => {
    let output;
    try {
        const model = getModel(input.isPro, false);
        const prompt = createPrompt(aiInstance, input.isPro, false);
        const result = await prompt(input, { model });
        output = result.output;
    } catch (error: any) {
        console.error('Gemini 1.5 Flash failed with unhandled error:', error);
        throw new Error(`Failed to generate explanations: ${error.message}`);
    }
    
    if (!output || !output.explanation || output.explanation.trim() === '') {
      throw new Error("The AI model failed to return a valid explanation. Please try again.");
    }
    return output;
  }
);
