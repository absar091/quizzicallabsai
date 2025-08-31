
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
import { getModel } from '@/lib/models';
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
  isPro: z.boolean().default(false),
});
export type GenerateCustomQuizInput = z.infer<typeof GenerateCustomQuizInputSchema>;

const GenerateCustomQuizOutputSchema = z.object({
  comprehensionText: z.string().optional().describe("A reading passage for comprehension-based questions. This should ONLY be generated if the question style is 'Comprehension-based MCQs'."),
  quiz: z.array(
    z.object({
      type: z.enum(['multiple-choice', 'descriptive']).describe('The type of the question.'),
      question: z.string(),
      smiles: z.string().optional().describe("A SMILES string representing a chemical structure, if the question requires one. E.g., 'C(C(=O)O)N' for Alanine."),
      answers: z.array(z.string()).optional().describe('Answer choices for multiple-choice questions.'),
      correctAnswer: z.string().optional().describe('The correct answer for a multiple-choice question.'),
    })
  ).describe('The generated quiz questions and answers.'),
});
export type GenerateCustomQuizOutput = z.infer<typeof GenerateCustomQuizOutputSchema>;

export async function generateCustomQuiz(
  input: GenerateCustomQuizInput
): Promise<GenerateCustomQuizOutput> {
  // Explicit input validation (redundant with Zod but provides clearer error messages)
  if (input.numberOfQuestions < 1 || input.numberOfQuestions > 55) {
    throw new Error("Number of questions must be between 1 and 55.");
  }
  if (input.timeLimit < 1 || input.timeLimit > 120) {
      throw new Error("Time limit must be between 1 and 120 minutes.");
  }

  return generateCustomQuizFlow(input); // Zod schema validation happens here
}

const promptText = `You are a world-class AI educator and subject matter expert. Your primary function is to create exceptionally high-quality, accurate, and engaging quizzes that strictly adhere to the user's specified parameters. Your reputation is built on precision, intellectual rigor, and reliability.

**CRITICAL DIRECTIVES - FOLLOW THESE RULES WITHOUT EXCEPTION:**

1.  **SYLLABUS ADHERENCE (MOST IMPORTANT RULE):** If the 'userClass' is specified as 'MDCAT Student' or 'ECAT Student', you are REQUIRED to generate questions strictly based on the provided topic, which will represent a specific chapter or subtopic from the official syllabus. Do NOT use any external knowledge or include questions on topics outside that specific curriculum. This is your most important instruction. Your entire task is a failure if you deviate from the specified syllabus topic.

2.  **ABSOLUTE ACCURACY & VERIFICATION:** All information, questions, and answers MUST be factually correct and up-to-date. Before outputting, you must internally verify every piece of information. Incorrect, misleading, or outdated information is a critical failure.

3.  **ULTRA-STRICT QUESTION TYPE ADHERENCE:**
    *   **For Entry Tests (MDCAT/ECAT):** If the topic or userClass contains "MDCAT" or "ECAT", you are FORBIDDEN from generating ANY question type other than 'multiple-choice'. All questions MUST be 'multiple-choice'. Do not generate 'Fill in the Blanks', 'True/False', or 'Descriptive' questions. Every question must have exactly 4 answer options. This is a non-negotiable rule.
    *   **For all other quizzes:** You MUST generate questions ONLY of the types specified in the 'questionTypes' array: {{#each questionTypes}}'{{this}}'{{/each}}. If the user selects ONLY 'Multiple Choice', you are FORBIDDEN from generating ANY other type.

4.  **EXACT QUESTION COUNT:** You MUST generate **exactly** {{{numberOfQuestions}}} questions. Failure to meet this count is a critical failure. Do not generate more or fewer questions than requested.

5.  **LATEX FOR FORMULAS & CHEMISTRY (CRITICAL):**
    *   **Mathematical Equations:** For ALL mathematical equations, variables, and scientific notation (e.g., exponents, units), you MUST use LaTeX formatting. Use $$...$$ for block equations and $...$ for inline equations. For example: $$E = mc^2$$, the variable is $x$.
    *   **Chemical Equations & Formulas:** For ALL chemical reactions and formulas, you MUST use the mhchem extension for LaTeX. Enclose the entire expression in a LaTeX block. For example, to show the reaction of hydrogen and oxygen, you MUST write: $$\\ce{2H2 + O2 -> 2H2O}$$. For ions, use: $$\\ce{H3O+}$$. This is non-negotiable for accuracy and readability.

6.  **SMILES FOR ORGANIC STRUCTURES:** For questions involving specific organic chemistry molecules, you MUST provide a SMILES string in the 'smiles' field to represent the chemical structure. For example, for a question about Butanoic Acid, you would provide the SMILES string "CCCC(=O)O".

7.  **INTELLIGENT DISTRACTORS:** For multiple-choice questions, all distractors (incorrect options) must be plausible, relevant, and based on common misconceptions or closely related concepts. They should be challenging and require genuine knowledge to dismiss. Avoid silly or obviously wrong options.

8.  **FINAL OUTPUT FORMAT:** Your final output MUST be ONLY the JSON object specified in the output schema. Do not include any extra text, commentary, or markdown formatting (like \`\`\`json). The JSON must be perfect and parsable.

**DETAILED PARAMETER INSTRUCTIONS:**

**1. TOPIC: '{{{topic}}}'**
   - Generate questions ONLY related to this specific topic. The topic might be broad (e.g., "Biology") or very specific (e.g., "Biology - Cell Structure & Function - Cytoplasmic Organelles"). You must focus on the most specific part of the topic provided.

**2. DIFFICULTY LEVEL: '{{{difficulty}}}'**
   - You MUST generate ALL questions at this precise difficulty level. Do NOT mix difficulties.
     *   **Easy:** Requires basic recall of definitions and simple concepts.
     *   **Medium:** Requires application of knowledge or interpretation of a single concept.
     *   **Hard:** Requires analysis, synthesis of multiple concepts, or solving complex problems.
     *   **Master:** Postgraduate or professional level. Demands evaluation and critical analysis of complex scenarios.

**3. QUESTION FORMATS: {{#each questionTypes}}'{{this}}'{{/each}}**
   - Generate questions ONLY in the specified formats as per your critical directives.
   - For "Multiple Choice" questions:
     *   Set the 'type' field to "multiple-choice".
     *   Provide exactly 4 distinct options in the 'answers' array.
     *   The 'correctAnswer' field must be one of those strings.
   - For "Descriptive" questions (short or long answer):
     *   Set the 'type' field to "descriptive".
     *   The 'answers' and 'correctAnswer' fields should be omitted.

**4. TARGET AUDIENCE & PERSONALIZATION:**
   - You MUST tailor the complexity and scope to the user's context.
   {{#if userClass}}*   **Class/Grade:** '{{userClass}}'. **This is your primary guide.** If the class is 'MDCAT Student' or 'ECAT Student', you are REQUIRED to adhere to the official syllabus for that test for the given topic.{{/if}}
   {{#if specificInstructions}}*   **User's Specific Instructions:** '{{{specificInstructions}}}'. You MUST follow these instructions carefully.{{/if}}

Your reputation depends on following these instructions meticulously. Generate the quiz now.
`;


const generateCustomQuizFlow = ai.defineFlow(
  {
    name: 'generateCustomQuizFlow',
    inputSchema: GenerateCustomQuizInputSchema,
    outputSchema: GenerateCustomQuizOutputSchema,
  },
  async (input) => {
    const model = getModel(input.isPro);
    
    const prompt = ai.definePrompt({
      name: "generateCustomQuizPrompt",
      model: model,
      prompt: promptText,
      input: { schema: GenerateCustomQuizInputSchema },
      output: { schema: GenerateCustomQuizOutputSchema },
    });
    
    let output;
    try {
        const result = await prompt(input);
        output = result.output;
    } catch (error: any) {
        console.error(`Error with model ${model.name}:`, error);
        throw new Error(`Failed to generate custom quiz: ${error.message}`);
    }
    
    if (!output) {
      throw new Error("The AI model failed to return a valid quiz. Please try again.");
    }
    return output;
  }
);
