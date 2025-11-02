import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { createSubscriptionCheckout, createOneTimeCheckout } from '@/lib/whop';
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

    console.log(`💳 Creating payment for user: ${userEmail} (${planId})`);

    // Check if user already has active subscription
    const hasActive = await subscriptionService.hasActiveSubscription(userId);
    if (hasActive && paymentType === 'subscription') {
      return NextResponse.json(
        { success: false, error: 'You already have an active subscription' },
        { status: 400 }
      );
    }

    let paymentResponse;

    if (paymentType === 'subscription') {
      // Create subscription checkout
      paymentResponse = await createSubscriptionCheckout(
        userEmail,
        userName,
        planId as 'pro' | 'premium'
      );
    } else {
      // Create one-time checkout
      const { productId } = body;
      if (!productId) {
        return NextResponse.json(
          { success: false, error: 'Product ID required for one-time payments' },
          { status: 400 }
        );
      }

      paymentResponse = await createOneTimeCheckout(
        userEmail,
        userName,
        productId
      );
    }

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
      orderId: paymentResponse.sessionId!,
      description: `Quizzicallabzᴬᴵ ${planId} Subscription`
    });

    // Create pending subscription
    if (paymentType === 'subscription') {
      await subscriptionService.createSubscription(userId, planId, paymentId);
    }

    return NextResponse.json({
      success: true,
      paymentUrl: paymentResponse.checkoutUrl,
      sessionId: paymentResponse.sessionId,
      paymentId
    });

  } catch (error: any) {
    console.error('❌ Payment creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment creation failed' },
      { status: 500 }
    );
  }
}