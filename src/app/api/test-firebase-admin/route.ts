import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing Firebase Admin initialization...');
    
    // Test environment variables
    const envVars = {
      FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
      FIREBASE_PRIVATE_KEY_LENGTH: process.env.FIREBASE_PRIVATE_KEY?.length || 0
    };
    
    console.log('Environment variables:', envVars);
    
    // Try to import Firebase Admin
    let adminImportError = null;
    let admin = null;
    try {
      admin = await import('firebase-admin');
      console.log('✅ Firebase Admin imported successfully');
    } catch (error: any) {
      adminImportError = error.message;
      console.error('❌ Firebase Admin import failed:', error);
    }
    
    // Try to import our Firebase Admin config
    let configImportError = null;
    let firebaseAdmin = null;
    try {
      firebaseAdmin = await import('@/lib/firebase-admin');
      console.log('✅ Firebase Admin config imported successfully');
      console.log('Initialization status:', firebaseAdmin.isFirebaseAdminInitialized());
    } catch (error: any) {
      configImportError = error.message;
      console.error('❌ Firebase Admin config import failed:', error);
    }
    
    // Test Realtime Database access
    let databaseTest = null;
    let databaseError = null;
    try {
      if (firebaseAdmin?.db) {
        console.log('🔥 Testing Realtime Database access...');
        const testRef = firebaseAdmin.db.ref('users');
        const testSnapshot = await testRef.limitToFirst(1).once('value');
        const testData = testSnapshot.val();
        databaseTest = {
          accessible: true,
          hasData: !!testData,
          userCount: testData ? Object.keys(testData).length : 0
        };
        console.log('✅ Realtime Database accessible');
      } else {
        databaseError = 'Realtime Database instance not available';
      }
    } catch (error: any) {
      databaseError = error.message;
      console.error('❌ Realtime Database test failed:', error);
    }
    
    return NextResponse.json({
      success: true,
      environment: envVars,
      adminImport: {
        success: !adminImportError,
        error: adminImportError,
        appsLength: admin?.apps?.length || 0
      },
      configImport: {
        success: !configImportError,
        error: configImportError,
        initialized: firebaseAdmin?.isFirebaseAdminInitialized() || false
      },
      database: {
        test: databaseTest,
        error: databaseError
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Firebase Admin test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}