# Cron Job Setup Guide for Email Reminders

## 🔧 Environment Variables Required

Make sure these are set in your `.env` file and Vercel environment:

```bash
# Cron Authentication
CRON_SECRET=qz_cr0n_9am_n0t1f_s3cur3_k3y_2024_xY9mP7qR8wE5

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
# ... other Firebase config
```

## 🚀 Available Cron Endpoints

### 1. Main Cron Controller
```
GET /api/cron?type=reminders
Authorization: Bearer qz_cr0n_9am_n0t1f_s3cur3_k3y_2024_xY9mP7qR8wE5
```

### 2. Direct Reminder Endpoint
```
GET /api/cron/send-reminders
Authorization: Bearer qz_cr0n_9am_n0t1f_s3cur3_k3y_2024_xY9mP7qR8wE5
```

### 3. Test Endpoints
```
GET /api/cron/test
GET /api/test-cron-manual
```

## 🧪 Testing Steps

### Step 1: Test Environment Setup
```bash
curl -X GET "https://your-domain.vercel.app/api/cron/test"
```

### Step 2: Test Manual Cron Trigger
```bash
curl -X GET "https://your-domain.vercel.app/api/test-cron-manual"
```

### Step 3: Test Direct Cron Call
```bash
curl -X GET "https://your-domain.vercel.app/api/cron/send-reminders" \
  -H "Authorization: Bearer qz_cr0n_9am_n0t1f_s3cur3_k3y_2024_xY9mP7qR8wE5"
```

### Step 4: Test Main Cron Controller
```bash
curl -X GET "https://your-domain.vercel.app/api/cron?type=reminders" \
  -H "Authorization: Bearer qz_cr0n_9am_n0t1f_s3cur3_k3y_2024_xY9mP7qR8wE5"
```

## 📅 Vercel Cron Configuration

Add this to your `vercel.json`:

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

This will run daily at 9 AM UTC.

## 🔍 Debugging

### Check Vercel Logs
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Functions" tab
4. Look for `/api/cron/send-reminders` logs

### Common Issues & Solutions

#### 1. 401 Unauthorized
- Check CRON_SECRET is set correctly in Vercel environment
- Ensure Authorization header format: `Bearer your-secret`

#### 2. 500 Email Service Not Configured
- Verify SMTP_HOST, SMTP_USER, SMTP_PASS are set
- Test email configuration with `/api/email/test-preferences`

#### 3. Firebase Connection Issues
- Check Firebase environment variables
- Verify Firestore rules allow read access

#### 4. No Users Found
- Check if users collection exists in Firestore
- Verify user documents have email field

## 📊 Monitoring

### Success Response
```json
{
  "success": true,
  "message": "Reminder emails processed successfully",
  "sent": 5,
  "blocked": 2,
  "failed": 0,
  "total": 7
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": "Stack trace"
}
```

## 🎯 Email Preference Integration

The cron job automatically:
- ✅ Checks user email preferences before sending
- ✅ Skips users who opted out of study reminders
- ✅ Logs all email attempts for analytics
- ✅ Provides detailed reporting on sent/blocked/failed emails

## 🔄 Cron Job Flow

1. **Authentication**: Verify CRON_SECRET
2. **Environment Check**: Verify email service configuration
3. **User Query**: Fetch users from Firestore
4. **Data Processing**: Prepare personalized reminder data
5. **Preference Check**: Filter users based on email preferences
6. **Batch Sending**: Send emails in batches with delays
7. **Reporting**: Return detailed statistics

## 📈 Scaling Considerations

- **Batch Size**: Currently set to 5 emails per batch
- **Delay**: 2 seconds between batches
- **User Limit**: 10 users per cron run (for testing)
- **Timeout**: Vercel functions have 10s timeout on Hobby plan

For production, increase limits in `/api/cron/send-reminders/route.ts`:
```typescript
const usersQuery = query(usersRef, limit(100)); // Increase limit
batchSize: 10, // Increase batch size
delayBetweenBatches: 1000 // Reduce delay
```

## 🚨 Production Checklist

- [ ] CRON_SECRET set in Vercel environment
- [ ] SMTP credentials configured and tested
- [ ] Firebase connection working
- [ ] Email templates loading correctly
- [ ] User preferences system working
- [ ] Cron schedule configured in vercel.json
- [ ] Monitoring and alerting set up
- [ ] Rate limits appropriate for email service