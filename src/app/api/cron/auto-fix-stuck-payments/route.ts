import { NextRequest, NextResponse } from 'next/server';
import { db as adminDb } from '@/lib/firebase-admin';
import { planActivationService } from '@/lib/plan-activation';

/**
 * Automated Cron Job to Fix Stuck Payments
 * 
 * This endpoint automatically:
 * 1. Finds users with pending_plan_change older than 5 minutes
 * 2. Checks if they have a pending_purchase
 * 3. Automatically activates their plan
 * 4. Sends notification email
 * 
 * Run this every 5 minutes via cron job
 * 
 * GET /api/cron/auto-fix-stuck-payments?secret=CRON_SECRET
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Verify cron secret
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    const expectedSecret = process.env.CRON_SECRET;
    if (secret !== expectedSecret) {
      console.error('❌ Invalid cron secret');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!adminDb) {
      return NextResponse.json({ 
        error: 'Firebase Admin not initialized' 
      }, { status: 500 });
    }

    console.log('🔍 Starting automatic stuck payment detection...');

    const results = {
      checked: 0,
      fixed: 0,
      failed: 0,
      users: [] as any[]
    };

    // Get all users with pending_plan_change
    const usersRef = adminDb.ref('users');
    const usersSnapshot = await usersRef.once('value');

    if (!usersSnapshot.exists()) {
      return NextResponse.json({
        success: true,
        message: 'No users found',
        results
      });
    }

    const now = Date.now();
    const FIVE_MINUTES = 5 * 60 * 1000;

    // Check each user
    const users = usersSnapshot.val();
    for (const userId in users) {
      const user = users[userId];
      
      // Check if user has pending_plan_change
      if (!user.pending_plan_change) continue;
      
      results.checked++;
      
      const pendingChange = user.pending_plan_change;
      const requestedAt = new Date(pendingChange.requested_at).getTime();
      const ageInMinutes = (now - requestedAt) / 60000;

      // Skip if less than 5 minutes old
      if (now - requestedAt < FIVE_MINUTES) {
        console.log(`⏳ User ${userId}: Pending change is ${ageInMinutes.toFixed(1)} minutes old, waiting...`);
        continue;
      }

      console.log(`🚨 User ${userId}: Stuck payment detected! Age: ${ageInMinutes.toFixed(1)} minutes`);

      try {
        // Get user email
        const userEmail = user.email || 'unknown@example.com';
        
        // Get pending purchase to determine the plan
        const pendingPurchaseRef = adminDb.ref(`pending_purchases/${userId}`);
        const pendingPurchaseSnapshot = await pendingPurchaseRef.once('value');
        
        let targetPlan = pendingChange.requested_plan || 'pro';
        
        if (pendingPurchaseSnapshot.exists()) {
          const pendingPurchase = pendingPurchaseSnapshot.val();
          targetPlan = pendingPurchase.requested_plan || targetPlan;
        }

        // Validate plan
        if (!['basic', 'pro', 'premium'].includes(targetPlan)) {
          console.error(`❌ Invalid plan for user ${userId}: ${targetPlan}`);
          results.failed++;
          results.users.push({
            userId,
            email: userEmail,
            status: 'failed',
            error: 'Invalid plan',
            plan: targetPlan
          });
          continue;
        }

        console.log(`🔧 Auto-fixing user ${userId}: Activating ${targetPlan} plan...`);

        // Activate the plan
        const activationResult = await planActivationService.activatePlan({
          userId,
          userEmail,
          plan: targetPlan as 'basic' | 'pro' | 'premium',
          subscriptionId: `auto_fix_${Date.now()}`,
          source: 'admin',
          amount: 0
        });

        if (activationResult.success) {
          console.log(`✅ User ${userId}: Plan activated successfully!`);
          
          // Force refresh all usage nodes to ensure consistency
          try {
            const subscriptionRef = adminDb.ref(`users/${userId}/subscription`);
            const subscriptionSnapshot = await subscriptionRef.once('value');
            
            if (subscriptionSnapshot.exists()) {
              const subscription = subscriptionSnapshot.val();
              const currentDate = new Date();
              const year = currentDate.getFullYear();
              const month = currentDate.getMonth() + 1;
              
              // Update current month usage node
              const usageRef = adminDb.ref(`usage/${userId}/${year}/${month}`);
              await usageRef.update({
                plan: subscription.plan,
                tokens_limit: subscription.tokens_limit,
                updated_at: currentDate.toISOString()
              });
              
              // Update metadata
              const metadataRef = adminDb.ref(`users/${userId}/metadata`);
              await metadataRef.update({
                plan: subscription.plan,
                updated_at: currentDate.toISOString()
              });
              
              console.log(`🔄 User ${userId}: All nodes refreshed`);
            }
          } catch (refreshError) {
            console.error(`⚠️ Failed to refresh nodes for ${userId}:`, refreshError);
          }
          
          results.fixed++;
          results.users.push({
            userId,
            email: userEmail,
            status: 'fixed',
            plan: targetPlan,
            tokensLimit: activationResult.tokensLimit,
            ageInMinutes: ageInMinutes.toFixed(1)
          });

          // Send notification email
          try {
            const { sendAutomatedPaymentConfirmation } = await import('@/lib/email-automation');
            await sendAutomatedPaymentConfirmation(
              userEmail,
              user.displayName || 'User',
              {
                amount: 0,
                planName: `QuizzicalLabzᴬᴵ ${targetPlan.toUpperCase()} Plan`,
                transactionId: `auto_fix_${Date.now()}`,
                date: new Date().toLocaleDateString()
              }
            );
            console.log(`📧 Confirmation email sent to ${userEmail}`);
          } catch (emailError) {
            console.error(`❌ Failed to send email to ${userEmail}:`, emailError);
          }

        } else {
          console.error(`❌ User ${userId}: Activation failed:`, activationResult.error);
          results.failed++;
          results.users.push({
            userId,
            email: userEmail,
            status: 'failed',
            error: activationResult.error,
            plan: targetPlan
          });
        }

      } catch (error: any) {
        console.error(`❌ Error processing user ${userId}:`, error);
        results.failed++;
        results.users.push({
          userId,
          status: 'failed',
          error: error.message
        });
      }
    }

    const duration = Date.now() - startTime;

    console.log(`✅ Auto-fix complete: ${results.fixed} fixed, ${results.failed} failed, ${results.checked} checked in ${duration}ms`);

    return NextResponse.json({
      success: true,
      message: `Auto-fix complete: ${results.fixed} users fixed`,
      results,
      duration: `${duration}ms`
    });

  } catch (error: any) {
    console.error('❌ Auto-fix cron job failed:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
