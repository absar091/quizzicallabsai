
/**
 * @fileOverview Generates a quiz from a document or image file.
 *
 * - generateQuizFromDocument - A function that generates a quiz from a file.
 * - GenerateQuizFromDocumentInput - The input type for the function.
 * - GenerateQuizFromDocumentOutput - The return type for the function.
 */

import {ai, isAiAvailable} from '@/ai/genkit';
import { getModel } from '@/lib/getModel';
import {z} from 'genkit';
import { sanitizeLogInput } from '@/lib/security';

const GenerateQuizFromDocumentInputSchema = z.object({
  documentDataUri: z
 .string()
    .describe(
      "A document or image to generate a quiz from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  numberOfQuestions: z.number().min(1).max(55),
  difficulty: z.enum(["easy", "medium", "hard", "master"]),
  questionTypes: z.array(z.string()),
  isPro: z.boolean().default(false),
});
export type GenerateQuizFromDocumentInput = z.infer<typeof GenerateQuizFromDocumentInputSchema>;

const GenerateQuizFromDocumentOutputSchema = z.object({
  quiz: z.array(
    z.object({
      type: z.enum(['multiple-choice', 'descriptive']).describe('The type of the question.'),
      question: z.string(),
      answers: z.array(z.string()).optional().describe('Answer choices for multiple-choice questions.'),
      correctAnswer: z.string().optional().describe('The correct answer for multiple-choice questions.'),
    })
  ).describe('The generated quiz questions and answers based on the document.'),
});
export type GenerateQuizFromDocumentOutput = z.infer<typeof GenerateQuizFromDocumentOutputSchema>;

export async function generateQuizFromDocument(
  input: GenerateQuizFromDocumentInput
): Promise<GenerateQuizFromDocumentOutput> {
 if (typeof process === 'undefined' || !isAiAvailable()) {
    throw new Error('AI service is not configured. Please contact support.');
  }
  
  const aiInstance = ai || (await import('@/ai/genkit')).ai;
  if (!aiInstance) {
    throw new Error('AI service is not configured. Please contact support.');
  }
  
 // Explicit input validation
 if (input.documentDataUri.length > 10000000) {
 throw new Error("The document is too large. Please upload a smaller document (max 10MB).");
  }
 if (input.numberOfQuestions < 1 || input.numberOfQuestions > 55) {
 throw new Error("Number of questions must be between 1 and 55.");
  }
 if (!["easy", "medium", "hard", "master"].includes(input.difficulty)) {
 throw new Error(`Invalid difficulty level: ${input.difficulty}. Must be easy, medium, hard, or master.`);
  }

 const flow = generateQuizFromDocumentFlow(aiInstance);
 return await flow(input);
}

const getPromptText = (isPro: boolean) => `You are an expert quiz generator. Your task is to create a high-quality quiz based *exclusively* on the content of the provided document or image.

${isPro ? '**PRO USER - PREMIUM DOCUMENT ANALYSIS:**\r\n- Provide more sophisticated question analysis\r\n- Create more nuanced and challenging questions\r\n- Include deeper comprehension and critical thinking questions\r\n- Generate more sophisticated distractors for MCQs\r\n- Focus on advanced document interpretation skills\r\n\r\n' : '**STANDARD DOCUMENT ANALYSIS:**\r\n- Focus on core document comprehension\r\n- Create clear, straightforward questions\r\n- Ensure accessibility and fundamental understanding\r\n\r\n'}

  **Critical Instructions - Follow these rules without exception:**
  1.  **STRICTLY ADHERE TO THE DOCUMENT:** Analyze the provided file: {{media url=documentDataUri}}. You MUST generate exactly {{{numberOfQuestions}}} questions and answers using ONLY the information found within it.
  2.  **EXACT QUESTION COUNT & TYPES:** Your response must contain exactly {{{numberOfQuestions}}} questions of the types specified: {{#each questionTypes}}'{{this}}'{{/each}}.
  3.  **NO EXTERNAL KNOWLEDGE:** Do NOT use any information from outside the provided document. All questions and answers must be derivable solely from the text in the document. This is your most important rule.
  4.  **HIGH-QUALITY QUESTIONS:** Generate clear, unambiguous questions that test comprehension of the document's key points, tailored to a '{{{difficulty}}}' difficulty level.
  5.  **PLAUSIBLE DISTRACTORS:** For multiple-choice questions, create plausible incorrect answers (distractors) that are relevant to the document's context.
  6.  **OUTPUT FORMAT:** Your final output MUST be ONLY the JSON object specified in the output schema. Do not include any extra text, commentary, or markdown formatting. The JSON must be perfect and parsable.

  Generate the quiz now. Your entire response must be based *only* on the provided document and must contain exactly {{{numberOfQuestions}}} questions.`;

const createPrompt = (aiInstance: any, isPro: boolean, useFallback: boolean = false) => aiInstance.definePrompt({
    name: 'generateQuizFromDocumentPrompt',
    model: `googleai/${getModel(isPro, useFallback)}`,
    prompt: getPromptText(isPro),
    input: { schema: GenerateQuizFromDocumentInputSchema },
    output: { schema: GenerateQuizFromDocumentOutputSchema },
});

const generateQuizFromDocumentFlow = (aiInstance: any) => aiInstance.defineFlow(
  {
    name: 'generateQuizFromDocumentFlow',
    inputSchema: GenerateQuizFromDocumentInputSchema,
    outputSchema: GenerateQuizFromDocumentOutputSchema,
  },
  async (input) => {
    const model = getModel(input.isPro);
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const model = getModel(input.isPro, attempt > 1);
        const prompt = createPrompt(aiInstance, input.isPro, attempt > 1);
        const result = await prompt(input, { model });
        const output = result.output;

        if (!output) {
          throw new Error("The AI model failed to return a valid quiz from the document.");
        }

        // Validate the structure of the generated quiz
        if (!Array.isArray(output.quiz) || output.quiz.length === 0) {
          throw new Error("The AI model returned an empty or invalid quiz structure. The document might be empty, unreadable, or too complex.");
        }

        // Basic check for expected fields in questions
        for (const question of output.quiz) {
          if (!question.question || !question.type) {
            throw new Error("The AI model returned questions with missing required fields.");
          }
        }

        return output;
      } catch (error: any) {
        lastError = error;
        console.error(`Quiz from document generation attempt ${attempt} failed:`, sanitizeLogInput(error.message));

        if (attempt === maxRetries) break;

        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Categorize the final error
    const errorMessage = lastError?.message || 'Unknown error';
    if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      // Rotate to next API key for quota issues
      try {
        const { handleApiKeyError } = await import('@/lib/api-key-manager');
        handleApiKeyError();
        console.log('🔄 Rotated API key due to quota limit (quiz from document)');
      } catch (rotateError) {
        console.warn('Failed to rotate API key:', rotateError);
      }
      throw new Error('AI service quota exceeded. Please try again in a few minutes.');
    } else if (errorMessage.includes('timeout') || errorMessage.includes('deadline')) {
      throw new Error('Request timed out. The document might be too large or complex. Please try with a smaller file.');
    } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error('Failed to generate quiz from document. Please try again or contact support if the issue persists.');
    }
  }
);
