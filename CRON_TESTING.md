# 🔧 Cron Job Testing Guide

## Quick Test Commands

### Test Locally (Development)
```bash
npm run test:cron
# or
node test-cron-job.js
```

### Test Production Deployment
```bash
# Update the URL to your actual Vercel deployment
TEST_URL=https://your-app.vercel.app npm run test:cron
# or
TEST_URL=https://your-app.vercel.app node test-cron-job.js
```

### Test with Custom Secret
```bash
CRON_SECRET=your_actual_secret TEST_URL=https://your-app.vercel.app node test-cron-job.js
```

## What the Test Script Checks

### ✅ Environment Tests
- Debug cron environment variables
- Simple cron functionality
- Manual cron trigger

### 🔐 Authentication Tests
- Authorized access with correct secret
- Unauthorized access with wrong secret
- Missing authorization header

### 📧 Email System Tests
- Main cron controller
- Direct reminder endpoint
- Email template loading
- Batch email processing

## Test Results Explained

### 🟢 All Tests Pass
Your cron job system is working correctly and ready for production.

### 🟡 Some Tests Fail
Check the specific error messages:

- **401 Unauthorized**: Check your CRON_SECRET environment variable
- **500 Internal Server Error**: Check email configuration (SMTP settings)
- **Connection Error**: Check if your app is running/deployed
- **Timeout**: Your cron job might be taking too long (check Vercel function limits)

## Environment Variables Needed

Make sure these are set in your `.env` file and Vercel environment:

```bash
# Required for cron authentication
CRON_SECRET=qz_cr0n_9am_n0t1f_s3cur3_k3y_2024_xY9mP7qR8wE5

# Required for email sending
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Required for Firebase
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
# ... other Firebase config
```

## Manual Testing Endpoints

You can also test individual endpoints manually:

### 1. Debug Environment
```bash
curl https://your-app.vercel.app/api/debug-cron
```

### 2. Test Cron Job
```bash
curl -H "Authorization: Bearer your-cron-secret" \
     https://your-app.vercel.app/api/cron?type=test
```

### 3. Test Reminder Emails
```bash
curl -H "Authorization: Bearer your-cron-secret" \
     https://your-app.vercel.app/api/cron?type=reminders
```

## Troubleshooting Common Issues

### Issue: "Cannot find module" Error
**Solution**: Make sure all files are properly deployed and the import paths are correct.

### Issue: "Email service not configured"
**Solution**: Check that SMTP_HOST, SMTP_USER, and SMTP_PASS are set in Vercel environment variables.

### Issue: "No users found"
**Solution**: Make sure you have users in your Firestore database with email addresses.

### Issue: "Unauthorized" Error
**Solution**: Verify CRON_SECRET matches between your test and Vercel environment.

### Issue: Function Timeout
**Solution**: 
- Check Vercel function limits (10s for Hobby plan)
- Reduce batch size in cron job
- Optimize database queries

## Vercel Cron Configuration

Make sure your `vercel.json` has:

```json
{
  "crons": [
    {
      "path": "/api/cron?type=reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

## Monitoring in Production

### Vercel Dashboard
1. Go to your Vercel project dashboard
2. Click "Functions" tab
3. Look for `/api/cron/send-reminders` logs
4. Check for errors and execution times

### Success Indicators
- Status: 200 OK
- Response includes: `"success": true`
- Email counts: `"sent": X, "blocked": Y, "failed": 0`

### Error Indicators
- Status: 500 or 401
- Response includes: `"success": false`
- High "failed" count in email results

## Next Steps After Testing

1. **If tests pass**: Your cron job is ready for production
2. **If tests fail**: Fix the issues identified by the test script
3. **Monitor production**: Check Vercel logs regularly
4. **Scale up**: Increase batch sizes and user limits for production load

## Support

If you're still having issues:
1. Run the test script and share the output
2. Check Vercel function logs
3. Verify all environment variables are set correctly
4. Test email configuration separately using `/api/email/test-preferences`