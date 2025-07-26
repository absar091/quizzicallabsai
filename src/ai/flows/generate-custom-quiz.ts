
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
  userAge: z.number().optional().nullable().describe("The age of the user taking the quiz."),
  userClass: z.string().optional().nullable().describe("The grade/class of the user taking the quiz."),
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
  prompt: `You are a professional AI question generator designed to create high-quality, subject-accurate questions across multiple topics including science, math, English, general knowledge, and more.

Follow these strict rules to ensure accuracy, quality, and user satisfaction:

✅ GENERAL RULES:
1.  Stay strictly within the correct facts of the subject matter for '{{{topic}}}'. If unsure about a fact, do not guess or include incorrect information.
2.  Always verify your answers before giving them—wrong answers damage trust.
3.  Ensure that all options (A–D) are plausible—no obviously wrong, silly, or unrelated options.
4.  There must be only one correct answer per question. Avoid tricky or ambiguous wording.
5.  Use clear and concise language. Do not make overly complicated or confusing questions unless the difficulty level demands it.
6.  Avoid repeating the same question type, structure, or wording repeatedly—keep variation to engage the user.

🎯 QUESTION STRUCTURE:
For each question, you must generate:
*   A clear and concise question.
*   Exactly 4 distinct options for "Multiple Choice" or "Fill in the Blank" formats.
*   A single correct answer from the provided options.

🔢 DIFFICULTY LEVELS:
*   **Easy:** Basic recall of facts and definitions.
*   **Medium:** Requires some reasoning or application of concepts.
*   **Hard:** Involves analysis, synthesis, or evaluation.
*   **Master:** Complex problems requiring deep understanding and integration of multiple concepts.

❗ CRITICAL INSTRUCTIONS:
*   NEVER give wrong facts.
*   DO NOT invent terms or concepts that don’t exist.
*   DO NOT create questions that are too confusing, vague, or irrelevant.
*   NEVER frustrate the user with poor structure or misleading options. Your job is to assist, not to confuse.

✅ QUIZ GENERATION TASK:
Generate a quiz based on the following parameters:

1.  **Topic:** The quiz must be strictly about '{{{topic}}}'.
2.  **Target Audience:** Tailor the complexity and wording for the following user. If no details are provided, generate for a general high school level.
    {{#if userAge}}*   **Age:** {{userAge}} years old{{/if}}
    {{#if userClass}}*   **Class/Grade:** '{{userClass}}'{{/if}}
3.  **Difficulty Level:** The questions must match the specified difficulty: '{{{difficulty}}}'.
4.  **Number of Questions:** You must generate exactly {{{numberOfQuestions}}} questions.
5.  **Question Formats:** The quiz should only include the following formats: {{{questionTypes}}}.
6.  **Question Styles:** The questions should adhere to the following styles: {{{questionStyles}}}.
7.  **Final Output:** Your final output must be ONLY the JSON object specified in the output schema. Do not include any extra text, commentary, or markdown formatting.

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
