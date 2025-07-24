
'use server';

/**
 * @fileOverview Generates a quiz from a document.
 *
 * - generateQuizFromDocument - A function that generates a quiz from a document.
 * - GenerateQuizFromDocumentInput - The input type for the generateQuizFromDocument function.
 * - GenerateQuizFromDocumentOutput - The return type for the generateQuizFromDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizFromDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document to generate a quiz from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  quizLength: z.number().describe('The number of questions to generate for the quiz.').max(55),
});
export type GenerateQuizFromDocumentInput = z.infer<typeof GenerateQuizFromDocumentInputSchema>;

const GenerateQuizFromDocumentOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz in JSON format.'),
});
export type GenerateQuizFromDocumentOutput = z.infer<typeof GenerateQuizFromDocumentOutputSchema>;

export async function generateQuizFromDocument(
  input: GenerateQuizFromDocumentInput
): Promise<GenerateQuizFromDocumentOutput> {
  return generateQuizFromDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizFromDocumentPrompt',
  input: {schema: GenerateQuizFromDocumentInputSchema},
  output: {schema: GenerateQuizFromDocumentOutputSchema},
  prompt: `You are a quiz generator. Generate a quiz with the following number of questions: {{{quizLength}}}. Use the context from the following document: {{media url=documentDataUri}}.

      Return the quiz as a JSON object with an array of questions. Each question should have the question text, and a list of possible answers, and the index of the correct answer. For example:

      {
        "questions": [
          {
            "question": "What is the capital of France?",
            "answers": ["London", "Paris", "Berlin", "Rome"],
            "correctAnswerIndex": 1
          },
          {
            "question": "What is the highest mountain in the world?",
            "answers": ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"],
            "correctAnswerIndex": 0
          }
        ]
      }`,
});

const generateQuizFromDocumentFlow = ai.defineFlow(
  {
    name: 'generateQuizFromDocumentFlow',
    inputSchema: GenerateQuizFromDocumentInputSchema,
    outputSchema: GenerateQuizFromDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
