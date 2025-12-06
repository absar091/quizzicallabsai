// @ts-nocheck
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Brain, TrendingUp, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { MODEL_FEATURES } from '@/lib/gemini-config';

export function ModelUpgradeNotice() {
  const { user } = useAuth();
  const isPro = user?.plan === 'Pro' || user?.plan === 'Enterprise';

  if (isPro) {
    return (
      <Card className="border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-purple-900 dark:text-purple-100">
              Gemini 3 Enabled
            </CardTitle>
          </div>
          <CardDescription>
            You're using our most advanced AI model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {MODEL_FEATURES['gemini-2.0-flash-exp'].features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-dashed border-purple-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <Badge className="bg-purple-600">New</Badge>
            </div>
            <CardTitle>Upgrade to Gemini 3</CardTitle>
            <CardDescription>
              Get access to our most powerful AI model with Pro
            </CardDescription>
          </div>
          <Zap className="h-12 w-12 text-purple-600 opacity-20" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Current (Free)
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {MODEL_FEATURES['gemini-1.5-flash'].features.map((feature, i) => (
                <li key={i}>• {feature}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-purple-600">
              <TrendingUp className="h-4 w-4" />
              Gemini 3 (Pro)
            </h4>
            <ul className="space-y-1 text-sm">
              {MODEL_FEATURES['gemini-2.0-flash-exp'].features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Sparkles className="h-4 w-4 mr-2" />
            Upgrade to Pro - Get Gemini 3
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for quiz generation page
export function ModelBadge() {
  const { user } = useAuth();
  const isPro = user?.plan === 'Pro' || user?.plan === 'Enterprise';

  return (
    <Badge 
      variant={isPro ? 'default' : 'secondary'}
      className={isPro ? 'bg-purple-600' : ''}
    >
      <Sparkles className="h-3 w-3 mr-1" />
      {isPro ? 'Gemini 3' : 'Gemini 1.5'}
    </Badge>
  );
}
