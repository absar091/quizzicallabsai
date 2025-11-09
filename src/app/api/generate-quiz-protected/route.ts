import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { trackTokenUsage } from '@/lib/usage';
import { checkTokenLimit } from '@/lib/check-limit';

// Example of a protected API route that enforces usage limits
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { topic, difficulty, questionsCount } = body;
    
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
    
    const warningLevel = remaining < 10000 ? 'critical' : remaining < 25000 ? 'low' : 'normal';

    // Validate input
    if (!topic || !difficulty || !questionsCount) {
      return NextResponse.json({
        error: 'Missing required fields: topic, difficulty, questionsCount'
      }, { status: 400 });
    }

    // Your quiz generation logic here
    console.log(`🎯 Generating quiz for user ${userId}`);
    console.log(`📊 Remaining tokens: ${remaining}`);
    console.log(`⚠️ Warning level: ${warningLevel}`);

    // Simulate quiz generation
    const quiz = {
      id: `quiz_${Date.now()}`,
      topic,
      difficulty,
      questions: Array.from({ length: questionsCount }, (_, i) => ({
        id: i + 1,
        question: `Sample question ${i + 1} about ${topic}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
        explanation: `This is the explanation for question ${i + 1}`,
      })),
      createdAt: new Date().toISOString(),
    };

    // ✅ Track Usage - Estimate for demo (in real app, use actual tokens from Genkit)
    const estimatedTokens = questionsCount * 150 + 500;
    await trackTokenUsage(userId, estimatedTokens);
    console.log(`✅ Tracked ${estimatedTokens} tokens for quiz generation`);

    // Include usage info in response
    const response = {
      success: true,
      quiz,
      usage: {
        tokensUsed: estimatedTokens,
        remainingTokens: remaining - estimatedTokens,
        warningLevel,
        ...(warningLevel === 'critical' && {
          warning: 'You are approaching your token limit. Consider upgrading your plan.'
        }),
        ...(warningLevel === 'low' && {
          notice: 'You have used 75% of your monthly tokens.'
        }),
      }
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('❌ Quiz generation failed:', error);
    return NextResponse.json({
      error: 'Failed to generate quiz',
      details: error.message
    }, { status: 500 });
  }
}