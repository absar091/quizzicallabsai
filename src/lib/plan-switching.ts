import { db } from '@/lib/firebase';
import { ref, get, set, update } from 'firebase/database';
import { whopService } from '@/lib/whop';
import { PLAN_LIMITS } from '@/lib/whop-constants';

export interface PlanChangeRequest {
  id: string;
  user_id: string;
  current_plan: string;
  requested_plan: string;
  requested_at: string;
  effective_date: string;
  status: 'pending' | 'completed' | 'cancelled';
  change_type: 'upgrade' | 'downgrade' | 'switch';
  reason?: string;
}

export interface PlanSwitchResult {
  success: boolean;
  message: string;
  effectiveDate?: string;
  isImmediate: boolean;
  checkoutUrl?: string;
  error?: string;
}

class PlanSwitchingService {
  // Request a plan change
  async requestPlanChange(
    userId: string,
    currentPlan: string,
    requestedPlan: string,
    userEmail: string
  ): Promise<PlanSwitchResult> {
    try {
      // Validate plans
      if (!PLAN_LIMITS[requestedPlan as keyof typeof PLAN_LIMITS]) {
        return {
          success: false,
          message: 'Invalid plan selected',
          isImmediate: false,
          error: 'INVALID_PLAN'
        };
      }

      // Get current subscription info
      const userRef = ref(db, `users/${userId}/subscription`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        return {
          success: false,
          message: 'Subscription not found. Please contact support.',
          isImmediate: false,
          error: 'SUBSCRIPTION_NOT_FOUND'
        };
      }

      const subscription = snapshot.val();
      const billingCycleEnd = new Date(subscription.billing_cycle_end);
      const now = new Date();

      // Determine change type
      const planOrder = ['free', 'basic', 'pro', 'premium'];
      const currentIndex = planOrder.indexOf(currentPlan);
      const requestedIndex = planOrder.indexOf(requestedPlan);
      
      const changeType = requestedIndex > currentIndex ? 'upgrade' : 
                        requestedIndex < currentIndex ? 'downgrade' : 'switch';

      // UPGRADE: Immediate effect, create Whop checkout
      if (changeType === 'upgrade') {
        try {
          const checkoutUrl = await whopService.createCheckoutUrl(
            requestedPlan,
            userId,
            userEmail
          );

          // Store pending upgrade
          const pendingRef = ref(db, `users/${userId}/pending_plan_change`);
          await set(pendingRef, {
            requested_plan: requestedPlan,
            current_plan: currentPlan,
            change_type: 'upgrade',
            requested_at: now.toISOString(),
            effective_date: 'immediate',
            status: 'pending_payment',
            checkout_url: checkoutUrl
          });

          return {
            success: true,
            message: `Upgrading to ${requestedPlan}! Complete payment to activate immediately.`,
            isImmediate: true,
            checkoutUrl,
            effectiveDate: 'Upon payment completion'
          };
        } catch (error: any) {
          console.error('Failed to create checkout URL:', error);
          return {
            success: false,
            message: 'Failed to create checkout session. Please try again.',
            isImmediate: false,
            error: 'CHECKOUT_FAILED'
          };
        }
      }

      // DOWNGRADE: Schedule for next billing cycle
      if (changeType === 'downgrade') {
        const effectiveDate = billingCycleEnd.toISOString();
        
        // Store scheduled downgrade
        const changeRequestRef = ref(db, `plan_change_requests/${userId}`);
        const changeRequest: Omit<PlanChangeRequest, 'id'> = {
          user_id: userId,
          current_plan: currentPlan,
          requested_plan: requestedPlan,
          requested_at: now.toISOString(),
          effective_date: effectiveDate,
          status: 'pending',
          change_type: 'downgrade',
          reason: 'User requested downgrade'
        };

        await set(changeRequestRef, changeRequest);

        // Update user's pending change
        const pendingRef = ref(db, `users/${userId}/pending_plan_change`);
        await set(pendingRef, {
          requested_plan: requestedPlan,
          current_plan: currentPlan,
          change_type: 'downgrade',
          requested_at: now.toISOString(),
          effective_date: effectiveDate,
          status: 'scheduled'
        });

        const daysUntilChange = Math.ceil((billingCycleEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        return {
          success: true,
          message: `Downgrade scheduled! Your plan will change to ${requestedPlan} on ${billingCycleEnd.toLocaleDateString()}. You'll continue to enjoy ${currentPlan} benefits until then.`,
          isImmediate: false,
          effectiveDate: billingCycleEnd.toLocaleDateString(),
        };
      }

      // SWITCH (same tier): Immediate via Whop
      try {
        const checkoutUrl = await whopService.createCheckoutUrl(
          requestedPlan,
          userId,
          userEmail
        );

        return {
          success: true,
          message: `Switching to ${requestedPlan}! Complete payment to activate.`,
          isImmediate: true,
          checkoutUrl,
          effectiveDate: 'Upon payment completion'
        };
      } catch (error: any) {
        return {
          success: false,
          message: 'Failed to create checkout session. Please try again.',
          isImmediate: false,
          error: 'CHECKOUT_FAILED'
        };
      }

    } catch (error: any) {
      console.error('❌ Plan change request failed:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again or contact support.',
        isImmediate: false,
        error: error.message || 'UNKNOWN_ERROR'
      };
    }
  }

  // Cancel a pending plan change
  async cancelPlanChange(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Remove pending change
      const pendingRef = ref(db, `users/${userId}/pending_plan_change`);
      await set(pendingRef, null);

      // Update change request status
      const changeRequestRef = ref(db, `plan_change_requests/${userId}`);
      const snapshot = await get(changeRequestRef);
      
      if (snapshot.exists()) {
        await update(changeRequestRef, {
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        });
      }

      return {
        success: true,
        message: 'Plan change cancelled successfully. Your current plan will continue.'
      };
    } catch (error: any) {
      console.error('❌ Failed to cancel plan change:', error);
      return {
        success: false,
        message: 'Failed to cancel plan change. Please try again.'
      };
    }
  }

  // Get pending plan change for a user
  async getPendingPlanChange(userId: string): Promise<{
    hasPending: boolean;
    change?: any;
  }> {
    try {
      const pendingRef = ref(db, `users/${userId}/pending_plan_change`);
      const snapshot = await get(pendingRef);
      
      if (snapshot.exists()) {
        return {
          hasPending: true,
          change: snapshot.val()
        };
      }

      return { hasPending: false };
    } catch (error) {
      console.error('❌ Failed to get pending plan change:', error);
      return { hasPending: false };
    }
  }

  // Process scheduled plan changes (called by cron job)
  async processScheduledChanges(): Promise<{
    processed: number;
    errors: number;
  }> {
    try {
      const now = new Date();
      let processed = 0;
      let errors = 0;

      // Get all plan change requests
      const { db: adminDb } = await import('@/lib/firebase-admin');
      const requestsRef = adminDb.ref('plan_change_requests');
      const snapshot = await requestsRef.once('value');

      if (!snapshot.exists()) {
        return { processed: 0, errors: 0 };
      }

      const requests = snapshot.val();

      for (const [userId, request] of Object.entries(requests)) {
        const changeRequest = request as PlanChangeRequest;
        
        // Skip if not pending or effective date hasn't arrived
        if (changeRequest.status !== 'pending') continue;
        
        const effectiveDate = new Date(changeRequest.effective_date);
        if (effectiveDate > now) continue;

        try {
          // Apply the plan change
          const userRef = adminDb.ref(`users/${userId}/subscription`);
          const newPlanLimits = PLAN_LIMITS[changeRequest.requested_plan as keyof typeof PLAN_LIMITS];

          await userRef.update({
            plan: changeRequest.requested_plan,
            tokens_limit: newPlanLimits.tokens,
            quizzes_limit: newPlanLimits.quizzes,
            updated_at: now.toISOString()
          });

          // Update request status
          await requestsRef.child(userId).update({
            status: 'completed',
            completed_at: now.toISOString()
          });

          // Remove pending change
          await adminDb.ref(`users/${userId}/pending_plan_change`).remove();

          processed++;
          console.log(`✅ Processed plan change for user ${userId}: ${changeRequest.current_plan} → ${changeRequest.requested_plan}`);

        } catch (error) {
          console.error(`❌ Failed to process plan change for user ${userId}:`, error);
          errors++;
        }
      }

      return { processed, errors };
    } catch (error) {
      console.error('❌ Failed to process scheduled changes:', error);
      return { processed: 0, errors: 0 };
    }
  }
}

export const planSwitchingService = new PlanSwitchingService();
