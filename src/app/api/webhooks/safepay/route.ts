import { NextRequest, NextResponse } from 'next/server';
import { safePayService } from '@/lib/safepay';
import { subscriptionService } from '@/lib/subscription';
import { sendAutomatedPaymentConfirmation } from '@/lib/email-automation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-safepay-signature') || '';

    console.log('📨 Received SafePay webhook');

    // Verify webhook signature
    if (!safePayService.verifyWebhookSignature(body, signature)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const webhookData = JSON.parse(body);
    const result = safePayService.processWebhook(webhookData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Webhook processing failed' },
        { status: 400 }
      );
    }

    const { orderId, status, transactionId } = result;

    console.log(`🔄 Processing payment webhook: ${orderId} -> ${status}`);

    // Find the payment record
    const db = (await import('@/lib/firebase-admin')).db;
    if (!db) {
      throw new Error('Firebase Admin not initialized');
    }

    // Query payments by orderId
    const paymentsRef = db.ref('payments');
    const query = paymentsRef.orderByChild('orderId').equalTo(orderId);
    const snapshot = await query.once('value');

    if (!snapshot.exists()) {
      console.error(`❌ Payment not found for orderId: ${orderId}`);
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      );
    }

    let paymentRecord: any = null;
    let paymentId: string = '';

    snapshot.forEach((child) => {
      paymentRecord = child.val();
      paymentId = child.key!;
    });

    if (!paymentRecord) {
      return NextResponse.json(
        { success: false, error: 'Payment record not found' },
        { status: 404 }
      );
    }

    const userId = paymentRecord.userId;

    // Update payment status
    await subscriptionService.updatePaymentStatus(
      paymentId,
      status === 'paid' ? 'completed' : 'failed',
      transactionId
    );

    if (status === 'paid') {
      console.log('✅ Payment successful, activating subscription');

      // Activate subscription
      await subscriptionService.updateSubscriptionStatus(
        userId,
        'active',
        paymentId
      );

      // Get user details for email
      const userRef = db.ref(`users/${userId}`);
      const userSnapshot = await userRef.once('value');
      const userData = userSnapshot.val();

      if (userData && userData.email) {
        // Send payment confirmation email
        try {
          await sendAutomatedPaymentConfirmation(
            userData.email,
            userData.displayName || 'User',
            {
              amount: paymentRecord.amount,
              planName: paymentRecord.description,
              transactionId: transactionId || orderId,
              date: new Date().toLocaleDateString()
            }
          );
        } catch (emailError) {
          console.error('❌ Failed to send payment confirmation email:', emailError);
          // Don't fail the webhook for email errors
        }
      }

      console.log(`🎉 Subscription activated for user: ${userId}`);
    } else {
      console.log('❌ Payment failed, updating subscription status');
      
      // Mark subscription as failed
      await subscriptionService.updateSubscriptionStatus(
        userId,
        'cancelled'
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error: any) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
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
    message: 'SafePay webhook endpoint is active'
  });
}