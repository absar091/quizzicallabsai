
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a study guide for a given topic.
 *
 * - generateStudyGuide: An async function that takes a topic and returns a structured study guide.
 * - GenerateStudyGuideInput: The input type for the generateStudyGuide function.
 * - GenerateStudyGuideOutput: The output type for the generateStudyGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyGuideInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate the study guide.'),
});
export type GenerateStudyGuideInput = z.infer<typeof GenerateStudyGuideInputSchema>;

const GenerateStudyGuideOutputSchema = z.object({
  title: z.string().describe("The title of the study guide."),
  summary: z.string().describe('A brief, high-level summary of the topic.'),
  keyConcepts: z.array(
    z.object({
      concept: z.string().describe('A key concept, term, or idea.'),
      definition: z.string().describe('A clear and concise definition or explanation of the concept.'),
      importance: z.string().describe('Why this concept is important to understanding the overall topic.'),
    })
  ).describe('A list of the most important concepts and their explanations.'),
  analogies: z.array(
      z.object({
          analogy: z.string().describe("The analogy to explain a concept."),
          concept: z.string().describe("The concept the analogy explains.")
      })
  ).describe("A list of simple analogies to help understand complex parts of the topic."),
  quizYourself: z.array(
      z.object({
          question: z.string().describe("A quick question to test understanding."),
          answer: z.string().describe("The answer to the question.")
      })
  ).describe("A few questions to help the user test their knowledge.")
});
export type GenerateStudyGuideOutput = z.infer<typeof GenerateStudyGuideOutputSchema>;

export async function generateStudyGuide(
  input: GenerateStudyGuideInput
): Promise<GenerateStudyGuideOutput> {
  return generateStudyGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyGuidePrompt',
  input: {schema: GenerateStudyGuideInputSchema},
  output: {schema: GenerateStudyGuideOutputSchema},
  prompt: `You are an expert educator and content creator. Your task is to generate a comprehensive, easy-to-digest study guide for the following topic: {{{topic}}}.

  The study guide should be structured to help a student quickly grasp the most critical information.

  **Instructions:**
  1.  **Title:** Create a clear, compelling title for the study guide.
  2.  **Summary:** Write a short, engaging summary (2-3 sentences) of the overall topic.
  3.  **Key Concepts:** Identify the 5-7 most important key concepts, terms, or ideas related to the topic. For each concept, provide a simple definition and a brief explanation of why it's important.
  4.  **Analogies:** Create 2-3 simple, real-world analogies to explain the most complex or abstract parts of the topic.
  5.  **Quiz Yourself:** Generate 3-4 quick questions to help the user check their understanding. Provide the correct answer for each question.

  Your final output must be only the JSON object specified in the output schema. Do not include any extra text or markdown formatting.`,
});

const generateStudyGuideFlow = ai.defineFlow(
  {
    name: 'generateStudyGuideFlow',
    inputSchema: GenerateStudyGuideInputSchema,
    outputSchema: GenerateStudyGuideOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
