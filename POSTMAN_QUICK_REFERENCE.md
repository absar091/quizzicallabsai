# Postman Power - Quick Reference

## Common Commands

### View Your Workspaces
```
Ask Kiro: "Show me my Postman workspaces"
```

### Run Collection Tests
```
Ask Kiro: "Run my Postman collection"
```

### Add New Endpoint
```
Ask Kiro: "Add a POST request to /api/ai/study-guide to my Postman collection"
```

### View Collection Details
```
Ask Kiro: "Show me the requests in my Postman collection"
```

## Quick Actions

### Test Health Endpoint
```bash
curl http://localhost:3000/api/health
```

### View Postman Configuration
```bash
cat .postman.json
```

### Edit Automation Hook
```bash
# Edit: .kiro/hooks/api-postman-testing.kiro.hook
```

## Collection Structure

```
Quizzicallabs AI API
├── Health Check (GET)
├── AI Health Check (GET)
├── Generate Custom Quiz (POST)
├── Get Subscription Status (GET)
└── Quiz Arena - Validate Room (POST)
```

## Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `base_url` | http://localhost:3000 | Base URL for local dev |
| `api_base` | {{base_url}}/api | API base path |

## Useful Postman API Calls

### Get Collection
```javascript
GET https://api.postman.com/collections/50620793-e69c443f-32d5-4a11-906a-79b79db69515
```

### Run Collection
```javascript
POST https://api.postman.com/collections/50620793-e69c443f-32d5-4a11-906a-79b79db69515/runs
```

## Hook Behavior

The automation hook triggers when you edit:
- Any file in `src/app/api/`
- Any file in `src/ai/flows/`
- Any file in `src/lib/`
- `package.json`
- `next.config.ts`

**Action**: Automatically runs Postman collection and reports results

## Tips

1. **Keep server running**: Tests need `npm run dev` active
2. **Check .postman.json**: Contains all your IDs
3. **View in Postman UI**: Best for detailed test results
4. **Use environments**: Switch between local/staging/production
5. **Add test scripts**: Automate validation with JavaScript

## Example Test Script

Add to any request in Postman:

```javascript
// Tests tab in Postman
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Response has required fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('status');
    pm.expect(jsonData).to.have.property('data');
});
```

## Postman Web Links

- **Your Workspace**: https://www.postman.com/absar091-2893472/workspace/quizzicallabs-api-testing
- **API Documentation**: https://learning.postman.com/docs/
- **Newman CLI**: https://learning.postman.com/docs/running-collections/using-newman-cli/

## Need Help?

Ask Kiro:
- "Add more endpoints to my Postman collection"
- "Run Postman tests for my API"
- "Show me Postman test results"
- "Create a new Postman environment for staging"
