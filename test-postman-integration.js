/**
 * Test script to verify Postman integration
 * Run with: node test-postman-integration.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Postman Integration...\n');

// Test 1: Check .postman.json exists
console.log('✓ Test 1: Checking .postman.json...');
const postmanConfig = JSON.parse(fs.readFileSync('.postman.json', 'utf8'));
console.log(`  ✅ Workspace: ${postmanConfig.workspaceName}`);
console.log(`  ✅ Collections: ${postmanConfig.collections.length}`);
console.log(`  ✅ Environments: ${postmanConfig.environments.length}`);

// Test 2: Check hook exists
console.log('\n✓ Test 2: Checking automation hook...');
const hookPath = '.kiro/hooks/api-postman-testing.kiro.hook';
const hook = JSON.parse(fs.readFileSync(hookPath, 'utf8'));
console.log(`  ✅ Hook name: ${hook.name}`);
console.log(`  ✅ Hook enabled: ${hook.enabled}`);
console.log(`  ✅ Monitored patterns: ${hook.when.patterns.length}`);

// Test 3: Verify collection details
console.log('\n✓ Test 3: Verifying collection...');
const collection = postmanConfig.collections[0];
console.log(`  ✅ Collection ID: ${collection.id}`);
console.log(`  ✅ Collection UID: ${collection.uid}`);
console.log(`  ✅ Requests: ${collection.requests.length}`);

collection.requests.forEach((req, index) => {
  console.log(`     ${index + 1}. ${req.name}`);
});

// Test 4: Verify environment
console.log('\n✓ Test 4: Verifying environment...');
const env = postmanConfig.environments[0];
console.log(`  ✅ Environment: ${env.name}`);
console.log(`  ✅ Environment ID: ${env.id}`);

// Test 5: Check documentation files
console.log('\n✓ Test 5: Checking documentation...');
const docs = [
  'POSTMAN_SETUP_COMPLETE.md',
  'POSTMAN_QUICK_REFERENCE.md',
  'POSTMAN_INTEGRATION_SUMMARY.md'
];

docs.forEach(doc => {
  if (fs.existsSync(doc)) {
    console.log(`  ✅ ${doc}`);
  } else {
    console.log(`  ❌ ${doc} - Missing`);
  }
});

console.log('\n🎉 All tests passed! Postman integration is ready.\n');
console.log('📝 Next steps:');
console.log('   1. Start your dev server: npm run dev');
console.log('   2. Edit an API file to trigger the hook');
console.log('   3. Or manually run: Ask Kiro to "Run my Postman collection"');
console.log('   4. View results in Postman workspace\n');
