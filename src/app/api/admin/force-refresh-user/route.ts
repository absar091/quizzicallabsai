import { NextRequest, NextResponse } from 'next/server';
import { db as adminDb } from '@/lib/firebase-admin';

/**
 * Force refresh user data by clearing cache and reinitializing
 * 
 * POST /api/admin/force-refresh-user
 * Body: { userId: string, adminSecret: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, adminSecret } = body;

    // Verify admin secret
    const expectedSecret = process.env.ADMIN_SECRET_CODE || process.env.ADMIN_SECRET || 'your-secret-key';
    if (adminSecret !== expectedSecret) {
      console.error('❌ Invalid admin secret');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!userId) {
      return NextResponse.json({ 
        error: 'Missing userId' 
      }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ 
        error: 'Firebase Admin not initialized' 
      }, { status: 500 });
    }

    console.log(`🔄 Force refreshing user data for: ${userId}`);

    // Get current subscription data
    const subscriptionRef = adminDb.ref(`users/${userId}/subscription`);
    const subscriptionSnapshot = await subscriptionRef.once('value');
    
    if (!subscriptionSnapshot.exists()) {
      return NextResponse.json({ 
        error: 'User subscription not found' 
      }, { status: 404 });
    }

    const subscription = subscriptionSnapshot.val();
    const plan = subscription.plan;
    const tokensLimit = subscription.tokens_limit;
    const quizzesLimit = subscription.quizzes_limit;

    // Force update usage node for current month
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    const usageRef = adminDb.ref(`usage/${userId}/${year}/${month}`);
    await usageRef.update({
      plan,
      tokens_limit: tokensLimit,
      updated_at: now.toISOString()
    });

    console.log(`✅ Usage node updated: ${plan} with ${tokensLimit} tokens`);

    // Update metadata
    const metadataRef = adminDb.ref(`users/${userId}/metadata`);
    await metadataRef.update({
      plan,
      updated_at: now.toISOString()
    });

    console.log(`✅ Metadata updated`);

    // Clear any old usage nodes
    const allUsageRef = adminDb.ref(`usage/${userId}`);
    const allUsageSnapshot = await allUsageRef.once('value');
    
    if (allUsageSnapshot.exists()) {
      const allUsage = allUsageSnapshot.val();
      for (const yearKey in allUsage) {
        for (const monthKey in allUsage[yearKey]) {
          const usagePath = `usage/${userId}/${yearKey}/${monthKey}`;
          const oldUsageRef = adminDb.ref(usagePath);
          await oldUsageRef.update({
            plan,
            tokens_limit: tokensLimit,
            updated_at: now.toISOString()
          });
          console.log(`✅ Updated old usage node: ${usagePath}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'User data refreshed successfully',
      data: {
        userId,
        plan,
        tokensLimit,
        quizzesLimit,
        updatedPaths: [
          `users/${userId}/subscription`,
          `usage/${userId}/${year}/${month}`,
          `users/${userId}/metadata`
        ]
      }
    });

  } catch (error: any) {
    console.error('❌ Error refreshing user data:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
