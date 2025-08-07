
'use server';

/**
 * @fileOverview Generates AI-powered insights and suggestions based on a user's quiz history.
 *
 * - generateDashboardInsights - Analyzes performance data and provides personalized feedback.
 * - GenerateDashboardInsightsInput - The input type for the function.
 * - GenerateDashboardInsightsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
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
  return generateDashboardInsightsFlow(input);
}


const promptText = `You are an AI-powered academic coach named 'Quizzical'. Your goal is to provide encouraging, insightful, and actionable feedback to a student based on their recent quiz performance. Be friendly, positive, and concise.

**CONTEXT:**
- Student Name: {{{userName}}}
- Recent Quiz History (last 10 quizzes):
{{#each quizHistory}}
  - Topic: {{this.topic}}, Score: {{this.percentage}}%, Date: {{this.date}}
{{/each}}

**YOUR TASK:**
Analyze the student's quiz history and generate a response in the specified JSON format. Your analysis must be brief and to the point.

1.  **Greeting:** Create a short, positive greeting. Use the user's name.

2.  **Observation (Max 1 Sentence):** Identify the SINGLE most important trend.
    - **Strongest Topic:** Find the topic with the highest average score (must have at least 2 quizzes). If their average is over 80%, congratulate them (e.g., "You're consistently acing your Physics quizzes!").
    - **Weakest Topic:** Find the topic with the lowest average score (must have at least 2 quizzes). If their average is below 50%, gently point it out (e.g., "It looks like Chemistry is a bit of a challenge right now.").
    - **General Improvement:** If no clear strongest/weakest topic, but scores are trending up, mention their improvement.
    - **General Encouragement:** If the data is mixed, provide a general encouraging observation.

3.  **Suggestion (Max 1 Sentence):** Based on your observation, provide a clear, single-sentence suggestion for their next step.
    - If strong in a topic, suggest a harder difficulty level.
    - If weak in a topic, suggest practicing it or reviewing a study guide for it.
    - If improving, encourage them to keep the momentum going.

4.  **Suggested Action (Optional but recommended):**
    - Create a practical call-to-action button based on your suggestion.
    - 'buttonText' should be short and action-oriented (e.g., "Practice Chemistry", "Master Physics").
    - 'link' should be a functional URL. For a topic-specific quiz, use '/generate-quiz?topic=TOPIC_NAME'. For a study guide, use '/generate-study-guide?topic=TOPIC_NAME'.

**Example (Weak in Chemistry):**
*   Greeting: "Keep up the great effort, {{{userName}}}!"
*   Observation: "Your recent results show Chemistry has been a tough spot."
*   Suggestion: "A focused practice session could make a big difference."
*   Action: { buttonText: "Practice Chemistry", link: "/generate-quiz?topic=Chemistry" }

Now, generate the output for the provided student data.`;

const prompt15Flash = ai.definePrompt({
    name: 'generateDashboardInsightsPrompt15Flash',
    model: 'googleai/gemini-1.5-flash',
    prompt: promptText,
    input: { schema: GenerateDashboardInsightsInputSchema },
    output: { schema: GenerateDashboardInsightsOutputSchema },
});

const prompt15Pro = ai.definePrompt({
    name: 'generateDashboardInsightsPrompt15Pro',
    model: 'googleai/gemini-1.5-pro',
    prompt: promptText,
    input: { schema: GenerateDashboardInsightsInputSchema },
    output: { schema: GenerateDashboardInsightsOutputSchema },
});

const generateDashboardInsightsFlow = ai.defineFlow(
  {
    name: 'generateDashboardInsightsFlow',
    inputSchema: GenerateDashboardInsightsInputSchema,
    outputSchema: GenerateDashboardInsightsOutputSchema,
  },
  async (input) => {
    // To keep the prompt from getting too long, only send the last 10 quiz results
    const recentHistory = {
      ...input,
      quizHistory: input.quizHistory.slice(0, 10),
    };
    
    let output;
    try {
        const result = await prompt15Pro(recentHistory);
        output = result.output;
    } catch (error: any) {
        if (error.message && (error.message.includes('503') || error.message.includes('overloaded') || error.message.includes('429'))) {
            console.log('Gemini 1.5 Flash unavailable, falling back to Gemini 1.5 Pro for dashboard insights.');
            const result = await prompt15Pro(recentHistory);
            output = result.output;
        } else {
            // Re-throw other errors
            throw error;
        }
    }

    if (!output) {
      throw new Error("The AI model failed to return valid insights. Please try again.");
    }
    return output;
  }
);
