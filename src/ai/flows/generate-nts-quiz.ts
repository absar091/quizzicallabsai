
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating NTS/NAT quizzes.
 * It handles both subject-specific and reasoning-based questions.
 *
 * - generateNtsQuiz: An async function that generates a quiz based on the NTS category and topic.
 * - GenerateNtsQuizInput: The input type for the generateNtsQuiz function.
 * - GenerateNtsQuizOutput: The output type for the generateNtsQuiz function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const GenerateNtsQuizInputSchema = z.object({
  category: z.string().describe('The NTS/NAT category (e.g., NAT-IE, NAT-IM, Analytical Reasoning, Quantitative Reasoning, Verbal Reasoning).'),
  topic: z.string().describe('The specific topic or subject for the quiz. For reasoning sections, this will be the name of the section itself. For subject tests, it can be very detailed.'),
  numberOfQuestions: z.number().min(1).max(55).describe('The number of questions to generate.'),
});
export type GenerateNtsQuizInput = z.infer<typeof GenerateNtsQuizInputSchema>;

const GenerateNtsQuizOutputSchema = z.object({
  quiz: z.array(
    z.object({
      type: z.literal('multiple-choice'),
      question: z.string(),
      answers: z.array(z.string()),
      correctAnswer: z.string(),
    })
  ).describe('The generated quiz questions and answers.'),
});
export type GenerateNtsQuizOutput = z.infer<typeof GenerateNtsQuizOutputSchema>;

export async function generateNtsQuiz(
  input: GenerateNtsQuizInput
): Promise<GenerateNtsQuizOutput> {
  return generateNtsQuizFlow(input);
}

const promptText = `You are an expert AI for creating NTS (National Testing Service) and NAT (National Aptitude Test) questions for Pakistani students. You MUST generate high-quality, multiple-choice questions that are relevant to the specified category and topic.

**CRITICAL DIRECTIVES - FOLLOW THESE RULES WITHOUT EXCEPTION:**

1.  **ABSOLUTE ACCURACY:** All questions and answers MUST be factually correct and relevant to the Pakistani curriculum where applicable.
2.  **EXACT QUESTION COUNT:** You MUST generate the exact number of questions specified in 'numberOfQuestions': {{{numberOfQuestions}}}.
3.  **QUESTION FORMAT:**
    *   All questions must be multiple-choice.
    *   The 'type' field MUST be "multiple-choice".
    *   Provide exactly 4 distinct and plausible options in the 'answers' array. Do not provide more or less than 4.
    *   The 'correctAnswer' field must perfectly match one of the strings in the 'answers' array.
4.  **FINAL OUTPUT FORMAT:** Your final output MUST be ONLY the JSON object specified in the output schema. No extra text or markdown.

---

**TASK: Generate a quiz based on the following parameters:**

*   **NTS/NAT Category:** '{{{category}}}'
*   **Topic/Subject:** '{{{topic}}}'
*   **Number of Questions:** {{{numberOfQuestions}}}

**CATEGORY-SPECIFIC INSTRUCTIONS:**

*   **If the Topic includes 'Analytical Reasoning':**
    *   Focus on logical puzzles, number/letter series, pattern recognition, and logical deductions based on a short paragraph of conditions.
    *   The topic will specify the sub-type (e.g., 'Puzzles & Diagrams', 'Logical Deductions').
    *   Questions should require critical thinking, not just knowledge recall.

*   **If the Topic includes 'Quantitative Reasoning':**
    *   Focus on core math skills: algebra, ratios, percentages, arithmetic problems, and basic geometry.
    *   Questions should be similar to those found in standardized aptitude tests, often presented as word problems.

*   **If the Topic includes 'Verbal Reasoning':**
    *   Focus on English grammar, vocabulary (synonyms/antonyms), sentence completion, and analogies.

*   **If the Category is a subject group (e.g., 'NAT-IE', 'NAT-IM', 'NAT-ICS') AND the topic is a specific academic subject:**
    *   The topic will specify a subject like 'Physics' and a chapter like 'Motion and Force'.
    *   You are REQUIRED to generate questions strictly based on the Pakistani FSc/ICS curriculum for that subject and chapter.
    *   The difficulty should be appropriate for a university admission test (NAT level). Do not use content from outside this curriculum.

Generate the quiz now. Your output must be a valid JSON object with exactly {{{numberOfQuestions}}} questions.`;


const generateNtsQuizFlow = ai.defineFlow(
  {
    name: 'generateNtsQuizFlow',
    inputSchema: GenerateNtsQuizInputSchema,
    outputSchema: GenerateNtsQuizOutputSchema,
  },
  async input => {
    const { output } = await ai.generate({
        model: googleAI.model('gemini-1.5-flash'),
        prompt: promptText,
        input: input,
        output: { schema: GenerateNtsQuizOutputSchema },
    });
    return output!;
  }
);
