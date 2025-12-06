
// Server-only Genkit flow for help-bot response generation.
/**
 * @fileOverview This file defines a Genkit flow for the AI Help Bot.
 *
 * - generateHelpBotResponse: An async function that generates a response for user queries.
 * - GenerateHelpBotResponseInput: The input type for the function.
 * - GenerateHelpBotResponseOutput: The return type for the function.
 */

import {ai, isAiAvailable} from '@/ai/genkit';
import { getModel } from '@/lib/getModel';
import {z} from 'genkit';

const GenerateHelpBotResponseInputSchema = z.object({
  query: z.string().describe("The user's question about the Quizzicallabs AI application."),
  faqContext: z.string().describe("The full list of Frequently Asked Questions as a stringified JSON object to provide context."),
  userPlan: z.string().default('Free').describe("The user's plan (Free or Pro) to provide plan-specific responses.")
});
export type GenerateHelpBotResponseInput = z.infer<typeof GenerateHelpBotResponseInputSchema>;

const GenerateHelpBotResponseOutputSchema = z.object({
  answer: z.string().describe('The generated, helpful answer to the user\'s query.'),
});
export type GenerateHelpBotResponseOutput = z.infer<typeof GenerateHelpBotResponseOutputSchema>;

export async function generateHelpBotResponse(
  input: GenerateHelpBotResponseInput
): Promise<GenerateHelpBotResponseOutput> {
  if (!isAiAvailable() || !ai) {
    return {
      answer: "I'm sorry, but the AI help service is currently unavailable. Please check our documentation or contact support for assistance."
    };
  }
  return generateHelpBotResponseFlow(input);
}

const getPromptText = (userPlan: string) => `You are an expert AI support assistant for a web application called "Quizzicallabs AI". Your goal is to provide helpful, concise, and friendly answers to user questions.

**CONTEXT:**
You have been provided with a list of Frequently Asked Questions (FAQs) that contains reliable information about the app. Use this as your primary source of truth.

**USER PLAN:** ${userPlan}
${userPlan === 'Pro' ? '**PRO USER BENEFITS:**\r\n- Unlimited bookmarks\r\n- No ads\r\n- Premium AI model (Gemini 2.5 Pro)\r\n- Enhanced explanations\r\n- Watermark-free PDF downloads\r\n- Access to Exam Paper Generator\r\n\r\n' : '**FREE USER LIMITATIONS:**\r\n- 50 bookmark limit\r\n- Ads displayed\r\n- Basic AI model (Gemini 1.5 Flash)\r\n- Standard explanations\r\n- Watermarked PDF downloads\r\n- No access to Exam Paper Generator\r\n\r\n'}**User's Question:** "{{query}}"

**FAQs for Context:**
\`\`\`json
{{{faqContext}}}
\`\`\`

**YOUR TASK:**
1.  First, check if the user's question is directly answered in the provided FAQs. If it is, use that information to form your answer.
2.  If the question is not directly in the FAQs but is related, use the context to infer a logical and helpful response.
3.  If the user asks about plan differences or upgrading, provide clear information about Free vs Pro benefits.
4.  If the question is completely unrelated to the app's features described in the FAQs (e.g., asking about the weather), politely state that you can only answer questions about the Quizzicallabs AI application.
5.  Keep your answers concise and easy to understand.
6.  Your response MUST be just the answer text, formatted for the JSON output.`;

// Dynamic prompt creation based on user plan
const createPrompt = async (userPlan: string) => {
  const genkitAi = await ai;
  if (!genkitAi) throw new Error('AI not available');
  return genkitAi.definePrompt({
    name: 'generateHelpBotResponsePrompt',
    model: `googleai/${getModel(userPlan === 'pro', false)}`,
    prompt: getPromptText(userPlan),
    input: { schema: GenerateHelpBotResponseInputSchema },
    output: { schema: GenerateHelpBotResponseOutputSchema },
  });
};

const generateHelpBotResponseFlow = async (input: GenerateHelpBotResponseInput): Promise<GenerateHelpBotResponseOutput> => {
  const genkitAi = await ai;
  if (!genkitAi) throw new Error('AI not available');
  
  const flow = genkitAi.defineFlow(
    {
      name: 'generateHelpBotResponseFlow',
      inputSchema: GenerateHelpBotResponseInputSchema,
      outputSchema: GenerateHelpBotResponseOutputSchema,
    },
    async (input: GenerateHelpBotResponseInput) => {
      let output;
      let retryCount = 0;
      const maxRetries = 2;

      while (retryCount <= maxRetries) {
        try {
          try {
            JSON.parse(input.faqContext);
          } catch (e) {
            throw new Error("Invalid faqContext: Must be a valid JSON string.");
          }

          const model = input.userPlan === 'Pro' ? 'googleai/gemini-2.5-pro' : 'googleai/gemini-1.5-flash';
          const prompt = await createPrompt(input.userPlan);
          const result = await prompt(input, { model });
          output = result.output;

          if (output && output.answer) {
            return output;
          } else {
            throw new Error("AI returned empty response");
          }
        } catch (error: any) {
          retryCount++;
          const errorMsg = error?.message || 'Unknown error';
          console.error(`Help bot response generation attempt ${retryCount} failed:`, errorMsg);

          if (retryCount > maxRetries) {
            if (errorMsg.includes('quota') || errorMsg.includes('rate limit')) {
              // Rotate to next API key for quota issues
              try {
                const { handleApiKeyError } = await import('@/lib/api-key-manager');
                handleApiKeyError();
                console.log('🔄 Rotated API key due to quota limit (help bot)');
              } catch (rotateError) {
                console.warn('Failed to rotate API key:', rotateError);
              }
              throw new Error('AI service quota exceeded. Please try again in a few minutes.');
            } else if (errorMsg.includes('timeout') || errorMsg.includes('deadline')) {
              throw new Error('Request timeout. The AI service is busy. Please try again.');
            } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
              throw new Error('Network connection issue. Please check your internet connection.');
            } else {
              throw new Error('Failed to generate help response. Please try again.');
            }
          }

          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        }
      }

      if (!output || !output.answer) {
        throw new Error("The AI model failed to return a valid response. Please try again.");
      }
      return output;
    }
  );
  
  return flow(input);
};
