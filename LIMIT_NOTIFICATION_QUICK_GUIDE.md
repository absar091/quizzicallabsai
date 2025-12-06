# Usage Limit Notifications - Quick Reference Guide

## For Developers

### Using the Limit Reached Dialog in Frontend

```tsx
import { LimitReachedDialog } from '@/components/limit-reached-dialog';
import { parseApiError } from '@/lib/api-error-handler';

// In your component
const [limitDialog, setLimitDialog] = useState({ open: false, details: null });

// When handling API errors
try {
  const response = await fetch('/api/ai/custom-quiz', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quizData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    const parsedError = parseApiError(errorData);
    
    if (parsedError.isLimitReached) {
      // Show limit dialog
      setLimitDialog({
        open: true,
        details: parsedError.details
      });
    } else {
      // Show regular error toast
      toast({
        title: parsedError.title,
        description: parsedError.message,
        variant: "destructive"
      });
    }
    return;
  }

  // Handle success
  const data = await response.json();
  // ...
} catch (error) {
  console.error('Error:', error);
}

// Render the dialog
<LimitReachedDialog
  open={limitDialog.open}
  onOpenChange={(open) => setLimitDialog({ ...limitDialog, open })}
  details={limitDialog.details}
/>
```

### Checking Limits in API Routes

```typescript
import { checkTokenLimit } from '@/lib/check-limit';
import { auth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  // Authenticate user
  const authHeader = request.headers.get('authorization');
  const token = authHeader.split('Bearer ')[1];
  const decoded = await auth.verifyIdToken(token);
  const userId = decoded.uid;
  const userEmail = decoded.email || undefined;
  const userName = decoded.name || decoded.email?.split('@')[0] || undefined;

  // Check limit
  const limitCheck = await checkTokenLimit(userId, userEmail, userName);
  
  if (!limitCheck.allowed) {
    // Send email notification (async, don't wait)
    if (limitCheck.limitReached) {
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/limit-reached`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ limitType: 'tokens' })
      }).catch(err => console.error('Failed to send limit email:', err));
    }

    // Return error response
    return NextResponse.json(
      { 
        error: limitCheck.errorMessage || 'Your token limit has been reached.',
        code: 'LIMIT_REACHED',
        details: {
          planName: limitCheck.planName,
          tokensUsed: limitCheck.tokensUsed,
          tokensLimit: limitCheck.tokensLimit,
          resetDate: limitCheck.resetDate,
          upgradeUrl: limitCheck.upgradeUrl
        },
        remaining: limitCheck.remaining
      },
      { status: 402 }
    );
  }

  // Continue with API logic
  const { remaining } = limitCheck;
  // ...
}
```

---

## For Testing

### Test Limit Reached Scenario

1. **Set user to limit in Firebase:**
   ```
   Firebase Realtime Database:
   users/{userId}/subscription/tokens_remaining = 0
   ```

2. **Attempt quiz generation**

3. **Verify:**
   - ✅ Clear error message shown
   - ✅ Email received
   - ✅ Upgrade button works
   - ✅ Support email visible

### Test Email Notification

```bash
# Use the API endpoint directly
curl -X POST https://your-domain.com/api/notifications/limit-reached \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"limitType": "tokens"}'
```

---

## Error Response Format

### Limit Reached Error (402)

```json
{
  "error": "Your Free plan token limit has been reached. Upgrade to continue or wait until January 1, 2025 for your limit to reset.",
  "code": "LIMIT_REACHED",
  "details": {
    "planName": "Free",
    "tokensUsed": 10000,
    "tokensLimit": 10000,
    "resetDate": "January 1, 2025",
    "upgradeUrl": "/pricing"
  },
  "remaining": 0
}
```

### Other Errors (500)

```json
{
  "error": "AI service is currently busy. Please try again in a few minutes.",
  "code": "SERVICE_BUSY"
}
```

---

## Email Template Preview

**Subject:** 🪙 AI Token Limit Reached - Upgrade to Continue

**Content:**
- Current plan and usage statistics
- Two clear options:
  1. Upgrade to higher plan (with button)
  2. Wait for monthly reset (with date)
- Support contact information
- Professional design with dark mode support

---

## Plan Limits Reference

| Plan | Tokens/Month | Quizzes/Month | AI Model |
|------|--------------|---------------|----------|
| Free | 10,000 | 10 | Gemini 1.5 Flash |
| Pro | 100,000 | 100 | Gemini 2.5 Pro |
| Premium | 500,000 | 500 | Gemini 2.5 Pro |
| Ultimate | 2,000,000 | Unlimited | Gemini 2.5 Pro |

---

## Support

For questions or issues:
- **Email:** support@quizzicallabs.com
- **Documentation:** See USAGE_LIMIT_NOTIFICATIONS_COMPLETE.md
