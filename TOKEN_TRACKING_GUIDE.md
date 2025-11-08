# 🎯 Token Tracking & Estimation Guide

## Overview

This guide explains how token usage is tracked and estimated for different AI operations in the subscription system.

---

## 📊 Token Estimation Service

### Location
`src/lib/token-estimation.ts`

### Supported Operations

| Operation | Base Cost | Factors |
|-----------|-----------|---------|
| **Quiz Generation** | 1,000 | Questions, difficulty, explanations, hints |
| **Explanation** | 500 | Content length, detail level, examples |
| **Study Guide** | 1,500 | Topic, sections, depth, quizzes |
| **Document Analysis** | 800 | Document length, analysis type, questions |
| **Flashcard Generation** | 600 | Content, card count, images |
| **Question Generation** | 400 | Topic, question count, difficulty |
| **Simple Explanation** | 300 | Question + answer length |

---

## 🔢 Estimation Formulas

### Quiz Generation
```typescript
tokens = (1000 + topicComplexity + (questions * 100) + 
         (explanations * 50) + (hints * 30)) * difficultyMultiplier

Difficulty Multipliers:
- Easy: 1.0x
- Medium: 1.5x
- Hard: 2.0x
- Expert: 2.5x
```

**Example**:
- 10 questions, medium difficulty, with explanations
- Tokens: (1000 + 100 + 1000 + 500) * 1.5 = **3,900 tokens**

### Explanation Generation
```typescript
tokens = (500 + (contentLength * 0.5) + examples) * detailMultiplier

Detail Multipliers:
- Brief: 1.0x
- Standard: 1.5x
- Detailed: 2.0x
- Comprehensive: 3.0x
```

**Example**:
- 200 character content, detailed level, with examples
- Tokens: (500 + 100 + 200) * 2.0 = **1,600 tokens**

### Study Guide Generation
```typescript
tokens = (1500 + topicComplexity + (sections * 200) + quizzes) * depthMultiplier

Depth Multipliers:
- Overview: 1.0x
- Standard: 1.5x
- Comprehensive: 2.5x
```

**Example**:
- 5 sections, comprehensive depth, with quizzes
- Tokens: (1500 + 150 + 1000 + 500) * 2.5 = **7,875 tokens**

---

## 🛠️ Usage in Code

### 1. Estimate Before API Call

```typescript
import { TokenEstimationService } from '@/lib/token-estimation';

// Estimate quiz generation
const estimate = TokenEstimationService.estimateQuizGeneration({
  questionsCount: 10,
  topic: 'JavaScript Basics',
  difficulty: 'medium',
  includeExplanations: true,
  includeHints: false,
});

console.log(`Estimated tokens: ${estimate.estimated}`);
console.log('Factors:', estimate.factors);
```

### 2. Check Before Action

```typescript
import { useSubscription } from '@/hooks/useSubscription';
import { TokenEstimationService } from '@/lib/token-estimation';

function QuizGenerator() {
  const { canPerformAction, trackTokenUsage } = useSubscription();

  const generateQuiz = async (params) => {
    // Estimate tokens
    const estimate = TokenEstimationService.estimateQuizGeneration(params);
    
    // Check if user has enough tokens
    if (!canPerformAction('token', estimate.estimated)) {
      alert(`Not enough tokens! Need ${estimate.estimated}, but you don't have enough.`);
      return;
    }

    // Generate quiz
    const quiz = await generateQuizAPI(params);

    // Track actual usage
    await trackTokenUsage(estimate.estimated);
  };
}
```

### 3. Protect API Routes

```typescript
import { enforceTokenUsage, tokenEstimators } from '@/middleware/usage-enforcement';

async function generateQuizHandler(request: NextRequest) {
  // Token estimation and enforcement handled by middleware
  const tokensUsed = parseInt(request.headers.get('x-usage-amount') || '0');
  
  // Your quiz generation logic
  const quiz = await generateQuiz(body);

  return NextResponse.json({
    quiz,
    tokensUsed,
  });
}

// Apply middleware with token estimation
export const POST = enforceTokenUsage(tokenEstimators.quizGeneration)(generateQuizHandler);
```

---

## 📋 Middleware Integration

### Available Middleware

```typescript
import {
  enforceQuizGenerationUsage,
  enforceExplanationUsage,
  enforceStudyGuideUsage,
  enforceDocumentAnalysisUsage,
} from '@/middleware/usage-enforcement';

// Use pre-configured middleware
export const POST = enforceQuizGenerationUsage(handler);
```

### Custom Token Estimation

```typescript
import { enforceTokenUsage } from '@/middleware/usage-enforcement';

// Custom estimator
const customEstimator = (body: any) => {
  return body.complexity * 1000;
};

export const POST = enforceTokenUsage(customEstimator)(handler);
```

---

## 🎯 Real-World Examples

### Example 1: Quiz Generation API

```typescript
// src/app/api/generate-quiz/route.ts
import { enforceQuizGenerationUsage } from '@/middleware/usage-enforcement';
import { NextRequest, NextResponse } from 'next/server';

async function handler(request: NextRequest) {
  const body = await request.json();
  const tokensUsed = parseInt(request.headers.get('x-usage-amount') || '0');

  // Generate quiz using AI
  const quiz = await aiService.generateQuiz(body);

  return NextResponse.json({
    success: true,
    quiz,
    tokensUsed,
    remainingTokens: parseInt(request.headers.get('x-remaining-usage') || '0'),
  });
}

export const POST = enforceQuizGenerationUsage(handler);
```

### Example 2: Explanation API

```typescript
// src/app/api/generate-explanation/route.ts
import { enforceExplanationUsage } from '@/middleware/usage-enforcement';

async function handler(request: NextRequest) {
  const body = await request.json();
  
  const explanation = await aiService.generateExplanation({
    content: body.content,
    detailLevel: body.detailLevel,
  });

  return NextResponse.json({
    success: true,
    explanation,
    tokensUsed: parseInt(request.headers.get('x-usage-amount') || '0'),
  });
}

export const POST = enforceExplanationUsage(handler);
```

### Example 3: Frontend Usage

```typescript
// components/QuizGenerator.tsx
import { useSubscription } from '@/hooks/useSubscription';
import { TokenEstimationService } from '@/lib/token-estimation';
import { useState } from 'react';

export function QuizGenerator() {
  const { usage, canPerformAction, trackTokenUsage } = useSubscription();
  const [estimatedTokens, setEstimatedTokens] = useState(0);

  const handleParamsChange = (params) => {
    // Update estimate as user changes parameters
    const estimate = TokenEstimationService.estimateQuizGeneration(params);
    setEstimatedTokens(estimate.estimated);
  };

  const handleGenerate = async (params) => {
    // Check before generating
    if (!canPerformAction('token', estimatedTokens)) {
      alert('Not enough tokens! Please upgrade your plan.');
      return;
    }

    // Generate quiz
    const response = await fetch('/api/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (data.success) {
      // Usage is automatically tracked by middleware
      alert(`Quiz generated! Used ${data.tokensUsed} tokens.`);
    }
  };

  return (
    <div>
      <p>Estimated tokens: {estimatedTokens}</p>
      <p>Your remaining: {usage?.tokens_remaining || 0}</p>
      {/* Quiz form */}
    </div>
  );
}
```

---

## 📊 Token Usage Dashboard

### Display Token Estimates

```typescript
import { TokenEstimationService } from '@/lib/token-estimation';

function TokenCalculator() {
  const [params, setParams] = useState({
    questionsCount: 10,
    difficulty: 'medium',
  });

  const estimate = TokenEstimationService.estimateQuizGeneration(params);

  return (
    <div>
      <h3>Token Estimate: {estimate.estimated}</h3>
      <details>
        <summary>Breakdown</summary>
        <ul>
          {Object.entries(estimate.factors).map(([key, value]) => (
            <li key={key}>{key}: {value}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
```

---

## 🔍 Monitoring & Analytics

### Track Actual vs Estimated

```typescript
// Log for analytics
const estimate = TokenEstimationService.estimateQuizGeneration(params);
const actualTokens = await generateAndCountTokens(params);

// Log difference for improvement
console.log('Estimated:', estimate.estimated);
console.log('Actual:', actualTokens);
console.log('Accuracy:', (estimate.estimated / actualTokens * 100).toFixed(1) + '%');
```

### Monthly Usage Reports

```typescript
// Get user's monthly token usage
const usage = await whopService.getUserUsage(userId);

console.log(`Tokens used: ${usage.tokens_used} / ${usage.tokens_limit}`);
console.log(`Efficiency: ${(usage.tokens_used / usage.quizzes_used).toFixed(0)} tokens/quiz`);
```

---

## ⚙️ Configuration

### Adjust Base Costs

Edit `src/lib/token-estimation.ts`:

```typescript
private static readonly BASE_COSTS = {
  quiz_generation: 1000,  // Adjust this
  explanation: 500,       // Adjust this
  // ...
};
```

### Adjust Multipliers

```typescript
private static readonly DIFFICULTY_MULTIPLIERS = {
  easy: 1.0,    // Adjust this
  medium: 1.5,  // Adjust this
  hard: 2.0,    // Adjust this
};
```

---

## 🧪 Testing

### Test Token Estimation

```typescript
import { TokenEstimationService } from '@/lib/token-estimation';

describe('Token Estimation', () => {
  it('should estimate quiz generation correctly', () => {
    const estimate = TokenEstimationService.estimateQuizGeneration({
      questionsCount: 10,
      topic: 'Test',
      difficulty: 'medium',
    });

    expect(estimate.estimated).toBeGreaterThan(0);
    expect(estimate.operation).toBe('quiz_generation');
  });
});
```

---

## 📚 Best Practices

1. **Always estimate before API calls** - Show users expected cost
2. **Check limits before actions** - Prevent failed requests
3. **Track actual usage** - Use middleware for automatic tracking
4. **Display remaining tokens** - Keep users informed
5. **Provide upgrade prompts** - When approaching limits
6. **Log for analytics** - Improve estimation accuracy
7. **Cache estimates** - For repeated calculations

---

## 🚨 Common Issues

### Issue: Estimates Too High
**Solution**: Adjust base costs or multipliers in `token-estimation.ts`

### Issue: Estimates Too Low
**Solution**: Increase base costs or add complexity factors

### Issue: Usage Not Tracked
**Solution**: Ensure middleware is applied to API routes

### Issue: Limits Not Enforced
**Solution**: Check Firebase rules and middleware configuration

---

## 📞 Support

- **Token Estimation**: `src/lib/token-estimation.ts`
- **Middleware**: `src/middleware/usage-enforcement.ts`
- **Usage Hook**: `src/hooks/useSubscription.ts`
- **Documentation**: This file

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
