import { NextRequest, NextResponse } from 'next/server';
import { ContentSafetyFilter } from '@/lib/content-safety-filter';

export async function POST(request: NextRequest) {
  try {
    const { content, subject } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const safetyCheck = ContentSafetyFilter.checkContent(content, subject);
    const safetyScore = ContentSafetyFilter.getSafetyScore(content);
    
    return NextResponse.json({
      isSafe: safetyCheck.isSafe,
      reason: safetyCheck.reason,
      suggestion: safetyCheck.suggestion,
      safetyScore,
      sanitizedContent: ContentSafetyFilter.sanitizeContent(content)
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check content safety' },
      { status: 500 }
    );
  }
}