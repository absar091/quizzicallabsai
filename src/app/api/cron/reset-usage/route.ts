import { NextRequest, NextResponse } from 'next/server';
import { whopService } from '@/lib/whop';
import { db } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Starting monthly usage reset...');

    // Get all users with active subscriptions
    const usersRef = db.ref('users');
    const snapshot = await usersRef.once('value');
    const users = snapshot.val();

    if (!users) {
      return NextResponse.json({ 
        success: true, 
        message: 'No users found',
        processed: 0 
      });
    }

    let processed = 0;
    let errors = 0;

    // Process each user
    for (const [userId, userData] of Object.entries(users)) {
      try {
        const user = userData as any;
        
        // Skip if user doesn't have subscription data
        if (!user.subscription) continue;

        // Check if billing cycle has ended
        const now = new Date();
        const cycleEnd = new Date(user.subscription.billing_cycle_end);
        
        if (now >= cycleEnd) {
          await whopService.resetMonthlyUsage(userId);
          processed++;
          console.log(`✅ Reset usage for user: ${userId}`);
        }
      } catch (error) {
        console.error(`❌ Failed to reset usage for user ${userId}:`, error);
        errors++;
      }
    }

    console.log(`🎉 Monthly usage reset completed. Processed: ${processed}, Errors: ${errors}`);

    // Also process scheduled plan changes
    const { planSwitchingService } = await import('@/lib/plan-switching');
    const planChangeResults = await planSwitchingService.processScheduledChanges();
    
    console.log(`📋 Processed ${planChangeResults.processed} scheduled plan changes`);

    return NextResponse.json({
      success: true,
      message: 'Monthly usage reset and plan changes completed',
      usageReset: {
        processed,
        errors,
      },
      planChanges: {
        processed: planChangeResults.processed,
        errors: planChangeResults.errors,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Monthly usage reset failed:', error);
    return NextResponse.json({
      error: 'Failed to reset monthly usage',
      details: error.message,
    }, { status: 500 });
  }
}

// Also allow POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}