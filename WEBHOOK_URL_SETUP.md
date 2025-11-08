# 🔗 Webhook URL Setup

## ✅ Your Webhook Configuration

### **Localtunnel URL (For Testing)**
```
https://poor-rocks-smash.loca.lt/api/webhooks/whop
```

### **Production URL (After Deployment)**
```
https://quizzicallabz.qzz.io/api/webhooks/whop
```

---

## 📋 Steps to Update Whop Dashboard

1. **Go to**: https://whop.com/dashboard/biz_ZTlo6LThsfO78W/developer/apps/app_IXKgI3Lw3ojcW5/webhooks/

2. **Click on your existing webhook** (the one showing `https://quizzicallabz.qzz.io`)

3. **Update the URL to**:
   - **For Testing**: `https://poor-rocks-smash.loca.lt/api/webhooks/whop`
   - **For Production**: `https://quizzicallabz.qzz.io/api/webhooks/whop`

4. **Make sure these events are selected**:
   - ✅ `membership.went_valid`
   - ✅ `membership.went_invalid`
   - ✅ `membership.updated`
   - ✅ `payment.succeeded`

5. **Save the webhook**

---

## 🧪 Testing the Webhook

### Step 1: Make sure your dev server is running
```bash
npm run dev
```

### Step 2: Localtunnel is already running
The tunnel URL is: `https://poor-rocks-smash.loca.lt`

### Step 3: Test the webhook endpoint
```bash
curl https://poor-rocks-smash.loca.lt/api/webhooks/whop
```

Should return:
```json
{"success":true,"message":"Whop webhook endpoint is active"}
```

### Step 4: Trigger a test webhook from Whop
1. Go to Whop dashboard → Webhooks
2. Click on your webhook
3. Click "Send test event"
4. Check your terminal for logs

---

## 📊 What to Look For in Logs

When webhook is received, you should see:
```
📨 Received Whop webhook
📋 Webhook details: { hasSignature: true, bodyLength: 1234, ... }
📦 Webhook payload: { action: "membership.went_valid", ... }
🔍 Processing webhook data: ...
✅ Extracted webhook data: { event: "membership_activated", ... }
🔄 Processing Whop webhook: membership_activated -> active
✅ Processing membership activation for: user@example.com
✅ Found Firebase user: abc123
✅ User abc123 upgraded to pro plan
🎉 Membership activated for user: abc123
```

---

## 🔧 Current Configuration

Your `.env.local` already has:
```env
WHOP_WEBHOOK_SECRET=ws_c2658b0f14196d2f18f60e7d87de9faee489af939b11f71ceb19bf2b3d1f2a4d
WHOP_API_KEY=ciOvJ8_6V5CUSx6Ur_kp_efRXEhqo-cCRGWcy6QL9WwNEXT
WHOP_BASIC_PRODUCT_ID=plan_LRZIa8hlujw7Z
WHOP_PRO_PRODUCT_ID=plan_m7YM780QOrUbK
WHOP_PREMIUM_PRODUCT_ID=plan_TjIAWQCNKy0KB
```

---

## ✅ Checklist

- [x] Localtunnel installed and running
- [x] Webhook endpoint created at `/api/webhooks/whop`
- [x] Webhook handler supports Whop v1 API
- [x] Signature verification implemented
- [x] User upgrade logic implemented
- [ ] Update webhook URL in Whop dashboard
- [ ] Test with real payment
- [ ] Verify user gets upgraded

---

## 🚀 Next Steps

1. **Update the webhook URL** in Whop dashboard to use the localtunnel URL
2. **Make a test purchase** (or use Whop's test event)
3. **Check the logs** to see if webhook is received
4. **Verify user is upgraded** in Firebase database

---

**Note**: The localtunnel URL changes each time you restart it. For production, use your actual domain: `https://quizzicallabz.qzz.io/api/webhooks/whop`
