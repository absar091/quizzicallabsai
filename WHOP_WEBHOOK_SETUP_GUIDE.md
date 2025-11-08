# 🔗 Whop Webhook Setup Guide

## Overview
This guide explains how to set up Whop webhooks so your app automatically upgrades users when they complete payment.

## 📋 How It Works

1. **User clicks "Upgrade"** → Redirected to Whop checkout
2. **User completes payment** → Whop processes payment
3. **Whop sends webhook** → Notifies your app
4. **Your app upgrades user** → Plan updated automatically
5. **User returns to app** → Sees new plan features

---

## 🚀 Setup Steps

### Step 1: Configure Webhook URL in Whop Dashboard

1. **Go to Whop Dashboard**: https://dash.whop.com
2. **Navigate to**: Settings → Developers → Webhooks
3. **Click**: "Add Webhook Endpoint"
4. **Enter Webhook URL**:
   - **Production**: `https://yourdomain.com/api/webhooks/whop`
   - **Development**: Use ngrok (see below)

### Step 2: Select Webhook Events

Check these events in Whop dashboard:
- ✅ `payment.succeeded` - When payment is completed
- ✅ `membership.went_valid` - When membership becomes active
- ✅ `membership.went_invalid` - When membership expires/cancels
- ✅ `membership.updated` - When membership is updated

### Step 3: Copy Webhook Secret

1. After creating the webhook, Whop will show you a **Webhook Secret**
2. Copy this secret (starts with `ws_`)
3. Add it to your `.env.local` file:
   ```env
   WHOP_WEBHOOK_SECRET=ws_your_secret_here
   ```

---

## 🧪 Testing Webhooks Locally

### Option 1: Using ngrok (Recommended)

1. **Install ngrok**: https://ngrok.com/download
2. **Start your dev server**:
   ```bash
   npm run dev
   ```
3. **Start ngrok tunnel**:
   ```bash
   ngrok http 3000
   ```
4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)
5. **Add to Whop webhook**: `https://abc123.ngrok.io/api/webhooks/whop`

### Option 2: Using localtunnel

1. **Install localtunnel**:
   ```bash
   npm install -g localtunnel
   ```
2. **Start tunnel**:
   ```bash
   lt --port 3000
   ```
3. **Use the provided URL** in Whop dashboard

---

## 🔍 Webhook Flow

### When User Completes Payment:

```
1. Whop sends POST request to: /api/webhooks/whop
   ↓
2. Your app verifies webhook signature
   ↓
3. Extracts user email and plan ID
   ↓
4. Finds user in Firebase by email
   ↓
5. Upgrades user's plan in database
   ↓
6. Resets usage counters (tokens/quizzes)
   ↓
7. Sends confirmation email
   ↓
8. Returns success to Whop
```

### Webhook Payload Example:

```json
{
  "action": "payment.succeeded",
  "data": {
    "id": "mem_abc123",
    "user": {
      "id": "user_xyz789",
      "email": "user@example.com"
    },
    "plan": {
      "id": "plan_m7YM780QOrUbK"
    },
    "status": "active"
  }
}
```

---

## 🛠️ Troubleshooting

### Webhook Not Receiving Events

1. **Check webhook URL** is correct in Whop dashboard
2. **Verify webhook secret** in `.env.local`
3. **Check server logs** for incoming requests
4. **Test webhook endpoint**:
   ```bash
   curl https://yourdomain.com/api/webhooks/whop
   ```
   Should return: `{"success":true,"message":"Whop webhook endpoint is active"}`

### Signature Verification Failing

1. **Ensure WHOP_WEBHOOK_SECRET** is set correctly
2. **Check for extra spaces** in the secret
3. **Verify secret matches** Whop dashboard

### User Not Being Upgraded

1. **Check server logs** for errors
2. **Verify user email** matches Firebase account
3. **Check Firebase database** permissions
4. **Ensure plan IDs** match in `.env.local`:
   ```env
   WHOP_BASIC_PRODUCT_ID=plan_LRZIa8hlujw7Z
   WHOP_PRO_PRODUCT_ID=plan_m7YM780QOrUbK
   WHOP_PREMIUM_PRODUCT_ID=plan_TjIAWQCNKy0KB
   ```

---

## 📊 Monitoring Webhooks

### Check Webhook Logs

1. **In Whop Dashboard**: Settings → Developers → Webhooks
2. **Click on your webhook** → View delivery logs
3. **Check status codes**:
   - `200` = Success ✅
   - `401` = Invalid signature ❌
   - `500` = Server error ❌

### Check Your Server Logs

Look for these log messages:
- `📨 Received Whop webhook`
- `✅ Processing membership activation`
- `🎉 Membership activated for user`
- `❌ Error handling membership activation` (if error)

---

## 🔐 Security

### Webhook Signature Verification

Your app automatically verifies webhook signatures using HMAC SHA-256:

```typescript
const expectedSignature = crypto
  .createHmac('sha256', WHOP_WEBHOOK_SECRET)
  .update(body)
  .digest('hex');
```

**Never disable signature verification in production!**

---

## 📝 Environment Variables Checklist

Make sure these are set in `.env.local`:

```env
# Whop API Configuration
WHOP_API_KEY=your_api_key_here
WHOP_WEBHOOK_SECRET=ws_your_secret_here

# Whop Plan IDs
WHOP_BASIC_PRODUCT_ID=plan_LRZIa8hlujw7Z
WHOP_PRO_PRODUCT_ID=plan_m7YM780QOrUbK
WHOP_PREMIUM_PRODUCT_ID=plan_TjIAWQCNKy0KB
```

---

## 🎯 Testing the Complete Flow

1. **Start your dev server** with ngrok
2. **Go to pricing page**: `/pricing`
3. **Click "Upgrade to Pro"**
4. **Complete test payment** in Whop
5. **Check server logs** for webhook
6. **Verify user upgraded** in Firebase
7. **Check dashboard** shows new plan

---

## 📞 Support

If webhooks aren't working:

1. **Check Whop documentation**: https://docs.whop.com/webhooks
2. **Review server logs** for detailed errors
3. **Test webhook endpoint** manually
4. **Contact Whop support** if needed

---

## ✅ Checklist

- [ ] Webhook URL added to Whop dashboard
- [ ] Webhook events selected (payment.succeeded, etc.)
- [ ] Webhook secret copied to `.env.local`
- [ ] Plan IDs match Whop dashboard
- [ ] Tested with ngrok/localtunnel
- [ ] Verified webhook receives events
- [ ] Confirmed user upgrades work
- [ ] Email confirmations sending

---

**Your webhook is now set up! Users will be automatically upgraded when they complete payment through Whop.** 🎉
