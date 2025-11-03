import { NextRequest, NextResponse } from 'next/server';
import { whopService } from '@/lib/whop';
import { auth } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Get user from Firebase Auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get user usage
    const usage = await whopService.getUserUsage(userId);
    
    if (!usage) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, usage });
  } catch (error: any) {
    console.error('Failed to get user usage:', error);
    return NextResponse.json({ 
      error: 'Failed to get usage data',
      details: error.message 
    }, { status: 500 });
  }
}

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

    const { action, amount } = await request.json();

    if (!action || !['token', 'quiz'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
    }

    let success = false;

    if (action === 'token') {
      const tokensUsed = amount || 1000; // Default token usage
      success = await whopService.trackTokenUsage(userId, tokensUsed);
    } else if (action === 'quiz') {
      success = await whopService.trackQuizCreation(userId);
    }

    if (!success) {
      return NextResponse.json({ 
        error: 'Usage limit exceeded',
        message: 'You have reached your plan limits. Please upgrade to continue.'
      }, { status: 403 });
    }

    // Get updated usage
    const usage = await whopService.getUserUsage(userId);

    return NextResponse.json({ 
      success: true, 
      message: 'Usage tracked successfully',
      usage 
    });
  } catch (error: any) {
    console.error('Failed to track usage:', error);
    return NextResponse.json({ 
      error: 'Failed to track usage',
      details: error.message 
    }, { status: 500 });
  }
}