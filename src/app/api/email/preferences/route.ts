import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, preferences } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address is required' },
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
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const preferencesRef = doc(firestore, 'email-preferences', email);

    // Check if document exists
    const docSnap = await getDoc(preferencesRef);

    const preferenceData = {
      email,
      preferences: {
        quizResults: preferences.quizResults ?? true,
        studyReminders: preferences.studyReminders ?? true,
        loginAlerts: preferences.loginAlerts ?? true,
        promotions: preferences.promotions ?? true,
        newsletters: preferences.newsletters ?? true,
        all: false // Not fully unsubscribed if updating preferences
      },
      updatedAt: Timestamp.now()
    };

    if (docSnap.exists()) {
      // Update existing document
      await updateDoc(preferencesRef, preferenceData);
    } else {
      // Create new document
      await setDoc(preferencesRef, {
        ...preferenceData,
        createdAt: Timestamp.now()
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Email preferences updated successfully',
      preferences: preferenceData.preferences
    });

  } catch (error: any) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update preferences. Please try again later.'
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

    const preferencesRef = doc(firestore, 'email-preferences', email);
    const docSnap = await getDoc(preferencesRef);

    if (!docSnap.exists()) {
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

    const data = docSnap.data();

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
