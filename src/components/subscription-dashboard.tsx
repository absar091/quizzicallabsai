'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { UsageTracker } from '@/components/usage-tracker';
import { PendingPlanChange } from '@/components/pending-plan-change';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PLAN_LIMITS } from '@/lib/whop';
import { 
  TrendingUp, 
  Calendar, 
  CreditCard, 
  Settings, 
  BarChart3,
  Zap,
  FileText,
  Crown,
  Star
} from 'lucide-react';
import Link from 'next/link';

export function SubscriptionDashboard() {
  const { usage, loading, error, refreshUsage } = useSubscription();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !usage) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              {error || 'Unable to load subscription data'}
            </p>
            <Button onClick={refreshUsage}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentPlan = PLAN_LIMITS[usage.plan as keyof typeof PLAN_LIMITS];
  const tokenPercentage = (usage.tokens_used / usage.tokens_limit) * 100;
  const quizPercentage = (usage.quizzes_used / usage.quizzes_limit) * 100;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'basic': return <Star className="h-5 w-5" />;
      case 'pro': return <Crown className="h-5 w-5" />;
      case 'premium': return <Crown className="h-5 w-5 text-yellow-500" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Pending Plan Change Alert */}
      <PendingPlanChange />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your plan and track your usage
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="capitalize">
            {getPlanIcon(usage.plan)}
            <span className="ml-1">{usage.plan} Plan</span>
          </Badge>
          {usage.plan === 'free' && (
            <Button asChild>
              <Link href="/pricing">Upgrade Plan</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            {getPlanIcon(usage.plan)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{usage.plan}</div>
            <p className="text-xs text-muted-foreground">
              ${currentPlan?.price_usd || 0}/month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Used</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(usage.tokens_used)}
            </div>
            <p className="text-xs text-muted-foreground">
              of {formatNumber(usage.tokens_limit)} ({tokenPercentage.toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Created</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage.quizzes_used}</div>
            <p className="text-xs text-muted-foreground">
              of {usage.quizzes_limit} ({quizPercentage.toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cycle Ends</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage.billing_cycle_end ? 
                new Date(usage.billing_cycle_end).getDate() : 
                'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {usage.billing_cycle_end ? 
                new Date(usage.billing_cycle_end).toLocaleDateString('en-US', { month: 'short' }) :
                'No cycle'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed View */}
      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Usage Details</TabsTrigger>
          <TabsTrigger value="plan">Plan Features</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <UsageTracker showUpgradeButton={false} />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Usage Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Token Efficiency</span>
                    <span className={getStatusColor(tokenPercentage)}>
                      {tokenPercentage < 50 ? 'Excellent' : 
                       tokenPercentage < 80 ? 'Good' : 'High Usage'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Quiz Frequency</span>
                    <span className={getStatusColor(quizPercentage)}>
                      {quizPercentage < 50 ? 'Light' : 
                       quizPercentage < 80 ? 'Moderate' : 'Heavy'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Days Remaining</span>
                    <span>
                      {usage.billing_cycle_end ? 
                        Math.ceil((new Date(usage.billing_cycle_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) :
                        'N/A'
                      }
                    </span>
                  </div>
                </div>

                {usage.plan === 'free' && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-3">
                      Upgrade to unlock more features and higher limits
                    </p>
                    <Button size="sm" className="w-full" asChild>
                      <Link href="/pricing">View Plans</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan Features</CardTitle>
              <CardDescription>
                What's included in your {usage.plan} plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">Limits & Quotas</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>AI Tokens</span>
                      <span className="font-medium">{formatNumber(currentPlan?.tokens || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quizzes per Month</span>
                      <span className="font-medium">{currentPlan?.quizzes || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Cost</span>
                      <span className="font-medium">${currentPlan?.price_usd || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Features</h4>
                  <div className="space-y-2">
                    {currentPlan?.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {usage.plan !== 'premium' && (
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Want more features?</h4>
                      <p className="text-sm text-muted-foreground">
                        Upgrade to unlock advanced AI models and higher limits
                      </p>
                    </div>
                    <Button asChild>
                      <Link href="/pricing">Compare Plans</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Billing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Current Subscription</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Plan</span>
                      <span className="capitalize font-medium">{usage.plan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status</span>
                      <Badge variant={usage.subscription_status === 'active' ? 'default' : 'secondary'}>
                        {usage.subscription_status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Cost</span>
                      <span className="font-medium">${currentPlan?.price_usd || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Billing Cycle</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Current Period</span>
                      <span>
                        {usage.billing_cycle_end ? 
                          `${new Date().toLocaleDateString()} - ${new Date(usage.billing_cycle_end).toLocaleDateString()}` :
                          'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Billing</span>
                      <span>
                        {usage.billing_cycle_end ? 
                          new Date(usage.billing_cycle_end).toLocaleDateString() :
                          'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Manage Subscription</h4>
                    <p className="text-sm text-muted-foreground">
                      Change your plan or update billing information
                    </p>
                  </div>
                  <div className="space-x-2">
                    {usage.plan === 'free' ? (
                      <Button asChild>
                        <Link href="/pricing">Upgrade Plan</Link>
                      </Button>
                    ) : (
                      <Button variant="outline" asChild>
                        <Link href="/pricing">Change Plan</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}