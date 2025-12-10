// 🧪 Quiz Arena Test Script
// Run this in the browser console to test Quiz Arena functionality

console.log('🧪 Starting Quiz Arena Tests...');

async function testQuizArena() {
  const results = [];
  
  // Test 1: Check if Firebase is loaded
  try {
    if (typeof window !== 'undefined' && window.firebase) {
      results.push({ test: 'Firebase SDK', status: 'PASS', message: 'Firebase SDK is loaded' });
    } else {
      results.push({ test: 'Firebase SDK', status: 'FAIL', message: 'Firebase SDK not found' });
    }
  } catch (error) {
    results.push({ test: 'Firebase SDK', status: 'FAIL', message: error.message });
  }

  // Test 2: Check authentication
  try {
    const { auth } = await import('./src/lib/firebase');
    const user = auth.currentUser;
    if (user) {
      results.push({ test: 'Authentication', status: 'PASS', message: `User logged in: ${user.uid}` });
    } else {
      results.push({ test: 'Authentication', status: 'WARNING', message: 'No user logged in' });
    }
  } catch (error) {
    results.push({ test: 'Authentication', status: 'FAIL', message: error.message });
  }

  // Test 3: Check Quiz Arena module
  try {
    const { QuizArena } = await import('./src/lib/quiz-arena');
    if (QuizArena && QuizArena.Host && QuizArena.Player && QuizArena.Discovery) {
      results.push({ test: 'Quiz Arena Module', status: 'PASS', message: 'All modules loaded' });
    } else {
      results.push({ test: 'Quiz Arena Module', status: 'FAIL', message: 'Missing modules' });
    }
  } catch (error) {
    results.push({ test: 'Quiz Arena Module', status: 'FAIL', message: error.message });
  }

  // Test 4: Test room code generation
  try {
    const { QuizArena } = await import('./src/lib/quiz-arena');
    const roomCode = await QuizArena.Discovery.generateRoomCode();
    if (roomCode && roomCode.length === 6) {
      results.push({ test: 'Room Code Generation', status: 'PASS', message: `Generated: ${roomCode}` });
    } else {
      results.push({ test: 'Room Code Generation', status: 'FAIL', message: 'Invalid room code' });
    }
  } catch (error) {
    results.push({ test: 'Room Code Generation', status: 'FAIL', message: error.message });
  }

  // Test 5: Test AI endpoint (if authenticated)
  try {
    const { auth } = await import('./src/lib/firebase');
    const user = auth.currentUser;
    
    if (user) {
      const token = await user.getIdToken();
      const response = await fetch('/api/ai/custom-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topic: 'Test Topic',
          difficulty: 'easy',
          numberOfQuestions: 1,
          questionTypes: ['Multiple Choice'],
          questionStyles: ['Conceptual'],
          timeLimit: 30,
          userClass: 'Test',
          isPro: false,
          specificInstructions: 'Test question'
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.quiz && result.quiz.length > 0) {
          results.push({ test: 'AI Quiz Generation', status: 'PASS', message: 'Quiz generated successfully' });
        } else {
          results.push({ test: 'AI Quiz Generation', status: 'FAIL', message: 'Empty quiz returned' });
        }
      } else {
        const error = await response.text();
        results.push({ test: 'AI Quiz Generation', status: 'FAIL', message: `API Error: ${response.status}` });
      }
    } else {
      results.push({ test: 'AI Quiz Generation', status: 'SKIP', message: 'No user authenticated' });
    }
  } catch (error) {
    results.push({ test: 'AI Quiz Generation', status: 'FAIL', message: error.message });
  }

  // Display results
  console.log('\n🧪 Quiz Arena Test Results:');
  console.log('================================');
  
  results.forEach(result => {
    const emoji = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${emoji} ${result.test}: ${result.message}`);
  });

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const warnings = results.filter(r => r.status === 'WARNING' || r.status === 'SKIP').length;

  console.log('\n📊 Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️ Warnings: ${warnings}`);

  if (failed === 0) {
    console.log('\n🎉 All critical tests passed! Quiz Arena should be working.');
  } else {
    console.log('\n🚨 Some tests failed. Check the issues above.');
  }

  return results;
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  testQuizArena().catch(console.error);
}

// Export for manual use
if (typeof module !== 'undefined') {
  module.exports = { testQuizArena };
}