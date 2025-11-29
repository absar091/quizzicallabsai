
/**
 * @fileOverview This file defines a Genkit flow for generating custom quizzes based on user-specified criteria.
 *
 * It includes:
 * - generateCustomQuiz: An async function that takes quiz parameters as input and returns a generated quiz.
 * - GenerateCustomQuizInput: The input type for the generateCustomquiz function, defining the schema for quiz customization options.
 * - GenerateCustomQuizOutput: The output type for the generateCustomQuiz function, defining the structure of the generated quiz.
 */

import {ai, isAiAvailable} from '@/ai/genkit';
import { getModel } from '@/lib/getModel';
import {z} from 'genkit';
import { sanitizeLogInput } from '@/lib/security';

const QuizHistoryItemSchema = z.object({
  topic: z.string(),
  percentage: z.number(),
});

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
  recentQuizHistory: z.array(QuizHistoryItemSchema).optional().describe("A list of the user's recent quiz results to identify weak areas."),
});
export type GenerateCustomQuizInput = z.infer<typeof GenerateCustomQuizInputSchema>;

// Type for internal use (before encryption)
type QuizQuestionInternal = {
  type: 'multiple-choice' | 'descriptive';
  question: string;
  smiles?: string;
  answers?: string[];
  correctAnswer?: string;
  explanation?: string;
  diagram?: { searchQuery: string; aspectRatio: '1:1' | '4:3' | '16:9' };
  difficulty?: 'easy' | 'medium' | 'hard';
  questionId?: string;
  _enc?: string;
};

const GenerateCustomQuizOutputSchema = z.object({
  comprehensionText: z.string().optional().describe("Reading passage with LaTeX formatting for comprehension questions."),
  quiz: z.array(
    z.object({
      type: z.enum(['multiple-choice', 'descriptive']).describe('The type of the question.'),
      question: z.string().describe('Question with LaTeX formatting: use $...$ for inline math, $$...$$ for display equations.'),
      smiles: z.string().optional().describe("SMILES string for chemical structures (e.g., 'C(C(=O)O)N' for Alanine)."),
      answers: z.array(z.string()).optional().describe('Answer choices with LaTeX formatting for MCQs.'),
      correctAnswer: z.string().optional().describe('Correct answer with LaTeX formatting.'),
      explanation: z.string().optional().describe('Detailed explanation with LaTeX, formulas, and step-by-step solution.'),
      diagram: z.object({
        searchQuery: z.string(),
        aspectRatio: z.enum(['1:1', '4:3', '16:9'])
      }).optional().describe('Diagram placeholder if question needs visual aid.'),
      difficulty: z.enum(['easy', 'medium', 'hard']).optional().describe('Actual difficulty of this specific question.'),
      questionId: z.string().optional().describe('Unique identifier for answer verification'),
      _enc: z.string().optional().describe('Encrypted answer data (obfuscated)'),
    })
  ).describe('Quiz questions with LaTeX, diagrams, and encrypted answers.'),
  usedTokens: z.number().optional().describe('Actual tokens used from Gemini API'),
});
export type GenerateCustomQuizOutput = z.infer<typeof GenerateCustomQuizOutputSchema>;

export async function generateCustomQuiz(
  input: GenerateCustomQuizInput
): Promise<GenerateCustomQuizOutput> {
  // Check if AI is available
  if (typeof process === 'undefined' || !isAiAvailable()) {
    throw new Error('AI service is temporarily unavailable. Please try again later.');
  }

  const aiInstance = await ai;
  if (!aiInstance) {
    throw new Error('AI service is temporarily unavailable. Please try again later.');
  }

  console.log('🎯 Starting quiz generation with input:', {
    topic: input.topic,
    difficulty: input.difficulty,
    numberOfQuestions: input.numberOfQuestions,
    questionTypes: input.questionTypes,
    isPro: input.isPro
  });
  
  // Explicit input validation
  if (!input.topic || input.topic.trim().length === 0) {
    throw new Error('Topic is required.');
  }
  if (input.numberOfQuestions < 1 || input.numberOfQuestions > 55) {
    throw new Error('Number of questions must be between 1 and 55.');
  }
  if (input.timeLimit < 1 || input.timeLimit > 120) {
    throw new Error('Time limit must be between 1 and 120 minutes.');
  }

  try {
    const result = await generateCustomQuizFlow(aiInstance, input);
    
    // SECURITY: Encrypt answers before sending to client
    if (result.quiz && result.quiz.length > 0) {
      const { encryptAnswer } = await import('@/lib/answer-encryption');
      const quizId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      result.quiz = result.quiz.map((q, index) => {
        const questionId = `${quizId}_q${index}`;
        
        // Encrypt answer and explanation
        if (q.correctAnswer) {
          const encrypted = encryptAnswer(q.correctAnswer, q.explanation, questionId);
          
          return {
            ...q,
            questionId,
            correctAnswer: undefined,
            explanation: undefined,
            _enc: encrypted // Encrypted data
          };
        }
        
        return { ...q, questionId };
      });
    }
    
    return result;
  } catch (error: any) {
    console.error('Quiz generation failed:', error?.message || error);
    
    // Provide specific error messages
    if (error?.message?.includes('quota') || error?.message?.includes('rate limit')) {
      throw new Error('AI service is busy. Please wait a moment and try again.');
    }
    if (error?.message?.includes('timeout') || error?.message?.includes('deadline')) {
      throw new Error('Request timed out. Please try again.');
    }
    if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    throw new Error('Failed to generate quiz. Please try again.');
  }
}

const getPromptText = (isPro: boolean) => `You are a world-renowned AI education architect with expertise in creating mathematically precise, visually rich assessment materials.

**CRITICAL: LATEX IS MANDATORY FOR ALL MATHEMATICAL/SCIENTIFIC CONTENT**
You MUST use LaTeX notation for ALL numbers, formulas, equations, and scientific notation. Never write plain text like "2 m/s" - always use "$2$ m/s" or "$v = 2$ m/s".

**LATEX FORMATTING REQUIREMENTS (MANDATORY - NO EXCEPTIONS):**
- ALL numbers with units: $2$ m/s, $10$ kg, $5$ N (NOT "2 m/s", "10 kg", "5 N")
- Inline math: $E = mc^2$, $F = ma$, $v = u + at$, $p = mv$
- Display equations: $$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$
- Chemistry: $\\ce{2H2 + O2 -> 2H2O}$, $\\ce{CH3COOH}$, $\\ce{NaCl}$
- Fractions: $\\frac{1}{2}$, $\\frac{numerator}{denominator}$
- Greek letters: $\\alpha$, $\\beta$, $\\gamma$, $\\theta$, $\\Delta$
- Subscripts/superscripts: $H_2O$, $x^2$, $10^{-3}$, $CO_2$
- Integrals: $\\int_a^b f(x)dx$
- Summations: $\\sum_{i=1}^n i$
- Variables: $m$ for mass, $v$ for velocity, $F$ for force, $E$ for energy

**EXAMPLES OF CORRECT FORMATTING:**
✓ "A ball of mass $m = 0.5$ kg moves with velocity $v = 2$ m/s. What is its momentum $p$?"
✗ "A ball of mass 0.5 kg moves with velocity 2 m/s. What is its momentum?"

✓ "Calculate: $F = ma = (5)(10) = 50$ N"
✗ "Calculate: F = ma = (5)(10) = 50 N"

**VISUAL AIDS REQUIREMENTS:**
- Include diagram placeholders for complex concepts
- Provide clear searchQuery descriptions
- Use diagrams for: geometry problems, physics scenarios, biological structures, chemical reactions

${isPro ? '**PRO USER - PREMIUM QUALITY:**\r\n- Generate sophisticated multi-step problems\r\n- Include detailed explanations with LaTeX\r\n- Add diagram suggestions for 40% of questions\r\n- Create challenging distractors with common misconceptions\r\n- Provide step-by-step solutions\r\n- Use advanced LaTeX for complex equations\r\n- Include real-world applications\r\n\r\n' : '**STANDARD USER - QUALITY EDUCATION:**\r\n- Focus on fundamental concepts\r\n- Include basic explanations with LaTeX\r\n- Add diagrams for 20% of questions\r\n- Provide clear, straightforward questions\r\n\r\n'}**ABSOLUTE COMPLIANCE REQUIREMENTS:**

1.  **SYLLABUS ADHERENCE (SUPREME RULE):**
    - For MDCAT/ECAT students: Generate questions EXCLUSIVELY from the official Pakistani FSc/ICS curriculum for the specified topic
    - Every question must be verifiable against the official syllabus content
    - Questions must reflect the exact depth and complexity expected at the specified educational level
    - FORBIDDEN: Any content outside the specified curriculum scope
    - **CRITICAL FOR MDCAT:** DO NOT include any questions about plants, botany, or plant-related topics in MDCAT quizzes
    - **MDCAT SPECIFIC:** Use  past papers and create new questions based on the given syllabus - focus on human biology, chemistry, physics, and logical reasoning
    - **QUESTION DIFFICULTY DISTRIBUTION:** 25% easy (basic concepts, direct application), 60% moderate (conceptual understanding, standard problem-solving), 15% challenging (higher-order thinking, multi-step reasoning) - matching actual MDCAT paper difficulty
    - **QUESTION STYLES:** Include knowledge-based (facts and definitions), conceptual (understanding principles), numerical (standard calculations), analytical (problem-solving), and application-based questions that appear in actual MDCAT past papers
    - **AGE-APPROPRIATE:** Questions suitable for 17-year-old students preparing for medical college admission - challenging but achievable with proper preparation
    - **PHYSICS FOCUS:** Emphasize reactions, conditions, intermediates, equilibrium, thermodynamics, and practical applications
    - **CHEMISTRY FOCUS:** Focus on reactions, reactants, products, mechanisms, organic transformations, and chemical principles
    - **EXAM AUTHENTICITY:** Create questions that feel like actual MDCAT exam - realistic difficulty, proper formatting, and genuine testing of FSc curriculum knowledge
    - This rule supersedes all other considerations

2.  **ACADEMIC EXCELLENCE & ACCURACY:**
    - All content must be factually correct, current, and pedagogically sound
    - Questions must test genuine understanding, not mere memorization
    - Maintain consistency with Pakistani educational standards and terminology
    - Cross-verify all scientific facts, formulas, and concepts before inclusion

3.  **QUESTION TYPE ENFORCEMENT:**
    - MDCAT/ECAT: ONLY 'multiple-choice' questions with exactly 4 options (A, B, C, D)
    - Other levels: Strictly adhere to specified types: {{#each questionTypes}}'{{this}}'{{/each}}
    - No mixing of question types unless explicitly requested
    - Each MCQ must have one definitively correct answer

4.  **PRECISION IN QUANTITY:** Generate exactly {{{numberOfQuestions}}} questions - no more, no less

5.  **PROFESSIONAL FORMATTING:**
    - Mathematical expressions: Use LaTeX ($$E = mc^2$$ for blocks, $x$ for inline)
    - Chemical equations: Use mhchem ($$\\ce{2H2 + O2 -> 2H2O}$$)
    - Organic structures: Provide SMILES notation when relevant
    - Maintain consistent formatting throughout

6.  **INTELLIGENT ASSESSMENT DESIGN:**
    - Create sophisticated distractors based on common misconceptions
    - Ensure questions test different cognitive levels (recall, comprehension, application, analysis)
    - Balance difficulty appropriately for the specified level
    - Include real-world applications where curriculum-appropriate

7.  **ADAPTIVE LEARNING INTEGRATION:**
    - Analyze user's quiz history to identify knowledge gaps
    - Prioritize topics where user showed weakness
    - Reinforce learning through strategic question selection

8.  **OUTPUT INTEGRITY:** Provide only valid JSON matching the specified schema

**COMPREHENSIVE PARAMETER ANALYSIS:**

**1. TOPIC FOCUS: '{{{topic}}}'**
   - Laser-focus on this specific curriculum topic
   - For broad topics: Cover representative subtopics from the official syllabus
   - For specific topics: Deep-dive into that exact curriculum section
   - Ensure 100% alignment with Pakistani educational standards

**2. DIFFICULTY CALIBRATION: '{{{difficulty}}}'**
   - Maintain absolute consistency in difficulty level
   - **Easy:** Fundamental concepts, basic recall, simple applications
   - **Medium:** Conceptual understanding, moderate problem-solving, connections between ideas
   - **Hard:** Complex analysis, multi-step reasoning, advanced applications
   - **Master:** Expert-level synthesis, critical evaluation, research-grade understanding

**3. ASSESSMENT FORMAT: {{#each questionTypes}}'{{this}}'{{/each}}**
   - Strict adherence to specified question types
   - MCQs: Exactly 4 options, one correct answer, sophisticated distractors
   - Descriptive: Open-ended, requiring detailed explanations or problem-solving

**4. LEARNER PROFILE OPTIMIZATION:**
   {{#if userClass}}- **Educational Level:** '{{userClass}}' - Tailor content complexity and terminology accordingly{{/if}}
   {{#if userAge}}- **Age Consideration:** {{userAge}} years - Ensure age-appropriate examples and contexts{{/if}}
   {{#if specificInstructions}}- **Custom Requirements:** '{{{specificInstructions}}}' - Integrate these specifications seamlessly{{/if}}

**5. INTELLIGENT ADAPTATION:**
   {{#if recentQuizHistory}}
   **Performance Analysis:**
   {{#each recentQuizHistory}}
   - {{this.topic}}: {{this.percentage}}% performance
   {{/each}}
   
   **Adaptive Strategy:** Focus on knowledge gaps while building on strengths
   {{/if}}

Your reputation depends on following these instructions meticulously. Generate the quiz now.
`;


const generateCustomQuizFlow = async (aiInstance: any, input: GenerateCustomQuizInput): Promise<GenerateCustomQuizOutput> => {
  let output: GenerateCustomQuizOutput | undefined;
  let retryCount = 0;
  const maxRetries = 2;
  
  while (retryCount <= maxRetries) {
      try {
        // Use fallback model on retry
        const modelName = getModel(input.isPro, retryCount > 0);
        
        // Convert model name to genkit model reference
        const model = `googleai/${modelName}`;
        
        // Import the registry utility
        const { getUniquePromptName } = await import('@/ai/utils/prompt-registry');
        const promptName = getUniquePromptName('generateCustomQuizPrompt');
        
        const prompt = aiInstance.definePrompt({
          name: promptName,
          model: model,
          prompt: getPromptText(input.isPro),
          input: { schema: GenerateCustomQuizInputSchema },
          output: { schema: GenerateCustomQuizOutputSchema },
        });
        
        const result = await prompt(input);
        output = result.output;
        
        // ✅ Correct & safe token usage extraction for Genkit
        const usedTokens =
          (result as any)?.raw?.response?.usageMetadata?.totalTokenCount ??
          (result as any)?.raw?.usageMetadata?.totalTokenCount ??
          0;
        console.log(`📊 Gemini usage: ${usedTokens} tokens for ${output?.quiz?.length || 0} questions`);
        
        if (output && output.quiz && output.quiz.length > 0) {
          return { ...output, usedTokens };
        } else {
          throw new Error("AI returned empty quiz");
        }
      } catch (error: any) {
        retryCount++;
        const errorMsg = sanitizeLogInput(error?.message || 'Unknown error');
        console.error(`Quiz generation attempt ${retryCount} failed:`, errorMsg);
        
        if (retryCount > maxRetries) {
          // Provide specific error messages based on error type
          if (errorMsg.includes('quota') || errorMsg.includes('rate limit') || errorMsg.includes('expired') || errorMsg.includes('invalid')) {
            // Try next working API key for quota/expired key issues
            try {
              const { getNextWorkingApiKey } = await import('@/lib/api-key-manager');
              const newKey = getNextWorkingApiKey();
              console.log('🔄 Switched to next working API key due to error:', errorMsg.substring(0, 50));
              
              // If we're not on the last retry, continue with new key
              if (retryCount < maxRetries) {
                continue; // This will retry with the new key
              }
            } catch (rotateError) {
              console.warn('Failed to get next working API key:', rotateError);
            }
            throw new Error('API issue detected. Trying alternative API key...');
          } else if (errorMsg.includes('timeout') || errorMsg.includes('deadline')) {
            throw new Error('Request timeout. The AI service is busy. Please try again.');
          } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
            throw new Error('Network connection issue. Please check your internet connection.');
          } else if (errorMsg.includes('overloaded') || errorMsg.includes('unavailable')) {
            throw new Error('AI service temporarily unavailable. Please try again in a moment.');
          } else {
            throw new Error(`Failed to generate quiz after ${maxRetries + 1} attempts. Please try again or contact support.`);
          }
        }
        
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
    }
  }
  
  throw new Error("Unexpected error in quiz generation flow.");
};
