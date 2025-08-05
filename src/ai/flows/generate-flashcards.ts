
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating flashcards for a given topic.
 *
 * - generateFlashcards: An async function that takes a topic and returns a set of flashcards.
 * - GenerateFlashcardsInput: The input type for the generateFlashcards function.
 * - GenerateFlashcardsOutput: The output type for the generateFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateFlashcardsInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate the flashcards.'),
  count: z.number().min(5).max(50).describe("The number of flashcards to generate."),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const FlashcardSchema = z.object({
    term: z.string().describe("The key term, concept, or question for the front of the flashcard."),
    definition: z.string().describe("The concise definition, answer, or explanation for the back of the flashcard.")
});

export const GenerateFlashcardsOutputSchema = z.object({
  flashcards: z.array(FlashcardSchema).describe('An array of generated flashcards.'),
});
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

export async function generateFlashcards(
  input: GenerateFlashcardsInput
): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}

const promptText = `You are an expert educator specializing in creating effective study materials. Your task is to generate a set of high-quality, concise, and accurate flashcards for the given topic.

**CRITICAL DIRECTIVES:**
1.  **ACCURACY IS PARAMOUNT:** All terms and definitions must be factually correct and directly relevant to the topic.
2.  **CONCISENESS:** Keep the text for both the term and the definition brief and to the point. Flashcards should be easily digestible.
3.  **EXACT COUNT:** You MUST generate exactly {{{count}}} flashcards.
4.  **TERM (FRONT):** The 'term' should be a single key concept, a person, a date, or a short question.
5.  **DEFINITION (BACK):** The 'definition' should be a clear, simple explanation or answer to the term.
6.  **FINAL OUTPUT FORMAT:** Your final output MUST be ONLY the JSON object specified in the output schema. No extra text or commentary.

---

**TASK: Generate {{{count}}} flashcards for the following topic:**

*   **Topic:** '{{{topic}}}'

Generate the flashcards now.`;

const prompt = ai.definePrompt({
    name: "generateFlashcardsPrompt",
    model: 'googleai/gemini-1.5-flash',
    prompt: promptText,
    input: { schema: GenerateFlashcardsInputSchema },
    output: { schema: GenerateFlashcardsOutputSchema },
});

const generateFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);

    if (!output) {
      throw new Error("The AI model failed to return valid flashcards. Please try again.");
    }
    return output;
  }
);
