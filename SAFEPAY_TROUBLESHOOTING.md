# SafePay Integration Troubleshooting

## 🚨 **Common Issues & Solutions**

### 1. **"Fetch Failed" Error**
**Symptoms**: SafePay requests fail with network errors
**Possible Causes**:
- Network connectivity issues
- CSP blocking SafePay domains
- Invalid API credentials
- Wrong API endpoint URLs

**Solutions Applied**:
- ✅ Added SafePay domains to CSP
- ✅ Enhanced error logging and debugging
- ✅ Added network error detection
- ✅ Created test API endpoint

### 2. **API Credential Issues**
**Symptoms**: Authentication errors from SafePay
**Check**:
- API Key format: Should start with `sec_`
- Secret Key: Long hexadecimal string
- Environment: `sandbox` or `production`

**Verification**:
```bash
# Test SafePay connectivity
curl -X GET http://localhost:3000/api/test-safepay
```

### 3. **CSP Violations**
**Symptoms**: Requests blocked by Content Security Policy
**Fixed**: Added SafePay domains to CSP in `next.config.js`

## 🔧 **Debugging Steps**

### **Step 1: Test API Connectivity**
```bash
# GET request to test basic connectivity
curl -X GET http://localhost:3000/api/test-safepay

# POST request to test payment creation
curl -X POST http://localhost:3000/api/test-safepay \
  -H "Content-Type: application/json" \
  -d '{"amount": 200, "planId": "pro"}'
```

### **Step 2: Check Environment Variables**
Verify these are set in your `.env` file:
```env
SAFEPAY_API_KEY=sec_7295fc62-71ce-4404-be26-1413ca0c96a2
SAFEPAY_SECRET_KEY=1f83b161c462b7c572f9111f616324173d943284244d2304af961e571fc3ecc9
SAFEPAY_WEBHOOK_SECRET=1f83b161c462b7c572f9111f616324173d943284244d2304af961e571fc3ecc9
SAFEPAY_ENVIRONMENT=sandbox
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Step 3: Check Network Connectivity**
```bash
# Test direct connection to SafePay API
curl -I https://sandbox.api.safepay.pk/v1/payments

# Should return HTTP 405 (Method Not Allowed) - this means server is reachable
```

### **Step 4: Verify CSP Configuration**
Check browser console for CSP violations. Should see no blocks for:
- `https://api.safepay.pk`
- `https://sandbox.api.safepay.pk`
- `https://*.safepay.pk`

## 🧪 **Testing SafePay Integration**

### **Manual Testing**:
1. **Open browser console**
2. **Navigate to pricing page**
3. **Click "Upgrade to Pro"**
4. **Check console for detailed logs**

### **API Testing**:
```javascript
// Test in browser console
fetch('/api/test-safepay')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### **Expected Logs**:
```
🔄 Creating SafePay payment session...
📤 SafePay Request: { url: "...", headers: {...}, payload: {...} }
📥 SafePay Response Status: 200
📥 SafePay Response Headers: {...}
📥 SafePay Raw Response: {...}
✅ SafePay payment session created successfully
```

## 🔍 **Error Analysis**

### **Network Errors**:
```
TypeError: fetch failed
```
**Causes**: DNS issues, network connectivity, firewall blocking

### **Authentication Errors**:
```
401 Unauthorized
```
**Causes**: Invalid API key, wrong secret key, expired credentials

### **API Errors**:
```
400 Bad Request
```
**Causes**: Invalid payload, missing required fields, wrong data format

### **CSP Errors**:
```
Refused to connect to 'https://api.safepay.pk'
```
**Causes**: Missing domain in CSP, incorrect CSP configuration

## 🛠️ **Quick Fixes**

### **Fix 1: Restart Development Server**
```bash
# Stop server (Ctrl+C)
npm run dev
```

### **Fix 2: Clear Browser Cache**
```bash
# Hard refresh
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

### **Fix 3: Check Environment Variables**
```bash
# Verify variables are loaded
node -e "console.log(process.env.SAFEPAY_API_KEY)"
```

### **Fix 4: Test Network Connectivity**
```bash
# Test DNS resolution
nslookup sandbox.api.safepay.pk

# Test HTTP connectivity
curl -v https://sandbox.api.safepay.pk/v1/payments
```

## 📊 **Monitoring & Logs**

### **What to Monitor**:
- Network request success rates
- API response times
- Error patterns and frequencies
- User payment completion rates

### **Log Locations**:
- **Browser Console**: Client-side errors
- **Server Logs**: API request/response details
- **Network Tab**: Request/response inspection
- **SafePay Dashboard**: Transaction status

## 🎯 **Expected Behavior**

### **Successful Flow**:
1. User clicks "Upgrade to Pro"
2. Payment API creates SafePay session
3. User redirects to SafePay payment page
4. User completes payment
5. SafePay sends webhook notification
6. Subscription activates automatically

### **Error Handling**:
1. Network errors show user-friendly messages
2. API errors are logged with full details
3. Users get clear guidance on next steps
4. Failed payments don't charge users

## 🚀 **Production Checklist**

### **Before Deployment**:
- [ ] Test SafePay connectivity
- [ ] Verify all environment variables
- [ ] Test payment flow end-to-end
- [ ] Check webhook handling
- [ ] Verify CSP configuration

### **After Deployment**:
- [ ] Monitor error rates
- [ ] Test payment flow on production
- [ ] Verify webhook delivery
- [ ] Check transaction logs
- [ ] Monitor user feedback

Your SafePay integration should now work properly with enhanced debugging and error handling! 🎉