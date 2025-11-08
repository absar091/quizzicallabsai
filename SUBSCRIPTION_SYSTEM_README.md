# 🎯 Comprehensive Whop Subscription System

## Overview

This is a complete subscription management system integrated with Whop payment gateway, featuring token tracking, usage analytics, and automated billing cycle management.

## 📋 Features

### ✅ Core Functionality
- **4 Pricing Tiers**: Free, Basic, Pro, Premium
- **Token Tracking**: 100K to 1M tokens per month based on plan
- **Quiz Limits**: 20 to 180 quizzes per month
- **Automatic Billing Cycles**: Monthly usage resets
- **Real-time Usage Monitoring**: Track consumption in real-time
- **Usage Analytics**: Comprehensive charts and projections
- **Webhook Integration**: Automatic plan updates via Whop webhooks
- **Usage Enforcement**: Middleware to prevent limit violations
- **Warning System**: Email notifications at 75%, 90%, and 100% usage

### 🎨 User Interface Components
- **Pricing Page**: Beautiful plan comparison with feature breakdown
- **Usage Tracker**: Compact and full-size usage displays
- **Subscription Dashboard**: Complete billing management interface
- **Usage Analytics**: Charts, trends, and projections
- **Upgrade Prompts**: Smart prompts when approaching limits

## 📊 Pricing Plans

| Plan | Price (USD) | Price (PKR) | Tokens | Quizzes/Month | AI Model |
|------|-------------|-------------|--------|---------------|----------|
| **Free** | $0.00 | PKR 0 | 100K | 20 | Basic |
| **Basic** | $1.05 | PKR 300 | 250K | 45 | Standard |
| **Pro** | $2.10 | PKR 600 | 500K | 90 | Gemini 1.5 Pro |
| **Premium** | $3.86 | PKR 1,100 | 1M | 180 | Gemini 1.5 Pro+ |

## 🏗️ Architecture

### File Structure

```
src/
├── lib/
│   ├── whop.ts                      # Core Whop service
│   ├── usage-control.ts             # Usage enforcement logic
│   └── subscription.ts              # Subscription utilities
├── hooks/
│   └── useSubscription.ts           # React hook for subscriptions
├── components/
│   ├── usage-tracker.tsx            # Usage display component
│   ├── usage-analytics.tsx          # Analytics dashboard
│   └── subscription-dashboard.tsx   # Full billing interface
├── middleware/
│   └── usage-enforcement.ts         # API route protection
├── app/
│   ├── pricing/page.tsx             # Pricing page
│   ├── (protected)/(main)/
│   │   └── billing/page.tsx         # Billing dashboard
│   └── api/
│       ├── subscription/
│       │   ├── usage/route.ts       # Usage tracking API
│       │   ├── checkout/route.ts    # Checkout URL creation
│       │   └── initialize/route.ts  # User initialization
│       ├── webhooks/
│       │   └── whop/route.ts        # Whop webhook handler
│       └── cron/
│           └── reset-usage/route.ts # Monthly usage reset
```

### Database Structure

```json
{
  "users": {
    "userId": {
      "subscription": {
        "plan": "free|basic|pro|premium",
        "tokens_used": 0,
        "tokens_limit": 100000,
        "quizzes_used": 0,
        "quizzes_limit": 20,
        "billing_cycle_start": "ISO date",
        "billing_cycle_end": "ISO date"
      }
    }
  },
  "usage": {
    "userId": {
      "2025": {
        "1": {
          "tokens_used": 50000,
          "quizzes_created": 15
        }
      }
    }
  },
  "payments": {
    "userId": {
      "paymentId": {
        "amount": 2.10,
        "plan": "pro",
        "status": "succeeded"
      }
    }
  }
}
```

## 🚀 Setup Instructions

### 1. Environment Variables

Add these to your `.env.local`:

```env
# Whop Configuration
WHOP_API_KEY=your_whop_api_key
WHOP_WEBHOOK_SECRET=your_webhook_secret
WHOP_ENVIRONMENT=production

# Whop Product IDs
WHOP_BASIC_PRODUCT_ID=plan_basic_id
WHOP_PRO_PRODUCT_ID=plan_m7YM780QOrUbK
WHOP_PREMIUM_PRODUCT_ID=plan_premium_id

# Public IDs (for frontend)
NEXT_PUBLIC_WHOP_BASIC_PLAN_ID=plan_basic_id
NEXT_PUBLIC_WHOP_PRO_PLAN_ID=plan_m7YM780QOrUbK
NEXT_PUBLIC_WHOP_PREMIUM_PLAN_ID=plan_premium_id

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
CRON_SECRET=your_cron_secret
```

### 2. Whop Dashboard Setup

1. **Create Products** in your Whop dashboard:
   - Basic Plan: $1.05/month
   - Pro Plan: $2.10/month
   - Premium Plan: $3.86/month

2. **Configure Webhooks**:
   - URL: `https://yourdomain.com/api/webhooks/whop`
   - Events: `payment_succeeded`, `subscription_created`, `subscription_updated`, `subscription_cancelled`
   - Secret: Use the same value as `WHOP_WEBHOOK_SECRET`

3. **Get API Credentials**:
   - Navigate to Settings → API
   - Copy your API key to `WHOP_API_KEY`

### 3. Cron Job Setup

Set up a monthly cron job to reset usage limits:

**Vercel Cron** (vercel.json):
```json
{
  "crons": [
    {
      "path": "/api/cron/reset-usage",
      "schedule": "0 0 1 * *"
    }
  ]
}
```

**Manual Trigger**:
```bash
curl -X POST https://yourdomain.com/api/cron/reset-usage \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## 💻 Usage Examples

### 1. Track Token Usage

```typescript
import { useSubscription } from '@/hooks/useSubscription';

function MyComponent() {
  const { trackTokenUsage, canPerformAction } = useSubscription();

  const generateQuiz = async () => {
    // Check if user has enough tokens
    if (!canPerformAction('token', 5000)) {
      alert('Not enough tokens! Please upgrade.');
      return;
    }

    // Perform action
    const result = await generateQuizAPI();

    // Track usage
    await trackTokenUsage(5000);
  };
}
```

### 2. Protect API Routes

```typescript
import { enforceQuizGenerationUsage } from '@/middleware/usage-enforcement';

async function handler(request: NextRequest) {
  // Your API logic here
  return NextResponse.json({ success: true });
}

// Wrap with usage enforcement
export const POST = enforceQuizGenerationUsage(handler);
```

### 3. Display Usage Analytics

```typescript
import { UsageAnalytics } from '@/components/usage-analytics';

function DashboardPage() {
  return (
    <div>
      <h1>My Dashboard</h1>
      <UsageAnalytics userId={user.uid} />
    </div>
  );
}
```

### 4. Create Checkout Session

```typescript
import { useSubscription } from '@/hooks/useSubscription';

function PricingCard() {
  const { createCheckoutUrl } = useSubscription();

  const handleUpgrade = async (planId: string) => {
    const checkoutUrl = await createCheckoutUrl(planId);
    window.location.href = checkoutUrl;
  };

  return (
    <button onClick={() => handleUpgrade('pro')}>
      Upgrade to Pro
    </button>
  );
}
```

## 🔧 API Reference

### Subscription APIs

#### GET /api/subscription/usage
Get current user usage statistics.

**Headers:**
- `Authorization: Bearer <firebase_token>`

**Response:**
```json
{
  "success": true,
  "usage": {
    "plan": "pro",
    "tokens_used": 50000,
    "tokens_limit": 500000,
    "tokens_remaining": 450000,
    "quizzes_used": 15,
    "quizzes_limit": 90,
    "quizzes_remaining": 75,
    "billing_cycle_end": "2025-02-01T00:00:00.000Z"
  }
}
```

#### POST /api/subscription/usage
Track token or quiz usage.

**Headers:**
- `Authorization: Bearer <firebase_token>`

**Body:**
```json
{
  "action": "token",
  "amount": 5000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usage tracked successfully",
  "usage": { /* updated usage */ }
}
```

#### POST /api/subscription/checkout
Create Whop checkout URL.

**Headers:**
- `Authorization: Bearer <firebase_token>`

**Body:**
```json
{
  "planId": "pro"
}
```

**Response:**
```json
{
  "success": true,
  "checkoutUrl": "https://whop.com/checkout/plan_xxx?d2c=true&user_id=xxx"
}
```

### Webhook Handler

#### POST /api/webhooks/whop
Handles Whop webhook events.

**Headers:**
- `x-whop-signature: <webhook_signature>`

**Events Handled:**
- `payment_succeeded`: Upgrades user plan
- `subscription_created`: Creates subscription record
- `subscription_updated`: Updates subscription status
- `subscription_cancelled`: Downgrades to free plan

## 📈 Usage Analytics Features

### Real-time Monitoring
- Current usage percentage
- Tokens and quizzes remaining
- Days until billing cycle reset

### Historical Trends
- 30-day usage charts
- Monthly comparison
- Peak usage identification

### Projections
- Estimated end-of-month usage
- Limit exceed warnings
- Upgrade recommendations

### Violation Tracking
- Failed attempts logged
- Abuse detection
- Automatic warnings

## ⚠️ Usage Warnings

The system automatically sends warnings at:

- **75% usage**: Low warning
- **90% usage**: Critical warning
- **100% usage**: Limit exceeded notification

Warnings include:
- Email notifications
- In-app alerts
- Upgrade prompts

## 🔒 Security Features

- **Token-based authentication**: Firebase Auth tokens
- **Webhook signature verification**: Validates Whop webhooks
- **Rate limiting**: Prevents abuse
- **Usage enforcement**: Middleware protection
- **Violation logging**: Tracks suspicious activity

## 🧪 Testing

### Test Checkout Flow
1. Navigate to `/pricing`
2. Click "Upgrade to Pro"
3. Complete payment in Whop sandbox
4. Verify webhook received
5. Check user plan updated

### Test Usage Tracking
1. Create a quiz
2. Check usage increased
3. Verify limits enforced
4. Test warning notifications

### Test Monthly Reset
```bash
curl -X POST http://localhost:3000/api/cron/reset-usage \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## 📱 Mobile Responsiveness

All components are fully responsive:
- Pricing cards stack on mobile
- Charts adapt to screen size
- Compact mode for small screens
- Touch-friendly interactions

## 🎨 Customization

### Change Plan Limits

Edit `src/lib/whop.ts`:

```typescript
export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    tokens: 100000,
    quizzes: 20,
    // ... other settings
  },
  // ... other plans
};
```

### Customize Warning Thresholds

Edit `src/lib/usage-control.ts`:

```typescript
// Change warning levels
if (usagePercentage >= 90) warningLevel = 'critical';
else if (usagePercentage >= 75) warningLevel = 'low';
```

### Add New Plan

1. Create product in Whop dashboard
2. Add to `PLAN_LIMITS` in `whop.ts`
3. Add product ID to `.env.local`
4. Update pricing page

## 🐛 Troubleshooting

### Webhooks Not Working
- Verify webhook URL is correct
- Check webhook secret matches
- Ensure HTTPS in production
- Check Whop dashboard logs

### Usage Not Tracking
- Verify Firebase connection
- Check user initialization
- Review API route logs
- Confirm middleware applied

### Checkout Redirect Fails
- Verify product IDs correct
- Check Whop API key valid
- Ensure user authenticated
- Review browser console

## 📚 Additional Resources

- [Whop API Documentation](https://docs.whop.com/)
- [Firebase Realtime Database](https://firebase.google.com/docs/database)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## 🤝 Support

For issues or questions:
1. Check this documentation
2. Review error logs
3. Test in sandbox environment
4. Contact Whop support for payment issues

## 📝 License

This subscription system is part of Quizzicallabzᴬᴵ and follows the same license.

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
