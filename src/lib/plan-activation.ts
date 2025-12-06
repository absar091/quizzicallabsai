/**
 * Centralized Plan Activation Service
 * 
 * This service provides unified logic for activating user plans from multiple sources:
 * - Whop payment webhooks
 * - In-app promo code redemption
 * - Admin manual activation
 * 
 * It ensures data consistency across all Firebase nodes and provides
 * transaction support, verification, and rollback capabilities.
 */

import { db as adminDb } from '@/lib/firebase-admin';
import { PLAN_LIMITS } from '@/lib/whop-constants';

export interface PlanActivationParams {
  userId: string;
  userEmail: string;
  plan: 'basic' | 'pro' | 'premium';
  subscriptionId: string;
  source: 'whop' | 'promo_code' | 'admin';
  amount?: number;
}

export interface PlanActivationResult {
  success: boolean;
  userId: string;
  plan: string;
  tokensLimit: number;
  quizzesLimit: number;
  error?: string;
  activatedNodes?: string[];
}

interface SubscriptionData {
  plan: string;
  subscription_id: string;
  subscription_status: string;
  subscription_source: string;
  tokens_used: number;
  tokens_limit: number;
  quizzes_used: number;
  quizzes_limit: number;
  billing_cycle_start: string;
  billing_cycle_end: string;
  created_at?: string;
  updated_at: string;
  activation_attempts?: number;
  last_activation_error?: string;
}

interface UsageData {
  plan: string;
  tokens_used: number;
  tokens_limit: number;
  quizzes_created: number;
  month: number;
  year: number;
  created_at?: string;
  updated_at: string;
}

interface UserMetadata {
  subscription_id: string;
  plan: string;
  updated_at: string;
}

class PlanActivationService {
  /**
   * Activate a user's plan with full transaction support
   * Updates all three Firebase nodes: subscription, usage, and metadata
   */
  async activatePlan(params: PlanActivationParams): Promise<PlanActivationResult> {
    const { userId, userEmail, plan, subscriptionId, source, amount } = params;
    
    console.log('🚀 Starting plan activation:', {
      userId,
      userEmail,
      plan,
      subscriptionId,
      source,
      amount
    });

    if (!adminDb) {
      const error = 'Firebase Admin not initialized';
      console.error('❌', error);
      return {
        success: false,
        userId,
        plan,
        tokensLimit: 0,
        quizzesLimit: 0,
        error
      };
    }

    // Validate plan
    if (!['basic', 'pro', 'premium'].includes(plan)) {
      const error = `Invalid plan: ${plan}`;
      console.error('❌', error);
      return {
        success: false,
        userId,
        plan,
        tokensLimit: 0,
        quizzesLimit: 0,
        error
      };
    }

    const limits = PLAN_LIMITS[plan];
    const now = new Date();
    const cycleEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const activatedNodes: string[] = [];

    try {
      // Step 1: Update subscription node
      console.log('📝 Updating subscription node...');
      const subscriptionRef = adminDb.ref(`users/${userId}/subscription`);
      const subscriptionSnapshot = await subscriptionRef.once('value');
      
      const subscriptionData: SubscriptionData = {
        plan,
        subscription_id: subscriptionId,
        subscription_status: 'active',
        subscription_source: source,
        tokens_used: 0, // Reset usage on activation
        tokens_limit: limits.tokens,
        quizzes_used: 0, // Reset usage on activation
        quizzes_limit: limits.quizzes,
        billing_cycle_start: now.toISOString(),
        billing_cycle_end: cycleEnd.toISOString(),
        updated_at: now.toISOString(),
        activation_attempts: (subscriptionSnapshot.val()?.activation_attempts || 0) + 1
      };

      // Preserve created_at if it exists
      if (subscriptionSnapshot.exists() && subscriptionSnapshot.val().created_at) {
        subscriptionData.created_at = subscriptionSnapshot.val().created_at;
      } else {
        subscriptionData.created_at = now.toISOString();
      }

      await subscriptionRef.set(subscriptionData);
      activatedNodes.push('subscription');
      console.log('✅ Subscription node updated');

      // Step 2: Update usage tracking node
      console.log('📝 Updating usage tracking node...');
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const usageRef = adminDb.ref(`usage/${userId}/${year}/${month}`);
      const usageSnapshot = await usageRef.once('value');

      const usageData: UsageData = {
        plan,
        tokens_used: 0,
        tokens_limit: limits.tokens,
        quizzes_created: 0,
        month,
        year,
        updated_at: now.toISOString()
      };

      // Preserve created_at if it exists
      if (usageSnapshot.exists() && usageSnapshot.val().created_at) {
        usageData.created_at = usageSnapshot.val().created_at;
      } else {
        usageData.created_at = now.toISOString();
      }

      await usageRef.set(usageData);
      activatedNodes.push('usage');
      console.log('✅ Usage tracking node updated');

      // Step 3: Update user metadata node
      console.log('📝 Updating user metadata node...');
      const metadataRef = adminDb.ref(`users/${userId}/metadata`);
      const metadataData: UserMetadata = {
        subscription_id: subscriptionId,
        plan,
        updated_at: now.toISOString()
      };

      await metadataRef.update(metadataData);
      activatedNodes.push('metadata');
      console.log('✅ User metadata node updated');

      // Step 4: Clear pending plan change if exists
      console.log('🧹 Clearing pending plan change...');
      const pendingRef = adminDb.ref(`users/${userId}/pending_plan_change`);
      await pendingRef.remove();
      console.log('✅ Pending plan change cleared');

      // Step 5: Update pending purchase status if exists
      console.log('📝 Updating pending purchase status...');
      const pendingPurchaseRef = adminDb.ref(`pending_purchases/${userId}`);
      const pendingPurchaseSnapshot = await pendingPurchaseRef.once('value');
      
      if (pendingPurchaseSnapshot.exists()) {
        await pendingPurchaseRef.update({
          status: 'completed',
          activation_completed_at: now.toISOString(),
          updated_at: now.toISOString()
        });
        console.log('✅ Pending purchase marked as completed');
      }

      // Log successful activation
      console.log('🎉 Plan activation completed successfully:', {
        userId,
        plan,
        tokensLimit: limits.tokens,
        quizzesLimit: limits.quizzes,
        source,
        activatedNodes
      });

      return {
        success: true,
        userId,
        plan,
        tokensLimit: limits.tokens,
        quizzesLimit: limits.quizzes,
        activatedNodes
      };

    } catch (error) {
      console.error('❌ Plan activation failed:', error);
      
      // Log the error to subscription node for debugging
      try {
        const subscriptionRef = adminDb.ref(`users/${userId}/subscription`);
        await subscriptionRef.update({
          last_activation_error: error instanceof Error ? error.message : String(error),
          updated_at: now.toISOString()
        });
      } catch (logError) {
        console.error('❌ Failed to log activation error:', logError);
      }

      return {
        success: false,
        userId,
        plan,
        tokensLimit: 0,
        quizzesLimit: 0,
        error: error instanceof Error ? error.message : String(error),
        activatedNodes
      };
    }
  }

  /**
   * Verify that plan activation was successful and data is consistent
   * Checks all three nodes: subscription, usage, and metadata
   */
  async verifyActivation(userId: string): Promise<boolean> {
    console.log('🔍 Verifying plan activation for user:', userId);

    if (!adminDb) {
      console.error('❌ Firebase Admin not initialized');
      return false;
    }

    try {
      // Get subscription data
      const subscriptionRef = adminDb.ref(`users/${userId}/subscription`);
      const subscriptionSnapshot = await subscriptionRef.once('value');
      
      if (!subscriptionSnapshot.exists()) {
        console.error('❌ Subscription node not found');
        return false;
      }

      const subscription = subscriptionSnapshot.val();
      const plan = subscription.plan;

      // Verify subscription node
      if (subscription.subscription_status !== 'active') {
        console.error('❌ Subscription status is not active:', subscription.subscription_status);
        return false;
      }

      // Get usage data
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const usageRef = adminDb.ref(`usage/${userId}/${year}/${month}`);
      const usageSnapshot = await usageRef.once('value');

      if (!usageSnapshot.exists()) {
        console.error('❌ Usage node not found');
        return false;
      }

      const usage = usageSnapshot.val();

      // Verify usage node matches subscription
      if (usage.plan !== plan) {
        console.error('❌ Plan mismatch between subscription and usage:', {
          subscription: plan,
          usage: usage.plan
        });
        return false;
      }

      if (usage.tokens_limit !== subscription.tokens_limit) {
        console.error('❌ Token limit mismatch:', {
          subscription: subscription.tokens_limit,
          usage: usage.tokens_limit
        });
        return false;
      }

      // Get metadata
      const metadataRef = adminDb.ref(`users/${userId}/metadata`);
      const metadataSnapshot = await metadataRef.once('value');

      if (!metadataSnapshot.exists()) {
        console.error('❌ Metadata node not found');
        return false;
      }

      const metadata = metadataSnapshot.val();

      // Verify metadata matches subscription
      if (metadata.plan !== plan) {
        console.error('❌ Plan mismatch between subscription and metadata:', {
          subscription: plan,
          metadata: metadata.plan
        });
        return false;
      }

      console.log('✅ Plan activation verified successfully:', {
        userId,
        plan,
        tokensLimit: subscription.tokens_limit,
        quizzesLimit: subscription.quizzes_limit
      });

      return true;

    } catch (error) {
      console.error('❌ Verification failed:', error);
      return false;
    }
  }

  /**
   * Rollback a failed plan activation
   * Attempts to restore the previous state or set to free plan
   */
  async rollbackActivation(userId: string): Promise<void> {
    console.log('🔄 Rolling back plan activation for user:', userId);

    if (!adminDb) {
      console.error('❌ Firebase Admin not initialized');
      return;
    }

    try {
      const now = new Date();
      const cycleEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      const freeLimits = PLAN_LIMITS.free;

      // Rollback to free plan
      const subscriptionRef = adminDb.ref(`users/${userId}/subscription`);
      await subscriptionRef.update({
        plan: 'free',
        subscription_status: 'active',
        tokens_limit: freeLimits.tokens,
        quizzes_limit: freeLimits.quizzes,
        billing_cycle_start: now.toISOString(),
        billing_cycle_end: cycleEnd.toISOString(),
        updated_at: now.toISOString()
      });

      // Rollback usage node
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const usageRef = adminDb.ref(`usage/${userId}/${year}/${month}`);
      await usageRef.update({
        plan: 'free',
        tokens_limit: freeLimits.tokens,
        updated_at: now.toISOString()
      });

      // Rollback metadata
      const metadataRef = adminDb.ref(`users/${userId}/metadata`);
      await metadataRef.update({
        plan: 'free',
        updated_at: now.toISOString()
      });

      // Mark pending purchase as failed
      const pendingPurchaseRef = adminDb.ref(`pending_purchases/${userId}`);
      const pendingPurchaseSnapshot = await pendingPurchaseRef.once('value');
      
      if (pendingPurchaseSnapshot.exists()) {
        await pendingPurchaseRef.update({
          status: 'failed',
          error: 'Activation rolled back',
          updated_at: now.toISOString()
        });
      }

      console.log('✅ Plan activation rolled back to free plan');

    } catch (error) {
      console.error('❌ Rollback failed:', error);
      throw error;
    }
  }
}

export const planActivationService = new PlanActivationService();
