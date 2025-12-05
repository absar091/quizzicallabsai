
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
import { MobileOptimization } from "./mobile-optimization";
import { RecaptchaV3Provider } from "@/components/recaptcha-v3-provider";
import { GlobalErrorHandler } from "@/components/global-error-handler";

import { useAuth } from "@/hooks/useAuth";
import NotificationHandler from "./notification-handler";

const HelpBot = dynamic(() => import("./help-bot"), { 
  ssr: false,
  loading: () => null
});

function AppContent({ children }: { children: React.ReactNode }) {
    try {
        const { user, loading } = useAuth();
        const showHelpBot = !loading;

        return (
            <>
                {children}
                <Toaster />
                <CookieConsentBanner />
                <InstallPwaPrompt />
                <PWAInstallPrompt />
                <ServiceWorkerRegistration />
                <MobileOptimization />
                {showHelpBot && (
                     <div className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6">
                        <HelpBot />
                    </div>
                )}
                {user && <NotificationHandler />}
            </>
        );
    } catch {
        return <>{children}</>;
    }
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

  try {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <GlobalErrorHandler />
        <RecaptchaV3Provider>
          <AuthProvider>
            {isSplashLoading ? (
              <SplashScreen onAnimationComplete={handleAnimationComplete} />
            ) : (
              <AppContent>{children}</AppContent>
            )}
          </AuthProvider>
        </RecaptchaV3Provider>
      </ThemeProvider>
    );
  } catch {
    return <>{children}</>;
  }
}
