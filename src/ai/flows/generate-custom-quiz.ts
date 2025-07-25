
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
    .max(55)
    .describe('The number of questions in the quiz.'),
  questionTypes: z.array(z.string()).describe('The types of questions to include (e.g., Multiple Choice, Fill in the Blank).'),
  questionStyles: z.array(z.string()).describe('The style of questions (e.g. Conceptual, Numerical, etc).'),
  timeLimit: z.number().optional().describe('The time limit for the quiz in minutes.'),
  userAge: z.number().optional().describe("The age of the user taking the quiz."),
  userClass: z.string().optional().describe("The grade/class of the user taking the quiz."),
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
  prompt: `You are an expert quiz generator and an educator. Your task is to create a high-quality quiz based on the exact parameters provided. We believe in quality.

  **Instructions:**
  1.  **Topic:** The quiz must be strictly about '{{{topic}}}'. Do not deviate from this topic.
  2.  **Target Audience:** The user is {{#if userAge}}{{userAge}} years old{{/if}}{{#if userClass}} and is in class/grade '{{userClass}}'{{/if}}. Tailor the complexity and wording of the questions to be appropriate for this level.
  3.  **Difficulty & Quality:** The questions must match the specified difficulty level: '{{{difficulty}}}'.
        *   **Easy:** Basic recall of facts and definitions.
        *   **Medium:** Requires some application of concepts.
        *   **Hard:** Involves analysis, synthesis, or evaluation.
        *   **Master:** Complex problems requiring deep understanding and integration of multiple concepts.
        The quality of the questions is paramount. They should be clear, unambiguous, and a true test of knowledge for the given difficulty.
  4.  **Number of Questions:** You must generate exactly {{{numberOfQuestions}}} questions.
  5.  **Question Formats:** The quiz should only include the following formats: {{{questionTypes}}}.
        *   For "Multiple Choice", provide exactly 4 distinct options. One must be correct.
        *   For "Fill in the Blank", present it as a multiple-choice question where the options are words that could fill the blank.
  6.  **Question Styles:** The questions should adhere to the following styles: {{{questionStyles}}}.
        *   **Knowledge-based:** Test recall of facts, dates, and definitions.
        *   **Conceptual:** Test understanding of ideas and principles.
        *   **Numerical:** Involve calculations or data interpretation.
        *   **Past Paper Style:** Mimic the format and style commonly found in standardized tests or past exam papers for the topic.
  7.  **Accuracy & Relevance:** All questions and answers must be accurate, relevant, and well-written.
  8.  **Format:** Your final output must be only the JSON object specified in the output schema. Do not include any extra text, commentary, or markdown formatting.

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
