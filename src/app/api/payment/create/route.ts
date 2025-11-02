import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { createWhopSubscriptionPayment } from '@/lib/whop';
import { subscriptionService } from '@/lib/subscription';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken, planId, paymentType = 'subscription' } = body;

    // Verify authentication
    if (!idToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;
    const userEmail = decodedToken.email!;
    const userName = decodedToken.name || 'User';

    console.log(`💳 Creating Whop payment for user: ${userEmail} (${planId})`);

    // Check if user already has active subscription
    const hasActive = await subscriptionService.hasActiveSubscription(userId);
    if (hasActive && paymentType === 'subscription') {
      return NextResponse.json(
        { success: false, error: 'You already have an active subscription' },
        { status: 400 }
      );
    }

    if (paymentType === 'subscription') {
      // Create Whop subscription payment
      const paymentResponse = await createWhopSubscriptionPayment(
        userEmail,
        userName,
        planId as 'pro' | 'premium'
      );

      if (!paymentResponse.success) {
        return NextResponse.json(
          { success: false, error: paymentResponse.error },
          { status: 400 }
        );
      }

      // Record payment in database
      const paymentId = await subscriptionService.recordPayment({
        userId,
        amount: planId === 'pro' ? 2 : 5,
        currency: 'USD',
        status: 'pending',
        paymentMethod: 'whop',
        orderId: paymentResponse.sessionId || `whop_${Date.now()}`,
        description: `QuizzicalLabzᴬᴵ ${planId} Subscription`
      });

      // Create pending subscription
      await subscriptionService.createSubscription(userId, planId, paymentId);

      return NextResponse.json({
        success: true,
        paymentUrl: paymentResponse.checkoutUrl,
        planId: paymentResponse.planId,
        sessionId: paymentResponse.sessionId,
        paymentId
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'One-time payments not supported with Whop integration' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('❌ Payment creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment creation failed' },
      { status: 500 }
    );
  }
}