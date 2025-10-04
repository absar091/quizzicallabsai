// SafePay Payment Gateway Integration for Quizzicallabzᴬᴵ
// Official SafePay API integration for Pakistan

export interface SafePayConfig {
  apiKey: string;
  secretKey: string;
  environment: 'sandbox' | 'production';
  webhookSecret: string;
}

export interface PaymentRequest {
  amount: number; // Amount in USD (smallest unit - cents)
  currency: 'USD';
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
      ? 'https://api.getsafepay.com/v1'
      : 'https://sandbox.api.getsafepay.com/v1';
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
        plan_id: process.env.SAFEPAY_PLAN_ID, // Use your actual plan ID
        customer: {
          email: paymentRequest.customerEmail,
          name: paymentRequest.customerName,
          phone: paymentRequest.customerPhone
        },
        success_url: paymentRequest.successUrl,
        cancel_url: paymentRequest.cancelUrl,
        webhook_url: paymentRequest.webhookUrl
      };

      console.log('📤 SafePay Request:', {
        url: `${this.baseUrl}/payments`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey.substring(0, 10)}...`,
          'X-SFPY-Merchant-Secret': `${this.config.secretKey.substring(0, 10)}...`
        },
        payload: { ...payload, customer: { ...payload.customer, email: payload.customer.email.substring(0, 5) + '...' } }
      });

      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-SFPY-Merchant-Secret': this.config.secretKey
        },
        body: JSON.stringify(payload)
      });

      console.log('📥 SafePay Response Status:', response.status);
      console.log('📥 SafePay Response Headers:', Object.fromEntries(response.headers.entries()));

      let data;
      const responseText = await response.text();
      console.log('📥 SafePay Raw Response:', responseText);

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse SafePay response:', parseError);
        return {
          success: false,
          orderId: paymentRequest.orderId,
          error: `Invalid response from SafePay: ${responseText.substring(0, 100)}`
        };
      }

      if (!response.ok) {
        console.error('❌ SafePay API Error:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        return {
          success: false,
          orderId: paymentRequest.orderId,
          error: data.message || data.error || `SafePay API error: ${response.status} ${response.statusText}`
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
      console.error('❌ SafePay payment creation error:', {
        message: error.message,
        name: error.name,
        stack: error.stack?.substring(0, 200),
        cause: error.cause
      });

      let errorMessage = 'Payment service unavailable';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to SafePay. Please check your internet connection.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout: SafePay is taking too long to respond. Please try again.';
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('DNS')) {
        errorMessage = 'DNS error: Cannot resolve SafePay server. Please check your network settings.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        orderId: paymentRequest.orderId,
        error: errorMessage
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
  // Use mock service in development if SafePay is unavailable
  if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_SAFEPAY === 'true') {
    console.log('🧪 Using Mock SafePay service for development');
    const { createMockSubscriptionPayment } = await import('./safepay-mock');
    return createMockSubscriptionPayment(userEmail, userName, planType);
  }

  const amount = planType === 'pro' ? 2 * 100 : 5 * 100; // Convert to cents for USD
  const orderId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

  return safePayService.createPayment({
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