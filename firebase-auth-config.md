# Firebase Auth Action Handler Configuration

## Steps to Fix Password Reset Links:

### 1. Update Firebase Console Settings
Go to Firebase Console → Authentication → Templates → Password reset

**Change the action URL from:**
```
https://quizzicallabs.firebaseapp.com/__/auth/action
```

**To your custom handler:**
```
https://quizzicallabs.vercel.app/auth/action
```

### 2. Update Email Verification Template
Go to Firebase Console → Authentication → Templates → Email address verification

**Change the action URL to:**
```
https://quizzicallabs.vercel.app/auth/action
```

### 3. Test the Setup
1. Deploy your app to Vercel
2. Try password reset from your app
3. Check that the email links now point to your custom handler

## Your Custom Handler Routes:
- Password Reset: `/auth/action?mode=resetPassword&oobCode=...`
- Email Verification: `/auth/action?mode=verifyEmail&oobCode=...`

## Alternative: Use Firebase Hosting Redirect
If you want to keep using Firebase Hosting, add this to `firebase.json`:

```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "/__/auth/action",
        "destination": "/auth/action"
      }
    ]
  }
}
```