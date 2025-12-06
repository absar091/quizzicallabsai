# Design Document

## Overview

This design addresses critical payment integration failures in the Whop checkout system and implements a complete in-app promo code system. The solution ensures immediate plan activation after successful payments, handles zero-dollar transactions from promo codes, and provides a standalone promo code redemption flow that bypasses Whop entirely.

The system will:
- Fix webhook processing to handle zero-dollar transactions
- Implement real-time subscription status polling
- Create a promo code database and validation system
- Add in-app promo code redemption UI
- Ensure data consistency across all Firebase nodes
- Provide comprehensive logging for debugging

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         v                  v
┌────────────────┐   ┌──────────────────┐
│  Whop Checkout │   │  In-App Promo UI │
└────────┬───────┘   └────────┬─────────┘
         │                    │
         v                    v
┌────────────────┐   ┌──────────────────┐
│ Whop Webhook   │   │ Promo Code API   │
│   Handler      │   │   Endpoint       │
└────────┬───────┘   └────────┬─────────┘
         │                    │
         └──────────┬─────────┘
                    v
         ┌──────────────────────┐
         │  Plan Activation     │
         │     Service          │
         └──────────┬───────────┘
                    v
         ┌──────────────────────┐
         │  Firebase Realtime   │
         │     Database         │
         └──────────────────────┘
```

### Component Interaction Flow

**Whop Payment Flow:**
1. User completes payment on Whop (with or without promo code)
2. Whop sends webhook to `/api/webhooks/whop`
3. Webhook handler validates signature and extracts payment data
4. Plan activation service updates Firebase subscription node
5. User redirected to success page
6. Success page polls subscription status every 2 seconds
7. UI updates when status changes to "active"

**In-App Promo Code Flow:**
1. User enters promo code in app UI
2. Frontend calls `/api/promo-code/redeem`
3. API validates code (exists, not expired, not used)
4. Plan activation service updates Firebase subscription node
5. API marks promo code as used
6. Frontend receives success response
7. UI immediately shows Pro benefits

## Components and Interfaces

### 1. Webhook Handler Enhancement (`src/app/api/webhooks/whop/route.ts`)

**Current Issues:**
- Doesn't handle zero-dollar transactions
- No retry logic for failed activations
- Limited logging

**Enhancements:**
```typescript
interface WebhookPayload {
  action: string;
  data: {
    user: { id: string; email: string };
    product_id: string;
    id: string; // subscription_id
    status: string;
    amount: number; // Can be 0 for promo codes
    valid: boolean;
  };
}

// New function to handle zero-dollar transactions
async function handleZeroDollarTransaction(
  userId: string,
  userEmail: string,
  planId: string,
  subscriptionId: string
): Promise<void>
```

### 2. Plan Activation Service (`src/lib/plan-activation.ts`)

**New centralized service for all plan activations:**

```typescript
interface PlanActivationParams {
  userId: string;
  userEmail: string;
  plan: 'basic' | 'pro' | 'premium';
  subscriptionId: string;
  source: 'whop' | 'promo_code' | 'admin';
  amount?: number;
}

interface PlanActivationResult {
  success: boolean;
  userId: string;
  plan: string;
  tokensLimit: number;
  quizzesLimit: number;
  error?: string;
}

class PlanActivationService {
  async activatePlan(params: PlanActivationParams): Promise<PlanActivationResult>
  async verifyActivation(userId: string): Promise<boolean>
  async rollbackActivation(userId: string): Promise<void>
}
```

### 3. Promo Code System

#### Database Schema (`Firebase Realtime Database`)

```typescript
// /promo_codes/{code_id}
interface PromoCode {
  code: string; // e.g., "LAUNCH2024"
  plan: 'basic' | 'pro' | 'premium';
  usage_limit: number; // -1 for unlimited
  usage_count: number;
  expires_at: string; // ISO timestamp
  created_at: string;
  created_by: string; // admin user ID
  active: boolean;
  description?: string;
}

// /promo_code_redemptions/{user_id}/{code_id}
interface PromoCodeRedemption {
  code: string;
  user_id: string;
  redeemed_at: string;
  plan_activated: string;
}
```

#### API Endpoints

**POST `/api/promo-code/redeem`**
```typescript
interface RedeemRequest {
  code: string;
  userId: string;
}

interface RedeemResponse {
  success: boolean;
  plan?: 'basic' | 'pro' | 'premium';
  tokensLimit?: number;
  quizzesLimit?: number;
  error?: string;
  errorCode?: 'INVALID_CODE' | 'EXPIRED' | 'ALREADY_USED' | 'LIMIT_REACHED';
}
```

**POST `/api/admin/promo-code/create`** (Admin only)
```typescript
interface CreatePromoCodeRequest {
  code: string;
  plan: 'basic' | 'pro' | 'premium';
  usage_limit: number;
  expires_at: string;
  description?: string;
}
```

**GET `/api/admin/promo-code/list`** (Admin only)
```typescript
interface ListPromoCodesResponse {
  codes: PromoCode[];
}
```

### 4. Subscription Status Polling (`src/hooks/useSubscriptionPolling.ts`)

**New React hook for real-time status updates:**

```typescript
interface SubscriptionStatus {
  plan: string;
  subscription_status: 'pending' | 'active' | 'cancelled' | 'expired';
  tokens_limit: number;
  quizzes_limit: number;
  updated_at: string;
}

function useSubscriptionPolling(userId: string, enabled: boolean) {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  
  // Poll every 2 seconds for up to 60 seconds
  // Stop when status becomes 'active'
  
  return { status, isPolling };
}
```

### 5. Payment Success Page Enhancement (`src/app/payment/success/page.tsx`)

**Current Issues:**
- No real subscription verification
- Fake 2-second delay
- No actual status checking

**Enhancements:**
- Use `useSubscriptionPolling` hook
- Display real-time status updates
- Show token limits when activated
- Provide support link if activation fails after 60 seconds

### 6. Promo Code UI Component (`src/components/promo-code-input.tsx`)

**New component for in-app promo code redemption:**

```typescript
interface PromoCodeInputProps {
  onSuccess: (plan: string, limits: { tokens: number; quizzes: number }) => void;
  onError: (error: string) => void;
}

export function PromoCodeInput({ onSuccess, onError }: PromoCodeInputProps) {
  // Input field for promo code
  // Validation and submission
  // Loading state
  // Success/error messages
}
```

## Data Models

### Updated Subscription Node Structure

```typescript
// /users/{userId}/subscription
interface UserSubscription {
  plan: 'free' | 'basic' | 'pro' | 'premium';
  subscription_id?: string; // Whop subscription ID or promo code
  subscription_status: 'pending' | 'active' | 'cancelled' | 'expired';
  subscription_source: 'whop' | 'promo_code' | 'admin' | 'free';
  tokens_used: number;
  tokens_limit: number;
  quizzes_used: number;
  quizzes_limit: number;
  billing_cycle_start: string;
  billing_cycle_end: string;
  created_at: string;
  updated_at: string;
  activation_attempts?: number; // Track retry attempts
  last_activation_error?: string; // For debugging
}
```

### Pending Purchases Enhancement

```typescript
// /pending_purchases/{userId}
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

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Plan activation completeness
*For any* successful payment (including zero-dollar transactions), activating the plan should update all three Firebase nodes: subscription, usage, and pending_purchases
**Validates: Requirements 1.2, 1.3, 1.4, 6.1, 6.2, 6.3**

### Property 2: Zero-dollar transaction equivalence
*For any* payment with amount = 0 and valid promo code, the plan activation should grant identical benefits as a paid transaction
**Validates: Requirements 2.2, 2.4, 2.5**

### Property 3: Promo code single-use enforcement
*For any* promo code with usage_limit = 1, after one successful redemption, subsequent redemption attempts should fail with "ALREADY_USED" error
**Validates: Requirements 7.6**

### Property 4: Subscription status consistency
*For any* user, querying subscription status from different Firebase nodes (subscription, usage, metadata) should return the same plan value
**Validates: Requirements 6.4**

### Property 5: Polling termination
*For any* subscription status polling session, polling should stop within 60 seconds or when status becomes "active", whichever comes first
**Validates: Requirements 4.1, 4.2, 4.3**

### Property 6: Webhook idempotency
*For any* webhook payload, processing the same webhook multiple times should result in the same final state as processing it once
**Validates: Requirements 8.2**

### Property 7: Promo code expiration enforcement
*For any* promo code with expires_at in the past, redemption attempts should fail with "EXPIRED" error
**Validates: Requirements 7.7**

### Property 8: Token limit assignment
*For any* plan activation, the assigned token limit should match the PLAN_LIMITS constant for that plan tier
**Validates: Requirements 1.2, 7.3**

## Error Handling

### Webhook Processing Errors

```typescript
enum WebhookErrorType {
  SIGNATURE_INVALID = 'SIGNATURE_INVALID',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  PLAN_ACTIVATION_FAILED = 'PLAN_ACTIVATION_FAILED',
  DATABASE_ERROR = 'DATABASE_ERROR',
  INVALID_PAYLOAD = 'INVALID_PAYLOAD'
}

interface WebhookError {
  type: WebhookErrorType;
  message: string;
  userId?: string;
  webhookPayload: any;
  timestamp: string;
  retryable: boolean;
}
```

**Error Handling Strategy:**
- Return 401 for signature failures (not retryable)
- Return 404 for user not found (retryable - user might register soon)
- Return 500 for database errors (retryable)
- Return 400 for invalid payload (not retryable)
- Log all errors to Firebase `/webhook_errors/{timestamp}`

### Promo Code Redemption Errors

```typescript
enum PromoCodeErrorType {
  INVALID_CODE = 'INVALID_CODE',
  EXPIRED = 'EXPIRED',
  ALREADY_USED = 'ALREADY_USED',
  LIMIT_REACHED = 'LIMIT_REACHED',
  USER_HAS_ACTIVE_PLAN = 'USER_HAS_ACTIVE_PLAN'
}
```

**User-Friendly Error Messages:**
- INVALID_CODE: "This promo code doesn't exist. Please check and try again."
- EXPIRED: "This promo code has expired."
- ALREADY_USED: "You've already used this promo code."
- LIMIT_REACHED: "This promo code has reached its usage limit."
- USER_HAS_ACTIVE_PLAN: "You already have an active subscription."

### Retry Logic

**Webhook Processing:**
- Implement exponential backoff: 1s, 2s, 4s, 8s, 16s
- Maximum 5 retry attempts
- Store retry count in pending_purchases node

**Database Operations:**
- Retry failed writes up to 3 times
- Use Firebase transactions for atomic updates
- Implement rollback on partial failures

## Testing Strategy

### Unit Tests

**Webhook Handler Tests:**
- Test zero-dollar transaction processing
- Test signature verification
- Test user matching by email and ID
- Test error handling for each error type

**Promo Code Validation Tests:**
- Test valid code redemption
- Test expired code rejection
- Test already-used code rejection
- Test usage limit enforcement

**Plan Activation Service Tests:**
- Test subscription node updates
- Test usage node updates
- Test data consistency verification
- Test rollback on failure

### Property-Based Tests

**Property Test Framework:** fast-check (JavaScript/TypeScript PBT library)

**Test Configuration:**
- Minimum 100 iterations per property
- Use custom generators for Firebase data structures
- Test with random user IDs, plan types, and timestamps

**Property Test 1: Plan activation completeness**
```typescript
// Generate random successful payments
// Activate plan
// Verify all three nodes updated
```

**Property Test 2: Zero-dollar transaction equivalence**
```typescript
// Generate random plans
// Activate with amount=0 and amount>0
// Verify identical token/quiz limits
```

**Property Test 3: Promo code single-use enforcement**
```typescript
// Generate random promo codes with usage_limit=1
// Redeem once (should succeed)
// Redeem again (should fail)
```

**Property Test 4: Subscription status consistency**
```typescript
// Generate random user with subscription
// Query from all three nodes
// Verify plan values match
```

**Property Test 5: Polling termination**
```typescript
// Start polling with random initial status
// Verify polling stops within 60s or on "active"
```

**Property Test 6: Webhook idempotency**
```typescript
// Generate random webhook payload
// Process once, capture state
// Process again, verify state unchanged
```

**Property Test 7: Promo code expiration enforcement**
```typescript
// Generate promo codes with past expires_at
// Attempt redemption
// Verify all fail with EXPIRED error
```

**Property Test 8: Token limit assignment**
```typescript
// Generate random plan activations
// Verify token_limit matches PLAN_LIMITS[plan]
```

### Integration Tests

**End-to-End Whop Flow:**
1. Simulate webhook from Whop
2. Verify plan activation
3. Check subscription status polling
4. Verify UI updates

**End-to-End Promo Code Flow:**
1. Create promo code via admin API
2. Redeem code via user API
3. Verify plan activation
4. Verify UI shows Pro benefits

### Manual Testing Checklist

- [ ] Complete Whop payment with promo code ($0)
- [ ] Verify plan activates within 30 seconds
- [ ] Complete Whop payment without promo code
- [ ] Apply in-app promo code
- [ ] Verify Pro benefits appear immediately
- [ ] Try using same promo code twice
- [ ] Try expired promo code
- [ ] Check Firebase data consistency
- [ ] Verify logging captures all events
- [ ] Test with network interruptions

## Implementation Notes

### Firebase Security Rules

Add rules for promo code access:

```json
{
  "rules": {
    "promo_codes": {
      ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "promo_code_redemptions": {
      "$userId": {
        ".read": "auth != null && auth.uid === $userId",
        ".write": "auth != null && auth.uid === $userId"
      }
    }
  }
}
```

### Environment Variables

Add to `.env.local`:
```
WHOP_WEBHOOK_SECRET=your_webhook_secret
WHOP_BASIC_PRODUCT_ID=prod_xxx
WHOP_PRO_PRODUCT_ID=prod_yyy
WHOP_PREMIUM_PRODUCT_ID=prod_zzz
```

### Monitoring and Alerts

**Key Metrics to Track:**
- Webhook processing success rate
- Average plan activation time
- Promo code redemption rate
- Failed activation count
- Zero-dollar transaction count

**Alert Conditions:**
- Webhook processing failure rate > 5%
- Plan activation time > 30 seconds
- Failed activation count > 10 in 1 hour

## Migration Plan

### Phase 1: Fix Webhook Handler
1. Update webhook handler to process zero-dollar transactions
2. Add comprehensive logging
3. Implement retry logic
4. Deploy and test with existing Whop integration

### Phase 2: Add Subscription Polling
1. Create useSubscriptionPolling hook
2. Update payment success page
3. Test real-time status updates

### Phase 3: Implement Promo Code System
1. Create promo code database schema
2. Implement validation API
3. Create redemption API
4. Add admin management APIs

### Phase 4: Add Promo Code UI
1. Create PromoCodeInput component
2. Add to pricing page
3. Add to dashboard
4. Test end-to-end flow

### Phase 5: Testing and Monitoring
1. Run all property-based tests
2. Perform manual testing
3. Set up monitoring and alerts
4. Document for support team
