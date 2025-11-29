import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export type GeminiModel = 
  | 'models/gemini-3-pro-preview'
  | 'models/gemini-2.5-pro'
  | 'models/gemini-2.5-flash'
  | 'models/gemini-flash-lite-latest'
  | 'models/gemini-3-pro-image-preview'
  | 'models/gemini-2.5-flash-image';

export interface GeminiConfig {
  model: GeminiModel;
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
}

// Get text model based on user plan
export function getModelForUser(userPlan: 'Free' | 'Pro' | 'Enterprise', hasImage: boolean = false): GeminiModel {
  if (hasImage) {
    return userPlan === 'Pro' || userPlan === 'Enterprise'
      ? 'models/gemini-3-pro-image-preview'
      : 'models/gemini-2.5-flash-image';
  }
  
  return userPlan === 'Pro' || userPlan === 'Enterprise'
    ? 'models/gemini-3-pro-preview'
    : 'models/gemini-2.5-flash';
}

// Get fallback model chain
export function getFallbackModel(currentModel: GeminiModel, userPlan: 'Free' | 'Pro' | 'Enterprise'): GeminiModel | null {
  // Pro user fallbacks
  if (userPlan === 'Pro' || userPlan === 'Enterprise') {
    switch (currentModel) {
      case 'models/gemini-3-pro-preview':
        return 'models/gemini-2.5-pro';
      case 'models/gemini-2.5-pro':
        return 'models/gemini-2.5-flash';
      case 'models/gemini-3-pro-image-preview':
        return 'models/gemini-2.5-flash-image';
      default:
        return null;
    }
  }
  
  // Free user fallbacks
  switch (currentModel) {
    case 'models/gemini-2.5-flash':
      return 'models/gemini-flash-lite-latest';
    default:
      return null;
  }
}

// Get Gemini model instance
export function getGeminiModel(config: GeminiConfig) {
  return genAI.getGenerativeModel({
    model: config.model,
    generationConfig: {
      temperature: config.temperature ?? 0.7,
      topP: config.topP ?? 0.95,
      topK: config.topK ?? 40,
      maxOutputTokens: config.maxOutputTokens ?? 8192,
    },
  });
}

// Enhanced prompt for LaTeX support
export const LATEX_PROMPT_INSTRUCTIONS = `
IMPORTANT: Format all mathematical, chemical, and physics content using LaTeX notation:

1. **Inline Math**: Use $...$ for inline expressions
   Example: The speed of light is $c = 3 \\times 10^8$ m/s

2. **Display Math**: Use $$...$$ for centered equations
   Example: $$E = mc^2$$

3. **Chemistry**: Use \\ce{} for chemical equations
   Example: $\\ce{2H2 + O2 -> 2H2O}$

4. **Fractions**: Use \\frac{numerator}{denominator}
   Example: $\\frac{1}{2}$

5. **Subscripts/Superscripts**: Use _ and ^
   Example: $H_2O$, $x^2$

6. **Greek Letters**: Use \\alpha, \\beta, \\gamma, etc.
   Example: $\\alpha + \\beta = \\gamma$

7. **Common Symbols**:
   - Square root: $\\sqrt{x}$
   - Integral: $\\int_a^b f(x)dx$
   - Sum: $\\sum_{i=1}^n i$
   - Limit: $\\lim_{x \\to \\infty}$

8. **Physics Formulas**: Always use proper notation
   Example: $$F = ma$$, $$v = u + at$$

9. **Chemical Formulas**: Use proper subscripts
   Example: $\\ce{CH3COOH}$, $\\ce{H2SO4}$

Always wrap mathematical content in LaTeX delimiters for proper rendering.
`;

// Generate quiz with LaTeX support
export async function generateQuizWithLatex(
  prompt: string,
  userPlan: 'Free' | 'Pro' | 'Enterprise'
) {
  const model = getModelForUser(userPlan);
  const gemini = getGeminiModel({ model });

  const enhancedPrompt = `${LATEX_PROMPT_INSTRUCTIONS}\n\n${prompt}`;

  const result = await gemini.generateContent(enhancedPrompt);
  const response = await result.response;
  return response.text();
}

// Model capabilities comparison
export const MODEL_FEATURES = {
  'models/gemini-3-pro-preview': {
    name: 'Gemini 3 Pro (Pro)',
    features: [
      'Advanced reasoning',
      'Best accuracy',
      'Longest context',
      'Enhanced LaTeX support',
      'Complex problem solving'
    ],
    maxTokens: 8192,
    contextWindow: 2000000
  },
  'models/gemini-2.5-pro': {
    name: 'Gemini 2.5 Pro (Fallback)',
    features: [
      'Stable performance',
      'High accuracy',
      'Large context',
      'Reliable generation'
    ],
    maxTokens: 8192,
    contextWindow: 1000000
  },
  'models/gemini-2.5-flash': {
    name: 'Gemini 2.5 Flash (Free)',
    features: [
      'Fast generation',
      'Good reasoning',
      'Standard accuracy',
      'Cost effective'
    ],
    maxTokens: 8192,
    contextWindow: 1000000
  },
  'models/gemini-flash-lite-latest': {
    name: 'Gemini Flash Lite (Fallback)',
    features: [
      'Ultra fast',
      'Lightweight',
      'Basic reasoning',
      'Low latency'
    ],
    maxTokens: 8192,
    contextWindow: 32000
  },
  'models/gemini-3-pro-image-preview': {
    name: 'Gemini 3 Pro Image (Pro)',
    features: [
      'Advanced image understanding',
      'Best accuracy',
      'Document analysis',
      'Visual reasoning'
    ],
    maxTokens: 8192,
    contextWindow: 2000000
  },
  'models/gemini-2.5-flash-image': {
    name: 'Gemini 2.5 Flash Image (Free)',
    features: [
      'Fast image processing',
      'Good accuracy',
      'Document support',
      'Cost effective'
    ],
    maxTokens: 8192,
    contextWindow: 1000000
  }
};
