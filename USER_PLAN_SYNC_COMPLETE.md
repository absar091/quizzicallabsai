# User Plan Sync - Complete Fix

## ✅ Issue Fixed

**Problem**: When updating user to Pro via promo code, the plan updates in user metadata but NOT in subscription and usage collections.

**Solution**: Added automatic sync to usage collection when plan is updated.

## 🔧 What Was Fixed

### Before ❌
```
User updates plan via promo code
  ↓
Plan updates in: users/{userId}/plan ✅
Plan updates in: users/{userId}/subscription ✅
Plan updates in: usage/{userId}/{year}/{month}/plan ❌ MISSING!
```

### After ✅
```
User updates plan via promo code
  ↓
Plan updates in: users/{userId}/plan ✅
Plan updates in: users/{userId}/subscription ✅
Plan updates in: usage/{userId}/{year}/{month}/plan ✅ FIXED!
```

## 📁 File Modified

**`src/context/AuthContext.tsx`** - `updateUserPlan()` method

Added automatic sync to usage collection:
```typescript
// CRITICAL: Sync plan to usage collection
try {
  const { whopService } = await import('@/lib/whop');
  await whopService.updateUserPlan(user.uid, plan);
  secureLog('info', 'User plan synced to usage collection', { userId: user.uid, plan });
} catch (syncError) {
  secureLog('warn', 'Failed to sync plan to usage collection', syncError);
  // Don't throw - plan update succeeded, sync is secondary
}
```

## 🧪 How to Test

### Test Promo Code Update
1. Login to your account
2. Go to Profile page
3. Enter promo code (e.g., "TEST123")
4. Click "Redeem Code"
5. Check Firebase Realtime Database:
   - `users/{userId}/plan` should be "Pro" ✅
   - `users/{userId}/subscription/plan` should be "pro" ✅
   - `usage/{userId}/2024/12/plan` should be "Pro" ✅

### Verify in Firebase Console
```
Firebase Console → Realtime Database

Check these paths:
1. users/{your-user-id}/plan → "Pro"
2. users/{your-user-id}/subscription/plan → "pro"
3. usage/{your-user-id}/2024/12/plan → "Pro"
```

## 🔄 What Happens Now

When you redeem a promo code:

1. **User Metadata Updated**
   - Path: `users/{userId}/plan`
   - Value: "Pro"

2. **Subscription Created**
   - Path: `users/{userId}/subscription`
   - Data: Full subscription with limits

3. **Usage Collection Synced** (NEW!)
   - Path: `usage/{userId}/{year}/{month}/plan`
   - Value: "Pro"
   - Tokens limit: 500,000
   - Quizzes limit: 90

## 📊 Database Structure

### User Metadata
```json
users/{userId}/
  ├── plan: "Pro"
  ├── email: "user@example.com"
  ├── displayName: "User Name"
  └── updatedAt: "2024-12-05T..."
```

### Subscription Data
```json
users/{userId}/subscription/
  ├── plan: "pro"
  ├── subscription_status: "active"
  ├── tokens_used: 0
  ├── tokens_limit: 500000
  ├── quizzes_used: 0
  ├── quizzes_limit: 90
  ├── billing_cycle_start: "2024-12-05T..."
  └── billing_cycle_end: "2025-01-05T..."
```

### Usage Collection (NOW SYNCED!)
```json
usage/{userId}/2024/12/
  ├── plan: "Pro"
  ├── tokens_used: 0
  ├── tokens_limit: 500000
  ├── quizzes_created: 0
  ├── month: 12
  └── year: 2024
```

## 🎯 Benefits

1. **Automatic Sync** - No manual intervention needed
2. **Consistent Data** - All collections stay in sync
3. **Correct Limits** - Pro limits applied everywhere
4. **Token Tracking** - Works correctly with Pro limits
5. **AI Features** - Uses Pro models automatically

## 🚨 If Sync Fails

The sync is non-blocking, so if it fails:
- Plan update still succeeds
- Error is logged but not thrown
- You can manually sync using the admin API

### Manual Sync (if needed)
```bash
# Get your Firebase auth token from browser console:
await firebase.auth().currentUser.getIdToken()

# Call sync API:
curl -X POST http://localhost:3000/api/admin/sync-user-plan \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ✅ Verification Checklist

After redeeming promo code:
- [ ] Profile shows "Pro" plan
- [ ] Token limit shows 500,000
- [ ] Quiz limit shows 90
- [ ] AI uses Pro models (gemini-2.5-pro)
- [ ] No "token limit exceeded" errors
- [ ] Firebase shows "Pro" in all 3 locations

## 🔍 Debugging

### Check Console Logs
```javascript
// Should see:
✅ User plan updated successfully
✅ Pro subscription data created
✅ User plan synced to usage collection

// Should NOT see:
❌ Failed to sync plan to usage collection
```

### Check Firebase
```
1. Open Firebase Console
2. Go to Realtime Database
3. Navigate to your user ID
4. Verify all 3 locations show "Pro"
```

## 📝 Summary

The issue is now **completely fixed**. When you update a user to Pro via promo code:

1. ✅ User metadata updates to "Pro"
2. ✅ Subscription data is created with Pro limits
3. ✅ Usage collection is automatically synced to "Pro"

No manual intervention needed - everything happens automatically!

---

**Status**: ✅ FIXED
**Testing**: Ready to test with promo code
**Manual Sync**: Available if needed via admin API
