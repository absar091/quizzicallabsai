
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import CookieConsentBanner from "@/components/cookie-consent-banner";
import { SplashScreen } from "@/components/splash-screen";
import InstallPwaPrompt from "./install-pwa-prompt";
import { PWAInstallPrompt } from "./pwa-install-prompt";
import { ServiceWorkerRegistration } from "./service-worker-registration";

import { useAuth } from "@/hooks/useAuth";
import NotificationHandler from "./notification-handler";

const HelpBot = dynamic(() => import("./help-bot"), { 
  ssr: false,
  loading: () => null
});

function AppContent({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    const showHelpBot = !loading; // Show for all users, logged in or not

    return (
        <>
            {children}
            <Toaster />
            <CookieConsentBanner />
            <InstallPwaPrompt />
            {showHelpBot && (
                 <div className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6">
                    <HelpBot />
                </div>
            )}
            {user && <NotificationHandler />}
        </>
    );
}

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSplashLoading, setIsSplashLoading] = useState(true);

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      const splashShown = sessionStorage.getItem('splashShown');
      if (splashShown) {
        setIsSplashLoading(false);
      } else {
          const timer = setTimeout(() => {
              handleAnimationComplete();
          }, 3000); // Failsafe timer
          return () => clearTimeout(timer);
      }
    } else {
      // On server side, don't show splash
      setIsSplashLoading(false);
    }
  }, []);
  
  const handleAnimationComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('splashShown', 'true');
    }
    setIsSplashLoading(false);
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        {isSplashLoading ? (
          <SplashScreen onAnimationComplete={handleAnimationComplete} />
        ) : (
          <AppContent>{children}</AppContent>
        )}
      </AuthProvider>
    </ThemeProvider>
  );
}
