import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Get user by email and mark as verified
    const user = await auth.getUserByEmail(email);
    await auth.updateUser(user.uid, {
      emailVerified: true
    });

    return NextResponse.json({ 
      success: true,
      message: 'User marked as verified in Firebase Auth'
    });

  } catch (error: any) {
    console.error('Mark verified error:', error);
    return NextResponse.json({ 
      error: 'Failed to mark user as verified' 
    }, { status: 500 });
  }
}