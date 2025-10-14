# 🔑 Google AI API Key Rotation System

## Overview
This system automatically rotates through multiple Google AI API keys to prevent overloading a single key and distribute usage across all available keys.

## Features
- ✅ **Automatic Rotation**: Cycles through 5 API keys
- ✅ **Usage Tracking**: Monitors requests per key
- ✅ **Smart Rotation**: Rotates after 50 requests per key
- ✅ **Error Handling**: Auto-rotates on quota/rate limit errors
- ✅ **Persistent State**: Remembers rotation state across sessions
- ✅ **Admin Controls**: Manual rotation and monitoring
- ✅ **Environment Variables**: Secure key management

## API Keys Configured
```javascript
// 5 Google AI API Keys (loaded from environment variables)
[GEMINI_API_KEY_1=AIzaSyAzd8xI7Hz6djjdkdk4jw03sk0CXRhjDMb5RmS-yn4FZ9GY  // Key 1 (original)
GEMINI_API_KEY_2=AIzaSyDhkedmdmd93939499-dmddmiwHyNddkdd1ohdpcjCb8JGn-vBATYn-IQ  // Key 2
GEMINI_API_KEY_3=AIzaSyCe92jx xs_GeFE4w--h0lfsssksIqmsFk8dFlggB0_fy0XXQ  // Key 3
GEMINI_API_KEY_4=AIzaSyCvmdkdijjixxdBGmTT1HITqTnggDAaYfffffdqYln3vmmrbonE  // Key 4
GEMINI_API_KEY_5=AIzaSdkkmxdkdoyALk7mhPrBLFwsddkdddoe;lkddoXxXpOb_DwP2uy84MSSM  // Key 5}
(These are only placeholder API keys,use your actula API key)
```

## How It Works

### Automatic Rotation
1. **First Request**: Uses Key 1
2. **After 50 requests**: Rotates to Key 2
3. **After 50 more**: Rotates to Key 3
4. **After 50 more**: Rotates to Key 4
5. **Cycle repeats**: Back to Key 1

### Error-Based Rotation
- **Quota Exceeded**: Auto-rotates to next key
- **Rate Limited**: Auto-rotates to next key
- **API Errors**: Logs and rotates if needed

## Usage

### Check Status
```bash
# Get current API key status
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     http://localhost:3000/api/admin/api-keys
```

Response:
```json
{
  "success": true,
  "apiKeyStatus": {
    "currentKeyIndex": 2,
    "totalKeys": 5,
    "usageCount": 23,
    "maxUsagePerKey": 50,
    "currentKey": "AIzaSyCvBGmTT1HITqTnggDAaYqYln3vmmrbonE..."
  },
  "timestamp": "2025-09-05T12:38:54.000Z"
}
```

### Manual Rotation
```bash
# Force rotate to next key
curl -X POST \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"action": "rotate"}' \
     http://localhost:3000/api/admin/api-keys
```

### Reset Usage Count
```bash
# Reset usage counter for current key
curl -X POST \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"action": "reset"}' \
     http://localhost:3000/api/admin/api-keys
```

## Configuration

### Environment Variables
```bash
# Admin token for API management
ADMIN_API_TOKEN=your_secure_admin_token_here
```

### Customization
You can modify these settings in `src/lib/api-key-manager.ts`:

```javascript
// Change rotation threshold
private readonly maxUsagePerKey: number = 50;

// Add more API keys
this.apiKeys = [
  'key1',
  'key2',
  'key3',
  'key4',
  'key5'  // Add more as needed
];
```

## Monitoring

### Console Logs
The system logs rotation events:
```
🔑 Using API Key rotation - Current key: AIzaSyDh9-miwHyN1ohdpcjCb8JGn-vBATYn-IQ...
🔄 Rotated to API Key 2/4
🔄 Rotated to API Key 3/4
⚠️ API Error detected, rotating to next key
```

### Local Storage
State is persisted in browser:
```javascript
localStorage.getItem('apiKeyState');
// Returns: {"currentKeyIndex": 1, "usageCount": 23, "lastUpdated": 1234567890}
```

## Benefits

### Load Distribution
- **Prevents Quota Exhaustion**: No single key gets overloaded
- **Rate Limit Management**: Distributes requests across keys
- **Reliability**: Continues working if one key has issues

### Cost Optimization
- **Balanced Usage**: All keys used equally
- **Quota Management**: Avoids hitting limits on individual keys
- **Fallback System**: Automatic recovery from key issues

### Performance
- **Reduced Latency**: Less chance of rate limiting
- **Higher Throughput**: Multiple keys = more requests per minute
- **Better Reliability**: Redundancy across keys

## Troubleshooting

### Common Issues

**Keys Not Rotating**
- Check console logs for rotation messages
- Verify localStorage has `apiKeyState`
- Ensure `maxUsagePerKey` threshold is reached

**API Errors**
- Check if all keys are valid
- Verify quota limits on each key
- Monitor Firebase console for usage

**State Not Persisting**
- Check localStorage permissions
- Verify browser storage is not cleared
- Ensure `loadState()` is called on initialization

## Security Notes

- ✅ API keys are stored securely (not exposed to client)
- ✅ Keys are masked in logs and responses
- ✅ Admin endpoints require authentication
- ✅ State is stored locally (not in database)

## Future Enhancements

- [ ] **Health Checks**: Automatically test key validity
- [ ] **Usage Analytics**: Detailed per-key usage reports
- [ ] **Dynamic Thresholds**: Adjust rotation based on time/usage
- [ ] **Key Prioritization**: Prefer keys with higher quotas
- [ ] **Alert System**: Notifications for key issues

---

**🎯 Result**: Your Quizzicallabs AI now efficiently distributes API requests across 5 keys, preventing overload and ensuring reliable service!
