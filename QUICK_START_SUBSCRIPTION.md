# 🚀 Quick Start: Whop Subscription System

## ⏱️ 5-Minute Setup Guide

### Step 1: Get Whop Credentials (5 min)

1. Go to [Whop Dashboard](https://whop.com/dashboard)
2. Navigate to **Settings → API**
3. Create a new API key
4. Copy the API key and webhook secret

### Step 2: Create Products (10 min)

Create 3 products in Whop:

| Product | Price | Billing |
|---------|-------|---------|
| Basic | $1.05 | Monthly |
| Pro | $2.10 | Monthly |
| Premium | $3.86 | Monthly |

Copy each product ID after creation.

### Step 3: Update Environment Variables (2 min)

Edit `.env.local`:

```env
# Replace these with your actual values
WHOP_API_KEY=your_api_key_here
WHOP_WEBHOOK_SECRET=your_webhook_secret_here

# Replace with your product IDs
WHOP_BASIC_PRODUCT_ID=plan_xxx
WHOP_PRO_PRODUCT_ID=plan_yyy
WHOP_PREMIUM_PRODUCT_ID=plan_zzz

# Public IDs (same as above)
NEXT_PUBLIC_WHOP_BASIC_PLAN_ID=plan_xxx
NEXT_PUBLIC_WHOP_PRO_PLAN_ID=plan_yyy
NEXT_PUBLIC_WHOP_PREMIUM_PLAN_ID=plan_zzz
```

### Step 4: Configure Webhook (3 min)

1. In Whop Dashboard → **Webhooks**
2. Add new webhook:
   - **URL**: `https://yourdomain.com/api/webhooks/whop`
   - **Events**: Select all subscription events
   - **Secret**: Use same value as `WHOP_WEBHOOK_SECRET`

### Step 5: Deploy & Test (5 min)

```bash
# Deploy to production
npm run build
vercel --prod

# Test the flow
1. Visit /pricing
2. Click "Upgrade to Pro"
3. Complete test payment
4. Verify plan updated
```

---

## 🎯 Quick Test Checklist

- [ ] User can view pricing page
- [ ] Checkout redirects to Whop
- [ ] Webhook updates user plan
- [ ] Usage tracking works
- [ ] Limits are enforced
- [ ] Dashboard shows usage
- [ ] Upgrade prompts appear

---

## 📱 Key URLs

- **Pricing**: `/pricing`
- **Dashboard**: `/dashboard`
- **Billing**: `/billing`
- **Webhook**: `/api/webhooks/whop`
- **Usage API**: `/api/subscription/usage`

---

## 🔧 Quick Commands

```bash
# Test webhook locally
curl -X POST http://localhost:3000/api/webhooks/whop \
  -H "Content-Type: application/json" \
  -d '{"type":"payment_succeeded","data":{"user_id":"test"}}'

# Check user usage
curl http://localhost:3000/api/subscription/usage \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"

# Trigger monthly reset
curl -X POST http://localhost:3000/api/cron/reset-usage \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## 🎨 Quick Customization

### Change Plan Prices

Edit `src/lib/whop.ts`:
```typescript
export const PLAN_LIMITS = {
  basic: {
    price_usd: 1.05, // Change this
    // ...
  }
}
```

### Change Usage Limits

Edit `src/lib/whop.ts`:
```typescript
export const PLAN_LIMITS = {
  basic: {
    tokens: 250000, // Change this
    quizzes: 45,    // Change this
    // ...
  }
}
```

### Change Warning Thresholds

Edit `src/lib/usage-control.ts`:
```typescript
if (usagePercentage >= 90) warningLevel = 'critical';
else if (usagePercentage >= 75) warningLevel = 'low';
```

---

## 🐛 Quick Troubleshooting

### Webhook Not Working?
```bash
# Check webhook logs in Whop dashboard
# Verify URL is HTTPS
# Confirm secret matches
```

### Usage Not Tracking?
```bash
# Check Firebase connection
# Verify user initialized
# Review browser console
```

### Checkout Fails?
```bash
# Verify product IDs
# Check API key valid
# Ensure user logged in
```

---

## 📞 Need Help?

1. Check `SUBSCRIPTION_SYSTEM_README.md` for detailed docs
2. Review `WHOP_INTEGRATION_COMPLETE.md` for full implementation
3. Check Whop documentation: https://docs.whop.com/

---

## ✅ You're Done!

Your subscription system is now live! 🎉

**What's Working**:
- ✅ 4-tier pricing (Free, Basic, Pro, Premium)
- ✅ Token tracking (100K-1M per month)
- ✅ Quiz limits (20-180 per month)
- ✅ Automatic billing cycles
- ✅ Usage analytics
- ✅ Upgrade prompts
- ✅ Webhook integration
- ✅ Monthly resets

**Next Steps**:
1. Monitor first users
2. Optimize conversion rates
3. Add more features
4. Scale as needed

---

**Setup Time**: ~25 minutes  
**Status**: ✅ Ready to Go!
