# Enhanced Notification System

This document describes the comprehensive notification system implemented for Quizzicallabs, providing user onboarding, engagement, and retention features.

## Overview

The notification system includes:
- **Welcome Notifications**: Automated onboarding sequence for new users
- **Feature Introduction**: Progressive feature discovery
- **Daily Reminders**: Learning habit formation
- **Engagement Notifications**: User retention and activity boosting
- **Re-engagement**: Win back inactive users

## Architecture

### Core Components

1. **Notification Service** (`src/services/notification-service.ts`)
   - Firebase Admin SDK integration
   - Multiple notification types
   - Token management and cleanup

2. **Notification Handler** (`src/components/notification-handler.tsx`)
   - Client-side FCM message handling
   - Toast notifications with actions
   - Background notification processing

3. **API Endpoints**
   - `/api/cron` - Cron job endpoint for automated notifications
   - `/api/notifications/welcome` - Welcome notification trigger

## Notification Types

### 1. Welcome Notifications
- **Trigger**: Automatically sent when new users sign up
- **Content**: Welcome message with call-to-action
- **Timing**: Immediate + scheduled feature introductions

### 2. Feature Introduction Notifications
- **Quiz Generation** (24 hours after signup)
- **Study Guides** (3 days after signup)
- **Shared Quizzes** (7 days after signup)
- **Practice Questions** (Available for manual triggering)
- **Exam Papers** (Available for manual triggering)

### 3. Daily Reminder Notifications
- **Timing**: 9 AM daily
- **Purpose**: Build learning habits
- **Content**: Motivational quiz reminders

### 4. Engagement Notifications
- **Streak Reminders**: Maintain learning streaks
- **Progress Check**: Dashboard activity encouragement
- **New Features**: Highlight available features
- **Timing**: Random selection, sent periodically

### 5. Re-engagement Notifications
- **Target**: Users inactive for 7+ days
- **Purpose**: Win back lapsed users
- **Content**: Personalized return prompts

## Setup and Configuration

### Environment Variables Required

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
NEXT_PUBLIC_FCM_VAPID_KEY=your_vapid_key
FIREBASE_PRIVATE_KEY_ID=your_key_id
FIREBASE_CLIENT_ID=your_client_id

# Cron Jobs
CRON_SECRET=your_cron_secret
```

### Firebase Configuration

1. **Enable Firebase Cloud Messaging** in Firebase Console
2. **Generate VAPID Key** for web push notifications
3. **Configure Firebase Admin SDK** with service account credentials
4. **Set up Realtime Database** for token storage

### Cron Job Setup

Set up the following cron jobs in Vercel or your hosting platform:

```bash
# Daily reminders at 9 AM
0 9 * * * curl -X GET "https://yourdomain.com/api/cron?type=daily" -H "Authorization: Bearer YOUR_CRON_SECRET"

# Engagement notifications (every 3 hours)
0 */3 * * * curl -X GET "https://yourdomain.com/api/cron?type=engagement" -H "Authorization: Bearer YOUR_CRON_SECRET"

# Inactive user notifications (weekly)
0 10 * * 1 curl -X GET "https://yourdomain.com/api/cron?type=inactive" -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## API Usage

### Cron Endpoint

```bash
GET /api/cron
GET /api/cron?type=daily
GET /api/cron?type=engagement
GET /api/cron?type=inactive
```

**Headers:**
```
Authorization: Bearer YOUR_CRON_SECRET
```

### Welcome Notification Endpoint

```bash
POST /api/notifications/welcome
```

**Headers:**
```
Authorization: Bearer USER_ID_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "userId": "firebase_user_uid"
}
```

## Client-Side Integration

### Automatic Triggers

- **Welcome Notifications**: Triggered automatically in AuthContext when new users sign up
- **Feature Introductions**: Scheduled automatically after welcome notification
- **Token Management**: Handled automatically by NotificationHandler component

### Manual Triggers

```typescript
import { sendWelcomeNotifications } from '@/services/notification-service';

// Trigger welcome notifications manually
const result = await sendWelcomeNotifications(userId);
```

## Notification Payload Structure

```typescript
interface NotificationPayload {
  notification: {
    title: string;
    body: string;
    icon: string;
  };
  data: {
    type: string; // 'welcome', 'feature_intro', 'daily_reminder', etc.
    action: string; // 'take_quiz', 'view_dashboard', etc.
    click_action: string; // URL to navigate to
    feature?: string; // For feature introductions
  };
}
```

## Customization

### Adding New Notification Types

1. Add new function in `notification-service.ts`
2. Update cron endpoint to handle new type
3. Add handling in `notification-handler.tsx`
4. Update documentation

### Modifying Notification Content

Edit the notification content in the respective functions in `notification-service.ts`:

```typescript
const notificationData = {
  title: 'Your Custom Title',
  body: 'Your custom message',
  click_action: 'https://your-url.com'
};
```

### Adjusting Timing

Modify the `setTimeout` calls in `sendWelcomeNotifications()`:

```typescript
setTimeout(async () => {
  await sendFeatureIntroductionNotification(userId, 'feature_name');
}, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
```

## Monitoring and Analytics

### Success/Failure Tracking

All notification functions return:
```typescript
{
  successCount: number;
  failureCount: number;
  error?: string;
}
```

### Logging

- Successful sends are logged with counts
- Failed sends include sanitized error messages
- Token cleanup is logged for maintenance

### Firebase Console

Monitor notification delivery in Firebase Console:
- **Cloud Messaging** > **Reports**
- Token registration and delivery statistics
- Error rates and failure reasons

## Troubleshooting

### Common Issues

1. **Notifications not sending**
   - Check Firebase Admin SDK configuration
   - Verify environment variables
   - Confirm FCM tokens are stored

2. **Tokens not registering**
   - Check service worker registration
   - Verify VAPID key configuration
   - Confirm notification permissions

3. **Cron jobs failing**
   - Check CRON_SECRET configuration
   - Verify endpoint URLs
   - Monitor Vercel function logs

### Debug Mode

Enable detailed logging by checking the console for:
- Token registration status
- Notification send results
- Error messages with sanitized data

## Security Considerations

- **Token Sanitization**: All logs sanitize sensitive data
- **Authentication**: Cron endpoints require Bearer token
- **Rate Limiting**: Consider implementing rate limits for manual triggers
- **Data Privacy**: FCM tokens are encrypted and securely stored

## Future Enhancements

- **A/B Testing**: Test different notification content
- **Personalization**: User-specific notification content
- **Analytics Integration**: Track notification effectiveness
- **Smart Timing**: AI-powered optimal send times
- **Multi-language Support**: Localized notifications

## Support

For issues or questions about the notification system:
1. Check Firebase Console for delivery reports
2. Review server logs for error details
3. Verify configuration against this documentation
4. Test with manual API calls using tools like Postman
