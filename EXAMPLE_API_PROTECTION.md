# Example: How to Protect Your API Routes

This document shows you how to apply authentication and rate limiting to your existing API routes.

---

## BEFORE: Unprotected API Route

**File:** `src/app/api/ai/custom-quiz/route.ts` (Current State)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateCustomQuizServer } from '@/ai/server-only';

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Quiz generation API called');

    const input = await request.json();
    console.log('📝 Input received:', {
      topic: input.topic,
      difficulty: input.difficulty,
      numberOfQuestions: input.numberOfQuestions,
      isPro: input.isPro
    });

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Quiz generation timed out after 2 minutes')), 120000);
    });

    const result = await Promise.race([
      generateCustomQuizServer(input),
      timeoutPromise
    ]);

    console.log('✅ Quiz generated successfully:', result.quiz?.length, 'questions');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Quiz generation API error:', error.message);
    // ... error handling
  }
}
```

### Problems:
- ❌ No authentication - anyone can call this API
- ❌ No rate limiting - can be abused
- ❌ No user tracking - can't enforce free/pro limits
- ❌ No security headers

---

## AFTER: Protected API Route

**File:** `src/app/api/ai/custom-quiz/route.ts` (Recommended)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndRateLimit, RateLimitPresets } from '@/lib/api-rate-limiter';
import { generateCustomQuizServer } from '@/ai/server-only';

/**
 * POST /api/ai/custom-quiz
 * Generate a custom quiz based on topic and parameters
 *
 * @protected Requires authentication
 * @rateLimit 10 requests per minute
 */
export const POST = withAuthAndRateLimit(
  RateLimitPresets.AI_GENERATION, // 10 requests/minute
  true, // auth required
  async (request: NextRequest, user: any) => {
    try {
      console.log('🎯 Quiz generation API called by:', user.email);

      const input = await request.json();
      console.log('📝 Input received:', {
        topic: input.topic,
        difficulty: input.difficulty,
        numberOfQuestions: input.numberOfQuestions,
        isPro: input.isPro,
        userId: user.uid // Now we know who's making the request!
      });

      // Add user ID to input for tracking
      const enrichedInput = {
        ...input,
        userId: user.uid,
        userEmail: user.email,
      };

      // Add timeout wrapper
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Quiz generation timed out after 2 minutes')), 120000);
      });

      const result = await Promise.race([
        generateCustomQuizServer(enrichedInput),
        timeoutPromise
      ]);

      console.log('✅ Quiz generated successfully:', result.quiz?.length, 'questions');

      return NextResponse.json(result);
    } catch (error: any) {
      console.error('❌ Quiz generation API error:', error.message);
      console.error('User:', user.email);

      // Provide more specific error messages
      let errorMessage = error.message || 'Failed to generate quiz';

      if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
        errorMessage = 'Quiz generation is taking longer than expected. Please try with fewer questions or try again later.';
      } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
        errorMessage = 'AI service is currently busy. Please wait a moment and try again.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Network connection issue. Please check your internet connection and try again.';
      }

      return NextResponse.json({
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, { status: 500 });
    }
  }
);
```

### Benefits:
- ✅ **Authentication Required** - Only logged-in users can access
- ✅ **Rate Limited** - Max 10 requests per minute (prevents abuse)
- ✅ **User Tracking** - Know who's using the API
- ✅ **Rate Limit Headers** - Client knows how many requests remaining
- ✅ **Automatic 401 Response** - If no auth token or invalid token
- ✅ **Automatic 429 Response** - If rate limit exceeded

---

## What Changed?

### 1. Added Imports
```typescript
import { withAuthAndRateLimit, RateLimitPresets } from '@/lib/api-rate-limiter';
```

### 2. Changed Export Style
```typescript
// Before:
export async function POST(request: NextRequest) {

// After:
export const POST = withAuthAndRateLimit(
  RateLimitPresets.AI_GENERATION,
  true,
  async (request: NextRequest, user: any) => {
```

### 3. Added User Parameter
Now you have access to `user` object:
```typescript
user.uid          // User ID
user.email        // User email
user.emailVerified // Whether email is verified
user.displayName  // Display name
user.photoURL     // Profile photo URL
```

### 4. Automatic Headers Added
Every response now includes:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 2025-09-30T12:34:56.789Z
```

---

## Rate Limit Presets Available

Choose the right preset for your API:

```typescript
// For expensive AI operations (10 req/min)
RateLimitPresets.AI_GENERATION

// For standard API calls (100 req/min)
RateLimitPresets.API_STANDARD

// For read-only operations (300 req/min)
RateLimitPresets.API_READ

// For authentication attempts (5 req/15min)
RateLimitPresets.AUTH

// For free tier users (50 req/day)
RateLimitPresets.FREE_TIER

// For pro tier users (1000 req/day)
RateLimitPresets.PRO_TIER
```

---

## Custom Rate Limit

If presets don't fit your needs:

```typescript
export const POST = withAuthAndRateLimit(
  {
    maxRequests: 20,
    windowMs: 60 * 1000, // 1 minute
    keyPrefix: 'my-api',
  },
  true, // auth required
  async (request, user) => {
    // Your handler
  }
);
```

---

## Optional Authentication

Some APIs need to work for both authenticated and anonymous users:

```typescript
import { withAuthAndRateLimit } from '@/lib/api-rate-limiter';

export const GET = withAuthAndRateLimit(
  RateLimitPresets.API_READ,
  false, // auth NOT required
  async (request: NextRequest, user?: any) => {
    if (user) {
      // User is logged in - provide personalized data
      console.log('Authenticated request from:', user.email);
    } else {
      // Anonymous user - provide public data only
      console.log('Anonymous request');
    }

    // Your handler
  }
);
```

---

## Client-Side Usage

### Before (Unprotected)
```typescript
const response = await fetch('/api/ai/custom-quiz', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ topic, difficulty })
});
```

### After (Protected)
```typescript
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const user = auth.currentUser;

if (!user) {
  console.error('User not logged in');
  return;
}

const token = await user.getIdToken();

const response = await fetch('/api/ai/custom-quiz', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, // Add this!
  },
  body: JSON.stringify({ topic, difficulty })
});

// Check rate limit headers
const remaining = response.headers.get('X-RateLimit-Remaining');
console.log('Requests remaining:', remaining);

if (response.status === 429) {
  console.error('Rate limit exceeded');
  const retryAfter = response.headers.get('Retry-After');
  console.log('Retry after:', retryAfter, 'seconds');
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "No authorization token provided"
}
```

### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later.",
  "retryAfter": 45
}
```

Headers:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2025-09-30T12:34:56.789Z
Retry-After: 45
```

---

## Apply to All AI Routes

You need to update these files:

### High Priority (Expensive Operations)
1. ✅ `src/app/api/ai/custom-quiz/route.ts` - Example above
2. ⚠️ `src/app/api/ai/quiz-from-document/route.ts`
3. ⚠️ `src/app/api/ai/study-guide/route.ts`
4. ⚠️ `src/app/api/ai/flashcards/route.ts`
5. ⚠️ `src/app/api/ai/explain-image/route.ts`

Use: `RateLimitPresets.AI_GENERATION` (10 req/min)

### Medium Priority (Standard Operations)
6. ⚠️ `src/app/api/quiz-arena/*/route.ts` (all arena routes)
7. ✅ `src/app/api/achievements/route.ts` - Already protected
8. ✅ `src/app/api/study-rooms/route.ts` - Already protected

Use: `RateLimitPresets.API_STANDARD` (100 req/min)

### Low Priority (Read Operations)
9. ⚠️ User profile GET endpoints
10. ⚠️ Stats/analytics GET endpoints

Use: `RateLimitPresets.API_READ` (300 req/min)

---

## Testing

### Test Authentication
```bash
# Should return 401
curl -X POST http://localhost:3000/api/ai/custom-quiz \
  -H "Content-Type: application/json" \
  -d '{"topic": "Biology"}'

# Should return 200
curl -X POST http://localhost:3000/api/ai/custom-quiz \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{"topic": "Biology"}'
```

### Test Rate Limiting
```bash
# Make 11 requests quickly - 11th should return 429
for i in {1..11}; do
  curl -X POST http://localhost:3000/api/ai/custom-quiz \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
    -d '{"topic": "Biology"}' \
    -w "\nStatus: %{http_code}\n"
done
```

---

## Checklist

Before deploying:

- [ ] Updated all AI generation routes with auth + rate limiting
- [ ] Updated all Quiz Arena routes with auth
- [ ] Updated all user data routes with auth
- [ ] Tested authentication (401 for missing token)
- [ ] Tested rate limiting (429 after limit exceeded)
- [ ] Updated client code to send Authorization header
- [ ] Checked rate limit headers in browser dev tools
- [ ] Documented any custom rate limits

---

## Summary

**3 Simple Steps:**

1. **Import the wrapper**
   ```typescript
   import { withAuthAndRateLimit, RateLimitPresets } from '@/lib/api-rate-limiter';
   ```

2. **Wrap your handler**
   ```typescript
   export const POST = withAuthAndRateLimit(
     RateLimitPresets.AI_GENERATION,
     true,
     async (request, user) => { /* your code */ }
   );
   ```

3. **Use the user object**
   ```typescript
   console.log('Request from:', user.email);
   ```

That's it! Your API is now secured. 🔒

---

**Estimated Time:** 5 minutes per API route
**Total Routes to Update:** ~15-20
**Total Time:** 1.5-2 hours

**Benefits:**
- 🔒 Prevents unauthorized access
- 🛡️ Prevents API abuse
- 📊 Tracks usage per user
- 💰 Enforces free/pro limits
- 🚀 Production-ready security