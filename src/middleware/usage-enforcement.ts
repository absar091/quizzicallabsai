import { NextRequest, NextResponse } from 'next/server';
import { usageController } from '@/lib/usage-control';
import { auth } from '@/lib/firebase-admin';

export interface UsageEnforcementOptions {
  actionType: 'token' | 'quiz';
  amount?: number;
  estimateTokens?: (requestBody: any) => number;
}

export function withUsageEnforcement(options: UsageEnforcementOptions) {
  return function (handler: (request: NextRequest) => Promise<NextResponse>) {
    return async function (request: NextRequest): Promise<NextResponse> {
      try {
        // Get user from Firebase Auth token
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
          return NextResponse.json({ 
            error: 'Unauthorized',
            code: 'AUTH_REQUIRED' 
          }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        // Determine usage amount
        let amount = options.amount || 1;
        
        if (options.actionType === 'token' && options.estimateTokens) {
          try {
            const requestBody = await request.json();
            amount = options.estimateTokens(requestBody);
            
            // Create new request with the parsed body
            const newRequest = new NextRequest(request.url, {
              method: request.method,
              headers: request.headers,
              body: JSON.stringify(requestBody),
            });
            request = newRequest;
          } catch (error) {
            console.error('Failed to estimate tokens:', error);
          }
        }

        // Check usage permission
        const permission = await usageController.checkUsagePermission(
          userId,
          options.actionType,
          amount
        );

        if (!permission.allowed) {
          return NextResponse.json({
            error: permission.reason || 'Usage limit exceeded',
            code: 'USAGE_LIMIT_EXCEEDED',
            details: {
              actionType: options.actionType,
              attemptedAmount: amount,
              remainingUsage: permission.remainingUsage || 0,
              warningLevel: permission.warningLevel,
              upgradeUrl: '/pricing',
            }
          }, { status: 403 });
        }

        // Add usage info to request headers for the handler
        const headers = new Headers(request.headers);
        headers.set('x-user-id', userId);
        headers.set('x-usage-amount', amount.toString());
        headers.set('x-remaining-usage', (permission.remainingUsage || 0).toString());
        headers.set('x-warning-level', permission.warningLevel || 'none');

        const requestWithHeaders = new NextRequest(request.url, {
          method: request.method,
          headers,
          body: request.body,
        });

        // Call the original handler
        const response = await handler(requestWithHeaders);

        // If the handler was successful, track the usage
        if (response.ok) {
          // Track usage asynchronously (don't wait for it)
          if (options.actionType === 'token') {
            import('@/lib/whop').then(({ whopService }) => {
              whopService.trackTokenUsage(userId, amount);
            });
          } else {
            import('@/lib/whop').then(({ whopService }) => {
              whopService.trackQuizCreation(userId);
            });
          }
        }

        return response;
      } catch (error: any) {
        console.error('❌ Usage enforcement error:', error);
        return NextResponse.json({
          error: 'Internal server error',
          code: 'ENFORCEMENT_ERROR',
          details: error.message
        }, { status: 500 });
      }
    };
  };
}

// Token estimation functions for different types of requests
export const tokenEstimators = {
  // Estimate tokens for quiz generation
  quizGeneration: (body: any): number => {
    const baseTokens = 1000; // Base cost for quiz generation
    const questionsCount = body.questionsCount || 10;
    const topicComplexity = body.topic?.length || 50;
    const difficultyMultiplier = {
      'easy': 1,
      'medium': 1.5,
      'hard': 2,
    }[body.difficulty] || 1;

    return Math.round(baseTokens + (questionsCount * 100) + (topicComplexity * 2) * difficultyMultiplier);
  },

  // Estimate tokens for explanation generation
  explanationGeneration: (body: any): number => {
    const baseTokens = 500;
    const contentLength = (body.content || '').length;
    const detailLevel = {
      'brief': 1,
      'detailed': 2,
      'comprehensive': 3,
    }[body.detailLevel] || 1;

    return Math.round(baseTokens + (contentLength * 0.5) * detailLevel);
  },

  // Estimate tokens for study guide generation
  studyGuideGeneration: (body: any): number => {
    const baseTokens = 1500;
    const topicComplexity = (body.topic || '').length;
    const sectionsCount = body.sections || 5;
    
    return Math.round(baseTokens + (topicComplexity * 3) + (sectionsCount * 200));
  },

  // Estimate tokens for document analysis
  documentAnalysis: (body: any): number => {
    const baseTokens = 800;
    const documentLength = (body.document || '').length;
    const analysisDepth = {
      'summary': 1,
      'detailed': 2,
      'comprehensive': 3,
    }[body.analysisType] || 1;

    return Math.round(baseTokens + (documentLength * 0.3) * analysisDepth);
  },
};

// Pre-configured middleware for common use cases
export const enforceQuizUsage = withUsageEnforcement({
  actionType: 'quiz',
  amount: 1,
});

export const enforceTokenUsage = (estimator: (body: any) => number) => 
  withUsageEnforcement({
    actionType: 'token',
    estimateTokens: estimator,
  });

export const enforceQuizGenerationUsage = withUsageEnforcement({
  actionType: 'token',
  estimateTokens: tokenEstimators.quizGeneration,
});

export const enforceExplanationUsage = withUsageEnforcement({
  actionType: 'token',
  estimateTokens: tokenEstimators.explanationGeneration,
});

export const enforceStudyGuideUsage = withUsageEnforcement({
  actionType: 'token',
  estimateTokens: tokenEstimators.studyGuideGeneration,
});

export const enforceDocumentAnalysisUsage = withUsageEnforcement({
  actionType: 'token',
  estimateTokens: tokenEstimators.documentAnalysis,
});