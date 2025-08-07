
'use server';

/**
 * @fileOverview This file defines a Genkit flow for explaining an image.
 *
 * - explainImage: An async function that takes an image and a query, and returns an explanation.
 * - ExplainImageInput: The input type for the function.
 * - ExplainImageOutput: The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ExplainImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a diagram or object, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  query: z.string().describe("The user's question about the image, e.g., 'Explain this diagram.' or 'What process is shown here?'"),
});
export type ExplainImageInput = z.infer<typeof ExplainImageInputSchema>;

export const ExplainImageOutputSchema = z.object({
  explanation: z.string().describe('The detailed, AI-generated explanation of the image.'),
});
export type ExplainImageOutput = z.infer<typeof ExplainImageOutputSchema>;

export async function explainImage(
  input: ExplainImageInput
): Promise<ExplainImageOutput> {
  return explainImageFlow(input);
}

const promptText = `You are an expert AI tutor and subject matter specialist. Your task is to provide a clear, accurate, and detailed explanation for the provided image based on the user's query.

**CONTEXT:**
- User's Query: "{{query}}"
- Image to analyze: {{media url=imageDataUri}}

**YOUR TASK:**
1.  **Analyze the Image:** Carefully examine the image provided. Identify all key components, labels, processes, and relationships shown.
2.  **Understand the Query:** Determine the user's intent from their query. Are they asking for a general overview, an explanation of a specific part, or the process depicted?
3.  **Formulate a Comprehensive Explanation:**
    *   Start with a high-level summary of what the image shows.
    *   Break down the explanation into logical parts. Use headings or bullet points if it improves clarity.
    *   Define any technical terms or jargon present in the diagram.
    *   If it's a process, explain it step-by-step.
    *   Ensure your explanation is factually correct and easy to understand.
4.  **Final Output:** Your response must be only the detailed explanation text, formatted for the JSON output.`;

const prompt15Flash = ai.definePrompt({
    name: 'explainImagePrompt15Flash',
    model: 'googleai/gemini-1.5-flash',
    prompt: promptText,
    input: { schema: ExplainImageInputSchema },
    output: { schema: ExplainImageOutputSchema },
});

const prompt15Pro = ai.definePrompt({
    name: 'explainImagePrompt15Pro',
    model: 'googleai/gemini-1.5-pro',
    prompt: promptText,
    input: { schema: ExplainImageInputSchema },
    output: { schema: ExplainImageOutputSchema },
});

const explainImageFlow = ai.defineFlow(
  {
    name: 'explainImageFlow',
    inputSchema: ExplainImageInputSchema,
    outputSchema: ExplainImageOutputSchema,
  },
  async (input) => {
    let output;
    try {
      const result = await prompt15Flash(input);
      // Attempt to parse the output and validate against the schema
 output = ExplainImageOutputSchema.parse(result.output);
    } catch (error: any) {
 if (error.message && (error.message.includes('503') || error.message.includes('overloaded') || error.message.includes('429'))) {
            console.log('Gemini 1.5 Flash unavailable, falling back to Gemini 1.5 Pro for image explanation.');
 try {
 const result = await prompt15Pro(input);
 // Attempt to parse the output and validate against the schema
 output = ExplainImageOutputSchema.parse(result.output);
 } catch (proError: any) {
 // If Pro also fails, log and re-throw
 console.error('Gemini 1.5 Pro fallback also failed:', proError);
      output = result.output;
 throw proError; // Re-throw the Pro model error
 }
 } else {
 // Re-throw other errors
 console.error('Gemini 1.5 Flash failed with unhandled error:', error);
 throw error; // Re-throw the original error
 }
    }

    // Add more specific validation after successful parsing
    if (!output || !output.explanation || output.explanation.trim() === '') {
      throw new Error("The AI model failed to return a valid explanation. Please try again.");
    }
    return output;
  }
);
