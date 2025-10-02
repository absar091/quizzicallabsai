'use client';

import { useAuth } from '@/hooks/useAuth';
import { shouldShowAds } from '@/lib/plan-restrictions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, X } from 'lucide-react';
import { useState } from 'react';

interface AdBannerProps {
  position?: 'top' | 'bottom' | 'sidebar';
  className?: string;
  showDuringGeneration?: boolean;
}

export function AdBanner({ position = 'bottom', className = '', showDuringGeneration = false }: AdBannerProps) {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);

  if (!user || !shouldShowAds(user.plan) || !isVisible) {
    return null;
  }

  const handleUpgrade = () => {
    // Navigate to upgrade page
    window.location.href = '/profile';
  };

  return (
    <Card className={`relative bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 ${className}`}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Crown className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Upgrade to Pro</h3>
            <p className="text-sm text-gray-600">
              Remove ads, get unlimited bookmarks, and access premium AI features
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleUpgrade} size="sm" className="bg-blue-600 hover:bg-blue-700">
            Upgrade Now
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function SidebarAd() {
  return (
    <AdBanner 
      position="sidebar" 
      className="mx-4 mb-4"
      showDuringGeneration={true}
    />
  );
}

export function TopAd({ showDuringGeneration = false }: { showDuringGeneration?: boolean }) {
  return (
    <AdBanner 
      position="top" 
      className="mb-4"
      showDuringGeneration={showDuringGeneration}
    />
  );
}

export function BottomAd({ showDuringGeneration = false }: { showDuringGeneration?: boolean }) {
  return (
    <AdBanner 
      position="bottom" 
      className="mt-4"
      showDuringGeneration={showDuringGeneration}
    />
  );
}

export function GenerationAd() {
  return (
    <AdBanner 
      position="bottom" 
      className="mt-6"
      showDuringGeneration={true}
    />
  );
}