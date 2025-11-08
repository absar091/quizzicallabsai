# 📋 Subscription System - Quick Reference Card

## 🚀 Quick Commands

### Deploy Firebase Rules
```bash
firebase deploy --only database
```

### Test Plan Change
```bash
curl -X POST /api/subscription/change-plan \
  -H "Authorization: Bearer TOKEN" \
  -d '{"requestedPlan":"pro","currentPlan":"free"}'
```

### Trigger Monthly Reset
```bash
curl -X POST /api/cron/reset-usage \
  -H "Authorization: Bearer CRON_SECRET"
```

---

## 📊 Pricing Plans

| Plan | Price | Tokens | Quizzes |
|------|-------|--------|---------|
| Free | $0 | 100K | 20 |
| Basic | $1.05 | 250K | 45 |
| Pro | $2.10 | 500K | 90 |
| Premium | $3.86 | 1M | 180 |

---

## 🔄 Plan Change Logic

| Change Type | When Applied | Checkout Required |
|-------------|--------------|-------------------|
| **Upgrade** | Immediate | ✅ Yes |
| **Downgrade** | Next billing cycle | ❌ No |
| **Switch** | Immediate | ✅ Yes |

---

## 🔒 Firebase Rules Summary

```json
{
  "users/$uid/subscription": {
    ".read": "auth.uid === $uid",
    ".write": false  // Server only
  }
}
```

---

## 🚨 Common Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| `AUTH_REQUIRED` | Not signed in | Sign in |
| `USAGE_LIMIT_EXCEEDED` | Limit reached | Upgrade |
| `CHECKOUT_FAILED` | Payment issue | Retry |
| `INVALID_PLAN` | Bad plan ID | Check plans |

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/lib/whop.ts` | Core service |
| `src/lib/plan-switching.ts` | Plan changes |
| `src/hooks/useSubscription.ts` | React hook |
| `database.rules.json` | Security rules |

---

## 🔗 Important URLs

| Page | URL |
|------|-----|
| Pricing | `/pricing` |
| Billing | `/billing` |
| Dashboard | `/dashboard` |
| Webhook | `/api/webhooks/whop` |

---

## 💻 Code Snippets

### Check Usage
```typescript
const { canPerformAction } = useSubscription();
if (!canPerformAction('token', 5000)) {
  // Show upgrade modal
}
```

### Track Usage
```typescript
const { trackTokenUsage } = useSubscription();
await trackTokenUsage(5000);
```

### Handle Errors
```typescript
const { handleError, ErrorDisplay } = useSubscriptionError();
try {
  await action();
} catch (err) {
  handleError(err);
}
return <ErrorDisplay />;
```

---

## 📞 Support

- **Docs**: `SUBSCRIPTION_SYSTEM_README.md`
- **Setup**: `QUICK_START_SUBSCRIPTION.md`
- **Rules**: `FIREBASE_RULES_DEPLOYMENT.md`
- **Status**: `FINAL_IMPLEMENTATION_COMPLETE.md`

---

**Version**: 2.0.0 | **Status**: Production Ready ✅
