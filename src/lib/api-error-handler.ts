/**
 * API Error Handler Utility
 * Handles and formats API errors with special handling for usage limits
 */

export interface ApiErrorDetails {
  planName?: string;
  tokensUsed?: number;
  tokensLimit?: number;
  resetDate?: string;
  upgradeUrl?: string;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: ApiErrorDetails;
  remaining?: number;
}

export interface ParsedError {
  title: string;
  message: string;
  isLimitReached: boolean;
  details?: ApiErrorDetails;
  showUpgradeButton?: boolean;
}

/**
 * Parse API error response and return user-friendly error information
 */
export function parseApiError(error: any): ParsedError {
  console.error('API Error:', error);

  // Default error
  const defaultError: ParsedError = {
    title: 'Error',
    message: 'An unexpected error occurred. Please try again.',
    isLimitReached: false,
  };

  // Handle network errors
  if (!error) {
    return defaultError;
  }

  // If error is a Response object, try to parse it
  if (error instanceof Response) {
    return {
      title: 'Network Error',
      message: `Request failed with status ${error.status}. Please try again.`,
      isLimitReached: false,
    };
  }

  // Handle error message string
  if (typeof error === 'string') {
    return {
      title: 'Error',
      message: error,
      isLimitReached: false,
    };
  }

  // Handle structured API errors
  const apiError = error as ApiError;

  // Check for limit reached error
  if (apiError.code === 'LIMIT_REACHED' || apiError.error?.toLowerCase().includes('limit')) {
    return {
      title: '🪙 Usage Limit Reached',
      message: apiError.error || 'Your usage limit has been reached.',
      isLimitReached: true,
      details: apiError.details,
      showUpgradeButton: true,
    };
  }

  // Handle rate limiting
  if (apiError.error?.includes('rate limit') || apiError.error?.includes('429')) {
    return {
      title: 'Rate Limit Reached',
      message: "You've made too many requests. Please wait a minute and try again.",
      isLimitReached: false,
    };
  }

  // Handle service overload
  if (apiError.error?.includes('overloaded') || apiError.error?.includes('503') || apiError.error?.includes('busy')) {
    return {
      title: 'Service Busy',
      message: 'Our AI service is currently busy. Please try again in a few minutes.',
      isLimitReached: false,
    };
  }

  // Handle timeout errors
  if (apiError.error?.includes('timeout') || apiError.error?.includes('timed out')) {
    return {
      title: 'Request Timeout',
      message: 'The request took too long. Please try with fewer questions or try again later.',
      isLimitReached: false,
    };
  }

  // Handle content generation issues
  if (apiError.error?.includes('Empty') || apiError.error?.includes('no quiz') || apiError.error?.includes('broaden')) {
    return {
      title: 'Content Issue',
      message: "The AI couldn't generate valid content for this topic. Try broadening your topic or providing more context.",
      isLimitReached: false,
    };
  }

  // Handle authentication errors
  if (apiError.error?.toLowerCase().includes('unauthorized') || apiError.error?.toLowerCase().includes('auth')) {
    return {
      title: 'Authentication Error',
      message: 'Your session has expired. Please refresh the page and try again.',
      isLimitReached: false,
    };
  }

  // Handle network errors
  if (apiError.error?.includes('network') || apiError.error?.includes('fetch')) {
    return {
      title: 'Network Error',
      message: 'Network connection issue. Please check your internet connection and try again.',
      isLimitReached: false,
    };
  }

  // Return the error message from the API if available
  if (apiError.error) {
    return {
      title: 'Error',
      message: apiError.error,
      isLimitReached: false,
      details: apiError.details,
    };
  }

  // Fallback to default error
  return defaultError;
}

/**
 * Format usage limit details for display
 */
export function formatLimitDetails(details?: ApiErrorDetails): string {
  if (!details) return '';

  const parts: string[] = [];

  if (details.planName) {
    parts.push(`Plan: ${details.planName}`);
  }

  if (details.tokensUsed !== undefined && details.tokensLimit !== undefined) {
    parts.push(`Usage: ${details.tokensUsed.toLocaleString()} / ${details.tokensLimit.toLocaleString()} tokens`);
  }

  if (details.resetDate) {
    parts.push(`Resets: ${details.resetDate}`);
  }

  return parts.join(' • ');
}

/**
 * Get upgrade URL from error details or default
 */
export function getUpgradeUrl(details?: ApiErrorDetails): string {
  return details?.upgradeUrl || '/pricing';
}
