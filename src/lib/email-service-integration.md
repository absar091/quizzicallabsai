# Email Service Integration Guide

## Overview

This document explains how the email preference system is integrated with all automated emails in the application.

## Architecture

### 1. Email Preferences System
- **Storage**: Firebase Firestore collection `email-preferences`
- **Document ID**: User's email address (lowercase)
- **Structure**:
  ```typescript
  {
    email: string;
    preferences: {
      quizResults: boolean;
      studyReminders: boolean;
      loginAlerts: boolean;
      promotions: boolean;
      newsletters: boolean;
      all: boolean; // If true, user is completely unsubscribed
    };
    createdAt: Timestamp;
    updatedAt: Timestamp;
  }
  ```

### 2. Email Types
- `quizResults`: Quiz completion notifications
- `studyReminders`: Study reminder emails
- `loginAlerts`: Security/login notifications
- `promotions`: Welcome emails, feature announcements
- `newsletters`: Educational content
- `verification`: Email verification (always sent)
- `passwordReset`: Password reset (always sent)

### 3. Integration Points

#### A. Direct Email Functions (src/lib/email.ts)
All email functions now use `sendEmailWithPreferences()` which:
1. Checks user preferences before sending
2. Logs email attempts for analytics
3. Returns blocked status if user opted out

#### B. Automated Email System (src/lib/email-automation.ts)
- `EmailAutomation.sendAutomatedEmail()`: Core function with preference checking
- `EmailAutomation.sendBatchEmails()`: Batch processing with preference filtering
- Convenience functions for common email types

#### C. Cron Jobs (src/app/api/cron/)
- Updated to use the new automation system
- Automatically filters out users who opted out
- Provides detailed reporting on sent/blocked/failed emails

## Usage Examples

### 1. Sending Individual Emails

```typescript
import { sendAutomatedQuizResult } from '@/lib/email-automation';

// This will automatically check preferences
const result = await sendAutomatedQuizResult(
  'user@example.com',
  'John Doe',
  {
    topic: 'Mathematics',
    score: 8,
    total: 10,
    percentage: 80
  }
);

if (result.blocked) {
  console.log('Email blocked:', result.reason);
}
```

### 2. Batch Email Sending

```typescript
import { EmailAutomation } from '@/lib/email-automation';

const recipients = [
  { email: 'user1@example.com', data: { userName: 'User 1' } },
  { email: 'user2@example.com', data: { userName: 'User 2' } }
];

const result = await EmailAutomation.sendBatchEmails(
  recipients,
  'studyReminders',
  ({ userName }) => studyReminderTemplate(userName)
);

console.log(`Sent: ${result.sent}, Blocked: ${result.blocked}`);
```

### 3. Checking Preferences Before Processing

```typescript
import { EmailAutomation } from '@/lib/email-automation';

const canSend = await EmailAutomation.canUserReceiveEmail(
  'user@example.com',
  'quizResults'
);

if (canSend) {
  // Proceed with email generation and sending
}
```

## API Endpoints

### 1. Manage Preferences
- `POST /api/email/preferences` - Update user preferences
- `GET /api/email/preferences?email=user@example.com` - Get preferences

### 2. Unsubscribe
- `POST /api/email/unsubscribe` - Unsubscribe from all emails
- `GET /api/email/unsubscribe?email=user@example.com` - Check unsubscribe status

### 3. Testing
- `POST /api/email/test-preferences` - Test preference checking and email sending
- `GET /api/email/test-preferences?email=user@example.com` - Get preference status

## Integration Checklist

### ✅ Completed Integrations

1. **Email Templates**: Updated with mobile-responsive design
2. **Preference System**: Complete CRUD operations
3. **Email Library**: All functions use preference checking
4. **Login Notifications**: Updated to check preferences
5. **Cron Jobs**: Updated to use batch automation system
6. **Unsubscribe Page**: Enhanced UI and error handling

### 🔄 Automatic Integrations

The following emails now automatically respect user preferences:

- ✅ Quiz result emails
- ✅ Study reminder emails  
- ✅ Login security alerts
- ✅ Welcome emails
- ✅ Promotional emails
- ✅ Newsletter emails

### 🚫 Emails That Bypass Preferences

These critical emails are always sent regardless of preferences:
- Email verification
- Password reset
- Account security alerts (critical)

## Testing

### 1. Test Email Preferences

```bash
# Check if user can receive quiz results
curl -X POST /api/email/test-preferences \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","emailType":"quizResults","action":"check"}'

# Send test email
curl -X POST /api/email/test-preferences \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","emailType":"quizResults","action":"test-send"}'
```

### 2. Test Unsubscribe Flow

```bash
# Update preferences
curl -X POST /api/email/preferences \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","preferences":{"quizResults":false}}'

# Unsubscribe completely
curl -X POST /api/email/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","preferences":{"all":true}}'
```

## Monitoring

### Email Attempt Logging

All email attempts are logged with:
- Email address (anonymized in logs)
- Email type
- Success/failure status
- Reason for blocking (if applicable)

### Analytics Integration

The system is ready for analytics integration:

```typescript
// In email-preferences.ts - logEmailAttempt function
await analytics.track('email_attempt', {
  emailType,
  sent: boolean,
  reason?: string
});
```

## Error Handling

The system includes comprehensive error handling:

1. **Network Issues**: Automatic retries with exponential backoff
2. **Invalid Emails**: Validation and graceful failure
3. **Preference Errors**: Fail-safe to allow emails (better to send than miss critical emails)
4. **Batch Processing**: Individual email failures don't stop the batch

## Performance Considerations

1. **Batch Processing**: Emails are sent in configurable batches (default: 10)
2. **Rate Limiting**: Delays between batches to avoid overwhelming email service
3. **Preference Caching**: Consider implementing Redis cache for high-volume scenarios
4. **Database Optimization**: Indexes on email fields for fast preference lookups

## Future Enhancements

1. **Email Templates**: A/B testing system
2. **Preference Granularity**: More specific email categories
3. **Scheduling**: User-defined email timing preferences
4. **Analytics Dashboard**: Email performance metrics
5. **Webhook Integration**: Real-time email status updates