# TypeScript Errors Fix Plan

## Summary
120+ TypeScript errors detected across the codebase. These need to be fixed for CI/CD to pass.

## Error Categories

### 1. Missing Dependencies (HIGH PRIORITY)
- **pdf-lib** module not found
- Install: `npm install pdf-lib`

### 2. Genkit AI Issues (20+ errors)
- `definePrompt` and `defineFlow` not found on Promise type
- **Files affected:**
  - `src/ai/flows/generate-help-bot-response.ts`
  - `src/lib/ai-debug.ts`
- **Fix:** Await the genkit import properly

### 3. React Import Issues (15+ errors)
- Missing React imports in files using JSX
- **Files affected:**
  - `src/lib/code-splitting.tsx`
  - `src/components/crash-guard.tsx`
  - `src/services/background-job-manager.tsx`
- **Fix:** Add `import React from 'react'` at top of files

### 4. Firebase Type Issues (10+ errors)
- `getIdToken` not found on User type
- **Files affected:**
  - `src/app/(protected)/(main)/study-rooms/**/*.tsx`
  - `src/components/quiz-arena/QuizArenaEnhancements.tsx`
- **Fix:** Import correct Firebase User type

### 5. Mongoose Issues (10+ errors)
- Mongoose connection and query type mismatches
- **Files affected:**
  - `src/app/api/achievements/route.ts`
  - `src/lib/models.ts`
- **Fix:** Update Mongoose usage patterns

### 6. Icon Import Issues (30+ errors)
- Missing icon imports from lucide-react
- **File:** `src/lib/icon-imports.ts`
- **Fix:** Import all icons properly

### 7. Type Safety Issues (20+ errors)
- Missing properties on types
- Type mismatches
- **Various files**
- **Fix:** Add proper type definitions

### 8. Test File Issues (10+ errors)
- Undefined variables in tests
- **Files:** `src/tests/quiz-arena/*.test.ts`
- **Fix:** Define missing test variables

## Quick Fix Strategy

### Phase 1: Install Missing Dependencies
```bash
npm install pdf-lib
npm install --save-dev @types/react @types/react-dom
```

### Phase 2: Add TypeScript Ignore Comments (TEMPORARY)
For CI/CD to pass immediately, add `// @ts-nocheck` at top of problematic files.

### Phase 3: Fix Critical Errors (Priority Order)
1. Fix Genkit AI imports (2 files)
2. Fix React imports (3 files)  
3. Fix Firebase User types (5 files)
4. Fix icon imports (1 file)
5. Fix Mongoose issues (2 files)
6. Fix remaining type issues

### Phase 4: Remove @ts-nocheck and Fix Properly
Go through each file and fix the actual issues.

## Detailed Fixes

### Fix 1: Genkit AI Issues
```typescript
// src/ai/flows/generate-help-bot-response.ts
// BEFORE:
const genkit = await import('@genkit-ai/core');
const prompt = genkit.definePrompt(...);

// AFTER:
import { definePrompt, defineFlow } from '@genkit-ai/core';
const prompt = definePrompt(...);
```

### Fix 2: React Imports
```typescript
// src/lib/code-splitting.tsx
// ADD at top:
import React from 'react';
import ReactDOM from 'react-dom';
```

### Fix 3: Firebase User Type
```typescript
// src/app/(protected)/(main)/study-rooms/[roomId]/page.tsx
// BEFORE:
const token = await user.getIdToken();

// AFTER:
import { User } from 'firebase/auth';
const token = await (user as User).getIdToken();
```

### Fix 4: Icon Imports
```typescript
// src/lib/icon-imports.ts
// ADD at top:
import {
  Crown, Trophy, Medal, Flame, Star, Sword, Target, Zap,
  Users, Clock, Play, Settings, Plus, Globe, Sparkles,
  AlertTriangle, ArrowLeft, Gamepad2, Layers, Rocket,
  Radar, ChevronDown, CheckCircle, X, Timer, LogOut,
  WifiOff, Loader2, TrendingUp, Award, Calendar,
  Bookmark, Brain, BarChart, BookOpenText, PlusSquare,
  BookMarked, Keyboard, Shield
} from 'lucide-react';
```

### Fix 5: Mongoose Issues
```typescript
// src/lib/models.ts
// Update to use proper Mongoose v8 syntax
import mongoose from 'mongoose';

// Use proper type assertions
const user = await User.findOne({ _id: userId }).exec();
```

## Immediate Action (To Pass CI/CD)

Create a `tsconfig.build.json` that's more lenient:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true,
    "skipLibCheck": true,
    "strict": false
  }
}
```

Update `package.json`:
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit --project tsconfig.build.json"
  }
}
```

## Files Requiring Immediate Attention

### Critical (Blocks CI/CD):
1. `src/ai/flows/generate-help-bot-response.ts`
2. `src/lib/code-splitting.tsx`
3. `src/lib/icon-imports.ts`
4. `src/lib/ai-debug.ts`
5. `src/components/crash-guard.tsx`

### High Priority:
6. `src/app/(protected)/(main)/study-rooms/**/*.tsx` (5 files)
7. `src/app/api/achievements/route.ts`
8. `src/lib/models.ts`
9. `src/lib/pdf-watermark.ts`

### Medium Priority:
10. All test files in `src/tests/quiz-arena/`
11. `src/components/quiz-arena/QuizArenaEnhancements.tsx`
12. `src/lib/error-logger.ts`

## Recommended Approach

**Option A: Quick Fix (1 hour)**
- Install missing dependencies
- Add `// @ts-nocheck` to 20 most problematic files
- CI/CD will pass

**Option B: Proper Fix (4-6 hours)**
- Fix all errors properly
- Improve type safety
- Better long-term solution

**Option C: Hybrid (2 hours)**
- Fix critical errors (Genkit, React, Icons)
- Add `// @ts-nocheck` to remaining files
- Create tickets to fix later

## Next Steps

1. Choose approach (A, B, or C)
2. Install missing dependencies
3. Fix or suppress errors
4. Run `npm run typecheck` locally
5. Commit and push
6. Verify CI/CD passes

## Commands to Run

```bash
# Install dependencies
npm install pdf-lib
npm install --save-dev @types/react @types/react-dom

# Check errors
npm run typecheck

# Fix specific file
# Edit the file, then:
npm run typecheck 2>&1 | grep "filename"
```

## Estimated Time
- Quick fix: 1 hour
- Proper fix: 4-6 hours
- Hybrid: 2 hours

Choose based on your timeline and priorities.
