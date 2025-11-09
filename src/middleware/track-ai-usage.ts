import { NextRequest, NextResponse } from 'next/server';
import { whopService } from '@/lib/whop';
import { auth } from '@/lib/firebase-admin';
import { estimateTokens } from '@/lib/estimate-tokens';

/**
 * Middleware to track AI usage (tokens) for all AI API routes
 * This wraps API handlers and automatically tracks token usage
 */
export function trackAIUsage(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    estimateFromInput?: boolean; // Estimate tokens from input
    estimateFromOutput?: boolean; // Estimate tokens from output
    minimumTokens?: number; // Minimum tokens to charge
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    let userId: string | null = null;
    let tokensUsed = 0;

    try {
      // Get user from auth header
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        try {
          const token = authHeader.split('Bearer ')[1];
          const decodedToken = await auth.verifyIdToken(token);
          userId = decodedToken.uid;
        } catch (error) {
          console.warn('⚠️ Failed to verify auth token for usage tracking');
        }
      }

      // Call the actual handler
      const response = await handler(request);
      
      // Track usage if user is authenticated
      if (userId && response.ok) {
        try {
          const responseData = await response.clone().json();
          
          // Estimate tokens from response
          if (options.estimateFromOutput && responseData) {
            tokensUsed = estimateTokensFromResponse(responseData);
          }
          
          // Use minimum tokens if specified
          if (options.minimumTokens && tokensUsed < options.minimumTokens) {
            tokensUsed = options.minimumTokens;
          }

          // Track the usage
          if (tokensUsed > 0) {
            const tracked = await whopService.trackTokenUsage(userId, tokensUsed);
            
            if (tracked) {
              console.log(`✅ Tracked ${tokensUsed} tokens for user ${userId}`);
            } else {
              console.warn(`⚠️ Failed to track tokens for user ${userId} - limit may be exceeded`);
            }
          }
        } catch (trackError) {
          console.error('❌ Error tracking usage:', trackError);
          // Don't fail the request if tracking fails
        }
      }

      const duration = Date.now() - startTime;
      console.log(`⏱️ Request completed in ${duration}ms, tokens used: ${tokensUsed}`);

      return response;
    } catch (error) {
      console.error('❌ Error in trackAIUsage middleware:', error);
      throw error;
    }
  };
}

/**
 * Estimate tokens from AI response
 */
function estimateTokensFromResponse(data: any): number {
  let totalTokens = 0;

  try {
    // Handle different response formats
    if (data.quiz && Array.isArray(data.quiz)) {
      // Quiz response
      data.quiz.forEach((q: any) => {
        totalTokens += estimateTokens(q.question || '');
        totalTokens += estimateTokens(q.explanation || '');
        if (q.options) {
          q.options.forEach((opt: string) => {
            totalTokens += estimateTokens(opt);
          });
        }
      });
    } else if (data.studyGuide) {
      // Study guide response
      const guide = data.studyGuide;
      totalTokens += estimateTokens(guide.overview || '');
      totalTokens += estimateTokens(guide.keyTopics || '');
      totalTokens += estimateTokens(guide.studyTips || '');
      totalTokens += estimateTokens(guide.practiceQuestions || '');
    } else if (data.explanation) {
      // Explanation response
      totalTokens += estimateTokens(data.explanation);
    } else if (data.flashcards && Array.isArray(data.flashcards)) {
      // Flashcards response
      data.flashcards.forEach((card: any) => {
        totalTokens += estimateTokens(card.front || '');
        totalTokens += estimateTokens(card.back || '');
      });
    } else if (typeof data === 'string') {
      // Plain text response
      totalTokens += estimateTokens(data);
    }

    // Add input tokens (estimated at 20% of output)
    totalTokens = Math.ceil(totalTokens * 1.2);

  } catch (error) {
    console.error('Error estimating tokens:', error);
    // Default to 1000 tokens if estimation fails
    totalTokens = 1000;
  }

  return totalTokens;
}

/**
 * Check if user has enough tokens before processing
 */
export async function checkTokenLimit(userId: string, estimatedTokens: number): Promise<{
  allowed: boolean;
  remaining: number;
  message?: string;
}> {
  try {
    const usage = await whopService.getUserUsage(userId);
    
    if (!usage) {
      return {
        allowed: false,
        remaining: 0,
        message: 'Unable to verify usage limits. Please try again.'
      };
    }

    const remaining = usage.tokens_remaining;
    
    if (remaining < estimatedTokens) {
      return {
        allowed: false,
        remaining,
        message: `Insufficient tokens. You need ${estimatedTokens} tokens but only have ${remaining} remaining. Please upgrade your plan.`
      };
    }

    return {
      allowed: true,
      remaining
    };
  } catch (error) {
    console.error('Error checking token limit:', error);
    return {
      allowed: false,
      remaining: 0,
      message: 'Unable to verify usage limits. Please try again.'
    };
  }
}
