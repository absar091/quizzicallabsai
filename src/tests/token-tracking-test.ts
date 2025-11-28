/**
 * Token Tracking & AI Features Test
 * 
 * This script tests:
 * 1. User initialization with free plan
 * 2. Token limit checking before AI generation
 * 3. AI quiz generation with real token tracking
 * 4. Token usage updates in database
 * 5. Usage limit enforcement
 */

import { auth } from '@/lib/firebase-admin';
import { whopService } from '@/lib/whop';
import { checkTokenLimit } from '@/lib/check-limit';
import { trackTokenUsage } from '@/lib/usage';

// Test configuration
const TEST_USER_EMAIL = 'test-token-tracking@example.com';
const TEST_PASSWORD = 'TestPassword123!';

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL';
  message: string;
  data?: any;
}

const results: TestResult[] = [];

function logTest(test: string, status: 'PASS' | 'FAIL', message: string, data?: any) {
  results.push({ test, status, message, data });
  const emoji = status === 'PASS' ? '✅' : '❌';
  console.log(`${emoji} ${test}: ${message}`);
  if (data) {
    console.log('   Data:', JSON.stringify(data, null, 2));
  }
}

async function runTests() {
  console.log('\n🧪 Starting Token Tracking & AI Features Tests\n');
  console.log('='.repeat(60));

  let testUserId: string | null = null;
  let initialTokens = 0;

  try {
    // Test 1: Create test user
    console.log('\n📝 Test 1: User Creation & Initialization');
    try {
      const userRecord = await auth.createUser({
        email: TEST_USER_EMAIL,
        password: TEST_PASSWORD,
        emailVerified: true,
      });
      testUserId = userRecord.uid;
      logTest('User Creation', 'PASS', `Created user: ${testUserId}`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        const userRecord = await auth.getUserByEmail(TEST_USER_EMAIL);
        testUserId = userRecord.uid;
        logTest('User Creation', 'PASS', `Using existing user: ${testUserId}`);
      } else {
        throw error;
      }
    }

    // Test 2: Check token limit (should auto-initialize)
    console.log('\n📝 Test 2: Token Limit Check & Auto-Initialization');
    const limitCheck = await checkTokenLimit(testUserId!);
    
    if (limitCheck.allowed && limitCheck.remaining > 0) {
      initialTokens = limitCheck.remaining;
      logTest('Token Limit Check', 'PASS', `User has ${limitCheck.remaining} tokens available`, limitCheck);
    } else {
      logTest('Token Limit Check', 'FAIL', 'User has no tokens or limit check failed', limitCheck);
    }

    // Test 3: Get user usage details
    console.log('\n📝 Test 3: User Usage Details');
    const usage = await whopService.getUserUsage(testUserId!);
    
    if (usage) {
      logTest('User Usage', 'PASS', 'Successfully retrieved user usage', {
        plan: usage.plan,
        tokens_limit: usage.tokens_limit,
        tokens_used: usage.tokens_used,
        tokens_remaining: usage.tokens_remaining,
        quizzes_limit: usage.quizzes_limit,
        quizzes_used: usage.quizzes_used,
      });
    } else {
      logTest('User Usage', 'FAIL', 'Failed to retrieve user usage');
    }

    // Test 4: Test AI Quiz Generation with Token Tracking
    console.log('\n📝 Test 4: AI Quiz Generation with Real Token Tracking');
    
    // Make API call to generate quiz
    const quizResponse = await fetch('http://localhost:3002/api/ai/custom-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await auth.createCustomToken(testUserId!)}`,
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

    if (quizResponse.ok) {
      const quizData = await quizResponse.json();
      
      if (quizData.usage && quizData.usage > 0) {
        logTest('AI Quiz Generation', 'PASS', `Generated quiz with ${quizData.usage} tokens used`, {
          questions: quizData.quiz?.length,
          tokens_used: quizData.usage,
          remaining: quizData.remaining,
        });
      } else {
        logTest('AI Quiz Generation', 'FAIL', 'Quiz generated but no token usage tracked', quizData);
      }
    } else {
      const errorData = await quizResponse.json();
      logTest('AI Quiz Generation', 'FAIL', `API call failed: ${errorData.error}`, errorData);
    }

    // Test 5: Verify token usage was tracked
    console.log('\n📝 Test 5: Verify Token Usage Update');
    const updatedUsage = await whopService.getUserUsage(testUserId!);
    
    if (updatedUsage) {
      const tokensUsed = initialTokens - updatedUsage.tokens_remaining;
      
      if (tokensUsed > 0) {
        logTest('Token Usage Update', 'PASS', `Tokens decreased by ${tokensUsed}`, {
          initial: initialTokens,
          current: updatedUsage.tokens_remaining,
          used: tokensUsed,
        });
      } else {
        logTest('Token Usage Update', 'FAIL', 'Token count did not decrease', {
          initial: initialTokens,
          current: updatedUsage.tokens_remaining,
        });
      }
    } else {
      logTest('Token Usage Update', 'FAIL', 'Failed to retrieve updated usage');
    }

    // Test 6: Test Study Guide Generation
    console.log('\n📝 Test 6: Study Guide Generation with Token Tracking');
    
    const studyGuideResponse = await fetch('http://localhost:3002/api/ai/study-guide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await auth.createCustomToken(testUserId!)}`,
      },
      body: JSON.stringify({
        topic: 'Newton\'s Laws of Motion',
        isPro: false,
      }),
    });

    if (studyGuideResponse.ok) {
      const studyGuideData = await studyGuideResponse.json();
      
      if (studyGuideData.usage && studyGuideData.usage > 0) {
        logTest('Study Guide Generation', 'PASS', `Generated study guide with ${studyGuideData.usage} tokens`, {
          tokens_used: studyGuideData.usage,
          remaining: studyGuideData.remaining,
        });
      } else {
        logTest('Study Guide Generation', 'FAIL', 'Study guide generated but no token tracking', studyGuideData);
      }
    } else {
      const errorData = await studyGuideResponse.json();
      logTest('Study Guide Generation', 'FAIL', `API call failed: ${errorData.error}`, errorData);
    }

    // Test 7: Test Explanation Generation
    console.log('\n📝 Test 7: Explanation Generation with Token Tracking');
    
    const explanationResponse = await fetch('http://localhost:3002/api/ai/explanation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await auth.createCustomToken(testUserId!)}`,
      },
      body: JSON.stringify({
        question: 'What is the capital of France?',
        studentAnswer: 'London',
        correctAnswer: 'Paris',
        topic: 'Geography',
        isPro: false,
      }),
    });

    if (explanationResponse.ok) {
      const explanationData = await explanationResponse.json();
      
      if (explanationData.usage && explanationData.usage > 0) {
        logTest('Explanation Generation', 'PASS', `Generated explanation with ${explanationData.usage} tokens`, {
          tokens_used: explanationData.usage,
          remaining: explanationData.remaining,
        });
      } else {
        logTest('Explanation Generation', 'FAIL', 'Explanation generated but no token tracking', explanationData);
      }
    } else {
      const errorData = await explanationResponse.json();
      logTest('Explanation Generation', 'FAIL', `API call failed: ${errorData.error}`, errorData);
    }

    // Test 8: Final usage check
    console.log('\n📝 Test 8: Final Token Usage Summary');
    const finalUsage = await whopService.getUserUsage(testUserId!);
    
    if (finalUsage) {
      const totalUsed = initialTokens - finalUsage.tokens_remaining;
      logTest('Final Usage Summary', 'PASS', `Total tokens used: ${totalUsed}`, {
        initial_tokens: initialTokens,
        final_remaining: finalUsage.tokens_remaining,
        total_used: totalUsed,
        quizzes_used: finalUsage.quizzes_used,
      });
    }

  } catch (error: any) {
    logTest('Test Execution', 'FAIL', `Error: ${error.message}`, { error: error.stack });
  } finally {
    // Cleanup: Delete test user
    if (testUserId) {
      try {
        await auth.deleteUser(testUserId);
        console.log(`\n🧹 Cleaned up test user: ${testUserId}`);
      } catch (error) {
        console.log(`\n⚠️ Could not delete test user: ${error}`);
      }
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  
  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Token tracking is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Review the output above for details.');
  }
}

// Run tests
runTests().catch(console.error);
