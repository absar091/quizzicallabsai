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

    console.log('🔧 Starting remembering work fix for user:', userId);

    const fixes = {
      userProfile: false,
      quizResults: false,
      bookmarks: false,
      studyStreaks: false,
      loginCredentials: false,
      fcmTokens: false
    };

    // Fix 1: Ensure user profile exists
    try {
      const userRef = adminDb.ref(`users/${userId}`);
      const userSnapshot = await userRef.once('value');
      
      if (!userSnapshot.exists()) {
        await userRef.set({
          uid: userId,
          email: decodedToken.email,
          displayName: decodedToken.name || 'User',
          emailVerified: decodedToken.email_verified,
          className: 'Not set',
          age: null,
          fatherName: 'N/A',
          plan: 'Free',
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        });
        console.log('✅ User profile created');
      } else {
        console.log('✅ User profile exists');
      }
      fixes.userProfile = true;
    } catch (error) {
      console.error('❌ User profile fix failed:', error);
    }

    // Fix 2: Initialize quiz results structure
    try {
      const quizResultsRef = adminDb.ref(`quizResults/${userId}`);
      const quizSnapshot = await quizResultsRef.once('value');
      
      if (!quizSnapshot.exists()) {
        await quizResultsRef.set({
          initialized: true,
          createdAt: new Date().toISOString()
        });
        console.log('✅ Quiz results structure initialized');
      }
      fixes.quizResults = true;
    } catch (error) {
      console.error('❌ Quiz results fix failed:', error);
    }

    // Fix 3: Initialize bookmarks structure
    try {
      const bookmarksRef = adminDb.ref(`bookmarks/${userId}`);
      const bookmarksSnapshot = await bookmarksRef.once('value');
      
      if (!bookmarksSnapshot.exists()) {
        await bookmarksRef.set({
          initialized: true,
          createdAt: new Date().toISOString()
        });
        console.log('✅ Bookmarks structure initialized');
      }
      fixes.bookmarks = true;
    } catch (error) {
      console.error('❌ Bookmarks fix failed:', error);
    }

    // Fix 4: Initialize study streaks
    try {
      const studyStreaksRef = adminDb.ref(`studyStreaks/${userId}`);
      const streakSnapshot = await studyStreaksRef.once('value');
      
      if (!streakSnapshot.exists()) {
        await studyStreaksRef.set({
          currentStreak: 0,
          longestStreak: 0,
          lastStudyDate: null,
          totalStudyDays: 0,
          lastModified: Date.now(),
          createdAt: new Date().toISOString()
        });
        console.log('✅ Study streaks initialized');
      }
      fixes.studyStreaks = true;
    } catch (error) {
      console.error('❌ Study streaks fix failed:', error);
    }

    // Fix 5: Initialize login credentials structure
    try {
      const loginCredentialsRef = adminDb.ref(`loginCredentials/${userId}`);
      const credentialsSnapshot = await loginCredentialsRef.once('value');
      
      if (!credentialsSnapshot.exists()) {
        await loginCredentialsRef.set({
          initialized: true,
          createdAt: new Date().toISOString()
        });
        console.log('✅ Login credentials structure initialized');
      }
      fixes.loginCredentials = true;
    } catch (error) {
      console.error('❌ Login credentials fix failed:', error);
    }

    // Fix 6: Initialize FCM tokens structure
    try {
      const fcmTokensRef = adminDb.ref(`fcmTokens/${userId}`);
      const fcmSnapshot = await fcmTokensRef.once('value');
      
      if (!fcmSnapshot.exists()) {
        await fcmTokensRef.set({
          initialized: true,
          createdAt: new Date().toISOString()
        });
        console.log('✅ FCM tokens structure initialized');
      }
      fixes.fcmTokens = true;
    } catch (error) {
      console.error('❌ FCM tokens fix failed:', error);
    }

    const successCount = Object.values(fixes).filter(Boolean).length;
    const totalFixes = Object.keys(fixes).length;

    console.log(`🎉 Remembering work fix complete! ${successCount}/${totalFixes} fixes applied`);

    return NextResponse.json({
      success: true,
      message: `Remembering work fixed! Applied ${successCount}/${totalFixes} fixes.`,
      fixes,
      userId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Remembering work fix failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Fix failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Remembering work fix endpoint. Use POST with idToken to run fixes.',
    usage: 'POST /api/fix-remembering-work',
    required: { idToken: 'Firebase ID token' }
  });
}