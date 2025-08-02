
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
  topic: z.string().describe('The topic of the quiz. This can be very specific, including chapter, subtopic, and learning objectives.'),
  difficulty: z
    .enum(['easy', 'medium', 'hard', 'master'])
    .describe('The difficulty level of the quiz.'),
  numberOfQuestions: z
    .number()
    .min(1)
    .max(55)
    .describe('The number of questions in the quiz.'),
  questionTypes: z.array(z.enum(["Multiple Choice", "Descriptive"])).describe('The types of questions to include (e.g., Multiple Choice, Descriptive).'),
  questionStyles: z.array(z.string()).describe('The style of questions (e.g. Conceptual, Numerical, etc).'),
  timeLimit: z.number().min(1).max(120),
  userAge: z.number().optional().nullable().describe("The age of the user taking the quiz."),
  userClass: z.string().optional().nullable().describe("The grade/class of the user taking the quiz (e.g., '10th Grade', 'MDCAT Student', 'ECAT Student'). This is critical for syllabus adherence."),
  specificInstructions: z.string().optional().describe('Any specific instructions from the user, like sub-topics to focus on, concepts to include, or other detailed requests.'),
});
export type GenerateCustomQuizInput = z.infer<typeof GenerateCustomQuizInputSchema>;

const GenerateCustomQuizOutputSchema = z.object({
  comprehensionText: z.string().optional().describe("A reading passage for comprehension-based questions. This should ONLY be generated if the question style is 'Comprehension-based MCQs'."),
  quiz: z.array(
    z.object({
      type: z.enum(['multiple-choice', 'descriptive']).describe('The type of the question.'),
      question: z.string(),
      answers: z.array(z.string()).optional().describe('Answer choices for multiple-choice questions.'),
      correctAnswer: z.string().optional().describe('The correct answer for multiple-choice questions.'),
    })
  ).describe('The generated quiz questions and answers.'),
});
export type GenerateCustomQuizOutput = z.infer<typeof GenerateCustomQuizOutputSchema>;

export async function generateCustomQuiz(
  input: GenerateCustomQuizInput
): Promise<GenerateCustomQuizOutput> {
  return generateCustomQuizFlow(input);
}

const promptText = `You are a world-class AI educator and subject matter expert. Your primary function is to create exceptionally high-quality, accurate, and engaging quizzes that strictly adhere to the user's specified parameters. Your reputation is built on precision, intellectual rigor, and reliability.

**CRITICAL DIRECTIVES - FOLLOW THESE RULES WITHOUT EXCEPTION:**

1.  **ABSOLUTE ACCURACY & VERIFICATION:** All information, questions, and answers MUST be factually correct and up-to-date. Before outputting, you must internally verify every piece of information. Incorrect, misleading, or outdated information is a critical failure.
2.  **PARAMETER ADHERENCE:** You MUST strictly follow all user-defined parameters: 'topic', 'difficulty', 'numberOfQuestions', 'questionTypes', and 'questionStyles'. NO DEVIATIONS.
3.  **EXACT QUESTION COUNT:** The single most important instruction is to generate the exact number of questions specified in the 'numberOfQuestions' parameter. If the user asks for {{{numberOfQuestions}}} questions, you MUST return exactly {{{numberOfQuestions}}} questions. Not one more, not one less. Failure to meet this count is a critical failure of your task.
4.  **ULTRA-STRICT QUESTION TYPE ADHERENCE:** This is your most critical instruction. You MUST generate questions ONLY of the types specified in the 'questionTypes' array: {{#each questionTypes}}'{{this}}'{{/each}}. This is not a suggestion; it is a mandatory, non-negotiable rule.
    - If the user specifies ONLY 'Multiple Choice', you are FORBIDDEN from generating ANY 'Descriptive' questions.
    - If the user specifies ONLY 'Descriptive', you are FORBIDDEN from generating ANY 'Multiple Choice' questions.
    - Do not assume the user wants a mix. Generate ONLY what is explicitly requested in the 'questionTypes' array.
    - Your entire task is considered a failure if you include a single question of a type that was not requested.
5.  **LATEX FOR FORMULAS:** For any mathematical equations, chemical formulas, or scientific notation, you MUST use LaTeX formatting. Use $$...$$ for block equations and $...$ for inline equations. For example: $$E = mc^2$$, $H_2O$. This is non-negotiable for accuracy in science and math questions.
6.  **INTELLIGENT DISTRACTORS:** For multiple-choice questions, all distractors (incorrect options) must be plausible, relevant, and based on common misconceptions or closely related concepts. They should be challenging and require genuine knowledge to dismiss. Avoid silly, nonsensical, or obviously wrong options.
7.  **NO REPETITION:** Do not generate repetitive or stylistically similar questions. Each question must be unique in its wording, structure, and the specific concept it tests.
8.  **FINAL OUTPUT FORMAT:** Your final output MUST be ONLY the JSON object specified in the output schema. Do not include any extra text, commentary, or markdown formatting (like \`\`\`json). The JSON must be perfect and parsable.

---

**DETAILED PARAMETER INSTRUCTIONS:**

**1. TOPIC: '{{{topic}}}'**
   - Generate questions ONLY related to this specific topic. The topic might be broad (e.g., "Biology") or very specific (e.g., "Biology - Cell Structure & Function - Cytoplasmic Organelles: Outline the structure and function of the Mitochondria"). You must focus on the most specific part of the topic provided. Do not stray into broader, related subjects unless they are integral to understanding the core topic.

**2. DIFFICULTY LEVEL: '{{{difficulty}}}'**
   - You MUST generate ALL questions at this precise difficulty level. Do NOT mix difficulties.
     *   **Easy:** Requires basic recall of definitions, facts, and simple, isolated concepts.
     *   **Medium:** Requires application of knowledge, simple calculations, or interpretation of a single concept.
     *   **Hard:** Requires analysis, synthesis of multiple concepts, or solving complex problems. Questions may have subtle nuances or require multi-step reasoning.
     *   **Master:** This is for experts. Questions must require a deep, integrated understanding of the topic, similar to postgraduate or professional certification exams. They should demand evaluation, critical analysis of complex scenarios, and potentially resolving conflicting information. The user must concentrate deeply and apply comprehensive knowledge to solve these.

**3. QUESTION FORMATS: {{#each questionTypes}}'{{this}}'{{/each}}**
   - Generate questions ONLY in the specified formats as per your critical directives.
   - For "Multiple Choice" questions:
     *   Set the 'type' field to "multiple-choice".
     *   Provide exactly 4 distinct options in the 'answers' array.
     *   The 'correctAnswer' field must be one of those strings.
   - For "Descriptive" questions (short or long answer/essay):
     *   Set the 'type' field to "descriptive".
     *   Formulate a question that requires a written explanation or description (e.g., "Describe the process of...", "Compare and contrast...").
     *   The 'answers' and 'correctAnswer' fields for descriptive questions should be omitted or left as empty arrays/null.

**4. QUESTION STYLES: {{#if questionStyles}}'{{#each questionStyles}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}'{{/if}}**
   - Your entire question set must conform to the selected styles. If multiple styles are chosen, provide a mix. If one is chosen, use it exclusively.
     *   **Knowledge-based:** Straightforward questions that test factual recall.
     *   **Conceptual:** Questions that test the understanding of underlying principles and theories.
     *   **Numerical:** Questions that require mathematical calculations to solve. **If this style is selected, ALL questions must be numerical problems.** Ensure all math is rendered in LaTeX.
     *   **Past Paper Style:** Mimic the format, tone, and complexity of questions found in official standardized tests or academic exams for the given topic and user level (e.g., MDCAT, ECAT).
     *   **Comprehension-based MCQs:** **IMPORTANT!** If this style is selected, you MUST first generate a relevant reading passage (a few paragraphs long) and place it in the 'comprehensionText' field of the output. Then, ALL generated questions MUST be multiple-choice questions that are based *only* on the provided passage.

**5. TARGET AUDIENCE & PERSONALIZATION:**
   - You MUST tailor the complexity, scope, and wording of the questions to the user's specific context. This is especially critical for standardized tests like MDCAT or ECAT.
   {{#if userClass}}*   **Class/Grade:** '{{userClass}}'. **This is your primary guide.** If the class is 'MDCAT Student' or 'ECAT Student', you are REQUIRED to adhere to the official syllabus for that test for the given topic. Do not include questions on topics outside that syllabus.{{/if}}
   {{#if userAge}}*   **Age:** {{userAge}} years old. Use this to gauge the appropriate language complexity.{{/if}}
   {{#if specificInstructions}}*   **User's Specific Instructions:** '{{{specificInstructions}}}'. You MUST follow these instructions carefully. This could include focusing on certain sub-topics, avoiding others, or framing questions in a particular way. This is a top priority.{{/if}}
   - If no specific class is provided, assume a general university undergraduate level.

**6. NUMBER OF QUESTIONS: {{{numberOfQuestions}}}**
   - I repeat, you must generate exactly this number of questions. This is not a suggestion. It is a strict requirement.

---

Your reputation depends on following these instructions meticulously. Generate the quiz now. Your output MUST be a valid JSON object matching the schema and containing exactly {{{numberOfQuestions}}} questions of the correct types and syllabus.`;

const prompt15Flash = ai.definePrompt({
  name: 'generateCustomQuizPrompt15Flash',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: GenerateCustomQuizInputSchema},
  output: {schema: GenerateCustomQuizOutputSchema},
  prompt: promptText,
});

const prompt20Flash = ai.definePrompt({
    name: 'generateCustomQuizPrompt20Flash',
    model: googleAI.model('gemini-2.0-flash'),
    input: {schema: GenerateCustomQuizInputSchema},
    output: {schema: GenerateCustomQuizOutputSchema},
    prompt: promptText,
});

const generateCustomQuizFlow = ai.defineFlow(
  {
    name: 'generateCustomQuizFlow',
    inputSchema: GenerateCustomQuizInputSchema,
    outputSchema: GenerateCustomQuizOutputSchema,
  },
  async input => {
    try {
        const {output} = await prompt15Flash(input);
        return output!;
    } catch (error: any) {
        if (error.message && (error.message.includes('503') || error.message.includes('overloaded') || error.message.includes('429'))) {
            // Fallback to gemini-2.0-flash if 1.5-flash is overloaded or rate limited
            console.log('Gemini 1.5 Flash unavailable, falling back to Gemini 2.0 Flash.');
            const {output} = await prompt20Flash(input);
            return output!;
        }
        // Re-throw other errors
        throw error;
    }
  }
);
