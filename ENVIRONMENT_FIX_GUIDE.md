# 🔧 Environment Configuration Fix Guide

**Date:** December 6, 2025  
**Status:** 🚨 Critical Issues Detected

---

## 📊 Current Health Status

| Service | Status | Issue |
|---------|--------|-------|
| **Database** | ❌ Unhealthy | Firebase Admin permissions denied |
| **AI** | ❌ Unhealthy | Gemini API key not configured |
| **Email** | ✅ Healthy | SMTP configured correctly |
| **Storage** | ❌ Unhealthy | Firebase Storage not configured |

---

## 🔥 Critical Issues

### Issue 1: Firebase Admin Permissions (PERMISSION_DENIED)

**Error:**
```
Caller does not have required permission to use project quizzicallabs. 
Grant the caller the roles/serviceusage.serviceUsageConsumer role
```

**Root Cause:** The Firebase service account doesn't have proper IAM permissions.

**Fix Steps:**

#### Option A: Grant Service Account Permissions (Recommended)

1. **Go to Firebase Console:**
   ```
   https://console.firebase.google.com/project/quizzicallabs/settings/serviceaccounts/adminsdk
   ```

2. **Go to Google Cloud IAM:**
   ```
   https://console.cloud.google.com/iam-admin/iam?project=quizzicallabs
   ```

3. **Find your service account:**
   ```
   firebase-adminsdk-fbsvc@quizzicallabs.iam.gserviceaccount.com
   ```

4. **Add these roles:**
   - ✅ `Service Usage Consumer` (roles/serviceusage.serviceUsageConsumer)
   - ✅ `Firebase Admin SDK Administrator Service Agent`
   - ✅ `Firebase Realtime Database Admin`
   - ✅ `Cloud Datastore User`

5. **Click "Save" and wait 2-5 minutes for propagation**

#### Option B: Generate New Service Account (Alternative)

1. **Go to Firebase Console:**
   ```
   https://console.firebase.google.com/project/quizzicallabs/settings/serviceaccounts/adminsdk
   ```

2. **Click "Generate New Private Key"**

3. **Download the JSON file**

4. **Update `.env.local` with new credentials:**
   ```bash
   FIREBASE_PROJECT_ID=quizzicallabs
   FIREBASE_PRIVATE_KEY_ID=<from JSON>
   FIREBASE_PRIVATE_KEY="<from JSON - keep quotes and \n>"
   FIREBASE_CLIENT_EMAIL=<from JSON>
   FIREBASE_CLIENT_ID=<from JSON>
   ```

---

### Issue 2: Gemini API Key Not Configured

**Error:**
```
Gemini API key not configured
```

**Root Cause:** The environment variable is not being read correctly by the AI service.

**Fix Steps:**

1. **Verify API keys are valid:**
   ```bash
   node check-env-health.js
   ```

2. **Test API key directly:**
   ```bash
   curl "https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyAJmSl0Mvfv4iFJhDCiM4n_pEPfWLDq5i0"
   ```

3. **If keys are invalid, generate new ones:**
   - Go to: https://makersuite.google.com/app/apikey
   - Create new API keys
   - Update `.env.local`:
     ```bash
     GEMINI_API_KEY_1=your_new_key_1
     GEMINI_API_KEY_2=your_new_key_2
     GEMINI_API_KEY_3=your_new_key_3
     GEMINI_API_KEY_4=your_new_key_4
     GEMINI_API_KEY_5=your_new_key_5
     ```

4. **Restart the development server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

---

### Issue 3: Firebase Storage Not Configured

**Error:**
```
Firebase Storage not configured
```

**Root Cause:** Missing `FIREBASE_ADMIN_PROJECT_ID` environment variable.

**Fix:**

Add to `.env.local`:
```bash
FIREBASE_ADMIN_PROJECT_ID=quizzicallabs
```

---

## 🚀 Quick Fix Script

Run this automated fix script:

```bash
node fix-environment.js
```

This will:
1. ✅ Validate all environment variables
2. ✅ Test Firebase Admin connection
3. ✅ Test Gemini API keys
4. ✅ Test SMTP configuration
5. ✅ Generate fix recommendations

---

## 📝 Manual Verification Steps

### Step 1: Check Firebase Admin

```bash
node -e "
const admin = require('firebase-admin');
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\\\n/g, '\\n')
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
});
console.log('✅ Firebase Admin initialized successfully');
admin.auth().listUsers(1).then(() => console.log('✅ Auth working')).catch(e => console.error('❌ Auth error:', e.message));
"
```

### Step 2: Check Gemini API

```bash
curl -X GET \
  "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY_1" \
  -H "Content-Type: application/json"
```

Expected: List of available models

### Step 3: Check SMTP

```bash
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
transporter.verify().then(() => console.log('✅ SMTP working')).catch(e => console.error('❌ SMTP error:', e.message));
"
```

---

## 🔄 After Fixing

1. **Restart development server:**
   ```bash
   npm run dev
   ```

2. **Test health endpoint:**
   ```bash
   curl http://localhost:3000/api/health
   ```

3. **Expected result:**
   ```json
   {
     "database": { "status": "healthy" },
     "ai": { "status": "healthy" },
     "email": { "status": "healthy" },
     "storage": { "status": "healthy" },
     "overall": { "status": "healthy" }
   }
   ```

---

## 🆘 Troubleshooting

### Firebase Admin Still Failing

**Try these in order:**

1. **Check service account email:**
   ```bash
   echo $FIREBASE_CLIENT_EMAIL
   ```
   Should be: `firebase-adminsdk-fbsvc@quizzicallabs.iam.gserviceaccount.com`

2. **Verify private key format:**
   ```bash
   echo "$FIREBASE_PRIVATE_KEY" | head -1
   ```
   Should start with: `-----BEGIN PRIVATE KEY-----`

3. **Check IAM permissions:**
   - Go to: https://console.cloud.google.com/iam-admin/iam?project=quizzicallabs
   - Search for: `firebase-adminsdk-fbsvc@quizzicallabs.iam.gserviceaccount.com`
   - Verify roles are assigned

4. **Wait for propagation:**
   - IAM changes can take 2-10 minutes
   - Try again after waiting

### Gemini API Still Failing

1. **Check quota:**
   - Go to: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas?project=quizzicallabs
   - Verify you haven't exceeded limits

2. **Enable API:**
   - Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com?project=quizzicallabs
   - Click "Enable"

3. **Generate new keys:**
   - Go to: https://makersuite.google.com/app/apikey
   - Create 5 new keys
   - Update `.env.local`

### Storage Still Failing

1. **Enable Firebase Storage:**
   - Go to: https://console.firebase.google.com/project/quizzicallabs/storage
   - Click "Get Started"
   - Follow setup wizard

2. **Add storage bucket to env:**
   ```bash
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=quizzicallabs.firebasestorage.app
   ```

---

## 📋 Checklist

Before proceeding, ensure:

- [ ] Firebase Admin service account has proper IAM roles
- [ ] Waited 5 minutes after IAM changes
- [ ] Gemini API keys are valid and not rate-limited
- [ ] Firebase Storage is enabled in console
- [ ] All environment variables are set correctly
- [ ] Development server restarted after changes
- [ ] Health endpoint returns all "healthy" statuses

---

## 🔗 Useful Links

- **Firebase Console:** https://console.firebase.google.com/project/quizzicallabs
- **Google Cloud IAM:** https://console.cloud.google.com/iam-admin/iam?project=quizzicallabs
- **Gemini API Keys:** https://makersuite.google.com/app/apikey
- **Firebase Storage:** https://console.firebase.google.com/project/quizzicallabs/storage
- **API Quotas:** https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas?project=quizzicallabs

---

**Next Steps:** Run `node fix-environment.js` to automatically diagnose and fix issues.
