# Auth Token Fix Required for AI Features

## ✅ Fixed Files:
1. `src/app/(protected)/(main)/generate-quiz/page.tsx` - Quiz generation
2. `src/app/(protected)/(main)/generate-study-guide/page.tsx` - Study guide generation

## ⚠️ Files That Need Auth Token Added:

### High Priority (Main Features):
1. `src/app/(protected)/(main)/generate-from-file/page.tsx` - Quiz from document
2. `src/app/(protected)/(main)/image-to-explanation/page.tsx` - Image explanation
3. `src/app/(protected)/(main)/generate-paper/page.tsx` - Exam paper generation

### Medium Priority (Exam Prep):
4. `src/app/(protected)/(main)/nts/test/page.tsx` - NTS test
5. `src/app/(protected)/(main)/nts/mock-test/page.tsx` - NTS mock test
6. `src/app/(protected)/(main)/mdcat/test/page.tsx` - MDCAT test
7. `src/app/(protected)/(main)/mdcat/mock-test/page.tsx` - MDCAT mock test
8. `src/app/(protected)/(main)/ecat/test/page.tsx` - ECAT test
9. `src/app/(protected)/(main)/ecat/mock-test/page.tsx` - ECAT mock test

### Low Priority (Other):
10. `src/app/quiz-arena/page.tsx` - Quiz arena (3 instances)
11. `src/app/(protected)/(main)/dashboard/page.tsx` - Dashboard insights (already working, but should be consistent)

## How to Fix:

Add this code before the fetch call:

```typescript
// Get auth token
const { getAuth } = await import('firebase/auth');
const auth = getAuth();
const token = await auth.currentUser?.getIdToken();

if (!token) {
  throw new Error('Please sign in to use this feature');
}
```

Then update the headers:

```typescript
headers: { 
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
},
```

## Alternative: Use the API Client Utility

Import and use the helper function from `src/lib/api-client.ts`:

```typescript
import { postAI } from '@/lib/api-client';

const response = await postAI('/api/ai/custom-quiz', {
  ...values,
  isPro: user?.plan === 'Pro',
});
```

## Why This Is Important:

Without auth tokens, the API routes will:
- ❌ Return 401 Unauthorized
- ❌ Cannot check token limits
- ❌ Cannot track usage
- ❌ Cannot identify the user

With auth tokens:
- ✅ User is authenticated
- ✅ Token limits are checked
- ✅ Usage is tracked accurately
- ✅ Features work as expected
