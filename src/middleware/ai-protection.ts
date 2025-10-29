/**
 * AI Protection Middleware for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { AIAbusePreventionSystem } from '@/lib/ai-abuse-prevention';
import { secureLog } from '@/lib/secure-logger';

export async function withAIProtection(
  request: NextRequest,
  operation: 'quiz_generation' | 'flashcard_generation' | 'explanation_generation' | 'image_analysis',
  handler: (req: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  
  try {
    // Extract user ID from request (adjust based on your auth system)
    const userId = request.headers.get('x-user-id') || 
                   request.cookies.get('user-id')?.value ||
                   request.ip || 'anonymous';
    
    // Check if user has pro access
    const isPro = request.headers.get('x-user-tier') === 'pro' ||
                  request.cookies.get('user-tier')?.value === 'pro';

    // Get request body for analysis
    const requestData = request.method === 'POST' ? await request.clone().json() : {};
    
    // Check with abuse prevention system
    const abuseSystem = AIAbusePreventionSystem.getInstance();
    const checkResult = await abuseSystem.checkRequest(userId, operation, requestData, isPro);
    
    if (!checkResult.allowed) {
      secureLog('warn', `AI request blocked for user ${userId.substring(0, 8)}...: ${checkResult.reason}`);
      
      return NextResponse.json(
        { 
          error: checkResult.reason || 'Request not allowed',
          waitTime: checkResult.waitTime,
          type: 'rate_limit_exceeded'
        },
        { 
          status: 429,
          headers: {
            'Retry-After': checkResult.waitTime ? Math.ceil(checkResult.waitTime / 1000).toString() : '30',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': checkResult.waitTime ? 
              Math.ceil((Date.now() + checkResult.waitTime) / 1000).toString() : 
              Math.ceil((Date.now() + 30000) / 1000).toString()
          }
        }
      );
    }

    // Add rate limit headers to successful requests
    const userStatus = abuseSystem.getUserStatus(userId);
    const response = await handler(request);
    
    response.headers.set('X-RateLimit-Remaining-Quizzes', userStatus.remainingQuizzes.toString());
    response.headers.set('X-RateLimit-Remaining-Flashcards', userStatus.remainingFlashcards.toString());
    response.headers.set('X-User-Restricted', userStatus.isRestricted.toString());
    
    return response;
    
  } catch (error) {
    secureLog('error', 'AI protection middleware error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to create protected AI endpoint
 */
export function createProtectedAIEndpoint(
  operation: 'quiz_generation' | 'flashcard_generation' | 'explanation_generation' | 'image_analysis',
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    return withAIProtection(request, operation, handler);
  };
}