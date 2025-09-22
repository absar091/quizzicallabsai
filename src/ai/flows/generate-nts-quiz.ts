
/**
 * @fileOverview This file defines a Genkit flow for generating NTS/NAT quizzes.
 * It handles both subject-specific and reasoning-based questions.
 *
 * - generateNtsQuiz: An async function that generates a quiz based on the NTS category and topic.
 * - GenerateNtsQuizInput: The input type for the generateNtsQuiz function.
 * - GenerateNtsQuizOutput: The output type for the generateNtsQuiz function.
 */

import {ai, isAiAvailable} from '@/ai/genkit';
import { getModel } from '@/lib/getModel';
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
  if (typeof process === 'undefined' || !isAiAvailable()) {
    throw new Error('AI service is not configured. Please contact support.');
  }
  
  const aiInstance = ai || (await import('@/ai/genkit')).ai;
  if (!aiInstance) {
    throw new Error('AI service is not configured. Please contact support.');
  }
  
  GenerateNtsQuizInputSchema.parse(input);
  const flow = generateNtsQuizFlow(aiInstance);
  return await flow(input);
}

const getPromptText = (isPro: boolean) => `You are a world-renowned AI education architect, equivalent to Nobel laureates in Physics and Chemistry, gold medalists from top universities like MIT, Harvard, and Oxford, and distinguished professors from prestigious institutions worldwide. Your expertise rivals the pedagogical mastery of legendary educators who have shaped generations of successful professionals.

**PHILOSOPHY OF EXCELLENCE:** You approach question creation with the precision of a master craftsman, the analytical depth of a research scientist, and the pedagogical wisdom of centuries of educational excellence. Every question you create must reflect the intellectual rigor and creative brilliance that has earned recognition at the highest levels of academia.

**COGNITIVE SCIENCE FOUNDATION:** Drawing from advanced cognitive psychology and learning theories (Bloom's Taxonomy, Vygotsky's Zone of Proximal Development, and modern assessment research), you design questions that not only test knowledge but actively develop critical thinking, problem-solving abilities, and deep conceptual understanding.

**PSYCHOLOGICAL ASSESSMENT PRINCIPLES:**
- **Item Response Theory:** Create questions with optimal discrimination parameters that effectively differentiate between different ability levels
- **Cognitive Load Theory:** Balance intrinsic, extraneous, and germane load to maximize learning while testing
- **Dual-Process Theory:** Include questions that test both intuitive (System 1) and analytical (System 2) thinking
- **Metacognition:** Design questions that encourage self-reflection and awareness of one's own thought processes
- **Construct Validity:** Ensure questions measure the intended constructs with high fidelity and minimal construct-irrelevant variance

${isPro ? '**PRO USER - PREMIUM NTS PREPARATION:**\r\n- Generate more sophisticated and challenging questions\r\n- Include advanced problem-solving scenarios\r\n- Create more nuanced distractors that test deeper understanding\r\n- Focus on higher-order thinking and analytical skills\r\n- Provide university-level complexity and rigor\r\n\r\n' : '**STANDARD NTS PREPARATION:**\r\n- Focus on core NTS concepts and fundamental understanding\r\n- Provide clear, accessible questions aligned with standard difficulty\r\n- Ensure solid foundation for NTS success\r\n\r\n'}

**SUPREME COMPLIANCE DIRECTIVES - ABSOLUTE ADHERENCE REQUIRED:**

1.  **CURRICULUM FIDELITY (PARAMOUNT RULE):**
    - Generate questions exclusively from the official Pakistani FSc/ICS/Matric curriculum
    - Every question must be traceable to specific syllabus content
    - Maintain strict alignment with NTS/NAT examination patterns and difficulty levels
    - Zero tolerance for content outside the specified curriculum scope
    - **CRITICAL FOR MDCAT:** DO NOT include any questions about plants, botany, or plant-related topics in MDCAT quizzes
    - **MDCAT SPECIFIC:** Use only past papers and create new questions based on the given syllabus - focus on human biology, chemistry, physics, and logical reasoning
    - **QUESTION DIFFICULTY DISTRIBUTION:** 15% easy (basic concepts, direct application), 70% moderate (conceptual understanding, multi-step reasoning), 15% difficult (complex analysis, tricky scenarios)
    - **QUESTION STYLES:** Include trap questions (common misconceptions), tricky questions (clever distractors), knowledge-based (facts and definitions), conceptual (understanding principles), numerical (calculations), and analytical questions
    - **PHYSICS FOCUS:** Emphasize reactions, conditions, intermediates, equilibrium, thermodynamics, and practical applications
    - **CHEMISTRY FOCUS:** Focus on reactions, reactants, products, mechanisms, organic transformations, and chemical principles
    - **EXAM AUTHENTICITY:** Create questions that feel like actual MDCAT exam - realistic difficulty, proper formatting, and genuine testing of FSc curriculum knowledge

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


const createPrompt = (aiInstance: any, isPro: boolean, useFallback: boolean = false) => aiInstance.definePrompt({
  name: 'generateNtsQuizPrompt',
  model: `googleai/${getModel(isPro, useFallback)}`,
  input: {schema: GenerateNtsQuizInputSchema},
  output: {schema: GenerateNtsQuizOutputSchema},
  prompt: getPromptText(isPro),
});


const generateNtsQuizFlow = (aiInstance: any) => aiInstance.defineFlow(
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
        const model = getModel(input.isPro, retryCount > 0);
        const prompt = createPrompt(aiInstance, input.isPro, retryCount > 0);
        const result = await prompt(input, { model });
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
            // Rotate to next API key for quota issues
            try {
              const { handleApiKeyError } = await import('@/lib/api-key-manager');
              handleApiKeyError();
              console.log('🔄 Rotated API key due to quota limit (NTS quiz)');
            } catch (rotateError) {
              console.warn('Failed to rotate API key:', rotateError);
            }
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
