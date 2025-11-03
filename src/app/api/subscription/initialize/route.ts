import { NextRequest, NextResponse } from 'next/server';
import { whopService } from '@/lib/whop';
import { auth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // Get user from Firebase Auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;
    const userEmail = decodedToken.email || '';
    const userName = decodedToken.name || userEmail.split('@')[0];

    // Initialize user with free plan
    await whopService.initializeUser(userId, userEmail, userName);

    // Get initial usage data
    const usage = await whopService.getUserUsage(userId);

    return NextResponse.json({ 
      success: true, 
      message: 'User initialized successfully',
      usage
    });
  } catch (error: any) {
    console.error('Failed to initialize user:', error);
    return NextResponse.json({ 
      error: 'Failed to initialize user subscription',
      details: error.message 
    }, { status: 500 });
  }
}