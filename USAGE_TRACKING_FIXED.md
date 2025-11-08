# ✅ Usage Tracking System - FIXED!

## 🔍 Problem Identified

**Token usage was NOT being tracked** when users generated quizzes and study guides.

### What Was Wrong:
- AI API routes were calling AI functions directly
- No token tracking after generation
- Usage counters stayed at 0
- Users could use unlimited AI features

---

## ✅ Solution Implemented

### 1. **Created Usage Tracking Middleware**
File: `src/middleware/track-ai-usage.ts`

**Features:**
- Automatically tracks token usage for all AI requests
- Estimates tokens from AI response
- Updates user's token counter in Firebase
- Logs usage for monitoring

### 2. **Updated AI API Routes**

**Study Guide API** (`/api/ai/study-guide`):
- ✅ Tracks tokens automatically
- ✅ Minimum 1000 tokens per study guide
- ✅ Estimates from output content

**Custom Quiz API** (`/api/ai/custom-quiz`):
- ✅ Tracks tokens automatically
- ✅ Minimum 500 tokens per quiz
- ✅ Tracks quiz creation if 15+ questions
- ✅ Estimates from quiz content

---

## 📊 New Usage Rules

### **Token Tracking:**
- ✅ **ALWAYS tracked** for every AI request
- ✅ Estimated from response content
- ✅ Includes input + output tokens
- ✅ Minimum tokens enforced

### **Quiz Counting:**
- ✅ **Only counted if 15+ questions**
- ✅ Small quizzes (< 15 questions) = FREE
- ✅ Still tracks tokens for all quizzes

### **Limit Enforcement:**
- ✅ **Block when tokens run out**
- ❌ **Don't block on quiz limit**
- ✅ Quiz limit is just a guideline

---

## 🧪 How It Works

### Example: User Generates Study Guide

1. **User requests study guide**
   ```
   POST /api/ai/study-guide
   Authorization: Bearer <token>
   ```

2. **AI generates content**
   ```
   Study guide created with:
   - Overview: 200 tokens
   - Key topics: 500 tokens
   - Study tips: 300 tokens
   Total: ~1200 tokens
   ```

3. **Middleware tracks usage**
   ```
   ✅ Tracked 1200 tokens for user abc123
   Updated: tokens_used: 0 → 1200
   ```

4. **User sees updated usage**
   ```
   Dashboard shows:
   Tokens: 1,200 / 100,000 (1.2% used)
   ```

### Example: User Generates Quiz (2 questions)

1. **User requests quiz**
   ```
   POST /api/ai/custom-quiz
   { numberOfQuestions: 2 }
   ```

2. **AI generates quiz**
   ```
   Quiz created with 2 questions
   Estimated: ~300 tokens
   ```

3. **Middleware tracks tokens**
   ```
   ✅ Tracked 500 tokens (minimum)
   ❌ Quiz NOT counted (< 15 questions)
   Updated: tokens_used: 1200 → 1700
   ```

4. **User sees**
   ```
   Tokens: 1,700 / 100,000 (1.7% used)
   Quizzes: 0 / 20 (not counted)
   ```

### Example: User Generates Quiz (20 questions)

1. **User requests quiz**
   ```
   POST /api/ai/custom-quiz
   { numberOfQuestions: 20 }
   ```

2. **AI generates quiz**
   ```
   Quiz created with 20 questions
   Estimated: ~2500 tokens
   ```

3. **Middleware tracks both**
   ```
   ✅ Tracked 2500 tokens
   ✅ Tracked 1 quiz (>= 15 questions)
   Updated: 
   - tokens_used: 1700 → 4200
   - quizzes_used: 0 → 1
   ```

4. **User sees**
   ```
   Tokens: 4,200 / 100,000 (4.2% used)
   Quizzes: 1 / 20 (5% used)
   ```

---

## 🚫 Limit Enforcement

### **When Tokens Run Out:**
```
User tries to generate content
→ Check: tokens_remaining < estimated_tokens
→ Block request
→ Show: "Insufficient tokens. Please upgrade your plan."
```

### **When Quiz Limit Reached:**
```
User tries to generate quiz (15+ questions)
→ Check: quizzes_remaining < 1
→ Allow if tokens available
→ Show warning: "You've reached your quiz limit"
→ Still tracks tokens
```

---

## 📋 Token Estimation

### **How Tokens Are Estimated:**

```typescript
// From quiz response
quiz.forEach(question => {
  tokens += estimateTokens(question.question)
  tokens += estimateTokens(question.explanation)
  tokens += estimateTokens(question.options)
})

// Add 20% for input tokens
totalTokens = tokens * 1.2
```

### **Minimum Tokens:**
- Study Guide: 1,000 tokens
- Quiz: 500 tokens
- Explanation: 200 tokens
- Flashcards: 300 tokens

---

## ✅ What's Fixed

- [x] Token usage now tracked for all AI requests
- [x] Study guides track tokens
- [x] Quizzes track tokens
- [x] Quiz counting only for 15+ questions
- [x] Users blocked when tokens run out
- [x] Usage displayed correctly in dashboard
- [x] Monthly usage tracked in Firebase

---

## 🧪 Testing

### Test Token Tracking:
1. Generate a study guide
2. Check Firebase: `usage/{userId}/2025/11/tokens_used`
3. Should show tokens used

### Test Quiz Counting:
1. Generate quiz with 2 questions
   - Tokens tracked ✅
   - Quiz NOT counted ✅
2. Generate quiz with 20 questions
   - Tokens tracked ✅
   - Quiz counted ✅

### Test Limit Enforcement:
1. Use up all tokens
2. Try to generate content
3. Should be blocked with error message

---

## 📊 Firebase Structure

```
users/
  {userId}/
    subscription/
      tokens_used: 4200
      tokens_limit: 100000
      quizzes_used: 1
      quizzes_limit: 20

usage/
  {userId}/
    2025/
      11/
        tokens_used: 4200
        quizzes_created: 1
        plan: "free"
```

---

## 🎯 Summary

**Before:**
- ❌ No token tracking
- ❌ Usage stayed at 0
- ❌ Unlimited AI usage

**After:**
- ✅ All AI requests tracked
- ✅ Tokens counted automatically
- ✅ Quiz counting for 15+ questions only
- ✅ Users blocked when tokens run out
- ✅ Fair usage enforcement

**Your usage tracking system is now working correctly!** 🎉
