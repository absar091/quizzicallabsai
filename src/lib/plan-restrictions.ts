// @ts-nocheck
export interface PlanLimits {
  maxBookmarks: number;
  hasWatermark: boolean;
  canDownloadExamPaper: boolean;
  hasAds: boolean;
  model: 'gemini-1.5-flash' | 'gemini-1.5-pro';
  enhancedExplanations: boolean;
}

export const PLAN_LIMITS: Record<'free' | 'pro', PlanLimits> = {
  free: {
    maxBookmarks: 50,
    hasWatermark: true,
    canDownloadExamPaper: false,
    hasAds: true,
    model: 'gemini-1.5-flash',
    enhancedExplanations: false,
  },
  pro: {
    maxBookmarks: Infinity,
    hasWatermark: false,
    canDownloadExamPaper: true,
    hasAds: false,
    model: 'gemini-2.5-pro',
    enhancedExplanations: true,
  },
};

export const getPlanLimits = (plan: string): PlanLimits => {
  const normalizedPlan = plan.toLowerCase() as 'free' | 'pro';
  return PLAN_LIMITS[normalizedPlan] || PLAN_LIMITS.free;
};

export const canAddBookmark = (currentCount: number, plan: string): boolean => {
  const limits = getPlanLimits(plan);
  return currentCount < limits.maxBookmarks;
};

export const shouldShowAds = (plan: string): boolean => {
  return getPlanLimits(plan).hasAds;
};

export const shouldAddWatermark = (plan: string): boolean => {
  return getPlanLimits(plan).hasWatermark;
};

export const canDownloadExamPaper = (plan: string): boolean => {
  return getPlanLimits(plan).canDownloadExamPaper;
};