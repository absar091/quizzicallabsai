import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminStatus, db, auth } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking Firebase Admin status...');
    
    // Get status
    const status = getFirebaseAdminStatus();
    
    // Test database connection if available
    let databaseTest = null;
    if (db) {
      try {
        console.log('🔗 Testing database connection...');
        const testRef = db.ref('test');
        const snapshot = await testRef.limitToFirst(1).once('value');
        databaseTest = {
          connected: true,
          hasData: snapshot.exists()
        };
        console.log('✅ Database connection successful');
      } catch (dbError: any) {
        databaseTest = {
          connected: false,
          error: dbError.message
        };
        console.error('❌ Database connection failed:', dbError.message);
      }
    }
    
    // Test users collection
    let usersTest = null;
    if (db) {
      try {
        console.log('👥 Testing users collection...');
        const usersRef = db.ref('users');
        const usersSnapshot = await usersRef.limitToFirst(1).once('value');
        usersTest = {
          accessible: true,
          hasUsers: usersSnapshot.exists(),
          sampleUserIds: usersSnapshot.exists() ? Object.keys(usersSnapshot.val()) : []
        };
        console.log('✅ Users collection accessible');
      } catch (usersError: any) {
        usersTest = {
          accessible: false,
          error: usersError.message
        };
        console.error('❌ Users collection test failed:', usersError.message);
      }
    }
    
    const result = {
      success: true,
      firebaseAdmin: status,
      database: databaseTest,
      users: usersTest,
      timestamp: new Date().toISOString()
    };
    
    console.log('📊 Firebase status check complete:', result);
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('💥 Firebase status check failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}