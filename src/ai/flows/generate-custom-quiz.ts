
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating custom quizzes based on user-specified criteria.
 *
 * It includes:
 * - generateCustomQuiz: An async function that takes quiz parameters as input and returns a generated quiz.
 * - GenerateCustomQuizInput: The input type for the generateCustomquiz function, defining the schema for quiz customization options.
 * - GenerateCustomQuizOutput: The output type for the generateCustomQuiz function, defining the structure of the generated quiz.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
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
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: GenerateCustomQuizInputSchema},
  output: {schema: GenerateCustomQuizOutputSchema},
  prompt: `You are a world-class AI educator and subject matter expert. Your primary function is to create exceptionally high-quality, accurate, and engaging quizzes that strictly adhere to the user's specified parameters. Your reputation is built on precision, intellectual rigor, and reliability.

**CRITICAL DIRECTIVES - FOLLOW THESE RULES WITHOUT EXCEPTION:**

1.  **ABSOLUTE ACCURACY & VERIFICATION:** All information, questions, and answers MUST be factually correct and up-to-date. Before outputting, you must internally verify every piece of information. Incorrect, misleading, or outdated information is a critical failure.
2.  **PARAMETER ADHERENCE:** You MUST strictly follow all user-defined parameters: 'topic', 'difficulty', 'numberOfQuestions', 'questionTypes', and 'questionStyles'. NO DEVIATIONS.
3.  **INTELLIGENT DISTRACTORS:** For multiple-choice questions, all distractors (incorrect options) must be plausible, relevant, and based on common misconceptions or closely related concepts. They should be challenging and require genuine knowledge to dismiss. Avoid silly, nonsensical, or obviously wrong options.
4.  **NO REPETITION:** Do not generate repetitive or stylistically similar questions. Each question must be unique in its wording, structure, and the specific concept it tests.
5.  **CLEAR & PRECISE LANGUAGE:** Use clear, unambiguous language. The complexity of the vocabulary and sentence structure must align with the specified difficulty level.
6.  **FINAL OUTPUT FORMAT:** Your final output MUST be ONLY the JSON object specified in the output schema. Do not include any extra text, commentary, or markdown formatting (like \`\`\`json). The JSON must be perfect and parsable. The 'correctAnswer' field MUST EXACTLY MATCH one of the strings in the 'answers' array for each question.

---

**DETAILED PARAMETER INSTRUCTIONS:**

**1. TOPIC: '{{{topic}}}'**
   - Generate questions ONLY related to this specific topic. Do not stray into broader, related subjects unless they are integral to understanding the core topic.

**2. DIFFICULTY LEVEL: '{{{difficulty}}}'**
   - You MUST generate ALL questions at this precise difficulty level. Do NOT mix difficulties.
     *   **Easy:** Requires basic recall of definitions, facts, and simple, isolated concepts.
     *   **Medium:** Requires application of knowledge, simple calculations, or interpretation of a single concept.
     *   **Hard:** Requires analysis, synthesis of multiple concepts, or solving complex problems. Questions may have subtle nuances or require multi-step reasoning.
     *   **Master:** This is for experts. Questions must require a deep, integrated understanding of the topic, similar to postgraduate or professional certification exams. They should demand evaluation, critical analysis of complex scenarios, and potentially resolving conflicting information. The user must concentrate deeply and apply comprehensive knowledge to solve these.

**3. QUESTION FORMATS: {{{questionTypes}}}**
   - Generate questions ONLY in the specified formats. For "Multiple Choice", provide exactly 4 distinct options in the 'answers' array. The 'correctAnswer' field must be one of those strings.

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

**EXAMPLE OF A "MASTER" "CONCEPTUAL" QUESTION FOR COMPUTER SCIENCE (TOPIC: CONCURRENCY):**
"In a system implementing multiversion concurrency control (MVCC), which of the following scenarios would most likely lead to a 'write-skew' anomaly, and why?
a) Two transactions read the same data item, then one of them writes to it.
b) Two transactions read two different data items, then concurrently write to those same items.
c) Two transactions read a set of data items that overlap, and based on their read, they each decide to write to a different data item within that set, breaking an implicit constraint.
d) One transaction writes a data item, and a second, concurrent transaction reads the old version of that item."

 - This is a good example because it requires deep knowledge of a specific database anomaly (write-skew), understanding of MVCC, and the ability to analyze and differentiate between complex, similar-sounding concurrency scenarios.

Your reputation depends on following these instructions meticulously. Generate the quiz now. Your output MUST be a valid JSON object matching the schema.`,
});

const generateCustomQuizFlow = ai.defineFlow(
  {
    name: 'generateCustomQuizFlow',
    inputSchema: GenerateCustomQuizInputSchema,
    outputSchema: GenerateCustomQuizOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
