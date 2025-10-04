import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { checkEmailPreferences, getUserEmailPreferences } from '@/lib/email-preferences';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'furqanrao091@gmail.com';
    
    console.log(`🧪 Testing preferences for: ${email}`);
    
    // Test 1: Check raw database data
    const emailKey = email.replace(/\./g, '_');
    const preferencesRef = db.ref(`emailPreferences/${emailKey}`);
    const snapshot = await preferencesRef.once('value');
    
    const rawData = snapshot.exists() ? snapshot.val() : null;
    console.log('📊 Raw database data:', rawData);
    
    // Test 2: Get user preferences using our function
    const userPrefs = await getUserEmailPreferences(email);
    console.log('👤 User preferences:', userPrefs);
    
    // Test 3: Check specific email types
    const emailTypes = ['quizResults', 'studyReminders', 'loginAlerts', 'promotions', 'newsletters'];
    const permissionChecks = {};
    
    for (const emailType of emailTypes) {
      const result = await checkEmailPreferences(email, emailType as any);
      permissionChecks[emailType] = result;
    }
    
    console.log('🔍 Permission checks:', permissionChecks);
    
    return NextResponse.json({
      success: true,
      email,
      rawData,
      userPreferences: userPrefs,
      permissionChecks,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email = 'furqanrao091@gmail.com', preferences } = body;
    
    console.log(`🧪 Testing preference update for: ${email}`);
    console.log('📝 New preferences:', preferences);
    
    // Test updating preferences
    const emailKey = email.replace(/\./g, '_');
    const preferencesRef = db.ref(`emailPreferences/${emailKey}`);
    
    const testPreferences = preferences || {
      quizResults: false,
      studyReminders: true,
      loginAlerts: true,
      promotions: false,
      newsletters: true,
      all: false
    };
    
    const preferenceData = {
      email: email.toLowerCase(),
      preferences: testPreferences,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      testUpdate: true
    };
    
    await preferencesRef.set(preferenceData);
    
    // Verify the update
    const verifySnapshot = await preferencesRef.once('value');
    const savedData = verifySnapshot.val();
    
    console.log('✅ Saved data:', savedData);
    
    return NextResponse.json({
      success: true,
      message: 'Test preferences updated',
      email,
      sentPreferences: testPreferences,
      savedData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Test update error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}