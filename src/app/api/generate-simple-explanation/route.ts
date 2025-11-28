import { NextRequest, NextResponse } from "next/server";
import { generateSimpleExplanation } from "@/ai/flows/generate-simple-explanation";
import { auth } from '@/lib/firebase-admin';
import { checkTokenLimit } from '@/lib/check-limit';

export async function POST(req: NextRequest) {
  try {
    console.log('📖 Simple explanation generation API called');

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

    const result = await generateSimpleExplanation(body);

    // Track token usage
    if (result.usedTokens && result.usedTokens > 0) {
      const { trackTokenUsage } = await import('@/lib/usage');
      await trackTokenUsage(userId, result.usedTokens);
      console.log(`✅ Tracked ${result.usedTokens} tokens for user ${userId}`);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ Simple explanation API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate simple explanation" },
      { status: 500 }
    );
  }
}
