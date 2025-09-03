
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating NTS/NAT quizzes.
 * It handles both subject-specific and reasoning-based questions.
 *
 * - generateNtsQuiz: An async function that generates a quiz based on the NTS category and topic.
 * - GenerateNtsQuizInput: The input type for the generateNtsQuiz function.
 * - GenerateNtsQuizOutput: The output type for the generateNtsQuiz function.
 */

import {ai, isAiAvailable} from '@/ai/genkit';
import { getModel } from '@/lib/models';
import {z} from 'genkit';

const GenerateNtsQuizInputSchema = z.object({
  category: z.string().describe('The NTS/NAT category (e.g., NAT-IE, NAT-IM, Analytical Reasoning, Quantitative Reasoning, Verbal Reasoning).'),
  topic: z.string().describe('The specific topic or subject for the quiz. For reasoning sections, this will be the name of the section itself. For subject tests, it can be very detailed.'),
  numberOfQuestions: z.number().min(1).max(55).describe('The number of questions to generate.'),
  isPro: z.boolean().default(false),
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
  if (!isAiAvailable() || !ai) {
    throw new Error('AI service is not configured. Please contact support.');
  }
  GenerateNtsQuizInputSchema.parse(input);
  return generateNtsQuizFlow(input);
}

const getPromptText = (isPro: boolean) => `You are an elite NTS/NAT question architect with comprehensive expertise in Pakistani educational standards and testing methodologies. Your mission is to create authentic, high-caliber questions that mirror the actual NTS/NAT examination standards.

${isPro ? '**PRO USER - PREMIUM NTS PREPARATION:**\r\n- Generate more sophisticated and challenging questions\r\n- Include advanced problem-solving scenarios\r\n- Create more nuanced distractors that test deeper understanding\r\n- Focus on higher-order thinking and analytical skills\r\n- Provide university-level complexity and rigor\r\n\r\n' : '**STANDARD NTS PREPARATION:**\r\n- Focus on core NTS concepts and fundamental understanding\r\n- Provide clear, accessible questions aligned with standard difficulty\r\n- Ensure solid foundation for NTS success\r\n\r\n'}

**SUPREME COMPLIANCE DIRECTIVES - ABSOLUTE ADHERENCE REQUIRED:**

1.  **CURRICULUM FIDELITY (PARAMOUNT RULE):**
    - Generate questions exclusively from the official Pakistani FSc/ICS/Matric curriculum
    - Every question must be traceable to specific syllabus content
    - Maintain strict alignment with NTS/NAT examination patterns and difficulty levels
    - Zero tolerance for content outside the specified curriculum scope

2.  **EXAMINATION AUTHENTICITY:**
    - Mirror the exact style, complexity, and format of actual NTS/NAT questions
    - Ensure questions reflect the cognitive demands of university entrance examinations
    - Maintain consistency with official NTS question banks and past papers

3.  **FORMAT PRECISION (IMMUTABLE):**
    - ONLY multiple-choice questions with exactly 4 options (A, B, C, D)
    - Each question must have one definitively correct answer
    - Options must be sophisticated, plausible, and test genuine understanding
    - Perfect JSON schema compliance required

4.  **QUANTITATIVE EXACTNESS:** Generate precisely {{{numberOfQuestions}}} questions

5.  **PROFESSIONAL PRESENTATION:**
    - Mathematical expressions: LaTeX format ($$formula$$ or $variable$)
    - Chemical equations: mhchem notation ($$\\ce{equation}$$)
    - Clear, unambiguous language appropriate for university-bound students

6.  **COGNITIVE RIGOR:**
    - Test multiple cognitive levels: recall, comprehension, application, analysis
    - Include real-world applications relevant to Pakistani context
    - Ensure questions discriminate between different levels of student ability

---

**EXAMINATION PARAMETERS:**

- **NTS/NAT Category:** '{{{category}}}'
- **Subject/Topic:** '{{{topic}}}'
- **Question Count:** {{{numberOfQuestions}}}

**SPECIALIZED CONTENT GUIDELINES:**

**ANALYTICAL REASONING:**
- Logical sequences, pattern recognition, spatial reasoning
- Conditional logic problems with multiple constraints
- Data interpretation and logical deduction scenarios
- Abstract reasoning with symbols, shapes, and relationships

**QUANTITATIVE REASONING:**
- Advanced arithmetic, algebra, and basic calculus concepts
- Ratio, proportion, percentage, and statistical problems
- Geometry, trigonometry, and coordinate geometry
- Real-world mathematical applications and word problems
- All mathematical content must use proper LaTeX formatting

**VERBAL REASONING:**
- Advanced English grammar and syntax
- Vocabulary: synonyms, antonyms, analogies, and contextual usage
- Reading comprehension with inference and critical analysis
- Sentence completion and error identification

**SUBJECT-SPECIFIC CONTENT (NAT-IE/IM/ICS):**
- Strict adherence to Pakistani FSc/ICS curriculum for the specified subject
- University entrance-level difficulty and complexity
- Integration of theoretical knowledge with practical applications
- Questions that test deep conceptual understanding, not mere memorization

Generate the quiz now.
`;


const createPrompt = (isPro: boolean, useFallback: boolean = false) => ai!.definePrompt({
  name: 'generateNtsQuizPrompt',
  model: getModel(isPro, useFallback),
  input: {schema: GenerateNtsQuizInputSchema},
  output: {schema: GenerateNtsQuizOutputSchema},
  prompt: getPromptText(isPro),
});


const generateNtsQuizFlow = ai!.defineFlow(
  {
    name: 'generateNtsQuizFlow',
    inputSchema: GenerateNtsQuizInputSchema,
    outputSchema: GenerateNtsQuizOutputSchema,
  },
  async input => {
    let output;
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount <= maxRetries) {
      try {
        const prompt = createPrompt(input.isPro, retryCount > 0);
        const result = await prompt(input);
        output = result.output;
        
        if (output && output.quiz && output.quiz.length > 0) {
          return output;
        } else {
          throw new Error("AI returned empty NTS quiz");
        }
      } catch (error: any) {
        retryCount++;
        const errorMsg = error?.message || 'Unknown error';
        console.error(`NTS quiz generation attempt ${retryCount} failed:`, errorMsg);
        
        if (retryCount > maxRetries) {
          if (errorMsg.includes('quota') || errorMsg.includes('rate limit')) {
            throw new Error('API quota exceeded. Please try again in a few minutes.');
          } else if (errorMsg.includes('timeout') || errorMsg.includes('deadline')) {
            throw new Error('Request timeout. The AI service is busy. Please try again.');
          } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
            throw new Error('Network connection issue. Please check your internet connection.');
          } else {
            throw new Error(`Failed to generate NTS quiz after ${maxRetries + 1} attempts. Please try again.`);
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
    }
    
    throw new Error("Unexpected error in NTS quiz generation flow.");
  }
);
