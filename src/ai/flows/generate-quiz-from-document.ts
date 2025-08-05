
'use server';

/**
 * @fileOverview Generates a quiz from a document or image file.
 *
 * - generateQuizFromDocument - A function that generates a quiz from a file.
 * - GenerateQuizFromDocumentInput - The input type for the function.
 * - GenerateQuizFromDocumentOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizFromDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .max(10000000, "The document is too large. Please upload a smaller document.")
    .describe(
      "A document or image to generate a quiz from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  numberOfQuestions: z.number().min(1).max(55),
  difficulty: z.enum(["easy", "medium", "hard", "master"]),
  questionTypes: z.array(z.string()),
});
export type GenerateQuizFromDocumentInput = z.infer<typeof GenerateQuizFromDocumentInputSchema>;

const GenerateQuizFromDocumentOutputSchema = z.object({
  quiz: z.array(
    z.object({
      type: z.enum(['multiple-choice', 'descriptive']).describe('The type of the question.'),
      question: z.string(),
      answers: z.array(z.string()).optional().describe('Answer choices for multiple-choice questions.'),
      correctAnswer: z.string().optional().describe('The correct answer for multiple-choice questions.'),
    })
  ).describe('The generated quiz questions and answers based on the document.'),
});
export type GenerateQuizFromDocumentOutput = z.infer<typeof GenerateQuizFromDocumentOutputSchema>;

export async function generateQuizFromDocument(
  input: GenerateQuizFromDocumentInput
): Promise<GenerateQuizFromDocumentOutput> {
  return generateQuizFromDocumentFlow(input);
}

const promptText = `You are an expert quiz generator. Your task is to create a high-quality quiz based *exclusively* on the content of the provided document or image.

  **Critical Instructions - Follow these rules without exception:**
  1.  **STRICTLY ADHERE TO THE DOCUMENT:** Analyze the provided file: {{media url=documentDataUri}}. You MUST generate exactly {{{numberOfQuestions}}} questions and answers using ONLY the information found within it.
  2.  **EXACT QUESTION COUNT & TYPES:** Your response must contain exactly {{{numberOfQuestions}}} questions of the types specified: {{#each questionTypes}}'{{this}}'{{/each}}.
  3.  **NO EXTERNAL KNOWLEDGE:** Do NOT use any information from outside the provided document. All questions and answers must be derivable solely from the text in the document. This is your most important rule.
  4.  **HIGH-QUALITY QUESTIONS:** Generate clear, unambiguous questions that test comprehension of the document's key points, tailored to a '{{{difficulty}}}' difficulty level.
  5.  **PLAUSIBLE DISTRACTORS:** For multiple-choice questions, create plausible incorrect answers (distractors) that are relevant to the document's context.
  6.  **OUTPUT FORMAT:** Your final output MUST be ONLY the JSON object specified in the output schema. Do not include any extra text, commentary, or markdown formatting. The JSON must be perfect and parsable.

  Generate the quiz now. Your entire response must be based *only* on the provided document and must contain exactly {{{numberOfQuestions}}} questions.`;

const prompt = ai.definePrompt({
    name: 'generateQuizFromDocumentPrompt',
    model: 'googleai/gemini-1.5-flash',
    prompt: promptText,
    input: { schema: GenerateQuizFromDocumentInputSchema },
    output: { schema: GenerateQuizFromDocumentOutputSchema },
});

const generateQuizFromDocumentFlow = ai.defineFlow(
  {
    name: 'generateQuizFromDocumentFlow',
    inputSchema: GenerateQuizFromDocumentInputSchema,
    outputSchema: GenerateQuizFromDocumentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    
    if (!output) {
      throw new Error("The AI model failed to return a valid quiz from the document. Please try again.");
    }
    return output;
  }
);
