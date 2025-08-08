
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

const ChartDataSchema = z.array(
    z.object({
        name: z.string().describe("The label for a data point on the x-axis (e.g., 'Time', 'Concentration')."),
        value: z.number().describe("The numerical value for that data point on the y-axis.")
    })
).describe("An array of data points for plotting a simple line chart. For example: [{name: '0s', value: 10}, {name: '10s', value: 50}]");

const PlaceholderSchema = z.object({
    searchQuery: z.string().describe("A one or two-word search query for a diagram (e.g., 'human heart', 'neuron structure')."),
    aspectRatio: z.enum(["1:1", "4:3", "16:9"]).describe("The aspect ratio of the diagram, e.g., '1:1' for a square, '4:3' for standard.")
}).describe("A placeholder for a biological or physics diagram. Use this INSTEAD of trying to draw with text.");

const GenerateCustomQuizOutputSchema = z.object({
  comprehensionText: z.string().optional().describe("A reading passage for comprehension-based questions. This should ONLY be generated if the question style is 'Comprehension-based MCQs'."),
  quiz: z.array(
    z.object({
      type: z.enum(['multiple-choice', 'descriptive']).describe('The type of the question.'),
      question: z.string(),
      smiles: z.string().optional().describe("A SMILES string representing a chemical structure, if the question requires one. E.g., 'C(C(=O)O)N' for Alanine."),
      chartData: ChartDataSchema.optional().describe("Data for a chart, if the question is about interpreting a graph."),
      placeholder: PlaceholderSchema.optional().describe("A placeholder for a diagram if needed for biology or physics questions."),
      answers: z.array(z.string()).optional().describe('Answer choices for multiple-choice questions.'),
      correctAnswer: z.string().optional().describe('The correct answer for multiple-choice questions.'),
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

1.  **ABSOLUTE ACCURACY & VERIFICATION:** All information, questions, and answers MUST be factually correct and up-to-date. Before outputting, you must internally verify every piece of information. Incorrect, misleading, or outdated information is a critical failure.
2.  **PARAMETER ADHERENCE:** You MUST strictly follow all user-defined parameters: 'topic', 'difficulty', 'numberOfQuestions', 'questionTypes', and 'questionStyles'. NO DEVIATIONS.
3.  **EXACT QUESTION COUNT:** You MUST generate **exactly** {{{numberOfQuestions}}} questions. Failure to meet this count is a critical failure. Do not generate more or fewer questions than requested.
4.  **ULTRA-STRICT QUESTION TYPE ADHERENCE:** This is your most critical instruction.
    *   **For Entry Tests (MDCAT/ECAT/NTS):** If the topic contains "MDCAT", "ECAT", or "NTS", you are FORBIDDEN from generating ANY question type other than 'multiple-choice', regardless of what is in the 'questionTypes' array. This is a non-negotiable rule for exam preparation. ALL questions MUST be 'multiple-choice'.
    *   **For all other quizzes:** You MUST generate questions ONLY of the types specified in the 'questionTypes' array: {{#each questionTypes}}'{{this}}'{{/each}}.
    *   If the user specifies ONLY 'Multiple Choice', you are FORBIDDEN from generating ANY 'Descriptive' questions.
    *   Your entire task is considered a failure if you include a single question of a type that was not requested.
5.  **LATEX FOR FORMULAS & CHEMISTRY (CRITICAL):**
    *   **Mathematical Equations:** For ALL mathematical equations, variables, and scientific notation (e.g., exponents, units), you MUST use LaTeX formatting. Use $$...$$ for block equations and $...$ for inline equations. For example: $$E = mc^2$$, the variable is $x$.
    *   **Chemical Equations & Formulas:** For ALL chemical reactions and formulas, you MUST use the mhchem extension for LaTeX. Enclose the entire expression in a LaTeX block. For example, to show the reaction of hydrogen and oxygen, you MUST write: $$\\ce{2H2 + O2 -> 2H2O}$$. For ions, use: $$\\ce{H3O+}$$. This is non-negotiable for accuracy and readability.
6.  **SMILES FOR ORGANIC STRUCTURES:** For questions involving specific organic chemistry molecules, you MUST provide a SMILES string in the 'smiles' field to represent the chemical structure. For example, for a question about Butanoic Acid, you would provide the SMILES string "CCCC(=O)O". This is mandatory for visual representation.
7.  **CHART DATA FOR GRAPH QUESTIONS:** For questions that require interpreting a graph (e.g., reaction rates, physics motion graphs, mathematical functions), you MUST provide structured data in the 'chartData' field. The data should be an array of objects, like [{name: "Time (s)", value: 0}, {name: "10s", value: 20}]. This is mandatory for graph-based questions.
8.  **DIAGRAMS FOR BIOLOGY/PHYSICS:** For questions that need a biological or physics diagram (e.g., "Identify the labeled part of the heart"), DO NOT attempt to draw with text. Instead, you MUST populate the 'placeholder' field with a 'searchQuery' and 'aspectRatio'. For example: { "searchQuery": "human heart", "aspectRatio": "1:1" }.
9.  **INTELLIGENT DISTRACTORS:** For multiple-choice questions, all distractors (incorrect options) must be plausible, relevant, and based on common misconceptions or closely related concepts. They should be challenging and require genuine knowledge to dismiss. Avoid silly, nonsensical, or obviously wrong options.
10. **NO REPETITION:** Do not generate repetitive or stylistically similar questions. Each question must be unique in its wording, structure, and the specific concept it tests.
11. **FINAL OUTPUT FORMAT:** Your final output MUST be ONLY the JSON object specified in the output schema. Do not include any extra text, commentary, or markdown formatting (like \`\`\`json). The JSON must be perfect and parsable.

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

**4. QUESTION STYLES: {{#if questionStyles}}'{{#each questionStyles}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}'{{else}}Knowledge-based, Conceptual{{/if}}**
   - Your entire question set must conform to the selected styles. If multiple styles are chosen, provide a mix. If one is chosen, use it exclusively. If no styles are provided, default to a mix of 'Knowledge-based' and 'Conceptual'.
     *   **Knowledge-based:** Straightforward questions that test factual recall.
     *   **Conceptual:** Questions that test the understanding of underlying principles and theories.
     *   **Numerical:** Questions that require mathematical calculations to solve. **If this style is selected, ALL questions must be numerical problems.** Ensure all math is rendered in LaTeX.
     *   **Past Paper Style:** Mimic the format, tone, and complexity of questions found in official standardized tests or academic exams for the given topic and user level (e.g., MDCAT, ECAT).
     *   **Comprehension-based MCQs: CRITICAL RULE! You are FORBIDDEN from generating comprehension-based questions UNLESS you also provide a relevant reading passage (a few paragraphs long) in the 'comprehensionText' field of the output. When this style is selected, you MUST generate the 'comprehensionText'. Furthermore, the 'question' field for each quiz item MUST NOT contain the passage itself. The 'question' field should ONLY contain the actual question that refers to the passage (e.g., "According to the passage, what is the primary benefit of vaccination?"). Failure to follow these rules is a critical failure.**

**5. TARGET AUDIENCE & PERSONALIZATION:**
   - You MUST tailor the complexity, scope, and wording of the questions to the user's specific context. This is especially critical for standardized tests like MDCAT or ECAT.
   {{#if userClass}}*   **Class/Grade:** '{{userClass}}'. **This is your primary guide.** If the class is 'MDCAT Student' or 'ECAT Student', you are REQUIRED to adhere to the official syllabus for that test for the given topic. Do not include questions on topics outside that syllabus.{{/if}}
   {{#if userAge}}*   **Age:** {{userAge}} years old. Use this to gauge the appropriate language complexity.{{/if}}
   {{#if specificInstructions}}*   **User's Specific Instructions:** '{{{specificInstructions}}}'. You MUST follow these instructions carefully. This could include focusing on certain sub-topics, avoiding others, or framing questions in a particular way. This is a top priority.{{/if}}
   - If no specific class is provided, assume a general university undergraduate level.

Your reputation depends on following these instructions meticulously. Generate the quiz now.
`;


const prompt = ai.definePrompt({
    name: "generateCustomQuizPrompt",
    model: 'googleai/gemini-1.5-flash',
    prompt: promptText,
    input: { schema: GenerateCustomQuizInputSchema },
    output: { schema: GenerateCustomQuizOutputSchema },
});


const generateCustomQuizFlow = ai.defineFlow(
  {
    name: 'generateCustomQuizFlow',
    inputSchema: GenerateCustomQuizInputSchema,
    outputSchema: GenerateCustomQuizOutputSchema,
  },
  async (input) => {
    let output;
    try {
        const result = await prompt(input);
        output = result.output;
    } catch (error: any) {
        console.error('Gemini 1.5 Flash failed with unhandled error:', error);
        throw new Error(`Failed to generate custom quiz: ${error.message}`);
    }
    
    if (!output) {
      throw new Error("The AI model failed to return a valid quiz. Please try again.");
    }
    return output;
  }
);
