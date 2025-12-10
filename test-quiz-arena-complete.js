// 🧪 Complete Quiz Arena Test Suite
// Run this in browser console to test all functionality

console.log('🧪 Starting Complete Quiz Arena Test Suite...');

async function testQuizArenaComplete() {
  const results = [];
  
  try {
    // Test 1: Check if user is authenticated
    console.log('🔐 Test 1: Authentication Check');
    const { auth } = await import('./src/lib/firebase.js');
    const user = auth.currentUser;
    
    if (user) {
      results.push('✅ User authenticated: ' + user.uid);
      console.log('✅ User authenticated:', user.uid);
    } else {
      results.push('❌ No user authenticated - please log in first');
      console.log('❌ No user authenticated - please log in first');
      return results;
    }

    // Test 2: Load Quiz Arena Module
    console.log('🎮 Test 2: Quiz Arena Module');
    const { QuizArena } = await import('./src/lib/quiz-arena.js');
    
    if (QuizArena && QuizArena.Host && QuizArena.Player && QuizArena.Discovery) {
      results.push('✅ Quiz Arena module loaded successfully');
      console.log('✅ Quiz Arena module loaded successfully');
    } else {
      results.push('❌ Quiz Arena module incomplete');
      console.log('❌ Quiz Arena module incomplete');
      return results;
    }

    // Test 3: Generate Room Code
    console.log('🔖 Test 3: Room Code Generation');
    const roomCode = await QuizArena.Discovery.generateRoomCode();
    
    if (roomCode && roomCode.length === 6) {
      results.push('✅ Room code generated: ' + roomCode);
      console.log('✅ Room code generated:', roomCode);
    } else {
      results.push('❌ Room code generation failed');
      console.log('❌ Room code generation failed');
      return results;
    }

    // Test 4: Test AI Quiz Generation
    console.log('🤖 Test 4: AI Quiz Generation');
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/ai/custom-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topic: 'Basic Math',
          difficulty: 'easy',
          numberOfQuestions: 2,
          questionTypes: ['Multiple Choice'],
          questionStyles: ['Conceptual'],
          timeLimit: 30,
          userClass: 'Test',
          isPro: false,
          specificInstructions: 'Create 2 simple math questions for testing'
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.quiz && result.quiz.length > 0) {
          results.push('✅ AI quiz generation working: ' + result.quiz.length + ' questions');
          console.log('✅ AI quiz generation working:', result.quiz.length, 'questions');
        } else {
          results.push('❌ AI returned empty quiz');
          console.log('❌ AI returned empty quiz');
        }
      } else {
        const error = await response.text();
        results.push('❌ AI endpoint error: ' + response.status + ' - ' + error);
        console.log('❌ AI endpoint error:', response.status, '-', error);
      }
    } catch (error) {
      results.push('❌ AI test failed: ' + error.message);
      console.log('❌ AI test failed:', error.message);
    }

    // Test 5: Test Room Creation
    console.log('🏗️ Test 5: Room Creation');
    try {
      const testQuiz = [
        {
          question: 'What is 2 + 2?',
          options: ['3', '4', '5', '6'],
          correctIndex: 1,
          type: 'multiple-choice'
        },
        {
          question: 'What is 3 × 3?',
          options: ['6', '8', '9', '12'],
          correctIndex: 2,
          type: 'multiple-choice'
        }
      ];

      await QuizArena.Host.createRoom(
        roomCode,
        user.uid,
        user.displayName || 'Test User',
        testQuiz
      );

      // Verify room was created
      const { firestore } = await import('./src/lib/firebase.js');
      const { doc, getDoc } = await import('firebase/firestore');
      const roomRef = doc(firestore, 'quiz-rooms', roomCode);
      const roomDoc = await getDoc(roomRef);
      
      if (roomDoc.exists()) {
        results.push('✅ Room creation successful: ' + roomCode);
        console.log('✅ Room creation successful:', roomCode);
        
        // Test 6: Test Player Joining
        console.log('👥 Test 6: Player Joining');
        try {
          await QuizArena.Player.joinRoom(roomCode, user.uid, user.displayName || 'Test Player');
          results.push('✅ Player joining successful');
          console.log('✅ Player joining successful');
        } catch (joinError) {
          results.push('❌ Player joining failed: ' + joinError.message);
          console.log('❌ Player joining failed:', joinError.message);
        }
        
      } else {
        results.push('❌ Room creation failed - room not found in database');
        console.log('❌ Room creation failed - room not found in database');
      }
    } catch (createError) {
      results.push('❌ Room creation failed: ' + createError.message);
      console.log('❌ Room creation failed:', createError.message);
    }

    // Test 7: Run Diagnostics
    console.log('🔧 Test 7: Diagnostic System');
    try {
      const { QuizArenaDiagnostics } = await import('./src/lib/quiz-arena-diagnostics.js');
      const diagnostics = new QuizArenaDiagnostics();
      const diagnosticResults = await diagnostics.runFullDiagnostic();
      
      const failed = diagnosticResults.filter(r => r.status === 'fail');
      if (failed.length === 0) {
        results.push('✅ All diagnostic tests passed');
        console.log('✅ All diagnostic tests passed');
      } else {
        results.push('⚠️ Some diagnostic tests failed: ' + failed.length);
        console.log('⚠️ Some diagnostic tests failed:', failed.length);
        failed.forEach(f => console.log('  - ' + f.component + ': ' + f.message));
      }
    } catch (diagError) {
      results.push('❌ Diagnostic system error: ' + diagError.message);
      console.log('❌ Diagnostic system error:', diagError.message);
    }

  } catch (error) {
    results.push('❌ Test suite error: ' + error.message);
    console.log('❌ Test suite error:', error.message);
  }

  // Summary
  console.log('\n📊 Test Results Summary:');
  results.forEach(result => console.log(result));
  
  const passed = results.filter(r => r.startsWith('✅')).length;
  const failed = results.filter(r => r.startsWith('❌')).length;
  const warnings = results.filter(r => r.startsWith('⚠️')).length;
  
  console.log(`\n🎯 Final Score: ${passed} passed, ${failed} failed, ${warnings} warnings`);
  
  if (failed === 0) {
    console.log('🎉 Quiz Arena is fully functional!');
  } else {
    console.log('🔧 Quiz Arena needs fixes. Check the failed tests above.');
  }
  
  return results;
}

// Auto-run the test
testQuizArenaComplete().catch(console.error);