// Whop plan limits and pricing - Safe for client-side use

export interface PlanLimits {
  tokens: number;
  quizzes: number;
  price_usd: number;
  price_pkr: number;
  features: string[];
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    tokens: 100000, // 100K
    quizzes: 20,
    price_usd: 0,
    price_pkr: 0,
    features: ['Basic AI Model', 'Visible Ads', 'Basic Explanations', '10 MB Storage', 'Community Support']
  },
  basic: {
    tokens: 250000, // 250K
    quizzes: 45,
    price_usd: 1.05,
    price_pkr: 300,
    features: ['Standard AI Model', 'Removed Ads', 'Short Explanations', '25 MB Storage', 'Standard Support']
  },
  pro: {
    tokens: 500000, // 500K
    quizzes: 90,
    price_usd: 2.10,
    price_pkr: 600,
    features: ['Gemini 1.5 Pro', 'Removed Ads', 'Detailed Explanations', '25 MB Storage', 'Priority Support']
  },
  premium: {
    tokens: 1000000, // 1M
    quizzes: 180,
    price_usd: 3.86,
    price_pkr: 1100,
    features: ['Gemini 1.5 Pro+', 'Removed Ads', 'Advanced + Visual Explanations', '50 MB Storage', 'Premium Chat Support']
  }
};
