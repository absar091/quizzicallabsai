"use client";

import { SubscriptionDashboard } from '@/components/subscription-dashboard';
import { EmailVerificationGuard } from '@/components/auth/EmailVerificationGuard';
import { PageHeader } from '@/components/page-header';

export default function BillingPage() {
  return (
    <EmailVerificationGuard>
      <div className="space-y-6">
        <PageHeader 
          title="Billing & Subscription" 
          description="Manage your subscription, view usage, and upgrade your plan"
        />
        <SubscriptionDashboard />
      </div>
    </EmailVerificationGuard>
  );
}