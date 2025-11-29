# 🐛 Bug Hunting Checklist

## ✅ Bugs Found & Fixed

### Bug #1: Pro Plan Not Recognized After Promo Code Redemption
- **Status:** FIXED ✅
- **Files:** `src/context/AuthContext.tsx`, `src/app/(protected)/(main)/profile/page.tsx`
- **Issue:** Plan updated in Firebase but not reloaded in app state
- **Fix:** Added force refresh and page reload

---

## 🔍 Areas to Check for Similar Bugs

### 1. State Synchronization Issues (Like Bug #1)
Check anywhere user data is updated but might not refresh:

**Locations to Check:**
- [ ] Profile updates (name, age, class) - Does UI update immediately?
- [ ] Email verification status - Does it refresh after verification?
- [ ] Bookmark additions - Do they show immediately?
- [ ] Quiz results saving - Does history update instantly?
- [ ] Study streak updates - Does it reflect immediately?

**How to Test:**
1. Update user data
2. Check if UI reflects changes without page reload
3. If not, add force refresh like we did for Pro plan

---

### 2. isPro/Plan Check Issues
Check all places where Pro features are gated:

**Files to Audit:**
```bash
# Search for isPro usage
grep -r "isPro" src/

# Search for plan checks
grep -r "user?.plan" src/
grep -r "plan === 'Pro'" src/
```

**Common Locations:**
- [ ] Quiz generation API calls
- [ ] Flashcard generation
- [ ] Study guide generation
- [ ] Bookmark features (whole quiz bookmarking)
- [ ] Export features
- [ ] Email features
- [ ] Advanced analytics

**What to Check:**
- Is `isPro` from `usePlan()` hook?
- Is it passed to API correctly?
- Does API respect the isPro flag?

---

### 3. Data Persistence Issues
Check if data saves to both Firebase AND IndexedDB:

**Locations:**
- [ ] Quiz results - Saves to both?
- [ ] Bookmarks - Syncs properly?
- [ ] User preferences - Persists?
- [ ] Quiz state - Resumes correctly?

**Test:**
1. Save data
2. Check Firebase console
3. Check IndexedDB (DevTools > Application > IndexedDB)
4. Reload page - does data persist?

---

### 4. Answer Encryption Issues
After implementing encryption, check:

**Locations:**
- [ ] Custom quiz - Answers encrypted?
- [ ] Practice questions - Answers encrypted?
- [ ] Mock tests - Answers encrypted?
- [ ] Shared quizzes - Answers encrypted?

**Test:**
1. Generate quiz
2. Open DevTools > Network
3. Check response - should see `_enc` field, NOT `correctAnswer`

---

### 5. Model Selection Issues
Check if correct AI model is used based on plan:

**Files:**
- `src/lib/getModel.ts`
- `src/lib/gemini-config.ts`
- All AI generation flows

**What to Check:**
- [ ] Free users get `gemini-2.5-flash`
- [ ] Pro users get `gemini-3-pro-preview`
- [ ] Fallback works if primary model fails
- [ ] Image models selected correctly

**Test:**
1. Generate quiz as Free user
2. Check console logs for model name
3. Upgrade to Pro
4. Generate quiz again
5. Should use different model

---

### 6. UI Update Issues
Check if UI updates immediately after actions:

**Common Issues:**
- [ ] Bookmark button doesn't toggle immediately
- [ ] Plan badge doesn't update after upgrade
- [ ] Quiz count doesn't increment after completion
- [ ] Streak doesn't update after quiz

**Pattern to Look For:**
```typescript
// BAD - Updates after reload
await updateData();
// User has to reload to see changes

// GOOD - Updates immediately
await updateData();
setState(newData); // Update local state immediately
```

---

### 7. API Authentication Issues
Check if all API calls include auth token:

**Pattern:**
```typescript
// Check all fetch calls have this:
const token = await auth.currentUser?.getIdToken();
headers: {
  'Authorization': `Bearer ${token}`
}
```

**Files to Check:**
- All files in `src/app/api/`
- All fetch calls in components

---

### 8. Error Handling Issues
Check if errors are handled gracefully:

**What to Check:**
- [ ] Network errors show user-friendly messages
- [ ] Failed API calls don't crash app
- [ ] Loading states reset after errors
- [ ] Users can retry after failures

---

### 9. Race Condition Issues
Check for timing-related bugs:

**Common Patterns:**
- [ ] Timer fires after quiz submitted
- [ ] Multiple simultaneous saves
- [ ] State updates during unmount
- [ ] Async operations not awaited

**Example from Bug #1:**
```typescript
// BAD - Race condition
setShowResults(true);
if (timerRef.current) clearInterval(timerRef.current);

// GOOD - Clear first
if (timerRef.current) clearInterval(timerRef.current);
setShowResults(true);
```

---

### 10. Prop Drilling Issues
Check if props are passed correctly through components:

**What to Check:**
- [ ] isPro passed to child components
- [ ] User data available in nested components
- [ ] Form values preserved across steps

---

## 🧪 Testing Checklist

### Test as Free User:
1. [ ] Generate quiz - should use free model
2. [ ] Try to bookmark whole quiz - should show Pro prompt
3. [ ] Check features - should see upgrade prompts
4. [ ] Redeem promo code - should upgrade to Pro
5. [ ] After upgrade - all Pro features should work

### Test as Pro User:
1. [ ] Generate quiz - should use Pro model
2. [ ] Bookmark whole quiz - should work
3. [ ] All Pro features accessible
4. [ ] No upgrade prompts shown
5. [ ] Better quality content generated

### Test Data Persistence:
1. [ ] Start quiz, close browser, reopen - should resume
2. [ ] Bookmark item, reload page - should still be bookmarked
3. [ ] Complete quiz, check Firebase - should be saved
4. [ ] Go offline, complete quiz - should save locally

### Test Error Scenarios:
1. [ ] Network offline - graceful degradation
2. [ ] Invalid API key - proper error message
3. [ ] Rate limit hit - user-friendly message
4. [ ] Timeout - retry option available

---

## 🔧 Quick Fix Patterns

### Pattern 1: State Not Updating
```typescript
// Add immediate state update + backend sync
const updateData = async () => {
  // Update UI immediately
  setState(newValue);
  
  // Then sync to backend
  await saveToFirebase(newValue);
};
```

### Pattern 2: Plan Not Recognized
```typescript
// Always use usePlan() hook
const { isPro, plan } = usePlan();

// NOT: user?.plan === 'Pro'
// YES: isPro
```

### Pattern 3: Missing Auth Token
```typescript
// Always include in API calls
const token = await auth.currentUser?.getIdToken();
if (!token) throw new Error('Not authenticated');

fetch('/api/endpoint', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 📝 How to Use This Checklist

1. **Go through each section systematically**
2. **Test each item manually**
3. **Check code for patterns mentioned**
4. **Fix issues using the patterns provided**
5. **Document any new bugs found**

---

## 🎯 Priority Order

1. **HIGH**: State synchronization (like Bug #1)
2. **HIGH**: isPro/Plan checks
3. **MEDIUM**: Data persistence
4. **MEDIUM**: UI updates
5. **LOW**: Error messages
6. **LOW**: Performance optimizations

---

*Last Updated: 2025*
*Bugs Fixed: 1*
*Status: Ongoing Audit*
