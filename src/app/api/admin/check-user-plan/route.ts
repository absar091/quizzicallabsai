import { NextRequest, NextResponse } from 'next/server';
import { db as adminDb } from '@/lib/firebase-admin';

/**
 * Admin endpoint to check a user's plan details across all Firebase nodes
 * Use this to diagnose plan inconsistencies
 * 
 * GET /api/admin/check-user-plan?userId=xxx&adminSecret=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const adminSecret = searchParams.get('adminSecret');

    // Verify admin secret
    const expectedSecret = process.env.ADMIN_SECRET_CODE || process.env.ADMIN_SECRET || 'your-secret-key';
    if (adminSecret !== expectedSecret) {
      console.error('❌ Invalid admin secret');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!userId) {
      return NextResponse.json({ 
        error: 'Missing userId parameter' 
      }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ 
        error: 'Firebase Admin not initialized' 
      }, { status: 500 });
    }

    console.log(`🔍 Checking plan details for user: ${userId}`);

    // Get subscription node
    const subscriptionRef = adminDb.ref(`users/${userId}/subscription`);
    const subscriptionSnapshot = await subscriptionRef.once('value');
    const subscription = subscriptionSnapshot.exists() ? subscriptionSnapshot.val() : null;

    // Get usage node
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const usageRef = adminDb.ref(`usage/${userId}/${year}/${month}`);
    const usageSnapshot = await usageRef.once('value');
    const usage = usageSnapshot.exists() ? usageSnapshot.val() : null;

    // Get metadata node
    const metadataRef = adminDb.ref(`users/${userId}/metadata`);
    const metadataSnapshot = await metadataRef.once('value');
    const metadata = metadataSnapshot.exists() ? metadataSnapshot.val() : null;

    // Get pending plan change
    const pendingRef = adminDb.ref(`users/${userId}/pending_plan_change`);
    const pendingSnapshot = await pendingRef.once('value');
    const pendingPlanChange = pendingSnapshot.exists() ? pendingSnapshot.val() : null;

    // Get pending purchase
    const pendingPurchaseRef = adminDb.ref(`pending_purchases/${userId}`);
    const pendingPurchaseSnapshot = await pendingPurchaseRef.once('value');
    const pendingPurchase = pendingPurchaseSnapshot.exists() ? pendingPurchaseSnapshot.val() : null;

    // Check for inconsistencies
    const inconsistencies = [];
    
    if (subscription && usage) {
      if (subscription.plan !== usage.plan) {
        inconsistencies.push({
          type: 'PLAN_MISMATCH',
          message: 'Plan mismatch between subscription and usage',
          subscription: subscription.plan,
          usage: usage.plan
        });
      }
      
      if (subscription.tokens_limit !== usage.tokens_limit) {
        inconsistencies.push({
          type: 'TOKEN_LIMIT_MISMATCH',
          message: 'Token limit mismatch',
          subscription: subscription.tokens_limit,
          usage: usage.tokens_limit
        });
      }
    }

    if (subscription && metadata) {
      if (subscription.plan !== metadata.plan) {
        inconsistencies.push({
          type: 'METADATA_MISMATCH',
          message: 'Plan mismatch between subscription and metadata',
          subscription: subscription.plan,
          metadata: metadata.plan
        });
      }
    }

    if (pendingPlanChange) {
      inconsistencies.push({
        type: 'PENDING_PLAN_CHANGE',
        message: 'User has pending plan change',
        details: pendingPlanChange
      });
    }

    const result = {
      userId,
      timestamp: new Date().toISOString(),
      nodes: {
        subscription,
        usage,
        metadata,
        pendingPlanChange,
        pendingPurchase
      },
      inconsistencies,
      isConsistent: inconsistencies.length === 0,
      summary: {
        currentPlan: subscription?.plan || 'unknown',
        subscriptionStatus: subscription?.subscription_status || 'unknown',
        tokensUsed: subscription?.tokens_used || 0,
        tokensLimit: subscription?.tokens_limit || 0,
        hasPendingChange: !!pendingPlanChange
      }
    };

    console.log('✅ Plan check complete:', result.summary);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('❌ Error checking user plan:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
