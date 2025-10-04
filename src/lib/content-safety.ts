// Content safety utilities

export interface SafetyCheckResult {
  isSafe: boolean;
  reason?: string;
  confidence: number;
}

// Simple content safety patterns
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
  /\b(quiz|question|study|learn|exam|test|explain|diagram|process)\b/i,
];

export async function checkContentSafety(
  content: string, 
  context?: string
): Promise<SafetyCheckResult> {
  // Add context to content for better analysis
  const fullContent = context ? `${context}: ${content}` : content;
  
  // Check for educational context first
  const hasEducationalContext = EDUCATIONAL_EXCEPTIONS.some(pattern => 
    pattern.test(fullContent)
  );
  
  // Check for inappropriate patterns
  for (const pattern of INAPPROPRIATE_PATTERNS) {
    if (pattern.test(fullContent)) {
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
        reason: `Potentially inappropriate content detected`,
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