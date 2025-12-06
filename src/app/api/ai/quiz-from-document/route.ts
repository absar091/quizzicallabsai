import { NextRequest, NextResponse } from 'next/server';
import { generateQuizFromDocumentServer } from '@/ai/server-only';
import { auth } from '@/lib/firebase-admin';
import { trackTokenUsage } from '@/lib/usage';
import { checkTokenLimit } from '@/lib/check-limit';

export async function POST(request: NextRequest) {
  try {
    console.log('📄 Quiz from document generation API called');
    
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
    
    console.log('📝 Document quiz input:', { 
      hasDocument: !!body.documentDataUri, 
      documentLength: body.documentDataUri?.length,
      numberOfQuestions: body.numberOfQuestions,
      isPro: body.isPro,
      remaining
    });

    // Validate required fields
    if (!body.documentDataUri) {
      return NextResponse.json(
        { error: 'No document provided. Please upload a document to generate a quiz.' },
        { status: 400 }
      );
    }

    if (!body.numberOfQuestions || body.numberOfQuestions < 1 || body.numberOfQuestions > 55) {
      return NextResponse.json(
        { error: 'Number of questions must be between 1 and 55.' },
        { status: 400 }
      );
    }

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Document quiz generation timed out after 3 minutes')), 180000);
    });

    const result = await Promise.race([
      generateQuizFromDocumentServer(body),
      timeoutPromise
    ]);

    // ✅ Track Usage - Use actual tokens from Gemini (when flow is updated)
    const resultData = result as any;
    const usedTokens = resultData.usedTokens || 0;
    
    if (usedTokens > 0) {
      await trackTokenUsage(userId, usedTokens);
      console.log(`✅ Document quiz generated successfully: ${resultData.quiz?.length} questions, tracked ${usedTokens} tokens`);
    } else {
      console.warn('⚠️ No token usage data returned from Gemini');
    }
    
    return NextResponse.json({
      quiz: resultData.quiz,
      usage: usedTokens,
      remaining: remaining - usedTokens
    });
  } catch (error: any) {
    console.error('❌ Document quiz generation error:', error.message);
    
    let errorMessage = error.message || 'Failed to generate quiz from document';
    
    if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
      errorMessage = 'Document quiz generation is taking longer than expected. Please try with a shorter document or try again later.';
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
