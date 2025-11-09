import { NextRequest, NextResponse } from 'next/server';
import { generateSimpleExplanationServer } from '@/ai/server-only';
import { auth } from '@/lib/firebase-admin';
import { trackTokenUsage } from '@/lib/usage';
import { checkTokenLimit } from '@/lib/check-limit';

export async function POST(request: NextRequest) {
  try {
    console.log('💡 Simple explanation API called');
    
    const body = await request.json();
    const { question, correctAnswer, topic, isPro } = body;
    
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
    
    console.log('📝 Simple explanation input:', { 
      question: question?.substring(0, 50), 
      topic: topic?.substring(0, 30),
      isPro,
      remaining
    });

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Simple explanation generation timed out after 45 seconds')), 45000);
    });

    const result = await Promise.race([
      generateSimpleExplanationServer({
        question,
        correctAnswer,
        topic,
        isPro
      }),
      timeoutPromise
    ]);

    // ✅ Track Usage - Use actual tokens from Gemini (when flow is updated)
    const resultData = result as any;
    const usedTokens = resultData.usedTokens || 0;
    
    if (usedTokens > 0) {
      await trackTokenUsage(userId, usedTokens);
      console.log(`✅ Simple explanation generated successfully, tracked ${usedTokens} tokens`);
    } else {
      console.warn('⚠️ No token usage data returned from Gemini');
    }
    
    return NextResponse.json({
      explanation: resultData.explanation,
      usage: usedTokens,
      remaining: remaining - usedTokens
    });
  } catch (error: any) {
    console.error('❌ Simple explanation error:', error.message);
    
    let errorMessage = error.message || 'Failed to generate simple explanation';
    
    if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
      errorMessage = 'Explanation generation is taking longer than expected. Please try again.';
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
