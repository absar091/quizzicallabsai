import { db as adminDb } from '@/lib/firebase-admin';
import { PLAN_LIMITS } from '@/lib/whop-constants';

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

// Re-export PLAN_LIMITS for backward compatibility
export { PLAN_LIMITS } from '@/lib/whop-constants';

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

  // Create checkout URL for a plan
  async createCheckoutUrl(planId: string, userId: string, userEmail: string): Promise<string> {
    try {
      // Map plan names to Whop product IDs
      const productIdMap: Record<string, string> = {
        'basic': process.env.WHOP_BASIC_PRODUCT_ID || '',
        'pro': process.env.WHOP_PRO_PRODUCT_ID || '',
        'premium': process.env.WHOP_PREMIUM_PRODUCT_ID || '',
      };

      const whopProductId = productIdMap[planId];
      if (!whopProductId) {
        throw new Error(`Invalid plan ID: ${planId}`);
      }

      // Use email parameter for user identification
      const checkoutUrl = `https://whop.com/checkout/${whopProductId}?email=${encodeURIComponent(userEmail)}`;
      
      // Store pending purchase in database for webhook matching
      try {
        const pendingRef = adminDb.ref(`pending_purchases/${userId}`);
        await pendingRef.set({
          user_id: userId,
          email: userEmail,
          requested_plan: planId,
          whop_product_id: whopProductId,
          created_at: new Date().toISOString(),
          status: 'pending',
        });
        console.log('💾 Stored pending purchase for user:', userId);
      } catch (error) {
        console.warn('⚠️ Failed to store pending purchase:', error);
      }
      
      console.log('✅ Whop checkout URL created:', checkoutUrl);
      console.log('📋 Plan mapping:', { planId, whopProductId, userId, userEmail });
      console.log('🔧 Environment check:', {
        WHOP_BASIC_PRODUCT_ID: process.env.WHOP_BASIC_PRODUCT_ID,
        WHOP_PRO_PRODUCT_ID: process.env.WHOP_PRO_PRODUCT_ID,
        WHOP_PREMIUM_PRODUCT_ID: process.env.WHOP_PREMIUM_PRODUCT_ID,
      });
      
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

      const userRef = adminDb.ref(`users/${userId}/subscription`);
      await userRef.set({
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
      const usageRef = adminDb.ref(`usage/${userId}/${now.getFullYear()}/${now.getMonth() + 1}`);
      await usageRef.set({
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
      const userRef = adminDb.ref(`users/${userId}/subscription`);
      const snapshot = await userRef.once('value');
      
      if (!snapshot.exists()) {
        console.warn('⚠️ User subscription not found');
        return false;
      }

      const subscription = snapshot.val();
      const newTokensUsed = (subscription.tokens_used || 0) + tokensUsed;

      // Check if user exceeds limit
      if (newTokensUsed > subscription.tokens_limit) {
        console.warn('⚠️ User exceeded token limit:', userId);
        return false;
      }

      // Update usage
      await userRef.update({
        tokens_used: newTokensUsed,
        updated_at: new Date().toISOString(),
      });

      // Track monthly usage
      const now = new Date();
      const usageRef = adminDb.ref(`usage/${userId}/${now.getFullYear()}/${now.getMonth() + 1}`);
      const usageSnapshot = await usageRef.once('value');
      
      if (usageSnapshot.exists()) {
        const currentUsage = usageSnapshot.val();
        await usageRef.update({
          tokens_used: (currentUsage.tokens_used || 0) + tokensUsed,
        });
      }

      console.log('✅ Token usage tracked:', userId, tokensUsed);
      return true;
    } catch (error) {
      console.error('❌ Failed to track token usage:', error);
      return false;
    }
  }

  // Track quiz creation
  async trackQuizCreation(userId: string): Promise<boolean> {
    try {
      const userRef = adminDb.ref(`users/${userId}/subscription`);
      const snapshot = await userRef.once('value');
      
      if (!snapshot.exists()) {
        console.warn('⚠️ User subscription not found');
        return false;
      }

      const subscription = snapshot.val();
      const newQuizzesUsed = (subscription.quizzes_used || 0) + 1;

      // Check if user exceeds limit
      if (newQuizzesUsed > subscription.quizzes_limit) {
        console.warn('⚠️ User exceeded quiz limit:', userId);
        return false;
      }

      // Update usage
      await userRef.update({
        quizzes_used: newQuizzesUsed,
        updated_at: new Date().toISOString(),
      });

      // Track monthly usage
      const now = new Date();
      const usageRef = adminDb.ref(`usage/${userId}/${now.getFullYear()}/${now.getMonth() + 1}`);
      const usageSnapshot = await usageRef.once('value');
      
      if (usageSnapshot.exists()) {
        const currentUsage = usageSnapshot.val();
        await usageRef.update({
          quizzes_created: (currentUsage.quizzes_created || 0) + 1,
        });
      } else {
        await usageRef.set({
          tokens_used: 0,
          quizzes_created: 1,
          plan: subscription.plan,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        });
      }

      console.log('✅ Quiz creation tracked:', userId);
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
      const userRef = adminDb.ref(`users/${userId}/subscription`);
      const snapshot = await userRef.once('value');
      
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
      const userRef = adminDb.ref(`users/${userId}/subscription`);
      const snapshot = await userRef.once('value');
      
      if (!snapshot.exists()) return;

      const now = new Date();
      const nextCycleEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

      await userRef.update({
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

  // Get user's current plan
  async getUserPlan(userId: string): Promise<'free' | 'basic' | 'pro' | 'premium'> {
    try {
      const userRef = adminDb.ref(`users/${userId}/subscription`);
      const snapshot = await userRef.once('value');
      
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
      const userRef = adminDb.ref(`users/${userId}/subscription`);
      const snapshot = await userRef.once('value');
      
      if (!snapshot.exists()) return false;
      
      const userData = snapshot.val();
      return userData.subscription_status === 'active' && userData.plan !== 'free';
    } catch (error) {
      console.error('❌ Failed to check subscription status:', error);
      return false;
    }
  }

  // Verify Whop webhook signature
  verifyWebhookSignature(body: string, signature: string): boolean {
    try {
      const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;
      if (!webhookSecret) {
        console.error('❌ WHOP_WEBHOOK_SECRET not configured');
        return false;
      }

      // Whop uses HMAC SHA-256 for webhook signatures
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');

      return signature === expectedSignature;
    } catch (error) {
      console.error('❌ Failed to verify webhook signature:', error);
      return false;
    }
  }

  // Process Whop webhook (supports v1 and v2 API formats)
  processWebhook(webhookData: any): {
    success: boolean;
    event?: string;
    userId?: string;
    userEmail?: string;
    planId?: string;
    status?: string;
    subscriptionId?: string;
  } {
    try {
      console.log('🔍 Processing webhook data:', JSON.stringify(webhookData, null, 2));

      // Whop v1 API format
      const action = webhookData.action || webhookData.type || webhookData.event;
      const data = webhookData.data || webhookData;

      // Map Whop events to our internal events
      const eventMap: Record<string, string> = {
        'membership.went_valid': 'membership_activated',
        'membership.went_invalid': 'membership_cancelled',
        'membership.updated': 'membership_renewed',
        'payment.succeeded': 'membership_activated',
        'payment_succeeded': 'membership_activated',
        'membership_went_valid': 'membership_activated',
        'membership_went_invalid': 'membership_cancelled',
      };

      const event = eventMap[action] || action;
      
      // Extract user and subscription info (handle multiple formats)
      const userId = data.user?.id || data.user_id || data.userId || '';
      const userEmail = data.user?.email || data.email || data.user_email || '';
      const planId = data.plan?.id || data.product_id || data.plan_id || data.product?.id || '';
      const subscriptionId = data.id || data.membership_id || data.subscription_id || '';
      const status = data.status || data.valid ? 'active' : 'inactive';

      console.log('✅ Extracted webhook data:', {
        event,
        userId,
        userEmail,
        planId,
        subscriptionId,
        status
      });

      return {
        success: true,
        event,
        userId,
        userEmail,
        planId,
        status,
        subscriptionId,
      };
    } catch (error) {
      console.error('❌ Failed to process webhook:', error);
      return { success: false };
    }
  }

  // Upgrade user plan after successful payment
  async upgradePlan(userId: string, userEmail: string, planId: string, subscriptionId: string): Promise<void> {
    try {
      if (!adminDb) {
        throw new Error('Firebase Admin not initialized');
      }

      // Map Whop plan ID to our plan names
      const planMapping: Record<string, 'basic' | 'pro' | 'premium'> = {
        [process.env.WHOP_BASIC_PRODUCT_ID || '']: 'basic',
        [process.env.WHOP_PRO_PRODUCT_ID || '']: 'pro',
        [process.env.WHOP_PREMIUM_PRODUCT_ID || '']: 'premium',
      };

      const plan = planMapping[planId] || 'free';
      const limits = PLAN_LIMITS[plan];

      const now = new Date();
      const cycleEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

      // Update user subscription
      const userRef = adminDb.ref(`users/${userId}/subscription`);
      await userRef.update({
        plan,
        subscription_id: subscriptionId,
        subscription_status: 'active',
        tokens_used: 0, // Reset usage on upgrade
        tokens_limit: limits.tokens,
        quizzes_used: 0, // Reset usage on upgrade
        quizzes_limit: limits.quizzes,
        billing_cycle_start: now.toISOString(),
        billing_cycle_end: cycleEnd.toISOString(),
        updated_at: now.toISOString(),
      });

      // Remove pending plan change if exists
      const pendingRef = adminDb.ref(`users/${userId}/pending_plan_change`);
      await pendingRef.remove();

      console.log(`✅ User ${userId} upgraded to ${plan} plan`);
    } catch (error) {
      console.error('❌ Failed to upgrade user plan:', error);
      throw error;
    }
  }

  // Update user plan in usage collection (for syncing metadata with usage)
  async updateUserPlan(userId: string, plan: string): Promise<boolean> {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      // Update current month's usage with correct plan
      const usageRef = adminDb.ref(`usage/${userId}/${year}/${month}`);
      const snapshot = await usageRef.once('value');

      if (snapshot.exists()) {
        await usageRef.update({
          plan: plan,
          updated_at: now.toISOString(),
        });
      } else {
        // Create usage entry if it doesn't exist
        const limits = PLAN_LIMITS[plan.toLowerCase() as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;
        await usageRef.set({
          plan: plan,
          tokens_used: 0,
          tokens_limit: limits.tokens,
          quizzes_created: 0,
          month: month,
          year: year,
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
        });
      }

      // Also update subscription metadata
      const subscriptionRef = adminDb.ref(`users/${userId}/subscription`);
      const subSnapshot = await subscriptionRef.once('value');
      
      if (subSnapshot.exists()) {
        const currentData = subSnapshot.val();
        await subscriptionRef.update({
          plan: plan,
          updated_at: now.toISOString(),
          // Preserve subscription_source if it exists, default to 'whop'
          subscription_source: currentData.subscription_source || 'whop',
          // Increment activation_attempts if updating
          activation_attempts: (currentData.activation_attempts || 0) + 1,
        });
      }

      console.log(`✅ User ${userId} plan synced to ${plan} in usage collection`);
      return true;
    } catch (error) {
      console.error('❌ Failed to update user plan in usage:', error);
      return false;
    }
  }
}

export const whopService = new WhopService();
