/**
 * @fileOverview Professional exam paper generation with strict syllabus adherence
 * This is the core feature that generates formal exam papers following official syllabi
 */

import {ai, isAiAvailable} from '@/ai/genkit';
import { getModel } from '@/lib/getModel';
import {z} from 'genkit';
import { sanitizeLogInput } from '@/lib/security';

const GenerateExamPaperInputSchema = z.object({
  subject: z.string().describe('The subject for the exam (e.g., Physics, Chemistry, Biology, Mathematics)'),
  examLevel: z.enum(['MDCAT', 'ECAT', 'FSc', 'Matric', 'O-Level', 'A-Level']).describe('The educational level/exam type'),
  chapters: z.array(z.string()).describe('Specific chapters/topics to include from the official syllabus'),
  totalMarks: z.number().min(50).max(200).describe('Total marks for the exam paper'),
  timeLimit: z.number().min(60).max(300).describe('Time limit in minutes'),
  questionDistribution: z.object({
    mcqs: z.number().min(0).describe('Number of MCQ questions'),
    shortQuestions: z.number().min(0).describe('Number of short questions'),
    longQuestions: z.number().min(0).describe('Number of long questions'),
  }),
  marksDistribution: z.object({
    mcqMarks: z.number().min(0).describe('Marks per MCQ'),
    shortQuestionMarks: z.number().min(0).describe('Marks per short question'),
    longQuestionMarks: z.number().min(0).describe('Marks per long question'),
  }),
  schoolName: z.string().optional().describe('Name of the school/institution'),
  teacherName: z.string().optional().describe('Name of the teacher'),
  examDate: z.string().optional().describe('Date of the exam'),
  className: z.string().optional().describe('Class/grade level'),
  isPro: z.boolean().default(false),
});
export type GenerateExamPaperInput = z.infer<typeof GenerateExamPaperInputSchema>;

const GenerateExamPaperOutputSchema = z.object({
  examHeader: z.object({
    title: z.string().describe('Exam title'),
    subject: z.string(),
    class: z.string(),
    totalMarks: z.number(),
    timeLimit: z.number(),
    date: z.string().optional(),
    schoolName: z.string().optional(),
    teacherName: z.string().optional(),
    instructions: z.array(z.string()).describe('General exam instructions'),
  }),
  sections: z.array(z.object({
    sectionTitle: z.string().describe('Section title (e.g., "Section A: Multiple Choice Questions")'),
    instructions: z.string().describe('Section-specific instructions'),
    questions: z.array(z.object({
      questionNumber: z.string().describe('Question number (e.g., "1", "2(a)", "3(i)")'),
      question: z.string().describe('Question with LaTeX: use $...$ for inline, $$...$$ for display equations'),
      marks: z.number().describe('Marks allocated to this question'),
      type: z.enum(['mcq', 'short', 'long']).describe('Question type'),
      options: z.array(z.string()).optional().describe('MCQ options with LaTeX formatting (A, B, C, D)'),
      smiles: z.string().optional().describe('SMILES string for chemical structures if needed'),
      diagram: z.object({
        searchQuery: z.string(),
        aspectRatio: z.enum(['1:1', '4:3', '16:9'])
      }).optional().describe('Diagram placeholder for visual questions'),
      subQuestions: z.array(z.object({
        part: z.string().describe('Sub-question part (e.g., "(a)", "(i)")'),
        question: z.string().describe('Sub-question with LaTeX formatting'),
        marks: z.number(),
        diagram: z.object({
          searchQuery: z.string(),
          aspectRatio: z.enum(['1:1', '4:3', '16:9'])
        }).optional(),
      })).optional().describe('Sub-questions for structured questions'),
    })),
    totalMarks: z.number().describe('Total marks for this section'),
  })),
  answerKey: z.object({
    mcqAnswers: z.array(z.object({
      questionNumber: z.string(),
      correctAnswer: z.string().describe('Correct option (A, B, C, or D)'),
      explanation: z.string().optional().describe('Detailed explanation with LaTeX, formulas, and step-by-step reasoning'),
    })).optional(),
    shortAnswers: z.array(z.object({
      questionNumber: z.string(),
      keyPoints: z.array(z.string()).describe('Key points with LaTeX formatting'),
      fullAnswer: z.string().describe('Complete model answer with LaTeX, formulas, and proper notation'),
    })).optional(),
    longAnswers: z.array(z.object({
      questionNumber: z.string(),
      markingScheme: z.array(z.object({
        point: z.string().describe('Marking point with LaTeX'),
        marks: z.number(),
      })).describe('Detailed marking scheme'),
      fullAnswer: z.string().describe('Complete model answer with LaTeX, step-by-step solutions, and diagrams'),
    })).optional(),
  }),
});
export type GenerateExamPaperOutput = z.infer<typeof GenerateExamPaperOutputSchema>;

export async function generateExamPaper(
  input: GenerateExamPaperInput
): Promise<GenerateExamPaperOutput> {
  if (typeof process === 'undefined' || !isAiAvailable()) {
    throw new Error('AI service is not configured. Please contact support.');
  }
  
  const aiInstance = await ai;
  if (!aiInstance) {
    throw new Error('AI service is not configured. Please contact support.');
  }
  
  // Validate total marks calculation
  const calculatedMarks = 
    (input.questionDistribution.mcqs * input.marksDistribution.mcqMarks) +
    (input.questionDistribution.shortQuestions * input.marksDistribution.shortQuestionMarks) +
    (input.questionDistribution.longQuestions * input.marksDistribution.longQuestionMarks);
  
  if (Math.abs(calculatedMarks - input.totalMarks) > 5) {
    throw new Error(`Marks distribution doesn't match total marks. Calculated: ${calculatedMarks}, Expected: ${input.totalMarks}`);
  }

  const flow = generateExamPaperFlow(aiInstance);
  return await flow(input);
}

const promptText = `You are a world-renowned exam paper creator with expertise in mathematically precise, visually rich assessment materials. Every question must use proper LaTeX formatting and include visual aids where beneficial.

**LATEX FORMATTING REQUIREMENTS (MANDATORY FOR ALL MATH/SCIENCE CONTENT):**
- Inline math: $E = mc^2$, $F = ma$, $v = u + at$, $pH = -\\log[H^+]$
- Display equations: $$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$
- Chemistry: $\\ce{2H2 + O2 -> 2H2O}$, $\\ce{CH3COOH}$, $\\ce{H2SO4}$
- Fractions: $\\frac{numerator}{denominator}$, $\\frac{1}{2}$, $\\frac{dy}{dx}$
- Greek letters: $\\alpha, \\beta, \\gamma, \\theta, \\Delta H$
- Subscripts/superscripts: $H_2O$, $x^2$, $10^{-3}$, $CO_2$
- Integrals: $\\int_a^b f(x)dx$
- Summations: $\\sum_{i=1}^n i$
- Limits: $\\lim_{x \\to \\infty}$

**VISUAL AIDS REQUIREMENTS:**
- Include diagram placeholders for: geometry problems, physics scenarios, biological structures, chemical reactions, graphs
- Provide clear searchQuery descriptions like "diagram of human heart with labeled chambers" or "graph of velocity vs time"
- Use diagrams for 30-40% of questions to enhance understanding

**CRITICAL REQUIREMENTS - ABSOLUTE COMPLIANCE REQUIRED:**

1. **SYLLABUS ADHERENCE (MOST CRITICAL):**
   - You MUST generate questions ONLY from the specified chapters: {{#each chapters}}"{{this}}"{{/each}}
   - For {{examLevel}} level, follow the official Pakistani curriculum for {{subject}}
   - Every question must be directly traceable to the specified syllabus content
   - Do NOT include any topics outside the specified chapters
   - Questions must reflect the depth and complexity appropriate for {{examLevel}} level
   - **CRITICAL FOR MDCAT:** DO NOT include any questions about plants, botany, or plant-related topics in MDCAT exam papers
   - **MDCAT SPECIFIC:** Use only past papers and create new questions based on the given syllabus - focus on human biology, chemistry, physics, and logical reasoning
   - **QUESTION DIFFICULTY DISTRIBUTION:** 25% easy (basic concepts, direct application), 60% moderate (conceptual understanding, standard problem-solving), 15% challenging (higher-order thinking, multi-step reasoning) - matching actual MDCAT paper difficulty
   - **QUESTION STYLES:** Include knowledge-based (facts and definitions), conceptual (understanding principles), numerical (standard calculations), analytical (problem-solving), and application-based questions that appear in actual MDCAT past papers
   - **AGE-APPROPRIATE:** Questions suitable for 17-year-old students preparing for medical college admission - challenging but achievable with proper preparation
   - **PHYSICS FOCUS:** Emphasize reactions, conditions, intermediates, equilibrium, thermodynamics, and practical applications
   - **CHEMISTRY FOCUS:** Focus on reactions, reactants, products, mechanisms, organic transformations, and chemical principles
   - **EXAM AUTHENTICITY:** Create questions that feel like actual MDCAT exam - realistic difficulty, proper formatting, and genuine testing of FSc curriculum knowledge

2. **PROFESSIONAL EXAM FORMAT:**
   - Create a properly formatted exam paper with clear sections
   - Include professional header with all institutional details
   - Provide clear, unambiguous instructions for each section
   - Use proper question numbering and sub-question formatting
   - Ensure questions progress from easier to more challenging within each section

3. **EXACT SPECIFICATIONS COMPLIANCE:**
   - MCQs: Generate exactly {{questionDistribution.mcqs}} questions ({{marksDistribution.mcqMarks}} marks each)
   - Short Questions: Generate exactly {{questionDistribution.shortQuestions}} questions ({{marksDistribution.shortQuestionMarks}} marks each)
   - Long Questions: Generate exactly {{questionDistribution.longQuestions}} questions ({{marksDistribution.longQuestionMarks}} marks each)
   - Total Marks: Must equal exactly {{totalMarks}} marks
   - Time Limit: {{timeLimit}} minutes

4. **QUESTION QUALITY STANDARDS:**
   - All questions must be factually accurate and up-to-date
   - MCQs must have exactly 4 options (A, B, C, D) with only one correct answer
   - Distractors must be plausible and test genuine understanding
   - Short questions should require 3-5 minutes to answer completely
   - Long questions should be structured with clear sub-parts when appropriate
   - Use proper LaTeX formatting for all mathematical expressions: $$formula$$ or $variable$

5. **COMPREHENSIVE ANSWER KEY:**
   - Provide complete answer key with explanations
   - Include marking schemes for subjective questions
   - Specify key points that must be covered for full marks
   - Ensure answers are pedagogically sound and curriculum-aligned

6. **ACADEMIC RIGOR:**
   - Questions must test different cognitive levels: knowledge, comprehension, application, analysis
   - Ensure balanced coverage across all specified chapters
   - Maintain consistency in difficulty within each question type
   - Use clear, unambiguous language appropriate for the target level

**EXAM DETAILS:**
- Subject: {{subject}}
- Level: {{examLevel}}
- Chapters to Cover: {{#each chapters}}"{{this}}"{{/each}}
- Total Marks: {{totalMarks}}
- Time Limit: {{timeLimit}} minutes
{{#if schoolName}}- School: {{schoolName}}{{/if}}
{{#if teacherName}}- Teacher: {{teacherName}}{{/if}}
{{#if className}}- Class: {{className}}{{/if}}

**QUESTION DISTRIBUTION:**
- MCQs: {{questionDistribution.mcqs}} questions × {{marksDistribution.mcqMarks}} marks = {{multiply questionDistribution.mcqs marksDistribution.mcqMarks}} marks
- Short Questions: {{questionDistribution.shortQuestions}} questions × {{marksDistribution.shortQuestionMarks}} marks = {{multiply questionDistribution.shortQuestions marksDistribution.shortQuestionMarks}} marks  
- Long Questions: {{questionDistribution.longQuestions}} questions × {{marksDistribution.longQuestionMarks}} marks = {{multiply questionDistribution.longQuestions marksDistribution.longQuestionMarks}} marks

Generate a professional exam paper that meets these exact specifications and maintains the highest academic standards.`;

const generateExamPaperFlow = (aiInstance: any) => aiInstance.defineFlow(
  {
    name: 'generateExamPaperFlow',
    inputSchema: GenerateExamPaperInputSchema,
    outputSchema: GenerateExamPaperOutputSchema,
  },
  async (input) => {
    const modelName = getModel(input.isPro);
    const model = `googleai/${modelName}`;
    
    const prompt = aiInstance.definePrompt({
      name: "generateExamPaperPrompt",
      model: model,
      prompt: promptText,
      input: { schema: GenerateExamPaperInputSchema },
      output: { schema: GenerateExamPaperOutputSchema },
    });

    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await prompt(input, { model });
        const output = result.output;

        if (!output) {
          throw new Error("The AI model failed to return a valid exam paper.");
        }

        // Validate the structure
        if (!output.sections || output.sections.length === 0) {
          throw new Error("The AI model returned an invalid exam paper structure.");
        }

        return output;
      } catch (error: any) {
        lastError = error;
        console.error(`Exam paper generation attempt ${attempt} failed:`, sanitizeLogInput(error.message));

        if (attempt === maxRetries) break;

        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Categorize the final error
    const errorMessage = lastError?.message || 'Unknown error';
    if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      // Rotate to next API key for quota issues
      try {
        const { handleApiKeyError } = await import('@/lib/api-key-manager');
        handleApiKeyError();
        console.log('🔄 Rotated API key due to quota limit (exam paper)');
      } catch (rotateError) {
        console.warn('Failed to rotate API key:', rotateError);
      }
      throw new Error('AI service quota exceeded. Please try again in a few minutes.');
    } else if (errorMessage.includes('timeout') || errorMessage.includes('deadline')) {
      throw new Error('Request timed out. Please try with fewer questions or simpler requirements.');
    } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error('Failed to generate exam paper. Please try again or contact support if the issue persists.');
    }
  }
);
