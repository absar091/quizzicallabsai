
// Server-only flow: generate-dashboard-insights
/**
 * @fileOverview Generates AI-powered insights and suggestions based on a user's quiz history.
 *
 * - generateDashboardInsights - Analyzes performance data and provides personalized feedback.
 * - GenerateDashboardInsightsInput - The input type for the function.
 * - GenerateDashboardInsightsOutput - The return type for the function.
 */

import {ai, isAiAvailable} from '@/ai/genkit';
import { getModel } from '@/lib/getModel';
import {z} from 'genkit';

// Define the structure for a single quiz result to be passed in
const QuizResultSchema = z.object({
  topic: z.string(),
  percentage: z.number(),
  date: z.string().describe("ISO 8601 date string"),
});

// Define the input schema for the flow
const GenerateDashboardInsightsInputSchema = z.object({
  userName: z.string().describe("The user's first name."),
  quizHistory: z.array(QuizResultSchema).describe("An array of the user's recent quiz results."),
  isPro: z.boolean().default(false),
});
export type GenerateDashboardInsightsInput = z.infer<typeof GenerateDashboardInsightsInputSchema>;


// Define the output schema for the AI's response
const GenerateDashboardInsightsOutputSchema = z.object({
  greeting: z.string().describe("A short, personalized, and encouraging greeting for the user. Should be 1 sentence max."),
  observation: z.string().describe("A key observation about the user's performance. E.g., 'You're excelling at Physics!' or 'Your scores in Chemistry are improving.' Should be 1 sentence max."),
  suggestion: z.string().describe("A specific, actionable suggestion for what the user could do next. E.g., 'Why not challenge yourself with a hard quiz?' or 'A quick refresher on Biology might be helpful.' Should be 1 sentence max."),
  suggestedAction: z.object({
      buttonText: z.string().describe("The text for a call-to-action button, e.g., 'Retry Incorrect Questions' or 'Practice Chemistry'."),
      link: z.string().describe("The relative URL for the button's action, e.g., '/generate-quiz?topic=Chemistry'."),
  }).optional().describe("An optional structured action the user can take directly."),
});
export type GenerateDashboardInsightsOutput = z.infer<typeof GenerateDashboardInsightsOutputSchema>;

export async function generateDashboardInsights(
  input: GenerateDashboardInsightsInput
): Promise<GenerateDashboardInsightsOutput> {
  // If there's no history, return a default welcome message
  if (input.quizHistory.length === 0) {
    return {
      greeting: `Welcome, ${input.userName}!`,
      observation: "You're just getting started on your learning journey.",
      suggestion: "Explore our Generation Lab to create your first quiz or study guide.",
      suggestedAction: {
        buttonText: "Go to GenLab",
        link: "/genlab"
      }
    };
  }
  if (!isAiAvailable() || !ai) {
    return {
      greeting: `Welcome back, ${input.userName}!`,
      observation: "AI insights are temporarily unavailable.",
      suggestion: "Continue practicing with quizzes to improve your skills.",
      suggestedAction: {
        buttonText: "Create Quiz",
        link: "/generate-quiz"
      }
    };
  }
  return generateDashboardInsightsFlow(input);
}


const getPromptText = (isPro: boolean) => `You are a smart academic coach. Give encouraging, concise feedback based on quiz history.

${isPro ? 'PRO: Detailed analysis + advanced strategies.' : 'STANDARD: Clear feedback + actionable tips.'}

NAME: {{{userName}}}
QUIZZES: {{#each quizHistory}}- {{this.topic}} {{this.percentage}}%{{/each}}

INSTRUCTIONS:
1: Short greeting with name
2: One sentence - strongest topic (if >80% avg) OR weakest topic (if <60% avg) OR general trend
3: One sentence suggestion based on observation
4: Optional action button with relevant URL

Keep it brief. Focus on positives.`;

const generateDashboardInsightsFlow = async (input: GenerateDashboardInsightsInput): Promise<GenerateDashboardInsightsOutput> => {
  // Await the AI instance
  const aiInstance = await ai;
  if (!aiInstance) {
    return {
      greeting: `Welcome back, ${input.userName}!`,
      observation: "AI insights are temporarily unavailable.",
      suggestion: "Continue practicing with quizzes to improve your skills.",
      suggestedAction: {
        buttonText: "Create Quiz",
        link: "/generate-quiz"
      }
    };
  }

  const createPrompt = (isPro: boolean, useFallback: boolean = false) => {
    const { getUniquePromptName } = require('@/ai/utils/prompt-registry');
    return aiInstance.definePrompt({
      name: getUniquePromptName('generateDashboardInsightsPrompt'),
      model: `googleai/${getModel(isPro, useFallback)}`,
      prompt: getPromptText(isPro),
      input: { schema: GenerateDashboardInsightsInputSchema },
      output: { schema: GenerateDashboardInsightsOutputSchema },
    });
  };

  // To keep the prompt from getting too long, only send the last 10 quiz results
  const recentHistory = {
    ...input,
    quizHistory: input.quizHistory.slice(0, 10),
  };
  
  let output: GenerateDashboardInsightsOutput | undefined;
  let retryCount = 0;
  const maxRetries = 1; // Reduced from 2 to 1

  while (retryCount <= maxRetries) {
    try {
      // Pre-create prompts instead of regenerating
      const prompt = createPrompt(input.isPro, retryCount > 0);
      const result = await prompt(recentHistory);
      output = result.output;

      // Quick validation
      if (output?.greeting && output?.observation && output?.suggestion) {
        return output;
      } else {
        throw new Error("AI returned invalid insights structure");
      }
    } catch (error: any) {
      retryCount++;
      const errorMsg = error?.message || 'Unknown error';

      if (retryCount > maxRetries) {
        // Fail fast for non-quota errors
        if (errorMsg.includes('quota') || errorMsg.includes('rate limit')) {
          try {
            const { handleApiKeyError } = await import('@/lib/api-key-manager');
            handleApiKeyError();
            console.log('🔄 Rotated API key due to quota limit (dashboard insights)');
          } catch (rotateError) {
            console.warn('Failed to rotate API key:', rotateError);
          }
          throw new Error('AI service quota exceeded. Please try again in a few minutes.');
        }
        throw new Error('Failed to generate dashboard insights. Please try again.');
      }

      // Reduced backoff: 500ms instead of 2^retry * 1000ms
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  if (!output || !output.greeting || !output.observation || !output.suggestion) {
    console.error('AI model returned invalid insights structure:', output);
    throw new Error("The AI model failed to return valid insights (missing greeting, observation, or suggestion). Please try again.");
  }
  return output;
};
