import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing SafePay API connectivity...');

    // Check environment variables
    const apiKey = process.env.SAFEPAY_API_KEY;
    const secretKey = process.env.SAFEPAY_SECRET_KEY;
    const environment = process.env.SAFEPAY_ENVIRONMENT || 'sandbox';

    console.log('🔑 SafePay Config Check:');
    console.log('- API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'MISSING');
    console.log('- Secret Key:', secretKey ? `${secretKey.substring(0, 10)}...` : 'MISSING');
    console.log('- Environment:', environment);

    if (!apiKey || !secretKey) {
      return NextResponse.json({
        success: false,
        error: 'SafePay credentials not configured',
        details: {
          hasApiKey: !!apiKey,
          hasSecretKey: !!secretKey,
          environment
        }
      }, { status: 400 });
    }

    // Test API connectivity
    const baseUrl = environment === 'production' 
      ? 'https://api.safepay.pk/v1'
      : 'https://sandbox.api.safepay.pk/v1';

    console.log('🌐 Testing connectivity to:', baseUrl);

    // Test with a simple API call (get merchant info or similar)
    const testPayload = {
      amount: 100, // 1 PKR in paisas
      currency: 'PKR',
      order_id: `test_${Date.now()}`,
      description: 'Test payment for API connectivity',
      customer: {
        email: 'test@example.com',
        name: 'Test User'
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled`,
      webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/safepay`
    };

    console.log('📤 Sending test request to SafePay...');

    const response = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-SFPY-Merchant-Secret': secretKey
      },
      body: JSON.stringify(testPayload)
    });

    console.log('📥 SafePay Response Status:', response.status);
    console.log('📥 SafePay Response Headers:', Object.fromEntries(response.headers.entries()));

    const responseData = await response.text();
    console.log('📥 SafePay Response Body:', responseData);

    let parsedData;
    try {
      parsedData = JSON.parse(responseData);
    } catch (e) {
      parsedData = { raw: responseData };
    }

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data: parsedData,
      config: {
        baseUrl,
        environment,
        hasCredentials: true
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ SafePay test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.name,
      stack: error.stack?.substring(0, 500),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount = 200, planId = 'pro' } = body;

    console.log('🧪 Testing SafePay payment creation...');

    const { createSubscriptionPayment } = await import('@/lib/safepay');

    const result = await createSubscriptionPayment(
      'test@example.com',
      'Test User',
      planId as 'pro' | 'premium'
    );

    console.log('💳 Payment creation result:', result);

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ SafePay payment test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.name,
      stack: error.stack?.substring(0, 500),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}