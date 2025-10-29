import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { secureLog } from '@/lib/secure-logger';

export async function POST(request: NextRequest) {
  try {
    const { email, originalEmail } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    let user;
    
    try {
      // Try to get user by the provided email first
      user = await auth.getUserByEmail(email);
    } catch (emailError: any) {
      if (originalEmail && originalEmail !== email) {
        // If email not found and we have an original email, try that
        try {
          user = await auth.getUserByEmail(originalEmail);
          // Update the user's email to the new one
          await auth.updateUser(user.uid, {
            email: email,
            emailVerified: true
          });
          
          secureLog('info', 'User email updated during verification', {
            uid: user.uid,
            oldEmail: originalEmail,
            newEmail: email
          });
          
          return NextResponse.json({ 
            success: true,
            message: 'Email updated and user marked as verified'
          });
        } catch (originalEmailError: any) {
          secureLog('error', 'Failed to find user by original email', {
            email,
            originalEmail,
            error: originalEmailError.message
          });
          throw new Error('User not found with provided email addresses');
        }
      } else {
        throw emailError;
      }
    }

    // Mark user as verified
    await auth.updateUser(user.uid, {
      emailVerified: true
    });

    secureLog('info', 'User marked as verified', {
      uid: user.uid,
      email
    });

    return NextResponse.json({ 
      success: true,
      message: 'User marked as verified in Firebase Auth'
    });

  } catch (error: any) {
    secureLog('error', 'Mark verified error', { error: error.message });
    return NextResponse.json({ 
      error: 'Failed to mark user as verified: ' + error.message 
    }, { status: 500 });
  }
}