import { NextRequest, NextResponse } from 'next/server';
import { whopService } from '@/lib/whop';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Whop integration...');

    // Test basic configuration
    const config = {
      hasApiKey: !!process.env.WHOP_API_KEY,
      hasWebhookSecret: !!process.env.WHOP_WEBHOOK_SECRET,
      environment: process.env.WHOP_ENVIRONMENT,
      appId: process.env.NEXT_PUBLIC_WHOP_APP_ID,
      companyId: process.env.NEXT_PUBLIC_WHOP_COMPANY_ID
    };

    console.log('📋 Whop Configuration:', config);

    // Test creating a checkout session with your configured product ID
    const testCheckout = await whopService.createCheckout({
      productId: process.env.WHOP_PRO_PRODUCT_ID || 'prod_quizzical_pro_monthly',
      customerEmail: 'test@example.com',
      customerName: 'Test User',
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled`,
      metadata: {
        test: 'true'
      }
    });

    return NextResponse.json({
      success: true,
      config,
      testResult: {
        checkoutTest: testCheckout.success ? 'PASS' : 'FAIL',
        checkoutError: testCheckout.error,
        message: testCheckout.success 
          ? 'Whop API is working! (Note: Test product may not exist)'
          : 'API connectivity test - expected to fail with test product'
      }
    });

  } catch (error: any) {
    console.error('❌ Whop test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      config: {
        hasApiKey: !!process.env.WHOP_API_KEY,
        hasWebhookSecret: !!process.env.WHOP_WEBHOOK_SECRET,
        environment: process.env.WHOP_ENVIRONMENT
      }
    }, { status: 500 });
  }
}