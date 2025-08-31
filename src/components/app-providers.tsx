
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import CookieConsentBanner from "@/components/cookie-consent-banner";
import { SplashScreen } from "@/components/splash-screen";
import InstallPwaPrompt from "./install-pwa-prompt";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const HelpBot = dynamic(() => import("./help-bot"), { ssr: false });

function AppContent({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();

    const showHelpBot = !loading && (!!user || ['/', '/login', '/signup', '/forgot-password'].includes(pathname));

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
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown) {
      setIsSplashLoading(false);
    }
  }, []);
  
  const handleAnimationComplete = () => {
    sessionStorage.setItem('splashShown', 'true');
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
