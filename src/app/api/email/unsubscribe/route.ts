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

    const unsubscribeData = {
      email: cleanEmail,
      preferences: preferences || {
        quizResults: false,
        studyReminders: false,
        loginAlerts: false,
        promotions: false,
        newsletters: false,
        all: true // Complete unsubscribe
      },
      updatedAt: new Date().toISOString(),
      unsubscribedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    // Check if preferences already exist
    const existingSnapshot = await preferencesRef.once('value');
    if (existingSnapshot.exists()) {
      // Update existing preferences, preserve createdAt
      const existingData = existingSnapshot.val();
      unsubscribeData.createdAt = existingData.createdAt || new Date().toISOString();
    } else {
      unsubscribeData.createdAt = new Date().toISOString();
    }

    // Save to Realtime Database
    await preferencesRef.set(unsubscribeData);

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from emails'
    });

  } catch (error: any) {
    console.error('Error unsubscribing:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to unsubscribe. Please try again later.';
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

// GET endpoint to check unsubscribe status
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
      return NextResponse.json({
        success: true,
        subscribed: true,
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
      subscribed: !data.preferences?.all,
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
    console.error('Error checking subscription status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check subscription status'
      },
      { status: 500 }
    );
  }
}
