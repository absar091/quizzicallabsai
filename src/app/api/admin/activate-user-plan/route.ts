import { NextRequest, NextResponse } from 'next/server';
import { planActivationService } from '@/lib/plan-activation';

/**
 * Admin endpoint to manually activate a user's plan
 * Use this when webhook fails or for manual upgrades
 * 
 * POST /api/admin/activate-user-plan
 * Body: { userId: string, plan: 'basic' | 'pro' | 'premium', adminSecret: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, plan, adminSecret, userEmail } = body;

    // Verify admin secret (allow AUTO_FIX_FROM_CLIENT for automatic fixes)
    const expectedSecret = process.env.ADMIN_SECRET_CODE || process.env.ADMIN_SECRET || 'your-secret-key';
    const isAutoFix = adminSecret === 'AUTO_FIX_FROM_CLIENT';
    
    if (!isAutoFix && adminSecret !== expectedSecret) {
      console.error('❌ Invalid admin secret');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (isAutoFix) {
      console.log('🤖 Auto-fix triggered from client');
    }

    // Validate inputs
    if (!userId || !plan) {
      return NextResponse.json({ 
        error: 'Missing required fields: userId and plan' 
      }, { status: 400 });
    }

    if (!['basic', 'pro', 'premium'].includes(plan)) {
      return NextResponse.json({ 
        error: 'Invalid plan. Must be: basic, pro, or premium' 
      }, { status: 400 });
    }

    console.log(`🔧 Admin manually activating plan for user ${userId} to ${plan}`);

    // Use Plan Activation Service
    const result = await planActivationService.activatePlan({
      userId,
      userEmail: userEmail || 'admin@quizzicallabz.qzz.io',
      plan,
      subscriptionId: `admin_manual_${Date.now()}`,
      source: 'admin',
      amount: 0
    });

    if (result.success) {
      console.log('✅ Plan activated successfully:', result);
      
      // Verify activation
      const verified = await planActivationService.verifyActivation(userId);
      
      return NextResponse.json({ 
        success: true,
        message: `User ${userId} upgraded to ${plan} plan`,
        result,
        verified
      });
    } else {
      console.error('❌ Plan activation failed:', result.error);
      return NextResponse.json({ 
        error: result.error || 'Plan activation failed' 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ Error activating user plan:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}

// GET endpoint to check if admin endpoint is working
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Admin plan activation endpoint is active',
    usage: 'POST with { userId, plan, adminSecret, userEmail? }'
  });
}
