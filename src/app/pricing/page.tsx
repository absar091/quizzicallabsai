"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PLAN_LIMITS } from '@/lib/whop-constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, Zap, Crown, Star, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface UserUsage {
  plan: string;
  tokens_used: number;
  tokens_limit: number;
  tokens_remaining: number;
  quizzes_used: number;
  quizzes_limit: number;
  quizzes_remaining: number;
  billing_cycle_end: string;
  subscription_status: string;
}

export default function PricingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userUsage, setUserUsage] = useState<UserUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadUserUsage();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadUserUsage = async () => {
    if (!user) return;
    
    try {
      // Get Firebase token
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      const token = await currentUser.getIdToken();

      // Fetch usage from API
      const response = await fetch('/api/subscription/usage', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserUsage(data.usage);
      }
    } catch (error) {
      console.error('Failed to load user usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to upgrade your plan.",
        variant: "destructive",
      });
      return;
    }

    setUpgrading(planId);
    try {
      // Get Firebase token
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      const token = await currentUser.getIdToken();

      // Request plan change
      const response = await fetch('/api/subscription/change-plan', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestedPlan: planId,
          currentPlan: userUsage?.plan || 'free',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change plan');
      }

      // Show success message
      toast({
        title: data.isImmediate ? "Redirecting to Checkout" : "Plan Change Scheduled",
        description: data.message,
      });

      // Redirect to checkout if immediate (upgrade)
      if (data.checkoutUrl) {
        setTimeout(() => {
          window.location.href = data.checkoutUrl;
        }, 1500);
      } else {
        // Reload usage data
        await loadUserUsage();
      }

    } catch (error: any) {
      console.error('Failed to change plan:', error);
      toast({
        title: "Plan Change Failed",
        description: error.message || "Failed to process plan change. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpgrading(null);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      icon: <Zap className="h-6 w-6" />,
      price: { usd: 0, pkr: 0 },
      description: 'Perfect for getting started',
      limits: PLAN_LIMITS.free,
      popular: false,
      color: 'border-gray-200',
      buttonVariant: 'outline' as const,
    },
    {
      id: 'basic',
      name: 'Basic Plan',
      icon: <Star className="h-6 w-6" />,
      price: { usd: 1.05, pkr: 300 },
      description: 'Great for regular users',
      limits: PLAN_LIMITS.basic,
      popular: false,
      color: 'border-blue-200',
      buttonVariant: 'default' as const,
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      icon: <Crown className="h-6 w-6" />,
      price: { usd: 2.10, pkr: 600 },
      description: 'Most popular choice',
      limits: PLAN_LIMITS.pro,
      popular: true,
      color: 'border-purple-200 ring-2 ring-purple-500',
      buttonVariant: 'default' as const,
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      icon: <Sparkles className="h-6 w-6" />,
      price: { usd: 3.86, pkr: 1100 },
      description: 'For power users',
      limits: PLAN_LIMITS.premium,
      popular: false,
      color: 'border-gold-200',
      buttonVariant: 'default' as const,
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Choose Your <span className="text-primary">Perfect Plan</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Unlock the full potential of AI-powered learning
        </p>
        
        {userUsage && (
          <div className="bg-muted/50 rounded-lg p-4 max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">Your Current Usage</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Current Plan</p>
                <p className="font-medium capitalize">{userUsage.plan}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tokens Used</p>
                <p className="font-medium">
                  {formatNumber(userUsage.tokens_used)} / {formatNumber(userUsage.tokens_limit)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Quizzes Created</p>
                <p className="font-medium">
                  {userUsage.quizzes_used} / {userUsage.quizzes_limit}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Billing Cycle Ends</p>
                <p className="font-medium">
                  {userUsage.billing_cycle_end ? 
                    new Date(userUsage.billing_cycle_end).toLocaleDateString() : 
                    'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {plans.map((plan) => {
          const isCurrentPlan = userUsage?.plan === plan.id;
          const canUpgrade = plan.id !== 'free' && (!userUsage || userUsage.plan !== plan.id);
          
          return (
            <Card key={plan.id} className={`relative ${plan.color} ${plan.popular ? 'scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-500 text-white">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2 text-primary">
                  {plan.icon}
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                
                <div className="mt-4">
                  <div className="text-3xl font-bold">
                    ${plan.price.usd}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    PKR {plan.price.pkr}/month
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>AI Tokens</span>
                    <span className="font-medium">{formatNumber(plan.limits.tokens)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Quizzes/Month</span>
                    <span className="font-medium">{plan.limits.quizzes}</span>
                  </div>
                </div>
                
                <div className="space-y-2 pt-2 border-t">
                  {plan.limits.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                {isCurrentPlan ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : plan.id === 'free' ? (
                  <Button variant="outline" className="w-full" disabled>
                    Always Free
                  </Button>
                ) : (
                  <Button
                    variant={plan.buttonVariant}
                    className="w-full"
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={upgrading === plan.id}
                  >
                    {upgrading === plan.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Upgrading...
                      </>
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div className="bg-muted/30 rounded-lg p-6 mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">Feature Comparison</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Feature</th>
                <th className="text-center py-3 px-4">Free</th>
                <th className="text-center py-3 px-4">Basic</th>
                <th className="text-center py-3 px-4">Pro</th>
                <th className="text-center py-3 px-4">Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium">AI Model</td>
                <td className="text-center py-3 px-4">Basic</td>
                <td className="text-center py-3 px-4">Standard</td>
                <td className="text-center py-3 px-4">Gemini 1.5 Pro</td>
                <td className="text-center py-3 px-4">Gemini 1.5 Pro+</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium">Advertisements</td>
                <td className="text-center py-3 px-4">Visible</td>
                <td className="text-center py-3 px-4">Removed</td>
                <td className="text-center py-3 px-4">Removed</td>
                <td className="text-center py-3 px-4">Removed</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium">Explanations</td>
                <td className="text-center py-3 px-4">Basic</td>
                <td className="text-center py-3 px-4">Short</td>
                <td className="text-center py-3 px-4">Detailed</td>
                <td className="text-center py-3 px-4">Advanced + Visual</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium">Storage Limit</td>
                <td className="text-center py-3 px-4">10 MB</td>
                <td className="text-center py-3 px-4">25 MB</td>
                <td className="text-center py-3 px-4">25 MB</td>
                <td className="text-center py-3 px-4">50 MB</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium">Support</td>
                <td className="text-center py-3 px-4">Community</td>
                <td className="text-center py-3 px-4">Standard</td>
                <td className="text-center py-3 px-4">Priority</td>
                <td className="text-center py-3 px-4">Premium Chat</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Data Retention</td>
                <td className="text-center py-3 px-4">7 days</td>
                <td className="text-center py-3 px-4">14 days</td>
                <td className="text-center py-3 px-4">14 days</td>
                <td className="text-center py-3 px-4">28 days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2">What are AI tokens?</h3>
            <p className="text-sm text-muted-foreground">
              AI tokens represent the computational resources used to generate quizzes, explanations, and other AI-powered features. Each question, explanation, or AI interaction consumes tokens based on complexity.
            </p>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
            <p className="text-sm text-muted-foreground">
              Yes! You can upgrade your plan at any time. Downgrades take effect at the end of your current billing cycle to ensure you get the full value of your current plan.
            </p>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2">What happens if I exceed my limits?</h3>
            <p className="text-sm text-muted-foreground">
              If you reach your token or quiz limit, you'll be prompted to upgrade your plan. Your account won't be suspended, but you'll need to upgrade to continue using AI features.
            </p>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Is there a free trial?</h3>
            <p className="text-sm text-muted-foreground">
              Our Free plan is permanent and gives you access to core features. You can upgrade anytime to unlock advanced AI models and remove limitations.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mt-12 p-8 bg-primary/5 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6">
          Join thousands of students and educators using Quizzicallabzᴬᴵ to enhance their learning experience.
        </p>
        {!user ? (
          <div className="space-x-4">
            <Button asChild>
              <Link href="/signup">Sign Up Free</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        ) : (
          <Button onClick={() => handleUpgrade('pro')} disabled={upgrading === 'pro'}>
            {upgrading === 'pro' ? 'Processing...' : 'Upgrade to Pro'}
          </Button>
        )}
      </div>
    </div>
  );
}