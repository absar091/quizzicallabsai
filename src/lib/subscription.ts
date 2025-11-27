// Subscription Management System for Quizzicallabzᴬᴵ
import { db } from './firebase-admin';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: 'PKR' | 'USD';
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
  paymentMethod: 'whop' | 'manual';
  lastPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: 'USD';
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  paymentMethod: 'whop' | 'manual';
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
    price: 2,
    currency: 'USD',
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
  }
];

class SubscriptionService {
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
        paymentMethod: 'whop',
        lastPaymentId: paymentId || undefined,
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

  async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription || subscription.status !== 'active') {
        return false;
      }

      const now = new Date();
      const periodEnd = new Date(subscription.currentPeriodEnd);
      
      if (now > periodEnd) {
        await this.updateSubscriptionStatus(userId, 'expired');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking active subscription:', error);
      return false;
    }
  }

  async recordPayment(payment: Omit<PaymentRecord, 'id' | 'createdAt'>): Promise<string> {
    try {
      if (!db) {
        throw new Error('Firebase Admin not initialized');
      }

      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const paymentRecord: PaymentRecord = {
        ...payment,
        id: paymentId,
        createdAt: new Date().toISOString()
      };

      const paymentRef = db.ref(`payments/${paymentId}`);
      await paymentRef.set(paymentRecord);

      console.log(`✅ Payment recorded: ${paymentId}`);
      return paymentId;

    } catch (error) {
      console.error('Error recording payment:', error);
      throw error;
    }
  }

  async activateWhopSubscription(orderId: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase Admin not initialized');
      }
      
      const subscriptionsRef = db.ref('subscriptions');
      const snapshot = await subscriptionsRef.orderByChild('lastPaymentId').equalTo(orderId).once('value');
      
      if (snapshot.exists()) {
        const subscriptions = snapshot.val();
        const userId = Object.keys(subscriptions)[0];
        
        await db.ref(`subscriptions/${userId}`).update({
          status: 'active',
          updatedAt: new Date().toISOString()
        });
        
        console.log('✅ Whop subscription activated for user:', userId);
      }
    } catch (error) {
      console.error('❌ Failed to activate Whop subscription:', error);
      throw error;
    }
  }
}

export const subscriptionService = new SubscriptionService();