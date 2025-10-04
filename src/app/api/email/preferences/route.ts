import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // Add timeout for request parsing
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 10000)
    );
    
    const body = await Promise.race([
      request.json(),
      timeoutPromise
    ]) as any;

    const { email, preferences } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    if (!preferences || typeof preferences !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Valid preferences object is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase();
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if Firebase Admin is initialized
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Use email as key (replace dots with underscores for Firebase key compatibility)
    const emailKey = cleanEmail.replace(/\./g, '_');
    const preferencesRef = db.ref(`emailPreferences/${emailKey}`);

    // Ensure preferences have proper boolean values
    const cleanPreferences = {
      quizResults: preferences.quizResults === true || preferences.quizResults === 'true',
      studyReminders: preferences.studyReminders === true || preferences.studyReminders === 'true',
      loginAlerts: preferences.loginAlerts === true || preferences.loginAlerts === 'true',
      promotions: preferences.promotions === true || preferences.promotions === 'true',
      newsletters: preferences.newsletters === true || preferences.newsletters === 'true',
      all: false // Not fully unsubscribed if updating preferences
    };

    console.log('📝 Processing preferences update:', {
      email: cleanEmail,
      receivedPreferences: preferences,
      cleanedPreferences: cleanPreferences
    });

    const preferenceData = {
      email: cleanEmail,
      preferences: cleanPreferences,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    // Check if preferences already exist
    const existingSnapshot = await preferencesRef.once('value');
    if (existingSnapshot.exists()) {
      // Update existing preferences, preserve createdAt
      const existingData = existingSnapshot.val();
      preferenceData.createdAt = existingData.createdAt || preferenceData.createdAt;
    }

    // Save to Realtime Database
    await preferencesRef.set(preferenceData);

    return NextResponse.json({
      success: true,
      message: 'Email preferences updated successfully',
      preferences: preferenceData.preferences
    });

  } catch (error: any) {
    console.error('Error updating preferences:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to update preferences. Please try again later.';
    if (error.message === 'Request timeout') {
      errorMessage = 'Request timed out. Please check your connection and try again.';
    } else if (error.code === 'permission-denied') {
      errorMessage = 'Permission denied. Please contact support.';
    } else if (error.code === 'unavailable') {
      errorMessage = 'Service temporarily unavailable. Please try again in a few minutes.';
    }
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve current preferences
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Check if Firebase Admin is initialized
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Use email as key (replace dots with underscores for Firebase key compatibility)
    const emailKey = email.replace(/\./g, '_');
    const preferencesRef = db.ref(`emailPreferences/${emailKey}`);
    const snapshot = await preferencesRef.once('value');

    if (!snapshot.exists()) {
      // Return default preferences (all enabled)
      return NextResponse.json({
        success: true,
        preferences: {
          quizResults: true,
          studyReminders: true,
          loginAlerts: true,
          promotions: true,
          newsletters: true,
          all: false
        }
      });
    }

    const data = snapshot.val();

    return NextResponse.json({
      success: true,
      preferences: data.preferences || {
        quizResults: true,
        studyReminders: true,
        loginAlerts: true,
        promotions: true,
        newsletters: true,
        all: false
      }
    });

  } catch (error: any) {
    console.error('Error retrieving preferences:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve preferences'
      },
      { status: 500 }
    );
  }
}
