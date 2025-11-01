import { NextRequest, NextResponse } from 'next/server';
import { payoneerService } from '@/lib/payoneer';
import { subscriptionService } from '@/lib/subscription';

export async function POST(request: NextRequest) {
  try {
    console.log('📨 Received Payoneer webhook');

    const body = await request.text();
    const signature = request.headers.get('x-payoneer-signature') || '';

    // Verify webhook signature
    if (!payoneerService.verifyWebhookSignature(body, signature)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const webhookData = JSON.parse(body);
    console.log('📨 Webhook data:', {
      eventType: webhookData.eventType,
      orderId: webhookData.data?.orderId,
      status: webhookData.data?.status
    });

    const result = payoneerService.processWebhook(webhookData);

    if (!result.success) {
      console.error('❌ Failed to process webhook');
      return NextResponse.json(
        { error: 'Failed to process webhook' },
        { status: 400 }
      );
    }

    // Handle different webhook events
    switch (webhookData.eventType) {
      case 'PAYMENT_COMPLETED':
        await handlePaymentCompleted(webhookData);
        break;
      
      case 'PAYMENT_FAILED':
        await handlePaymentFailed(webhookData);
        break;
      
      case 'PAYMENT_CANCELLED':
        await handlePaymentCancelled(webhookData);
        break;
      
      case 'SUBSCRIPTION_CREATED':
        await handleSubscriptionCreated(webhookData);
        break;
      
      default:
        console.log(`ℹ️ Unhandled webhook event: ${webhookData.eventType}`);
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
    
    const { orderId, transactionId, amount, currency } = webhookData.data;

    // Update payment status in database
    await subscriptionService.updatePaymentStatus(orderId, 'completed', transactionId);

    // Activate subscription if this was a subscription payment
    if (orderId.startsWith('sub_')) {
      await subscriptionService.activateSubscription(orderId);
      console.log('✅ Subscription activated');
    }

    // Send confirmation email
    await sendPaymentConfirmationEmail(webhookData.data);

  } catch (error) {
    console.error('❌ Error handling payment completion:', error);
  }
}

async function handlePaymentFailed(webhookData: any) {
  try {
    console.log('❌ Processing payment failure');
    
    const { orderId } = webhookData.data;

    // Update payment status
    await subscriptionService.updatePaymentStatus(orderId, 'failed');

    // Cancel pending subscription
    if (orderId.startsWith('sub_')) {
      await subscriptionService.cancelSubscription(orderId);
    }

  } catch (error) {
    console.error('❌ Error handling payment failure:', error);
  }
}

async function handlePaymentCancelled(webhookData: any) {
  try {
    console.log('🚫 Processing payment cancellation');
    
    const { orderId } = webhookData.data;

    // Update payment status
    await subscriptionService.updatePaymentStatus(orderId, 'cancelled');

    // Cancel pending subscription
    if (orderId.startsWith('sub_')) {
      await subscriptionService.cancelSubscription(orderId);
    }

  } catch (error) {
    console.error('❌ Error handling payment cancellation:', error);
  }
}

async function handleSubscriptionCreated(webhookData: any) {
  try {
    console.log('🔄 Processing subscription creation');
    
    const { orderId, transactionId } = webhookData.data;

    // Update subscription with Payoneer subscription ID
    await subscriptionService.updateSubscriptionExternalId(orderId, transactionId);

  } catch (error) {
    console.error('❌ Error handling subscription creation:', error);
  }
}

async function sendPaymentConfirmationEmail(paymentData: any) {
  try {
    // Send confirmation email via your notification service
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/payment-confirmed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerEmail: paymentData.customerEmail,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        transactionId: paymentData.transactionId
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