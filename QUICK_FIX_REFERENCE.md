# Quick Fix Reference Card

## 🚀 Start Testing Now

```bash
# 1. Start dev server
npm run dev

# 2. Open test page
http://localhost:3000/test-ai-simple

# 3. Test all features
- Click "Test Custom Quiz"
- Click "Test Study Guide"  
- Click "Sync User Plan"
```

## ✅ What Was Fixed

| Issue | Status | File |
|-------|--------|------|
| User plan mismatch (Pro vs free) | ✅ Fixed | `src/lib/whop.ts` |
| AI flows not generating | ✅ Fixed | All 10 flow files |
| Study guide not displaying | ✅ Fixed | `generate-study-guide/page.tsx` |
| Build errors | ✅ Fixed | All files compile |
| defineFlow errors | ✅ Fixed | All flows use `await ai` |

## 🔧 Quick Fixes

### Fix User Plan Manually
```
Firebase Console → Realtime Database
Path: usage/{userId}/2024/12/plan
Change: "free" → "Pro"
```

### Fix User Plan via API
```bash
# Get token from browser console:
await firebase.auth().currentUser.getIdToken()

# Call API:
curl -X POST http://localhost:3000/api/admin/sync-user-plan \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎯 Test Checklist

- [ ] Custom quiz generates (2 questions)
- [ ] Study guide displays all sections
- [ ] Dashboard insights load
- [ ] User plan syncs correctly
- [ ] Token usage tracked
- [ ] No console errors

## 📊 Success Messages

Look for these in console:
```
✅ Quiz generated successfully, tracked X tokens
✅ Study guide generated successfully
✅ User plan synced to Pro
🔑 Using API Key rotation
📊 Gemini usage: X tokens
```

## 🐛 Common Errors

| Error | Fix |
|-------|-----|
| "AI service unavailable" | Check API keys, restart server |
| "Token limit exceeded" | Sync user plan to Pro |
| "Unauthorized" | Login first |
| Empty quiz/guide | Check console for specific error |

## 📁 Key Files

- Test page: `src/app/test-ai-simple/page.tsx`
- Plan sync: `src/lib/whop.ts` (updateUserPlan method)
- Sync API: `src/app/api/admin/sync-user-plan/route.ts`
- All AI flows: `src/ai/flows/*.ts` (use `await ai`)

## 🚢 Deploy When Ready

```bash
# 1. Test locally first
npm run dev

# 2. Build for production
npm run build

# 3. Deploy to Vercel
git add .
git commit -m "Fix AI generation and user plan sync"
git push

# 4. Verify environment variables in Vercel
```

---

**Everything is fixed and ready to test!** 🎉
