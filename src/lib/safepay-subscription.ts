// Real SafePay Subscription Integration
// Based on the actual SafePay checkout URL pattern

export interface SafePaySubscriptionRequest {
  planId: string;
  userEmail: string;
  userName: string;
  successUrl: string;
  cancelUrl: string;
}

export interface SafePaySubscriptionResponse {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}

export class SafePaySubscriptionService {
  private config: {
    environment: 'sandbox' | 'production';
    authToken: string;
  };

  constructor() {
    this.config = {
      environment: (process.env.SAFEPAY_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
      authToken: process.env.SAFEPAY_AUTH_TOKEN || ''
    };
  }

  /**
   * Create SafePay subscription checkout URL
   * Based on the pattern: https://sandbox.api.getsafepay.com/checkout/subscribe/wallet
   */
  createSubscriptionCheckout(request: SafePaySubscriptionRequest): SafePaySubscriptionResponse {
    try {
      console.log('🔄 Creating SafePay subscription checkout...');

      if (!this.config.authToken) {
        throw new Error('SafePay auth token not configured');
      }

      const baseUrl = this.config.environment === 'production'
        ? 'https://api.getsafepay.com'
        : 'https://sandbox.api.getsafepay.com';

      // Build checkout URL with parameters
      const checkoutUrl = new URL(`${baseUrl}/checkout/subscribe/wallet`);
      
      checkoutUrl.searchParams.set('plan_id', request.planId);
      checkoutUrl.searchParams.set('auth_token', this.config.authToken);
      checkoutUrl.searchParams.set('env', this.config.environment);
      checkoutUrl.searchParams.set('redirect_url', request.successUrl);
      checkoutUrl.searchParams.set('cancel_url', request.cancelUrl);

      // Add customer information if available
      if (request.userEmail) {
        checkoutUrl.searchParams.set('customer_email', request.userEmail);
      }
      if (request.userName) {
        checkoutUrl.searchParams.set('customer_name', request.userName);
      }

      console.log('✅ SafePay subscription checkout URL created');
      console.log('🔗 Checkout URL:', checkoutUrl.toString());

      return {
        success: true,
        checkoutUrl: checkoutUrl.toString()
      };

    } catch (error: any) {
      console.error('❌ SafePay subscription checkout error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create checkout URL'
      };
    }
  }
}

// Helper function for creating subscription checkout
export const createSafePaySubscriptionCheckout = (
  userEmail: string,
  userName: string,
  planId: string = process.env.SAFEPAY_PLAN_ID || ''
): SafePaySubscriptionResponse => {
  const service = new SafePaySubscriptionService();
  
  return service.createSubscriptionCheckout({
    planId,
    userEmail,
    userName,
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled`
  });
};