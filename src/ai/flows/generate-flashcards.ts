// This module runs on the server and defines Genkit flows for flashcard generation.
/**
 * @fileOverview This file defines a Genkit flow for generating flashcards for a given topic.
 *
 * - generateFlashcards: An async function that takes a topic and returns a set of flashcards.
 * - GenerateFlashcardsInput: The input type for the generateFlashcards function.
 * - GenerateFlashcardsOutput: The output type for the generateFlashcards function.
 */

import {ai, isAiAvailable} from '@/ai/genkit';
import { getModel } from '@/lib/models';
import {z} from 'genkit';
import { sanitizeLogInput } from '@/lib/security';

const IncorrectQuestionSchema = z.object({
    question: z.string(),
    userAnswer: z.string().nullable(),
    correctAnswer: z.string(),
});

export const GenerateFlashcardsInputSchema = z.object({
  topic: z.string().describe("The general topic of the quiz these questions are from."),
  incorrectQuestions: z.array(IncorrectQuestionSchema).describe('A list of questions the user answered incorrectly.'),
  isPro: z.boolean().default(false),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const FlashcardSchema = z.object({
    term: z.string().describe("The key term, concept, or a simplified version of the question for the front of the flashcard."),
    definition: z.string().describe("The concise and correct definition, answer, or explanation for the back of the flashcard.")
});

export const GenerateFlashcardsOutputSchema = z.object({
  flashcards: z.array(FlashcardSchema).describe('An array of generated flashcards.'),
});
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

export async function generateFlashcards(
  input: GenerateFlashcardsInput
): Promise<GenerateFlashcardsOutput> {
  if (!isAiAvailable() || !ai) {
    throw new Error('AI service is not configured. Please contact support.');
  }
  if (!input.topic || input.topic.trim().length === 0) {
      throw new Error("Invalid input: 'topic' cannot be empty.");
  }
  if (!input.incorrectQuestions || input.incorrectQuestions.length === 0) {
      return { flashcards: [] }; // Return empty if there's nothing to process
  }

  return generateFlashcardsFlow(input);
}

const promptText = `You are an expert educator specializing in creating effective study materials. Your task is to generate a set of high-quality, concise, and accurate flashcards based on the questions a user answered incorrectly in a quiz.

**CRITICAL DIRECTIVES:**
1.  **ACCURACY IS PARAMOUNT:** The 'definition' side of the flashcard MUST be factually correct and directly answer the question or define the term.
2.  **FOCUS ON THE CORE CONCEPT:** For each incorrect question, identify the core concept being tested. The flashcard should be about this core concept.
3.  **TERM (FRONT OF CARD):** The 'term' should be a simplified version of the question or the key concept it's about. Make it a short, digestible phrase or question.
4.  **DEFINITION (BACK OF CARD):** The 'definition' should be the clear, correct answer or explanation for the term. It should be concise.
5.  **FINAL OUTPUT FORMAT:** Your final output MUST be ONLY the JSON object specified in the output schema. Do not include any extra text or commentary. The JSON must be perfectly parsable and valid.

---

**TASK: Generate one flashcard for each of the following incorrectly answered questions on the topic of '{{{topic}}}':**

{{#each incorrectQuestions}}
- **Question:** "{{this.question}}"
  - **User's Incorrect Answer:** "{{this.userAnswer}}"
  - **Correct Answer:** "{{this.correctAnswer}}"

{{/each}}

Generate the flashcards now.
`;

const prompt = ai!.definePrompt({
    name: "generateFlashcardsPrompt",
    prompt: promptText,
    input: { schema: GenerateFlashcardsInputSchema },
    output: { schema: GenerateFlashcardsOutputSchema },
});

const generateFlashcardsFlow = ai!.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async (input) => {
    const model = getModel(input.isPro);
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await prompt(input, { model });
        const output = result.output;

        if (!output || !output.flashcards) {
          // Return empty array if no flashcards are generated
          return { flashcards: [] };
        }

        // Additional validation to ensure data integrity
        for (const card of output.flashcards) {
          if (!card.term || card.term.trim().length === 0 || !card.definition || card.definition.trim().length === 0) {
            throw new Error("The AI model returned incomplete flashcard data.");
          }
        }

        return output;
      } catch (error: any) {
        lastError = error;
        console.error(`Flashcard generation attempt ${attempt} failed:`, sanitizeLogInput(error.message));

        if (attempt === maxRetries) break;

        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Categorize the final error
    const errorMessage = lastError?.message || 'Unknown error';
    if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      // Rotate to next API key for quota issues
      try {
        const { handleApiKeyError } = await import('@/lib/api-key-manager');
        handleApiKeyError();
        console.log('🔄 Rotated API key due to quota limit (flashcards)');
      } catch (rotateError) {
        console.warn('Failed to rotate API key:', rotateError);
      }
      throw new Error('AI service quota exceeded. Please try again in a few minutes.');
    } else if (errorMessage.includes('timeout') || errorMessage.includes('deadline')) {
      throw new Error('Request timed out. Please try again with fewer questions.');
    } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error('Failed to generate flashcards. Please try again or contact support if the issue persists.');
    }
  }
);
