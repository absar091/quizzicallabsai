# Webhook Activation Fix Guide

## Problem
User completed payment through Whop with a promo code (successful $0 transaction), but the plan was not activated. The user shows:
- **Current Plan**: Free
- **Pending Plan Change**: Free → Pro (Waiting for payment completion)
- **User ID**: `nihPCHdN1T90vNpsbUaQPa3q4q1`
- **Email**: `ahmadraoabsar@gmail.com`

## Root Cause
The Whop webhook either:
1. Never fired from Whop's side
2. Fired but failed to process (user not found, network error, etc.)
3. Fired but the plan activation service failed

## Immediate Fix: Manual Activation

### Option 1: Use the Test Page (Easiest)

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the manual activation page**:
   ```
   http://localhost:3000/test-manual-activation
   ```

3. **Fill in the form**:
   - User ID: `nihPCHdN1T90vNpsbUaQPa3q4q1`
   - User Email: `ahmadraoabsar@gmail.com`
   - Plan: `Pro`
   - Admin Secret: `QZ_ADMIN_2024_SECURE_DEV_ACCESS_KEY_XYZ789` (from .env.local)

4. **Click "Activate Plan"**

5. **Verify**: The user should now have:
   - Plan: Pro
   - Tokens: 500,000
   - Quizzes: 100
   - No pending plan change

### Option 2: Use API Directly (cURL)

```bash
curl -X POST http://localhost:3000/api/admin/activate-user-plan \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "nihPCHdN1T90vNpsbUaQPa3q4q1",
    "userEmail": "ahmadraoabsar@gmail.com",
    "plan": "pro",
    "adminSecret": "QZ_ADMIN_2024_SECURE_DEV_ACCESS_KEY_XYZ789"
  }'
```

### Option 3: Use Postman/Thunder Client

**POST** `http://localhost:3000/api/admin/activate-user-plan`

**Headers**:
```
Content-Type: application/json
```

**Body** (JSON):
```json
{
  "userId": "nihPCHdN1T90vNpsbUaQPa3q4q1",
  "userEmail": "ahmadraoabsar@gmail.com",
  "plan": "pro",
  "adminSecret": "QZ_ADMIN_2024_SECURE_DEV_ACCESS_KEY_XYZ789"
}
```

## Long-Term Fix: Prevent Future Issues

### 1. Verify Webhook Configuration

Check your Whop dashboard webhook settings:
- **Webhook URL**: `https://your-domain.com/api/webhooks/whop`
- **Events**: Ensure these are enabled:
  - `membership.went_valid`
  - `membership.went_invalid`
  - `payment.succeeded`

### 2. Check Webhook Logs

After the fix, monitor webhook logs in Firebase:
```
/webhook_errors/{timestamp}
```

Look for:
- USER_NOT_FOUND errors
- PLAN_ACTIVATION_FAILED errors
- SIGNATURE_INVALID errors

### 3. Test Webhook Manually

Use Whop's webhook testing feature to send a test webhook and verify it processes correctly.

### 4. Add Monitoring

The system now logs all webhook events. Monitor:
- `/webhook_errors` - Failed webhook attempts
- `/pending_purchases` - Pending payment activations
- User subscription nodes - Activation attempts and errors

## What the Fix Does

The manual activation endpoint:
1. ✅ Updates the subscription node with Pro plan details
2. ✅ Resets token usage to 0
3. ✅ Sets token limit to 500,000
4. ✅ Updates the usage tracking node
5. ✅ Updates user metadata
6. ✅ Clears the pending_plan_change
7. ✅ Marks pending_purchase as completed
8. ✅ Verifies all nodes are consistent

## Verification Steps

After activation, verify in Firebase:

1. **Check subscription node** (`/users/{userId}/subscription`):
   ```json
   {
     "plan": "pro",
     "subscription_status": "active",
     "tokens_limit": 500000,
     "quizzes_limit": 100,
     "tokens_used": 0,
     "quizzes_used": 0
   }
   ```

2. **Check usage node** (`/usage/{userId}/{year}/{month}`):
   ```json
   {
     "plan": "pro",
     "tokens_limit": 500000,
     "tokens_used": 0
   }
   ```

3. **Check metadata** (`/users/{userId}/metadata`):
   ```json
   {
     "plan": "pro",
     "subscription_id": "admin_manual_..."
   }
   ```

4. **Verify pending_plan_change is removed**

## Future Prevention

### Add Fallback Activation

Consider adding a fallback mechanism:
1. User completes payment
2. Payment success page polls for activation
3. If activation doesn't happen within 60 seconds:
   - Show "Contact Support" message
   - Log the issue
   - Send alert to admin

### Implement Retry Logic

The webhook handler already has retry logic with exponential backoff:
- 5 retry attempts
- Delays: 1s, 2s, 4s, 8s, 16s
- Logs all attempts

### Add Admin Dashboard

Create an admin dashboard to:
- View failed webhooks
- Manually activate plans
- See pending purchases
- Monitor activation success rate

## Support Contact

If issues persist:
- Email: hello@quizzicallabz.qzz.io
- Include: User ID, Email, Order ID, Timestamp

## Files Created/Modified

- ✅ `src/app/api/admin/activate-user-plan/route.ts` - Manual activation endpoint
- ✅ `src/app/test-manual-activation/page.tsx` - Test page for manual activation
- ✅ `fix-user-plan.js` - Node.js script (alternative method)
- ✅ `WEBHOOK_ACTIVATION_FIX.md` - This guide

## Next Steps

1. **Immediate**: Run the manual activation to fix the current user
2. **Short-term**: Monitor webhook logs for patterns
3. **Long-term**: Implement admin dashboard for easier management
