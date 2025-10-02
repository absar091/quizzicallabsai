import { NextResponse } from "next/server";
import { generateFlashcards } from "@/ai/flows/generate-flashcards";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('🃏 Flashcards generation API called');
    console.log('📝 Input:', {
      topic: body.topic?.substring(0, 50),
      incorrectQuestionsCount: body.incorrectQuestions?.length,
      isPro: body.isPro
    });

    // Add timeout wrapper (90 seconds)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Flashcards generation timed out after 90 seconds')), 90000);
    });

    const result = await Promise.race([
      generateFlashcards({
        topic: body.topic,
        incorrectQuestions: body.incorrectQuestions,
        isPro: body.isPro || false
      }),
      timeoutPromise
    ]);

    console.log('✅ Flashcards generated successfully:', result.flashcards?.length, 'cards');
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
