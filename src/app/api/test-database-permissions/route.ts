import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth, db as adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    
    if (!idToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'ID token required' 
      }, { status: 400 });
    }

    // Check if Firebase Admin is initialized
    if (!adminAuth || !adminDb) {
      return NextResponse.json({ 
        success: false, 
        error: 'Firebase Admin not initialized' 
      }, { status: 500 });
    }

    // Verify the user
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    console.log('🧪 Testing database permissions for user:', userId);

    const testResults = {
      loginCredentials: false,
      fcmTokens: false,
      bookmarks: false,
      studyStreaks: false,
      quizResults: false
    };

    // Test 1: Login Credentials
    try {
      const loginCredentialsRef = adminDb.ref(`loginCredentials/${userId}/test`);
      await loginCredentialsRef.set({
        timestamp: Date.now(),
        deviceFingerprint: 'test-device',
        location: 'test-location'
      });
      await loginCredentialsRef.remove(); // Clean up
      testResults.loginCredentials = true;
      console.log('✅ Login credentials test passed');
    } catch (error) {
      console.error('❌ Login credentials test failed:', error);
    }

    // Test 2: FCM Tokens
    try {
      const fcmTokensRef = adminDb.ref(`fcmTokens/${userId}/test`);
      await fcmTokensRef.set({
        token: 'test-token',
        platform: 'web',
        isActive: true,
        updatedAt: Date.now()
      });
      await fcmTokensRef.remove(); // Clean up
      testResults.fcmTokens = true;
      console.log('✅ FCM tokens test passed');
    } catch (error) {
      console.error('❌ FCM tokens test failed:', error);
    }

    // Test 3: Bookmarks
    try {
      const bookmarksRef = adminDb.ref(`bookmarks/${userId}/test-bookmark`);
      await bookmarksRef.set({
        userId: userId,
        quizId: 'test-quiz',
        quizTitle: 'Test Quiz',
        subject: 'Test Subject',
        difficulty: 'Easy',
        questionCount: 5,
        bookmarkedAt: Date.now()
      });
      await bookmarksRef.remove(); // Clean up
      testResults.bookmarks = true;
      console.log('✅ Bookmarks test passed');
    } catch (error) {
      console.error('❌ Bookmarks test failed:', error);
    }

    // Test 4: Study Streaks
    try {
      const studyStreaksRef = adminDb.ref(`studyStreaks/${userId}`);
      await studyStreaksRef.set({
        currentStreak: 1,
        longestStreak: 1,
        lastStudyDate: Date.now(),
        totalStudyDays: 1,
        lastModified: Date.now()
      });
      testResults.studyStreaks = true;
      console.log('✅ Study streaks test passed');
    } catch (error) {
      console.error('❌ Study streaks test failed:', error);
    }

    // Test 5: Quiz Results
    try {
      const quizResultsRef = adminDb.ref(`quizResults/${userId}/test-result`);
      await quizResultsRef.set({
        quizId: 'test-quiz',
        score: 80,
        percentage: 80,
        topic: 'Test Topic',
        difficulty: 'Easy',
        createdAt: Date.now(),
        completedAt: Date.now()
      });
      await quizResultsRef.remove(); // Clean up
      testResults.quizResults = true;
      console.log('✅ Quiz results test passed');
    } catch (error) {
      console.error('❌ Quiz results test failed:', error);
    }

    const passedTests = Object.values(testResults).filter(Boolean).length;
    const totalTests = Object.keys(testResults).length;

    console.log(`🎉 Database permission tests complete! ${passedTests}/${totalTests} tests passed`);

    return NextResponse.json({
      success: true,
      message: `Database permission tests complete! ${passedTests}/${totalTests} tests passed.`,
      testResults,
      passedTests,
      totalTests,
      allPassed: passedTests === totalTests
    });

  } catch (error) {
    console.error('❌ Database permission test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Database permission test endpoint. Use POST with idToken to run tests.',
    usage: 'POST /api/test-database-permissions',
    required: { idToken: 'Firebase ID token' }
  });
}