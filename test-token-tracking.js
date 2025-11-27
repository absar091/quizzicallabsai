/**
 * Simple Token Tracking Test Script
 * Run with: node test-token-tracking.js
 * 
 * Make sure your dev server is running on http://localhost:3002
 */

const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPassword123!';
const API_BASE = 'http://localhost:3002';

async function runTests() {
  console.log('\n🧪 Token Tracking & AI Features Test\n');
  console.log('='.repeat(60));
  
  let passed = 0;
  let failed = 0;
  
  try {
    // Test 1: Create user and get auth token
    console.log('\n📝 Test 1: User Signup');
    const signupRes = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        displayName: 'Test User',
      }),
    });
    
    if (!signupRes.ok) {
      console.log('❌ Signup failed');
      failed++;
      return;
    }
    
    const signupData = await signupRes.json();
    const token = signupData.token || signupData.idToken;
    
    if (!token) {
      console.log('❌ No auth token received');
      failed++;
      return;
    }
    
    console.log('✅ User created successfully');
    passed++;
    
    // Test 2: Check initial usage
    console.log('\n📝 Test 2: Check Initial Token Balance');
    const usageRes = await fetch(`${API_BASE}/api/subscription/usage`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!usageRes.ok) {
      console.log('❌ Failed to get usage');
      failed++;
    } else {
      const usageData = await usageRes.json();
      console.log('✅ Initial balance:', usageData.usage?.tokens_remaining, 'tokens');
      console.log('   Plan:', usageData.usage?.plan_name);
      passed++;
    }
    
    // Test 3: Generate Quiz
    console.log('\n📝 Test 3: Generate Quiz with Token Tracking');
    const quizRes = await fetch(`${API_BASE}/api/ai/custom-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        topic: 'Photosynthesis',
        difficulty: 'easy',
        numberOfQuestions: 3,
        questionTypes: ['Multiple Choice'],
        questionStyles: ['Conceptual'],
        timeLimit: 10,
        isPro: false,
      }),
    });
    
    if (!quizRes.ok) {
      const error = await quizRes.json();
      console.log('❌ Quiz generation failed:', error.error);
      failed++;
    } else {
      const quizData = await quizRes.json();
      console.log('✅ Quiz generated!');
      console.log('   Questions:', quizData.quiz?.length);
      console.log('   Tokens used:', quizData.usage);
      console.log('   Remaining:', quizData.remaining);
      
      if (quizData.usage > 0) {
        console.log('✅ Token tracking working!');
        passed++;
      } else {
        console.log('❌ No tokens tracked');
        failed++;
      }
    }
    
    // Test 4: Generate Study Guide
    console.log('\n📝 Test 4: Generate Study Guide');
    const studyRes = await fetch(`${API_BASE}/api/ai/study-guide`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        topic: 'Newton\'s Laws',
        isPro: false,
      }),
    });
    
    if (!studyRes.ok) {
      const error = await studyRes.json();
      console.log('❌ Study guide failed:', error.error);
      failed++;
    } else {
      const studyData = await studyRes.json();
      console.log('✅ Study guide generated!');
      console.log('   Tokens used:', studyData.usage);
      console.log('   Remaining:', studyData.remaining);
      
      if (studyData.usage > 0) {
        console.log('✅ Token tracking working!');
        passed++;
      } else {
        console.log('❌ No tokens tracked');
        failed++;
      }
    }
    
    // Test 5: Generate Explanation
    console.log('\n📝 Test 5: Generate Explanation');
    const explainRes = await fetch(`${API_BASE}/api/ai/explanation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        question: 'What is 2+2?',
        studentAnswer: '5',
        correctAnswer: '4',
        topic: 'Math',
        isPro: false,
      }),
    });
    
    if (!explainRes.ok) {
      const error = await explainRes.json();
      console.log('❌ Explanation failed:', error.error);
      failed++;
    } else {
      const explainData = await explainRes.json();
      console.log('✅ Explanation generated!');
      console.log('   Tokens used:', explainData.usage);
      console.log('   Remaining:', explainData.remaining);
      
      if (explainData.usage > 0) {
        console.log('✅ Token tracking working!');
        passed++;
      } else {
        console.log('❌ No tokens tracked');
        failed++;
      }
    }
    
    // Test 6: Final usage check
    console.log('\n📝 Test 6: Final Token Balance');
    const finalUsageRes = await fetch(`${API_BASE}/api/subscription/usage`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (finalUsageRes.ok) {
      const finalData = await finalUsageRes.json();
      console.log('✅ Final balance:', finalData.usage?.tokens_remaining, 'tokens');
      console.log('   Total used:', finalData.usage?.tokens_used);
      passed++;
    } else {
      console.log('❌ Failed to get final usage');
      failed++;
    }
    
  } catch (error) {
    console.log('❌ Test error:', error.message);
    failed++;
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  console.log(`Total: ${passed + failed}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Token tracking is working correctly.\n');
  } else {
    console.log('\n⚠️ Some tests failed. Check the output above.\n');
  }
}

// Run tests
runTests().catch(console.error);
