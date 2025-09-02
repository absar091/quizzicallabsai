
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a study guide for a given topic.
 *
 * - generateStudyGuide: An async function that takes a topic and returns a structured study guide.
 * - GenerateStudyGuideInput: The input type for the generateStudyGuide function.
 * - GenerateStudyGuideOutput: The output type for the generateStudyGuide function.
 */

import {ai, isAiAvailable} from '@/ai/genkit';
import { getModel } from '@/lib/models';
import {z} from 'genkit';

const GenerateStudyGuideInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate the study guide.'),
  learningDifficulties: z.string().optional().describe("The specific areas or concepts within the topic the user struggles with."),
  learningStyle: z.string().optional().describe("The user's preferred way of learning (e.g., 'visual with diagrams', 'simple analogies', 'step-by-step instructions')."),
  isPro: z.boolean().default(false),
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
  // Check if AI is available
  if (!isAiAvailable() || !ai) {
    throw new Error('AI service is temporarily unavailable. Please try again later.');
  }
  
  // Input validation
  if (!input.topic || input.topic.trim().length < 3) {
    throw new Error('Topic must be at least 3 characters long.');
  }
  
  try {
    return await generateStudyGuideFlow(input);
  } catch (error: any) {
    console.error('Study guide generation failed:', error?.message || error);
    
    if (error?.message?.includes('quota') || error?.message?.includes('rate limit')) {
      throw new Error('AI service is busy. Please wait a moment and try again.');
    }
    if (error?.message?.includes('timeout') || error?.message?.includes('deadline')) {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw new Error('Failed to generate study guide. Please try again.');
  }
}

const getPromptText = (isPro: boolean) => `You are an expert educator and content creator. Your task is to generate a comprehensive, accurate, and easy-to-digest study guide for the following topic: {{{topic}}}.

${isPro ? '**PRO USER - PREMIUM QUALITY:**
- Provide more detailed explanations and advanced concepts
- Include additional key concepts (7-10 instead of 5-7)
- Create more sophisticated analogies
- Generate more comprehensive quiz questions (5-6 instead of 3-4)
- Focus on deeper understanding and critical thinking

' : '**STANDARD USER:**
- Focus on core concepts and fundamental understanding
- Keep explanations clear and accessible
- Provide essential knowledge for solid foundation

'}The study guide MUST be personalized based on the user's learning preferences and difficulties.

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


const generateStudyGuideFlow = ai!.defineFlow(
  {
    name: 'generateStudyGuideFlow',
    inputSchema: GenerateStudyGuideInputSchema,
    outputSchema: GenerateStudyGuideOutputSchema,
  },
  async input => {
    let output;
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount <= maxRetries) {
      try {
        // Use fallback model on retry
        const model = getModel(input.isPro, retryCount > 0);
        
        const prompt = ai!.definePrompt({
          name: 'generateStudyGuidePrompt',
          model: model,
          input: {schema: GenerateStudyGuideInputSchema},
          output: {schema: GenerateStudyGuideOutputSchema},
          prompt: getPromptText(input.isPro),
        });
        
        const result = await prompt(input);
        output = result.output;
        
        if (
          output &&
          output.title &&
          output.summary &&
          output.keyConcepts &&
          Array.isArray(output.keyConcepts) &&
          output.keyConcepts.length > 0 &&
          output.analogies &&
          Array.isArray(output.analogies) &&
          output.quizYourself &&
          Array.isArray(output.quizYourself)
        ) {
          return output;
        } else {
          throw new Error("AI returned incomplete study guide");
        }
      } catch (error: any) {
        retryCount++;
        const errorMsg = error?.message || 'Unknown error';
        console.error(`Study guide generation attempt ${retryCount} failed:`, errorMsg);
        
        if (retryCount > maxRetries) {
          if (errorMsg.includes('quota') || errorMsg.includes('rate limit')) {
            throw new Error('API quota exceeded. Please try again in a few minutes.');
          } else if (errorMsg.includes('timeout') || errorMsg.includes('deadline')) {
            throw new Error('Request timeout. The AI service is busy. Please try again.');
          } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
            throw new Error('Network connection issue. Please check your internet connection.');
          } else {
            throw new Error(`Failed to generate study guide after ${maxRetries + 1} attempts. Please try again.`);
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
    }
    
    throw new Error("Unexpected error in study guide generation flow.");
  }
);
