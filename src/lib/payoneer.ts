// Payoneer Checkout API Integration for Quizzicallabzᴬᴵ
// Official Payoneer integration for international payments

export interface PayoneerConfig {
  merchantId: string;
  apiKey: string;
  apiSecret: string;
  environment: 'sandbox' | 'live';
  webhookSecret: string;
}

export interface PayoneerPaymentRequest {
  amount: number; // Amount in smallest unit (cents for USD)
  currency: 'USD' | 'EUR' | 'GBP' | 'PKR';
  orderId: string;
  description: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  customerCountry?: string;
  successUrl: string;
  cancelUrl: string;
  webhookUrl: string;
  paymentType?: 'subscription' | 'one-time';
}

export interface PayoneerPaymentResponse {
  success: boolean;
  checkoutUrl?: string;
  sessionId?: string;
  orderId: string;
  error?: string;
}

export interface PayoneerWebhookPayload {
  eventType: 'PAYMENT_COMPLETED' | 'PAYMENT_FAILED' | 'PAYMENT_CANCELLED' | 'SUBSCRIPTION_CREATED';
  data: {
    orderId: string;
    sessionId: string;
    amount: number;
    currency: string;
    status: 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'PENDING';
    transactionId: string;
    customerEmail: string;
    timestamp: string;
    paymentMethod?: string;
  };
}

class PayoneerService {
  private config: PayoneerConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      merchantId: process.env.PAYONEER_MERCHANT_ID || '',
      apiKey: process.env.PAYONEER_API_KEY || '',
      apiSecret: process.env.PAYONEER_API_SECRET || '',
      environment: (process.env.PAYONEER_ENVIRONMENT as 'sandbox' | 'live') || 'sandbox',
      webhookSecret: process.env.PAYONEER_WEBHOOK_SECRET || ''
    };

    this.baseUrl = this.config.environment === 'live' 
      ? 'https://api.payoneer.com/v2'
      : 'https://api.sandbox.payoneer.com/v2';
  }

  /**
   * Generate authentication headers for Payoneer API
   */
  private getAuthHeaders(): Record<string, string> {
    const timestamp = Date.now().toString();
    const crypto = require('crypto');
    
    // Create signature for authentication
    const signatureString = `${this.config.merchantId}${timestamp}${this.config.apiKey}`;
    const signature = crypto
      .createHmac('sha256', this.config.apiSecret)
      .update(signatureString)
      .digest('hex');

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
      'X-Payoneer-Merchant-Id': this.config.merchantId,
      'X-Payoneer-Timestamp': timestamp,
      'X-Payoneer-Signature': signature
    };
  }

  /**
   * Create a payment session with Payoneer Checkout
   */
  async createPayment(paymentRequest: PayoneerPaymentRequest): Promise<PayoneerPaymentResponse> {
    try {
      console.log('🔄 Creating Payoneer payment session...');
      
      if (!this.config.merchantId || !this.config.apiKey || !this.config.apiSecret) {
        throw new Error('Payoneer credentials not configured');
      }

      const payload = {
        merchantId: this.config.merchantId,
        orderId: paymentRequest.orderId,
        amount: {
          value: paymentRequest.amount,
          currency: paymentRequest.currency
        },
        description: paymentRequest.description,
        customer: {
          email: paymentRequest.customerEmail,
          name: paymentRequest.customerName,
          phone: paymentRequest.customerPhone,
          country: paymentRequest.customerCountry || 'PK'
        },
        urls: {
          success: paymentRequest.successUrl,
          cancel: paymentRequest.cancelUrl,
          webhook: paymentRequest.webhookUrl
        },
        paymentType: paymentRequest.paymentType || 'one-time',
        // Enable multiple payment methods
        paymentMethods: [
          'CREDIT_CARD',
          'DEBIT_CARD',
          'PAYPAL',
          'BANK_TRANSFER',
          'DIGITAL_WALLET'
        ],
        // Subscription settings (if applicable)
        ...(paymentRequest.paymentType === 'subscription' && {
          subscription: {
            frequency: 'MONTHLY',
            startDate: new Date().toISOString(),
            billingCycles: 0 // Unlimited
          }
        })
      };

      console.log('📤 Payoneer Request:', {
        url: `${this.baseUrl}/checkout/sessions`,
        headers: this.getAuthHeaders(),
        payload: { 
          ...payload, 
          customer: { 
            ...payload.customer, 
            email: payload.customer.email.substring(0, 5) + '...' 
          } 
        }
      });

      const response = await fetch(`${this.baseUrl}/checkout/sessions`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      console.log('📥 Payoneer Response Status:', response.status);

      let data;
      const responseText = await response.text();
      console.log('📥 Payoneer Raw Response:', responseText.substring(0, 500));

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse Payoneer response:', parseError);
        return {
          success: false,
          orderId: paymentRequest.orderId,
          error: `Invalid response from Payoneer: ${responseText.substring(0, 100)}`
        };
      }

      if (!response.ok) {
        console.error('❌ Payoneer API Error:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        return {
          success: false,
          orderId: paymentRequest.orderId,
          error: data.message || data.error || `Payoneer API error: ${response.status} ${response.statusText}`
        };
      }

      console.log('✅ Payoneer payment session created successfully');
      
      return {
        success: true,
        checkoutUrl: data.checkoutUrl,
        sessionId: data.sessionId,
        orderId: paymentRequest.orderId
      };

    } catch (error: any) {
      console.error('❌ Payoneer payment creation error:', {
        message: error.message,
        name: error.name,
        stack: error.stack?.substring(0, 200)
      });

      let errorMessage = 'Payment service unavailable';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to Payoneer. Please check your internet connection.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout: Payoneer is taking too long to respond. Please try again.';
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
  async verifyPayment(sessionId: string): Promise<{
    success: boolean;
    status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED';
    transactionId?: string;
    amount?: number;
    currency?: string;
    error?: string;
  }> {
    try {
      console.log(`🔍 Verifying payment status for session: ${sessionId}`);

      const response = await fetch(`${this.baseUrl}/checkout/sessions/${sessionId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          status: 'FAILED',
          error: data.message || 'Payment verification failed'
        };
      }

      return {
        success: true,
        status: data.status,
        transactionId: data.transactionId,
        amount: data.amount?.value,
        currency: data.amount?.currency
      };

    } catch (error: any) {
      console.error('❌ Payment verification error:', error);
      return {
        success: false,
        status: 'FAILED',
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
  processWebhook(payload: PayoneerWebhookPayload): {
    success: boolean;
    orderId: string;
    status: string;
    transactionId?: string;
  } {
    try {
      console.log('📨 Processing Payoneer webhook:', payload.eventType);

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
        status: 'FAILED'
      };
    }
  }

  /**
   * Create subscription with Payoneer
   */
  async createSubscription(
    customerEmail: string,
    customerName: string,
    planId: string,
    amount: number,
    currency: string = 'USD'
  ): Promise<PayoneerPaymentResponse> {
    const orderId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    return this.createPayment({
      amount,
      currency: currency as any,
      orderId,
      description: `QuizzicalLabzᴬᴵ ${planId.toUpperCase()} Subscription`,
      customerEmail,
      customerName,
      customerCountry: 'PK',
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?orderId=${orderId}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled?orderId=${orderId}`,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/payoneer`,
      paymentType: 'subscription'
    });
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to cancel subscription'
        };
      }

      return { success: true };

    } catch (error: any) {
      console.error('❌ Subscription cancellation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const payoneerService = new PayoneerService();

// Helper functions for common payment scenarios
export const createSubscriptionPayment = async (
  userEmail: string,
  userName: string,
  planType: 'pro' | 'premium' = 'pro'
): Promise<PayoneerPaymentResponse> => {
  const amount = planType === 'pro' ? 200 : 500; // Amount in cents (USD)
  
  return payoneerService.createSubscription(
    userEmail,
    userName,
    planType,
    amount,
    'USD'
  );
};

export const createOneTimePayment = async (
  userEmail: string,
  userName: string,
  amount: number,
  description: string,
  currency: string = 'USD'
): Promise<PayoneerPaymentResponse> => {
  const orderId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

  return payoneerService.createPayment({
    amount: amount * 100, // Convert to cents
    currency: currency as any,
    orderId,
    description,
    customerEmail: userEmail,
    customerName: userName,
    customerCountry: 'PK',
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?orderId=${orderId}`,
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled?orderId=${orderId}`,
    webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/payoneer`,
    paymentType: 'one-time'
  });
};