import { NextRequest, NextResponse } from 'next/server';

// Simple content safety check - can be enhanced with external services
const INAPPROPRIATE_PATTERNS = [
  // Violence and harmful content
  /\b(kill|murder|suicide|self-harm|violence|weapon|bomb|terrorist)\b/i,
  // Adult content
  /\b(sex|porn|nude|adult|explicit)\b/i,
  // Hate speech
  /\b(hate|racist|nazi|supremacist)\b/i,
  // Illegal activities
  /\b(drug|illegal|hack|piracy|fraud)\b/i,
];

const EDUCATIONAL_EXCEPTIONS = [
  // Allow educational context
  /\b(history|historical|medical|scientific|educational|academic)\b/i,
  // Allow quiz/study context
  /\b(quiz|question|study|learn|exam|test)\b/i,
];

function checkContentSafety(content: string): {
  isSafe: boolean;
  reason?: string;
  confidence: number;
} {
  const lowerContent = content.toLowerCase();
  
  // Check for educational context first
  const hasEducationalContext = EDUCATIONAL_EXCEPTIONS.some(pattern => 
    pattern.test(content)
  );
  
  // Check for inappropriate patterns
  for (const pattern of INAPPROPRIATE_PATTERNS) {
    if (pattern.test(content)) {
      // If it's educational context, be more lenient
      if (hasEducationalContext) {
        return {
          isSafe: true,
          reason: 'Educational content detected',
          confidence: 0.7
        };
      }
      
      return {
        isSafe: false,
        reason: `Potentially inappropriate content detected: ${pattern.source}`,
        confidence: 0.8
      };
    }
  }
  
  // Additional checks for spam-like content
  if (content.length > 5000) {
    return {
      isSafe: false,
      reason: 'Content too long',
      confidence: 0.9
    };
  }
  
  // Check for excessive repetition
  const words = content.split(/\s+/);
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const repetitionRatio = uniqueWords.size / words.length;
  
  if (words.length > 50 && repetitionRatio < 0.3) {
    return {
      isSafe: false,
      reason: 'Excessive repetition detected',
      confidence: 0.7
    };
  }
  
  return {
    isSafe: true,
    confidence: 0.9
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, context } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    // Add context to content for better analysis
    const fullContent = context ? `${context}: ${content}` : content;
    
    const safetyCheck = checkContentSafety(fullContent);

    return NextResponse.json({
      success: true,
      isSafe: safetyCheck.isSafe,
      reason: safetyCheck.reason,
      confidence: safetyCheck.confidence,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Content safety check error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Safety check failed' },
      { status: 500 }
    );
  }
}

// Handle GET requests for testing
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Content safety check endpoint is active',
    patterns: INAPPROPRIATE_PATTERNS.length,
    timestamp: new Date().toISOString()
  });
}