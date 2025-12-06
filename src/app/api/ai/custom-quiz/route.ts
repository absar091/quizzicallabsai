import { NextRequest, NextResponse } from 'next/server';
import { generateCustomQuizServer } from '@/ai/server-only';
import { auth } from '@/lib/firebase-admin';
import { trackTokenUsage } from '@/lib/usage';
import { checkTokenLimit } from '@/lib/check-limit';

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Quiz generation API called');

    const input = await request.json();
    
    // ✅ Get logged in user
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    const decoded = await auth.verifyIdToken(token);
    const userId = decoded.uid;

    // ✅ Check Limit
    const limitCheck = await checkTokenLimit(userId);
    if (!limitCheck.allowed) {
      // Send limit reached email notification (async, don't wait)
      if (limitCheck.limitReached) {
        fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/limit-reached`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ limitType: 'tokens' })
        }).catch(err => console.error('Failed to send limit email:', err));
      }

      return NextResponse.json(
        { 
          error: limitCheck.errorMessage || 'Your token limit has been reached.',
          code: 'LIMIT_REACHED',
          details: {
            planName: limitCheck.planName,
            tokensUsed: limitCheck.tokensUsed,
            tokensLimit: limitCheck.tokensLimit,
            resetDate: limitCheck.resetDate,
            upgradeUrl: limitCheck.upgradeUrl
          },
          remaining: limitCheck.remaining
        },
        { status: 402 }
      );
    }

    const { remaining } = limitCheck;

    console.log('📝 Input received:', {
      topic: input.topic,
      difficulty: input.difficulty,
      numberOfQuestions: input.numberOfQuestions,
      isPro: input.isPro,
      remaining
    });

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Quiz generation timed out after 2 minutes')), 120000);
    });

    const result = await Promise.race([
      generateCustomQuizServer(input),
      timeoutPromise
    ]);

    console.log('✅ Quiz generated successfully:', (result as any).quiz?.length, 'questions');

    // ✅ Track Usage - Use actual tokens from Gemini
    const resultData = result as any;
    const usedTokens = resultData.usedTokens || 0;
    const questionCount = resultData.quiz?.length || 0;
    
    if (usedTokens > 0) {
      await trackTokenUsage(userId, usedTokens);
      console.log(`✅ Quiz generated successfully, tracked ${usedTokens} actual tokens for ${questionCount} questions`);
    } else {
      console.warn('⚠️ No token usage data returned from Gemini');
    }

    // Track quiz creation if 15+ questions
    if (questionCount >= 15) {
      try {
        const { whopService } = await import('@/lib/whop');
        await whopService.trackQuizCreation(userId);
        console.log(`✅ Tracked quiz creation for user ${userId}`);
      } catch (error) {
        console.error('❌ Failed to track quiz creation:', error);
      }
    }

    return NextResponse.json({
      comprehensionText: resultData.comprehensionText,
      quiz: resultData.quiz,
      usage: usedTokens,
      remaining: remaining - usedTokens
    });
  } catch (error: any) {
    console.error('❌ Quiz generation API error:', error.message);
    console.error('Stack trace:', error.stack);

    // Provide more specific error messages
    let errorMessage = error.message || 'Failed to generate quiz';
    
    if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
      errorMessage = 'Quiz generation is taking longer than expected. Please try with fewer questions or try again later.';
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMessage = 'AI service is currently busy. Please wait a moment and try again.';
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      errorMessage = 'Network connection issue. Please check your internet connection and try again.';
    }

    return NextResponse.json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
