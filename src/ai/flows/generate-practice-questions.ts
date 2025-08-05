
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
  learningStyle: z.string().optional().describe('The user\'s preferred learning style (e.g., "visual", "auditory", "kinesthetic", "reading/writing"). This should influence the style of explanation.'),
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

const promptText = `You are a professional AI question generator designed to create high-quality, subject-accurate questions across multiple topics. Your goal is to build user trust by providing accurate and well-structured content, personalized to the user's learning style.

Follow these strict rules to ensure accuracy, quality, and user satisfaction:

✅ GENERAL RULES:
1.  **FACTUAL ACCURACY IS PARAMOUNT:** You MUST stay strictly within the correct facts of the subject matter. If you are even slightly unsure about a fact, do not guess or include incorrect information.
2.  **VERIFY ANSWERS:** You MUST internally verify all answers before outputting them. Wrong answers are a critical failure and destroy user trust.
3.  **PLAUSIBLE OPTIONS:** For "multiple choice" questions, all incorrect options must be plausible and based on common misconceptions. They must not be obviously wrong, silly, or unrelated.
4.  **CLARITY AND PRECISION:** Use clear, concise, and unambiguous language. Avoid tricky or ambiguous wording that could confuse the user.
5.  **VARIETY:** Vary the question structure and wording to keep the user engaged and test concepts from different angles.

🎯 QUESTION STRUCTURE & PERSONALIZATION:
For each question, you MUST provide:
*   'question': The question text.
*   'answer': The single, unequivocally correct answer.
*   'explanation': A concise explanation for why the answer is correct. This explanation MUST be tailored to the user's learning style.
*   'options': For "multiple choice" questions, provide exactly 4 plausible options, one of which MUST be the correct answer.

❗ CRITICAL TASK INSTRUCTIONS:
Generate practice questions based on the following parameters. You must adhere to these precisely.

*   **Subject:** {{{subject}}}
*   **Topic:** {{{topic}}}
*   **Difficulty:** {{#if difficulty}}{{{difficulty}}}{{else}}A balanced mix (40% easy, 40% medium, 20% hard){{/if}}
*   **Number of Questions:** {{#if numberOfQuestions}}{{{numberOfQuestions}}}{{else}}5{{/if}}
*   **Question Type:** {{#if questionType}}{{{questionType}}}{{else}}multiple choice{{/if}}
*   **Learning Style:** {{#if learningStyle}}'{{{learningStyle}}}'. Tailor your explanations accordingly. For example, for a 'visual' learner, use descriptive imagery. For a 'reading/writing' learner, be text-based and structured.{{else}}a general style{{/if}}.

Your final output MUST be ONLY the JSON object specified in the output schema. Do not include any extra text, commentary, or markdown formatting.
`;

const prompt15Flash = ai.definePrompt({
  name: 'generatePracticeQuestionsPrompt15Flash',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: GeneratePracticeQuestionsInputSchema},
  output: {schema: GeneratePracticeQuestionsOutputSchema},
  prompt: promptText,
});

const prompt15Pro = ai.definePrompt({
  name: 'generatePracticeQuestionsPrompt15Pro',
  model: 'googleai/gemini-1.5-pro',
  input: {schema: GeneratePracticeQuestionsInputSchema},
  output: {schema: GeneratePracticeQuestionsOutputSchema},
  prompt: promptText,
});

const generatePracticeQuestionsFlow = ai.defineFlow(
  {
    name: 'generatePracticeQuestionsFlow',
    inputSchema: GeneratePracticeQuestionsInputSchema,
    outputSchema: GeneratePracticeQuestionsOutputSchema,
  },
  async input => {
    let output;
    try {
        const result = await prompt15Flash(input);
        output = result.output;
    } catch (error: any) {
        if (error.message && (error.message.includes('503') || error.message.includes('overloaded') || error.message.includes('429'))) {
            // Fallback to gemini-1.5-pro if 1.5-flash is overloaded or rate limited
            console.log('Gemini 1.5 Flash unavailable, falling back to Gemini 1.5 Pro.');
            const result = await prompt15Pro(input);
            output = result.output;
        } else {
            // Re-throw other errors
            throw error;
        }
    }
    
    if (!output) {
      throw new Error("The AI model failed to return valid practice questions. Please try again.");
    }
    return output;
  }
);
