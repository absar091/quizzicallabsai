/**
 * Quick API Test Script with Authentication
 * 
 * This script tests the Quizzicallabs API endpoints with proper authentication.
 * Run with: node test-api-with-auth.js
 * 
 * Prerequisites:
 * 1. Development server running on http://localhost:3000
 * 2. Valid Firebase credentials in .env.local
 */

const API_BASE = 'http://localhost:3000';

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, status, message, data = null) {
  const emoji = status === 'PASS' ? '✅' : '❌';
  console.log(`${emoji} ${name}: ${message}`);
  if (data) {
    console.log('   Data:', JSON.stringify(data, null, 2));
  }
  
  results.tests.push({ name, status, message, data });
  if (status === 'PASS') results.passed++;
  else results.failed++;
}

async function testHealthCheck() {
  console.log('\n📝 Test 1: Health Check (No Auth Required)');
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    const data = await response.json();
    
    if (response.ok && data.overall) {
      logTest('Health Check', 'PASS', `Server healthy - ${data.overall.status}`, {
        database: data.database?.status,
        ai: data.ai?.status,
        email: data.email?.status,
        uptime: `${Math.floor(data.uptime)}s`
      });
    } else {
      logTest('Health Check', 'FAIL', `Unexpected response: ${response.status}`);
    }
  } catch (error) {
    logTest('Health Check', 'FAIL', `Error: ${error.message}`);
  }
}

async function testRecaptchaVerify() {
  console.log('\n📝 Test 2: reCAPTCHA Verify (No Auth Required)');
  try {
    const response = await fetch(`${API_BASE}/api/recaptcha/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'test-token' })
    });
    
    const data = await response.json();
    
    // Expected to fail with invalid token, but should return proper error
    if (response.status === 400 || response.status === 500) {
      logTest('reCAPTCHA Verify', 'PASS', 'Endpoint responding correctly to invalid token', {
        status: response.status,
        error: data.error
      });
    } else {
      logTest('reCAPTCHA Verify', 'FAIL', `Unexpected status: ${response.status}`);
    }
  } catch (error) {
    logTest('reCAPTCHA Verify', 'FAIL', `Error: ${error.message}`);
  }
}

async function testAuthRequired(endpoint, name) {
  console.log(`\n📝 Test: ${name} (Auth Required)`);
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true })
    });
    
    const data = await response.json();
    
    // Should return 401 Unauthorized without auth token
    if (response.status === 401) {
      logTest(name, 'PASS', 'Correctly requires authentication', {
        status: 401,
        error: data.error
      });
    } else {
      logTest(name, 'FAIL', `Expected 401, got ${response.status}`, data);
    }
  } catch (error) {
    logTest(name, 'FAIL', `Error: ${error.message}`);
  }
}

async function runAllTests() {
  console.log('\n🧪 Quizzicallabs API Test Suite\n');
  console.log('='.repeat(60));
  console.log(`Testing API at: ${API_BASE}`);
  console.log('='.repeat(60));
  
  // Test public endpoints
  await testHealthCheck();
  await testRecaptchaVerify();
  
  // Test protected endpoints (should all return 401)
  await testAuthRequired('/api/ai/custom-quiz', 'Generate Custom Quiz');
  await testAuthRequired('/api/ai/study-guide', 'Generate Study Guide');
  await testAuthRequired('/api/ai/nts-quiz', 'Generate NTS Quiz');
  await testAuthRequired('/api/ai/explain-image', 'Explain Image');
  await testAuthRequired('/api/ai/dashboard-insights', 'Dashboard Insights');
  await testAuthRequired('/api/ai/explanation', 'Generate Explanation');
  await testAuthRequired('/api/ai/simple-explanation', 'Simple Explanation');
  await testAuthRequired('/api/ai/flashcards', 'Generate Flashcards');
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  
  if (results.failed === 0) {
    console.log('\n🎉 All tests passed! API authentication is working correctly.\n');
  } else {
    console.log('\n⚠️ Some tests failed. Check the output above for details.\n');
  }
  
  // Instructions for authenticated testing
  console.log('\n📚 Next Steps for Full Testing:\n');
  console.log('1. Login to http://localhost:3000');
  console.log('2. Open browser console and run:');
  console.log('   const auth = await import("firebase/auth");');
  console.log('   const token = await auth.getAuth().currentUser?.getIdToken();');
  console.log('   console.log("Token:", token);');
  console.log('3. Copy the token');
  console.log('4. Update .postman.json environment with the token');
  console.log('5. Run Postman collection tests\n');
}

// Run tests
runAllTests().catch(console.error);
