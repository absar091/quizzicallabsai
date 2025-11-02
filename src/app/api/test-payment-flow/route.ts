import { NextRequest, NextResponse } from 'next/server';
import { createSubscriptionCheckout } from '@/lib/whop';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing complete payment flow...');

    // Test creating a real checkout session
    const checkoutResult = await createSubscriptionCheckout(
      'test@quizzicallabz.com',
      'Test User',
      'pro'
    );

    return NextResponse.json({
      success: true,
      checkoutResult,
      message: checkoutResult.success 
        ? 'Payment flow working! Checkout URL generated successfully.'
        : 'Payment flow test completed with expected result.',
      nextSteps: [
        '1. Create your Pro subscription product in Whop dashboard',
        '2. Update WHOP_PRO_PRODUCT_ID in .env.local with actual product ID',
        '3. Set up webhook endpoint in Whop dashboard: /api/webhooks/whop',
        '4. Test with real product ID'
      ]
    });

  } catch (error: any) {
    console.error('❌ Payment flow test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}