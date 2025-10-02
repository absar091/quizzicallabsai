# Cron Job Setup Guide - Study Reminder Emails

## 📧 What It Does

The cron job automatically sends reminder emails to inactive users every day at 10:00 AM UTC.

### Features:
- ✅ Sends personalized study reminders to users inactive for 3+ days
- ✅ Includes user's last studied topics
- ✅ Shows weak areas based on quiz performance
- ✅ Respects email preferences (unsubscribe system)
- ✅ Processes up to 100 users per run
- ✅ Secure with authorization token

## 🔧 Setup Instructions

### 1. Add Environment Variables to Vercel

Go to your Vercel project settings and add these environment variables:

#### **Required Variables:**

```bash
# Cron Job Security
CRON_SECRET=your-secure-random-token-here

# Email Service (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

#### **How to Generate CRON_SECRET:**

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Option 3: Online tool
# Visit: https://generate-secret.vercel.app/32
```

### 2. Configure Email Service

#### **For Gmail:**

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Quizzicallabz Cron"
   - Copy the 16-character password
4. Use this as `EMAIL_PASSWORD`

#### **For Other Email Providers:**

Update `EMAIL_HOST` and `EMAIL_PORT`:

- **Outlook/Hotmail:**
  - Host: `smtp.office365.com`
  - Port: `587`

- **SendGrid:**
  - Host: `smtp.sendgrid.net`
  - Port: `587`
  - User: `apikey`
  - Password: Your SendGrid API key

- **AWS SES:**
  - Host: `email-smtp.us-east-1.amazonaws.com`
  - Port: `587`
  - User: Your SMTP username
  - Password: Your SMTP password

### 3. Verify Cron Job Schedule

The cron job is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 10 * * *"
    }
  ]
}
```

**Schedule Format:** `minute hour day month weekday`

Examples:
- `0 10 * * *` - Every day at 10:00 AM UTC
- `0 9,17 * * *` - Every day at 9:00 AM and 5:00 PM UTC
- `0 10 * * 1-5` - Weekdays only at 10:00 AM UTC
- `0 */6 * * *` - Every 6 hours

### 4. Deploy to Vercel

```bash
# Commit changes
git add .
git commit -m "Add cron job for reminder emails"
git push

# Or deploy directly
vercel --prod
```

### 5. Test the Cron Job

#### **Manual Test (Locally):**

```bash
# Set environment variables in .env.local
CRON_SECRET=your-test-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Test the endpoint
curl http://localhost:3000/api/cron/send-reminders \
  -H "Authorization: Bearer your-test-secret"
```

#### **Test on Vercel:**

1. Go to Vercel Dashboard → Your Project → Settings → Cron Jobs
2. Click "Run" next to your cron job
3. Check logs for execution results

Or use curl:

```bash
curl https://quizzicallabz.vercel.app/api/cron/send-reminders \
  -H "Authorization: Bearer your-cron-secret"
```

## 📊 How It Works

### User Selection Logic:

1. Queries users with `lastActivityAt` older than 3 days
2. Limits to 100 users per run (prevents timeouts)
3. Checks email preferences (skips unsubscribed users)
4. Fetches recent quiz history for personalization

### Email Personalization:

- **User Name:** From user profile
- **Topic:** Last studied topics (up to 3)
- **Weak Areas:** Topics with score < 70%
- **Last Activity:** Date of last quiz/activity

### Rate Limiting:

- 100ms delay between each email
- Maximum 100 emails per cron run
- Prevents hitting email provider limits

## 🔍 Monitoring & Logs

### Check Cron Execution:

1. **Vercel Dashboard:**
   - Go to: Project → Deployments → Functions
   - Filter by `/api/cron/send-reminders`
   - View logs and execution time

2. **Console Logs:**
   ```
   🔔 Starting reminder email cron job...
   📊 Found 45 users eligible for reminders
   ✅ Reminder sent to user@example.com
   🎉 Reminder cron job completed: 43 sent, 2 errors
   ```

### Success Response:

```json
{
  "success": true,
  "message": "Reminder emails sent successfully",
  "sent": 43,
  "errors": 2,
  "total": 45
}
```

### Error Response:

```json
{
  "success": false,
  "error": "Email service not configured"
}
```

## 🛡️ Security Features

1. **Authorization:** Only requests with valid `CRON_SECRET` are processed
2. **Environment Variables:** Sensitive data stored securely
3. **Rate Limiting:** Prevents abuse and email provider blocks
4. **Unsubscribe Support:** Respects user email preferences

## 🐛 Troubleshooting

### Common Issues:

#### 1. **Unauthorized (401)**
- ✅ Check `CRON_SECRET` is set in Vercel environment variables
- ✅ Verify the header: `Authorization: Bearer ${CRON_SECRET}`

#### 2. **Email Not Sending**
- ✅ Verify `EMAIL_USER` and `EMAIL_PASSWORD` are correct
- ✅ For Gmail, ensure App Password is used (not regular password)
- ✅ Check email provider allows SMTP access

#### 3. **No Users Found**
- ✅ Check if users have `lastActivityAt` field in Firestore
- ✅ Verify users are actually inactive for 3+ days

#### 4. **Timeout Errors**
- ✅ Reduce the limit (currently 100 users)
- ✅ Increase delay between emails

## 📝 Customization

### Change Reminder Frequency:

Edit the inactive threshold in `route.ts`:

```typescript
// Current: 3 days
const threeDaysAgo = new Date();
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

// Change to 7 days:
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
```

### Modify Email Template:

Edit `src/lib/email-templates.ts` → `studyReminderEmailTemplate`

### Add More Cron Jobs:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 10 * * *"
    },
    {
      "path": "/api/cron/cleanup-old-data",
      "schedule": "0 2 * * *"
    }
  ]
}
```

## 📚 Additional Resources

- [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs)
- [Cron Schedule Expression](https://crontab.guru/)
- [Nodemailer Documentation](https://nodemailer.com/)

---

**Need Help?** Check the logs in Vercel Dashboard or contact support.
