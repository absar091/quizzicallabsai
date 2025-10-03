import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debugging Firebase Admin initialization...');
    
    // Check environment variables first
    const envCheck = {
      FIREBASE_PROJECT_ID: {
        exists: !!process.env.FIREBASE_PROJECT_ID,
        value: process.env.FIREBASE_PROJECT_ID || 'NOT_SET'
      },
      FIREBASE_CLIENT_EMAIL: {
        exists: !!process.env.FIREBASE_CLIENT_EMAIL,
        value: process.env.FIREBASE_CLIENT_EMAIL || 'NOT_SET'
      },
      FIREBASE_PRIVATE_KEY: {
        exists: !!process.env.FIREBASE_PRIVATE_KEY,
        length: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
        startsCorrectly: process.env.FIREBASE_PRIVATE_KEY?.startsWith('-----BEGIN PRIVATE KEY-----') || false
      },
      NEXT_PUBLIC_FIREBASE_DATABASE_URL: {
        exists: !!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        value: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'NOT_SET'
      }
    };
    
    console.log('Environment variables check:', envCheck);
    
    // Try to import firebase-admin
    let adminModule = null;
    let adminError = null;
    try {
      adminModule = await import('firebase-admin');
      console.log('✅ Firebase Admin module imported');
      console.log('Apps length:', adminModule.default.apps.length);
    } catch (error: any) {
      adminError = error.message;
      console.error('❌ Firebase Admin import failed:', error);
    }
    
    // Try manual initialization
    let manualInitResult = null;
    if (adminModule && envCheck.FIREBASE_PROJECT_ID.exists && envCheck.FIREBASE_CLIENT_EMAIL.exists && envCheck.FIREBASE_PRIVATE_KEY.exists) {
      try {
        console.log('🔧 Attempting manual Firebase Admin initialization...');
        
        // Check if already initialized
        if (adminModule.default.apps.length === 0) {
          const credential = adminModule.default.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
          });

          const config = { 
            credential,
            projectId: process.env.FIREBASE_PROJECT_ID,
            databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
          };

          const app = adminModule.default.initializeApp(config);
          console.log('✅ Manual Firebase Admin initialization successful');
          
          // Test database access
          const database = adminModule.default.database();
          const testRef = database.ref('test');
          
          manualInitResult = {
            success: true,
            appName: app.name,
            databaseConnected: !!database
          };
        } else {
          manualInitResult = {
            success: true,
            message: 'Already initialized',
            appName: adminModule.default.apps[0].name
          };
        }
      } catch (error: any) {
        console.error('❌ Manual initialization failed:', error);
        manualInitResult = {
          success: false,
          error: error.message,
          stack: error.stack
        };
      }
    }
    
    // Try importing our firebase-admin config
    let configImportResult = null;
    try {
      const firebaseAdminConfig = await import('@/lib/firebase-admin');
      configImportResult = {
        success: true,
        isInitialized: firebaseAdminConfig.isFirebaseAdminInitialized(),
        dbAvailable: !!firebaseAdminConfig.db,
        authAvailable: !!firebaseAdminConfig.auth,
        firestoreAvailable: !!firebaseAdminConfig.firestore
      };
    } catch (error: any) {
      configImportResult = {
        success: false,
        error: error.message
      };
    }
    
    return NextResponse.json({
      success: true,
      environment: envCheck,
      adminModule: {
        imported: !!adminModule,
        error: adminError,
        appsLength: adminModule?.default.apps.length || 0
      },
      manualInit: manualInitResult,
      configImport: configImportResult,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}