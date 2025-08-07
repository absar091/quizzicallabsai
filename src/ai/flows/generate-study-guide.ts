
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
  learningDifficulties: z.string().optional().describe("The specific areas or concepts within the topic the user struggles with."),
  learningStyle: z.string().optional().describe("The user's preferred way of learning (e.g., 'visual with diagrams', 'simple analogies', 'step-by-step instructions')."),
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

const promptText = `You are an expert educator and content creator. Your task is to generate a comprehensive, accurate, and easy-to-digest study guide for the following topic: {{{topic}}}.

  The study guide MUST be personalized based on the user's learning preferences and difficulties.

  **Critical Instructions:**
  1.  **ACCURACY IS KEY:** All definitions, explanations, and facts must be 100% accurate and verified. Do not include speculative or incorrect information.
  2.  **STRUCTURED CONTENT:** Follow the output structure precisely.
      *   **Title:** Create a clear, compelling title for the study guide.
      *   **Summary:** Write a short, engaging, and accurate summary (2-3 sentences) of the overall topic.
      *   **Key Concepts:** Identify the 5-7 most important key concepts, terms, or ideas related to the topic. For each concept, you MUST provide a simple, clear definition and a brief explanation of why it's truly important for understanding the topic.
      *   **Analogies:** Create 2-3 simple, effective, real-world analogies to explain the most complex or abstract parts of the topic. The analogy must be easy to understand and directly relevant.
      *   **Quiz Yourself:** Generate 3-4 high-quality questions that effectively test the understanding of the key concepts. Provide the correct and concise answer for each question.
  3.  **CLARITY:** Use language that is easy to understand, avoiding jargon where possible or explaining it clearly when necessary.
  4.  **PERSONALIZATION (MOST IMPORTANT):**
      {{#if learningDifficulties}}*   **User's Difficulties:** '{{{learningDifficulties}}}'. Pay special attention to these areas. Provide extra detail, simpler explanations, or targeted examples for these specific concepts in the "Key Concepts" section.{{/if}}
      {{#if learningStyle}}*   **User's Learning Style:** '{{{learningStyle}}}'. Adapt the entire study guide to this style. For example, if the user is a 'visual' learner, describe diagrams or use visual metaphors. If they prefer 'analogies', make sure the analogies are prominent and clear.{{/if}}
  5.  **FINAL OUTPUT FORMAT:** Your final output MUST be ONLY the JSON object specified in the output schema. Do not include any extra text, commentary, or markdown formatting. The JSON must be perfect and parsable.

  Generate the personalized study guide now.`;

const prompt = ai.definePrompt({
  name: 'generateStudyGuidePrompt',
  model: 'googleai/gemini-2.0-flash-preview',
  input: {schema: GenerateStudyGuideInputSchema},
  output: {schema: GenerateStudyGuideOutputSchema},
  prompt: promptText,
});


const generateStudyGuideFlow = ai.defineFlow(
  {
    name: 'generateStudyGuideFlow',
    inputSchema: GenerateStudyGuideInputSchema,
    outputSchema: GenerateStudyGuideOutputSchema,
  },
  async input => {
    let output;
    try {
        const result = await prompt(input);
        output = result.output;
    } catch (error: any) {
        console.error('Gemini 2.0 Flash failed with unhandled error:', error);
        throw new Error(`Failed to generate study guide: ${error.message}`);
    }
    
    if (
      !output ||
      !output.title ||
      !output.summary ||
      !output.keyConcepts ||
      output.keyConcepts.length === 0 ||
      !Array.isArray(output.keyConcepts) ||
      !output.analogies ||
      !Array.isArray(output.analogies) ||
      !output.quizYourself ||
      !Array.isArray(output.quizYourself)
    ) {
      throw new Error(
        'The AI model returned a study guide with missing or invalid structure. Please try again.'
      );
    }
    return output;
  }
);
