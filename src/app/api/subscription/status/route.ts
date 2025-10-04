import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { subscriptionService } from '@/lib/subscription';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
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
    console.log(`🔍 Checking subscription status for user: ${userId}`);

    // Get user's subscription status
    const subscription = await subscriptionService.getUserSubscription(userId);
    const hasActiveSubscription = await subscriptionService.hasActiveSubscription(userId);

    console.log(`📊 Subscription status:`, {
      hasActive: hasActiveSubscription,
      subscription: subscription ? {
        planId: subscription.planId,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd
      } : null
    });

    return NextResponse.json({
      success: true,
      hasActiveSubscription,
      subscription,
      plan: hasActiveSubscription ? 'Pro' : 'Free',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Subscription status check error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken, forceUpdate = false } = body;

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
    console.log(`🔄 Updating subscription status for user: ${userId}`);

    // Check and update subscription status
    const subscription = await subscriptionService.getUserSubscription(userId);
    const hasActiveSubscription = await subscriptionService.hasActiveSubscription(userId);

    // Update user's plan in Firebase Auth custom claims
    const newPlan = hasActiveSubscription ? 'Pro' : 'Free';
    
    try {
      await auth.setCustomUserClaims(userId, { 
        plan: newPlan,
        subscriptionUpdated: new Date().toISOString()
      });
      console.log(`✅ Updated user custom claims: ${newPlan}`);
    } catch (claimsError) {
      console.error('❌ Failed to update custom claims:', claimsError);
    }

    // Also update in Firebase Database
    const { db } = await import('@/lib/firebase-admin');
    if (db) {
      try {
        await db.ref(`users/${userId}/plan`).set(newPlan);
        await db.ref(`users/${userId}/lastPlanUpdate`).set(new Date().toISOString());
        console.log(`✅ Updated user plan in database: ${newPlan}`);
      } catch (dbError) {
        console.error('❌ Failed to update plan in database:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      plan: newPlan,
      hasActiveSubscription,
      subscription,
      updated: true,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Subscription status update error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update subscription status' },
      { status: 500 }
    );
  }
}