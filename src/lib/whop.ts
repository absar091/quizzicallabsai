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
}

export const whopService = new WhopService();
