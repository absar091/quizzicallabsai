# Promo Code Database Schema

## Overview

This document describes the Firebase Realtime Database schema for the promo code system, including security rules and data structures.

## Database Structure

### `/promo_codes/{code_id}`

Stores promo code definitions. Only accessible by admin users.

```typescript
interface PromoCode {
  code: string;              // e.g., "LAUNCH2024" - the actual promo code
  plan: 'basic' | 'pro' | 'premium';  // Plan tier this code grants
  usage_limit: number;       // Maximum number of redemptions (-1 for unlimited)
  usage_count: number;       // Current number of redemptions
  expires_at: string;        // ISO timestamp when code expires
  created_at: string;        // ISO timestamp when code was created
  created_by: string;        // User ID of admin who created the code
  active: boolean;           // Whether the code is currently active
  description?: string;      // Optional description of the promo
}
```

**Example:**
```json
{
  "promo_codes": {
    "code_abc123": {
      "code": "LAUNCH2024",
      "plan": "pro",
      "usage_limit": 100,
      "usage_count": 45,
      "expires_at": "2025-12-31T23:59:59.000Z",
      "created_at": "2025-01-01T00:00:00.000Z",
      "created_by": "admin_user_123",
      "active": true,
      "description": "Launch promotion - Free Pro plan"
    }
  }
}
```

### `/promo_code_redemptions/{userId}/{code_id}`

Tracks which users have redeemed which promo codes. Users can only read their own redemptions.

```typescript
interface PromoCodeRedemption {
  code: string;              // The promo code that was redeemed
  user_id: string;           // User ID who redeemed the code
  redeemed_at: string;       // ISO timestamp of redemption
  plan_activated: string;    // Plan that was activated (basic/pro/premium)
}
```

**Example:**
```json
{
  "promo_code_redemptions": {
    "user_123": {
      "code_abc123": {
        "code": "LAUNCH2024",
        "user_id": "user_123",
        "redeemed_at": "2025-01-15T10:30:00.000Z",
        "plan_activated": "pro"
      }
    }
  }
}
```

### `/webhook_errors/{timestamp_id}`

Stores webhook processing errors for debugging. Only accessible by admin users.

```typescript
interface WebhookError {
  type: 'SIGNATURE_INVALID' | 'USER_NOT_FOUND' | 'PLAN_ACTIVATION_FAILED' | 'DATABASE_ERROR' | 'INVALID_PAYLOAD';
  message: string;           // Error description
  userId?: string;           // User ID if available
  webhookPayload: any;       // Complete webhook payload for debugging
  timestamp: string;         // ISO timestamp of error
  retryable: boolean;        // Whether the webhook should be retried
}
```

### `/pending_purchases/{userId}`

Tracks pending payment activations. Users can read their own, admins can read all.

```typescript
interface PendingPurchase {
  user_id: string;
  email: string;
  requested_plan: string;
  whop_product_id: string;
  created_at: string;
  status: 'pending' | 'completed' | 'failed';
  webhook_received_at?: string;
  activation_completed_at?: string;
  error?: string;
}
```

## Security Rules

### Admin Role Checking

The security rules check for an admin role using:
```javascript
root.child('users').child(auth.uid).child('role').val() === 'admin'
```

This means each user document should have a `role` field:
```json
{
  "users": {
    "user_123": {
      "uid": "user_123",
      "email": "user@example.com",
      "role": "user"  // or "admin"
    }
  }
}
```

### Promo Code Rules

**Read Access:**
- Only admin users can read promo codes
- Users can read their own redemptions

**Write Access:**
- Only admin users can create/modify promo codes
- Users can write their own redemptions (when redeeming)

**Validation:**
- Promo codes must have all required fields
- Redemptions must have all required fields

### Indexes

The following indexes are configured for efficient queries:

**`/promo_codes`:**
- `code` - for looking up codes by their string value
- `active` - for filtering active codes
- `expires_at` - for filtering expired codes

**`/promo_code_redemptions/{userId}`:**
- `redeemed_at` - for sorting by redemption date
- `code` - for looking up specific code redemptions

**`/webhook_errors`:**
- `timestamp` - for sorting by time
- `type` - for filtering by error type
- `userId` - for filtering by user

**`/pending_purchases`:**
- `created_at` - for sorting by creation time
- `status` - for filtering by status

## Updated User Subscription Schema

The user subscription node has been enhanced with new fields:

```typescript
interface UserSubscription {
  plan: 'free' | 'basic' | 'pro' | 'premium';
  subscription_id?: string;
  subscription_status: 'pending' | 'active' | 'cancelled' | 'expired';
  subscription_source: 'whop' | 'promo_code' | 'admin' | 'free';  // NEW
  tokens_used: number;
  tokens_limit: number;
  quizzes_used: number;
  quizzes_limit: number;
  billing_cycle_start: string;
  billing_cycle_end: string;
  created_at: string;
  updated_at: string;
  activation_attempts?: number;      // NEW - Track retry attempts
  last_activation_error?: string;    // NEW - For debugging
}
```

## Deployment

To deploy the updated database rules:

```bash
# Windows
deploy-database-rules.bat

# Or manually
firebase deploy --only database
```

## Admin User Setup

To make a user an admin, manually update their user node in Firebase:

1. Go to Firebase Console > Realtime Database
2. Navigate to `/users/{userId}`
3. Add a field: `role: "admin"`

Or use the Firebase Admin SDK:

```typescript
import { getDatabase } from 'firebase-admin/database';

const db = getDatabase();
await db.ref(`users/${userId}/role`).set('admin');
```

## Usage in Code

### Checking Admin Status

```typescript
import { ref, get } from 'firebase/database';
import { database } from '@/lib/firebase';

async function isAdmin(userId: string): Promise<boolean> {
  const roleRef = ref(database, `users/${userId}/role`);
  const snapshot = await get(roleRef);
  return snapshot.val() === 'admin';
}
```

### Creating a Promo Code (Admin Only)

```typescript
import { ref, push, set } from 'firebase/database';
import { database } from '@/lib/firebase';

async function createPromoCode(code: string, plan: string, usageLimit: number, expiresAt: string, adminUserId: string) {
  const promoCodesRef = ref(database, 'promo_codes');
  const newCodeRef = push(promoCodesRef);
  
  await set(newCodeRef, {
    code,
    plan,
    usage_limit: usageLimit,
    usage_count: 0,
    expires_at: expiresAt,
    created_at: new Date().toISOString(),
    created_by: adminUserId,
    active: true
  });
}
```

### Recording a Redemption

```typescript
import { ref, set } from 'firebase/database';
import { database } from '@/lib/firebase';

async function recordRedemption(userId: string, codeId: string, code: string, plan: string) {
  const redemptionRef = ref(database, `promo_code_redemptions/${userId}/${codeId}`);
  
  await set(redemptionRef, {
    code,
    user_id: userId,
    redeemed_at: new Date().toISOString(),
    plan_activated: plan
  });
}
```

## Testing

After deploying the rules, test the security:

1. **Test admin access:**
   - Create a test admin user
   - Verify they can read/write promo codes
   - Verify regular users cannot

2. **Test user redemptions:**
   - Verify users can read their own redemptions
   - Verify users cannot read other users' redemptions

3. **Test validation:**
   - Try creating a promo code without required fields (should fail)
   - Try creating a redemption without required fields (should fail)

## Troubleshooting

### "Permission Denied" Errors

If you get permission denied when accessing promo codes:
1. Verify the user has `role: "admin"` in their user node
2. Check that the security rules have been deployed
3. Verify the user is authenticated

### Indexes Not Working

If queries are slow or failing:
1. Check Firebase Console for index warnings
2. Verify indexes are defined in `database.rules.json`
3. Redeploy the rules with `firebase deploy --only database`
