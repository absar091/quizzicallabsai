
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

const IncorrectQuestionSchema = z.object({
    question: z.string(),
    userAnswer: z.string().nullable(),
    correctAnswer: z.string(),
});

export const GenerateFlashcardsInputSchema = z.object({
  topic: z.string().describe("The general topic of the quiz these questions are from."),
  incorrectQuestions: z.array(IncorrectQuestionSchema).describe('A list of questions the user answered incorrectly.'),
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
    let output;
    try {
      const result = await prompt(input);
      output = result.output;
    } catch (error: any) {
        console.error('Error calling Gemini 1.5 Flash for flashcard generation:', error);
        throw new Error(`Failed to generate flashcards: ${error.message || 'Unknown error'}`);
    }

    if (!output || !output.flashcards) {
        // It's possible the AI returns no flashcards if it deems none are necessary.
        // We will return an empty array instead of throwing an error.
        return { flashcards: [] };
    }

    // Additional validation to ensure data integrity
    for (const card of output.flashcards) {
        if (!card.term || card.term.trim().length === 0 || !card.definition || card.definition.trim().length === 0) {
             throw new Error("The AI model returned incomplete flashcard data. Please try again.");
        }
    }

    return output;
  }
);
