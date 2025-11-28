import { NextRequest, NextResponse } from "next/server";
import { generateFlashcards } from "@/ai/flows/generate-flashcards";
import { auth } from '@/lib/firebase-admin';
import { checkTokenLimit } from '@/lib/check-limit';

export async function POST(req: NextRequest) {
  try {
    console.log('🃏 Flashcards generation API called');

    // Get user from Firebase Auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    console.log('✅ User authenticated:', userId);

    const body = await req.json();
    console.log('📝 Input:', {
      topic: body.topic?.substring(0, 50),
      incorrectQuestionsCount: body.incorrectQuestions?.length,
      isPro: body.isPro
    });

    // Check token limit before generation
    const limitCheck = await checkTokenLimit(userId);
    if (!limitCheck.allowed) {
      console.log('❌ Token limit exceeded for user:', userId);
      return NextResponse.json(
        { error: 'Token limit exceeded. Please upgrade your plan or wait for your limit to reset.' },
        { status: 429 }
      );
    }

    console.log('✅ Token limit check passed');

    // Add timeout wrapper (90 seconds)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Flashcards generation timed out after 90 seconds')), 90000);
    });

    const result = await Promise.race([
      generateFlashcards({
        topic: body.topic,
        incorrectQuestions: body.incorrectQuestions,
        isPro: body.isPro || false
      }),
      timeoutPromise
    ]) as Awaited<ReturnType<typeof generateFlashcards>>;

    console.log('✅ Flashcards generated successfully:', result.flashcards?.length, 'cards');

    // Track token usage
    if (result.usedTokens && result.usedTokens > 0) {
      const { trackTokenUsage } = await import('@/lib/usage');
      await trackTokenUsage(userId, result.usedTokens);
      console.log(`✅ Tracked ${result.usedTokens} tokens for user ${userId}`);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ Flashcards API Error:", error);

    let errorMessage = error.message || "Failed to generate flashcards";

    // Provide more specific error messages
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      errorMessage = 'Flashcards generation is taking longer than expected. Please try again with fewer questions.';
    } else if (errorMessage.includes('quota') || errorMessage.includes('rate limit') || errorMessage.includes('exceeded')) {
      errorMessage = 'AI service quota exceeded. Please try again in a few minutes.';
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
      errorMessage = 'Network connection issue. Please check your internet and try again.';
    } else if (errorMessage.includes('not configured') || errorMessage.includes('not available')) {
      errorMessage = 'AI service is not configured. Please contact support.';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
