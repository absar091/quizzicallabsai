
'use server';

/**
 * @fileOverview Generates a quiz from a document.
 *
 * - generateQuizFromDocument - A function that generates a quiz from a document.
 * - GenerateQuizFromDocumentInput - The input type for the generateQuizFromDocument function.
 * - GenerateQuizFromDocumentOutput - The return type for the generateQuizFromDocument function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const GenerateQuizFromDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .max(10000000, "The document is too large. Please upload a smaller document.") // Increased limit for larger files
    .describe(
      "A document to generate a quiz from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  quizLength: z.number().describe('The number of questions to generate for the quiz.').max(55),
});
export type GenerateQuizFromDocumentInput = z.infer<typeof GenerateQuizFromDocumentInputSchema>;

const GenerateQuizFromDocumentOutputSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string(),
      answers: z.array(z.string()),
      correctAnswerIndex: z.number(),
    })
  ).describe('The generated quiz questions and answers based on the document.'),
});
export type GenerateQuizFromDocumentOutput = z.infer<typeof GenerateQuizFromDocumentOutputSchema>;

export async function generateQuizFromDocument(
  input: GenerateQuizFromDocumentInput
): Promise<GenerateQuizFromDocumentOutput> {
  return generateQuizFromDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizFromDocumentPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: GenerateQuizFromDocumentInputSchema},
  output: {
    schema: z.object({
        questions: GenerateQuizFromDocumentOutputSchema.shape.quiz
    })
  },
  prompt: `You are an expert quiz generator. Your task is to create a high-quality quiz based *exclusively* on the content of the provided document.

  **Critical Instructions - Follow these rules without exception:**
  1.  **STRICTLY ADHERE TO THE DOCUMENT:** You MUST generate exactly {{{quizLength}}} questions and answers using ONLY the information found in the following document: {{media url=documentDataUri}}.
  2.  **NO EXTERNAL KNOWLEDGE:** Do NOT use any information from outside the provided document. All questions and answers (including incorrect ones) must be derivable solely from the text in the document. This is your most important rule.
  3.  **HIGH-QUALITY QUESTIONS:** Generate clear, unambiguous questions that test comprehension of the document's key points.
  4.  **PLAUSIBLE DISTRACTORS:** For the incorrect answers, create options that are plausible within the context of the document but are factually incorrect according to the document's text. Avoid obviously wrong or nonsensical options.
  5.  **OUTPUT FORMAT:** Your final output MUST be ONLY the JSON object specified in the output schema. Do not include any extra text, commentary, or markdown formatting (like \`\`\`json). The JSON must be perfect and parsable. Each question object must have:
      *   "question": The question text.
      *   "answers": An array of exactly 4 possible answers.
      *   "correctAnswerIndex": The index (0-3) of the single correct answer in the "answers" array.

  Generate the quiz now. Your entire response must be based *only* on the provided document.`,
});

const generateQuizFromDocumentFlow = ai.defineFlow(
  {
    name: 'generateQuizFromDocumentFlow',
    inputSchema: GenerateQuizFromDocumentInputSchema,
    outputSchema: GenerateQuizFromDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return { quiz: output!.questions };
  }
);
