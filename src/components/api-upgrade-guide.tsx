"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ExternalLink,
  CheckCircle,
  Clock,
  DollarSign,
  Zap,
  ArrowRight,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpgradeStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action?: () => void;
}

interface APIUpgradeGuideProps {
  onClose?: () => void;
  className?: string;
}

export default function APIUpgradeGuide({
  onClose,
  className
}: APIUpgradeGuideProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [upgradeSteps, setUpgradeSteps] = useState<UpgradeStep[]>([
    {
      id: 'google-ai-studio',
      title: 'Visit Google AI Studio',
      description: 'Go to Google AI Studio to upgrade your account',
      completed: false
    },
    {
      id: 'get-billing',
      title: 'Enable Billing',
      description: 'Set up billing information in Google Cloud Console',
      completed: false
    },
    {
      id: 'upgrade-api',
      title: 'Upgrade API Access',
      description: 'Enable paid tier for higher quotas and better limits',
      completed: false
    },
    {
      id: 'update-keys',
      title: 'Update API Keys',
      description: 'Generate new API keys with higher limits',
      completed: false
    }
  ]);

  const handleStepComplete = (stepId: string) => {
    setUpgradeSteps(prev =>
      prev.map(step =>
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
  };

  const openGoogleAIStudio = () => {
    window.open('https://aistudio.google.com/app/apikey', '_blank');
    handleStepComplete('google-ai-studio');
  };

  const openGoogleCloudConsole = () => {
    window.open('https://console.cloud.google.com/billing', '_blank');
    handleStepComplete('get-billing');
  };

  const openPricingPage = () => {
    window.open('https://ai.google.dev/pricing', '_blank');
    handleStepComplete('upgrade-api');
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText('YOUR_NEW_API_KEY_HERE');
    // In real implementation, this would copy the actual API key
  };

  const containe`rVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const plans = [
    {
      name: 'Free Tier',
      requests: '250/day',
      rateLimit: '60/minute',
      cost: '$0',
      features: ['Basic models', 'Standard support', 'Community access'],
      recommended: false
    },
    {
      name: 'Pay-as-you-go',
      requests: '2M/day',
      rateLimit: '300/minute',
      cost: '$0.00025/1K chars',
      features: ['All models', 'Priority support', 'Advanced features', 'Higher limits'],
      recommended: true
    },
    {
      name: 'Enterprise',
      requests: 'Custom',
      rateLimit: 'Custom',
      cost: 'Contact sales',
      features: ['Dedicated support', 'SLA guarantee', 'Custom models', 'On-premise options'],
      recommended: false
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn('w-full max-w-4xl', className)}
    >
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <DollarSign className="h-6 w-6" />
            Upgrade Your AI API Access
          </CardTitle>
          <p className="text-green-700">
            Get higher quotas, better rate limits, and access to advanced AI models
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current Limitations Alert */}
          <Alert className="border-orange-200 bg-orange-50">
            <AlertDescription>
              <strong>Current Issue:</strong> Your free tier quota (250 requests/day) has been exceeded.
              Upgrade to continue generating quizzes and using AI features.
            </AlertDescription>
          </Alert>

          {/* Pricing Comparison */}
          <div>
            <h3 className="font-semibold mb-4">Choose Your Plan</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {plans.map((plan, index) => (
                <Card
                  key={plan.name}
                  className={cn(
                    'relative',
                    plan.recommended && 'border-green-500 bg-green-50'
                  )}
                >
                  {plan.recommended && (
                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-600">
                      Recommended
                    </Badge>
                  )}
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="text-2xl font-bold text-green-600">
                      {plan.cost}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Daily Requests:</span>
                        <span className="font-medium">{plan.requests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rate Limit:</span>
                        <span className="font-medium">{plan.rateLimit}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    {plan.recommended && (
                      <Button
                        className="w-full mt-3"
                        onClick={openPricingPage}
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Upgrade Steps */}
          <div>
            <h3 className="font-semibold mb-4">Step-by-Step Upgrade Guide</h3>
            <Tabs defaultValue="google" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="google">Google AI Studio</TabsTrigger>
                <TabsTrigger value="openai">OpenAI (Alternative)</TabsTrigger>
              </TabsList>

              <TabsContent value="google" className="space-y-4">
                <div className="space-y-3">
                  {upgradeSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border transition-colors',
                        step.completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      )}
                    >
                      <div className={cn(
                        'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
                        step.completed
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-300 text-gray-700'
                      )}>
                        {step.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-medium">{step.title}</h4>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>

                      {!step.completed && (
                        <Button
                          size="sm"
                          onClick={
                            step.id === 'google-ai-studio' ? openGoogleAIStudio :
                            step.id === 'get-billing' ? openGoogleCloudConsole :
                            step.id === 'upgrade-api' ? openPricingPage :
                            undefined
                          }
                        >
                          {step.id === 'update-keys' ? 'Update' : 'Open'}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* API Key Section */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-800">Update Your API Key</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-blue-700">
                      After upgrading, generate a new API key and replace it in your environment variables.
                    </p>

                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value="YOUR_NEW_API_KEY_HERE"
                          readOnly
                          className="w-full p-2 text-sm border rounded bg-white"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-6 w-6 p-0"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                      <Button size="sm" onClick={copyApiKey}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>

                    <Alert className="border-blue-200 bg-blue-100">
                      <AlertDescription className="text-xs">
                        <strong>Environment Variable:</strong> Update <code>GOOGLE_AI_API_KEY</code> in your .env file
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="openai" className="space-y-4">
                <div className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertDescription>
                      <strong>Alternative Option:</strong> OpenAI provides excellent AI models with different pricing tiers.
                      You can use GPT models as a fallback or replacement for Google Gemini.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">OpenAI Setup Steps</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">OpenAI Platform</a></li>
                          <li>Create a new API key</li>
                          <li>Add billing information</li>
                          <li>Update your .env file with <code>OPENAI_API_KEY</code></li>
                          <li>Test the integration</li>
                        </ol>
                      </CardContent>
                    </Card>

                    <div className="text-center">
                      <Button onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}>
                        Go to OpenAI Platform
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Benefits Summary */}
          <div className="bg-green-100 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Benefits After Upgrade:</h4>
            <div className="grid gap-2 md:grid-cols-2 text-sm text-green-700">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Up to 2M requests per day
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Higher rate limits (300/min)
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Access to advanced models
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Priority support
              </div>
            </div>
          </div>

          {/* Close Button */}
          {onClose && (
            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={onClose}>
                Close Guide
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
