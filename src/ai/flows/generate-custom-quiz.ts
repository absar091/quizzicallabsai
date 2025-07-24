
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating custom quizzes based on user-specified criteria.
 *
 * It includes:
 * - generateCustomQuiz: An async function that takes quiz parameters as input and returns a generated quiz.
 * - GenerateCustomQuizInput: The input type for the generateCustomQuiz function, defining the schema for quiz customization options.
 * - GenerateCustomQuizOutput: The output type for the generateCustomQuiz function, defining the structure of the generated quiz.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCustomQuizInputSchema = z.object({
  topic: z.string().describe('The topic of the quiz.'),
  difficulty: z
    .enum(['easy', 'medium', 'hard', 'master'])
    .describe('The difficulty level of the quiz.'),
  numberOfQuestions: z
    .number()
    .min(1)
    .max(100)
    .describe('The number of questions in the quiz.'),
  questionTypes: z.array(z.string()).describe('The types of questions to include (e.g., Multiple Choice, Fill in the Blank).'),
  timeLimit: z.number().optional().describe('The time limit for the quiz in minutes.'),
});
export type GenerateCustomQuizInput = z.infer<typeof GenerateCustomQuizInputSchema>;

const GenerateCustomQuizOutputSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string(),
      answers: z.array(z.string()),
      correctAnswer: z.string(),
    })
  ).describe('The generated quiz questions and answers.'),
});
export type GenerateCustomQuizOutput = z.infer<typeof GenerateCustomQuizOutputSchema>;

export async function generateCustomQuiz(
  input: GenerateCustomQuizInput
): Promise<GenerateCustomQuizOutput> {
  return generateCustomQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCustomQuizPrompt',
  input: {schema: GenerateCustomQuizInputSchema},
  output: {schema: GenerateCustomQuizOutputSchema},
  prompt: `You are an expert quiz generator. Your task is to create a quiz based on the exact parameters provided.

  **Instructions:**
  1.  **Topic:** The quiz must be strictly about '{{{topic}}}'. Do not deviate from this topic.
  2.  **Difficulty:** The questions must match the specified difficulty level: '{{{difficulty}}}'.
  3.  **Number of Questions:** You must generate exactly {{{numberOfQuestions}}} questions. No more, no less.
  4.  **Question Types:** The quiz should only include the following types of questions: {{{questionTypes}}}.
        *   For "Multiple Choice" questions, provide exactly 4 distinct options. One of these must be the correct answer.
        *   For "Fill in the Blank" questions, present them in a multiple-choice format. This means you will provide the sentence with a blank, and the options will be the words that could fill that blank. One option must be the correct word.
  5.  **Time Limit:** The quiz is designed to be completed within {{{timeLimit}}} minutes. Ensure the complexity and length of the questions are appropriate for this time constraint.
  6.  **Accuracy & Relevance:** All questions and answers must be accurate, relevant to the topic, and appropriate for the specified difficulty level.
  7.  **Format:** Your final output must be only the JSON object specified in the output schema. Do not include any extra text, commentary, or markdown formatting before or after the JSON.

  Generate the quiz now.`,
});

const generateCustomQuizFlow = ai.defineFlow(
  {
    name: 'generateCustomQuizFlow',
    inputSchema: GenerateCustomQuizInputSchema,
    outputSchema: GenerateCustomQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
