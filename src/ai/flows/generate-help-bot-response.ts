
'use server';

/**
 * @fileOverview This file defines a Genkit flow for the AI Help Bot.
 *
 * - generateHelpBotResponse: An async function that generates a response for user queries.
 * - GenerateHelpBotResponseInput: The input type for the function.
 * - GenerateHelpBotResponseOutput: The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHelpBotResponseInputSchema = z.object({
  query: z.string().describe("The user's question about the Quizzicallabs AI application."),
  faqContext: z.string().describe("The full list of Frequently Asked Questions as a stringified JSON object to provide context.")
});
export type GenerateHelpBotResponseInput = z.infer<typeof GenerateHelpBotResponseInputSchema>;

const GenerateHelpBotResponseOutputSchema = z.object({
  answer: z.string().describe('The generated, helpful answer to the user\'s query.'),
});
export type GenerateHelpBotResponseOutput = z.infer<typeof GenerateHelpBotResponseOutputSchema>;

export async function generateHelpBotResponse(
  input: GenerateHelpBotResponseInput
): Promise<GenerateHelpBotResponseOutput> {
  return generateHelpBotResponseFlow(input);
}

const promptText = `You are an expert AI support assistant for a web application called "Quizzicallabs AI". Your goal is to provide helpful, concise, and friendly answers to user questions.

**CONTEXT:**
You have been provided with a list of Frequently Asked Questions (FAQs) that contains reliable information about the app. Use this as your primary source of truth.

**User's Question:** "{{query}}"

**FAQs for Context:**
\`\`\`json
{{{faqContext}}}
\`\`\`

**YOUR TASK:**
1.  First, check if the user's question is directly answered in the provided FAQs. If it is, use that information to form your answer.
2.  If the question is not directly in the FAQs but is related, use the context to infer a logical and helpful response.
3.  If the question is completely unrelated to the app's features described in the FAQs (e.g., asking about the weather), politely state that you can only answer questions about the Quizzicallabs AI application.
4.  Keep your answers concise and easy to understand.
5.  Your response MUST be just the answer text, formatted for the JSON output.`;

const prompt = ai.definePrompt({
    name: 'generateHelpBotResponsePrompt',
    model: 'googleai/gemini-1.5-flash',
    prompt: promptText,
    input: { schema: GenerateHelpBotResponseInputSchema },
    output: { schema: GenerateHelpBotResponseOutputSchema },
});

const generateHelpBotResponseFlow = ai.defineFlow(
  {
    name: 'generateHelpBotResponseFlow',
    inputSchema: GenerateHelpBotResponseInputSchema,
    outputSchema: GenerateHelpBotResponseOutputSchema,
  },
  async (input) => {
    let output;
    try {
        try {
          JSON.parse(input.faqContext);
        } catch (e) {
          throw new Error("Invalid faqContext: Must be a valid JSON string.");
        }
        const result = await prompt(input);
        output = result.output;
    } catch (error: any) {
        throw new Error(`Failed to generate help bot response: ${error.message}`);
    }
    
    if (!output || !output.answer) {
      throw new Error("The AI model failed to return a valid response. Please try again.");
    }
    return output;
  }
);
