/**
 * AI Error Handler Utility
 * Provides user-friendly error messages and handling for AI API errors
 */

export interface AIErrorResponse {
  title: string;
  description: string;
  showUpgradePrompt: boolean;
  redirectToPricing: boolean;
  duration?: number;
}

/**
 * Parse and handle AI API errors with user-friendly messages
 */
export function handleAIError(
  response: Response,
  result: any,
  isPro: boolean = false
): AIErrorResponse {
  const errorCode = result?.code || result?.error;
  const errorMessage = result?.error || result?.message || 'An unexpected error occurred';
  
  let errorTitle = "Error ❌";
  let errorDescription = errorMessage;
  let showUpgradePrompt = false;
  let redirectToPricing = false;
  let duration = 6000;
  
  // Token/Usage Limit Errors
  if (
    response.status === 429 || 
    errorCode === 'LIMIT_REACHED' || 
    errorCode === 'TOKEN_LIMIT_EXCEEDED' ||
    errorMessage.toLowerCase().includes('limit reached') ||
    errorMessage.toLowerCase().includes('limit exceeded') ||
    errorMessage.toLowerCase().includes('token limit') ||
    errorMessage.toLowerCase().includes('usage limit')
  ) {
    errorTitle = "Token Limit Reached 🚫";
    if (isPro) {
      errorDescription = "You've used all your Pro tokens for this month. Your limit will reset on January 1, 2026.";
    } else {
      errorDescription = "You've used all your free AI tokens for this month. Upgrade to Pro for 500,000 tokens/month or wait until January 1, 2026 for your limit to reset.";
      showUpgradePrompt = true;
      redirectToPricing = true;
    }
    duration = 10000;
  }
  
  // Authentication Errors
  else if (
    response.status === 401 || 
    errorCode === 'UNAUTHORIZED' ||
    errorMessage.toLowerCase().includes('unauthorized') ||
    errorMessage.toLowerCase().includes('authentication') ||
    errorMessage.toLowerCase().includes('sign in')
  ) {
    errorTitle = "Authentication Required 🔐";
    errorDescription = "Your session has expired. Please sign in again to continue using AI features.";
  }
  
  // Rate Limiting / Quota Errors
  else if (
    response.status === 503 ||
    errorCode === 'QUOTA_EXCEEDED' ||
    errorMessage.toLowerCase().includes('quota') ||
    errorMessage.toLowerCase().includes('rate limit') ||
    errorMessage.toLowerCase().includes('too many requests')
  ) {
    errorTitle = "Service Temporarily Unavailable ⏳";
    errorDescription = "The AI service is currently at capacity. Please try again in a few minutes.";
  }
  
  // Timeout Errors
  else if (
    response.status === 504 ||
    errorCode === 'TIMEOUT' ||
    errorMessage.toLowerCase().includes('timeout') ||
    errorMessage.toLowerCase().includes('timed out') ||
    errorMessage.toLowerCase().includes('busy') ||
    errorMessage.toLowerCase().includes('overloaded')
  ) {
    errorTitle = "Request Timeout ⏱️";
    errorDescription = "The AI is taking longer than expected. Try reducing complexity (fewer questions, simpler topic) and try again.";
  }
  
  // Network/Connection Errors
  else if (
    errorCode === 'NETWORK_ERROR' ||
    errorMessage.toLowerCase().includes('network') ||
    errorMessage.toLowerCase().includes('connection') ||
    errorMessage.toLowerCase().includes('fetch failed')
  ) {
    errorTitle = "Connection Error 🌐";
    errorDescription = "Unable to reach the server. Please check your internet connection and try again.";
  }
  
  // Content/Generation Errors
  else if (
    errorCode === 'EMPTY_RESPONSE' ||
    errorCode === 'INVALID_CONTENT' ||
    errorMessage.toLowerCase().includes('empty') ||
    errorMessage.toLowerCase().includes('no quiz') ||
    errorMessage.toLowerCase().includes('no questions') ||
    errorMessage.toLowerCase().includes('broaden') ||
    errorMessage.toLowerCase().includes('invalid content')
  ) {
    errorTitle = "Content Generation Issue 📝";
    errorDescription = "The AI couldn't generate valid content for this topic. Try broadening your topic, providing more context, or simplifying your requirements.";
  }
  
  // Server Errors
  else if (response.status >= 500) {
    errorTitle = "Server Error 🔧";
    errorDescription = "Our servers are experiencing issues. Please try again in a moment.";
  }
  
  // Bad Request Errors
  else if (response.status === 400) {
    errorTitle = "Invalid Request ⚠️";
    errorDescription = errorMessage || "The request was invalid. Please check your input and try again.";
  }
  
  return {
    title: errorTitle,
    description: errorDescription,
    showUpgradePrompt,
    redirectToPricing,
    duration
  };
}

/**
 * Show upgrade prompt dialog
 */
export function showUpgradeDialog(): void {
  setTimeout(() => {
    if (confirm('Would you like to upgrade to Pro for 500,000 AI tokens per month and unlimited features?')) {
      window.location.href = '/pricing';
    }
  }, 2000);
}

/**
 * Format error for logging
 */
export function logAIError(
  endpoint: string,
  error: any,
  context?: Record<string, any>
): void {
  console.error(`❌ AI Error [${endpoint}]:`, {
    message: error.message || error,
    status: error.status,
    code: error.code,
    context,
    timestamp: new Date().toISOString()
  });
}
