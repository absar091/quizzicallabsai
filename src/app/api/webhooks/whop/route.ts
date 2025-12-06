import { NextRequest, NextResponse } from 'next/server';
import { whopService } from '@/lib/whop';
import { subscriptionService } from '@/lib/subscription';
import { planActivationService } from '@/lib/plan-activation';
import { db as adminDb } from '@/lib/firebase-admin';

// Retry configuration
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 1000; // 1 second

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let webhookData: any = null;
  let body = '';

  try {
    console.log('📨 Received Whop webhook');

    body = await request.text();
    const signature = request.headers.get('x-whop-signature') || request.headers.get('whop-signature') || '';

    console.log('📋 Webhook details:', {
      hasSignature: !!signature,
      bodyLength: body.length,
      timestamp: new Date().toISOString(),
      headers: Object.fromEntries(request.headers.entries())
    });

    // Verify webhook signature (skip in development for testing)
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!isDevelopment && !whopService.verifyWebhookSignature(body, signature)) {
      console.error('❌ Invalid webhook signature');
      await logWebhookError({
        type: 'SIGNATURE_INVALID',
        message: 'Invalid webhook signature',
        webhookPayload: body,
        timestamp: new Date().toISOString(),
        retryable: false
      });
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }

    webhookData = JSON.parse(body);
    console.log('📦 Webhook payload:', JSON.stringify(webhookData, null, 2));

    // Extract amount from webhook data
    const amount = webhookData.data?.amount || webhookData.amount || 0;
    console.log('💰 Transaction amount:', amount);

    const result = whopService.processWebhook(webhookData);

    if (!result.success) {
      console.error('❌ Failed to process webhook');
      await logWebhookError({
        type: 'INVALID_PAYLOAD',
        message: 'Failed to process webhook payload',
        webhookPayload: webhookData,
        timestamp: new Date().toISOString(),
        retryable: false
      });
      return NextResponse.json(
        { success: false, error: 'Failed to process webhook' },
        { status: 400 }
      );
    }

    const { event, userId, userEmail, planId, status, subscriptionId } = result;

    console.log(`🔄 Processing Whop webhook: ${event} -> ${status}`, {
      userId,
      userEmail,
      planId,
      subscriptionId,
      amount
    });

    // Handle different webhook events
    switch (event) {
      case 'membership_created':
      case 'membership_activated':
        await handleMembershipActivated(userId, userEmail, planId, subscriptionId, amount, webhookData);
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

    const processingTime = Date.now() - startTime;
    console.log(`✅ Webhook processed successfully in ${processingTime}ms`);

    return NextResponse.json({ success: true, processingTime });

  } catch (error: any) {
    console.error('❌ Webhook processing error:', error);
    
    // Log error to Firebase
    await logWebhookError({
      type: 'DATABASE_ERROR',
      message: error.message || 'Internal server error',
      webhookPayload: webhookData || body,
      timestamp: new Date().toISOString(),
      retryable: true,
      stack: error.stack
    });

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle zero-dollar transactions (promo codes)
 * These transactions should activate the plan immediately without payment verification
 */
async function handleZeroDollarTransaction(
  userId: string,
  userEmail: string,
  planId: string,
  subscriptionId: string
): Promise<void> {
  console.log('💵 Processing zero-dollar transaction (promo code):', {
    userId,
    userEmail,
    planId,
    subscriptionId
  });

  // Map Whop plan ID to our plan names
  const planMapping: Record<string, 'basic' | 'pro' | 'premium'> = {
    [process.env.WHOP_BASIC_PRODUCT_ID || '']: 'basic',
    [process.env.WHOP_PRO_PRODUCT_ID || '']: 'pro',
    [process.env.WHOP_PREMIUM_PRODUCT_ID || '']: 'premium',
  };

  const plan = planMapping[planId];
  if (!plan) {
    throw new Error(`Invalid plan ID: ${planId}`);
  }

  // Use Plan Activation Service for zero-dollar transactions
  const result = await planActivationService.activatePlan({
    userId,
    userEmail,
    plan,
    subscriptionId,
    source: 'whop',
    amount: 0
  });

  if (!result.success) {
    throw new Error(`Plan activation failed: ${result.error}`);
  }

  console.log('✅ Zero-dollar transaction processed successfully:', result);
}

async function handleMembershipActivated(
  userId: string, 
  userEmail: string, 
  planId: string, 
  subscriptionId: string,
  amount: number = 0,
  webhookPayload: any = null
) {
  let retryCount = 0;
  let lastError: Error | null = null;

  // Exponential backoff retry logic
  while (retryCount < MAX_RETRIES) {
    try {
      console.log(`✅ Processing membership activation (attempt ${retryCount + 1}/${MAX_RETRIES}):`, {
        userEmail,
        amount,
        isZeroDollar: amount === 0
      });
      
      // Find user by email
      if (!adminDb) {
        throw new Error('Firebase Admin not initialized');
      }

      const usersRef = adminDb.ref('users');
      const userQuery = await usersRef.orderByChild('email').equalTo(userEmail).once('value');

      let firebaseUserId = userId;
      
      if (userQuery.exists()) {
        userQuery.forEach((child) => {
          firebaseUserId = child.key!;
        });
        console.log(`✅ Found Firebase user: ${firebaseUserId}`);
      } else {
        console.warn(`⚠️ User not found by email: ${userEmail}, using Whop user ID: ${userId}`);
        
        // Log error for user not found (retryable - user might register soon)
        await logWebhookError({
          type: 'USER_NOT_FOUND',
          message: `User not found by email: ${userEmail}`,
          userId,
          userEmail,
          webhookPayload,
          timestamp: new Date().toISOString(),
          retryable: true
        });

        // Return 404 to trigger Whop retry
        throw new Error('USER_NOT_FOUND');
      }

      // Update pending purchase with webhook received timestamp
      const pendingPurchaseRef = adminDb.ref(`pending_purchases/${firebaseUserId}`);
      const pendingSnapshot = await pendingPurchaseRef.once('value');
      
      if (pendingSnapshot.exists()) {
        await pendingPurchaseRef.update({
          webhook_received_at: new Date().toISOString(),
          status: 'processing'
        });
      }

      // Handle zero-dollar transactions (promo codes)
      if (amount === 0) {
        console.log('💵 Detected zero-dollar transaction, using special handling');
        await handleZeroDollarTransaction(firebaseUserId, userEmail, planId, subscriptionId);
      } else {
        // Regular paid transaction - use Plan Activation Service
        console.log('💰 Processing regular paid transaction');
        
        // Map Whop plan ID to our plan names
        const planMapping: Record<string, 'basic' | 'pro' | 'premium'> = {
          [process.env.WHOP_BASIC_PRODUCT_ID || '']: 'basic',
          [process.env.WHOP_PRO_PRODUCT_ID || '']: 'pro',
          [process.env.WHOP_PREMIUM_PRODUCT_ID || '']: 'premium',
        };

        const plan = planMapping[planId];
        if (!plan) {
          throw new Error(`Invalid plan ID: ${planId}`);
        }

        const result = await planActivationService.activatePlan({
          userId: firebaseUserId,
          userEmail,
          plan,
          subscriptionId,
          source: 'whop',
          amount
        });

        if (!result.success) {
          throw new Error(`Plan activation failed: ${result.error}`);
        }

        console.log('✅ Plan activation completed:', result);
      }

      // Verify activation was successful
      const verificationResult = await planActivationService.verifyActivation(firebaseUserId);
      if (!verificationResult) {
        console.warn('⚠️ Plan activation verification failed, but continuing...');
      }

      // Send confirmation email
      try {
        const { sendAutomatedPaymentConfirmation } = await import('@/lib/email-automation');
        const planType = planId === process.env.WHOP_PRO_PRODUCT_ID ? 'pro' : 
                        planId === process.env.WHOP_PREMIUM_PRODUCT_ID ? 'premium' : 'basic';
        const emailAmount = amount > 0 ? amount : (planType === 'pro' ? 2.10 : planType === 'premium' ? 3.86 : 1.05);
        
        await sendAutomatedPaymentConfirmation(
          userEmail,
          'User',
          {
            amount: emailAmount,
            planName: `QuizzicalLabzᴬᴵ ${planType.toUpperCase()} Plan`,
            transactionId: subscriptionId,
            date: new Date().toLocaleDateString()
          }
        );
      } catch (emailError) {
        console.error('❌ Failed to send confirmation email:', emailError);
        // Don't fail the webhook for email errors
      }

      console.log(`🎉 Membership activated successfully for user: ${firebaseUserId}`);
      return; // Success - exit retry loop

    } catch (error: any) {
      lastError = error;
      retryCount++;

      console.error(`❌ Error handling membership activation (attempt ${retryCount}/${MAX_RETRIES}):`, error);

      // Don't retry for user not found errors immediately
      if (error.message === 'USER_NOT_FOUND') {
        throw error;
      }

      // Log the error
      await logWebhookError({
        type: 'PLAN_ACTIVATION_FAILED',
        message: error.message || 'Plan activation failed',
        userId,
        userEmail,
        webhookPayload,
        timestamp: new Date().toISOString(),
        retryable: true,
        retryCount,
        stack: error.stack
      });

      if (retryCount < MAX_RETRIES) {
        // Exponential backoff: 1s, 2s, 4s, 8s, 16s
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount - 1);
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All retries exhausted
  console.error(`❌ Failed to activate membership after ${MAX_RETRIES} attempts`);
  throw lastError || new Error('Plan activation failed after all retries');
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

/**
 * Log webhook errors to Firebase for debugging and monitoring
 */
async function logWebhookError(error: {
  type: 'SIGNATURE_INVALID' | 'USER_NOT_FOUND' | 'PLAN_ACTIVATION_FAILED' | 'DATABASE_ERROR' | 'INVALID_PAYLOAD';
  message: string;
  userId?: string;
  userEmail?: string;
  webhookPayload?: any;
  timestamp: string;
  retryable: boolean;
  retryCount?: number;
  stack?: string;
}): Promise<void> {
  try {
    if (!adminDb) {
      console.error('❌ Cannot log webhook error: Firebase Admin not initialized');
      return;
    }

    const errorRef = adminDb.ref('webhook_errors').push();
    await errorRef.set({
      ...error,
      id: errorRef.key,
      logged_at: new Date().toISOString()
    });

    console.log('📝 Webhook error logged to Firebase:', errorRef.key);
  } catch (logError) {
    console.error('❌ Failed to log webhook error to Firebase:', logError);
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