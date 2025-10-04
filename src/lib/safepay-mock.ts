// Mock SafePay service for development when sandbox is unavailable

import { PaymentRequest, PaymentResponse } from './safepay';

export class MockSafePayService {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async createPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    console.log('🧪 MOCK SafePay: Creating payment session...');
    console.log('📤 MOCK Request:', {
      amount: paymentRequest.amount,
      currency: paymentRequest.currency,
      orderId: paymentRequest.orderId,
      description: paymentRequest.description,
      customerEmail: paymentRequest.customerEmail.substring(0, 5) + '...'
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate successful payment creation
    const mockPaymentUrl = `https://mock-safepay.example.com/pay?token=mock_${paymentRequest.orderId}`;

    console.log('✅ MOCK SafePay: Payment session created successfully');
    console.log('🔗 MOCK Payment URL:', mockPaymentUrl);

    return {
      success: true,
      paymentUrl: mockPaymentUrl,
      token: `mock_token_${Date.now()}`,
      orderId: paymentRequest.orderId
    };
  }

  async verifyPayment(orderId: string) {
    console.log('🧪 MOCK SafePay: Verifying payment for order:', orderId);
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      status: 'paid' as const,
      transactionId: `mock_txn_${Date.now()}`,
      amount: 20000
    };
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    console.log('🧪 MOCK SafePay: Webhook signature verification (always returns true)');
    return true;
  }

  processWebhook(payload: any) {
    console.log('🧪 MOCK SafePay: Processing webhook:', payload);
    
    return {
      success: true,
      orderId: payload.data?.orderId || 'mock_order',
      status: 'paid',
      transactionId: `mock_txn_${Date.now()}`
    };
  }
}

// Mock payment creation functions
export const createMockSubscriptionPayment = async (
  userEmail: string,
  userName: string,
  planType: 'pro' | 'premium' = 'pro'
): Promise<PaymentResponse> => {
  const amount = planType === 'pro' ? 2 * 100 : 5 * 100;
  const orderId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

  const mockService = new MockSafePayService({});
  
  return mockService.createPayment({
    amount,
    currency: 'USD',
    orderId,
    description: `Quizzicallabzᴬᴵ ${planType.toUpperCase()} Subscription`,
    customerEmail: userEmail,
    customerName: userName,
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?orderId=${orderId}`,
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled?orderId=${orderId}`,
    webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/safepay`
  });
};