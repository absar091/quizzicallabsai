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

    const { planId } = await request.json();

    if (!planId || !['basic', 'pro', 'premium'].includes(planId)) {
      return NextResponse.json({ error: 'Invalid plan ID' }, { status: 400 });
    }

    // Create checkout URL
    const checkoutUrl = await whopService.createCheckoutUrl(planId, userId, userEmail);

    return NextResponse.json({ 
      success: true, 
      checkoutUrl,
      message: 'Checkout URL created successfully'
    });
  } catch (error: any) {
    console.error('Failed to create checkout URL:', error);
    return NextResponse.json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    }, { status: 500 });
  }
}