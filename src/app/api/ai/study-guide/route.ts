import { NextRequest, NextResponse } from 'next/server';
import { generateStudyGuideServer } from '@/ai/server-only';
import { auth } from '@/lib/firebase-admin';
import { trackTokenUsage } from '@/lib/usage';
import { checkTokenLimit } from '@/lib/check-limit';

export async function POST(request: NextRequest) {
  try {
    console.log('📚 Study guide generation API called');
    
    const body = await request.json();
    
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
    const userEmail = decoded.email || undefined;
    const userName = decoded.name || decoded.email?.split('@')[0] || undefined;

    // ✅ Check Limit
    const limitCheck = await checkTokenLimit(userId, userEmail, userName);
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

    console.log('📝 Study guide input:', { 
      topic: body.topic?.substring(0, 50), 
      isPro: body.isPro,
      remaining
    });

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Study guide generation timed out after 3 minutes')), 180000);
    });

    const result = await Promise.race([
      generateStudyGuideServer(body),
      timeoutPromise
    ]);

    // ✅ Track Usage - Use actual tokens from Gemini
    const resultData = result as any;
    const usedTokens = resultData.usedTokens || 0;
    
    if (usedTokens > 0) {
      await trackTokenUsage(userId, usedTokens);
      console.log(`✅ Study guide generated successfully, tracked ${usedTokens} actual tokens`);
    } else {
      console.warn('⚠️ No token usage data returned from Gemini');
    }
    
    return NextResponse.json({
      studyGuide: {
        title: resultData.title,
        summary: resultData.summary,
        keyConcepts: resultData.keyConcepts,
        analogies: resultData.analogies,
        quizYourself: resultData.quizYourself
      },
      usage: usedTokens,
      remaining: remaining - usedTokens
    });
  } catch (error: any) {
    console.error('❌ Study guide generation error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    let errorMessage = error.message || 'Failed to generate study guide';
    
    if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
      errorMessage = 'Study guide generation is taking longer than expected. Please try again later.';
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMessage = 'AI service is currently busy. Please wait a moment and try again.';
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      errorMessage = 'Network connection issue. Please check your internet connection and try again.';
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}