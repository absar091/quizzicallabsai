
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating practice questions based on user-selected subjects and topics.
 *
 * - generatePracticeQuestions - A function that takes a subject and topic as input and generates practice questions.
 * - GeneratePracticeQuestionsInput - The input type for the generatePracticeQuestions function.
 * - GeneratePracticeQuestionsOutput - The output type for the generatePracticeQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePracticeQuestionsInputSchema = z.object({
  subject: z.string().describe('The subject for which to generate practice questions (e.g., Biology, Physics, Chemistry).'),
  topic: z.string().describe('The specific topic within the subject for which to generate practice questions (e.g., Photosynthesis, Thermodynamics, Organic Chemistry).'),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional().describe('The difficulty level of the questions.'),
  numberOfQuestions: z.number().int().min(1).max(55).optional().describe('The desired number of questions to generate (1-55).'),
  questionType: z.enum(['multiple choice', 'true/false', 'short answer']).optional().describe('The question type to generate.'),
});
export type GeneratePracticeQuestionsInput = z.infer<typeof GeneratePracticeQuestionsInputSchema>;

const GeneratePracticeQuestionsOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The practice question.'),
      answer: z.string().describe('The answer to the practice question.'),
      options: z.array(z.string()).optional().describe('Multiple choice options, if applicable.'),
      explanation: z.string().describe('A detailed explanation of why the answer is correct.')
    })
  ).describe('An array of generated practice questions and their answers.')
});
export type GeneratePracticeQuestionsOutput = z.infer<typeof GeneratePracticeQuestionsOutputSchema>;

export async function generatePracticeQuestions(input: GeneratePracticeQuestionsInput): Promise<GeneratePracticeQuestionsOutput> {
  return generatePracticeQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePracticeQuestionsPrompt',
  input: {schema: GeneratePracticeQuestionsInputSchema},
  output: {schema: GeneratePracticeQuestionsOutputSchema},
  prompt: `You are an expert educator specializing in generating practice questions for students.

  Generate practice questions for the following subject and topic:

  Subject: {{{subject}}}
  Topic: {{{topic}}}

  The questions should be appropriate for students studying this subject and topic.

  {{#if difficulty}}
  The difficulty level of the questions should be {{{difficulty}}}.
  {{/if}}

  {{#if numberOfQuestions}}
  Generate {{{numberOfQuestions}}} questions.
  {{else}}
  Generate 5 questions.
  {{/if}}

  {{#if questionType}}
  The question type should be {{{questionType}}}.
  {{/if}}

  For each question, provide a detailed explanation of why the answer is correct.

  Format the output as a JSON array of questions, where each question has a "question" field, an "answer" field, and an "explanation" field.
  If the question type is multiple choice, include an "options" field with an array of options.
  `,
});

const generatePracticeQuestionsFlow = ai.defineFlow(
  {
    name: 'generatePracticeQuestionsFlow',
    inputSchema: GeneratePracticeQuestionsInputSchema,
    outputSchema: GeneratePracticeQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
