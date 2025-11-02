import { NextRequest, NextResponse } from 'next/server';
import { whopService } from '@/lib/whop';
import { subscriptionService } from '@/lib/subscription';

export async function POST(request: NextRequest) {
  try {
    console.log('📨 Received Whop webhook');

    const body = await request.text();
    const signature = request.headers.get('x-whop-signature') || '';

    // Verify webhook signature
    if (!whopService.verifyWebhookSignature(body, signature)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const webhookData = JSON.parse(body);
    console.log('📨 Webhook data:', {
      type: webhookData.type,
      customerId: webhookData.data?.customer?.id,
      status: webhookData.data?.status
    });

    const result = whopService.processWebhook(webhookData);

    if (!result.success) {
      console.error('❌ Failed to process webhook');
      return NextResponse.json(
        { error: 'Failed to process webhook' },
        { status: 400 }
      );
    }

    // Handle different webhook events
    switch (webhookData.type) {
      case 'payment.completed':
        await handlePaymentCompleted(webhookData);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(webhookData);
        break;
      
      case 'subscription.created':
        await handleSubscriptionCreated(webhookData);
        break;
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(webhookData);
        break;
      
      default:
        console.log(`ℹ️ Unhandled webhook event: ${webhookData.type}`);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handlePaymentCompleted(webhookData: any) {
  try {
    console.log('✅ Processing payment completion');
    
    const { customer, product } = webhookData.data;

    // Find user by email
    const userId = await getUserIdByEmail(customer.email);
    if (!userId) {
      console.error('❌ User not found for email:', customer.email);
      return;
    }

    // Record payment
    const paymentId = await subscriptionService.recordPayment({
      userId,
      amount: product.price / 100, // Convert from cents
      currency: 'USD',
      status: 'completed',
      paymentMethod: 'whop',
      orderId: webhookData.data.id,
      description: `QuizzicalLabzᴬᴵ - ${product.name}`
    });

    // Activate subscription if this is a subscription product
    if (product.type === 'subscription') {
      await subscriptionService.createSubscription(userId, 'pro', paymentId);
      console.log('✅ Subscription activated');
    }

    // Send confirmation email
    await sendPaymentConfirmationEmail(customer.email, webhookData.data);

  } catch (error) {
    console.error('❌ Error handling payment completion:', error);
  }
}

async function handlePaymentFailed(webhookData: any) {
  try {
    console.log('❌ Processing payment failure');
    
    const { customer } = webhookData.data;
    
    // Log the failure
    console.error(`Payment failed for customer: ${customer.email}`);

    // Send failure notification email if needed
    // await sendPaymentFailureEmail(customer.email, webhookData.data);

  } catch (error) {
    console.error('❌ Error handling payment failure:', error);
  }
}

async function handleSubscriptionCreated(webhookData: any) {
  try {
    console.log('🔄 Processing subscription creation');
    
    const { customer, product } = webhookData.data;

    // Find user by email
    const userId = await getUserIdByEmail(customer.email);
    if (!userId) {
      console.error('❌ User not found for email:', customer.email);
      return;
    }

    // Update subscription with Whop subscription ID
    await subscriptionService.updateSubscriptionExternalId(
      webhookData.data.id, 
      webhookData.data.id
    );

    console.log('✅ Subscription created and updated');

  } catch (error) {
    console.error('❌ Error handling subscription creation:', error);
  }
}

async function handleSubscriptionCancelled(webhookData: any) {
  try {
    console.log('🚫 Processing subscription cancellation');
    
    const { customer } = webhookData.data;

    // Find user by email
    const userId = await getUserIdByEmail(customer.email);
    if (!userId) {
      console.error('❌ User not found for email:', customer.email);
      return;
    }

    // Cancel subscription in our system
    await subscriptionService.cancelSubscription(webhookData.data.id);

    console.log('✅ Subscription cancelled');

  } catch (error) {
    console.error('❌ Error handling subscription cancellation:', error);
  }
}

async function getUserIdByEmail(email: string): Promise<string | null> {
  try {
    // Get user ID from Firebase Auth by email
    const { auth } = await import('@/lib/firebase-admin');
    const userRecord = await auth.getUserByEmail(email);
    return userRecord.uid;
  } catch (error) {
    console.error('❌ Failed to get user by email:', error);
    return null;
  }
}

async function sendPaymentConfirmationEmail(email: string, paymentData: any) {
  try {
    // Send confirmation email via your notification service
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/payment-confirmed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerEmail: email,
        orderId: paymentData.id,
        amount: paymentData.product.price / 100,
        currency: 'USD',
        productName: paymentData.product.name
      })
    });

    if (response.ok) {
      console.log('✅ Confirmation email sent');
    } else {
      console.error('❌ Failed to send confirmation email');
    }

  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
  }
}