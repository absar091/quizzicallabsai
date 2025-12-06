# Promo Code System Testing Guide

## Overview

Your application already has a working promo code system implemented in the Profile page. This guide will help you test it thoroughly.

## Current Implementation

### Location
- **File**: `src/app/(protected)/(main)/profile/page.tsx`
- **Function**: `handleRedeemCode()`
- **Environment Variable**: `NEXT_PUBLIC_PRO_ACCESS_CODES`

### Available Promo Codes (from .env.local)
```
QUIZPRO2024
STUDYHARD
AILEARNER
EXAMACE
PROUSER123
UPGRADE2024
SMARTSTUDY
QUIZMASTER
LEARNFAST
STUDYPRO
TEST123 (hardcoded for testing)
```

### How It Works

1. User enters a promo code in the Profile page
2. Code is validated against `NEXT_PUBLIC_PRO_ACCESS_CODES` environment variable
3. If valid, `updateUserPlan('Pro')` is called
4. User's plan is updated in Firebase Realtime Database
5. Subscription data is updated with Pro limits:
   - **Tokens**: 500,000
   - **Quizzes**: 90
6. Page reloads to reflect new Pro status

## Testing Checklist

### ✅ Pre-Testing Setup

1. **Verify Environment Variables**
   ```bash
   # Check that .env.local has the promo codes
   cat .env.local | grep PRO_ACCESS_CODES
   ```

2. **Check Firebase Connection**
   - Ensure Firebase is connected
   - Verify you can read/write to the database

3. **Create Test User**
   - Sign up with a test email
   - Verify user is on Free plan

### ✅ Test Case 1: Valid Promo Code Redemption

**Steps:**
1. Log in with a Free plan user
2. Navigate to Profile page (`/profile`)
3. Scroll to "Subscription" section
4. Enter a valid code (e.g., `QUIZPRO2024`)
5. Click "Redeem" button

**Expected Results:**
- ✅ Success toast appears: "Success! 🎉 You've been upgraded to Pro!"
- ✅ Page reloads after 2 seconds
- ✅ User badge shows "Pro Plan" with sparkles icon
- ✅ Subscription section shows "Manage" button instead of "Upgrade to Pro"
- ✅ Firebase database updated:
  - `/users/{userId}/plan` = "Pro"
  - `/users/{userId}/subscription/plan` = "pro"
  - `/users/{userId}/subscription/tokens_limit` = 500000
  - `/users/{userId}/subscription/quizzes_limit` = 90

**How to Verify in Firebase:**
1. Go to Firebase Console
2. Navigate to Realtime Database
3. Find your user under `/users/{userId}`
4. Check the `plan` and `subscription` fields

### ✅ Test Case 2: Invalid Promo Code

**Steps:**
1. Log in with a Free plan user
2. Navigate to Profile page
3. Enter an invalid code (e.g., `INVALID123`)
4. Click "Redeem" button

**Expected Results:**
- ✅ Error toast appears: "Invalid Code - The code you entered is not valid"
- ✅ User remains on Free plan
- ✅ No database changes

### ✅ Test Case 3: Empty Code

**Steps:**
1. Navigate to Profile page
2. Leave code input empty
3. Click "Redeem" button

**Expected Results:**
- ✅ Error toast appears: "Please enter a code."
- ✅ No database changes

### ✅ Test Case 4: Already Pro User

**Steps:**
1. Log in with a Pro plan user (or use a code to upgrade first)
2. Navigate to Profile page

**Expected Results:**
- ✅ Promo code input section is NOT visible
- ✅ "Manage" button is shown instead
- ✅ Pro badge with sparkles icon is displayed

### ✅ Test Case 5: Case Insensitivity

**Steps:**
1. Log in with a Free plan user
2. Enter code in lowercase (e.g., `quizpro2024`)
3. Click "Redeem" button

**Expected Results:**
- ✅ Code is accepted (converted to uppercase internally)
- ✅ User is upgraded to Pro

### ✅ Test Case 6: Whitespace Handling

**Steps:**
1. Log in with a Free plan user
2. Enter code with spaces (e.g., ` QUIZPRO2024 `)
3. Click "Redeem" button

**Expected Results:**
- ✅ Code is accepted (whitespace trimmed)
- ✅ User is upgraded to Pro

### ✅ Test Case 7: Multiple Redemptions

**Steps:**
1. Upgrade to Pro using a code
2. Try to redeem another code

**Expected Results:**
- ✅ Promo code input is hidden (user is already Pro)
- ✅ Cannot redeem multiple codes

### ✅ Test Case 8: UI State During Redemption

**Steps:**
1. Enter a valid code
2. Click "Redeem" button
3. Observe button state

**Expected Results:**
- ✅ Button shows "Redeeming..." while processing
- ✅ Button is disabled during redemption
- ✅ Input is still visible

### ✅ Test Case 9: Page Reload After Upgrade

**Steps:**
1. Redeem a valid code
2. Wait for page reload

**Expected Results:**
- ✅ Page reloads automatically after 2 seconds
- ✅ All components recognize Pro status
- ✅ Navigation shows Pro features
- ✅ Usage limits reflect Pro tier

### ✅ Test Case 10: Console Logging

**Steps:**
1. Open browser DevTools Console
2. Redeem a code

**Expected Results:**
- ✅ Console shows: "Available codes: [array of codes]"
- ✅ Console shows: "Entered code: [YOUR_CODE]"
- ✅ Console shows: "Current user plan: [Free/Pro]"
- ✅ Console shows: "User object: [user data]"

## Manual Testing Script

Run this in your browser console after logging in:

```javascript
// Test 1: Check available codes
console.log('Available codes:', process.env.NEXT_PUBLIC_PRO_ACCESS_CODES);

// Test 2: Check current plan
const checkPlan = async () => {
  const { getAuth } = await import('firebase/auth');
  const { ref, get } = await import('firebase/database');
  const { database } = await import('@/lib/firebase');
  
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (user) {
    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);
    console.log('User data:', snapshot.val());
  }
};

checkPlan();
```

## Known Issues & Limitations

### Current Limitations

1. **No Usage Tracking**: Codes can't track how many times they've been used
2. **No Expiration**: Codes don't expire
3. **No Database Storage**: Codes are only in environment variables
4. **No Admin Management**: Can't create/deactivate codes without redeploying
5. **No Redemption History**: Can't see who redeemed which code
6. **Single Use Per User**: Users can only redeem one code (because input disappears after Pro)

### Comparison with Spec Requirements

Your current implementation covers:
- ✅ Basic promo code validation
- ✅ Plan activation
- ✅ Token limit updates
- ✅ UI feedback

Missing from spec (Tasks 4-22):
- ❌ Promo code database in Firebase
- ❌ Usage tracking and limits
- ❌ Expiration dates
- ❌ Admin management APIs
- ❌ Redemption history
- ❌ Webhook integration for Whop
- ❌ Real-time status polling
- ❌ Comprehensive error logging

## Next Steps

### Option 1: Keep Current Simple System
If your current system works for your needs:
- ✅ Simple and fast
- ✅ No database overhead
- ✅ Easy to manage in .env
- ❌ Limited features
- ❌ No analytics

### Option 2: Implement Full Spec
Continue with tasks 4-22 to add:
- Database-backed promo codes
- Usage limits and expiration
- Admin management interface
- Redemption tracking
- Integration with Whop webhooks

## Testing Commands

### Start Development Server
```bash
npm run dev
```

### Check Environment Variables
```bash
# Windows
echo %NEXT_PUBLIC_PRO_ACCESS_CODES%

# Or check in code
console.log(process.env.NEXT_PUBLIC_PRO_ACCESS_CODES)
```

### View Firebase Data
1. Go to: https://console.firebase.google.com/
2. Select your project: quizzicallabs
3. Navigate to: Realtime Database
4. Browse to: `/users/{userId}`

## Troubleshooting

### Issue: Code Not Working

**Check:**
1. Is the code in `NEXT_PUBLIC_PRO_ACCESS_CODES`?
2. Is it spelled correctly (case-sensitive in .env)?
3. Did you restart the dev server after changing .env?
4. Check browser console for errors

### Issue: Plan Not Updating

**Check:**
1. Firebase connection working?
2. User authenticated?
3. Check Firebase Console for actual data
4. Check browser console for errors

### Issue: Page Not Reloading

**Check:**
1. Browser console for errors
2. Try manual refresh
3. Check if `window.location.reload()` is being called

### Issue: Pro Features Not Showing

**Check:**
1. Did page reload after upgrade?
2. Check `usePlan()` hook is working
3. Verify Firebase data is correct
4. Try logging out and back in

## Success Criteria

Your promo code system is working correctly if:

1. ✅ Valid codes upgrade users to Pro
2. ✅ Invalid codes show error messages
3. ✅ Firebase data is updated correctly
4. ✅ Pro features become available immediately
5. ✅ Token limits are set to 500,000
6. ✅ Quiz limits are set to 90
7. ✅ UI reflects Pro status
8. ✅ No console errors

## Contact

If you encounter issues:
- Check Firebase Console for data
- Check browser DevTools Console for errors
- Verify environment variables are loaded
- Try with TEST123 code (hardcoded for testing)
