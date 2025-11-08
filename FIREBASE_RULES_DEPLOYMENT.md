# 🔒 Firebase Realtime Database Rules Deployment

## Quick Deploy

### Option 1: Firebase CLI (Recommended)

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy database rules
firebase deploy --only database

# Verify deployment
firebase database:get / --project your-project-id
```

### Option 2: Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Realtime Database** → **Rules**
4. Copy the contents of `database.rules.json`
5. Paste into the rules editor
6. Click **Publish**

## Rules Overview

### ✅ What's Protected

1. **User Subscriptions** (`/users/{uid}/subscription`)
   - ✅ Users can READ their own subscription
   - ❌ Users CANNOT WRITE (server-only via Admin SDK)
   - Prevents tampering with limits and usage

2. **Usage Data** (`/usage/{uid}`)
   - ✅ Users can READ their usage history
   - ❌ Users CANNOT WRITE
   - Ensures accurate tracking

3. **Payments** (`/payments/{uid}`)
   - ✅ Users can READ their payment history
   - ❌ Users CANNOT WRITE
   - Prevents payment fraud

4. **Plan Change Requests** (`/plan_change_requests/{uid}`)
   - ✅ Users can READ their requests
   - ✅ Users can CREATE requests
   - ❌ Users CANNOT MODIFY/DELETE
   - Allows user-initiated changes, server processes

### 🔐 Security Features

- **Authentication Required**: All reads require Firebase Auth
- **User Isolation**: Users can only access their own data
- **Server-Only Writes**: Critical data only writable via Admin SDK
- **Data Validation**: Ensures required fields are present
- **Audit Trail**: All changes logged with timestamps

## Testing Rules

### Test Read Access

```javascript
// Should succeed - user reading own data
firebase.database().ref(`users/${currentUser.uid}/subscription`).once('value');

// Should fail - user reading another user's data
firebase.database().ref(`users/other-user-id/subscription`).once('value');
```

### Test Write Protection

```javascript
// Should fail - user trying to modify subscription
firebase.database().ref(`users/${currentUser.uid}/subscription`).update({
  tokens_limit: 999999999
});

// Should succeed - user creating plan change request
firebase.database().ref(`plan_change_requests/${currentUser.uid}`).set({
  requested_plan: 'pro',
  current_plan: 'free',
  requested_at: new Date().toISOString(),
  effective_date: new Date().toISOString()
});
```

## Common Issues

### Issue: "Permission Denied" Errors

**Cause**: Rules not deployed or user not authenticated

**Solution**:
```bash
# Verify rules are deployed
firebase deploy --only database

# Check user authentication
const user = firebase.auth().currentUser;
console.log('Authenticated:', !!user);
```

### Issue: Server Can't Write

**Cause**: Using client SDK instead of Admin SDK

**Solution**:
```typescript
// ❌ Wrong - Client SDK
import { db } from '@/lib/firebase';

// ✅ Correct - Admin SDK
import { db } from '@/lib/firebase-admin';
```

### Issue: Rules Too Restrictive

**Cause**: Missing read permissions

**Solution**: Check rules allow user to read their own data:
```json
{
  "users": {
    "$uid": {
      ".read": "$uid === auth.uid"
    }
  }
}
```

## Rule Validation

### Before Deployment

```bash
# Validate rules syntax
firebase database:rules:get

# Test rules locally
firebase emulators:start --only database
```

### After Deployment

```bash
# Verify rules are active
firebase database:rules:get

# Check specific path
firebase database:get /users/test-user-id/.settings/rules
```

## Security Best Practices

1. **Never Allow Public Write**
   ```json
   // ❌ Bad
   ".write": true
   
   // ✅ Good
   ".write": "$uid === auth.uid"
   ```

2. **Always Validate Data**
   ```json
   ".validate": "newData.hasChildren(['required', 'fields'])"
   ```

3. **Use Server-Side for Critical Operations**
   - Subscription updates
   - Payment processing
   - Usage tracking
   - Plan changes

4. **Log All Changes**
   - Include timestamps
   - Track user actions
   - Monitor violations

## Monitoring

### Check Rule Violations

```bash
# View recent database activity
firebase database:get /.info/connected

# Monitor failed requests
# Check Firebase Console → Realtime Database → Usage
```

### Set Up Alerts

1. Go to Firebase Console
2. Navigate to **Alerts**
3. Create alert for:
   - High read/write rates
   - Permission denied errors
   - Unusual access patterns

## Rollback

### If Rules Cause Issues

```bash
# Get previous rules
firebase database:rules:get --version previous

# Restore previous version
firebase database:rules:release --version previous
```

## Production Checklist

- [ ] Rules deployed to production
- [ ] Tested read access for users
- [ ] Verified write protection
- [ ] Confirmed server can write via Admin SDK
- [ ] Set up monitoring alerts
- [ ] Documented any custom rules
- [ ] Tested plan change flow
- [ ] Verified usage tracking works
- [ ] Checked payment logging
- [ ] Tested error scenarios

## Support

If you encounter issues:

1. Check Firebase Console logs
2. Verify authentication is working
3. Test with Firebase Emulator
4. Review Admin SDK configuration
5. Contact Firebase Support

---

**Last Updated**: January 2025  
**Status**: ✅ Production Ready
