import { NextRequest, NextResponse } from 'next/server';
import { enforceQuizGenerationUsage } from '@/middleware/usage-enforcement';

// Example of a protected API route that enforces usage limits
async function generateQuizHandler(request: NextRequest): Promise<NextResponse> {
  try {
    // Get user info from headers (added by middleware)
    const userId = request.headers.get('x-user-id');
    const usageAmount = parseInt(request.headers.get('x-usage-amount') || '0');
    const remainingUsage = parseInt(request.headers.get('x-remaining-usage') || '0');
    const warningLevel = request.headers.get('x-warning-level');

    const body = await request.json();
    const { topic, difficulty, questionsCount } = body;

    // Validate input
    if (!topic || !difficulty || !questionsCount) {
      return NextResponse.json({
        error: 'Missing required fields: topic, difficulty, questionsCount'
      }, { status: 400 });
    }

    // Your quiz generation logic here
    console.log(`🎯 Generating quiz for user ${userId}`);
    console.log(`📊 Token usage: ${usageAmount}, Remaining: ${remainingUsage}`);
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
      tokensUsed: usageAmount,
      createdAt: new Date().toISOString(),
    };

    // Include usage info in response
    const response = {
      success: true,
      quiz,
      usage: {
        tokensUsed: usageAmount,
        remainingTokens: remainingUsage,
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

// Export the protected handler
export const POST = enforceQuizGenerationUsage(generateQuizHandler);