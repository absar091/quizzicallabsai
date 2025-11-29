
/**
 * @fileOverview This file defines a Genkit flow for generating a study guide for a given topic.
 *
 * - generateStudyGuide: An async function that takes a topic and returns a structured study guide.
 * - GenerateStudyGuideInput: The input type for the generateStudyGuide function.
 * - GenerateStudyGuideOutput: The output type for the generateStudyGuide function.
 */

import {ai, isAiAvailable} from '@/ai/genkit';
import { getModel } from '@/lib/getModel';
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
  summary: z.string().describe('A brief, high-level summary with LaTeX for formulas (use $...$ for inline, $$...$$ for display).'),
  keyConcepts: z.array(
    z.object({
      concept: z.string().describe('A key concept with LaTeX formatting for math/chemistry.'),
      definition: z.string().describe('Definition with LaTeX formulas, chemical equations using $\\ce{...}$, and proper notation.'),
      importance: z.string().describe('Why this concept is important.'),
      formula: z.string().optional().describe('Key formula in LaTeX format if applicable (e.g., $$E = mc^2$$).'),
      diagram: z.object({
        searchQuery: z.string(),
        aspectRatio: z.enum(['1:1', '4:3', '16:9'])
      }).optional().describe('Diagram placeholder for visual learners.'),
    })
  ).describe('Key concepts with formulas, equations, and visual aids.'),
  formulas: z.array(
    z.object({
      name: z.string().describe('Formula name.'),
      formula: z.string().describe('LaTeX formula (e.g., $$F = ma$$).'),
      explanation: z.string().describe('When and how to use this formula.'),
      example: z.string().optional().describe('Worked example with LaTeX.'),
    })
  ).optional().describe('Important formulas for physics, chemistry, or math topics.'),
  analogies: z.array(
      z.object({
          analogy: z.string().describe("Simple analogy with LaTeX if needed."),
          concept: z.string().describe("The concept explained.")
      })
  ).describe("Real-world analogies for complex concepts."),
  visualAids: z.array(
    z.object({
      title: z.string().describe('Visual aid title.'),
      description: z.string().describe('What the diagram/chart shows.'),
      searchQuery: z.string().describe('Search query for diagram placeholder.'),
      aspectRatio: z.enum(['1:1', '4:3', '16:9'])
    })
  ).optional().describe('Suggested diagrams and visual aids.'),
  quizYourself: z.array(
      z.object({
          question: z.string().describe("Question with LaTeX formatting."),
          answer: z.string().describe("Answer with LaTeX and detailed explanation.")
      })
  ).describe("Self-test questions with proper mathematical notation."),
  usedTokens: z.number().optional().describe('Actual tokens used from Gemini API'),
});
export type GenerateStudyGuideOutput = z.infer<typeof GenerateStudyGuideOutputSchema>;

export async function generateStudyGuide(
  input: GenerateStudyGuideInput
): Promise<GenerateStudyGuideOutput> {
  if (typeof process === 'undefined' || !isAiAvailable()) {
    throw new Error('AI service is temporarily unavailable. Please try again later.');
  }
  
  const aiInstance = await ai;
  if (!aiInstance) {
    throw new Error('AI service is temporarily unavailable. Please try again later.');
  }
  
  // Input validation
  if (!input.topic || input.topic.trim().length < 3) {
    throw new Error('Topic must be at least 3 characters long.');
  }
  
  try {
    return await generateStudyGuideFlow(aiInstance, input);
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

const getPromptText = (isPro: boolean) => `You are a world-class educator and content creator with expertise in creating visually rich, mathematically precise study materials. Generate a comprehensive study guide for: {{{topic}}}.

**LATEX FORMATTING REQUIREMENTS:**
- Use $...$ for inline math: $E = mc^2$
- Use $$...$$ for display equations: $$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$
- Chemistry: $\\ce{2H2 + O2 -> 2H2O}$
- Physics formulas: $$F = ma$$, $$v = u + at$$
- Fractions: $\\frac{numerator}{denominator}$
- Greek letters: $\\alpha, \\beta, \\gamma$
- Subscripts/superscripts: $H_2O$, $x^2$

${isPro ? '**PRO USER - PREMIUM QUALITY:**\r\n- Include 8-12 key concepts with formulas and diagrams\r\n- Provide 3-5 important formulas with worked examples\r\n- Create 4-6 visual aid suggestions\r\n- Generate 6-8 comprehensive quiz questions\r\n- Use advanced LaTeX for complex equations\r\n- Include step-by-step problem-solving examples\r\n- Add chemical structures and reaction mechanisms\r\n\r\n' : '**STANDARD USER:**\r\n- Include 5-7 key concepts with essential formulas\r\n- Provide 2-3 basic formulas\r\n- Create 2-3 visual aid suggestions\r\n- Generate 4-5 quiz questions\r\n- Use clear LaTeX for fundamental equations\r\n\r\n'}

The study guide MUST be personalized and visually rich with proper mathematical notation.

  **Critical Instructions:**
  1.  **ACCURACY & PRECISION:** All content must be 100% accurate with proper LaTeX formatting for all mathematical and chemical content.
  2.  **RICH CONTENT STRUCTURE:**
      *   **Title:** Clear, compelling title
      *   **Summary:** 2-3 sentences with LaTeX for key formulas
      *   **Key Concepts:** Each with definition, importance, formula (if applicable), and diagram suggestion
      *   **Formulas:** Separate section for important equations with explanations and examples
      *   **Analogies:** Real-world comparisons for complex concepts
      *   **Visual Aids:** Diagram suggestions with descriptive search queries
      *   **Quiz Yourself:** Questions with LaTeX and detailed answers
  3.  **LATEX EXCELLENCE:** Use proper LaTeX notation for ALL mathematical, chemical, and physics content. Never write formulas as plain text.
  4.  **VISUAL LEARNING:** For diagrams, provide clear searchQuery descriptions like "diagram of cell structure with labeled organelles" or "graph showing quadratic function parabola".
  5.  **PERSONALIZATION:**
      {{#if learningDifficulties}}*   **User's Difficulties:** '{{{learningDifficulties}}}'. Provide extra detail, worked examples, and visual aids for these areas.{{/if}}
      {{#if learningStyle}}*   **Learning Style:** '{{{learningStyle}}}'. Adapt content accordingly - more diagrams for visual learners, more analogies for conceptual learners.{{/if}}
  6.  **OUTPUT FORMAT:** Return ONLY valid JSON matching the schema. Use proper LaTeX escaping in JSON strings (double backslashes: \\\\).

  Generate the personalized study guide now.`;


const generateStudyGuideFlow = async (aiInstance: any, input: GenerateStudyGuideInput): Promise<GenerateStudyGuideOutput> => {
  let output: GenerateStudyGuideOutput | undefined;
  let retryCount = 0;
  const maxRetries = 2;
  
  while (retryCount <= maxRetries) {
      try {
        // Use fallback model on retry
        const modelName = getModel(input.isPro, retryCount > 0);
        const model = `googleai/${modelName}`;
        
        const prompt = aiInstance.definePrompt({
          name: 'generateStudyGuidePrompt',
          model: model,
          input: {schema: GenerateStudyGuideInputSchema},
          output: {schema: GenerateStudyGuideOutputSchema},
          prompt: getPromptText(input.isPro),
        });
        
        const result = await prompt(input);
        output = result.output;
        
        // ✅ Correct & safe token usage extraction for Genkit
        const usedTokens =
          (result as any)?.raw?.response?.usageMetadata?.totalTokenCount ??
          (result as any)?.raw?.usageMetadata?.totalTokenCount ??
          0;
        console.log(`📊 Gemini usage: ${usedTokens} tokens for study guide`);
        
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
          return { ...output, usedTokens };
        } else {
          throw new Error("AI returned incomplete study guide");
        }
      } catch (error: any) {
        retryCount++;
        const errorMsg = error?.message || 'Unknown error';
        console.error(`Study guide generation attempt ${retryCount} failed:`, errorMsg);
        
        if (retryCount > maxRetries) {
          if (errorMsg.includes('quota') || errorMsg.includes('rate limit')) {
            // Rotate to next API key for quota issues
            try {
              const { handleApiKeyError } = await import('@/lib/api-key-manager');
              handleApiKeyError();
              console.log('🔄 Rotated API key due to quota limit (study guide)');
            } catch (rotateError) {
              console.warn('Failed to rotate API key:', rotateError);
            }
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
};
