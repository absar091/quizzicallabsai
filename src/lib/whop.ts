// Whop Payment Gateway Integration for QuizzicalLabzᴬᴵ
// Official Whop integration for subscription management

export interface WhopConfig {
  apiKey: string;
  webhookSecret: string;
  environment: 'sandbox' | 'production';
  proPlanId: string;
  premiumPlanId: string;
}

export interface WhopPaymentRequest {
  planId: string;
  userEmail: string;
  userName: string;
  sessionId?: string;
  affiliateCode?: string;
  utm?: Record<string, string>;
}

export interface WhopPaymentResponse {
  success: boolean;
  checkoutUrl?: string;
  planId: string;
  sessionId?: string;
  error?: string;
}

export interface WhopWebhookPayload {
  event: string;
  data: {
    id: string;
    user: {
      id: string;
      email: string;
      username?: string;
    };
    plan: {
      id: string;
      name: string;
    };
    status: 'active' | 'cancelled' | 'expired' | 'trialing';
    created_at: string;
    expires_at?: string;
  };
}

class WhopService {
  private config: WhopConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      apiKey: process.env.WHOP_API_KEY || '',
      webhookSecret: process.env.WHOP_WEBHOOK_SECRET || '',
      environment: (process.env.WHOP_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
      proPlanId: process.env.WHOP_PRO_PRODUCT_ID || '',
      premiumPlanId: process.env.WHOP_PREMIUM_PRODUCT_ID || ''
    };

    this.baseUrl = 'https://api.whop.com/v5';
  }

  /**
   * Create a Whop checkout session
   */
  async createCheckoutSession(request: WhopPaymentRequest): Promise<WhopPaymentResponse> {
    try {
      console.log('🔄 Creating Whop checkout session...');
      
      if (!this.config.apiKey) {
        throw new Error('Whop API key not configured');
      }

      const payload = {
        plan_id: request.planId,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled`,
        customer_email: request.userEmail,
        customer_name: request.userName,
        ...(request.sessionId && { session_id: request.sessionId }),
        ...(request.affiliateCode && { affiliate_code: request.affiliateCode }),
        ...(request.utm && { utm: request.utm })
      };

      console.log('📤 Whop Request:', {
        url: `${this.baseUrl}/checkout/sessions`,
        headers: {
          'Authorization': `Bearer ${this.config.apiKey.substring(0, 10)}...`,
          'Content-Type': 'application/json'
        },
        payload: { 
          ...payload, 
          customer_email: payload.customer_email.substring(0, 5) + '...' 
        }
      });

      const response = await fetch(`${this.baseUrl}/checkout/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('📥 Whop Response Status:', response.status);

      let data;
      const responseText = await response.text();
      console.log('📥 Whop Raw Response:', responseText.substring(0, 500));

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse Whop response:', parseError);
        return {
          success: false,
          planId: request.planId,
          error: `Invalid response from Whop: ${responseText.substring(0, 100)}`
        };
      }

      if (!response.ok) {
        console.error('❌ Whop API Error:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        return {
          success: false,
          planId: request.planId,
          error: data.message || data.error || `Whop API error: ${response.status} ${response.statusText}`
        };
      }

      console.log('✅ Whop checkout session created successfully');
      
      return {
        success: true,
        checkoutUrl: data.checkout_url,
        planId: request.planId,
        sessionId: data.session_id
      };

    } catch (error: any) {
      console.error('❌ Whop checkout creation error:', {
        message: error.message,
        name: error.name,
        stack: error.stack?.substring(0, 200)
      });

      let errorMessage = 'Payment service unavailable';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to Whop. Please check your internet connection.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout: Whop is taking too long to respond. Please try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        planId: request.planId,
        error: errorMessage
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
        Buffer.from(`sha256=${expectedSignature}`)
      );
    } catch (error) {
      console.error('❌ Webhook signature verification failed:', error);
      return false;
    }
  }

  /**
   * Process webhook payload
   */
  processWebhook(payload: WhopWebhookPayload): {
    success: boolean;
    event: string;
    userId: string;
    userEmail: string;
    planId: string;
    status: string;
    subscriptionId: string;
  } {
    try {
      console.log('📨 Processing Whop webhook:', payload.event);

      return {
        success: true,
        event: payload.event,
        userId: payload.data.user.id,
        userEmail: payload.data.user.email,
        planId: payload.data.plan.id,
        status: payload.data.status,
        subscriptionId: payload.data.id
      };

    } catch (error: any) {
      console.error('❌ Webhook processing error:', error);
      return {
        success: false,
        event: payload.event || 'unknown',
        userId: payload.data?.user?.id || 'unknown',
        userEmail: payload.data?.user?.email || 'unknown',
        planId: payload.data?.plan?.id || 'unknown',
        status: 'failed',
        subscriptionId: payload.data?.id || 'unknown'
      };
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string): Promise<{
    success: boolean;
    subscription?: any;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/memberships/${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to fetch subscription'
        };
      }

      return {
        success: true,
        subscription: data
      };

    } catch (error: any) {
      console.error('❌ Subscription fetch error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/memberships/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
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
export const whopService = new WhopService();

// Helper functions for common payment scenarios
export const createWhopSubscriptionPayment = async (
  userEmail: string,
  userName: string,
  planType: 'pro' | 'premium' = 'pro'
): Promise<WhopPaymentResponse> => {
  const planId = planType === 'pro' 
    ? process.env.WHOP_PRO_PRODUCT_ID || ''
    : process.env.WHOP_PREMIUM_PRODUCT_ID || '';

  if (!planId) {
    return {
      success: false,
      planId: '',
      error: `${planType} plan ID not configured`
    };
  }

  return whopService.createCheckoutSession({
    planId,
    userEmail,
    userName,
    utm: {
      utm_source: 'quizzicallabz',
      utm_medium: 'website',
      utm_campaign: `${planType}_subscription`
    }
  });
};

// Plan ID helpers
export const getWhopPlanId = (planType: 'pro' | 'premium'): string => {
  // Use public environment variables for client-side access
  return planType === 'pro' 
    ? process.env.NEXT_PUBLIC_WHOP_PRO_PLAN_ID || process.env.WHOP_PRO_PRODUCT_ID || ''
    : process.env.NEXT_PUBLIC_WHOP_PREMIUM_PLAN_ID || process.env.WHOP_PREMIUM_PRODUCT_ID || '';
};