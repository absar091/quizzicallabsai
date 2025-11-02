'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePlan } from '@/hooks/usePlan';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, Sparkles, Zap, Shield, Star, Crown, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'PKR',
    interval: 'forever',
    description: 'Perfect for getting started',
    features: [
      '10 AI-generated quizzes per day',
      'Basic quiz types',
      'Standard AI model',
      'Community support',
      'Basic study guides'
    ],
    limitations: [
      'Limited quiz generation',
      'Ads included',
      'Basic features only'
    ],
    icon: Star,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 2,
    currency: 'USD',
    interval: 'month',
    description: 'Best for serious students',
    popular: true,
    features: [
      'Unlimited AI-generated quizzes',
      'Advanced quiz types & formats',
      'Premium AI model (Gemini 2.5 Pro)',
      'Priority support',
      'Advanced study guides',
      'Detailed analytics',
      'Export to PDF',
      'Ad-free experience',
      'Quiz sharing',
      'Custom difficulty levels'
    ],
    icon: Sparkles,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  }
];

export default function PricingPage() {
  const { user } = useAuth();
  const { plan } = usePlan();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to upgrade your plan.',
        variant: 'destructive'
      });
      return;
    }

    if (plan === 'Pro') {
      toast({
        title: 'Already Pro!',
        description: 'You already have an active Pro subscription.',
      });
      return;
    }

    // For Whop integration, redirect to dedicated checkout page
    window.location.href = `/checkout/${planId}?email=${encodeURIComponent(user.email || '')}&name=${encodeURIComponent(user.displayName || '')}`;
  };

  return (
    <div className="container py-12 max-w-6xl mx-auto">
      <PageHeader 
        title="Choose Your Plan" 
        description="Unlock the full potential of AI-powered learning"
      />

      <div className="space-y-8 mt-8">
        {/* Current Plan Status */}
        {user && plan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {plan === 'Pro' ? (
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                        <Star className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">Current Plan: {plan}</h3>
                      <p className="text-sm text-muted-foreground">
                        {plan === 'Pro' ? 'You have access to all premium features' : 'Upgrade to unlock premium features'}
                      </p>
                    </div>
                  </div>
                  {plan === 'Pro' && (
                    <Badge className="bg-blue-500">
                      <Crown className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((planOption, index) => (
            <motion.div
              key={planOption.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <Card className={`relative overflow-hidden ${planOption.popular ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'}`}>
                {planOption.popular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-medium">
                    Most Popular
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className={`w-16 h-16 mx-auto rounded-full ${planOption.bgColor} flex items-center justify-center mb-4`}>
                    <planOption.icon className={`h-8 w-8 ${planOption.color}`} />
                  </div>
                  
                  <CardTitle className="text-2xl">{planOption.name}</CardTitle>
                  <CardDescription className="text-base">{planOption.description}</CardDescription>
                  
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold">
                        {planOption.price === 0 ? 'Free' : `$${planOption.price}`}
                      </span>
                      {planOption.price > 0 && (
                        <span className="text-muted-foreground">/{planOption.interval}</span>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {planOption.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations for free plan */}
                  {planOption.limitations && (
                    <div className="space-y-2 pt-4 border-t">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Limitations
                      </p>
                      {planOption.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-gray-400 text-xs">×</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-4">
                    {planOption.id === 'free' ? (
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    ) : user ? (
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleUpgrade(planOption.id)}
                        disabled={loading === planOption.id || plan === 'Pro'}
                      >
                        {loading === planOption.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : plan === 'Pro' ? (
                          'Current Plan'
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Upgrade to Pro
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                        <Link href="/login">
                          <Zap className="h-4 w-4 mr-2" />
                          Login to Upgrade
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">How does the payment work?</h4>
                <p className="text-sm text-muted-foreground">
                  We use Whop, a secure payment platform. You can pay with credit/debit cards and other payment methods from anywhere in the world.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Can I cancel anytime?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can cancel your subscription anytime from your billing page. You'll continue to have Pro access until the end of your billing period.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">What's included in Pro?</h4>
                <p className="text-sm text-muted-foreground">
                  Pro includes unlimited quiz generation, advanced AI model, priority support, detailed analytics, and an ad-free experience.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Is there a free trial?</h4>
                <p className="text-sm text-muted-foreground">
                  The Free plan gives you a taste of our features. You can upgrade to Pro anytime to unlock the full potential.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full text-green-700 text-sm">
            <Shield className="h-4 w-4" />
            Secure payments powered by Whop
          </div>
        </motion.div>
      </div>
    </div>
  );
}
