import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';

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

    const unsubscribeRef = doc(firestore, 'email-preferences', email);

    // Check if document exists
    const docSnap = await getDoc(unsubscribeRef);

    const unsubscribeData = {
      email,
      unsubscribedAt: Timestamp.now(),
      preferences: preferences || {
        quizResults: false,
        studyReminders: false,
        loginAlerts: false,
        promotions: false,
        newsletters: false,
        all: true
      },
      updatedAt: Timestamp.now()
    };

    if (docSnap.exists()) {
      // Update existing document
      await updateDoc(unsubscribeRef, unsubscribeData);
    } else {
      // Create new document
      await setDoc(unsubscribeRef, {
        ...unsubscribeData,
        createdAt: Timestamp.now()
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from emails'
    });

  } catch (error: any) {
    console.error('Error unsubscribing:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to unsubscribe. Please try again later.'
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

    const unsubscribeRef = doc(firestore, 'email-preferences', email);
    const docSnap = await getDoc(unsubscribeRef);

    if (!docSnap.exists()) {
      return NextResponse.json({
        success: true,
        subscribed: true,
        preferences: {
          quizResults: true,
          studyReminders: true,
          loginAlerts: true,
          promotions: true,
          newsletters: true
        }
      });
    }

    const data = docSnap.data();

    return NextResponse.json({
      success: true,
      subscribed: !data.preferences?.all,
      preferences: data.preferences || {}
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
