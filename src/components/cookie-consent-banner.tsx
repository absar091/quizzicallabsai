
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] p-4 flex justify-center">
      <Card className="max-w-lg w-full bg-background/80 backdrop-blur-sm border-2">
        <CardHeader>
          <CardTitle>We Value Your Privacy</CardTitle>
          <CardDescription>
            We use essential cookies to make our site work. For more information, please see our{' '}
            <Link href="/privacy-policy" className="underline text-primary">
              Privacy Policy
            </Link>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAccept} className="w-full">
            Accept All
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
