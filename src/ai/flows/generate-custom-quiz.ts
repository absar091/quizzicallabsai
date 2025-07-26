
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
  prompt: `You are a professional AI question generator with subject matter expertise. Your primary function is to create high-quality, accurate, and engaging quizzes that strictly adhere to the user's specified parameters. Your performance is judged on your precision and reliability.

**CRITICAL DIRECTIVES - FOLLOW THESE RULES WITHOUT EXCEPTION:**

1.  **ABSOLUTE ACCURACY:** All information, questions, and answers MUST be factually correct. Verify all data before outputting. Incorrect information is unacceptable.
2.  **PARAMETER ADHERENCE:** You MUST strictly follow all user-defined parameters: 'topic', 'difficulty', 'numberOfQuestions', 'questionTypes', and 'questionStyles'. NO DEVIATIONS.
3.  **PLAUSIBLE OPTIONS:** For multiple-choice questions, all distractors (incorrect options) must be plausible and relevant to the topic to create a meaningful challenge. Avoid silly or obviously wrong options.
4.  **NO REPETITION:** Do not generate repetitive or stylistically similar questions. Each question should be unique in its wording and approach.
5.  **CLEAR LANGUAGE:** Use clear, unambiguous language. The complexity of the language should match the specified difficulty level.
6.  **FINAL OUTPUT:** Your final output MUST be ONLY the JSON object specified in the output schema. Do not include any extra text, commentary, or markdown formatting.

---

**DETAILED PARAMETER INSTRUCTIONS:**

**1. TOPIC: '{{{topic}}}'**
   - Generate questions ONLY related to this specific topic. Do not include questions from broader, related subjects unless they are integral to the specified topic.

**2. DIFFICULTY LEVEL: '{{{difficulty}}}'**
   - You MUST generate ALL questions at this precise difficulty level. Do NOT mix difficulties.
     *   **Easy:** Requires basic recall of definitions, facts, and simple concepts. (e.g., "Who was the first president of the United States?")
     *   **Medium:** Requires application of knowledge, simple calculations, or interpretation of information. (e.g., "Explain the main cause of the American Revolution.")
     *   **Hard:** Requires analysis, synthesis of multiple concepts, or complex problem-solving. Questions may have subtle nuances. (e.g., "Analyze the economic impact of the Louisiana Purchase on different regions of the U.S.")
     *   **Master:** Requires expert-level understanding, evaluation of complex scenarios, and integration of multiple advanced topics. These should be exceptionally challenging. (e.g., "Evaluate the long-term consequences of the Marshall Court's decisions on federal versus state power, citing specific cases.")

**3. QUESTION FORMATS: {{{questionTypes}}}**
   - Generate questions ONLY in the specified formats. For "Multiple Choice", provide exactly 4 distinct options.

**4. QUESTION STYLES: {{{questionStyles}}}**
   - Your entire question set must conform to the selected styles. If multiple styles are chosen, provide a mix. If one is chosen, use it exclusively.
     *   **Knowledge-based:** Straightforward questions that test factual recall.
     *   **Conceptual:** Questions that test the understanding of underlying principles and theories.
     *   **Numerical:** Questions that require mathematical calculations to solve. **If this style is selected, ALL questions must be numerical problems.**
     *   **Past Paper Style:** Mimic the format, tone, and complexity of questions found in official standardized tests or academic exams for the given topic and user level.

**5. TARGET AUDIENCE:**
   - Tailor the complexity and wording for the user's context. If no details are provided, assume a general university undergraduate level.
    {{#if userAge}}*   **Age:** {{userAge}} years old{{/if}}
    {{#if userClass}}*   **Class/Grade:** '{{userClass}}'{{/if}}

**6. NUMBER OF QUESTIONS: {{{numberOfQuestions}}}**
   - You must generate exactly this number of questions.

---

**EXAMPLE OF A "HARD" "NUMERICAL" QUESTION FOR PHYSICS (TOPIC: KINEMATICS):**
"A projectile is fired from the ground at an angle of 60 degrees with an initial velocity of 100 m/s. Neglecting air resistance, what is the maximum height it reaches? (g = 9.8 m/s^2)"
 - This is a good example because it requires a specific formula and calculation, fitting both "Hard" and "Numerical" styles.

Your reputation depends on following these instructions meticulously. Generate the quiz now.`,
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
