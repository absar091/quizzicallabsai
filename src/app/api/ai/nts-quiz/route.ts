import { NextRequest, NextResponse } from 'next/server';
import { generateNtsQuizServer } from '@/ai/server-only';
import { auth } from '@/lib/firebase-admin';
import { trackTokenUsage } from '@/lib/usage';
import { checkTokenLimit } from '@/lib/check-limit';

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 NTS quiz generation API called');
    
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

    // ✅ Check Limit
    const { allowed, remaining } = await checkTokenLimit(userId);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Your token limit is used up. Upgrade to continue.', remaining },
        { status: 402 }
      );
    }
    
    console.log('📝 NTS input:', { category: body.category, topic: body.topic?.substring(0, 50), remaining });

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('NTS quiz generation timed out after 2 minutes')), 120000);
    });

    const result = await Promise.race([
      generateNtsQuizServer(body),
      timeoutPromise
    ]);

    // ✅ Track Usage - Use actual tokens from Gemini (when flow is updated)
    const resultData = result as any;
    const usedTokens = resultData.usedTokens || 0;
    
    if (usedTokens > 0) {
      await trackTokenUsage(userId, usedTokens);
      console.log(`✅ NTS quiz generated successfully: ${resultData.quiz?.length} questions, tracked ${usedTokens} tokens`);
    } else {
      console.warn('⚠️ No token usage data returned from Gemini');
    }
    
    return NextResponse.json({
      quiz: resultData.quiz,
      usage: usedTokens,
      remaining: remaining - usedTokens
    });
  } catch (error: any) {
    console.error('❌ NTS quiz generation error:', error.message);
    
    let errorMessage = error.message || 'Failed to generate NTS quiz';
    
    if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
      errorMessage = 'NTS quiz generation is taking longer than expected. Please try with fewer questions or try again later.';
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMessage = 'AI service is currently busy. Please wait a moment and try again.';
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      errorMessage = 'Network connection issue. Please check your internet connection and try again.';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
