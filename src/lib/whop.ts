import { db } from '@/lib/firebase';
import { ref, set, get, update, push } from 'firebase/database';

// Whop API configuration
const WHOP_API_KEY = process.env.WHOP_API_KEY;
const WHOP_BASE_URL = 'https://api.whop.com/api/v2';

export interface WhopUser {
  id: string;
  email: string;
  username?: string;
  discord_id?: string;
  plan: 'free' | 'basic' | 'pro' | 'premium';
  subscription_id?: string;
  expires_at?: string;
  tokens_used: number;
  tokens_limit: number;
  quizzes_used: number;
  quizzes_limit: number;
  billing_cycle_start: string;
  billing_cycle_end: string;
}

export interface WhopSubscription {
  id: string;
  user_id: string;
  product_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  plan_name: string;
  amount: number;
  currency: string;
}

export interface PlanLimits {
  tokens: number;
  quizzes: number;
  price_usd: number;
  price_pkr: number;
  features: string[];
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    tokens: 100000, // 100K
    quizzes: 20,
    price_usd: 0,
    price_pkr: 0,
    features: ['Basic AI Model', 'Visible Ads', 'Basic Explanations', '10 MB Storage', 'Community Support']
  },
  basic: {
    tokens: 250000, // 250K
    quizzes: 45,
    price_usd: 1.05,
    price_pkr: 300,
    features: ['Standard AI Model', 'Removed Ads', 'Short Explanations', '25 MB Storage', 'Standard Support']
  },
  pro: {
    tokens: 500000, // 500K
    quizzes: 90,
    price_usd: 2.10,
    price_pkr: 600,
    features: ['Gemini 1.5 Pro', 'Removed Ads', 'Detailed Explanations', '25 MB Storage', 'Priority Support']
  },
  premium: {
    tokens: 1000000, // 1M
    quizzes: 180,
    price_usd: 3.86,
    price_pkr: 1100,
    features: ['Gemini 1.5 Pro+', 'Removed Ads', 'Advanced + Visual Explanations', '50 MB Storage', 'Premium Chat Support']
  }
};

class WhopService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = WHOP_API_KEY || '';
    this.baseUrl = WHOP_BASE_URL;
    
    if (!this.apiKey) {
      console.warn('⚠️ Whop API key not configured');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Whop API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Create checkout URL for a plan
  async createCheckoutUrl(planId: string, userId: string, userEmail: string): Promise<string> {
    try {
      // Map plan names to Whop product IDs (automatically reads from .env.local)
      const productIdMap: Record<string, string> = {
        'basic': process.env.WHOP_BASIC_PRODUCT_ID || '',
        'pro': process.env.WHOP_PRO_PRODUCT_ID || '',
        'premium': process.env.WHOP_PREMIUM_PRODUCT_ID || '',
      };

      const whopProductId = productIdMap[planId];
      if (!whopProductId) {
        throw new Error(`Invalid plan ID: ${planId}`);
      }

      // For direct redirect approach (since embedding is blocked)
      const checkoutUrl = `https://whop.com/checkout/${whopProductId}?d2c=true&user_id=${userId}&email=${encodeURIComponent(userEmail)}`;
      
      console.log('✅ Whop checkout URL created:', checkoutUrl);
      return checkoutUrl;
    } catch (error) {
      console.error('❌ Failed to create Whop checkout URL:', error);
      throw error;
    }
  }

  // Initialize user with free plan
  async initializeUser(userId: string, email: string, name: string): Promise<void> {
    try {
      const now = new Date();
      const cycleEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

      const userRef = ref(db, `users/${userId}/subscription`);
      await set(userRef, {
        plan: 'free',
        subscription_status: 'active',
        tokens_used: 0,
        tokens_limit: PLAN_LIMITS.free.tokens,
        quizzes_used: 0,
        quizzes_limit: PLAN_LIMITS.free.quizzes,
        billing_cycle_start: now.toISOString(),
        billing_cycle_end: cycleEnd.toISOString(),
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      });

      // Track usage history
      const usageRef = ref(db, `usage/${userId}/${now.getFullYear()}/${now.getMonth() + 1}`);
      await set(usageRef, {
        tokens_used: 0,
        quizzes_created: 0,
        plan: 'free',
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });

      console.log('✅ User initialized with free plan:', userId);
    } catch (error) {
      console.error('❌ Failed to initialize user:', error);
      throw error;
    }
  }

  // Track token usage
  async trackTokenUsage(userId: string, tokensUsed: number): Promise<boolean> {
    try {
      const userRef = ref(db, `users/${userId}/subscription`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        console.warn('⚠️ User subscription not found, initializing...');
        return false;
      }

      const subscription = snapshot.val();
      const newTokensUsed = (subscription.tokens_used || 0) + tokensUsed;

      // Check if user exceeds limit
      if (newTokensUsed > subscription.tokens_limit) {
        console.warn('⚠️ User exceeded token limit:', userId, newTokensUsed, '>', subscription.tokens_limit);
        return false;
      }

      // Update usage
      await update(userRef, {
        tokens_used: newTokensUsed,
        updated_at: new Date().toISOString(),
      });

      // Track monthly usage
      const now = new Date();
      const usageRef = ref(db, `usage/${userId}/${now.getFullYear()}/${now.getMonth() + 1}`);
      const usageSnapshot = await get(usageRef);
      
      if (usageSnapshot.exists()) {
        const currentUsage = usageSnapshot.val();
        await update(usageRef, {
          tokens_used: (currentUsage.tokens_used || 0) + tokensUsed,
        });
      }

      console.log('✅ Token usage tracked:', userId, tokensUsed, 'total:', newTokensUsed);
      return true;
    } catch (error) {
      console.error('❌ Failed to track token usage:', error);
      return false;
    }
  }

  // Track quiz creation
  async trackQuizCreation(userId: string): Promise<boolean> {
    try {
      const userRef = ref(db, `users/${userId}/subscription`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        console.warn('⚠️ User subscription not found');
        return false;
      }

      const subscription = snapshot.val();
      const newQuizzesUsed = (subscription.quizzes_used || 0) + 1;

      // Check if user exceeds limit
      if (newQuizzesUsed > subscription.quizzes_limit) {
        console.warn('⚠️ User exceeded quiz limit:', userId, newQuizzesUsed, '>', subscription.quizzes_limit);
        return false;
      }

      // Update usage
      await update(userRef, {
        quizzes_used: newQuizzesUsed,
        updated_at: new Date().toISOString(),
      });

      // Track monthly usage
      const now = new Date();
      const usageRef = ref(db, `usage/${userId}/${now.getFullYear()}/${now.getMonth() + 1}`);
      const usageSnapshot = await get(usageRef);
      
      if (usageSnapshot.exists()) {
        const currentUsage = usageSnapshot.val();
        await update(usageRef, {
          quizzes_created: (currentUsage.quizzes_created || 0) + 1,
        });
      } else {
        await set(usageRef, {
          tokens_used: 0,
          quizzes_created: 1,
          plan: subscription.plan,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        });
      }

      console.log('✅ Quiz creation tracked:', userId, 'total:', newQuizzesUsed);
      return true;
    } catch (error) {
      console.error('❌ Failed to track quiz creation:', error);
      return false;
    }
  }

  // Get user usage stats
  async getUserUsage(userId: string): Promise<{
    plan: string;
    tokens_used: number;
    tokens_limit: number;
    tokens_remaining: number;
    quizzes_used: number;
    quizzes_limit: number;
    quizzes_remaining: number;
    billing_cycle_end: string;
    subscription_status: string;
  } | null> {
    try {
      const userRef = ref(db, `users/${userId}/subscription`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        return null;
      }

      const subscription = snapshot.val();
      return {
        plan: subscription.plan || 'free',
        tokens_used: subscription.tokens_used || 0,
        tokens_limit: subscription.tokens_limit || PLAN_LIMITS.free.tokens,
        tokens_remaining: (subscription.tokens_limit || PLAN_LIMITS.free.tokens) - (subscription.tokens_used || 0),
        quizzes_used: subscription.quizzes_used || 0,
        quizzes_limit: subscription.quizzes_limit || PLAN_LIMITS.free.quizzes,
        quizzes_remaining: (subscription.quizzes_limit || PLAN_LIMITS.free.quizzes) - (subscription.quizzes_used || 0),
        billing_cycle_end: subscription.billing_cycle_end || '',
        subscription_status: subscription.subscription_status || 'active',
      };
    } catch (error) {
      console.error('❌ Failed to get user usage:', error);
      return null;
    }
  }

  // Reset monthly usage (called by cron job)
  async resetMonthlyUsage(userId: string): Promise<void> {
    try {
      const userRef = ref(db, `users/${userId}/subscription`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) return;

      const subscription = snapshot.val();
      const now = new Date();
      const nextCycleEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

      await update(userRef, {
        tokens_used: 0,
        quizzes_used: 0,
        billing_cycle_start: now.toISOString(),
        billing_cycle_end: nextCycleEnd.toISOString(),
        updated_at: now.toISOString(),
      });

      console.log('✅ Monthly usage reset for user:', userId);
    } catch (error) {
      console.error('❌ Failed to reset monthly usage:', error);
    }
  }

  // Handle webhook events
  async handleWebhook(event: any): Promise<void> {
    try {
      console.log('🔔 Processing Whop webhook:', event.type);
      
      switch (event.type) {
        case 'payment_succeeded':
          await this.handlePaymentSucceeded(event.data);
          break;
        case 'subscription_created':
          await this.handleSubscriptionCreated(event.data);
          break;
        case 'subscription_updated':
          await this.handleSubscriptionUpdated(event.data);
          break;
        case 'subscription_cancelled':
          await this.handleSubscriptionCancelled(event.data);
          break;
        default:
          console.log('ℹ️ Unhandled webhook event:', event.type);
      }
    } catch (error) {
      console.error('❌ Webhook processing failed:', error);
      throw error;
    }
  }

  private async handlePaymentSucceeded(data: any): Promise<void> {
    const { user_id, product_id, subscription_id, amount } = data;
    const plan = this.mapPlanFromProductId(product_id);
    const limits = PLAN_LIMITS[plan];
    
    const now = new Date();
    const cycleEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    // Update user subscription
    const userRef = ref(db, `users/${user_id}/subscription`);
    await update(userRef, {
      plan,
      subscription_id,
      subscription_status: 'active',
      tokens_used: 0, // Reset usage on new billing cycle
      tokens_limit: limits.tokens,
      quizzes_used: 0, // Reset usage on new billing cycle
      quizzes_limit: limits.quizzes,
      billing_cycle_start: now.toISOString(),
      billing_cycle_end: cycleEnd.toISOString(),
      updated_at: now.toISOString(),
    });

    // Log payment
    const paymentRef = push(ref(db, `payments/${user_id}`));
    await set(paymentRef, {
      subscription_id,
      product_id,
      plan,
      amount,
      currency: 'USD',
      status: 'succeeded',
      created_at: now.toISOString(),
    });
    
    console.log('✅ Payment succeeded - user upgraded:', user_id, 'to', plan);
  }

  private async handleSubscriptionCreated(data: any): Promise<void> {
    const { user_id, id: subscription_id, product_id } = data;
    
    // Store subscription details
    const subscriptionRef = ref(db, `subscriptions/${subscription_id}`);
    await set(subscriptionRef, {
      id: subscription_id,
      user_id,
      product_id,
      plan_name: this.mapPlanFromProductId(product_id),
      status: 'active',
      created_at: new Date().toISOString(),
      ...data,
    });
    
    console.log('✅ Subscription created:', subscription_id);
  }

  private async handleSubscriptionUpdated(data: any): Promise<void> {
    const { user_id, id: subscription_id, status } = data;
    
    // Update subscription status
    const subscriptionRef = ref(db, `subscriptions/${subscription_id}`);
    await update(subscriptionRef, {
      status,
      updated_at: new Date().toISOString(),
      ...data,
    });
    
    // Update user plan if cancelled/expired
    if (status === 'cancelled' || status === 'expired') {
      const userRef = ref(db, `users/${user_id}/subscription`);
      await update(userRef, {
        plan: 'free',
        subscription_status: status,
        tokens_limit: PLAN_LIMITS.free.tokens,
        quizzes_limit: PLAN_LIMITS.free.quizzes,
        updated_at: new Date().toISOString(),
      });
    }
    
    console.log('✅ Subscription updated:', subscription_id, status);
  }

  private async handleSubscriptionCancelled(data: any): Promise<void> {
    const { user_id, id: subscription_id } = data;
    
    // Update user to free plan
    const userRef = ref(db, `users/${user_id}/subscription`);
    await update(userRef, {
      plan: 'free',
      subscription_status: 'cancelled',
      tokens_limit: PLAN_LIMITS.free.tokens,
      quizzes_limit: PLAN_LIMITS.free.quizzes,
      updated_at: new Date().toISOString(),
    });
    
    console.log('✅ Subscription cancelled - user downgraded:', user_id);
  }

  private mapPlanFromProductId(productId: string): 'free' | 'basic' | 'pro' | 'premium' {
    const planMapping: Record<string, 'free' | 'basic' | 'pro' | 'premium'> = {
      [process.env.WHOP_BASIC_PRODUCT_ID || '']: 'basic',
      [process.env.WHOP_PRO_PRODUCT_ID || '']: 'pro',
      [process.env.WHOP_PREMIUM_PRODUCT_ID || '']: 'premium',
    };
    
    return planMapping[productId] || 'free';
  }

  // Check if user can perform action (has tokens/quizzes remaining)
  async canPerformAction(userId: string, actionType: 'token' | 'quiz', amount: number = 1): Promise<boolean> {
    try {
      const usage = await this.getUserUsage(userId);
      if (!usage) return false;

      if (actionType === 'token') {
        return usage.tokens_remaining >= amount;
      } else {
        return usage.quizzes_remaining >= amount;
      }
    } catch (error) {
      console.error('❌ Failed to check action permission:', error);
      return false;
    }
  }

  // Get user's current plan
  async getUserPlan(userId: string): Promise<'free' | 'basic' | 'pro' | 'premium'> {
    try {
      const userRef = ref(db, `users/${userId}/subscription`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) return 'free';
      
      const userData = snapshot.val();
      return userData.plan || 'free';
    } catch (error) {
      console.error('❌ Failed to get user plan:', error);
      return 'free';
    }
  }

  // Check if user has active subscription
  async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const userRef = ref(db, `users/${userId}/subscription`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) return false;
      
      const userData = snapshot.val();
      return userData.subscription_status === 'active' && userData.plan !== 'free';
    } catch (error) {
      console.error('❌ Failed to check subscription status:', error);
      return false;
    }
  }
}

export const whopService = new WhopService();