import { NextRequest, NextResponse } from 'next/server';
import { whopService } from '@/lib/whop';
import { subscriptionService } from '@/lib/subscription';

export async function POST(request: NextRequest) {
  try {
    console.log('📨 Received Whop webhook');

    const body = await request.text();
    const signature = request.headers.get('x-whop-signature') || request.headers.get('whop-signature') || '';

    console.log('📋 Webhook details:', {
      hasSignature: !!signature,
      bodyLength: body.length,
      headers: Object.fromEntries(request.headers.entries())
    });

    // Verify webhook signature (skip in development for testing)
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!isDevelopment && !whopService.verifyWebhookSignature(body, signature)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const webhookData = JSON.parse(body);
    console.log('📦 Webhook payload:', JSON.stringify(webhookData, null, 2));

    const result = whopService.processWebhook(webhookData);

    if (!result.success) {
      console.error('❌ Failed to process webhook');
      return NextResponse.json(
        { success: false, error: 'Failed to process webhook' },
        { status: 400 }
      );
    }

    const { event, userId, userEmail, planId, status, subscriptionId } = result;

    console.log(`🔄 Processing Whop webhook: ${event} -> ${status}`);

    // Handle different webhook events
    switch (event) {
      case 'membership_created':
      case 'membership_activated':
        await handleMembershipActivated(userId, userEmail, planId, subscriptionId);
        break;
      
      case 'membership_cancelled':
      case 'membership_expired':
        await handleMembershipCancelled(userId, subscriptionId);
        break;
      
      case 'membership_renewed':
        await handleMembershipRenewed(userId, subscriptionId);
        break;
      
      default:
        console.log(`ℹ️ Unhandled webhook event: ${event}`);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleMembershipActivated(
  userId: string, 
  userEmail: string, 
  planId: string, 
  subscriptionId: string
) {
  try {
    console.log('✅ Processing membership activation for:', userEmail);
    
    // Find user by email
    const db = (await import('@/lib/firebase-admin')).db;
    if (!db) {
      throw new Error('Firebase Admin not initialized');
    }

    const usersRef = db.ref('users');
    const userQuery = await usersRef.orderByChild('email').equalTo(userEmail).once('value');

    let firebaseUserId = userId;
    
    if (userQuery.exists()) {
      userQuery.forEach((child) => {
        firebaseUserId = child.key!;
      });
      console.log(`✅ Found Firebase user: ${firebaseUserId}`);
    } else {
      console.warn(`⚠️ User not found by email: ${userEmail}, using Whop user ID: ${userId}`);
    }

    // Upgrade user plan
    await whopService.upgradePlan(firebaseUserId, userEmail, planId, subscriptionId);

    // Send confirmation email
    try {
      const { sendAutomatedPaymentConfirmation } = await import('@/lib/email-automation');
      const planType = planId === process.env.WHOP_PRO_PRODUCT_ID ? 'pro' : 
                      planId === process.env.WHOP_PREMIUM_PRODUCT_ID ? 'premium' : 'basic';
      const amount = planType === 'pro' ? 2.10 : planType === 'premium' ? 3.86 : 1.05;
      
      await sendAutomatedPaymentConfirmation(
        userEmail,
        'User',
        {
          amount,
          planName: `QuizzicalLabzᴬᴵ ${planType.toUpperCase()} Plan`,
          transactionId: subscriptionId,
          date: new Date().toLocaleDateString()
        }
      );
    } catch (emailError) {
      console.error('❌ Failed to send confirmation email:', emailError);
    }

    console.log(`🎉 Membership activated for user: ${firebaseUserId}`);

  } catch (error) {
    console.error('❌ Error handling membership activation:', error);
    throw error;
  }
}

async function handleMembershipCancelled(userId: string, subscriptionId: string) {
  try {
    console.log('❌ Processing membership cancellation');
    
    // Update subscription status
    await subscriptionService.updateSubscriptionStatus(
      userId,
      'cancelled'
    );

    console.log(`🚫 Membership cancelled for user: ${userId}`);

  } catch (error) {
    console.error('❌ Error handling membership cancellation:', error);
    throw error;
  }
}

async function handleMembershipRenewed(userId: string, subscriptionId: string) {
  try {
    console.log('🔄 Processing membership renewal');
    
    // Update subscription status and extend period
    await subscriptionService.updateSubscriptionStatus(
      userId,
      'active',
      subscriptionId
    );

    console.log(`🔄 Membership renewed for user: ${userId}`);

  } catch (error) {
    console.error('❌ Error handling membership renewal:', error);
    throw error;
  }
}

// Handle GET requests (for webhook verification)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');

  if (challenge) {
    return NextResponse.json({ challenge });
  }

  return NextResponse.json({
    success: true,
    message: 'Whop webhook endpoint is active'
  });
}