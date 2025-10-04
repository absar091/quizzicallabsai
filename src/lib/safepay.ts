// SafePay Payment Gateway Integration for Quizzicallabzᴬᴵ
// Official SafePay API integration for Pakistan

export interface SafePayConfig {
  apiKey: string;
  secretKey: string;
  environment: 'sandbox' | 'production';
  webhookSecret: string;
}

export interface PaymentRequest {
  amount: number; // Amount in PKR (smallest unit - paisas)
  currency: 'PKR';
  orderId: string;
  description: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  successUrl: string;
  cancelUrl: string;
  webhookUrl: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  token?: string;
  orderId: string;
  error?: string;
}

export interface WebhookPayload {
  event: 'payment.success' | 'payment.failed' | 'payment.cancelled';
  data: {
    orderId: string;
    amount: number;
    currency: string;
    status: 'paid' | 'failed' | 'cancelled';
    transactionId: string;
    customerEmail: string;
    timestamp: string;
  };
}

class SafePayService {
  private config: SafePayConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      apiKey: process.env.SAFEPAY_API_KEY || '',
      secretKey: process.env.SAFEPAY_SECRET_KEY || '',
      environment: (process.env.SAFEPAY_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
      webhookSecret: process.env.SAFEPAY_WEBHOOK_SECRET || ''
    };

    this.baseUrl = this.config.environment === 'production' 
      ? 'https://api.safepay.pk/v1'
      : 'https://sandbox.api.safepay.pk/v1';
  }

  /**
   * Create a payment session with SafePay
   */
  async createPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('🔄 Creating SafePay payment session...');
      
      if (!this.config.apiKey || !this.config.secretKey) {
        throw new Error('SafePay credentials not configured');
      }

      const payload = {
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        order_id: paymentRequest.orderId,
        description: paymentRequest.description,
        customer: {
          email: paymentRequest.customerEmail,
          name: paymentRequest.customerName,
          phone: paymentRequest.customerPhone
        },
        success_url: paymentRequest.successUrl,
        cancel_url: paymentRequest.cancelUrl,
        webhook_url: paymentRequest.webhookUrl
      };

      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-SFPY-Merchant-Secret': this.config.secretKey
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ SafePay API Error:', data);
        return {
          success: false,
          orderId: paymentRequest.orderId,
          error: data.message || 'Payment creation failed'
        };
      }

      console.log('✅ SafePay payment session created successfully');
      
      return {
        success: true,
        paymentUrl: data.redirect_url,
        token: data.token,
        orderId: paymentRequest.orderId
      };

    } catch (error: any) {
      console.error('❌ SafePay payment creation error:', error);
      return {
        success: false,
        orderId: paymentRequest.orderId,
        error: error.message || 'Payment service unavailable'
      };
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(orderId: string): Promise<{
    success: boolean;
    status: 'paid' | 'pending' | 'failed' | 'cancelled';
    transactionId?: string;
    amount?: number;
    error?: string;
  }> {
    try {
      console.log(`🔍 Verifying payment status for order: ${orderId}`);

      const response = await fetch(`${this.baseUrl}/payments/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-SFPY-Merchant-Secret': this.config.secretKey
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          status: 'failed',
          error: data.message || 'Payment verification failed'
        };
      }

      return {
        success: true,
        status: data.status,
        transactionId: data.transaction_id,
        amount: data.amount
      };

    } catch (error: any) {
      console.error('❌ Payment verification error:', error);
      return {
        success: false,
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(payload)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error('❌ Webhook signature verification failed:', error);
      return false;
    }
  }

  /**
   * Process webhook payload
   */
  processWebhook(payload: WebhookPayload): {
    success: boolean;
    orderId: string;
    status: string;
    transactionId?: string;
  } {
    try {
      console.log('📨 Processing SafePay webhook:', payload.event);

      return {
        success: true,
        orderId: payload.data.orderId,
        status: payload.data.status,
        transactionId: payload.data.transactionId
      };

    } catch (error: any) {
      console.error('❌ Webhook processing error:', error);
      return {
        success: false,
        orderId: payload.data?.orderId || 'unknown',
        status: 'failed'
      };
    }
  }
}

// Export singleton instance
export const safePayService = new SafePayService();

// Helper functions for common payment scenarios
export const createSubscriptionPayment = async (
  userEmail: string,
  userName: string,
  planType: 'pro' | 'premium' = 'pro'
): Promise<PaymentResponse> => {
  const amount = planType === 'pro' ? 200 * 100 : 500 * 100; // Convert to paisas
  const orderId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

  return safePayService.createPayment({
    amount,
    currency: 'PKR',
    orderId,
    description: `Quizzicallabzᴬᴵ ${planType.toUpperCase()} Subscription`,
    customerEmail: userEmail,
    customerName: userName,
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?orderId=${orderId}`,
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled?orderId=${orderId}`,
    webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/safepay`
  });
};

export const createOneTimePayment = async (
  userEmail: string,
  userName: string,
  amount: number,
  description: string
): Promise<PaymentResponse> => {
  const orderId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

  return safePayService.createPayment({
    amount: amount * 100, // Convert to paisas
    currency: 'PKR',
    orderId,
    description,
    customerEmail: userEmail,
    customerName: userName,
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?orderId=${orderId}`,
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled?orderId=${orderId}`,
    webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/safepay`
  });
};