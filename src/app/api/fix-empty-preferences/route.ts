import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email = 'furqanrao091@gmail.com' } = body;
    
    console.log(`🔧 Fixing empty preferences for: ${email}`);
    
    // Check if Firebase Admin is initialized
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable' },
        { status: 503 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailKey = cleanEmail.replace(/\./g, '_');
    const preferencesRef = db.ref(`emailPreferences/${emailKey}`);
    
    // Get current data
    const currentSnapshot = await preferencesRef.once('value');
    const currentData = currentSnapshot.val();
    
    console.log('📊 Current data:', currentData);
    
    // Create proper preferences structure
    const fixedData = {
      email: cleanEmail,
      preferences: {
        quizResults: true,
        studyReminders: true,
        loginAlerts: true,
        promotions: true,
        newsletters: true,
        all: false
      },
      updatedAt: new Date().toISOString(),
      createdAt: currentData?.createdAt || new Date().toISOString(),
      fixedAt: new Date().toISOString()
    };
    
    // Save the fixed data
    await preferencesRef.set(fixedData);
    
    // Verify the fix
    const verifySnapshot = await preferencesRef.once('value');
    const verifiedData = verifySnapshot.val();
    
    console.log('✅ Fixed data:', verifiedData);
    
    return NextResponse.json({
      success: true,
      message: 'Preferences fixed successfully',
      before: currentData,
      after: verifiedData
    });
    
  } catch (error: any) {
    console.error('❌ Error fixing preferences:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'furqanrao091@gmail.com';
    
    console.log(`🔍 Checking preferences for: ${email}`);
    
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable' },
        { status: 503 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailKey = cleanEmail.replace(/\./g, '_');
    const preferencesRef = db.ref(`emailPreferences/${emailKey}`);
    
    const snapshot = await preferencesRef.once('value');
    const data = snapshot.val();
    
    return NextResponse.json({
      success: true,
      email: cleanEmail,
      exists: snapshot.exists(),
      data: data,
      hasPreferences: !!(data?.preferences),
      preferencesEmpty: data?.preferences ? Object.keys(data.preferences).length === 0 : true
    });
    
  } catch (error: any) {
    console.error('❌ Error checking preferences:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}