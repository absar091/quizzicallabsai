// Subscription Management System for Quizzicallabzᴬᴵ
import { db } from './firebase-admin';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number; // in PKR
  currency: 'PKR';
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    quizzesPerDay: number;
    aiRequestsPerDay: number;
    storageGB: number;
    prioritySupport: boolean;
    adFree: boolean;
  };
}

export interface UserSubscription {
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  paymentMethod: 'safepay' | 'manual';
  lastPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: 'PKR';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'safepay';
  transactionId?: string;
  orderId: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
}

// Available subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'PKR',
    interval: 'monthly',
    features: [
      'Unlimited quizzes & guides',
      'Standard AI model',
      'Full prep modules (with ads)',
      'Basic support'
    ],
    limits: {
      quizzesPerDay: 50,
      aiRequestsPerDay: 100,
      storageGB: 1,
      prioritySupport: false,
      adFree: false
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 200,
    currency: 'PKR',
    interval: 'monthly',
    features: [
      'Advanced AI (higher accuracy)',
      'Ad-free experience',
      'Priority support',
      'Higher rate limits',
      'Advanced analytics',
      'Export capabilities'
    ],
    limits: {
      quizzesPerDay: 200,
      aiRequestsPerDay: 500,
      storageGB: 5,
      prioritySupport: true,
      adFree: true
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 500,
    currency: 'PKR',
    interval: 'monthly',
    features: [
      'Everything in Pro',
      'Unlimited AI requests',
      'Custom branding',
      'API access',
      'Dedicated support',
      'Advanced integrations'
    ],
    limits: {
      quizzesPerDay: -1, // Unlimited
      aiRequestsPerDay: -1, // Unlimited
      storageGB: 20,
      prioritySupport: true,
      adFree: true
    }
  }
];

class SubscriptionService {
  /**
   * Get user's current subscription
   */
  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      if (!db) {
        throw new Error('Firebase Admin not initialized');
      }

      const subscriptionRef = db.ref(`subscriptions/${userId}`);
      const snapshot = await subscriptionRef.once('value');

      if (!snapshot.exists()) {
        return null;
      }

      return snapshot.val() as UserSubscription;
    } catch (error) {
      console.error('Error getting user subscription:', error);
      return null;
    }
  }

  /**
   * Create or update user subscription
   */
  async createSubscription(
    userId: string,
    planId: string,
    paymentId?: string
  ): Promise<UserSubscription> {
    try {
      if (!db) {
        throw new Error('Firebase Admin not initialized');
      }

      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) {
        throw new Error(`Invalid plan ID: ${planId}`);
      }

      const now = new Date();
      const periodEnd = new Date(now);
      
      if (plan.interval === 'monthly') {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      } else {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      }

      const subscription: UserSubscription = {
        userId,
        planId,
        status: paymentId ? 'active' : 'pending',
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
        cancelAtPeriodEnd: false,
        paymentMethod: 'safepay',
        lastPaymentId: paymentId || null,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };

      const subscriptionRef = db.ref(`subscriptions/${userId}`);
      await subscriptionRef.set(subscription);

      console.log(`✅ Subscription created for user ${userId}: ${planId}`);
      return subscription;

    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  /**
   * Update subscription status
   */
  async updateSubscriptionStatus(
    userId: string,
    status: UserSubscription['status'],
    paymentId?: string
  ): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase Admin not initialized');
      }

      const subscriptionRef = db.ref(`subscriptions/${userId}`);
      const updates: Partial<UserSubscription> = {
        status,
        updatedAt: new Date().toISOString()
      };

      if (paymentId) {
        updates.lastPaymentId = paymentId;
      }

      await subscriptionRef.update(updates);
      console.log(`✅ Subscription status updated for user ${userId}: ${status}`);

    } catch (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string, immediate = false): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase Admin not initialized');
      }

      const subscriptionRef = db.ref(`subscriptions/${userId}`);
      const updates: Partial<UserSubscription> = {
        cancelAtPeriodEnd: !immediate,
        status: immediate ? 'cancelled' : 'active',
        updatedAt: new Date().toISOString()
      };

      await subscriptionRef.update(updates);
      console.log(`✅ Subscription cancelled for user ${userId} (immediate: ${immediate})`);

    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  /**
   * Check if user has active subscription
   */
  async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription || subscription.status !== 'active') {
        return false;
      }

      // Check if subscription has expired
      const now = new Date();
      const periodEnd = new Date(subscription.currentPeriodEnd);
      
      if (now > periodEnd) {
        // Subscription has expired, update status
        await this.updateSubscriptionStatus(userId, 'expired');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking active subscription:', error);
      return false;
    }
  }

  /**
   * Get user's plan details
   */
  async getUserPlan(userId: string): Promise<SubscriptionPlan> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription || subscription.status !== 'active') {
        return SUBSCRIPTION_PLANS.find(p => p.id === 'free')!;
      }

      const plan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.planId);
      return plan || SUBSCRIPTION_PLANS.find(p => p.id === 'free')!;
    } catch (error) {
      console.error('Error getting user plan:', error);
      return SUBSCRIPTION_PLANS.find(p => p.id === 'free')!;
    }
  }

  /**
   * Record payment
   */
  async recordPayment(payment: Omit<PaymentRecord, 'id' | 'createdAt'>): Promise<string> {
    try {
      if (!db) {
        throw new Error('Firebase Admin not initialized');
      }

      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const paymentRecord: PaymentRecord = {
        ...payment,
        id: paymentId,
        createdAt: new Date().toISOString()
      };

      const paymentRef = db.ref(`payments/${paymentId}`);
      await paymentRef.set(paymentRecord);

      // Also store in user's payment history
      const userPaymentRef = db.ref(`users/${payment.userId}/payments/${paymentId}`);
      await userPaymentRef.set({
        paymentId,
        amount: payment.amount,
        status: payment.status,
        createdAt: paymentRecord.createdAt
      });

      console.log(`✅ Payment recorded: ${paymentId}`);
      return paymentId;

    } catch (error) {
      console.error('Error recording payment:', error);
      throw error;
    }
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(
    paymentId: string,
    status: PaymentRecord['status'],
    transactionId?: string
  ): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase Admin not initialized');
      }

      const paymentRef = db.ref(`payments/${paymentId}`);
      const updates: Partial<PaymentRecord> = {
        status,
        updatedAt: new Date().toISOString()
      };

      if (transactionId) {
        updates.transactionId = transactionId;
      }

      if (status === 'completed') {
        updates.completedAt = new Date().toISOString();
      }

      await paymentRef.update(updates);
      console.log(`✅ Payment status updated: ${paymentId} -> ${status}`);

    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  /**
   * Get user's payment history
   */
  async getUserPayments(userId: string): Promise<PaymentRecord[]> {
    try {
      if (!db) {
        throw new Error('Firebase Admin not initialized');
      }

      const paymentsRef = db.ref('payments');
      const query = paymentsRef.orderByChild('userId').equalTo(userId);
      const snapshot = await query.once('value');

      if (!snapshot.exists()) {
        return [];
      }

      const payments: PaymentRecord[] = [];
      snapshot.forEach((child) => {
        payments.push(child.val() as PaymentRecord);
      });

      // Sort by creation date (newest first)
      return payments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    } catch (error) {
      console.error('Error getting user payments:', error);
      return [];
    }
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();

// Helper functions
export const getPlanById = (planId: string): SubscriptionPlan | undefined => {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
};

export const formatPrice = (price: number, currency = 'PKR'): string => {
  return `${currency} ${price.toLocaleString()}`;
};

export const isFeatureAvailable = (plan: SubscriptionPlan, feature: keyof SubscriptionPlan['limits']): boolean => {
  const limit = plan.limits[feature];
  if (typeof limit === 'boolean') return limit;
  if (typeof limit === 'number') return limit > 0 || limit === -1; // -1 means unlimited
  return false;
};